// fileUtils.js
import fs from "fs";
import path from "path";
import { supportedExtensions } from "./config.js";

export const checkBothPathsExist = async (inputPath, outputPath) => {
  if (!fs.existsSync(inputDir)) {
    const error = new Error(`Input directory ${inputPath} does not exist`);
    error.value = inputPath;
    error.functionName = "checkBothPathsExist";
    throw error;
  }

  if (!fs.existsSync(outputPath)) {
    const error = new Error(`Output directory ${outputPath} does not exist`);
    error.value = outputPath;
    error.functionName = "checkBothPathsExist";
    throw error;
  }

  return true;
};

export const getGroupName = async (filename) => {
  const ext = path.extname(filename);
  const baseName = filename.slice(0, -ext.length);
  return baseName.substring(0, baseName.indexOf("_"));
};

export const sortPicsByNumber = async (inputArray) => {
  return inputArray.sort((a, b) => {
    const numA = parseInt(a.split("_")[1]);
    const numB = parseInt(b.split("_")[1]);
    return numA - numB;
  });
};

export function saveImage(buffer, outputPath) {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved composition to: ${outputPath}`);
}
