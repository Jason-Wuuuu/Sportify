import { ratingVenue, sportPlaces } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "./helpers.js";

const create = async (
    sportPlaceID,
    userID,
    rating
) => {

    // validation
    sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");
    rating = validation.checkRating(rating, "rating");
    userID = validation.checkId(userID, "userID");

    // add
    let newrating = {
        sportPlaceID: sportPlaceID,
        rating: rating,
        userID: userID
    };
    const ratingVenueCollection = await ratingVenue();
    const newdata = await ratingVenueCollection.insertOne(newrating);
    if (!newdata.acknowledged || !newdata.insertedId) { throw 'No data'; }
    const newId = newdata.insertedId;
    await updatesportPlacerating(sportPlaceID);

    return { insertedratingVenue: true };
};


const update = async (
    sportPlaceID,
    userID,
    rating
) => {
    sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");
    rating = validation.checkRating(rating, "rating");
    userID = validation.checkId(userID, "userID");

    const Updaterating = {
        rating: rating,
    };

    const ratingVenueCollection = await ratingVenue();
    const UpdateDatabyID = await ratingVenueCollection
        .findOneAndUpdate(
            { sportPlaceID: sportPlaceID, userID: userID },
            { $set: Updaterating },
            { returnDocument: 'after' }
        );
    if (UpdateDatabyID.lastErrorObject.n === 0) { throw 'Update Failed'; }

    // UpdateDatabyID.value._id = UpdateDatabyID.value._id.toString();
    const updatesportplace = await updatesportPlacerating(sportPlaceID);

    return { insertedratingVenue: true };
    // return UpdateDatabyID.value;
};

const updatesportPlacerating = async (
    sportPlaceID
) => {
    sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");

    let user_rating = 0;
    let final_rating = 0;
    //get data by id
    const dataset = await getrating(sportPlaceID);
    if (!dataset) {
        throw 'No data';
    }
    else {
        if (dataset.length > 0) {
            for (let i = 0; i < dataset.length; i++) {
                user_rating = user_rating + dataset[i].rating;
            }
            final_rating = Math.floor(((user_rating) / (dataset.length)) * 10) / 10;
        }
    }

    const Updaterating = {
        rating: final_rating,
    };

    const sportPlacesCollection = await sportPlaces();
    const UpdateDatabyID = await sportPlacesCollection
        .findOneAndUpdate(
            { _id: new ObjectId(sportPlaceID) },
            { $set: Updaterating },
            { returnDocument: 'after' }
        );
    if (UpdateDatabyID.lastErrorObject.n === 0) { throw 'Update Failed'; }

    UpdateDatabyID.value._id = UpdateDatabyID.value._id.toString();
    return UpdateDatabyID.value;
};

const getrating = async (sportPlaceID) => {
    sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");
    const ratingVenueCollection = await ratingVenue();

    const rating = await ratingVenueCollection.find({
        sportPlaceID: sportPlaceID,
    }).toArray();
    if (!rating) throw "Error: rating not found";

    return rating;
};

const getatingbyuser = async (userID, sportPlaceID) => {
    userID = validation.checkId(userID, "userID");
    sportPlaceID = validation.checkId(sportPlaceID, "sportPlaceID");
    const ratingVenueCollection = await ratingVenue();

    const rating = await ratingVenueCollection.findOne({
        sportPlaceID: sportPlaceID,
        userID: userID,
    });
    let rat = 0;
    if (!rating) {
        return rat
    }

    return rating.rating;
};

export { create, updatesportPlacerating, getatingbyuser, update };