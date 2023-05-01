import { timeSlot } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const create = async (
    sportID,
    sportPlaceID,
    Date,
    slotID
    // ,
    // availability,
    // userID
  ) => {
    // validation
    sportID = validation.checkId(sportID, "sport ID");
    sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");
    Date = validation.checkString(Date, "Date");
    slotID = validation.checkNumber(slotID, "slotID");
    // availability = validation.checkNumber(availability, "availability");
    // userID = validation.checkId(userID, "userID");
   
    // add 
    let newTimeslot = {
        sportID: sportID,
        sportPlaceID: sportPlaceID,
        Date: Date,
        slotID: slotID,
        availability: 0,
        userID: "",
        bookingType: 0
        //pass booking type for ground booking 1, event:2, class:3
    };
    const slotCollection = await timeSlot();
    const newdata = await slotCollection.insertOne(newTimeslot);
    const newId = newdata.insertedId;
   // await get(newId.toString());
  
    return { insertedtimeSlot: true };
  };


const get = async (ID) => {
    ID = validation.checkId(ID,"ID");
    const slotCollection = await timeSlot();
    const timeSlot = await slotCollection.findOne({ _id: new ObjectId(ID) });
    if (!timeSlot) throw "Error: Slot can not be found";
    return timeSlot;
  };

  export{ create,get }