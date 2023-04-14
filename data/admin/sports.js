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
  return await get(newId.toString());
};

const getAll = async () => {};

const get = async (sportID) => {
  sportID = validation.checkId(sportID);
  const sportCollection = await sports();
  const sport = await sportCollection.findOne({ _id: new ObjectId(sportID) });
  if (!sport) throw "Error: Sport not found";
  return sport;
};

const remove = async (sportID) => {};

const update = async (sportID, name) => {};

export { create, getAll, get };
