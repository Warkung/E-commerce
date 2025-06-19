const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { readdirSync } = require("fs");
const app = express();
const port = 8080;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
