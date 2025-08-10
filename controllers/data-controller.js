export const getBackendDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;
    console.log("INPUT PARAMS")
    console.log(inputParams);

    // const data = await runGetBackendData(inputParams);
    // return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get backend data" });
  }
};
