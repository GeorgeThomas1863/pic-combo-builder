import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

import { getPicArray, getGroupObj } from "./util.js";
import { getComboArray } from "./pics-format.js";
import { runCanvas } from "./pics-canvas.js";
import state from "./state.js";

export const runCombinePics = async (inputPath, outputPath, delimiter) => {
  if (!state.active) return null;

  console.log(`\nScanning directory: ${inputPath}`);

  if (!fs.existsSync(inputPath)) throw new Error(`Input directory does not exist: ${inputPath}`);
  await fsPromises.mkdir(outputPath, { recursive: true });

  // Get and group image files
  const picArray = await getPicArray(inputPath);
  const groupObj = await getGroupObj(picArray, delimiter);

  if (!groupObj) throw new Error("No image groups found in input directory.");

  // Process each group
  for (const [groupName, picArray] of Object.entries(groupObj)) {
    if (!state.active) return null;
    if (!picArray || !picArray.length) continue;

    await processImageGroup(groupName, picArray, inputPath, outputPath, delimiter);
    console.log(""); // Empty line for readability
  }
};

export const processImageGroup = async (groupName, picArray, inputPath, outputPath, delimiter) => {
  if (!state.active) return null;

  const comboArray = await getComboArray(groupName, picArray, delimiter);
  if (!comboArray || !comboArray.length) return null;

  for (const comboItem of comboArray) {
    await createAndSaveComposition(comboItem, inputPath, outputPath);
  }
};

//async function createAndSaveComposition({ name, images }, inputDir, outputDir) {
export const createAndSaveComposition = async (comboItem, inputPath, outputPath) => {
  if (!state.active) return null;

  const { name, comboPics } = comboItem;
  console.log(`[createAndSaveComposition] starting "${name}" | pics: ${comboPics.length} | inputPath: "${inputPath}" | outputPath: "${outputPath}"`);

  try {
    const buffer = await runCanvas(comboPics, name, inputPath);
    console.log(`[createAndSaveComposition] canvas buffer received: ${buffer ? buffer.length + " bytes" : "NULL"}`);
    const savePath = path.join(outputPath, `${name}.png`);
    await saveImage(buffer, savePath);
  } catch (e) {
    console.error(`[createAndSaveComposition] ERROR for "${name}":`, e.message);
    console.error(e.stack);
  }
};

export const saveImage = async (buffer, outputPath) => {
  if (!state.active) return null;

  const saveData = await fsPromises.writeFile(outputPath, buffer);
  console.log(`Saved composition to: ${outputPath}`);

  return saveData;
};
