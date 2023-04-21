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

      /*
      req.session.user = validUser;

      if (req.session.user.role === "admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/protected");
      }
      */
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

router.route("/home").get(async (req, res) => {
  return res.render("admin/home", { title: "Home" });
});

router
  .route("/classes")
  .get(async (req, res) => {
    return res.render("admin/classes", { title: "Classes" });
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
        classInfo.title,
        classInfo.sportID,
        classInfo.sportPlaceID,
        classInfo.capacity,
        classInfo.instructor,
        classInfo.time
      );
      res.json(newClass);
    } catch (e) {
      res.sendStatus(500);
    }
  });

router
  .route("/sports")
  .get(async (req, res) => {
    const sportList = await sportData.getAll();
    const sports = sportList.map((sport) => sport.name);
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
      const newSport = await sportData.create(sportInfo.sportInput);
      return res.redirect("sports");
    } catch (e) {
      res.sendStatus(500);
    }
  });

router
  .route("/sportPlaces")
  .get(async (req, res) => {
    return res.render("admin/sportPlaces", { title: "Sport Places" });
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
        sportPlaceInfo.sportID,
        sportPlaceInfo.address,
        sportPlaceInfo.description,
        sportPlaceInfo.capacity,
        sportPlaceInfo.price
      );
      res.json(newSportPlace);
    } catch (e) {
      res.sendStatus(500);
    }
  });

// http://localhost:3000/admin/id
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.checkId(req.params.id, "ID URL Param");
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      let admin = await adminData.get(req.params.id);
      res.json(admin);
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

router.route("/classes/:id").get(async (req, res) => {
  try {
    req.params.id = validation.checkId(req.params.id, "ID URL Param");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    let foundClass = await classData.get(req.params.id);
    res.json(foundClass);
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
    res.json(sport);
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
    res.json(sportPlace);
  } catch (e) {
    res.status(404).json({ error: "Sport Place not found" });
  }
});

export default router;
