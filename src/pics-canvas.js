import { createCanvas, loadImage } from "canvas";
import path from "path";
import CONFIG from "../config/config.js";

export const runCanvas = async (picArray, picName, inputPath) => {
  if (!picArray || !picArray.length) return null;
  const { width, padding, gridColumns, gridRows, titleHeight, maxImages } = CONFIG.canvas;

  const filenames = picArray.slice(0, Math.min(picArray.length, maxImages));

  // Pre-load all images to compute this composition's average aspect ratio
  const images = [];
  for (const filename of filenames) {
    try {
      images.push(await loadImage(path.join(inputPath, filename)));
    } catch (e) {
      console.error(`Error loading image ${filename}:`, e.message);
    }
  }

  if (!images.length) return null;

  const avgAspectRatio = images.reduce((sum, img) => sum + img.width / img.height, 0) / images.length;
  const cellWidth = (width - padding) / gridColumns;
  const cellHeight = Math.round(cellWidth / avgAspectRatio);
  const canvasHeight = cellHeight * gridRows;

  console.log(`Creating composition: ${picName}.png | avgAspectRatio: ${avgAspectRatio.toFixed(2)} | cellHeight: ${cellHeight}px | canvasHeight: ${canvasHeight}px`);

  const canvas = createCanvasWithBackground(canvasHeight);
  const ctx = canvas.getContext("2d");

  drawTitle(ctx, picName);

  for (let i = 0; i < images.length; i++) {
    drawImageAtPosition(ctx, images[i], i, cellHeight);
  }

  return canvas.toBuffer("image/png");
};

export const createCanvasWithBackground = (canvasHeight) => {
  const { width, titleHeight } = CONFIG.canvas;
  const totalHeight = canvasHeight + titleHeight;

  const canvas = createCanvas(width, totalHeight);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, totalHeight);

  return canvas;
};

export const drawTitle = (ctx, picName) => {
  const { width } = CONFIG.canvas;

  ctx.fillStyle = "black";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${picName}.png`, width / 2, 20);
};

export const drawImageAtPosition = (ctx, image, position, cellHeight) => {
  const { row, col } = getGridPosition(position);

  const { x, y } = getCanvasPosition(row, col, cellHeight);
  const dimensionObj = getImageDimensions(image, cellHeight);

  ctx.drawImage(image, x + dimensionObj.offsetX, y + dimensionObj.offsetY, dimensionObj.imageWidth, dimensionObj.imageHeight);
};

export const getGridPosition = (position) => {
  const { gridColumns } = CONFIG.canvas;

  return {
    row: Math.floor(position / gridColumns),
    col: position % gridColumns,
  };
};

export const getCanvasPosition = (row, col, cellHeight) => {
  const { width, padding, gridColumns, titleHeight } = CONFIG.canvas;

  const cellWidth = (width - padding) / gridColumns;

  return {
    x: col * (cellWidth + padding) + padding,
    y: row * (cellHeight + padding) + padding + titleHeight,
  };
};

export const getImageDimensions = (image, cellHeight) => {
  const { width, padding, gridColumns } = CONFIG.canvas;

  const maxImageWidth = (width - padding) / gridColumns;
  const maxImageHeight = cellHeight;

  const aspectRatio = image.width / image.height;
  let imageWidth = maxImageWidth;
  let imageHeight = maxImageHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (aspectRatio > maxImageWidth / maxImageHeight) {
    imageHeight = maxImageWidth / aspectRatio;
    offsetY = (maxImageHeight - imageHeight) / 2;
  } else {
    imageWidth = maxImageHeight * aspectRatio;
    offsetX = (maxImageWidth - imageWidth) / 2;
  }

  return { imageWidth, imageHeight, offsetX, offsetY };
};
