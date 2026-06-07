import express from "express";
import { getNotesByCustomer, createNote, } from "../controllers/note.controller.js";

const router = express.Router();

router.get("/customer/:customerId", getNotesByCustomer);
router.post("/customer/:customerId", createNote);

export default router;