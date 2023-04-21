import bcrypt from "bcrypt";

const generalHelperMethods = {};

const helperMethodsForUsers = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },

  async encryptPassword(password, sr = 10) {
    const saltRounds = sr;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  },

  async comparePassword(orig_pw, hashed_pw) {
    return await bcrypt.compare(orig_pw, hashed_pw);
  },
};

const helperMethodsForClasses = {};

const helperMethodsForEvents = {};

const helperMethodsForSportPlaceIDs = {};

export {
  generalHelperMethods,
  helperMethodsForUsers,
  helperMethodsForClasses,
  helperMethodsForEvents,
  helperMethodsForSportPlaceIDs,
};
