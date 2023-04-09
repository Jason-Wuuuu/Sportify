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

// Ratings
export const ratingForSportPlaces = getCollectionFn("ratingForSportPlaces");
export const ratingForClasses = getCollectionFn("ratingForClasses");

// Booking
export const bookingForSportPlaces = getCollectionFn("bookingForSportPlaces");
export const bookingForClasses = getCollectionFn("bookingForClasses");
export const bookingForEvents = getCollectionFn("bookingForEvents");
