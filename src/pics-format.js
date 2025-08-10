import CONFIG from "../config/config.js";

export const getComboArray = async (groupName, picArray) => {
  if (!groupName || !picArray || !picArray.length) return null;

  const picCount = picArray.length;
  console.log(`Processing group: ${groupName} with ${picCount} images`);

  const combineObj = await getCombineObjType(picCount);
  if (!combineObj) return null;

  const picsToUse = await getPicsToUse(picArray, combineObj);
  if (!picsToUse) return null;

  const comboArray = await combinePicArray(groupName, picsToUse, combineObj.compositionCount);

  return comboArray;
};

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

  // console.log("Creating single composition");
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

export const getPicsToUse = async (picArray, combineObj) => {
  const { compositionCount, totalImages, useRandom } = combineObj;

  if (compositionCount === 1) {
    const singlePicArray = await getSingleComposition(picArray, totalImages);
    return singlePicArray;
  }

  if (useRandom) {
    const randomArray = await getRandomPics(picArray, totalImages);
    return randomArray;
  }

  // const picsToUse = combineObj.useRandom ? await getRandomPics(picArray, combineObj.totalImages) : picArray;
  return picArray;
};

export const getSingleComposition = async (picArray) => {
  if (!picArray || !picArray.length) return null;

  const singlePicArray = picArray.slice(-9);
  return singlePicArray;
};

//seems way too complicated, UNTESTED
export const getRandomPics = async (picArray, totalImages) => {
  if (!state.active) return null;
  if (!picArray || !picArray.length) return null;

  if (totalImages >= picArray.length) return [...picArray];

  const shuffled = [...picArray];

  for (let i = shuffled.length - 1; i > 0; i--) {
    if (!state.active) return null;
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count).sort((a, b) => {
    if (!state.active) return null;
    const numA = parseInt(a.split("_")[1]) || 0;
    const numB = parseInt(b.split("_")[1]) || 0;
    return numA - numB;
  });
};
