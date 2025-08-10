// imageProcessor.js
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { checkBothPathsExist, getGroupName, sortPicsByNumber, saveImage } from "./util.js";
import { planCompositions } from "./compositionStrategy.js";
import { createComposition } from "./canvasRenderer.js";

export const runCombinePics = async (inputPath, outputPath) => {
  console.log(`\nScanning directory: ${inputPath}`);

  // Validate directories exist
  await checkBothPathsExist(inputPath, outputPath);

  // Get and group image files
  const picArray = await getPicArray(inputPath);
  const groupObj = await getGroupObj(picArray);

  //!!HERE!!!!

  // Process each group
  for (const [groupName, images] of Object.entries(imageGroups)) {
    if (images.length === 0) continue;

    await processImageGroup(groupName, images, inputDir, outputDir);
    console.log(""); // Empty line for readability
  }
};

export const getPicArray = async (inputPath) => {
  const fileArray = await fsPromises.readdir(inputPath);

  const picArray = [];
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    if (!picExtensions.test(file)) continue;
    picArray.push(file);
  }
  return picArray;
};

export const getGroupObj = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  const groupObj = {};

  for (const file of inputArray) {
    const groupName = await getGroupName(file);

    if (!groupObj[groupName]) {
      groupObj[groupName] = [];
    }

    groupObj[groupName].push(file);
  }

  // Sort images within each group
  for (const groupName of Object.keys(groupObj)) {
    groupObj[groupName] = await sortPicsByNumber(groupObj[groupName]);
  }

  console.log(`Found ${Object.keys(groupObj).length} groups of related images\n`);

  return groupObj;
};

async function processImageGroup(groupName, images, inputDir, outputDir) {
  const compositions = planCompositions(groupName, images);

  for (const composition of compositions) {
    await createAndSaveComposition(composition, inputDir, outputDir);
  }
}

async function createAndSaveComposition({ name, images }, inputDir, outputDir) {
  try {
    const buffer = await createComposition(images, name, inputDir);
    const outputPath = path.join(outputDir, `${name}.png`);

    saveImage(buffer, outputPath);
  } catch (error) {
    console.error(`Error creating composition ${name}:`, error.message);
  }
}
