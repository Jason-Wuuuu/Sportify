//client side js for admin
if (document.URL.includes("/admin")) {
  // client side validation function
  const checkString = (strVal, varName) => {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
  };

  const checkInviteCode = (inviteCode) => {
    inviteCode = checkString(inviteCode);
    return inviteCode === "admin";
  };

  // error showing function
  const show_error = (err_msg) => {
    let errorDiv = document.getElementById("error");
    errorDiv.hidden = false;
    errorDiv.innerHTML = err_msg;
  };

  // register-form
  if (document.title === "Register") {
    let registrationForm = document.getElementById("admin-registration-form");
    let firstNameInput = document.getElementById("firstNameInput");
    let lastNameInput = document.getElementById("lastNameInput");
    let emailInput = document.getElementById("emailInput");
    let genderInput = document.getElementById("genderInput");
    let dateOfBirthInput = document.getElementById("dateOfBirthInput");
    let contactNumberInput = document.getElementById("contactNumberInput");
    let passwordInput = document.getElementById("passwordInput");
    let confirmPasswordInput = document.getElementById("confirmPasswordInput");
    let inviteCodeInput = document.getElementById("inviteCodeInput");

    if (registrationForm) {
      registrationForm.addEventListener("submit", (event) => {
        let firstName = firstNameInput.value;
        let lastName = lastNameInput.value;
        let email = emailInput.value;
        let gender = genderInput.value;
        let dateOfBirth = dateOfBirthInput.value;
        let contactNumber = contactNumberInput.value;
        let password = passwordInput.value;
        let confirmPassword = confirmPasswordInput.value;
        let inviteCode = inviteCodeInput.value;

        try {
          firstName = checkString(firstName, "First Name");
          lastName = checkString(lastName, "Last Name");
          email = checkString(email, "Email");
          gender = checkString(gender, "Gender");
          dateOfBirth = checkString(dateOfBirth, "Date Of Birth");
          contactNumber = checkString(contactNumber, "Contact Number");
          password = checkString(password, "Password");
          confirmPassword = checkString(confirmPassword, "Confirm Password");
          inviteCode = checkInviteCode(inviteCode, "Invite Code");

          if (password !== confirmPassword)
            throw "Error: Confirm password and password does not match.";

          if (!inviteCode)
            throw "Error: Seems like you don't have the correct invite code.";
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
          inviteCodeInput.value = "";

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
          email = checkString(email, "email");
          password = checkString(password, "password");
        } catch (e) {
          event.preventDefault();
          if (email) emailInput.value = email;
          show_error(e);
        }
      });
    }
  }

  // profile
  if (document.title === "Profile") {
    let edit = document.getElementById("edit");
    edit.addEventListener("click", (event) => {
      let editForm = document.getElementById("admin-edit-form");

      if (editForm.hidden) {
        editForm.hidden = false;
      } else {
        editForm.hidden = true;
      }
    });
  }
}
//client side js for user
else {
}
