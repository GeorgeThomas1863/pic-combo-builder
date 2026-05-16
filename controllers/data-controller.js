import { runCombinePics } from "../src/combine-pics.js";
import state from "../src/state.js";

export const getBackendDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;
    const { inputPath, outputPath, command, delimiter } = inputParams;

    if (command === "stop") {
      state.active = false;
      return res.json({ message: "STOPPED EXECUTION" });
    }

    state.active = true;

    console.log("INPUT PARAMS");
    console.log(inputParams);

    await runCombinePics(inputPath, outputPath, delimiter);

    state.active = false;

    console.log("DONE COMBINING PICS");

    return res.json({ message: "Done! Compositions saved." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get backend data" });
  }
};
