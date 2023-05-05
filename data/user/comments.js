import { comments } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import * as validation from "./helpers.js";

const create = async (eventID, userID, name, comment, timestamp) => {
  try {
    // validation
    eventID = validation.helperMethodsForEvents.checkId(eventID, "eventID");
    userID = validation.helperMethodsForEvents.checkId(userID, "userID");

    name = validation.helperMethodsForEvents.checkString(name, "User Name");
    comment = validation.helperMethodsForEvents.checkString(comment, "Comment");

    if (timestamp instanceof Date && !isNaN(timestamp)) {
    } else {
      throw "Timestamp is not valid Date object";
    }

    // add valid event to db
    let newComment = {
      eventID: eventID,
      userID: userID,
      name: name,
      comment: comment,
      timestamp: timestamp,
    };

    const commentCollection = await comments();
    const newInsertInformation = await commentCollection.insertOne(newComment);
    const newId = newInsertInformation.insertedId;

    return { insertedEvent: true };
  } catch (e) {
    console.log(e);
  }
};

const get = async (eventID) => {
  eventID = validation.checkId(eventID);
  const commentCollection = await comments();
  const commentlist = await commentCollection
    .find({
      eventID: eventID,
    })
    .toArray();
  if (!commentlist) throw "Error: Comments not found";
  return commentlist;
};

const remove = async (commentId) => {
  commentId = validation.checkId(commentId, "Comment ID");
  const commentCollection = await comments();
  const deletionInfo = await commentCollection.findOneAndDelete({
    _id: new ObjectId(commentId),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete comment with id of ${commentId}`;

  return { deleted: true };
};

export { create, get, remove };
