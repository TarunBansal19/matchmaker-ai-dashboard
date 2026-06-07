import { findNotesByCustomer, addNote, } from "../services/note.service.js";

export async function getNotesByCustomer(req, res) {
    try {
        const { customerId } = req.params;

        const notes = await findNotesByCustomer(customerId);

        res.json({
            success: true,
            data: notes,
        });
    } catch (error) {
        console.error("GET_NOTES_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes",
        });
    }
}

export async function createNote(req, res) {
    try {
        const { customerId } = req.params;
        const { note, matchmakerId } = req.body;

        if (!note || !matchmakerId) {
            return res.status(400).json({
                success: false,
                message: "note and matchmakerId are required",
            });
        }

        const createdNote = await addNote({
            customerId,
            matchmakerId,
            note,
        });

        res.status(201).json({
            success: true,
            data: createdNote,
        });
    } catch (error) {
        console.error("CREATE_NOTE_ERROR:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create note",
        });
    }
}