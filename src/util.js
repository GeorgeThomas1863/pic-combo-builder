// fileUtils.js
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import CONFIG from "../config/config.js";

export const checkBothPathsExist = async (inputPath, outputPath) => {
  if (!fs.existsSync(inputPath)) {
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

export const getPicArray = async (inputPath) => {
  const { picExtensions } = CONFIG;
  const fileArray = await fsPromises.readdir(inputPath);

  const picArray = [];
  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    if (!picExtensions.test(file)) continue;
    picArray.push(file);
  }
  return picArray;
};

export const getGroupObj = async (picArray) => {
  if (!picArray || !picArray.length) return null;
  const groupObj = {};

  for (const file of picArray) {
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

//seems way too complicated, fix
export const getRandomPics = async (picArray, totalImages) => {
  if (totalImages >= picArray.length) return [...picArray];

  const shuffled = [...picArray];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count).sort((a, b) => {
    const numA = parseInt(a.split("_")[1]) || 0;
    const numB = parseInt(b.split("_")[1]) || 0;
    return numA - numB;
  });
};

export function saveImage(buffer, outputPath) {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Saved composition to: ${outputPath}`);
}
