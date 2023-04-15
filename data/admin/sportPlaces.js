import { sportPlaces } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

//
const create = async (sportID, address, description, capacity, price) => {
  let newSportPlace = {
    sportID: sportID,
    address: address,
    description: description,
    capacity: capacity,
    price: price,
  };

  const sportPlaceCollection = await sportPlaces();
  const newInsertInformation = await sportPlaceCollection.insertOne(
    newSportPlace
  );
  const newId = newInsertInformation.insertedId;
  return await get(newId.toString());
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
    throw [404, `Error: Could not delete user with id of ${sportPlaceID}`];

  return { ...deletionInfo.value, deleted: true };
};

const update = async (
  sportPlaceID,
  sportID,
  address,
  description,
  capacity,
  price
) => {};

// const getAllUsers = async (sportPlaceID) => {};

export { create, getAll, get, remove, update };
