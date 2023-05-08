import {
    instructor,
    sportPlaces,
    sports,
  } from "../../config/mongoCollections.js";
  import { ObjectId } from "mongodb";
  import validation from "./helpers.js";
  
  const create = async (
    sportID,
    name
  ) => {
    // validation
    sportID = validation.checkId(sportID, "sport");
    name = validation.checkString(name, "Name");
      
    const instructorCollection = await instructor();
    const checkname = await instructorCollection.findOne({ sportID: sportID, name: name });
    if (checkname) throw "Error: can not enter duplicate instructor.";
  
    // add  
    let newInstructor = {
      sportID: sportID,
        name: name     
    };
    
    const newdata = await instructorCollection.insertOne(newInstructor);
    const newId = newdata.insertedId;
    // await get(newId.toString());
  
    return { insertedInstructor: true };
  };
  
  const get = async (ID) => {
    ID = validation.checkId(ID, "ID");
    const slotCollection = await timeSlot();
    const timeSlot = await slotCollection.findOne({ _id: new ObjectId(ID) });
    if (!timeSlot) throw "Error: Slot can not be found";
    return timeSlot;
  };
  
  const getall = async () => {
    const instructorCollection = await instructor();   
    const instructors = await instructorCollection.find({}).toArray();   
    return instructors;
  };
  
  export { create, get, getall };
  