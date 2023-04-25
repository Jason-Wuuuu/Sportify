import { sports } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const create = async (name) => {
  name = validation.checkString(name, "name");

  let newSport = {
    name: name,
  };

  const sportCollection = await sports();
  const newInsertInformation = await sportCollection.insertOne(newSport);
  if (!newInsertInformation.acknowledged || !newInsertInformation.insertedId)
    throw "Could not add sport!";
  const newId = newInsertInformation.insertedId;

  let addedSport = await get(newId.toString());

  return { insertedSport: addedSport };
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
