import e, { Router } from "express";
import * as userData from "../data/user/users.js";
import * as eventsData from "../data/user/events.js";
import * as sportsData from "../data/user/sports.js";
import * as classesData from "../data/user/classes.js";
import {
  helperMethodsForUsers,
  helperMethodsForEvents,
  helperMethodsForClasses,
} from "../data/user/helpers.js";
import * as validation from "../data/user/helpers.js";
import * as sportsplaceData from "../data/user/sportPlaces.js";
import * as commentsData from "../data/user/comments.js";
import * as slotsData from "../data/user/timeSlots.js";
import * as venueData from "../data/user/venue.js";
import * as ratingVenueData from "../data/user/ratingVenue.js";

import xss from "xss";
import { sendEmail } from "../data/admin/mail.js";

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
      firstName: user.firstName,
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

      //send mail
      try {
        await sendEmail(
          userInfo.emailInput,
          "Welcome to the family! You are now an user of Sportify!"
        );
      } catch (e) {
        console.log(`Failed to send mail to ${userInfo.emailInput}`);
      } finally {
        // redirect to login page even if the mail is not sent
        return res.redirect("login");
      }
    } catch (e) {
      return res.status(500).render("error", {
        title: "Error",
        error: e,
      });
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
      item.sportplaces = await sportsplaceData.getSportPlacesBySport(
        item.sport
      );
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

  let joinedEvents = await eventsData.getJoinedEvents(uid);

  if (joinedEvents) {
    joinedEvents.forEach((event) => {
      event.tempUid = uid;
    });
  }
  const joined = joinedEvents.length;

  return res.render("myevents", {
    title: "My Events",
    joined: joined,
    joinedEvents: joinedEvents,
    myevents: eventList,
    hidden: "hidden",
    isempty: empty,
  });
});

router.route("/myclasses").get(async (req, res) => {
  try {
    let userID = req.session.user.userID;
    userID = helperMethodsForUsers.checkId(userID, "userID");
    let myClassList = await classesData.getClassesByUserID(userID);
    return res.render("myclasses", {
      title: "My Classes",
      classList: myClassList,
    });
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/myclasses/:classID").get(async (req, res) => {
  try {
    let userID = req.session.user.userID;
    userID = helperMethodsForUsers.checkId(userID, "userID");
    let classID = req.params.classID;
    classID = helperMethodsForClasses.checkId(classID, "classID");
    let classObj = await classesData.getClass(classID);
    classObj.rating ||= "NA";
    return res.render("classInfo", { class: classObj, userId: userID });
    classObj.rating ||= "NA";
    return res.render("classInfo", {
      title: classObj.title,
      class: classObj,
      userId: userID,
    });
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/myclasses/remove/:classID").get(async (req, res) => {
  try {
    let userID = req.session.user.userID;
    let classID = req.params.classID;
    classID = helperMethodsForClasses.checkId(classID, "classID");
    userID = helperMethodsForUsers.checkId(userID, "userID");
    await classesData.quit(classID, userID);
    return res.redirect("/myclasses");
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/myclasses/update_rating").post(async (req, res) => {
  try {
    let classID = req.body.classId;
    let userID = req.body.userId;
    let rating = req.body.rating;
    await classesData.rate(classID, userID, rating);
    return res.redirect("/myclasses");
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
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

      //send mail
      try {
        await sendEmail(
          userInfo.emailInput,
          "Your information has been successfully updated!"
        );
      } catch (e) {
        console.log(`Failed to send mail to ${userInfo.emailInput}`);
      } finally {
        // redirect to profile page even if the mail is not sent
        return res.redirect("profile");
      }
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

router
  .route("/classes/:sports")
  .get(async (req, res) => {
    try {
      let sportName = req.params.sports;
      let sportObj = await sportsData.getByName(sportName);
      let sportObjectId = sportObj._id.toString();
      let classList = await classesData.getClassesBySport(sportObjectId);
      return res.render("classes", {
        title: sportObj.name,
        sport: sportObj.name,
        classList: classList,
      });
    } catch (e) {
      return res.status(404).render("error", {
        title: "Error",
        error: e,
      });
    }
  })
  .post(async (req, res) => {
    try {
      let classID = req.body.classId;
      let userID = req.session.user.userID;
      let result = await classesData.reserve(classID, userID);
      let sportName = req.params.sports;
      let sportObj = await sportsData.getByName(sportName);
      let sportObjectId = sportObj._id.toString();
      let classList = await classesData.getClassesBySport(sportObjectId);
      return res.render("classes", {
        title: sportObj.name,
        sport: sportObj.name,
        classList: classList,
        message: result.msg,
      });
    } catch (e) {
      return res.status(404).render("error", {
        title: "Error",
        error: e,
      });
    }
  });

//shared Event
router.route("/event/:eventid").get(async (req, res) => {
  try {
    let eventid = req.params.eventid;
    eventid = helperMethodsForUsers.checkId(eventid);
    let eventdata = await eventsData.get(eventid);
    eventdata._id = eventdata._id.toString();
    if (req.session.user) {
      let userID = req.session.user.userID.toString();
      if (eventdata.participants.includes(req.session.user.userID)) {
        eventdata.registered = true;
      } else {
        eventdata.registered = false;
      }
      eventdata.available =
        eventdata.capacity > eventdata.participants.length ? true : false;
      eventdata.auth = true;
    } else {
      eventdata.auth = false;
    }

    if (eventdata) {
      return res.render("event", {
        title: "event",
        sport: eventdata.sport,
        event: eventdata,
      });
    } else {
      throw `No Event found with ID ${eventid}`;
    }
  } catch (e) {}
});

router.route("/removeevents/:eventid").get(async (req, res) => {
  try {
    let eventID = req.params.eventid.toString();
    eventID = validation.checkId(eventID, "Event ID");
    let removeinfo = await eventsData.remove(eventID);
    return res.redirect("/myevents");
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
      let userInfo = await userData.get(owner);
      let eventname = validation.helperMethodsForEvents.checkEventName(
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
        eventname,
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
        await sendEmail(
          userInfo.email,
          `Hi ${userInfo.firstName}, You have succesfully created new event: ${eventname}! Thank you. `
        );
        return res.redirect(`/events/${sportname}`);
      } else {
        throw "Event could not be added!";
      }
    } catch (e) {
      let sportt = req.params.sports;
      let uid = req.session.user.userID;

      let sportplaces = await sportsplaceData.getSportPlacesBySport(sportt);
      return res.status(400).render("addevent", {
        error: true,
        userID: req.body.owner.toString(),
        places: sportplaces,
        title: "Add Event",
        errmsg: e,
        _id: req.body.owner.toString(),
        name: req.body.eventname,
        description: req.body.desc,
        sport: req.body.sportname,
        sportPlace: req.body.sportPlace,
        capacity: req.body.CapacityInput,
        date: req.body.dateinput,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        image: req.body.thumbnail,
      });
    }
  });

router
  .route("/updateevent/:eventid")
  .get(async (req, res) => {
    try {
      let eventid = req.params.eventid.toString();
      let eventdata = await eventsData.get(eventid);
      let sportplaces = await sportsplaceData.getSportPlacesBySport(
        eventdata.sport
      );

      return res.render("updateevent", {
        title: "Update Event",
        _id: eventdata._id.toString(),
        places: sportplaces,
        userID: eventdata.userID,
        name: eventdata.name,
        description: eventdata.description,
        sport: eventdata.sport,
        sportPlace: eventdata.sportPlace,
        capacity: eventdata.capacity,
        date: eventdata.date,
        startTime: eventdata.startTime,
        endTime: eventdata.endTime,
        image: eventdata.image,
      });
    } catch (e) {
      return res.status(400).render("error", {
        title: "Error",
        error: e,
      });
    }
  })
  .put(async (req, res) => {
    try {
      for (const key in req.body) {
        req.body[key] = xss(req.body[key]);
      }
      let eventid = req.params.eventid.toString();
      eventid = validation.helperMethodsForEvents.checkId(eventid, "Event ID");

      let owner = validation.helperMethodsForEvents.checkId(
        req.body.owner,
        "userID"
      );
      let userInfo = await userData.get(owner);

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
          let deleted = await slotsData.remove(item._id.toString());
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

      let event = await eventsData.update(
        eventid,
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

      if (event.updateEvent == true) {
        await sendEmail(
          userInfo.email,
          `Hi ${userInfo.firstName}, You have succesfully updated your event: ${evenntname}! Thank you. `
        );
        return res.redirect(`/myevents`);
      } else {
        throw "Event could not be updated!";
      }
    } catch (e) {
      let sportt = req.body.sportname;

      let sportplaces = await sportsplaceData.getSportPlacesBySport(sportt);
      return res.status(400).render("updateevent", {
        _id: req.params.eventid.toString(),
        err: true,
        error: e,
        places: sportplaces,
        title: "Update Event",
        errmsg: e,
        userID: req.body.owner.toString(),
        name: req.body.eventname,
        description: req.body.desc,
        sport: req.body.sportname,
        sportPlace: req.body.sportPlace,
        capacity: req.body.CapacityInput,
        date: req.body.dateinput,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        image: req.body.thumbnail,
      });
    }
  });

router.route("/commentbox/:eventid").get(async (req, res) => {
  try {
    let eventid = req.params.eventid.toString();
    let eventdata = await eventsData.get(eventid);
    let comments = await commentsData.get(eventid);
    let hascomments = comments.length == 0 ? false : true;
    for (let item of comments) {
      const timings = new Date(item.timestamp);
      const printtime = timings.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      item.printtime = printtime;

      if (item.userID == req.session.user.userID) {
        item.owner = true;
      } else {
        item.owner = false;
      }
    }
    comments = comments.reverse();

    return res.render("commentbox", {
      title: "CommentBox",
      _id: eventdata._id.toString(),
      userID: eventdata.userID,
      name: eventdata.name,
      description: eventdata.description,
      sport: eventdata.sport,
      sportPlace: eventdata.sportPlace,
      capacity: eventdata.capacity,
      participants: eventdata.participants.length,
      date: eventdata.date,
      startTime: eventdata.startTime,
      endTime: eventdata.endTime,
      image: eventdata.image,
      comments: comments,
      hascomments: hascomments,
    });
  } catch (e) {
    console.log(e);
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
      let userInfo = await userData.get(uid);
      let updateParticipantlist = await eventsData.join(eventid, uid);
      if (updateParticipantlist.updatedEventParticipants == true) {
        await sendEmail(
          userInfo.email,
          `Hi ${userInfo.firstName}, You have succesfully registered to the event! Thank you. `
        );
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
      let userInfo = await userData.get(uid);
      let updateParticipantlist = await eventsData.quit(eventid, uid);
      if (updateParticipantlist.updatedEventParticipants == true) {
        await sendEmail(
          userInfo.email,
          `Hi ${userInfo.firstName}, You have unsubscribed from the event! Thank you. `
        );
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
      let userInfo = await userData.get(uid);
      let updateParticipantlist = await eventsData.quit(eventid, uid);
      if (updateParticipantlist.updatedEventParticipants == true) {
        await sendEmail(
          userInfo.email,
          `Hi ${userInfo.firstName}, Sorry to inform you that the admin has removed you from the event! `
        );
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

router.route("/addcomment/:eventid").post(async (req, res) => {
  try {
    let eventid = req.params.eventid.toString();
    eventid = validation.helperMethodsForEvents.checkId(eventid, "Event ID");
    let uid = req.session.user.userID.toString();
    uid = validation.helperMethodsForEvents.checkId(uid, "User ID");
    let user = await userData.get(uid);
    let name = user.firstName + " " + user.lastName;
    let time = new Date();
    let comm = xss(req.body.com);
    comm = validation.helperMethodsForEvents.checkString(comm, "Comment");

    let addedComment = await commentsData.create(
      eventid,
      uid,
      name,
      comm,
      time
    );
    if (addedComment.insertedEvent == true) {
      return res.redirect(`/commentbox/${eventid}`);
    } else {
      throw "Failed to Add Comment.";
    }
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router
  .route("/classes/:sports")
  .get(async (req, res) => {
    let sportName = req.params.sports;
    let sportObj = await sportsData.getByName(sportName);
    let sportObjectId = sportObj._id.toString();
    let classList = await classesData.getClassesBySport(sportObjectId);
    return res.render("classes", {
      title: sportObj.name,
      sport: sportObj.name,
      classList: classList,
    });
  })
  .post(async (req, res) => {
    let classID = req.body.classId;
    let userID = req.session.user.userID;
    let result = await classesData.reserve(classID, userID);
    let sportName = req.params.sports;
    let sportObj = await sportsData.getByName(sportName);
    let sportObjectId = sportObj._id.toString();
    let classList = await classesData.getClassesBySport(sportObjectId);
    return res.render("classes", {
      sport: sportObj.name,
      classList: classList,
      message: result.msg,
    });
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

// router.route("/venueInfo/:id").get(async (req, res) => {
//   try {
//     req.params.id = helperMethodsForUsers.checkId(
//       req.params.id,
//       "sports place id Param"
//     );
//   } catch (e) {
//     return res.status(400).render("error", {
//       title: "Error",
//       error: e,
//     });
//   }

//   try {
//     // let sport = req.params.sports;
//     let venueslot = await venueData.getslotsByDate(
//       req.params.id,
//       req.params.dateInput
//     );
//     return res.render("venueInfo", {
//       // sport: sport,
//       venues: venueslot,
//       title: "Reserve Venue",
//     });
//   } catch (e) {
//     return res.status(404).render("error", {
//       title: "Error",
//       error: e,
//     });
//   }
// });

router.route("/venueBook").put(async (req, res) => {
  let venueInfo = req.body;
  if (!venueInfo || Object.keys(venueInfo).length === 0) {
    return res.status(400).render("error", {
      title: "Error",
      error: "There are no fields in the request body",
    });
  }

  // validation
  try {
    await userData.get(req.session.user.userID);
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  let bdate = "";
  let uid = req.session.user.userID;
  try {
    venueInfo.slotInput = validation.checkId(venueInfo.slotInput, "id");
    bdate = helperMethodsForEvents.checkDate(
      req.session.user.bookingdate,
      "date"
    );
    req.session.user.bookingdate = null;
  } catch (e) {
    // const sports = await getSportOptions(timeSlotInfo.sportIDInput);
    // const sportPlacetList = await sportPlaceData.getAll();
    // const sportPlaces = sportPlacetList.map((sportPlace) =>
    //   Object({
    //     sportPlaceID: sportPlace._id,
    //     sportPlaceName: sportPlace.name,
    //   })
    // );

    // return res.status(400).render("timeSlot", {
    //   title: "Add TimeSlots",
    //   hidden: "",
    //   error: e,
    //   sports: sports,
    //   sportPlaces: sportPlaces,
    //   name: timeSlotInfo.sportIDInput,
    //   address: timeSlotInfo.sportplaceIDInput,
    //   description: timeSlotInfo.dateInput,
    //   capacity: timeSlotInfo.slotInput,

    // });
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }

  try {
    const newSlot = await slotsData.updateslot(venueInfo.slotInput, bdate, uid);
    if (!newSlot.updatedslot) throw "Internal Server Error";
    let venueList = await venueData.getvenuebyuserid(uid);

    let empty = venueList.length == 0 ? true : false;

    return res.render("myVenue", {
      title: "My Venue",
      venueList: venueList,
      hidden: "hidden",
      isempty: empty,
    });
    // return res.redirect("myVenue");
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/venueGetslot/:id").post(async (req, res) => {
  let venueInfo = req.body;
  if (!venueInfo || Object.keys(venueInfo).length === 0) {
    return res.status(400).render("error", {
      title: "Error",
      error: "There are no fields in the request body",
    });
  }

  try {
    req.params.id = helperMethodsForUsers.checkId(
      req.params.id,
      "sports place id Param"
    );
    venueInfo.dateInput = helperMethodsForEvents.checkDate(
      venueInfo.dateInput,
      "Date"
    );
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  try {
    // let sport = req.params.sports;
    let venuedetails = await sportsplaceData.getSportPlace(req.params.id);
    let venueslot = await venueData.getslotsByDate(
      req.params.id,
      venueInfo.dateInput
    );

    req.session.user.bookingdate = venueInfo.dateInput;

    return res.render("venueInfo", {
      // sport: sport,
      venueinfo: venuedetails,
      venues: venueslot,
      date: venueInfo.dateInput,
      title: "Reserve Venue",
    });
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/myVenue").get(async (req, res) => {
  try {
    await userData.get(req.session.user.userID);
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  let uid = req.session.user.userID;
  try {
    let venueList = await venueData.getvenuebyuserid(uid);

    let empty = venueList.length == 0 ? true : false;

    return res.render("myVenue", {
      title: "My Venue",
      venueList: venueList,
      hidden: "hidden",
      isempty: empty,
    });
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/deleteVenue/:id/del/:date").get(async (req, res) => {
  let ID = "";
  let date = "";
  try {
    ID = req.params.id;
    ID = validation.checkId(ID, "ID");
    date = req.params.date;
    date = helperMethodsForEvents.checkDate(date, "date");
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }

  try {
    await userData.get(req.session.user.userID);
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  let uid = req.session.user.userID;

  try {
    const newSlot = await slotsData.removefromslot(ID, date);
    if (!newSlot.updatedslot) throw "Internal Server Error";

    let venueList = await venueData.getvenuebyuserid(uid);

    let empty = venueList.length == 0 ? true : false;

    return res.render("myVenue", {
      title: "My Venue",
      venueList: venueList,
      hidden: "hidden",
      isempty: empty,
    });
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
});

router.route("/updateRating/:id").post(async (req, res) => {
  let venueInfo = req.body;
  if (!venueInfo || Object.keys(venueInfo).length === 0) {
    return res.status(400).render("error", {
      title: "Error",
      error: "There are no fields in the request body",
    });
  }

  try {
    req.params.id = helperMethodsForUsers.checkId(
      req.params.id,
      "sports place id Param"
    );
    venueInfo.ratingInput = validation.checkNumber(
      venueInfo.ratingInput,
      "Rating"
    );
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  try {
    await userData.get(req.session.user.userID);
  } catch (e) {
    return res.status(400).render("error", {
      title: "Error",
      error: e,
    });
  }
  let uid = req.session.user.userID;

  try {
    let ratinglist = await ratingVenueData.getatingbyuser(uid, req.params.id);

    if (ratinglist != 0) {
      const insertrating = await ratingVenueData.update(
        req.params.id,
        uid,
        venueInfo.ratingInput
      );
      if (!insertrating.insertedratingVenue) throw "Internal Server Error";
      return res.redirect("../myVenue");
    } else {
      const insertrating = await ratingVenueData.create(
        req.params.id,
        uid,
        venueInfo.ratingInput
      );
      if (!insertrating.insertedratingVenue) throw "Internal Server Error";
      return res.redirect("../myVenue");
    }
  } catch (e) {
    return res.status(404).render("error", {
      title: "Error",
      error: e,
    });
  }
});
export default router;
