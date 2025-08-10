import CONFIG from "../config/config.js";
import { getRandomPics } from "./util.js";

export const defineCombinedFormat = async (groupName, picArray) => {
  if (!groupName || !picArray || !picArray.length) return null;

  const picCount = picArray.length;
  console.log(`Processing group: ${groupName} with ${picCount} images`);

  const combineObj = await getCombineObjType(picCount);
  const picsToUse = combineObj.useRandom ? await getRandomPics(picArray, combineObj.totalImages) : picArray;

  return await createCompositionsFromImages(groupName, picsToUse, combineObj.compositionCount);
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
