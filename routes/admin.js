import { Router } from "express";
import * as adminData from "../data/admin/admins.js";
import * as classData from "../data/admin/classes.js";
import * as sportData from "../data/admin/sports.js";
import * as sportPlaceData from "../data/admin/sportPlaces.js";
import validation from "../data/admin/helpers.js";

const router = Router();

// http://localhost:3000/admin/
router
  .route("/")
  .get(async (req, res) => {
    try {
      const adminList = await adminData.getAll();
      res.json(adminList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  })
  .post(async (req, res) => {
    let adminInfo = req.body;
    if (!adminInfo || Object.keys(adminInfo).length === 0) {
      return res
        .status(400)
        .json({ error: "There are no fields in the request body" });
    }

    try {
      adminInfo.firstName = validation.checkString(
        adminInfo.firstName,
        "First Name"
      );
      adminInfo.lastName = validation.checkString(
        adminInfo.lastName,
        "Last Name"
      );
      adminInfo.email = validation.checkString(adminInfo.email, "email");
      adminInfo.gender = validation.checkString(adminInfo.gender, "gender");
      adminInfo.dateOfBirth = validation.checkString(
        adminInfo.dateOfBirth,
        "dateOfBirth"
      );
      adminInfo.contactNumber = validation.checkString(
        adminInfo.contactNumber,
        "contactNumber"
      );
    } catch (e) {
      return res.status(400).json({ error: e });
    }

    try {
      const newAdmin = await adminData.create(
        adminInfo.firstName,
        adminInfo.lastName,
        adminInfo.email,
        adminInfo.gender,
        adminInfo.dateOfBirth,
        adminInfo.contactNumber
      );
      res.json(newAdmin);
    } catch (e) {
      res.sendStatus(500);
    }
  });

router
  .route("/classes")
  .get(async (req, res) => {
    try {
      const classList = await classData.getAll();
      res.json(classList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
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
    try {
      const sportList = await sportData.getAll();
      res.json(sportList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
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
      const newSport = await sportData.create(sportInfo.name);
      res.json(newSport);
    } catch (e) {
      res.sendStatus(500);
    }
  });

router
  .route("/sportPlaces")
  .get(async (req, res) => {
    try {
      const sportPlaceList = await sportPlaceData.getAll();
      res.json(sportPlaceList);
    } catch (e) {
      res.status(500).json({ error: e });
    }
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
