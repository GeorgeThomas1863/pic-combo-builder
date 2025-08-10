import CONFIG from "./config.js";
import { runCombinePics } from "./src/pics-combine.js";

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

main();
