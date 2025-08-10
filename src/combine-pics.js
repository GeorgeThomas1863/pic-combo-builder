import CONFIG from "../config/config.js";
import path from "path";
import { checkBothPathsExist, getPicArray, getGroupObj, saveImage } from "./util.js";
import { getComboArray } from "./pics-format.js";
import { runCanvas } from "./pics-canvas.js";

export const main = async () => {
  const { inputPath, outputPath } = CONFIG;

  try {
    console.log("Starting image composition process...");

    const picData = await runCombinePics(inputPath, outputPath);
    console.log(picData);

    console.log("\nImage compositions completed successfully!");
  } catch (e) {
    console.error("\nError creating compositions:", e.message);
    process.exit(1);
  }
};

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
  const comboArray = await getComboArray(groupName, picArray);

  for (const comboItem of comboArray) {
    await createAndSaveComposition(comboItem, inputPath, outputPath);
  }
};

//async function createAndSaveComposition({ name, images }, inputDir, outputDir) {
export const createAndSaveComposition = async (comboItem, inputPath, outputPath) => {
  const { name, comboPics } = comboItem;

  try {
    const buffer = await runCanvas(comboPics, name, inputPath);
    const savePath = path.join(outputPath, `${name}.png`);

    saveImage(buffer, savePath);
  } catch (e) {
    console.error(`Error creating composition ${name}:`, e.message);
  }
};

main();
