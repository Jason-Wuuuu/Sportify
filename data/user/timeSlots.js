import { timeSlot } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "./helpers.js";

const create = async (
  sportID,
  sportPlaceID,
  Date,
  slotID,
  // ,
  userID,
  bookingType
) => {

  // validation
  sportID = validation.checkId(sportID, "sport ID");
  sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");
  Date = validation.checkString(Date, "Date");
  slotID = validation.checkNumber(slotID, "slotID");
  userID = validation.checkId(userID, "userID");

  // add
  let newTimeslot = {
    sportID: sportID,
    sportPlaceID: sportPlaceID,
    Date: Date,
    slotID: slotID,
    availability: 1,
    userID: userID,
    bookingType: bookingType,
    //pass booking type for ground booking 1, event:2, class:3
  };
  const slotCollection = await timeSlot();
  const newdata = await slotCollection.insertOne(newTimeslot);
  const newId = newdata.insertedId;
  // await get(newId.toString());

  return { insertedtimeSlot: true };

};

const get = async (ID) => {
  ID = validation.checkId(ID, "ID");
  const slotCollection = await timeSlot();
  const slot = await slotCollection.findOne({ _id: new ObjectId(ID) });
  if (!slot) throw "Error: Slot can not be found";
  return slot;
};
const getslotsByDate = async (sportPlaceid, date, slotarray) => {
  const slotCollection = await timeSlot();
  const slots = await slotCollection
    .find({
      sportPlaceID: sportPlaceid,
      Date: date,
      slotID: { $in: slotarray },
    })
    .toArray();
  return slots;
};
const removefromslot = async (sid,
  date,) => {
  sid = validation.helperMethodsForEvents.checkId(
    sid,
    "sID"
  );
  date = validation.helperMethodsForEvents.checkDate(date, "Date");

  // add valid event to db
  let updatedslot = {
    userID: "",
    availability: 0,
    bookingType: 0
  };

  const slotCollection = await timeSlot();
  const updatedInfo = await slotCollection.findOneAndUpdate(
    { _id: new ObjectId(sid), Date: date },
    { $set: updatedslot },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw `Error: no slot exists.`;
  }

  return { updatedslot: true };

};

const updateslot = async (
  sid,
  date,
  uid
) => {

  // validation
  sid = validation.helperMethodsForEvents.checkId(
    sid,
    "sID"
  );

  date = validation.helperMethodsForEvents.checkDate(date, "Date");

  uid = validation.helperMethodsForEvents.checkId(
    uid, 'uid'
  );
  // add valid event to db
  let updatedslot = {
    userID: uid,
    availability: 1,
    bookingType: 1
  };

  const slotCollection = await timeSlot();
  const updatedInfo = await slotCollection.findOneAndUpdate(
    { _id: new ObjectId(sid), Date: date },
    { $set: updatedslot },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw `Error: no slot exists.`;
  }

  return { updatedslot: true };

};

export { create, get, getslotsByDate, removefromslot, updateslot };
