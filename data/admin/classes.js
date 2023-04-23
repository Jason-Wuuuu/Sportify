import { classes } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const create = async (
  title,
  sport,
  sportPlace,
  capacity,
  instructor,
  date,
  startTime,
  endTime
) => {
  // validation

  let newClass = {
    title: title,
    sport: sport,
    sportPlace: sportPlace,
    capacity: capacity,
    instructor: instructor,
    date: date,
    startTime: startTime,
    endTime: endTime,
    rating: 0,
    students: [],
  };

  const classCollection = await classes();
  const newInsertInformation = await classCollection.insertOne(newClass);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedClass: true };
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
  date,
  startTime,
  endTime
) => {
  // validation
  classID = validation.checkId(classID);
  title = validation.checkString(title, "title");
  sport = validation.checkString(sport, "sport");
  sportPlace = validation.checkString(sportPlace, "sportPlace");
  capacity = validation.checkString(capacity, "capacity");
  instructor = validation.checkString(instructor, "instructor");
  date = validation.checkString(date, "date");
  startTime = validation.checkString(startTime, "startTime");
  endTime = validation.checkString(endTime, "endTime");

  const classUpdateInfo = {
    title: title,
    sport: sport,
    sportPlace: sportPlace,
    capacity: capacity,
    instructor: instructor,
    date: date,
    startTime: startTime,
    endTime: endTime,
  };

  const classCollection = await classes();
  const updatedInfo = await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $set: classUpdateInfo },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw `Error: no class exists with an id of ${classID}.`;
  }
  return { updatedClass: true };
};

//

const getAllUsers = async () => {};

const getAllInstructors = async () => {};

const removeUser = async (userID) => {};

export { create, getAll, get, remove, update };
