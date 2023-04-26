import { sports } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

//
const create = async (name) => {
  // validation
  name = validation.checkString(name, "name");

  let newSport = {
    name: name,
    thumbnail: "",
  };

  const sportCollection = await sports();
  const newInsertInformation = await sportCollection.insertOne(newSport);
  const newId = newInsertInformation.insertedId;
  const sport = await get(newId.toString());

  return { sportID: sport._id.toString(), insertedSport: true };
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
    throw `Error: Could not delete sport with id of ${sportID}`;

  return { deleted: true };
};

const update = async (sportID, name, thumbnail) => {
  // validation
  sportID = validation.checkId(sportID);
  name = validation.checkString(name, "name");

  const sportUpdateInfo = {
    name: name,
    thumbnail: thumbnail,
  };

  const sportCollection = await sports();
  const updateInfo = await sportCollection.findOneAndUpdate(
    { _id: new ObjectId(sportID) },
    { $set: sportUpdateInfo },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0)
    throw `Error: Update failed, could not find a sport with id of ${sportID}`;

  return { updatedSport: true };
};

export { create, getAll, get, remove, update };
