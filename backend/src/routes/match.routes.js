import express from "express";
import { generateMatchesForCustomer, sendMatch, getAllMatches } from "../controllers/match.controller.js";

const router = express.Router();

router.get("/", getAllMatches);
router.post("/generate/:customerId", generateMatchesForCustomer);
router.post("/:matchId/send", sendMatch);

export default router;