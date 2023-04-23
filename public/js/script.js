// client side validation function
const checkString = (strVal, varName) => {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  return strVal;
};

const checkName = (name, varName) => {
  name = checkString(name, varName);

  const re_name = /[a-zA-Z ]{2,25}/g;
  if (!name.match(re_name))
    throw `Error: ${varName} should be at least 2 characters long with a max of 25 characters`;

  return name;
};

const checkEmail = (email, varName) => {
  email = checkString(email, varName);

  const re_email = /[\S]+@[\S]+\.[\S]+/g;
  if (!email.match(re_email)) throw `Error: invalid ${varName}`;

  return email.toLowerCase();
};

const checkDateOfBirth = (dateOfBirth, varName) => {
  dateOfBirth = checkString(dateOfBirth, varName);
  const { min, max } = get_valid_date_range();

  const dob = new Date(dateOfBirth);
  const minDate = new Date(min);
  const maxDate = new Date(max);

  if (dob < minDate || dob > maxDate)
    throw `Error: Invalid ${varName}. Make sure you're over 13 years old.`;
  return dateOfBirth;
};

const checkContactNumber = (contactNumber, varName) => {
  contactNumber = checkString(contactNumber, varName);

  contactNumber = contactNumber.replace(" ", "");
  const re_contactNumber = /^[\d]{8,20}$/g;
  if (!contactNumber.match(re_contactNumber)) throw `Error: invalid ${varName}`;
  return contactNumber;
};

const checkGender = (gender, varName) => {
  gender = checkString(gender, varName);
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
};

const checkPassword = (password, varName) => {
  password = checkString(password, varName);
  return password;
};

const checkInviteCode = (inviteCode) => {
  inviteCode = checkString(inviteCode);
  if (inviteCode !== "admin")
    throw "Error: Seems like you don't have the correct invite code.";

  return inviteCode;
};

// maximum date
const get_valid_date_range = () => {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0
  var yyyy = today.getFullYear() - 13; // user shouldn't be less than 13 year-old

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const min = "1900-01-01";
  const max = yyyy + "-" + mm + "-" + dd;

  return { min, max };
};

//client side js for admin
if (document.URL.includes("/admin")) {
  // error showing function
  const show_error = (err_msg) => {
    let errorDiv = document.getElementById("error");
    errorDiv.hidden = false;
    errorDiv.innerHTML = err_msg;
  };

  // Registration forms
  if (document.title === "Register" || document.title === "Profile") {
    let registrationForm = document.getElementById("admin-registration-form");
    let adminEditForm = document.getElementById("admin-edit-form");

    let firstNameInput = document.getElementById("firstNameInput");
    let lastNameInput = document.getElementById("lastNameInput");
    let emailInput = document.getElementById("emailInput");
    let dateOfBirthInput = document.getElementById("dateOfBirthInput");
    let contactNumberInput = document.getElementById("contactNumberInput");
    let genderInput = document.getElementById("genderInput");
    let passwordInput = document.getElementById("passwordInput");
    let confirmPasswordInput = document.getElementById("confirmPasswordInput");

    // get valid range for date
    const { min, max } = get_valid_date_range();
    dateOfBirthInput.setAttribute("min", min);
    dateOfBirthInput.setAttribute("max", max);

    if (registrationForm) {
      console.log("admin registration form");
      let inviteCodeInput = document.getElementById("inviteCodeInput");

      registrationForm.addEventListener("submit", (event) => {
        let firstName = firstNameInput.value;
        let lastName = lastNameInput.value;
        let email = emailInput.value;
        let dateOfBirth = dateOfBirthInput.value;
        let contactNumber = contactNumberInput.value;
        let gender = genderInput.value;
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;
        let inviteCode = inviteCodeInput.value;

        try {
          firstName = checkName(firstName, "First Name");
          lastName = checkName(lastName, "Last Name");
          email = checkEmail(email, "Email");
          dateOfBirth = checkDateOfBirth(dateOfBirth, "Date Of Birth");
          contactNumber = checkContactNumber(contactNumber, "Contact Number");
          gender = checkGender(gender, "Gender");
          password = checkPassword(password, "Password");
          confirmPassword = checkPassword(confirmPassword, "Confirm Password");
          inviteCode = checkInviteCode(inviteCode, "Invite Code");

          if (password !== confirmPassword)
            throw "Error: Confirm password and password does not match.";
        } catch (e) {
          event.preventDefault();

          if (firstName) firstNameInput.value = firstName;
          if (lastName) lastNameInput.value = lastName;
          if (email) emailInput.value = email;
          if (gender) genderInput.value = gender;
          if (dateOfBirth) dateOfBirthInput.value = dateOfBirth;
          if (contactNumber) contactNumberInput.value = contactNumber;
          if (password) passwordInput.value = password;
          confirmPasswordInput.value = "";
          if (inviteCode) inviteCodeInput.value = inviteCode;

          show_error(e);
        }
      });
    }

    if (adminEditForm) {
      console.log("admin edit form");
      adminEditForm.addEventListener("submit", (event) => {
        let firstName = firstNameInput.value;
        let lastName = lastNameInput.value;
        let email = emailInput.value;
        let dateOfBirth = dateOfBirthInput.value;
        let contactNumber = contactNumberInput.value;
        let gender = genderInput.value;
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;

        try {
          firstName = checkName(firstName, "First Name");
          lastName = checkName(lastName, "Last Name");
          email = checkEmail(email, "Email");
          dateOfBirth = checkDateOfBirth(dateOfBirth, "Date Of Birth");
          contactNumber = checkContactNumber(contactNumber, "Contact Number");
          gender = checkGender(gender, "Gender");
          password = checkPassword(password, "Password");
          confirmPassword = checkPassword(confirmPassword, "Confirm Password");

          if (password !== confirmPassword)
            throw "Error: Confirm password and password does not match.";
        } catch (e) {
          event.preventDefault();

          if (firstName) firstNameInput.value = firstName;
          if (lastName) lastNameInput.value = lastName;
          if (email) emailInput.value = email;
          if (gender) genderInput.value = gender;
          if (dateOfBirth) dateOfBirthInput.value = dateOfBirth;
          if (contactNumber) contactNumberInput.value = contactNumber;
          if (password) passwordInput.value = password;
          confirmPasswordInput.value = "";

          show_error(e);
        }
      });
    }
  }

  // login-form
  if (document.title === "Login") {
    let loginForm = document.getElementById("admin-login-form");
    let emailInput = document.getElementById("emailAddressInput");
    let passwordInput = document.getElementById("passwordInput");

    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        let email = emailInput.value;
        let password = passwordInput.value;
        try {
          email = checkEmail(email, "email");
          password = checkString(password, "password");
        } catch (e) {
          event.preventDefault();
          if (email) emailInput.value = email;
          show_error(e);
        }
      });
    }
  }

  // Edit Buttons
  if (
    document.title === "Profile" ||
    document.title === "Sport Info" ||
    document.title === "Class Info" ||
    document.title === "SportPlace Info"
  ) {
    let edit = document.getElementById("edit");
    edit.addEventListener("click", (event) => {
      let editForm = document.getElementById("edit-form");
      let errorDiv = document.getElementById("error");

      if (editForm.hidden) {
        editForm.hidden = false;
        errorDiv.hidden = false;
      } else {
        editForm.hidden = true;
        errorDiv.hidden = true;
      }
    });
  }
}
//client side js for user
else {
}
