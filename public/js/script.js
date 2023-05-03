// client side validation function

const checkId = (id, varName) => {
  if (!id) throw `Error: You must provide a ${varName}`;
  if (typeof id !== "string") throw `Error:${varName} must be a string`;
  id = id.trim();
  if (id.length === 0)
    throw `Error: ${varName} cannot be an empty string or just spaces`;
  return id;
};

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
const checkEventName = (name, varName) => {
  name = checkString(name, varName);
  let newname = name;
  newname = newname.replace(/\s+/g, "");

  if (!/\D/.test(newname))
    throw `Error: ${varName} cannot only contain numbers`;

  return name;
};

const checkNumber = (numVal, varName) => {
  if (!numVal && numVal !== 0) throw `Error: You must supply a ${varName}!`;
  if (typeof numVal !== "number") {
    try {
      numVal = Number.parseInt(numVal);
    } catch (e) {
      throw `Error: Unable to convert ${varName} to number`;
    }
  }
  if (isNaN(numVal)) throw `Error: ${varName} is not a number.`;
  return numVal;
};

const checkTitle = (title, varName) => {
  title = checkString(title, varName);
  if (Number.parseInt(title))
    throw `Error: ${varName} shouldn't be only numbers.`;
  return title;
};

const checkURL = (url, varName) => {
  url = checkString(url, varName);

  const re_url = /[\/\S]+/g;
  if (!url.match(re_url))
    throw `Error: ${varName} is and invalid url or contains spaces.`;
  return url;
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
  if (!contactNumber.match(re_contactNumber))
    throw `Error: ${varName} should contain only digits.`;
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

  const re_password = /[\S]{8,}/g;
  if (!password.match(re_password))
    throw `Error: ${varName} should be a minimum of 8 characters long`;

  const re_upper = /[A-Z]/g;
  if (!re_upper.test(password))
    throw `Error: ${varName} should contain at least one uppercase character`;

  const re_lower = /[a-z]/g;
  if (!re_lower.test(password))
    throw `Error: ${varName} should contain at least one lowercase character`;

  const re_specialChar = /[^a-zA-Z\d\s]/g;
  if (!re_specialChar.test(password))
    throw `Error: ${varName} should contain at least one special character`;

  return password;
};

const checkInviteCode = (inviteCode) => {
  inviteCode = checkString(inviteCode);
  if (inviteCode !== "admin")
    throw "Error: Seems like you don't have the correct invite code.";

  return inviteCode;
};

const checkCapacity = (capacity, varName) => {
  capacity = checkNumber(capacity, varName);
  if (capacity < 1) throw `Error: ${varName} should be greater than 1.`;
  return capacity;
};

const checkPrice = (price, varName) => {
  price = checkNumber(price, varName);
  if (price < 0) throw `Error: ${varName} should be greater than 0.`;
  return price;
};

const checkDate = (date, varName) => {
  date = checkString(date, varName);

  const d = new Date(date);
  if (!d) throw `Error: Invalid ${varName}.`;

  const today = new Date();
  if (d < today) throw `Error: Valid date starts from tomorrow.`;

  return date;
};

const checkTime = (time, varName) => {
  time = checkString(time, varName);

  const hr_min = time.split(":");
  if (!hr_min || hr_min.length !== 2) throw `Error: Invalid ${varName}`;

  const hr = Number.parseInt(hr_min[0]);
  const min = Number.parseInt(hr_min[1]);
  if (isNaN(hr) || hr < 0 || hr > 24) throw `Error: Invalid hr for ${varName}`;
  if (isNaN(min) || min < 0 || min > 59)
    throw `Error: Invalid min for ${varName}`;

  return time;
};

const checkEventTime = (time, varName) => {
  time = checkString(time, varName);
  const hr_min = time.split(":");
  if (!hr_min || hr_min.length !== 2) throw `Error: Invalid ${varName}`;

  const hr = Number.parseInt(hr_min[0]);
  const min = Number.parseInt(hr_min[1]);
  if (isNaN(hr) || hr < 0 || hr > 24) throw `Error: Invalid hr for ${varName}`;
  if (isNaN(min) || min < 0 || min > 59)
    throw `Error: Invalid min for ${varName}`;

  return time;
};

const checkTimeRange = (start, end) => {
  const s = new Date(`2000-01-01 ${start}`);
  const e = new Date(`2000-01-01 ${end}`);
  if (e <= s)
    throw `Error: Invalid Time Range. Start time cannot exceed end time.`;
};

// maximum date
const get_valid_date_range = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0
  let yyyy = today.getFullYear() - 13; // user shouldn't be less than 13 year-old

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

  // Add / Edit Buttons
  let expand = document.getElementById("expand");
  if (expand) {
    expand.addEventListener("click", (event) => {
      let formDiv = document.getElementById("form");
      let errorDiv = document.getElementById("error");

      if (formDiv.hidden) {
        formDiv.hidden = false;
        errorDiv.hidden = false;
      } else {
        formDiv.hidden = true;
        errorDiv.hidden = true;
      }
    });
  }

  // forms
  // login-form
  let loginForm = document.getElementById("admin-login-form");
  if (loginForm) {
    // get elements
    let emailInput = document.getElementById("emailAddressInput");
    emailInput.focus();
    let passwordInput = document.getElementById("passwordInput");
    // submit
    loginForm.addEventListener("submit", (event) => {
      // get values
      let email = emailInput.value;
      let password = passwordInput.value;
      try {
        email = checkEmail(email, "email");
        password = checkString(password, "password");
      } catch (e) {
        event.preventDefault();
        if (email) {
          emailInput.value = email;
          passwordInput.focus();
        } else {
          emailInput.focus();
        }
        show_error(e);
      }
    });
  }

  // register and profile
  let adminInfo = document.getElementById("admin-info-form");
  if (adminInfo) {
    console.log("We found an admin-info-form");
    // get elements
    let firstNameInput = document.getElementById("firstNameInput");
    let lastNameInput = document.getElementById("lastNameInput");
    let emailInput = document.getElementById("emailInput");
    let dateOfBirthInput = document.getElementById("dateOfBirthInput");
    let contactNumberInput = document.getElementById("contactNumberInput");
    let genderInput = document.getElementById("genderInput");
    let passwordInput = document.getElementById("passwordInput");
    let confirmPasswordInput = document.getElementById("confirmPasswordInput");
    let inviteCodeInput = document.getElementById("inviteCodeInput");

    // get valid range for date
    const { min, max } = get_valid_date_range();
    dateOfBirthInput.setAttribute("min", min);
    dateOfBirthInput.setAttribute("max", max);

    // submit
    adminInfo.addEventListener("submit", (event) => {
      // get values
      let firstName = firstNameInput.value;
      let lastName = lastNameInput.value;
      let email = emailInput.value;
      let dateOfBirth = dateOfBirthInput.value;
      let contactNumber = contactNumberInput.value;
      let gender = genderInput.value;
      let password = passwordInput.value;
      let confirmPassword = confirmPasswordInput.value;
      let inviteCode = undefined;
      if (inviteCodeInput) inviteCode = inviteCodeInput.value;

      // validation
      try {
        firstName = checkName(firstName, "First Name");
        lastName = checkName(lastName, "Last Name");
        email = checkEmail(email, "Email");
        dateOfBirth = checkDateOfBirth(dateOfBirth, "Date Of Birth");
        contactNumber = checkContactNumber(contactNumber, "Contact Number");
        gender = checkGender(gender, "Gender");
        password = checkPassword(password, "Password");
        confirmPassword = checkString(confirmPassword, "Confirm Password");
        if (inviteCode) inviteCode = checkInviteCode(inviteCode, "Invite Code");

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

  // sports and sportInfo (AJAX)
  (function ($) {
    let mySportForm = $("#sport-form"),
      newNameInput = $("#nameInput"),
      newThumbnailInput = $("#thumbnailInput"),
      url = window.location.href;

    // sport form submission event
    mySportForm.submit(function (event) {
      event.preventDefault();

      let newName = newNameInput.val();
      let newThumbnail = newThumbnailInput.val();
      //validation
      try {
        newName = checkTitle(newName, "Name");
        if (newThumbnail) newThumbnail = checkURL(newThumbnail, "Thumbnail");

        if (newName) {
          //set up AJAX request config
          $.ajax({
            method: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify({
              nameInput: newName,
              thumbnailInput: newThumbnail,
            }),
            success: function (res) {
              window.location.href = url;
            },
          });
        }
      } catch (e) {
        event.preventDefault();
        show_error(e);
      }
    });
  })(window.jQuery);

  /*
    // get elements
    let nameInput = document.getElementById("nameInput");
    let thumbnailInput = document.getElementById("thumbnailInput");

    // submit
    sportInfo.addEventListener("submit", (event) => {
      // get values
      let name = nameInput.value;
      let thumbnail = undefined;
      if (thumbnailInput) thumbnail = thumbnailInput.value;

      //validation
      try {
        name = checkTitle(name, "Name");
        if (thumbnail) thumbnail = checkURL(thumbnail, "Thumbnail");
      } catch (e) {
        event.preventDefault();
        if (name) nameInput.value = name;
        if (thumbnail) thumbnailInput.value = thumbnail;
        show_error(e);
      }
    });
  */

  // sportPlaces and sportPlaceInfo
  let sportPlaceInfo = document.getElementById("sportPlace-form");
  if (sportPlaceInfo) {
    // get elements
    let nameInput = document.getElementById("nameInput");
    let sportIDInput = document.getElementById("sportIDInput");
    let addressInput = document.getElementById("addressInput");
    let descriptionInput = document.getElementById("descriptionInput");
    let capacityInput = document.getElementById("capacityInput");
    let priceInput = document.getElementById("priceInput");
    let thumbnailInput = document.getElementById("thumbnailInput");

    // submit
    sportPlaceInfo.addEventListener("submit", (event) => {
      // get values
      let name = nameInput.value;
      let sportID = sportIDInput.value;
      let address = addressInput.value;
      let description = descriptionInput.value;
      let capacity = capacityInput.value;
      let price = priceInput.value;
      let thumbnail = undefined;
      if (thumbnailInput) thumbnail = thumbnailInput.value;

      //validation
      try {
        name = checkString(name, "Name");
        sportID = checkString(sportID, "SportID");
        address = checkString(address, "Address");
        description = checkString(description, "Description");
        capacity = checkCapacity(capacity, "Capacity");
        price = checkPrice(price, "Price");
        if (thumbnail) thumbnail = checkURL(thumbnail, "Thumbnail");
      } catch (e) {
        event.preventDefault();
        if (name) nameInput.value = name;
        if (address) addressInput.value = address;
        if (description) descriptionInput.value = description;
        if (capacity) capacityInput.value = capacity;
        if (price) priceInput.value = price;
        if (thumbnail) thumbnailInput.value = thumbnail;
        show_error(e);
      }
    });
  }

  // classes and classInfo
  let classInfo = document.getElementById("class-form");
  if (classInfo) {
    // get elements
    let titleInput = document.getElementById("titleInput");
    let sportIDInput = document.getElementById("sportIDInput");
    let sportPlaceIDInput = document.getElementById("sportPlaceIDInput");
    let capacityInput = document.getElementById("capacityInput");
    let instructorInput = document.getElementById("instructorInput");
    let priceInput = document.getElementById("priceInput");
    let dateInput = document.getElementById("dateInput");
    let startTimeInput = document.getElementById("startTimeInput");
    let endTimeInput = document.getElementById("endTimeInput");
    let thumbnailInput = document.getElementById("thumbnailInput");

    const today = new Date();
    let dd = today.getDate() + 1;
    let mm = today.getMonth() + 1; //January is 0
    let yyyy = today.getFullYear();
    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;
    dateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);

    // submit
    classInfo.addEventListener("submit", (event) => {
      // get values
      let title = titleInput.value;
      let sportID = sportIDInput.value;
      let sportPlaceID = sportPlaceIDInput.value;
      let capacity = capacityInput.value;
      let instructor = instructorInput.value;
      let price = priceInput.value;
      let date = dateInput.value;
      let startTime = startTimeInput.value;
      let endTime = endTimeInput.value;
      let thumbnail = undefined;
      if (thumbnailInput) thumbnail = thumbnailInput.value;

      //validation
      try {
        title = checkString(title, "Title");
        sportID = checkString(sportID, "SportID");
        sportPlaceID = checkString(sportPlaceID, "Sport PlaceID");
        capacity = checkCapacity(capacity, "Capacity");
        instructor = checkName(instructor, "Instructor");
        price = checkPrice(price, "Price");
        date = checkDate(date, "Date");
        startTime = checkTime(startTime, "Start Time");
        endTime = checkTime(endTime, "End Time");
        checkTimeRange(startTime, endTime);
        if (thumbnail) thumbnail = checkURL(thumbnail, "Thumbnail");
      } catch (e) {
        event.preventDefault();
        if (title) titleInput.value = title;
        if (capacity) capacityInput.value = capacity;
        if (instructor) instructorInput.value = instructor;
        if (price) priceInput.value = price;
        if (date) dateInput.value = date;
        if (startTime) startTimeInput.value = startTime;
        if (endTime) endTimeInput.value = endTime;
        if (thumbnail) thumbnailInput.value = thumbnail;
        show_error(e);
      }
    });
  }
}
//client side js for user
else {
  //myeventspage
  const participantlinks = document.querySelectorAll("a.togglelist");

  participantlinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      let curElement = event.target;
      console.log(curElement);
      let nextDiv =
        curElement.parentNode.parentNode.parentNode.parentNode
          .nextElementSibling;

      if (nextDiv.style.display === "none") {
        nextDiv.style.display = "block";
        curElement.innerHTML = "Hide Participants List";
      } else {
        nextDiv.style.display = "none";
        curElement.innerHTML = "See Participants List";
      }
    });
  });

  //homepage
  const links = document.querySelectorAll("a.err");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      let error = document.getElementById("error-msg");
      error.textContent = "Please Log-In or SignUp to see next page.";
    });
  });

  //addevents/updateevnt forms
  let eventform = document.getElementById("addeventform");
  if (eventform) {
    eventform.addEventListener("submit", (event) => {
      let errorDiv = document.getElementById("errors");
      let userID = document.getElementById("owner").value;
      let eventname = document.getElementById("eventname").value;
      let description = document.getElementById("desc").value;
      let sports = document.getElementById("sportname").value;
      let place = document.getElementById("sportPlace").value;
      let capacity = document.getElementById("CapacityInput").value;
      let date = document.getElementById("dateinput").value;
      let startTime = document.getElementById("startTime").value;
      let endTime = document.getElementById("endTime").value;
      let url = document.getElementById("thumbnail").value;
      try {
        // hide containers by default
        errorDiv.hidden = true;
        userID = checkId(userID, "UserID");
        eventname = checkEventName(eventname, "EventName");
        description = checkEventName(description, "Description");
        sports = checkString(sports, "Sports");
        place = checkString(place, "Event Place");
        capacity = checkCapacity(capacity, "Event Capacity");
        date = checkDate(date, "Event Date");
        startTime = checkEventTime(startTime, "Start Time of Event");
        endTime = checkEventTime(endTime, "End Time of Event");
        url = checkURL(url, "Thumbnail Url");
        let correcttime = checkTimeRange(startTime, endTime);
      } catch (e) {
        event.preventDefault();
        errorDiv.textContent = e;
        errorDiv.hidden = false;
      }
    });
  }

  // error showing function
  const show_error = (err_msg) => {
    let errorDiv = document.getElementById("error");
    errorDiv.hidden = false;
    errorDiv.innerHTML = err_msg;
  };

  // Edit Button
  let expand = document.getElementById("expand");
  if (expand) {
    expand.addEventListener("click", (event) => {
      let formDiv = document.getElementById("form");
      let errorDiv = document.getElementById("error");

      if (formDiv.hidden) {
        formDiv.hidden = false;
        errorDiv.hidden = false;
      } else {
        formDiv.hidden = true;
        errorDiv.hidden = true;
      }
    });
  }

  // login-form
  let loginForm = document.getElementById("user-login-form");
  if (loginForm) {
    console.log("We found a user-login-form");
    // get elements
    let emailInput = document.getElementById("emailAddressInput");
    emailInput.focus();
    let passwordInput = document.getElementById("passwordInput");
    // submit
    loginForm.addEventListener("submit", (event) => {
      // get values
      let email = emailInput.value;
      let password = passwordInput.value;
      try {
        email = checkEmail(email, "email");
        password = checkString(password, "password");
      } catch (e) {
        event.preventDefault();
        if (email) {
          emailInput.value = email;
          passwordInput.focus();
        } else {
          emailInput.focus();
        }
        show_error(e);
      }
    });
  }

  // register and profile
  let userInfo = document.getElementById("user-info-form");
  if (userInfo) {
    console.log("We found an user-info-form");
    // get elements
    let firstNameInput = document.getElementById("firstNameInput");
    let lastNameInput = document.getElementById("lastNameInput");
    let emailInput = document.getElementById("emailInput");
    let dateOfBirthInput = document.getElementById("dateOfBirthInput");
    let contactNumberInput = document.getElementById("contactNumberInput");
    let genderInput = document.getElementById("genderInput");
    let passwordInput = document.getElementById("passwordInput");
    let confirmPasswordInput = document.getElementById("confirmPasswordInput");
    let inviteCodeInput = document.getElementById("inviteCodeInput");

    // get valid range for date
    const { min, max } = get_valid_date_range();
    dateOfBirthInput.setAttribute("min", min);
    dateOfBirthInput.setAttribute("max", max);

    // submit
    userInfo.addEventListener("submit", (event) => {
      // get values
      let firstName = firstNameInput.value;
      let lastName = lastNameInput.value;
      let email = emailInput.value;
      let dateOfBirth = dateOfBirthInput.value;
      let contactNumber = contactNumberInput.value;
      let gender = genderInput.value;
      let password = passwordInput.value;
      let confirmPassword = confirmPasswordInput.value;
      let inviteCode = undefined;
      if (inviteCodeInput) inviteCode = inviteCodeInput.value;

      // validation
      try {
        firstName = checkName(firstName, "First Name");
        lastName = checkName(lastName, "Last Name");
        email = checkEmail(email, "Email");
        dateOfBirth = checkDateOfBirth(dateOfBirth, "Date Of Birth");
        contactNumber = checkContactNumber(contactNumber, "Contact Number");
        gender = checkGender(gender, "Gender");
        password = checkPassword(password, "Password");
        confirmPassword = checkString(confirmPassword, "Confirm Password");
        if (inviteCode) inviteCode = checkInviteCode(inviteCode, "Invite Code");

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
}
