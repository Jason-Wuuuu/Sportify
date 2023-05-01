    import { Router } from "express";
import * as userData from "../data/user/users.js";
import * as eventsData from "../data/user/events.js";
import * as sportsData from "../data/user/sports.js";
import * as classesData from "../data/user/classes.js";
import { helperMethodsForUsers } from "../data/user/helpers.js";
import * as sportsplaceData from "../data/user/sportPlaces.js";

const router = Router();

// functions
const getGenderOptions = (selected) => {
  let options = [
    "male",
    "female",
    "transgender",
    "non-binary",
    "prefer not to respond",
  ];
  if (selected) {
    const index = options.indexOf(selected);
    if (!index === -1) throw `Error: ${selected} not found in gender`;
    options.splice(index, 1);
  }
  return options;
};

// http://localhost:3000/
router.route("/").get(async (req, res) => {
  const userInfo = req.session.user;
  const sportsInfo = await sportsData.getAll();
  if (!sportsInfo) {
    sportsInfo = [];
  }
  if (userInfo) {
    const user = await userData.get(userInfo.userID);
    return res.render("homepage", {
      title: "Sportify",
      userFirstName: user.firstName,
      authenticated: true,
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
    return res.render("register", {
      title: "Register",
      genderOptions: getGenderOptions(),
    });
  })
  .post(async (req, res) => {
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return tus(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

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

      await helperMethodsForUsers.checkUsedEmail(userInfo.emailInput);
    } catch (e) {
      const options = getGenderOptions(userInfo.genderInput);

      return res.status(400).render("register", {
        title: "Register",
        hidden: "",
        error: e,
        firstName: userInfo.firstNameInput,
        lastName: userInfo.lastNameInput,
        email: userInfo.emailInput,
        dateOfBirth: userInfo.dateOfBirthInput,
        contactNumber: userInfo.contactNumberInput,
        gender: userInfo.genderInput,
        genderOptions: options,
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
    } catch (e) {
      return res.status(400).render("login", {
        title: "Login",
        hidden: "",
        error: e,
        emailAddress: user.emailAddressInput,
      });
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
        emailAddress: user.emailAddressInput,
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

router.route("/myclasses").get(async (req, res) => {
  let userID = req.session.user.userID;        
  let myClassList = await classesData.getClassesByUserID(userID);
  return res.render("myclasses", {classList : myClassList});
}); 

router.route("/myclasses/:classID")
.get(async (req, res) => {
  let classID = req.params.classID;
  let classObj = await classesData.getClass(classID);
  return res.render("classInfo", {class : classObj});
});

router.route("/myclasses/remove/:classID")
.get(async (req, res) => {
  let userID = req.session.user.userID; 
  let classID = req.params.classID;
  await classesData.removeStudent(classID, userID);
  return res.redirect("/myclasses")
});


router.route("/events/:sports").get(async (req, res) => {
  let sport = req.params.sports;
  let eventList = await eventsData.getEventsBySport(sport);
  return res.render("events", { sport: sport, events: eventList });
});

router.route("/classes/:sports")
.get(async (req, res) => {    
  let sportName = req.params.sports;
  let sportObj = await sportsData.getByName(sportName);
  let sportObjectId = sportObj._id.toString();
  let classList = await classesData.getClassesBySport(sportObjectId);
  return res.render("classes", { sport: sportObj.name, classList : classList});
})
.post(async (req, res) => { 
  let classID = req.body.classId;
  let userID = req.session.user.userID;   
  let result = await classesData.reserve(classID, userID);
  let sportName = req.params.sports;
  let sportObj = await sportsData.getByName(sportName);
  let sportObjectId = sportObj._id.toString();
  let classList = await classesData.getClassesBySport(sportObjectId); 
  return res.render("classes", { sport: sportObj.name, classList : classList, message : result.msg });
});

router.route("/venue/:sports").get(async (req, res) => {
  try {
    req.params.sports = helperMethodsForUsers.checkString(
      req.params.sports,
      "sports Param"
    );
  } catch (e) {
    return res.status(400).render("error", {    
      title: "Error",
      error: e,
    });
  }
  try {
    let sport = req.params.sports;
    let venueList = await sportsplaceData.getSportPlacesBySport(sport);
    return res.render("venue", {
      sport: sport,
      venues: venueList,
      title: "Venue List",
    });
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/venueInfo/:id").get(async (req, res) => {
  try {
    req.params.id = helperMethodsForUsers.checkId(
      req.params.id,
      "sports place id Param"
    );
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  try {
    let sportplaceid = req.params.id;
    let venuedetails = await sportsplaceData.getSportPlace(sportplaceid);
    return res.render("venueInfo", {
      venueinfo: venuedetails,
      title: "Reserve Venue",
    });
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});

export default router;
