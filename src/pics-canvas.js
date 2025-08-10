// canvasRenderer.js
import { createCanvas, loadImage } from "canvas";
import path from "path";
import CONFIG from "../config/config.js";

export const runCanvas = async (picArray, picName, inputPath) => {
  if (!picArray || !picArray.length) return null;
  const { maxImages } = CONFIG.canvas;

  console.log(`Creating composition: ${picName}.png`);

  const canvas = createCanvasWithBackground();
  const ctx = canvas.getContext("2d");

  drawTitle(ctx, picName);

  const maxPicsCombo = Math.min(picArray.length, maxImages);

  const comboPathArray = [];
  for (let i = 0; i < maxPicsCombo; i++) {
    const comboPath = await drawImageAtPosition(ctx, picArray[i], i, inputPath);
    comboPathArray.push(comboPath);
  }

  return canvas.toBuffer("image/png");
};

export const createCanvasWithBackground = () => {
  const { width, height, titleHeight } = CONFIG.canvas;

  const canvas = createCanvas(width, height + titleHeight);
  const ctx = canvas.getContext("2d");

  // Fill background with white
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height + titleHeight);

  return canvas;
};

export const drawTitle = (ctx, picName) => {
  const { width } = CONFIG.canvas;

  ctx.fillStyle = "black";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${picName}.png`, width / 2, 20);
};

export const drawImageAtPosition = async (ctx, picName, position, inputPath) => {
  const { row, col } = getGridPosition(position);

  console.log(`Processing image ${position + 1}: ${picName}`);

  try {
    const imagePath = path.join(inputPath, picName);
    const image = await loadImage(imagePath);

    const { x, y } = getCanvasPosition(row, col);
    const dimensionObj = getImageDimensions(image);

    ctx.drawImage(image, x + dimensionObj.offsetX, y + dimensionObj.offsetY, dimensionObj.imageWidth, dimensionObj.imageHeight);

    return imagePath;
  } catch (e) {
    console.error(`Error loading image ${picName}:`, e.message);
  }
};

export const getGridPosition = (position) => {
  const { gridColumns } = CONFIG.canvas;

  const positionObj = {
    row: Math.floor(position / gridColumns),
    col: position % gridColumns,
  };

  return positionObj;
};

export const getCanvasPosition = (row, col) => {
  const { width, height, padding, gridColumns, titleHeight } = CONFIG.canvas;

  const picWidth = (width - padding) / gridColumns;
  const picHeight = (height - padding) / gridColumns;

  const positionObj = {
    x: col * (picWidth + padding) + padding,
    y: row * (picHeight + padding) + padding + titleHeight,
  };

  return positionObj;
};

export const getImageDimensions = (image) => {
  const { width, height, padding, gridColumns } = CONFIG.canvas;

  const maxImageWidth = (width - padding) / gridColumns;
  const maxImageHeight = (height - padding) / gridColumns;

  const aspectRatio = image.width / image.height;
  let imageWidth = maxImageWidth;
  let imageHeight = maxImageHeight;
  let offsetX = 0;
  let offsetY = 0;

  if (aspectRatio > maxImageWidth / maxImageHeight) {
    // Image is wider than the slot
    imageHeight = maxImageWidth / aspectRatio;
    offsetY = (maxImageHeight - height) / 2;
  } else {
    // Image is taller than the slot
    imageWidth = maxImageHeight * aspectRatio;
    offsetX = (maxImageWidth - width) / 2;
  }

  const returnObj = {
    imageWidth: imageWidth,
    imageHeight: imageHeight,
    offsetX: offsetX,
    offsetY: offsetY,
  };

  return returnObj;
};
