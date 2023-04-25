import { sports } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

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
