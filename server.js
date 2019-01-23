import express from "express";
import cors from "cors";

import messages from "./app/messages";

const app = express();
const port = 3333;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use("/messages", messages);

app.listen(port, () => console.log("server start at " + port));
