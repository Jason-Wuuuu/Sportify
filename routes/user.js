import { Router } from "express";
import * as userData from "../data/user/users.js";
import * as sportsData from "../data/user/sports.js";
import { helperMethodsForUsers } from "../data/user/helpers.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const userInfo = req.session.user;
  const sportsInfo = await sportsData.getAll();
  if (!sportsInfo) {
    sportsInfo = [];
  }
  if (userInfo) {
    return res.render("homepage", {
      title: "Sportify",
      authenticated: true,
      firstName: userInfo.firstName,
      sports: sportsInfo,
    });
  } else {
    return res.render("homepage", {
      title: "Sportify",
      authenticated: false,
      sports: sportsInfo,
    });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    return res.render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    let userInfo = req.body;

    try {
      userInfo.firstNameInput = helperMethodsForUsers.checkName(
        userInfo.firstNameInput,
        "First Name"
      );
      userInfo.lastNameInput = helperMethodsForUsers.checkName(
        userInfo.lastNameInput,
        "Last Name"
      );
      userInfo.emailInput = helperMethodsForUsers.checkEmail(
        userInfo.emailInput,
        "Email"
      );
      userInfo.dateOfBirthInput = helperMethodsForUsers.checkDateOfBirth(
        userInfo.dateOfBirthInput,
        "Date Of Birth"
      );
      userInfo.contactNumberInput = helperMethodsForUsers.checkContactNumber(
        userInfo.contactNumberInput,
        "Contact Number"
      );
      userInfo.genderInput = helperMethodsForUsers.checkGender(
        userInfo.genderInput,
        "Gender"
      );
      userInfo.passwordInput = helperMethodsForUsers.checkPassword(
        userInfo.passwordInput,
        "Password"
      );
    } catch (e) {
      return res.status(400).render("register", {
        title: "Register",
        hidden: "",
        error: e,
        firstName: userInfo.firstNameInput,
        lastName: userInfo.lastNameInput,
        email: userInfo.emailInput,
        dateOfBirth: userInfo.dateOfBirth,
        contactNumber: userInfo.contactNumber,
        gender: userInfo.gender,
        password: userInfo.passwordInput,
      });
    }

    try {
      const newUser = await userData.create(
        userInfo.firstNameInput,
        userInfo.lastNameInput,
        userInfo.emailInput,
        userInfo.genderInput,
        userInfo.dateOfBirthInput,
        userInfo.contactNumberInput,
        userInfo.passwordInput
      );
      if (!newUser.insertedUser) throw "Internal Server Error";
      return res.redirect("login");
    } catch (e) {
      res.sendStatus(500);
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    return res.render("login", { title: "Login" });
  })
  .post(async (req, res) => {
    const user = req.body;

    // input checking
    try {
      user.emailAddressInput = helperMethodsForUsers.checkEmail(
        user.emailAddressInput,
        "Email Address"
      );

      user.passwordInput = helperMethodsForUsers.checkPassword(
        user.passwordInput,
        "Password"
      );
    } catch (error) {
      return res.status(400).render("login", { title: "Login" });
    }
    try {
      const { emailAddressInput, passwordInput } = user;
      const validUser = await userData.check(emailAddressInput, passwordInput);

      req.session.user = validUser;
      return res.redirect("/");
    } catch (e) {
      return res.status(400).render("login", {
        title: "Login",
        hidden: "",
        error: e,
        firstName: user.firstName,
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("logout", { title: "Logout" });
});

router.route("/profile").get(async (req, res) => {
  let userInfo = await userData.get(req.session.user.userID);

  return res.render("profile", {
    title: "Profile",
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    gender: userInfo.gender,
    dateOfBirth: userInfo.dateOfBirth,
    contactNumber: userInfo.contactNumber,
  });
});

export default router;
