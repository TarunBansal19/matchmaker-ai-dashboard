import { findAllCustomers, findCustomerById, } from "../services/customer.service.js";

export async function getCustomers(req, res) {
    try {
        const { matchmakerId } = req.query;
        const customers = await findAllCustomers(matchmakerId);

        res.json({
            success: true,
            data: customers,
        });
    } catch (error) {
        console.error("GET_CUSTOMERS_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
}

export async function getCustomerById(req, res) {
    try {
        const { id } = req.params;

        const customer = await findCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.json({
            success: true,
            data: customer,
        });
    } catch (error) {
        console.error("GET_CUSTOMER_BY_ID_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer",
        });
    }
}