import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const remove = async (userID) => {
  userID = validation.checkId(userID);
  const userCollection = await users();
  const deletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(userID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw `Error: Could not delete user with id of ${userID}`;

  return { deleted: true };
};

export { remove };
