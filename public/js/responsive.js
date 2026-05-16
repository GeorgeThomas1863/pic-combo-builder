import d from "./define-things.js";
import { sendToBack } from "./api-front.js";

export const submitHandler = async (e) => {
  e.preventDefault();

  d.statusElement.textContent = "Processing...";

  const params = {
    inputPath: d.inputPathElement.value,
    outputPath: d.outputPathElement.value,
    delimiter: d.delimiterElement.value,
    route: "/get-backend-data",
  };

  const data = await sendToBack(params);
  d.statusElement.textContent = data?.error || data?.message || "Unknown response";
};

export const stopHandler = async (e) => {
  e.preventDefault();

  const params = {
    route: "/get-backend-data",
    command: "stop",
  };

  const data = await sendToBack(params);
  console.log(data);
};

d.submitButton.addEventListener("click", submitHandler);
d.stopButton.addEventListener("click", stopHandler);
