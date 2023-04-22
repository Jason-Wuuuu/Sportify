import { sports } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

//
const create = async (name) => {
  let newSport = {
    name: name,
  };

  const sportCollection = await sports();
  const newInsertInformation = await sportCollection.insertOne(newSport);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedSport: true };
};

const getAll = async () => {
  const sportCollection = await sports();
  const sportList = await sportCollection.find({}).toArray();
  return sportList;
};

const get = async (sportID) => {
  sportID = validation.checkId(sportID);
  const sportCollection = await sports();
  const sport = await sportCollection.findOne({ _id: new ObjectId(sportID) });
  if (!sport) throw "Error: Sport not found";
  return sport;
};

const remove = async (sportID) => {
  sportID = validation.checkId(sportID);
  const sportCollection = await sports();
  const deletionInfo = await sportCollection.findOneAndDelete({
    _id: new ObjectId(sportID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw [404, `Error: Could not delete user with id of ${sportID}`];

  return { ...deletionInfo.value, deleted: true };
};

const update = async (sportID, name) => {
  sportID = validation.checkId(sportID);
  name = validation.checkString(name, "name");

  const sportUpdateInfo = {
    name: name,
  };
  const sportCollection = await sports();
  const updateInfo = await sportCollection.findOneAndUpdate(
    { _id: new ObjectId(sportID) },
    { $set: sportUpdateInfo },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0)
    throw [
      404,
      `Error: Update failed, could not find a user with id of ${sportID}`,
    ];

  return await updateInfo.value;
};

export { create, getAll, get, remove, update };
