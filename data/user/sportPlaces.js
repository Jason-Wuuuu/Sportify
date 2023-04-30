import { sportPlaces } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { helperMethodsForUsers } from "./helpers.js";
import { sports } from "../../config/mongoCollections.js";

const reserve = async (sportPlaceID, userID) => {
  // add user to the users field (an array) in sportPlace collection
};

const quit = async (sportPlaceID, userID) => {};

const rate = async (sportPlaceID, userID, rate) => {};

// const getAllByCity = async (city) => {};

// const getAllByState = async (state) => {};

const getSportPlace = async (sportPlaceID) => {
  sportPlaceID = helperMethodsForUsers.checkId(sportPlaceID, "sportPlaceID");
  //get sportid
  const sportCollection = await sports();
  const sportPlaceCollection = await sportPlaces();

  const sportPlace = await sportPlaceCollection.findOne({
    _id: new ObjectId(sportPlaceID),
  });
  if (!sportPlace) throw "Error: sportPlace not found";

  const sport = await sportCollection.findOne({
    _id: new ObjectId(sportPlace.sportID),
  });
  if (!sport) throw "Error: Sport not found";
  //let newdata = { "firstName": getdata.firstName, "lastName": getdata.lastName, "emailAddress": getdata.emailAddress, "role": getdata.role };
  sportPlace.sportname = sport.name;
  return sportPlace;
};

const getSportPlaceId = async (sportPlace) => {
  sportPlace = helperMethodsForUsers.checkString(sportPlace, "sportPlace");
  const sportPlaceCollection = await sportPlaces();

  const sportPlc = await sportPlaceCollection.findOne({
    name: sportPlace,
  });
  if (!sportPlc) throw "Error: sportPlace not found";

  return sportPlc._id.toString();
};

const getAllSportPlaces = async () => {};

const getSportPlacesBySport = async (sportname) => {
  sportname = helperMethodsForUsers.checkString(sportname, "sportname");
  //get sportid
  const sportCollection = await sports();
  const sportPlaceCollection = await sportPlaces();
  const sport = await sportCollection.findOne({ name: sportname });
  if (!sport) throw "Error: Sport not found";

  const sportPlace = await sportPlaceCollection
    .find({
      sportID: sport._id.toString(),

      // "6449f14d67bd2697e94c45f9"
      //sport._id
    })
    .toArray();

  if (!sportPlace) throw "Error: sportPlace not found";
  return sportPlace;
};

const getSportPlacesByPriceRange = async (min, max) => {};

const getAvailableSportPlaces = async () => {}; // SportPlaces that the capacity is not full

// sorting ?
export { getSportPlacesBySport, getSportPlace, getSportPlaceId };
