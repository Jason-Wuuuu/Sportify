import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const validationMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== "string") throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },

  checkDateOfBirth(dateOfBirth) {},

  checkAge(dateOfBirth) {},

  checkEmail(email) {
    this.checkString(email);
  },

  checkGender(gender) {},

  checkContactNumber(contactNumber) {},

  checkPassword(password) {
    this.checkString(password);
  },
};

export const passwordMethods = {
  async encrypt(password, sr = 10) {
    const saltRounds = sr;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  },

  async compare(orig_pw, hashed_pw) {
    return await bcrypt.compare(orig_pw, hashed_pw);
  },
};

export default validationMethods;
