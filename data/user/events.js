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
  endTime,
  thumbnail
) => {
  try {
    // validation
    let euserID = validation.helperMethodsForEvents.checkId(userID, "userID");
    let ename = validation.helperMethodsForEvents.checkEventName(
      name,
      "Event Name"
    );
    let edescription = validation.helperMethodsForEvents.checkEventName(
      description,
      "Description"
    );
    let esport = validation.helperMethodsForEvents.checkString(
      sport,
      "Sport Name"
    );
    let esportPlace = validation.helperMethodsForEvents.checkString(
      sportPlace,
      "SportPlace"
    );
    let ecapacity = validation.helperMethodsForEvents.checkCapacity(
      capacity,
      "Capacity"
    );
    let edate = validation.helperMethodsForEvents.checkDate(date, "Event Date");
    let estartTime = validation.helperMethodsForEvents.checkEventTime(
      startTime,
      "Event Start Time"
    );
    let eendTime = validation.helperMethodsForEvents.checkEventTime(
      endTime,
      "Event End time"
    );
    let ethumbnail = validation.helperMethodsForEvents.checkURL(
      thumbnail,
      "Thumbnail URL"
    );
    let timerange = validation.helperMethodsForEvents.checkTimeRange(
      startTime,
      endTime
    );
    // add valid event to db
    let newEvent = {
      userID: euserID,
      name: ename,
      description: edescription,
      sport: esport,
      sportPlace: esportPlace,
      capacity: ecapacity,
      date: edate,
      startTime: estartTime,
      endTime: eendTime,
      approved: false,
      participants: [],
      image: ethumbnail,
    };

    const eventCollection = await events();
    const newInsertInformation = await eventCollection.insertOne(newEvent);
    const newId = newInsertInformation.insertedId;
    await get(newId.toString());

    return { insertedEvent: true, eventID: newId.toString() };
  } catch (e) {
    console.log(e);
  }
};

const getAll = async () => {
  const eventCollection = await events();
  const eventList = await eventCollection.find({}).toArray();
  return eventList;
};

const get = async (eventID) => {
  eventID = validation.checkId(eventID);
  const eventCollection = await events();
  const event = await eventCollection.findOne({
    _id: new ObjectId(eventID),
  });
  if (!event) throw "Error: Event not found";
  return event;
};

const remove = async (eventID) => {
  eventID = validation.checkId(eventID, "eventID");
  const eventCollection = await events();
  const deletionInfo = await eventCollection.findOneAndDelete({
    _id: new ObjectId(eventID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete sport place with id of ${eventID}`;

  return { deleted: true };
};

const update = async (
  eventID,
  name,
  description,
  sport,
  sportPlace,
  capacity,
  date,
  startTime,
  endTime,
  thumbnail
) => {
  try {
    // validation
    let eeventID = validation.helperMethodsForEvents.checkId(
      eventID,
      "Event ID"
    );
    let ename = validation.helperMethodsForEvents.checkEventName(
      name,
      "Event Name"
    );
    let edescription = validation.helperMethodsForEvents.checkEventName(
      description,
      "Description"
    );
    let esport = validation.helperMethodsForEvents.checkString(
      sport,
      "Sport Name"
    );
    let esportPlace = validation.helperMethodsForEvents.checkString(
      sportPlace,
      "SportPlace"
    );
    let ecapacity = validation.helperMethodsForEvents.checkCapacity(
      capacity,
      "Capacity"
    );
    let edate = validation.helperMethodsForEvents.checkDate(date, "Event Date");
    let estartTime = validation.helperMethodsForEvents.checkEventTime(
      startTime,
      "Event Start Time"
    );
    let eendTime = validation.helperMethodsForEvents.checkEventTime(
      endTime,
      "Event End time"
    );
    let ethumbnail = validation.helperMethodsForEvents.checkURL(
      thumbnail,
      "Thumbnail URL"
    );
    let timerange = validation.helperMethodsForEvents.checkTimeRange(
      startTime,
      endTime
    );
    // add valid event to db
    let updatedEvent = {
      name: ename,
      description: edescription,
      sport: esport,
      sportPlace: esportPlace,
      capacity: ecapacity,
      date: edate,
      startTime: estartTime,
      endTime: eendTime,
      image: ethumbnail,
    };

    const eventCollection = await events();
    const updatedInfo = await eventCollection.findOneAndUpdate(
      { _id: new ObjectId(eeventID) },
      { $set: updatedEvent },
      { returnDocument: "after" }
    );
    if (updatedInfo.lastErrorObject.n === 0) {
      throw `Error: no Event exists with an id of ${eeventID}.`;
    }
    return { updateEvent: true };
  } catch (e) {
    console.log(e);
  }
};

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
    throw `Error: Update failed, could not find a event with id of ${eventID}`;

  return { updatedEventParticipants: true };
};

const quit = async (eventID, userID) => {
  eventID = validation.helperMethodsForEvents.checkId(eventID, "eventID");
  userID = validation.helperMethodsForEvents.checkId(userID, "userID");
  const eventCollection = await events();
  const updateInfo = await eventCollection.findOneAndUpdate(
    { _id: new ObjectId(eventID) },
    { $pull: { participants: userID } },
    { returnDocument: "after" }
  );
  if (updateInfo.lastErrorObject.n === 0)
    throw `Error: Update failed, could not find a event with id of ${eventID}`;

  return { updatedEventParticipants: true };
};

const getAllParticipants = async (eventID) => {};

const getEventsByUser = async (userID) => {
  const eventCollection = await events();
  const eventList = await eventCollection
    .find({
      userID: userID,
    })
    .toArray();
  return eventList;
};

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

export {
  create,
  get,
  getAll,
  getEventsBySport,
  join,
  quit,
  getEventsByUser,
  remove,
  update,
};
//testing my local branch repo connection to github repo via test commit
