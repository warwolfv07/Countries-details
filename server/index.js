//const { request, response } = require("express");
const { request, response } = require("express");
const express = require("express");
const dbQuery = require("./DBConnect.cjs");

const app = express();

app.listen(3000, () => console.log("listening at 3000"));

app.use(express.static("public"));

app.use(express.json({ limit: "1mb" }));

app.post("/api", async (request, response) => {
  const queryResults = await dbQuery(request.body);

  response.json({
    nameArray: queryResults.nameArray,
    totalDocs: queryResults.totalDocs,
  });
});

app.post("/full", async (request, response) => {
  const queryResults = await dbQuery(request.body);

  response.json({
    data: queryResults.dataObj,
  });
});
