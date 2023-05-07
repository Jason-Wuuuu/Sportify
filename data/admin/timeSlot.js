import {
  timeSlot,
  sportPlaces,
  sports,
} from "../../config/mongoCollections.js";
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

  const slotCollection = await timeSlot();
  const checktimeslot = await slotCollection.findOne({ sportID: sportID, sportPlaceID: sportPlaceID, Date: Date, slotID: slotID });
  if (checktimeslot) throw "Error: can not enter duplicate slot.";

  // add

  let newTimeslot = {
    sportID: sportID,
    sportPlaceID: sportPlaceID,
    Date: Date,
    slotID: slotID,
    availability: 0,
    userID: "",
    bookingType: 0,
    //pass booking type for ground booking 1, event:2, class:3
  };
  
  const newdata = await slotCollection.insertOne(newTimeslot);
  const newId = newdata.insertedId;
  // await get(newId.toString());

  return { insertedtimeSlot: true, slotID: newId.toString() };
};

const get = async (ID) => {
  ID = validation.checkId(ID, "ID");
  const slotCollection = await timeSlot();
  const timeSlot = await slotCollection.findOne({ _id: new ObjectId(ID) });
  if (!timeSlot) throw "Error: Slot can not be found";
  return timeSlot;
};

const getallvenue = async () => {
  const VenueCollection = await timeSlot();
  const sportCollection = await sports();
  const sportplaceCollection = await sportPlaces();
  const sport = await sportCollection.find({}).toArray();
  const sportplace = await sportplaceCollection.find({}).toArray();
  const Venue = await VenueCollection.find({
    availability: 1,
    bookingType: 1,
  }).toArray();
  // for (let i = 0; i < Venue.length; i++) {
  //     let item = {};
  //     if (Venue[i]["slotID"] = 1) {
  //         item["slotName"] = "12:00AM to 08:00AM";
  //     }
  //     else if (Venue[i]["slotID"] = 2) {
  //         item["slotName"] = "08:00AM to 04:00PM";
  //     }
  //     else {
  //         item["slotName"] = "04:00PM to 12:00AM";
  //     }
  //     Venue.push(item);
  // }
  let arr = [];

  for (let i = 0; i < Venue.length; i++) {
    let item = {
      id: Venue[i]._id,
      Date: Venue[i].Date,
      slotID: Venue[i].slotID,
      sportID: Venue[i].sportID,
      sportPlaceID: Venue[i].sportPlaceID,
    };

    for (let j = 0; j < sport.length; j++) {
      if (sport[j]._id == Venue[i].sportID) {
        item["sportName"] = sport[j].name;
      }
    }
    arr.push(item);
  }
  for (let i = 0; i < arr.length; i++) {
    // let item = { "Date": Venue[i].Date, "slotID": Venue[i].slotID, "sportPlaceID": Venue[i].sportPlaceID };
    for (let k = 0; k < sportplace.length; k++) {
      if (
        sportplace[k].sportID == arr[i].sportID &&
        sportplace[k]._id == arr[i].sportPlaceID
      ) {
        arr[i]["sportPlaceName"] = sportplace[k].name;
        arr[i]["address"] = sportplace[k].address;
        arr[i]["description"] = sportplace[k].description;
        arr[i]["price"] = sportplace[k].price;
        arr[i]["capacity"] = sportplace[k].capacity;
        if (arr[i]["slotID"] == 1) {
          arr[i]["slotName"] = "12:00AM to 08:00AM";
        } else if (arr[i]["slotID"] == 2) {
          arr[i]["slotName"] = "08:00AM to 04:00PM";
        } else {
          arr[i]["slotName"] = "04:00PM to 12:00AM";
        }
      }
    }
  }

  if (!arr) throw "Error: Venue can not be found";
  return arr;
};

export { create, get, getallvenue };
