import { events } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const remove = async (eventID) => {
  eventID = validation.checkId(eventID);
  const eventCollection = await events();
  const deletionInfo = await eventCollection.findOneAndDelete({
    _id: new ObjectId(eventID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete event with id of ${eventID}`;

  return { deleted: true };
};

export { remove };
