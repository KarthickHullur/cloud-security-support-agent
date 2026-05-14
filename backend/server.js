require("dotenv").config();

const express = require("express");

const cors = require("cors");

const iamRoutes = require("./routes/iamRoutes");

const terraformRoutes = require("./routes/terraformRoutes");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/iam", iamRoutes);

app.use("/api/terraform", terraformRoutes);

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {

  res.send("Cloud Security Support Agent API Running");

});

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});