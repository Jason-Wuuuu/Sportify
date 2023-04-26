import { classes } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const create = async (
  title,
  sportID,
  sportPlaceID,
  capacity,
  instructor,
  price,
  date,
  startTime,
  endTime
) => {
  // validation
  title = validation.checkString(title, "Title");
  sportID = validation.checkId(sportID, "SportID");
  sportPlaceID = validation.checkId(sportPlaceID, "Sport PlaceID");
  capacity = validation.checkCapacity(capacity, "Capacity");
  instructor = validation.checkName(instructor, "Instructor");
  price = validation.checkPrice(price, "Price");
  date = validation.checkDate(date, "Date");
  startTime = validation.checkTime(startTime, "Start Time");
  endTime = validation.checkTime(endTime, "End Time");
  validation.checkTimeRange(startTime, endTime);

  let newClass = {
    title: title,
    sportID: sportID,
    sportPlaceID: sportPlaceID,
    capacity: capacity,
    instructor: instructor,
    price: price,
    date: date,
    startTime: startTime,
    endTime: endTime,
    thumbnail: "",
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
    throw `Error: Could not delete class with id of ${classID}`;

  return { deleted: true };
};

const update = async (
  classID,
  title,
  sportID,
  sportPlaceID,
  capacity,
  instructor,
  price,
  date,
  startTime,
  endTime,
  thumbnail
) => {
  // validation
  classID = validation.checkId(classID);
  title = validation.checkString(title, "Title");
  sportID = validation.checkString(sportID, "SportID");
  sportPlaceID = validation.checkString(sportPlaceID, "Sport PlaceID");
  capacity = validation.checkCapacity(capacity, "Capacity");
  instructor = validation.checkName(instructor, "Instructor");
  price = validation.checkPrice(price, "Price");
  date = validation.checkDate(date, "Date");
  startTime = validation.checkTime(startTime, "Start Time");
  endTime = validation.checkTime(endTime, "End Time");
  validation.checkTimeRange(startTime, endTime);

  const classUpdateInfo = {
    title: title,
    sportID: sportID,
    sportPlaceID: sportPlaceID,
    capacity: capacity,
    instructor: instructor,
    price: price,
    date: date,
    startTime: startTime,
    endTime: endTime,
    thumbnail: thumbnail,
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
