import { users } from "../../config/mongoCollections.js";

const getAll = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  return userList;
};

const remove = async (userID) => {};

export { getAll, remove };
