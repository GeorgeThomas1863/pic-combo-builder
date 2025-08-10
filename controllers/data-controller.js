import { runCombinePics } from "../src/combine-pics.js";

export const getBackendDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;
    const { inputPath, outputPath } = inputParams;

    console.log("INPUT PARAMS");
    console.log(inputParams);

    const data = await runCombinePics(inputPath, outputPath);

    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get backend data" });
  }
};
