import {
  instructor,
  sportPlaces,
  sports,
} from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const create = async (sportID, name) => {
  // validation
  sportID = validation.checkId(sportID, "sport");
  name = validation.checkString(name, "Name");

  const instructorCollection = await instructor();
  const checkname = await instructorCollection.findOne({
    sportID: sportID,
    name: name,
  });
  if (checkname) throw "Error: can not enter duplicate instructor.";

  // add
  let newInstructor = {
    sportID: sportID,
    name: name,
  };

  const newdata = await instructorCollection.insertOne(newInstructor);
  const newId = newdata.insertedId;
  // await get(newId.toString());

  return { insertedInstructor: true };
};


const createinstructorseed = async () => {

  // add valid sport to db  

  const sportCollection = await sports();
  const instructorCollection = await instructor();
  const list = await sportCollection.find({}).toArray();
  for (let i = 0; i < list.length; i++) {
    let newSport = {
      sportID: list[i]._id.toString(),
      name: 'Instructor' + (i + 1),
    };
    const newdata = await instructorCollection.insertOne(newSport);
  }
  // const newId = newInsertInformation.insertedId;
  // const sport = await get(newId.toString());

  return { insertedSport: true };
};


const getdetailsforclassSeed = async (ID) => {
  ID = validation.checkId(ID, "ID");
  const instructorCollection = await instructor();
  const instructors = await instructorCollection.findOne({ sportID: ID });
  if (!instructors) throw "Error: instructor can not be found";
  return instructors;
};

const get = async (ID) => {
  ID = validation.checkId(ID, "ID");
  const instructorCollection = await instructor();
  const instructors = await instructorCollection.findOne({
    _id: new ObjectId(ID),
  });
  if (!instructors) throw "Error: instructor can not be found";
  return instructors;
};

const getall = async () => {
  const instructorCollection = await instructor();
  const instructors = await instructorCollection.find({}).toArray();
  return instructors;
};

const update = async (instructorid, name, sportID) => {
  // validation
  instructorid = validation.checkId(instructorid, "instructorid");
  name = validation.checkString(name, "Name");
  sportID = validation.checkId(sportID, "SportID");

  const instructorInfo = {
    name: name,
    sportID: sportID,
  };

  const instructorCollection = await instructor();
  const updatedInfo = await instructorCollection.findOneAndUpdate(
    { _id: new ObjectId(instructorid) },
    { $set: instructorInfo },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw `Error: no instructor exists with an id of ${instructorid}.`;
  }
  return { updatedInstructor: true };
};

const remove = async (id) => {
  id = validation.checkId(id, "id");
  const instructorCollection = await instructor();
  const deletionInfo = await instructorCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete instructor with id of ${id}`;

  return { deleted: true };
};

export { create, get, getall, update, remove, createinstructorseed, getdetailsforclassSeed };
