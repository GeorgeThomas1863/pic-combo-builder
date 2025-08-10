import CONFIG from "../config/config.js";
import { getRandomPics } from "./util.js";

export const getComboArray = async (groupName, picArray) => {
  if (!groupName || !picArray || !picArray.length) return null;

  const picCount = picArray.length;
  console.log(`Processing group: ${groupName} with ${picCount} images`);

  const combineObj = await getCombineObjType(picCount);
  const picsToUse = combineObj.useRandom ? await getRandomPics(picArray, combineObj.totalImages) : picArray;

  const comboArray = await combinePicArray(groupName, picsToUse, combineObj.compositionCount);
  return comboArray;
};

//!!!HERE

export const getCombineObjType = async (picCount) => {
  const { typeArray } = CONFIG;

  for (const type of typeArray) {
    if (picCount > type.threshold) {
      console.log(type.message);
      const returnObj = {
        compositionCount: type.compositionCount,
        totalImages: type.totalImages,
        useRandom: type.useRandom,
      };
      return returnObj;
    }
  }

  console.log("Creating single composition");
  const returnObj = {
    compositionCount: 1,
    totalImages: picCount,
    useRandom: false,
  };
  return returnObj;
};

export const combinePicArray = async (groupName, picArray, picCount) => {
  if (!groupName || !picArray || !picArray.length) return null;
  const { maxImages } = CONFIG.canvas;
  const comboArray = [];
  const picsPerComp = Math.ceil(picArray.length / picCount);

  for (let i = 0; i < picCount; i++) {
    const startIndex = i * picsPerComp;
    const endIndex = Math.min(startIndex + maxImages, picArray.length);
    const comboPics = picArray.slice(startIndex, endIndex);

    if (comboPics.length === 0) break;

    const suffix = picCount === 1 ? "_comp" : `_comp${i + 1}`;

    comboArray.push({
      name: `${groupName}${suffix}`,
      comboPics: comboPics,
    });
  }

  return comboArray;
};
