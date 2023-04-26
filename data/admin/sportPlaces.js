import { sportPlaces } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

//
const create = async (name, sport, address, description, capacity, price) => {
  // validation
  name = validation.checkString(name, "Name");
  sport = validation.checkString(sport, "Sport");
  address = validation.checkString(address, "Address");
  description = validation.checkString(description, "Description");
  capacity = validation.checkCapacity(capacity, "Capacity");
  price = validation.checkNumber(price, "Price");

  // add valid sport place to db
  let newSportPlace = {
    name: name,
    sport: sport,
    address: address,
    description: description,
    capacity: capacity,
    price: price,
    rating: 0,
    users: [],
  };

  const sportPlaceCollection = await sportPlaces();
  const newInsertInformation = await sportPlaceCollection.insertOne(
    newSportPlace
  );
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedSportPlace: true };
};

const getAll = async () => {
  const sportPlaceCollection = await sportPlaces();
  const sportPlaceList = await sportPlaceCollection.find({}).toArray();
  return sportPlaceList;
};

const get = async (sportPlaceID) => {
  sportPlaceID = validation.checkId(sportPlaceID);
  const sportPlaceCollection = await sportPlaces();
  const sportPlace = await sportPlaceCollection.findOne({
    _id: new ObjectId(sportPlaceID),
  });
  if (!sportPlace) throw "Error: sportPlace not found";
  return sportPlace;
};

const remove = async (sportPlaceID) => {
  sportPlaceID = validation.checkId(sportPlaceID);
  const sportPlaceCollection = await sportPlaces();
  const deletionInfo = await sportPlaceCollection.findOneAndDelete({
    _id: new ObjectId(sportPlaceID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete sport place with id of ${sportPlaceID}`;

  return { deleted: true };
};

const update = async (
  sportPlaceID,
  name,
  sport,
  address,
  description,
  capacity,
  price
) => {
  // validation
  sportPlaceID = validation.checkId(sportPlaceID);
  name = validation.checkString(name, "Name");
  sport = validation.checkString(sport, "Sport");
  address = validation.checkString(address, "Address");
  description = validation.checkString(description, "Description");
  capacity = validation.checkCapacity(capacity, "Capacity");
  price = validation.checkNumber(price, "Price");

  const sportPlaceInfo = {
    name: name,
    sport: sport,
    address: address,
    description: description,
    capacity: capacity,
    price: price,
  };

  const sportPlaceCollection = await sportPlaces();
  const updatedInfo = await sportPlaceCollection.findOneAndUpdate(
    { _id: new ObjectId(sportPlaceID) },
    { $set: sportPlaceInfo },
    { returnDocument: "after" }
  );

  if (updatedInfo.lastErrorObject.n === 0) {
    throw `Error: no sport place exists with an id of ${sportPlaceID}.`;
  }
  return { updatedSportPlace: true };
};

// const getAllUsers = async (sportPlaceID) => {};

export { create, getAll, get, remove, update };
