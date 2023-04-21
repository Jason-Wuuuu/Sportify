import { classes } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

//
const create = async (
  title,
  sport,
  sportPlace,
  capacity,
  instructor,
  time
  // users: list of userIDs
) => {
  let newClass = {
    title: title,
    sport: sport,
    sportPlace: sportPlace,
    capacity: capacity,
    instructor: instructor,
    time: time,
  };

  const classCollection = await classes();
  const newInsertInformation = await classCollection.insertOne(newClass);
  const newId = newInsertInformation.insertedId;
  return await get(newId.toString());
};

const getAll = async () => {
  const classCollection = await classes();
  const classList = await classCollection.find({}).toArray();
  return classList;
};

const get = async (classID) => {
  classID = validation.checkId(classID);
  const classCollection = await classes();
  const foundClass = await classCollection.findOne({
    _id: new ObjectId(classID),
  });
  if (!foundClass) throw "Error: Class not found";
  return foundClass;
};

const remove = async (classID) => {
  classID = validation.checkId(classID);
  const classCollection = await classes();
  const deletionInfo = await classCollection.findOneAndDelete({
    _id: new ObjectId(classID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw [404, `Error: Could not delete user with id of ${classID}`];

  return { ...deletionInfo.value, deleted: true };
};

const update = async (
  classID,
  title,
  sport,
  sportPlace,
  capacity,
  instructor,
  time
) => {};

//

const getAllUsers = async () => {};

const getAllInstructors = async () => {};

const removeUser = async (userID) => {};

export { create, getAll, get, remove, update };
