const { MongoClient } = require("mongodb");
const path = require("path");

const username = "warwolfv07";
const password = "warwolfv07";
const certFile = path.resolve(__dirname, "./rds-combined-ca-bundle.pem");
const dbConnectionURI = `mongodb://${username}:${password}@docdb-2022-12-13-23-29-17.cluster-c4nyyvqcb1ro.ap-south-1.docdb.amazonaws.com:27017/?replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
//const localreplicaDbURI = `mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true`;
const dbName = "database1";
const collection = "countries_data";

module.exports = async function dbQuery(searchObject) {
  let regex;
  const nameArray = [];

  if (searchObject.option == "starts_with") {
    regex = new RegExp("^" + searchObject.searchValue);
    const dataObj = await mongoConnect(regex);

    dataObj.queriedData.forEach((document) => {
      nameArray.push(document.name);
    });
    const totalDocs = dataObj.totalDocuments;
    return { nameArray, totalDocs };

    //queryDatabase()
  } else if (searchObject.option == "includes") {
    regex = new RegExp(searchObject.searchValue);
    const dataObj = await mongoConnect(regex);

    dataObj.queriedData.forEach((document) => {
      nameArray.push(document.name);
    });
    const totalDocs = dataObj.totalDocuments;
    return { nameArray, totalDocs };
  }
};

async function mongoConnect(regex) {
  const client = new MongoClient(dbConnectionURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsCAFile: certFile,
  });
  try {
    await client.connect();
    const queriedData = await client
      .db(dbName)
      .collection(collection)
      .find({ name: { $regex: regex, $options: "i" } })
      .toArray();

    const totalDocuments = await client
      .db(dbName)
      .collection(collection)
      .count({});

    return { queriedData, totalDocuments };
  } catch (e) {
    console.log("couldn't query");
    console.error(e);
  } finally {
    await client.close();
  }
}
