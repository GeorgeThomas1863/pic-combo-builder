import d from "./define-things.js";
import { sendToBack } from "./api-front.js";

export const submitHandler = async (e) => {
    e.preventDefault();

    const params = {
        inputPath: d.inputPathElement.value,
        outputPath: d.outputPathElement.value,
        route: "/get-backend-data",
    }
    
    const data = await sendToBack(params);
    console.log(data);
}

d.submitButton.addEventListener("click", submitHandler);