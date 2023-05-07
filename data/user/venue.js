import { timeSlot, sportPlaces, ratingVenue, sports } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "./helpers.js";
import { helperMethodsForEvents } from "./helpers.js";


const getslotsByDate = async (sportPlaceid, date) => {
    sportPlaceid = validation.checkId(sportPlaceid, "sportPlaceid");
    date = helperMethodsForEvents.checkDate(date, "date");

    const slotCollection = await timeSlot();
    const slots = await slotCollection
        .find({
            sportPlaceID: sportPlaceid,
            Date: date,
            availability: 0
        })
        .toArray();

    // if (!slots) throw "Error: slot can not be found";
    for (let i = 0; i < slots.length; i++) {
        if (slots[i]["slotID"] == 1) {
            slots[i]["slotName"] = "12:00AM to 08:00AM";
        }
        else if (slots[i]["slotID"] == 2) {
            slots[i]["slotName"] = "08:00AM to 04:00PM";
        }
        else {
            slots[i]["slotName"] = "04:00PM to 12:00AM";
        }
    }
    return slots;
};

const getslotsByDateSerach = async (sportid, sportPlaceid, date) => {
    sportPlaceid = validation.checkId(sportPlaceid, "sportPlaceid");
    date = helperMethodsForEvents.checkDate(date, "date");
    const sportCollection = await sports();
    const sportplaceCollection = await sportPlaces();
    const sport = await sportCollection.findOne({ _id: new ObjectId(sportid) });
    const sportplace = await sportplaceCollection.findOne({ _id: new ObjectId(sportPlaceid) });

    const slotCollection = await timeSlot();
    const slots = await slotCollection
        .find({
            sportPlaceID: sportPlaceid,
            Date: date,
            availability: 0
        })
        .toArray();
    // if (!slots) throw "Error: slot can not be found";
    for (let i = 0; i < slots.length; i++) {
        slots[i]["SportName"] = sport.name;
        slots[i]["SportPlaceName"] = sportplace.name;
        if (slots[i]["slotID"] == 1) {
            slots[i]["slotName"] = "12:00AM to 08:00AM";
        }
        else if (slots[i]["slotID"] == 2) {
            slots[i]["slotName"] = "08:00AM to 04:00PM";
        }
        else {
            slots[i]["slotName"] = "04:00PM to 12:00AM";
        }
        if (slots[i]["availability"] == 0) {
            slots[i]["status"] = "Not Reserved";
        }
        else {
            slots[i]["status"] = "Reserved";
        }
    }
    return slots;
};


const getvenuebyuserid = async (ID) => {
    ID = validation.checkId(ID, "ID");
    const VenueCollection = await timeSlot();
    const sportCollection = await sports();
    const sportplaceCollection = await sportPlaces();
    const ratingVenueCollection = await ratingVenue();
    const sport = await sportCollection.find({}).toArray();
    const sportplace = await sportplaceCollection.find({}).toArray();
    const Venue = await VenueCollection.find({ userID: ID, bookingType: 1 }).toArray();
    const ratingVenuedata = await ratingVenueCollection.find({ userID: ID }).toArray();
    let arr = [];

    for (let i = 0; i < Venue.length; i++) {
        let item = { "id": Venue[i]._id, "Date": Venue[i].Date, "slotID": Venue[i].slotID, "sportID": Venue[i].sportID, "sportPlaceID": Venue[i].sportPlaceID };

        for (let j = 0; j < sport.length; j++) {
            if (sport[j]._id == Venue[i].sportID) {
                item["sportName"] = sport[j].name;
            }
        }
        for (let j = 0; j < ratingVenuedata.length; j++) {
            if (ratingVenuedata[j].userID == ID && ratingVenuedata[j].sportPlaceID == Venue[i].sportPlaceID) {
                item["ratingV"] = ratingVenuedata[j].rating;
            }
        }

        arr.push(item);
    }
    for (let i = 0; i < arr.length; i++) {
        // let item = { "Date": Venue[i].Date, "slotID": Venue[i].slotID, "sportPlaceID": Venue[i].sportPlaceID };
        for (let k = 0; k < sportplace.length; k++) {
            if (sportplace[k].sportID == arr[i].sportID && sportplace[k]._id == arr[i].sportPlaceID) {
                arr[i]["sportPlaceName"] = sportplace[k].name;
                arr[i]["address"] = sportplace[k].address;
                arr[i]["description"] = sportplace[k].description;
                arr[i]["price"] = sportplace[k].price;
                arr[i]["capacity"] = sportplace[k].capacity;
                // arr[i]["rating"] = sportplace[k].rating;
                if (arr[i]["slotID"] == 1) {
                    arr[i]["slotName"] = "12:00AM to 08:00AM";
                }
                else if (arr[i]["slotID"] == 2) {
                    arr[i]["slotName"] = "08:00AM to 04:00PM";
                }
                else {
                    arr[i]["slotName"] = "04:00PM to 12:00AM";
                }
            }
        }


    }

    if (!arr) throw "Error: Venue can not be found";
    return arr;
};

const remove = async (ID) => {
    ID = validation.checkId(ID, "ID");
    const slotCollection = await timeSlot();
    const deletionInfo = await slotCollection.findOneAndDelete({
        _id: new ObjectId(ID),
    });
    if (deletionInfo.lastErrorObject.n === 0)
        throw `Error: Could not delete venue`;
    return { deleted: true };
};

export { getvenuebyuserid, getslotsByDate, remove, getslotsByDateSerach };