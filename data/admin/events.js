import { events } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const remove = async (eventID) => {
  eventID = validation.checkId(eventID);
  const eventCollection = await events();
  const deletionInfo = await eventCollection.findOneAndDelete({
    _id: new ObjectId(eventID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete event with id of ${eventID}`;

  return { deleted: true };
};

//
const getAllUsers = async () => {};

const getUnapprovedEvents = async () => {
  const eventCollection = await events();
  const unapprovedEventList = await eventCollection
    .find({
      approved: false,
    })
    .toArray();
  return unapprovedEventList;
};

const approve = async (eventID) => {
  eventID = validation.checkId(eventID);

  const eventUpdateInfo = {
    approved: true,
  };
  const eventCollection = await events();
  const updateInfo = await eventCollection.findOneAndUpdate(
    { _id: new ObjectId(eventID) },
    { $set: eventUpdateInfo },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0)
    throw `Error: Update failed, could not find a event with id of ${eventID}`;

  return eventUpdateInfo;
};

export { remove, approve, getUnapprovedEvents };
