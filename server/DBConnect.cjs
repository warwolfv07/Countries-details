const { MongoClient } = require("mongodb");

const password = "warwolfv07";
//const dbConnectionURI =  "mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true";
const dbConnectionURI = `mongo --ssl --host docdb-2022-12-13-23-29-17.cluster-c4nyyvqcb1ro.ap-south-1.docdb.amazonaws.com:27017 --sslCAFile rds-combined-ca-bundle.pem --username warwolfv07 --password ${password}`;

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
  const client = new MongoClient(dbConnectionURI);
  //const client = new MongoClient(dbConnectionURI, {tlsCAFile: `rds-combined-ca-bundle.pem`,});
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
