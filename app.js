import express from "express";

import CONFIG from "./config/config.js";
import routes from "./routes/routes.js";

const { displayPort } = CONFIG;

const app = express();

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//routes
app.use(routes);

// app.listen(1801);
app.listen(displayPort);
