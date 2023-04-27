import { users } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { helperMethodsForUsers } from "./helpers.js";

const create = async (
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  contactNumber,
  password
) => {
  firstName = helperMethodsForUsers.checkName(firstName, "First Name");
  lastName = helperMethodsForUsers.checkName(lastName, "Last Name");
  email = helperMethodsForUsers.checkEmail(email, "Email");
  gender = helperMethodsForUsers.checkGender(gender, "Gender");
  dateOfBirth = helperMethodsForUsers.checkDateOfBirth(
    dateOfBirth,
    "Date Of Birth"
  );
  contactNumber = helperMethodsForUsers.checkContactNumber(
    contactNumber,
    "Contact Number"
  );
  password = helperMethodsForUsers.checkPassword(password, "Password");

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
  const user = await get(newId.toString());

  return { userID: user._id.toString(), insertedUser: true };
};

const get = async (userID) => {
  userID = helperMethodsForUsers.checkString(userID);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: new ObjectId(userID) });
  if (!user) throw "Error: user not found";
  return user;
};

const getAll = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  return userList;
};

const update = async (
  userID,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  contactNumber,
  password
) => {};

const check = async (email, password) => {
  email = helperMethodsForUsers.checkEmail(email, "Email Address");
  password = helperMethodsForUsers.checkPassword(password, "Password");

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

export { create, get, getAll, update, check };
