import { classes } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import {helperMethodsForClasses,helperMethodsForUsers} from "./helpers.js";

const reserve = async (classID, userID) => {
  // add user to the student field (an array) in class collection
  classID = helperMethodsForClasses.checkId(classID, "classID");
  userID = helperMethodsForUsers.checkId(userID, "userID");
  const classCollection = await classes();
  const classObj = await classCollection.findOne({_id: new ObjectId(classID)});
  if(classObj.students.includes(userID)) 
    return { reserved: true, msg: "Already reserved" };
  const updateInfo = await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $push: { students: userID } },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0)  
    throw `Error: Update failed, could not find a class with id of ${classID}`;
  return { reserved: true, msg: "Sucessfully reserved" };
};

const quit = async (classID, userID) => {};

const rate = async (classID, userID, rate) => {};

const getClass = async (classID) => {};

const getAllClasses = async () => {};

const getAllStudents = async (classID) => {};

const getClassesBySport = async (sportID) => {
  sportID = helperMethodsForClasses.checkId(sportID, "sportID");
  const classCollection = await classes();
  const classesBySport = await classCollection.find({ sportID: sportID }).toArray();
  return classesBySport;
};    

const getClassesBySportPlace = async (sportPlaceID) => {};

const getClassesByInstructor = async (instructor) => {};

const getClassesByTime = async (time) => {};

const getAvailableClasses = async () => {}; // classes that the capacity is not full

export {reserve, getClassesBySport};