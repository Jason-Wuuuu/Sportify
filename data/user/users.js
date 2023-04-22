import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { helperMethodsForUsers } from "./helpers.js";

const create = async (
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth, // 01-01-1999 (> 13 years old)
  contactNumber,
  password
) => {
  firstName = helperMethodsForUsers.checkString(firstName, "First Name");
  lastName = helperMethodsForUsers.checkString(lastName, "Last Name");
  email = helperMethodsForUsers.checkString(email, "Email");
  gender = helperMethodsForUsers.checkString(gender, "Gender");
  dateOfBirth = helperMethodsForUsers.checkString(dateOfBirth, "Date Of Birth");
  contactNumber = helperMethodsForUsers.checkString(
    contactNumber,
    "Contact Number"
  );
  password = helperMethodsForUsers.checkString(password, "Password");

  password = await helperMethodsForUsers.encryptPassword(password);

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    dateOfBirth: dateOfBirth, // 01-01-1999 (> 13 years old)
    contactNumber: contactNumber,
    password: password,
  };

  const userCollection = await users();
  const newInsertInformation = await userCollection.insertOne(newUser);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedUser: true };
};

const get = async (userID) => {
  userID = helperMethodsForUsers.checkString(userID);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(userID) });
  if (!user) throw "Error: user not found";
  return user;
};

const update = async (
  userID,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth, // 01-01-1999 (> 13 years old)
  contactNumber,
  password
) => {};

const check = async (email, password) => {
  // helperMethodsForUsers
  email = helperMethodsForUsers.checkString(email, "Email Address");
  password = helperMethodsForUsers.checkString(password, "Password");

  const userCollection = await users();
  const user = await userCollection.findOne({ email: email });
  if (!user) throw "Error: Either the email address or password is invalid.";

  const hashed_pw = user.password;
  const valid = await helperMethodsForUsers.comparePassword(
    password,
    hashed_pw
  );

  if (!valid) throw "Error: Either the email address or password is invalid.";

  const userInfo = {
    userID: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  return userInfo;
};

export { create, get, update, check };
