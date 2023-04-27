import { admins } from "../../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation, { passwordMethods, checkUsedEmail } from "./helpers.js";

const create = async (
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  contactNumber,
  password
) => {
  // validation
  firstName = validation.checkString(firstName, "First Name");
  lastName = validation.checkString(lastName, "Last Name");
  email = validation.checkEmail(email, "Email");
  gender = validation.checkGender(gender, "Gender");
  dateOfBirth = validation.checkDateOfBirth(dateOfBirth, "Date Of Birth");
  contactNumber = validation.checkContactNumber(
    contactNumber,
    "Contact Number"
  );
  password = validation.checkPassword(password, "Password");

  // check if email has already been used
  await checkUsedEmail(email);

  // encrypt password
  password = await passwordMethods.encrypt(password);

  // add valid admin to db
  let newAdmin = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    gender: gender,
    dateOfBirth: dateOfBirth,
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

const update = async (
  adminID,
  firstName,
  lastName,
  email,
  gender,
  dateOfBirth,
  contactNumber,
  password
) => {
  // validation
  adminID = validation.checkId(adminID);
  firstName = validation.checkString(firstName, "First Name");
  lastName = validation.checkString(lastName, "Last Name");
  email = validation.checkEmail(email, "Email");
  gender = validation.checkGender(gender, "Gender");
  dateOfBirth = validation.checkDateOfBirth(dateOfBirth, "Date Of Birth");
  contactNumber = validation.checkContactNumber(
    contactNumber,
    "Contact Number"
  );
  password = validation.checkPassword(password, "Password");

  // check email duplicate only when changing the email
  let admin = await get(adminID);
  if (email !== admin.email) await checkUsedEmail(email);

  // encrypt password
  password = await passwordMethods.encrypt(password);

  const adminCollection = await admins();
  const updatedInfo = await adminCollection.findOneAndUpdate(
    { _id: new ObjectId(adminID) },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        gender: gender,
        dateOfBirth: dateOfBirth,
        contactNumber: contactNumber,
        password: password,
      },
    },
    { returnDocument: "after" }
  );
  if (updatedInfo.lastErrorObject.n === 0) {
    throw `Error: no admin exists with an id of ${adminID}.`;
  }
  return { updatedAdmin: true };
};

const check = async (email, password) => {
  // validation
  email = validation.checkEmail(email, "Email Address");
  password = validation.checkPassword(password, "Password");

  const adminCollection = await admins();
  const admin = await adminCollection.findOne({ email: email });
  if (!admin) throw "Error: Either the email address or password is invalid.";

  const hashed_pw = admin.password;
  const valid = await passwordMethods.compare(password, hashed_pw);

  if (!valid) throw "Error: Either the email address or password is invalid.";

  const adminInfo = {
    adminID: admin._id,
  };

  return adminInfo;
};

export { create, getAll, get, update, check };
