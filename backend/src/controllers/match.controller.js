import { generateAndSaveMatches, markMatchAsSent, getAllMatchesForMatchmaker } from "../services/match.service.js";

export async function getAllMatches(req, res) {
    try {
        const { matchmakerId } = req.query;
        if (!matchmakerId) {
            return res.status(400).json({ success: false, message: "matchmakerId is required" });
        }
        const matches = await getAllMatchesForMatchmaker(matchmakerId);
        res.json({
            success: true,
            data: matches,
        });
    } catch (error) {
        console.error("GET_ALL_MATCHES_ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to fetch matches" });
    }
}

export async function generateMatchesForCustomer(req, res) {
    try {
        const { customerId } = req.params;

        const matches = await generateAndSaveMatches(customerId);

        res.json({
            success: true,
            data: matches,
        });
    } catch (error) {
        console.error("GENERATE_MATCHES_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate matches",
        });
    }
}

export async function sendMatch(req, res) {
    try {
        const { matchId } = req.params;

        const match = await markMatchAsSent(matchId);

        res.json({
            success: true,
            message: "Mock match email sent successfully",
            data: match,
        });
    } catch (error) {
        console.error("SEND_MATCH_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send match",
        });
    }
}