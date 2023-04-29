import { events } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "./helpers.js";
import * as userData from "./users.js";

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
  eventID = validation.helperMethodsForEvents.checkId(eventID, "eventID");
  userID = validation.helperMethodsForEvents.checkId(userID, "userID");
  const eventCollection = await events();
  const updateInfo = await eventCollection.findOneAndUpdate(
    { _id: new ObjectId(eventID) },
    { $push: { participants: userID } },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0)
    throw `Error: Update failed, could not find a sport with id of ${sportID}`;

  return { updatedEventParticipants: true };
};

const quit = async (eventID, userID) => {};

const getAllParticipants = async (eventID) => {};

const getEventsByUser = async (userID) => {};

const getEventsBySport = async (sport) => {
  sport = validation.helperMethodsForEvents.checkString(sport, "Sport");

  const eventCollection = await events();
  let dt = new Date();
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const fdt = `${yyyy}-${mm}-${dd}`;

  const event = await eventCollection
    .find({
      sport: sport,
      date: { $gte: fdt },
    })
    .toArray();
  if (!event) throw "Error: Event not found";
  if (event.length != 0) {
    for (let item of event) {
      try {
        let user = await userData.get(item.userID);
        item.username = user.firstName + " " + user.lastName;

        //if(item.participants.includes())
      } catch (e) {
        item.username = "Unknown User";
      }
      item._id = item._id.toString();
      item.available = item.participants.length < item.capacity ? true : false;
    }
  }
  return event;
};

const getEventsByType = async (type) => {};

const getEventsBySportPlace = async (sportPlaceID) => {};

const getEventsByTime = async (time) => {};

const getAvailableEvents = async () => {}; // events that the capacity is not full

// sorting ?

export { create, get, getAll, getEventsBySport, join };
//testing my local branch repo connection to github repo via test commit
