import { Router } from "express";
import * as adminData from "../data/admin/admins.js";

const router = Router();

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
    try {
    } catch (e) {
      res.status(500).json({ error: e });
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
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

export default router;
