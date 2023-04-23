import { Router } from "express";
import * as userData from "../data/user/users.js";
import * as eventData from "../data/user/events.js";
import * as adminData from "../data/admin/admins.js";
import * as classData from "../data/admin/classes.js";
import * as sportData from "../data/admin/sports.js";
import * as sportPlaceData from "../data/admin/sportPlaces.js";
import validation from "../data/admin/helpers.js";

const router = Router();

// http://localhost:3000/admin/
router
  .route("/register")
  .get(async (req, res) => {
    return res.render("admin/register", { title: "Register" });
  })
  .post(async (req, res) => {
    let adminInfo = req.body;
    if (!adminInfo || Object.keys(adminInfo).length === 0) {
      res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation for admin registration
    try {
      adminInfo.firstNameInput = validation.checkName(
        adminInfo.firstNameInput,
        "First Name"
      );
      adminInfo.lastNameInput = validation.checkName(
        adminInfo.lastNameInput,
        "Last Name"
      );
      adminInfo.emailInput = validation.checkEmail(
        adminInfo.emailInput,
        "Email"
      );
      adminInfo.dateOfBirthInput = validation.checkDateOfBirth(
        adminInfo.dateOfBirthInput,
        "Date Of Birth"
      );
      adminInfo.contactNumberInput = validation.checkContactNumber(
        adminInfo.contactNumberInput,
        "Contact Number"
      );
      adminInfo.genderInput = validation.checkGender(
        adminInfo.genderInput,
        "Gender"
      );
      adminInfo.passwordInput = validation.checkPassword(
        adminInfo.passwordInput,
        "Password"
      );
    } catch (e) {
      return res.status(400).render("admin/register", {
        title: "Register",
        hidden: "",
        error: e,
        firstName: adminInfo.firstNameInput,
        lastName: adminInfo.lastNameInput,
        email: adminInfo.emailInput,
        dateOfBirth: adminInfo.dateOfBirthInput,
        contactNumber: adminInfo.contactNumberInput,
        password: adminInfo.passwordInput,
      });
    }

    try {
      const newAdmin = await adminData.create(
        adminInfo.firstNameInput,
        adminInfo.lastNameInput,
        adminInfo.emailInput,
        adminInfo.genderInput,
        adminInfo.dateOfBirthInput,
        adminInfo.contactNumberInput,
        adminInfo.passwordInput
      );
      if (!newAdmin.insertedAdmin) throw "Internal Server Error";
      return res.redirect("login");
    } catch (e) {
      return res.status(500).render("admin/register", {
        title: "Register",
        hidden: "",
        error: e,
        firstName: adminInfo.firstNameInput,
        lastName: adminInfo.lastNameInput,
        email: adminInfo.emailInput,
        dateOfBirth: adminInfo.dateOfBirthInput,
        contactNumber: adminInfo.contactNumberInput,
        password: adminInfo.passwordInput,
      });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    //code here for GET
    return res.render("admin/login", { title: "Login" });
  })
  .post(async (req, res) => {
    const admin = req.body;
    if (!admin || Object.keys(admin).length === 0) {
      res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // input checking
    try {
      admin.emailAddressInput = validation.checkEmail(
        admin.emailAddressInput,
        "Email Address"
      );

      admin.passwordInput = validation.checkPassword(
        admin.passwordInput,
        "Password"
      );
    } catch (e) {
      return res.status(400).render("admin/login", {
        title: "Login",
        hidden: "",
        error: e,
        emailAddress: admin.emailAddressInput,
      });
    }
    try {
      const { emailAddressInput, passwordInput } = admin;
      const validAdmin = await adminData.check(
        emailAddressInput,
        passwordInput
      );

      req.session.admin = validAdmin;
      return res.redirect("home");
    } catch (e) {
      return res.status(400).render("admin/login", {
        title: "Login",
        hidden: "",
        error: e,
        emailAddress: admin.emailAddressInput,
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("admin/logout", { title: "Logout" });
});

router.route("/home").get(async (req, res) => {
  const admin = req.session.admin;
  return res.render("admin/home", {
    title: "Admin Panel",
    firstName: admin.firstName,
  });
});

router
  .route("/profile")
  .get(async (req, res) => {
    try {
      let adminInfo = await adminData.get(req.session.admin.adminID);

      return res.render("admin/profile", {
        title: "Profile",
        hidden: "hidden",
        firstName: adminInfo.firstName,
        lastName: adminInfo.lastName,
        email: adminInfo.email,
        gender: adminInfo.gender,
        dateOfBirth: adminInfo.dateOfBirth,
        contactNumber: adminInfo.contactNumber,
        newFirstName: adminInfo.firstName,
        newLastName: adminInfo.lastName,
        newEmail: adminInfo.email,
        newDateOfBirth: adminInfo.dateOfBirth,
        newContactNumber: adminInfo.contactNumber,
      });
    } catch (e) {
      console.log("hi");
      res.status(404).render("admin/error", {
        title: "Error",
        error: e,
      });
    }
  })
  .put(async (req, res) => {
    let adminInfo = req.body;
    if (!adminInfo || Object.keys(adminInfo).length === 0) {
      res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation
    try {
      adminInfo.firstNameInput = validation.checkName(
        adminInfo.firstNameInput,
        "First Name"
      );
      adminInfo.lastNameInput = validation.checkName(
        adminInfo.lastNameInput,
        "Last Name"
      );
      adminInfo.emailInput = validation.checkEmail(
        adminInfo.emailInput,
        "Email"
      );
      adminInfo.dateOfBirthInput = validation.checkDateOfBirth(
        adminInfo.dateOfBirthInput,
        "Date Of Birth"
      );
      adminInfo.contactNumberInput = validation.checkContactNumber(
        adminInfo.contactNumberInput,
        "Contact Number"
      );
      adminInfo.genderInput = validation.checkGender(
        adminInfo.genderInput,
        "Gender"
      );
      adminInfo.passwordInput = validation.checkPassword(
        adminInfo.passwordInput,
        "Password"
      );
    } catch (e) {
      let origAdminInfo = await adminData.get(req.session.admin.adminID);
      return res.status(400).render("admin/profile", {
        title: "Profile",
        hidden: "",
        error: e,
        firstName: origAdminInfo.firstName,
        lastName: origAdminInfo.lastName,
        email: origAdminInfo.email,
        gender: origAdminInfo.gender,
        dateOfBirth: origAdminInfo.dateOfBirth,
        contactNumber: origAdminInfo.contactNumber,
        newFirstName: adminInfo.firstNameInput,
        newLastName: adminInfo.lastNameInput,
        newEmail: adminInfo.emailInput,
        newDateOfBirth: adminInfo.dateOfBirthInput,
        newContactNumber: adminInfo.contactNumberInput,
      });
    }
    // update
    try {
      const adminID = req.session.admin.adminID;

      const newAdmin = await adminData.update(
        adminID,
        adminInfo.firstNameInput,
        adminInfo.lastNameInput,
        adminInfo.emailInput,
        adminInfo.genderInput,
        adminInfo.dateOfBirthInput,
        adminInfo.contactNumberInput,
        adminInfo.passwordInput
      );
      if (!newAdmin.updatedAdmin) throw "Internal Server Error";
      return res.redirect("profile");
    } catch (e) {
      let origAdminInfo = await adminData.get(req.session.admin.adminID);
      return res.status(500).render("admin/profile", {
        title: "Profile",
        hidden: "",
        error: e,
        firstName: origAdminInfo.firstName,
        lastName: origAdminInfo.lastName,
        email: origAdminInfo.email,
        gender: origAdminInfo.gender,
        dateOfBirth: origAdminInfo.dateOfBirth,
        contactNumber: origAdminInfo.contactNumber,
        newFirstName: adminInfo.firstNameInput,
        newLastName: adminInfo.lastNameInput,
        newEmail: adminInfo.emailInput,
        newDateOfBirth: adminInfo.dateOfBirthInput,
        newContactNumber: adminInfo.contactNumberInput,
      });
    }
  })
  .delete(async (req, res) => {});

router.route("/users").get(async (req, res) => {
  const userList = await userData.getAll();
  const users = userList.map((user) =>
    Object({
      userID: user._id,
      userFirstName: user.firstName,
      userLastName: user.lastName,
    })
  );
  return res.render("admin/users", {
    title: "Users",
    n: users.length,
    users: users,
  });
});

router
  .route("/classes")
  .get(async (req, res) => {
    const sportList = await sportData.getAll();
    let sports = [];
    if (sportList) {
      sports = sportList.map((sport) => sport.name);
    }

    const sportPlacetList = await sportPlaceData.getAll();
    let sportPlaces = [];
    if (sportPlacetList) {
      sportPlaces = sportPlacetList.map((sportPlace) => sportPlace.name);
    }

    const classList = await classData.getAll();
    let classes = [];
    if (classList) {
      classes = classList.map((class_) =>
        Object({
          classID: class_._id,
          className: class_.title,
        })
      );
    }

    return res.render("admin/classes", {
      title: "Classes",
      sports: sports,
      sportPlaces: sportPlaces,
      classes: classes,
    });
  })
  .post(async (req, res) => {
    let classInfo = req.body;
    if (!classInfo || Object.keys(classInfo).length === 0) {
      res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation

    try {
      const newClass = await classData.create(
        classInfo.titleInput,
        classInfo.sportInput,
        classInfo.sportPlaceInput,
        classInfo.capacityInput,
        classInfo.instructorInput,
        classInfo.dateInput,
        classInfo.startTimeInput,
        classInfo.endTimeInput
      );
      if (!newClass.insertedClass) throw "Internal Server Error";
      return res.redirect("classes");
    } catch (e) {
      res.status(500).render("admin/error", {
        title: "Error",
        error: e,
      });
    }
  });

router
  .route("/sports")
  .get(async (req, res) => {
    const sportList = await sportData.getAll();
    const sports = sportList.map((sport) =>
      Object({
        sportID: sport._id,
        sportName: sport.name,
      })
    );
    return res.render("admin/sports", { title: "Sports", sports: sports });
  })
  .post(async (req, res) => {
    let sportInfo = req.body;
    if (!sportInfo || Object.keys(sportInfo).length === 0) {
      res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // validation

    try {
      const newSport = await sportData.create(sportInfo.nameInput);
      if (!newSport.insertedSport) throw "Internal Server Error";
      return res.redirect("sports");
    } catch (e) {
      res.sendStatus(500);
    }
  });

router
  .route("/sportPlaces")
  .get(async (req, res) => {
    const sportList = await sportData.getAll();
    const sports = sportList.map((sport) => sport.name);

    const sportPlacetList = await sportPlaceData.getAll();
    const sportPlaces = sportPlacetList.map((sportPlace) =>
      Object({
        sportPlaceID: sportPlace._id,
        sportPlaceName: sportPlace.name,
      })
    );

    return res.render("admin/sportPlaces", {
      title: "Sport Places",
      sports: sports,
      sportPlaces: sportPlaces,
    });
  })
  .post(async (req, res) => {
    let sportPlaceInfo = req.body;
    if (!sportPlaceInfo || Object.keys(sportPlaceInfo).length === 0) {
      res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // validation

    try {
      const newSportPlace = await sportPlaceData.create(
        sportPlaceInfo.nameInput,
        sportPlaceInfo.sportInput,
        sportPlaceInfo.addressInput,
        sportPlaceInfo.descriptionInput,
        sportPlaceInfo.capacityInput,
        sportPlaceInfo.priceInput
      );
      if (!newSportPlace.insertedSportPlace) throw "Internal Server Error";
      return res.redirect("sportPlaces");
    } catch (e) {
      res.sendStatus(500);
    }
  });

router.route("/events").get(async (req, res) => {
  const eventList = await eventData.getAll();
  const events = eventList.map((event) =>
    Object({
      eventID: event._id,
      eventName: event.name,
    })
  );
  return res.render("admin/events", { title: "Events", events: events });
});

router.route("/events/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "ID URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let event = await eventData.get(req.params.id);
    return res.render("admin/eventInfo", {
      title: event.name,
      userID: event.userID,
      description: event.description,
      sport: event.sport,
      sportPlace: event.sportPlace,
      capacity: event.capacity,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      approved: event.approved,
      n: event.participants.length,
      participants: event.participants,
    });
  } catch (e) {
    res.status(404).json({ error: "Event not found" });
  }
});

router
  .route("/classes/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const sportList = await sportData.getAll();
      let sports = [];
      if (sportList) {
        sports = sportList.map((sport) => sport.name);
      }

      const sportPlacetList = await sportPlaceData.getAll();
      let sportPlaces = [];
      if (sportPlacetList) {
        sportPlaces = sportPlacetList.map((sportPlace) => sportPlace.name);
      }

      let foundClass = await classData.get(req.params.id);
      return res.render("admin/classInfo", {
        title: "Class Info",
        hidden: "hidden",
        id: foundClass._id,
        sports: sports,
        sportPlaces: sportPlaces,
        name: foundClass.title,
        sport: foundClass.sport,
        sportPlace: foundClass.sportPlace,
        capacity: foundClass.capacity,
        instructor: foundClass.instructor,
        date: foundClass.date,
        startTime: foundClass.startTime,
        endTime: foundClass.endTime,
        rating: foundClass.rating,
        n: foundClass.students.length,
        users: foundClass.students,
      });
    } catch (e) {
      res.status(404).json({ error: "Class not found" });
    }
  })
  .put(async (req, res) => {
    let classInfo = await classData.get(req.params.id);
    return res.redirect(`${classInfo._id}`);
  });

router
  .route("/sports/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let sport = await sportData.get(req.params.id);
      return res.render("admin/sportInfo", {
        title: "Sport Info",
        hidden: "hidden",
        id: sport._id,
        name: sport.name,
      });
    } catch (e) {
      res.status(404).json({ error: "Sport not found" });
    }
  })
  .put(async (req, res) => {
    let sport = await sportData.get(req.params.id);
    return res.redirect(`${sport._id}`);
  });

router
  .route("/sportPlaces/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let sportPlace = await sportPlaceData.get(req.params.id);
      return res.render("admin/sportPlaceInfo", {
        title: "SportPlace Info",
        hidden: "hidden",
        id: sportPlace._id,
        name: sportPlace.name,
        sport: sportPlace.sport,
        address: sportPlace.address,
        description: sportPlace.description,
        capacity: sportPlace.capacity,
        price: sportPlace.price,
        rating: sportPlace.rating,
        n: sportPlace.users.length,
        users: sportPlace.users,
      });
    } catch (e) {
      res.status(404).json({ error: "Sport Place not found" });
    }
  })
  .put(async (req, res) => {
    let sportPlace = await sportPlaceData.get(req.params.id);
    return res.redirect(`${sportPlace._id}`);
  });

router.route("/error").get(async (req, res) => {
  return res.render("admin/error", {
    title: "Error",
    error: "You are not permitted to visit this page.",
  });
});

export default router;
