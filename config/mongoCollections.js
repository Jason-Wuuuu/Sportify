import { dbConnection } from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Documents
export const users = getCollectionFn("users");
export const admins = getCollectionFn("admins");
export const sports = getCollectionFn("sports");
export const sportPlaces = getCollectionFn("sportPlaces");
export const events = getCollectionFn("events");
export const classes = getCollectionFn("classes");
export const timeSlot = getCollectionFn("timeSlot");
export const comments = getCollectionFn("comments");
export const ratingVenue = getCollectionFn("ratingVenue");
export const instructor = getCollectionFn("instructor");
