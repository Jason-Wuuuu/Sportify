import { events } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const create = async (
  userID,
  name,
  description,
  sport,
  sportPlace,
  capacity,
  date,
  startTime,
  endTime
) => {
  // validation

  // add valid event to db
  let newEvent = {
    userID: userID,
    name: name,
    description: description,
    sport: sport,
    sportPlace: sportPlace,
    capacity: capacity,
    date: date,
    startTime: startTime,
    endTime: endTime,
    approved: false,
    participants: [],
  };

  const eventCollection = await events();
  const newInsertInformation = await eventCollection.insertOne(newEvent);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedEvent: true };
};

const getAll = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).toArray();
  return eventList;
};

const get = async (eventID) => {
  // eventID = validation.checkId(eventID);
  const eventCollection = await events();
  const event = await eventCollection.findOne({
    _id: new ObjectId(eventID),
  });
  if (!event) throw "Error: Event not found";
  return event;
};

const remove = async (eventID) => {}; // ?

const update = async (
  eventID,
  userID,
  name,
  description,
  sport,
  sportPlace,
  capacity,
  date,
  startTime,
  endTime
) => {};

//
const join = async (eventID, userID) => {
  // add user to the participant field (an array) in events collection
};

const quit = async (eventID, userID) => {};

const getAllParticipants = async (eventID) => {};

const getEventsByUser = async (userID) => {};

const getEventsBySport = async (sportID) => {};

const getEventsByType = async (type) => {};

const getEventsBySportPlace = async (sportPlaceID) => {};

const getEventsByTime = async (time) => {};

const getAvailableEvents = async () => {}; // events that the capacity is not full

// sorting ?

export { create, get, getAll };
//testing my local branch repo connection to github repo via test commit
