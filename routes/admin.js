import { Router } from "express";
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

    try {
      adminInfo.firstNameInput = validation.checkString(
        adminInfo.firstNameInput,
        "First Name"
      );
      adminInfo.lastNameInput = validation.checkString(
        adminInfo.lastNameInput,
        "Last Name"
      );
      adminInfo.emailInput = validation.checkString(
        adminInfo.emailInput,
        "Email"
      );
      adminInfo.dateOfBirthInput = validation.checkString(
        adminInfo.dateOfBirthInput,
        "Date Of Birth"
      );
      adminInfo.contactNumberInput = validation.checkString(
        adminInfo.contactNumberInput,
        "Contact Number"
      );
      adminInfo.genderInput = validation.checkString(
        adminInfo.genderInput,
        "Gender"
      );
      adminInfo.passwordInput = validation.checkString(
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
        dateOfBirth: adminInfo.dateOfBirth,
        contactNumber: adminInfo.contactNumber,
        gender: adminInfo.gender,
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
      res.sendStatus(500);
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

    // input checking
    try {
      admin.emailAddressInput = validation.checkString(
        admin.emailAddressInput,
        "Email Address"
      );

      admin.passwordInput = validation.checkString(
        admin.passwordInput,
        "Password"
      );
    } catch (error) {
      return res.status(400).render("admin/login", { title: "Login" });
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
        firstName: admin.firstName,
      });
    }
  });

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  return res.render("admin/logout", { title: "Logout" });
});

router.route("/home").get(async (req, res) => {
  const admin = req.session.admin;
  return res.render("admin/home", {
    title: "Home",
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
        firstName: adminInfo.firstName,
        lastName: adminInfo.lastName,
        email: adminInfo.email,
        gender: adminInfo.gender,
        dateOfBirth: adminInfo.dateOfBirth,
        contactNumber: adminInfo.contactNumber,
      });
    } catch (e) {
      res.status(404).json({ error: "Admin not found" });
    }
  })
  .put(async (req, res) => {
    try {
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      let deletedAdmin = await adminData.remove(req.params.id);
      res.json(deletedAdmin);
    } catch (e) {
      let status = e[0] ? e[0] : 500;
      let message = e[1] ? e[1] : "Internal Server Error";
      res.status(500).send({ error: message });
    }
  });

router
  .route("/classes")
  .get(async (req, res) => {
    const sportList = await sportData.getAll();
    const sports = sportList.map((sport) => sport.name);

    const sportPlacetList = await sportPlaceData.getAll();
    const sportPlaces = sportPlacetList.map((sportPlace) => sportPlace.name);

    const classList = await classData.getAll();
    const classes = classList.map((class_) =>
      Object({
        classID: class_._id,
        className: class_.title,
      })
    );
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
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    // validation

    try {
      const newClass = await classData.create(
        classInfo.titleInput,
        classInfo.sportInput,
        classInfo.sportPlaceInput,
        classInfo.capacityInput,
        classInfo.instructorInput,
        classInfo.timeInput
      );
      return res.redirect("classes");
    } catch (e) {
      res.sendStatus(500);
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
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    // validation

    try {
      const newSport = await sportData.create(sportInfo.nameInput);
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
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
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
      return res.redirect("sportPlaces");
    } catch (e) {
      res.sendStatus(500);
    }
  });

router.route("/classes/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "ID URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let foundClass = await classData.get(req.params.id);
    return res.render("admin/classInfo", {
      title: foundClass.title,
      sport: foundClass.sport,
      sportPlace: foundClass.sportPlace,
      capacity: foundClass.capacity,
      instructor: foundClass.instructor,
      time: foundClass.time,
    });
  } catch (e) {
    res.status(404).json({ error: "Class not found" });
  }
});

router.route("/sports/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "ID URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let sport = await sportData.get(req.params.id);
    return res.render("admin/sportInfo", { title: sport.name });
  } catch (e) {
    res.status(404).json({ error: "Sport not found" });
  }
});

router.route("/sportPlaces/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "ID URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let sportPlace = await sportPlaceData.get(req.params.id);
    return res.render("admin/sportPlaceInfo", {
      title: sportPlace.name,
      sport: sportPlace.sport,
      address: sportPlace.address,
      description: sportPlace.description,
      capacity: sportPlace.capacity,
      price: sportPlace.price,
    });
  } catch (e) {
    res.status(404).json({ error: "Sport Place not found" });
  }
});

export default router;
