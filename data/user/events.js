const create = async (
  userID,
  name,
  sportID,
  type,
  description,
  location, // groundID ?
  time,
  capacity
  // approved ?
  // users: list of userIDs
) => {};

const remove = async (eventID) => {}; // ?

const update = async (
  userID,
  eventID,
  name,
  sportID,
  type,
  description,
  location,
  time,
  capacity
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
