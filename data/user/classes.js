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
  if(classObj.capacity <= 0)
    return { reserved: false, msg: "No seat avail   ble" }; 
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },   
    { $push: { students: userID } },
    { returnDocument: "after" }
  );    
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },   
    { $set: { capacity: classObj.capacity-1 } },
    { returnDocument: "after" }
  );
  return { reserved: true, msg: "Sucessfully reserved" };
};

const quit = async (classID, userID) => {};

const rate = async (classID, userID, rate) => {};

const getClass = async (classID) => {
  classID = helperMethodsForClasses.checkId(classID, "classID");
  const classCollection = await classes();
  const classData = await classCollection.findOne({ _id: new ObjectId(classID) });
  if (!classData)
  throw `Error: Could not find a class with id of ${classID}`;
  return classData;
};

const getAllClasses = async () => {};

const getAllStudents = async (classID) => {};

const getClassesBySport = async (sportID) => {
  sportID = helperMethodsForClasses.checkId(sportID, "sportID");
  const classCollection = await classes();
  const classesBySport = await classCollection.find({ sportID: sportID }).toArray();
  return classesBySport;
};    

const getClassesByUserID = async (userID) => {
  userID = helperMethodsForUsers.checkId(userID, "userID");
  const classCollection = await classes();
  const allClasses = await classCollection.find({}).toArray();
  return allClasses.filter(obj => obj.students.includes(userID));
};   

const getClassesBySportPlace = async (sportPlaceID) => {};

const getClassesByInstructor = async (instructor) => {};

const getClassesByTime = async (time) => {};

const getAvailableClasses = async () => {}; // classes that the capacity is not full

const removeStudent = async (classID, userID) => {
  classID = helperMethodsForClasses.checkId(classID, "classID");
  userID = helperMethodsForUsers.checkId(userID, "userID");
  const classCollection = await classes();
  const updatedClass = await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $pull: { students: { $in: [ userID ] } } }
  );  
}

export {reserve, getClassesBySport, getClassesByUserID, getClass, removeStudent};