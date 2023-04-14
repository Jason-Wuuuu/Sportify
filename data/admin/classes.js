import { classes } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

//
const create = async (
  title,
  sportID,
  sportPlaceID,
  capacity,
  instructor,
  time
  // users: list of userIDs
) => {
  let newClass = {
    title: title,
    sportID: sportID,
    sportPlaceID: sportPlaceID,
    capacity: capacity,
    instructor: instructor,
    time: time,
  };

  const classCollection = await classes();
  const newInsertInformation = await classCollection.insertOne(newClass);
  const newId = newInsertInformation.insertedId;
  return await get(newId.toString());
};

const getAll = async () => {};

const get = async (classID) => {
  classID = validation.checkId(classID);
  const classCollection = await classes();
  const foundClass = await classCollection.findOne({
    _id: new ObjectId(classID),
  });
  if (!foundClass) throw "Error: Class not found";
  return foundClass;
};

const remove = async (classID) => {};

const update = async (
  classID,
  title,
  sportID,
  sportPlaceID,
  capacity,
  instructor,
  time
) => {};

//

const getAllUsers = async () => {};

const getAllInstructors = async () => {};

const removeUser = async (userID) => {};

export { create, getAll, get };
