import e, { Router } from "express";
import * as userData from "../data/user/users.js";
import * as eventsData from "../data/user/events.js";
import * as sportsData from "../data/user/sports.js";
import { helperMethodsForUsers } from "../data/user/helpers.js";
import * as validation from "../data/user/helpers.js";
import * as sportsplaceData from "../data/user/sportPlaces.js";
import * as slotsData from "../data/user/timeSlots.js";
import xss from "xss";

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

const applyXSS = (req_body) => {
  Object.keys(req_body).forEach(function (key, index) {
    req_body[key] = xss(req_body[key]);
  });
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
      return tus(400).render("error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // XSS
    applyXSS(userInfo);

    // validation
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
    if (!user || Object.keys(user).length === 0) {
      return tus(400).render("error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // XSS
    applyXSS(user);

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

router.route("/myevents").get(async (req, res) => {
  let userInfo = await userData.get(req.session.user.userID);

  let uid = req.session.user.userID;
  let eventList = await eventsData.getEventsByUser(uid);
  if (eventList.length !== 0) {
    for (let item of eventList) {
      let memberdetailsList = [];
      for (let member of item.participants) {
        let memberdetails = await userData.get(member);
        memberdetailsList.push(memberdetails);
      }
      item.memberdetails = memberdetailsList;
      item.members = item.participants.length != 0 ? true : false;
    }
  }
  eventList = eventList.reverse();
  let empty = eventList.length == 0 ? true : false;

  return res.render("myevents", {
    title: "My Events",
    myevents: eventList,
    hidden: "hidden",
    isempty: empty,
  });
});

router
  .route("/profile")
  .get(async (req, res) => {
    let userInfo = await userData.get(req.session.user.userID);

    let uid = req.session.user.userID;
    let eventList = await eventsData.getEventsByUser(uid);
    if (eventList.length !== 0) {
      for (let item of eventList) {
        let memberdetailsList = [];
        for (let member of item.participants) {
          let memberdetails = await userData.get(member);
          memberdetailsList.push(memberdetails);
        }
        item.memberdetails = memberdetailsList;
        item.members = item.participants.length != 0 ? true : false;
      }
    }
    eventList = eventList.reverse();
    let empty = eventList.length == 0 ? true : false;

    const options = getGenderOptions(userInfo.gender);
    return res.render("profile", {
      title: "Profile",
      myevents: eventList,
      hidden: "hidden",
      isempty: empty,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      gender: userInfo.gender,
      genderOptions: options,
      dateOfBirth: userInfo.dateOfBirth,
      contactNumber: userInfo.contactNumber,
      newFirstName: userInfo.firstName,
      newLastName: userInfo.lastName,
      newEmail: userInfo.email,
      newGender: userInfo.gender,
      newDateOfBirth: userInfo.dateOfBirth,
      newContactNumber: userInfo.contactNumber,
    });
  })
  .put(async (req, res) => {
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res.status(400).render("error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // XSS
    applyXSS(userInfo);

    // check id
    let userID = req.session.user.userID;
    userID = helperMethodsForUsers.checkId(userID);

    // validation
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

      // check email duplicate only when changing the email
      let user = await userData.get(userID);
      if (userInfo.emailInput !== user.email)
        await helperMethodsForUsers.checkUsedEmail(userInfo.emailInput);
    } catch (e) {
      let origUserInfo = await userData.get(req.session.user.userID);

      const options = getGenderOptions(userInfo.genderInput);
      return res.status(400).render("profile", {
        title: "Profile",
        hidden: "",
        error: e,
        firstName: origUserInfo.firstName,
        lastName: origUserInfo.lastName,
        email: origUserInfo.email,
        gender: origUserInfo.gender,
        genderOptions: options,
        dateOfBirth: origUserInfo.dateOfBirth,
        contactNumber: origUserInfo.contactNumber,
        newFirstName: userInfo.firstNameInput,
        newLastName: userInfo.lastNameInput,
        newEmail: userInfo.emailInput,
        newGender: userInfo.genderInput,
        newDateOfBirth: userInfo.dateOfBirthInput,
        newContactNumber: userInfo.contactNumberInput,
      });
    }
    // update
    try {
      const newUser = await userData.update(
        userID,
        userInfo.firstNameInput,
        userInfo.lastNameInput,
        userInfo.emailInput,
        userInfo.genderInput,
        userInfo.dateOfBirthInput,
        userInfo.contactNumberInput,
        userInfo.passwordInput
      );
      if (!newUser.updatedUser) throw "Internal Server Error";
      return res.redirect("profile");
    } catch (e) {
      return res.status(500).render("error", {
        title: "Error",
        error: e,
      });
    }
  });

router.route("/events/:sports").get(async (req, res) => {
  let sport = req.params.sports;
  let eventList = await eventsData.getEventsBySport(sport);
  for (let item of eventList) {
    if (item.participants.includes(req.session.user.userID)) {
      item.registered = true;
    } else {
      item.registered = false;
    }
  }
  eventList = eventList.reverse();
  return res.render("events", {
    title: "events",
    sport: sport,
    events: eventList,
  });
});

router.route("/removeevents/:eventid").get(async (req, res) => {
  try {
    let eventID = req.params.eventid.toString();
    eventID = validation.checkId(eventID, "Event ID");
    let removeinfo = await eventsData.remove(eventID);
    return res.redirect("/profile");
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router
  .route("/addevent/:sports")
  .get(async (req, res) => {
    try {
      let sport = req.params.sports;
      let uid = req.session.user.userID;
      let sportplaces = await sportsplaceData.getSportPlacesBySport(sport);

      return res.render("addevent", {
        title: "Add Event",
        sport: sport,
        userID: uid,
        places: sportplaces,
      });
    } catch (e) {
      return res.status(400).render("error", {
        title: "Error",
        error: e,
      });
    }
  })
  .post(async (req, res) => {
    try {
      for (const key in req.body) {
        req.body[key] = xss(req.body[key]);
      }
      let owner = validation.helperMethodsForEvents.checkId(
        req.body.owner,
        "userID"
      );
      let evenntname = validation.helperMethodsForEvents.checkEventName(
        req.body.eventname,
        "Event Name"
      );
      let desc = validation.helperMethodsForEvents.checkEventName(
        req.body.desc,
        "Description"
      );
      let sportname = validation.helperMethodsForEvents.checkString(
        req.body.sportname,
        "Sport Name"
      );
      let sportPlace = validation.helperMethodsForEvents.checkString(
        req.body.sportPlace,
        "SportPlace"
      );
      let CapacityInput = validation.helperMethodsForEvents.checkCapacity(
        req.body.CapacityInput,
        "Capacity"
      );
      let dateinput = validation.helperMethodsForEvents.checkDate(
        req.body.dateinput,
        "Event Date"
      );
      let startTime = validation.helperMethodsForEvents.checkEventTime(
        req.body.startTime,
        "Event Start Time"
      );
      let endTime = validation.helperMethodsForEvents.checkEventTime(
        req.body.endTime,
        "Event End time"
      );
      let thumbnail = validation.helperMethodsForEvents.checkURL(
        req.body.thumbnail,
        "Thumbnail URL"
      );
      let timerange = validation.helperMethodsForEvents.checkTimeRange(
        startTime,
        endTime
      );
      let sportsplaceId = await sportsplaceData.getSportPlaceId(sportPlace);
      let slotarray = validation.helperMethodsForEvents.determineSlots(
        startTime,
        endTime
      );
      let slots = await slotsData.getslotsByDate(
        sportsplaceId,
        dateinput,
        slotarray
      );

      if (slots.length !== 0) {
        for (let item of slots) {
          if (item.availability == 1) {
            throw `SportPlace time slot ${item.slotID} already booked on for ${item.Date}`;
          } else {
            let deleted = await slotsData.remove(item._id.toString());
          }
        }
      }

      let sportId = await sportsData.getID(sportname);
      for (let i in slotarray) {
        let slotinfo = await slotsData.create(
          sportId,
          sportsplaceId,
          dateinput,
          slotarray[i],
          owner,
          "2"
        );
      }

      let event = await eventsData.create(
        owner,
        evenntname,
        desc,
        sportname,
        sportPlace,
        CapacityInput,
        dateinput,
        startTime,
        endTime,
        thumbnail
      );

      if (event.insertedEvent == true) {
        return res.redirect(`/events/${sportname}`);
      } else {
        throw "Event could not be added!";
      }
    } catch (e) {
      return res.status(400).render("error", {
        title: "Error",
        error: e,
      });
    }
  });

router.route("/events/:sports/register/:eventid").get(async (req, res) => {
  try {
    let eventid = req.params.eventid;
    if (req.session.user) {
      let uid = req.session.user.userID;
      let updateParticipantlist = await eventsData.join(eventid, uid);
      if (updateParticipantlist.updatedEventParticipants == true) {
        let eventList = await eventsData.getEventsBySport(req.params.sports);
        for (let item of eventList) {
          if (item.participants.includes(req.session.user.userID)) {
            item.registered = true;
          } else {
            item.registered = false;
          }
        }
        return res.render("events", {
          title: "events",
          sport: req.params.sports,
          events: eventList,
        });
      } else {
        throw "Failed to Add User in Participant list.";
      }
    } else {
      throw "Only authenticated USER can use this feature!";
    }
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/events/:sports/deregister/:eventid").get(async (req, res) => {
  try {
    let eventid = req.params.eventid;
    if (req.session.user) {
      let uid = req.session.user.userID;
      let updateParticipantlist = await eventsData.quit(eventid, uid);
      if (updateParticipantlist.updatedEventParticipants == true) {
        let eventList = await eventsData.getEventsBySport(req.params.sports);
        for (let item of eventList) {
          if (item.participants.includes(uid)) {
            item.registered = true;
          } else {
            item.registered = false;
          }
        }
        return res.render("events", {
          title: "events",
          sport: req.params.sports,
          events: eventList,
        });
      } else {
        throw "Failed to remove User in Participant list.";
      }
    } else {
      throw "Only authenticated USER can use this feature!";
    }
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router
  .route("/events/:eventid/deregisteruser/:userid")
  .get(async (req, res) => {
    try {
      let eventid = req.params.eventid.toString();
      let uid = req.params.userid.toString();

      let updateParticipantlist = await eventsData.quit(eventid, uid);
      if (updateParticipantlist.updatedEventParticipants == true) {
        return res.redirect("/myevents");
      } else {
        throw "Failed to remove User in Participant list.";
      }
    } catch (e) {
      return res.status(400).render("error", {
        title: "Error",
        error: e,
      });
    }
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
