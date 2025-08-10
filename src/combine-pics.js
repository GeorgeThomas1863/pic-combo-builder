import fsPromises from "fs/promises";
import path from "path";

import { checkBothPathsExist, getPicArray, getGroupObj } from "./util.js";
import { getComboArray } from "./pics-format.js";
import { runCanvas } from "./pics-canvas.js";
import state from "./state.js";

export const runCombinePics = async (inputPath, outputPath) => {
  if (!state.active) return null;

  console.log(`\nScanning directory: ${inputPath}`);

  // Validate directories exist
  const testData = await checkBothPathsExist(inputPath, outputPath);
  console.log("TEST DATA");
  console.log(testData);

  // Get and group image files
  const picArray = await getPicArray(inputPath);
  const groupObj = await getGroupObj(picArray);

  // Process each group
  for (const [groupName, picArray] of Object.entries(groupObj)) {
    if (!state.active) return null;
    if (!picArray || !picArray.length) continue;

    await processImageGroup(groupName, picArray, inputPath, outputPath);
    console.log(""); // Empty line for readability
  }
};

export const processImageGroup = async (groupName, picArray, inputPath, outputPath) => {
  if (!state.active) return null;

  const comboArray = await getComboArray(groupName, picArray);

  for (const comboItem of comboArray) {
    await createAndSaveComposition(comboItem, inputPath, outputPath);
  }
};

//async function createAndSaveComposition({ name, images }, inputDir, outputDir) {
export const createAndSaveComposition = async (comboItem, inputPath, outputPath) => {
  if (!state.active) return null;

  const { name, comboPics } = comboItem;

  try {
    const buffer = await runCanvas(comboPics, name, inputPath);
    const savePath = path.join(outputPath, `${name}.png`);

    const saveData = await saveImage(buffer, savePath);
    console.log("SAVE DATA");
    console.log(saveData);
  } catch (e) {
    console.error(`Error creating composition ${name}:`, e.message);
  }
};

export const saveImage = async (buffer, outputPath) => {
  if (!state.active) return null;

  const saveData = await fsPromises.writeFile(outputPath, buffer);
  console.log(`Saved composition to: ${outputPath}`);

  return saveData;
};
