import { admins } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation, { passwordMethods } from "./helpers.js";

const create = async (
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth, // 01-01-1999 (> 13 years old)
  contactNumber,
  password
) => {
  // validation
  firstName = validation.checkString(firstName, "firstName");
  lastName = validation.checkString(lastName, "lastName");
  email = validation.checkString(email, "email");
  gender = validation.checkString(gender, "gender");
  dateOfBirth = validation.checkString(dateOfBirth, "dateOfBirth");
  contactNumber = validation.checkString(contactNumber, "contactNumber");
  password = validation.checkString(password, "password");

  password = await passwordMethods.encrypt(password);

  let newAdmin = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    dateOfBirth: dateOfBirth, // 01-01-1999 (> 13 years old)
    contactNumber: contactNumber,
    password: password,
  };

  const adminCollection = await admins();
  const newInsertInformation = await adminCollection.insertOne(newAdmin);
  const newId = newInsertInformation.insertedId;
  await get(newId.toString());

  return { insertedAdmin: true };
};

const getAll = async () => {
  const adminCollection = await admins();
  const adminList = await adminCollection.find({}).toArray();
  return adminList;
};

const get = async (adminID) => {
  adminID = validation.checkId(adminID);
  const adminCollection = await admins();
  const admin = await adminCollection.findOne({ _id: new ObjectId(adminID) });
  if (!admin) throw "Error: Admin not found";
  return admin;
};

const remove = async (adminID) => {
  adminID = validation.checkId(adminID);
  const adminCollection = await admins();
  const deletionInfo = await adminCollection.findOneAndDelete({
    _id: new ObjectId(adminID),
  });
  if (deletionInfo.lastErrorObject.n === 0)
    throw [404, `Error: Could not delete admin with id of ${adminID}`];

  return { ...deletionInfo.value, deleted: true };
};

const update = async (
  adminID,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth, // 01-01-1999 (> 13 years old)
  contactNumber,
  password
) => {};

const check = async (email, password) => {
  // validation
  email = validation.checkString(email, "Email Address");
  password = validation.checkString(password, "Password");

  const adminCollection = await admins();
  const admin = await adminCollection.findOne({ email: email });
  if (!admin) throw "Error: Either the email address or password is invalid.";

  const hashed_pw = admin.password;
  const valid = await passwordMethods.compare(password, hashed_pw);

  if (!valid) throw "Error: Either the email address or password is invalid.";

  const adminInfo = {
    adminID: admin._id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
  };

  return adminInfo;
};

export { create, getAll, get, remove, update, check };
