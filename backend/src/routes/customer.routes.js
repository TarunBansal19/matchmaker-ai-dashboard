import express from "express";
import { prisma } from "../config/client.js";
import { getCustomers, getCustomerById, } from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/" , getCustomers);
router.get("/:id" , getCustomerById);

export default router;
