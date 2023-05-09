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
  title = validation.checkTitle(title, "Title");
  sportID = validation.checkId(sportID, "SportID");
  sportPlaceID = validation.checkId(sportPlaceID, "Sport PlaceID");
  capacity = validation.checkCapacity(capacity, "Capacity");
  instructor = validation.checkId(instructor, "Instructor");
  price = validation.checkPrice(price, "Price");
  date = validation.checkDate(date, "Date");
  startTime = validation.checkTime(startTime, "Start Time");
  endTime = validation.checkTime(endTime, "End Time");
  validation.checkTimeRange(startTime, endTime);

  // add valid class to db
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
    rating: null,
    students: [],
    ratingProvider: [],
  };

  const classCollection = await classes();
  const newInsertInformation = await classCollection.insertOne(newClass);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedClass: true };
};

const createdb = async (
  title,
  sportID,
  sportPlaceID,
  capacity,
  instructor,
  price,
  date,
  startTime,
  endTime,
  thumbnail,
  students
) => {
  // validation
  title = validation.checkTitle(title, "Title");
  sportID = validation.checkId(sportID, "SportID");
  sportPlaceID = validation.checkId(sportPlaceID, "Sport PlaceID");
  capacity = validation.checkCapacity(capacity, "Capacity");
  instructor = validation.checkId(instructor, "Instructor");
  price = validation.checkPrice(price, "Price");
  date = validation.checkDate(date, "Date");
  startTime = validation.checkTime(startTime, "Start Time");
  endTime = validation.checkTime(endTime, "End Time");
  validation.checkTimeRange(startTime, endTime);

  // add valid class to db
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
    thumbnail: thumbnail,
    rating: null,
    students: students,
    ratingProvider: [],
  };

  const classCollection = await classes();
  const newInsertInformation = await classCollection.insertOne(newClass);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedClass: true, classID: newId.toString() };
};

const getAll = async () => {
  const classCollection = await classes();
  const classList = await classCollection.find({}).toArray();
  return classList;
};

const get = async (classID) => {
  classID = validation.checkId(classID, "classID");
  const classCollection = await classes();
  const foundClass = await classCollection.findOne({
    _id: new ObjectId(classID),
  });
  if (!foundClass) throw "Error: Class not found";
  return foundClass;
};

const remove = async (classID) => {
  classID = validation.checkId(classID, "classID");
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
  title = validation.checkTitle(title, "Title");
  sportID = validation.checkId(sportID, "SportID");
  sportPlaceID = validation.checkId(sportPlaceID, "Sport PlaceID");
  capacity = validation.checkCapacity(capacity, "Capacity");
  instructor = validation.checkId(instructor, "Instructor");
  price = validation.checkPrice(price, "Price");
  date = validation.checkDate(date, "Date");
  startTime = validation.checkTime(startTime, "Start Time");
  endTime = validation.checkTime(endTime, "End Time");
  validation.checkTimeRange(startTime, endTime);

  if (thumbnail) thumbnail = validation.checkURL(thumbnail, "Thumbnail");

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

export { create, getAll, get, remove, update, createdb };
