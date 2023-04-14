import { admins } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./helpers.js";

const create = async (
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth, // 01-01-1999 (> 13 years old)
  contactNumber
  // password
) => {
  // validation
  firstName = validation.checkString(firstName, "firstName");
  lastName = validation.checkString(lastName, "lastName");
  email = validation.checkString(email, "email");
  gender = validation.checkString(gender, "gender");
  dateOfBirth = validation.checkString(dateOfBirth, "dateOfBirth");
  contactNumber = validation.checkString(contactNumber, "contactNumber");

  let newAdmin = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    dateOfBirth: dateOfBirth, // 01-01-1999 (> 13 years old)
    contactNumber: contactNumber,
    // password: password,
  };

  const adminCollection = await admins();
  const newInsertInformation = await adminCollection.insertOne(newAdmin);
  const newId = newInsertInformation.insertedId;
  return await get(newId.toString());
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

const remove = async (adminID) => {};

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

export { create, getAll, get, remove, update };
