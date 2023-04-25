import bcrypt from "bcrypt";
const helperMethodsForSports = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },
};

const helperMethodsForClasses = {};

const helperMethodsForEvents = {};

const helperMethodsForSportPlaceIDs = {};

const helperMethodsForUsers = {
  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  },

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

  checkName(name, varName) {
    name = this.checkString(name, varName);

    const re_name = /[a-zA-Z ]{2,25}/g;
    if (!name.match(re_name))
      throw `Error: ${varName} should be at least 2 characters long with a max of 25 characters`;

    return name;
  },

  checkEmail(email, varName) {
    email = this.checkString(email, varName);

    const re_email = /[\S]+@[\S]+\.[\S]+/g;
    if (!email.match(re_email)) throw `Error: invalid ${varName}`;

    return email.toLowerCase();
  },

  checkDateOfBirth(dateOfBirth, varName) {
    dateOfBirth = this.checkString(dateOfBirth, varName);

    const dob = new Date(dateOfBirth);
    if (!dob) throw `Error: Invalid ${varName}.`;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0
    var yyyy = today.getFullYear() - 13; // user shouldn't be less than 13 year-old

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const minDate = new Date("1900-01-01");
    const maxDate = new Date(`${yyyy + "-" + mm + "-" + dd}`);

    if (dob < minDate || dob > maxDate)
      throw `Error: Invalid ${varName}. Make sure you're over 13 years old.`;

    return dateOfBirth;
  },

  checkContactNumber(contactNumber, varName) {
    contactNumber = this.checkString(contactNumber, varName);

    contactNumber = contactNumber.replace(" ", "");
    const re_contactNumber = /^[\d]{8,20}$/g;
    if (!contactNumber.match(re_contactNumber))
      throw `Error: invalid ${varName}`;
    return contactNumber;
  },

  checkGender(gender, varName) {
    gender = this.checkString(gender, varName);
    gender = gender.toLowerCase();

    const gender_domain = [
      "male",
      "female",
      "transgender",
      "non-binary",
      "prefer not to respond",
    ];

    if (!gender_domain.includes(gender)) throw `Error: invalid ${varName}`;

    return gender;
  },

  checkPassword(password, varName) {
    password = this.checkString(password, varName);
    return password;
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

export {
  helperMethodsForUsers,
  helperMethodsForClasses,
  helperMethodsForEvents,
  helperMethodsForSportPlaceIDs,
  helperMethodsForSports,
};
