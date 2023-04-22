import { events } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const create = async (
  userID,
  name,
  sport,
  type,
  description,
  location,
  capacity,
  date,
  startTime,
  endTime
  // approved ?
) => {};

const remove = async (eventID) => {}; // ?

const update = async (
  eventID,
  userID,
  name,
  sport,
  type,
  description,
  location,
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

const getEvent = async (eventID) => {};

const getAllEvents = async () => {};

const getEventsByUser = async (userID) => {};

const getEventsBySport = async (sportID) => {};

const getEventsByType = async (type) => {};

// const getEventsByLocation = async (location) => {};

const getEventsByTime = async (time) => {};

const getAvailableEvents = async () => {}; // events that the capacity is not full

// sorting ?
