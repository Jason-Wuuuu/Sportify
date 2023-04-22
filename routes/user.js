import { Router } from "express";
import * as userData from "../data/user/users.js";
import { helperMethodsForUsers } from "../data/user/helpers.js";

const router = Router();

router.route("/").get(async (req, res) => {
  const userInfo = req.session.user;
  if (userInfo) {
    return res.render("homepage", {
      title: "Homepage",
      authenticated: true,
      firstName: userInfo.firstName,
    });
  } else {
    return res.render("homepage", {
      title: "Homepage",
      authenticated: false,
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
      userInfo.firstNameInput = helperMethodsForUsers.checkString(
        userInfo.firstNameInput,
        "First Name"
      );
      userInfo.lastNameInput = helperMethodsForUsers.checkString(
        userInfo.lastNameInput,
        "Last Name"
      );
      userInfo.emailInput = helperMethodsForUsers.checkString(
        userInfo.emailInput,
        "Email"
      );
      userInfo.dateOfBirthInput = helperMethodsForUsers.checkString(
        userInfo.dateOfBirthInput,
        "Date Of Birth"
      );
      userInfo.contactNumberInput = helperMethodsForUsers.checkString(
        userInfo.contactNumberInput,
        "Contact Number"
      );
      userInfo.genderInput = helperMethodsForUsers.checkString(
        userInfo.genderInput,
        "Gender"
      );
      userInfo.passwordInput = helperMethodsForUsers.checkString(
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
      user.emailAddressInput = helperMethodsForUsers.checkString(
        user.emailAddressInput,
        "Email Address"
      );

      user.passwordInput = helperMethodsForUsers.checkString(
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

export default router;
