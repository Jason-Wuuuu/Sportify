import { Router } from "express";
import * as userData from "../data/user/users.js";
import * as userDataAdmin from "../data/admin/users.js";
import * as eventData from "../data/user/events.js";
import * as eventDataAdmin from "../data/admin/events.js";
import * as adminData from "../data/admin/admins.js";
import * as classData from "../data/admin/classes.js";
import * as sportData from "../data/admin/sports.js";
import * as sportPlaceData from "../data/admin/sportPlaces.js";
import validation from "../data/admin/helpers.js";

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

const getSportOptions = async (selected) => {
  const sportList = await sportData.getAll();
  let sports = [];
  if (sportList) {
    sports = sportList.map((sport) => sport.name);
  }
  if (selected) {
    const index = sports.indexOf(selected);
    if (!index === -1) throw `Error: ${selected} not found in sport`;
    sports.splice(index, 1);
  }
  return sports;
};

const getSportPlaceOptions = async (selected) => {
  const sportPlacetList = await sportPlaceData.getAll();
  let sportPlaces = [];
  if (sportPlacetList) {
    sportPlaces = sportPlacetList.map((sportPlace) => sportPlace.name);
  }
  if (selected) {
    const index = sportPlaces.indexOf(selected);
    if (!index === -1) throw `Error: ${selected} not found in sport places`;
    sportPlaces.splice(index, 1);
  }
  return sportPlaces;
};

// http://localhost:3000/admin/profile
router
  .route("/profile")
  .get(async (req, res) => {
    try {
      let adminInfo = await adminData.get(req.session.admin.adminID);

      const options = getGenderOptions(adminInfo.gender);

      return res.render("admin/profile", {
        title: "Profile",
        hidden: "hidden",
        firstName: adminInfo.firstName,
        lastName: adminInfo.lastName,
        email: adminInfo.email,
        gender: adminInfo.gender,
        genderOptions: options,
        dateOfBirth: adminInfo.dateOfBirth,
        contactNumber: adminInfo.contactNumber,
        newFirstName: adminInfo.firstName,
        newLastName: adminInfo.lastName,
        newEmail: adminInfo.email,
        newGender: adminInfo.gender,
        newDateOfBirth: adminInfo.dateOfBirth,
        newContactNumber: adminInfo.contactNumber,
      });
    } catch (e) {
      return res.status(404).render("admin/error", {
        title: "Error",
        error: e,
      });
    }
  })
  .put(async (req, res) => {
    let adminInfo = req.body;
    if (!adminInfo || Object.keys(adminInfo).length === 0) {
      return res.status(400).render("admin/error", {
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

      const options = getGenderOptions(adminInfo.gender);
      return res.status(400).render("admin/profile", {
        title: "Profile",
        hidden: "",
        error: e,
        firstName: origAdminInfo.firstName,
        lastName: origAdminInfo.lastName,
        email: origAdminInfo.email,
        gender: origAdminInfo.gender,
        genderOptions: options,
        dateOfBirth: origAdminInfo.dateOfBirth,
        contactNumber: origAdminInfo.contactNumber,
        newFirstName: adminInfo.firstNameInput,
        newLastName: adminInfo.lastNameInput,
        newEmail: adminInfo.emailInput,
        newGender: adminInfo.genderInput,
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
      return res.status(500).render("admin/error", {
        title: "Error",
        error: e,
      });
    }
  })
  .delete(async (req, res) => {});

router
  .route("/register")
  .get(async (req, res) => {
    return res.render("admin/register", {
      title: "Register",
      genderOptions: getGenderOptions(),
    });
  })
  .post(async (req, res) => {
    let adminInfo = req.body;
    if (!adminInfo || Object.keys(adminInfo).length === 0) {
      return tus(400).render("admin/error", {
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
      const options = getGenderOptions(adminInfo.genderInput);

      return res.status(400).render("admin/register", {
        title: "Register",
        hidden: "",
        error: e,
        firstName: adminInfo.firstNameInput,
        lastName: adminInfo.lastNameInput,
        email: adminInfo.emailInput,
        gender: adminInfo.genderInput,
        genderOptions: options,
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
      res.status(500).render("admin/error", {
        title: "Error",
        error: e,
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
      return res.status(400).render("admin/error", {
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
      return res.redirect("profile");
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
    const sports = await getSportOptions();
    const sportPlaces = await getSportPlaceOptions();
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
      hidden: "hidden",
      sports: sports,
      sportPlaces: sportPlaces,
      classes: classes,
    });
  })
  .post(async (req, res) => {
    let classInfo = req.body;
    if (!classInfo || Object.keys(classInfo).length === 0) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation
    try {
      classInfo.titleInput = validation.checkString(
        classInfo.titleInput,
        "Title"
      );
      classInfo.sportInput = validation.checkString(
        classInfo.sportInput,
        "Sport"
      );
      classInfo.sportPlaceInput = validation.checkString(
        classInfo.sportPlaceInput,
        "Sport Place"
      );
      classInfo.capacityInput = validation.checkString(
        classInfo.capacityInput,
        "Capacity"
      );
      classInfo.instructorInput = validation.checkName(
        classInfo.instructorInput,
        "instructor"
      );
      classInfo.dateInput = validation.checkDate(classInfo.dateInput, "Date");
      classInfo.startTimeInput = validation.checkTime(
        classInfo.startTimeInput,
        "Start Time"
      );
      classInfo.endTimeInput = validation.checkTime(
        classInfo.endTimeInput,
        "End Time"
      );

      validation.checkTimeRange(
        `${classInfo.dateInput} ${classInfo.startTimeInput}`,
        `${classInfo.dateInput} ${classInfo.endTimeInput}`
      );
    } catch (e) {
      const sports = await getSportOptions(classInfo.sportInput);
      const sportPlaces = await getSportPlaceOptions(classInfo.sportPlaceInput);
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
      return res.status(400).render("admin/classes", {
        title: "Classes",
        hidden: "",
        error: e,
        sports: sports,
        sportPlaces: sportPlaces,
        classes: classes,
        classTitle: classInfo.titleInput,
        sport: classInfo.sportInput,
        sportPlace: classInfo.sportPlaceInput,
        capacity: classInfo.capacityInput,
        instructor: classInfo.instructorInput,
        date: classInfo.dateInput,
        startTime: classInfo.startTimeInput,
        endTime: classInfo.endTimeInput,
      });
    }

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
      return res.status(500).render("admin/error", {
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
    return res.render("admin/sports", {
      title: "Sports",
      hidden: "hidden",
      sports: sports,
    });
  })
  .post(async (req, res) => {
    let sportInfo = req.body;
    if (!sportInfo || Object.keys(sportInfo).length === 0) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // validation
    try {
      sportInfo.nameInput = validation.checkString(sportInfo.nameInput, "Name");
    } catch (e) {
      const sportList = await sportData.getAll();
      const sports = sportList.map((sport) =>
        Object({
          sportID: sport._id,
          sportName: sport.name,
        })
      );

      return res.status(400).render("admin/sports", {
        title: "Sports",
        hidden: "",
        error: e,
        sports: sports,
        name: sportInfo.nameInput,
      });
    }

    try {
      const newSport = await sportData.create(sportInfo.nameInput);
      if (!newSport.insertedSport) throw "Internal Server Error";
      return res.redirect("sports");
    } catch (e) {
      return res.status(500).render("admin/error", {
        title: "Error",
        error: e,
      });
    }
  })
  .delete(async (req, res) => {});

router
  .route("/sportPlaces")
  .get(async (req, res) => {
    const sports = await getSportOptions();

    const sportPlacetList = await sportPlaceData.getAll();
    const sportPlaces = sportPlacetList.map((sportPlace) =>
      Object({
        sportPlaceID: sportPlace._id,
        sportPlaceName: sportPlace.name,
      })
    );

    return res.render("admin/sportPlaces", {
      title: "Sport Places",
      hidden: "hidden",
      sports: sports,
      sportPlaces: sportPlaces,
    });
  })
  .post(async (req, res) => {
    let sportPlaceInfo = req.body;
    if (!sportPlaceInfo || Object.keys(sportPlaceInfo).length === 0) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }

    // validation
    try {
      sportPlaceInfo.nameInput = validation.checkString(
        sportPlaceInfo.nameInput,
        "Name"
      );
      sportPlaceInfo.sportInput = validation.checkString(
        sportPlaceInfo.sportInput,
        "Sport"
      );
      sportPlaceInfo.addressInput = validation.checkString(
        sportPlaceInfo.addressInput,
        "Address"
      );
      sportPlaceInfo.descriptionInput = validation.checkString(
        sportPlaceInfo.descriptionInput,
        "Description"
      );
      sportPlaceInfo.capacityInput = validation.checkString(
        sportPlaceInfo.capacityInput,
        "Capacity"
      );
      sportPlaceInfo.priceInput = validation.checkString(
        sportPlaceInfo.priceInput,
        "Price"
      );
    } catch (e) {
      const sports = await getSportOptions(sportPlaceInfo.sportInput);

      const sportPlacetList = await sportPlaceData.getAll();
      const sportPlaces = sportPlacetList.map((sportPlace) =>
        Object({
          sportPlaceID: sportPlace._id,
          sportPlaceName: sportPlace.name,
        })
      );

      return res.render("admin/sportPlaces", {
        title: "Sport Places",
        hidden: "",
        error: e,
        sports: sports,
        sportPlaces: sportPlaces,
        name: sportPlaceInfo.nameInput,
        sport: sportPlaceInfo.sportInput,
        address: sportPlaceInfo.addressInput,
        description: sportPlaceInfo.descriptionInput,
        capacity: sportPlaceInfo.capacityInput,
        price: sportPlaceInfo.priceInput,
      });
    }

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
      return res.status(500).render("admin/error", {
        title: "Error",
        error: e,
      });
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

  const unapprovedEventList = await eventDataAdmin.getUnapprovedEvents();
  const unapprovedEvents = unapprovedEventList.map((event) =>
    Object({
      eventID: event._id,
      eventName: event.name,
    })
  );

  return res.render("admin/events", {
    title: "Events",
    unapprovedEvents: unapprovedEvents,
    events: events,
  });
});

router
  .route("/users/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: e,
      });
    }

    let userInfo = await userData.get(req.params.id);

    return res.render("admin/userInfo", {
      title: "User Info",
      id: userInfo._id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      gender: userInfo.gender,
      dateOfBirth: userInfo.dateOfBirth,
      contactNumber: userInfo.contactNumber,
    });
  })
  .delete(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: e,
      });
    }
    let deleteInfo = await userDataAdmin.remove(req.params.id);
    if (deleteInfo.deleted) {
      return res.redirect("/admin/users");
    }
  });

router
  .route("/classes/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: e,
      });
    }

    try {
      let classInfo = await classData.get(req.params.id);
      const sports = await getSportOptions(classInfo.sport);
      const sportPlaces = await getSportPlaceOptions(classInfo.sportPlace);
      return res.render("admin/classInfo", {
        title: "Class Info",
        hidden: "hidden",
        id: classInfo._id,
        sports: sports,
        sportPlaces: sportPlaces,
        name: classInfo.title,
        sport: classInfo.sport,
        sportPlace: classInfo.sportPlace,
        capacity: classInfo.capacity,
        instructor: classInfo.instructor,
        date: classInfo.date,
        startTime: classInfo.startTime,
        endTime: classInfo.endTime,
        rating: classInfo.rating,
        n: classInfo.students.length,
        users: classInfo.students,
        classTitle: classInfo.title,
        newSport: classInfo.sport,
        newSportPlace: classInfo.sportPlace,
        newCapacity: classInfo.capacity,
        newInstructor: classInfo.instructor,
        newDate: classInfo.date,
        newStartTime: classInfo.startTime,
        newEndTime: classInfo.endTime,
      });
    } catch (e) {
      return res.status(404).render("admin/error", {
        title: "Error",
        error: `${e}`,
        back: "classes",
      });
    }
  })
  .put(async (req, res) => {
    let classInfo = req.body;
    if (!classInfo || Object.keys(classInfo).length === 0) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation
    try {
      classInfo.titleInput = validation.checkString(
        classInfo.titleInput,
        "Title"
      );
      classInfo.sportInput = validation.checkString(
        classInfo.sportInput,
        "Sport"
      );
      classInfo.sportPlaceInput = validation.checkString(
        classInfo.sportPlaceInput,
        "Sport Place"
      );
      classInfo.capacityInput = validation.checkString(
        classInfo.capacityInput,
        "Capacity"
      );
      classInfo.instructorInput = validation.checkName(
        classInfo.instructorInput,
        "instructor"
      );
      classInfo.dateInput = validation.checkDate(classInfo.dateInput, "Date");
      classInfo.startTimeInput = validation.checkTime(
        classInfo.startTimeInput,
        "Start Time"
      );
      classInfo.endTimeInput = validation.checkTime(
        classInfo.endTimeInput,
        "End Time"
      );

      validation.checkTimeRange(
        `${classInfo.dateInput} ${classInfo.startTimeInput}`,
        `${classInfo.dateInput} ${classInfo.endTimeInput}`
      );
    } catch (e) {
      const sports = await getSportOptions(classInfo.sportInput);
      const sportPlaces = await getSportPlaceOptions(classInfo.sportPlaceInput);
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

      let origClassInfo = await classData.get(req.params.id);

      return res.status(400).render("admin/classInfo", {
        title: "Class Info",
        id: origClassInfo._id,
        hidden: "",
        error: e,
        sports: sports,
        sportPlaces: sportPlaces,
        name: origClassInfo.title,
        sport: origClassInfo.sport,
        sportPlace: origClassInfo.sportPlace,
        capacity: origClassInfo.capacity,
        instructor: origClassInfo.instructor,
        date: origClassInfo.date,
        startTime: origClassInfo.startTime,
        endTime: origClassInfo.endTime,
        rating: origClassInfo.rating,
        n: origClassInfo.students.length,
        users: origClassInfo.students,
        classTitle: origClassInfo.title,
        newSport: classInfo.sportInput,
        newSportPlace: classInfo.sportPlaceInput,
        newCapacity: classInfo.capacityInput,
        newInstructor: classInfo.instructorInput,
        newDate: classInfo.dateInput,
        newStartTime: classInfo.startTimeInput,
        newEndTime: classInfo.endTimeInput,
      });
    }

    // update
    try {
      const classID = req.params.id;

      const newClass = await classData.update(
        classID,
        classInfo.titleInput,
        classInfo.sportInput,
        classInfo.sportPlaceInput,
        classInfo.capacityInput,
        classInfo.instructorInput,
        classInfo.dateInput,
        classInfo.startTimeInput,
        classInfo.endTimeInput
      );
      if (!newClass.updatedClass) throw "Internal Server Error";
      return res.redirect(`${classID}`);
    } catch (e) {}
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
        newName: sport.name,
      });
    } catch (e) {
      return res.status(404).render("admin/error", {
        title: "Error",
        error: `${e}`,
        back: "sports",
      });
    }
  })
  .put(async (req, res) => {
    let sportInfo = req.body;
    if (!sportInfo || Object.keys(sportInfo).length === 0) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation
    try {
      sportInfo.nameInput = validation.checkString(sportInfo.nameInput, "Name");
    } catch (e) {
      let origSport = await sportData.get(req.params.id);

      return res.status(400).render("admin/sportInfo", {
        title: "Sport Info",
        hidden: "",
        error: e,
        id: origSport._id,
        name: origSport.name,
        newName: sportInfo.nameInput,
      });
    }

    // update
    try {
      const sportID = req.params.id;
      const newSport = await sportData.update(sportID, sportInfo.nameInput);
      if (!newSport.updatedSport) throw "Internal Server Error";
      return res.redirect(`${sportID}`);
    } catch (e) {}
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
      const sports = await getSportOptions(sportPlace.sport);
      return res.render("admin/sportPlaceInfo", {
        title: "SportPlace Info",
        hidden: "hidden",
        id: sportPlace._id,
        sports: sports,
        name: sportPlace.name,
        sport: sportPlace.sport,
        address: sportPlace.address,
        description: sportPlace.description,
        capacity: sportPlace.capacity,
        price: sportPlace.price,
        rating: sportPlace.rating,
        n: sportPlace.users.length,
        users: sportPlace.users,
        newName: sportPlace.name,
        newSport: sportPlace.sport,
        newAddress: sportPlace.address,
        newDescription: sportPlace.description,
        newCapacity: sportPlace.capacity,
        newPrice: sportPlace.price,
      });
    } catch (e) {
      return res.status(404).render("admin/error", {
        title: "Error",
        error: `${e}`,
        back: "sportPlaces",
      });
    }
  })
  .put(async (req, res) => {
    let sportPlaceInfo = req.body;
    if (!sportPlaceInfo || Object.keys(sportPlaceInfo).length === 0) {
      return res.status(400).render("admin/error", {
        title: "Error",
        error: "There are no fields in the request body",
      });
    }
    // validation
    try {
      sportPlaceInfo.nameInput = validation.checkString(
        sportPlaceInfo.nameInput,
        "Name"
      );
      sportPlaceInfo.sportInput = validation.checkString(
        sportPlaceInfo.sportInput,
        "Sport"
      );
      sportPlaceInfo.addressInput = validation.checkString(
        sportPlaceInfo.addressInput,
        "Address"
      );
      sportPlaceInfo.descriptionInput = validation.checkString(
        sportPlaceInfo.descriptionInput,
        "Description"
      );
      sportPlaceInfo.capacityInput = validation.checkString(
        sportPlaceInfo.capacityInput,
        "Capacity"
      );
      sportPlaceInfo.priceInput = validation.checkString(
        sportPlaceInfo.priceInput,
        "Price"
      );
    } catch (e) {
      const sports = await getSportOptions(sportPlaceInfo.sportInput);

      let origSportPlace = await sportPlaceData.get(req.params.id);

      return res.render("admin/sportPlaceInfo", {
        title: "SportPlace Info",
        hidden: "",
        error: e,
        id: origSportPlace._id,
        sports: sports,
        name: origSportPlace.name,
        sport: origSportPlace.sport,
        address: origSportPlace.address,
        description: origSportPlace.description,
        capacity: origSportPlace.capacity,
        price: origSportPlace.price,
        rating: origSportPlace.rating,
        n: origSportPlace.users.length,
        users: origSportPlace.users,
        newName: sportPlaceInfo.nameInput,
        newSport: sportPlaceInfo.sportInput,
        newAddress: sportPlaceInfo.addressInput,
        newDescription: sportPlaceInfo.descriptionInput,
        newCapacity: sportPlaceInfo.capacityInput,
        newPrice: sportPlaceInfo.priceInput,
      });
    }

    // update
    try {
      const sportPlaceID = req.params.id;

      const newSportPlace = await sportPlaceData.update(
        sportPlaceID,
        sportPlaceInfo.nameInput,
        sportPlaceInfo.sportInput,
        sportPlaceInfo.addressInput,
        sportPlaceInfo.descriptionInput,
        sportPlaceInfo.capacityInput,
        sportPlaceInfo.priceInput
      );
      if (!newSportPlace.updatedSportPlace) throw "Internal Server Error";
      return res.redirect(`${sportPlaceID}`);
    } catch (e) {
      const sports = await getSportOptions(sportPlaceInfo.sportInput);
    }
  });

router
  .route("/events/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let event = await eventData.get(req.params.id);
      return res.render("admin/eventInfo", {
        title: "Event Info",
        id: event._id,
        name: event.name,
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
      return res.status(404).render("admin/error", {
        title: "Error",
        error: `${e}`,
        back: "events",
      });
    }
  })
  .put(async (req, res) => {
    try {
      const eventID = req.params.id;
      const event = await eventDataAdmin.approve(eventID);
      if (!event.approved) throw "Internal Server Error";
      return res.redirect("/admin/events");
    } catch (e) {}
  });

// all other urls
router.route("*").get(async (req, res) => {
  return res.status(404).render("admin/error", {
    title: "Error",
    error: `Error: "/admin${req.url}" is not a valid url`,
    back: "profile",
  });
});

export default router;
