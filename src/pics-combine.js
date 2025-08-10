// imageProcessor.js
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { checkBothPathsExist, getPicArray, getGroupObj, saveImage } from "./util.js";
import { defineCombinedFormat } from "./pics-format.js";
import { createComposition } from "./canvasRenderer.js";

export const runCombinePics = async (inputPath, outputPath) => {
  console.log(`\nScanning directory: ${inputPath}`);

  // Validate directories exist
  await checkBothPathsExist(inputPath, outputPath);

  // Get and group image files
  const picArray = await getPicArray(inputPath);
  const groupObj = await getGroupObj(picArray);

  // Process each group
  for (const [groupName, picArray] of Object.entries(groupObj)) {
    if (!picArray || !picArray.length) continue;

    await processImageGroup(groupName, picArray, inputPath, outputPath);
    console.log(""); // Empty line for readability
  }
};

export const processImageGroup = async (groupName, picArray, inputPath, outputPath) => {
  const compositions = await defineCombinedFormat(groupName, picArray);

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
