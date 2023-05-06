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

const quit = async (classID, userID) => {
  classID = helperMethodsForClasses.checkId(classID, "classID");
  userID = helperMethodsForUsers.checkId(userID, "userID");
  const classCollection = await classes();
  const updatedClass = await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $pull: { students: { $in: [ userID ] } } }
  );
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },   
    { $set: { capacity: updatedClass.value.capacity+1 } }
  );  
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $pull:  { ratingProvider: { userID: userID } }  }
  );
  const classObj = await classCollection.findOne({ _id: new ObjectId(classID) });
  let ratingProvider = classObj.ratingProvider;
  let n = ratingProvider.length;
  let newRating = (n > 0) ? ((ratingProvider.reduce((sum, obj) => sum+obj.rating, 0.0))/n) : null; 
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $set: { rating: newRating } }
  );
};

const rate = async (classID, userID, rating) => {
  classID = helperMethodsForClasses.checkId(classID, "classID");
  userID = helperMethodsForClasses.checkId(userID, "userID");
  const classCollection = await classes();
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $pull:  { ratingProvider: { userID: userID } }  }
  );
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $push: { ratingProvider: { userID: userID, rating:  +rating } }  }
  );
  const classObj = await classCollection.findOne({ _id: new ObjectId(classID) });
  let ratingProvider = classObj.ratingProvider;
  let n = ratingProvider.length;
  let newRating = (n > 0) ? ((ratingProvider.reduce((sum, obj) => sum+obj.rating, 0.0))/n) : null; 
  await classCollection.findOneAndUpdate(
    { _id: new ObjectId(classID) },
    { $set: { rating: newRating } }
  );
};

const getClass = async (classID) => {
  classID = helperMethodsForClasses.checkId(classID, "classID");
  const classCollection = await classes();
  const classData = await classCollection.findOne({ _id: new ObjectId(classID) });
  if (!classData)
  throw `Error: Could not find a class with id of ${classID}`;
  return classData;
};

const getAllClasses = async () => {
  const classCollection = await classes();
  const allClasses = await classCollection.find({}).project({title:1}).toArray();
  if (!allClasses) throw "Error: No Classes not found";
  allClasses=allClasses.map((element)=>{
    element._id = element._id.toString();
      return element;
  });
};

const getAllStudents = async (classID) => {
  classID = helperMethodsForClasses.checkId(classID, "classID");
  const classCollection = await classes();
  const classData = await classCollection.findOne({ _id: new ObjectId(classID) });
  if (!classData)
    throw `Error: Could not find a class with id of ${classID}`;
  const students = classData.students;
  return students;
};

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

const getClassesBySportPlace = async (sportPlaceID) => {
  sportPlaceID = helperMethodsForClasses.checkId(sportPlaceID, "sportPlaceID");
  const classCollection = await classes();
  const classesBySportPlace = await classCollection.find({ sportPlaceID }).toArray();
  return classesBySportPlace;
};

const getClassesByInstructor = async (instructor) => {
  instructor = helperMethodsForUsers.checkString(instructor, "Instructor");
  const classCollection = await classes();
  const classesByInstructor = await classCollection.find({ instructor: instructor }).toArray();
  return classesByInstructor;
};

const getClassesByTime = async (time) => {
    // Validate time input
    time = helperMethodsForClasses.checkTime(time, "Time");
    const classCollection = await classes();
    const classesByTime = await classCollection.find({ time: time }).toArray();
    return classesByTime;
};

const getAvailableClasses = async () => {
  const classCollection = await classes();
  const availableClasses = await classCollection.find({ $expr: { $lt: ["$students.length", "$capacity"] } }).toArray();
  return availableClasses;
}; // classes that the capacity is not full

export {reserve, getClassesBySport, getClassesByUserID, getClass, quit, rate};