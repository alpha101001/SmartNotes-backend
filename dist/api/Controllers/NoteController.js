"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchNotes = exports.deleteNote = exports.updateNote = exports.getNoteById = exports.getNotes = exports.createNote = void 0;
const Note_1 = __importDefault(require("../models/Note"));
/**
 * Create a new note
 * POST /notes
 */
const createNote = async (req, res) => {
    try {
        const userId = req.user._id;
        // highlight: now we accept `files` array from the body
        // each item = { fileName, fileUrl, fileType }
        const { title, content, isPinned, files } = req.body;
        if (!title || !content) {
            return res.status(400).json({
                message: 'Title and Content are required',
                success: false
            });
        }
        // create the note
        const newNote = new Note_1.default({
            title,
            content,
            isPinned,
            userId,
            // if you pass `files` array, we store it directly
            files: Array.isArray(files) ? files : []
        });
        const savedNote = await newNote.save();
        return res.status(201).json({
            message: 'Note created successfully',
            success: true,
            note: savedNote
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error
        });
    }
};
exports.createNote = createNote;
/**
 * Get all notes (with optional pinned filter)
 * GET /notes
 */
const getNotes = async (req, res) => {
    try {
        const userId = req.user._id;
        const { pinned } = req.query;
        const query = { userId };
        if (typeof pinned !== 'undefined') {
            query.isPinned = pinned === 'true';
        }
        const notes = await Note_1.default.find(query).sort({ isPinned: -1, createdAt: -1 });
        return res.status(200).json({
            message: 'Notes fetched successfully',
            success: true,
            notes
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error
        });
    }
};
exports.getNotes = getNotes;
/**
 * Get single note by ID
 * GET /notes/:id
 */
const getNoteById = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const note = await Note_1.default.findOne({ _id: id, userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found', success: false });
        }
        return res.status(200).json({
            message: 'Note fetched successfully',
            success: true,
            note
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error
        });
    }
};
exports.getNoteById = getNoteById;
/**
 * Update note
 * PUT /notes/:id
 */
const updateNote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const { title, content, isPinned, files } = req.body;
        // find the note
        const note = await Note_1.default.findOne({ _id: id, userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or not yours', success: false });
        }
        // update fields
        if (title !== undefined)
            note.title = title;
        if (content !== undefined)
            note.content = content;
        if (isPinned !== undefined)
            note.isPinned = isPinned;
        // highlight: handle updated `files` array
        // We can either overwrite or do more sophisticated merges
        if (Array.isArray(files)) {
            note.files = files;
        }
        note.updatedAt = new Date();
        const updatedNote = await note.save();
        return res.status(200).json({
            message: 'Note updated successfully',
            success: true,
            note: updatedNote
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error
        });
    }
};
exports.updateNote = updateNote;
/**
 * Delete note
 * DELETE /notes/:id
 */
const deleteNote = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id } = req.params;
        const note = await Note_1.default.findOneAndDelete({ _id: id, userId });
        if (!note) {
            return res.status(404).json({ message: 'Note not found or not yours', success: false });
        }
        // highlight: no separate image model to delete, we are done
        return res.status(200).json({
            message: 'Note deleted successfully',
            success: true
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error
        });
    }
};
exports.deleteNote = deleteNote;
/**
 * Search notes with text index
 * GET /notes/search/query?query=...
 */
const searchNotes = async (req, res) => {
    try {
        const userId = req.user._id;
        const searchQuery = req.query.query?.toString() || '';
        const pinnedValue = req.query.pinned?.toString();
        if (!searchQuery) {
            return res.status(400).json({ message: 'Query param is required', success: false });
        }
        const filter = {
            userId,
            $text: { $search: searchQuery },
        };
        // If pinnedValue is "true" or "false", add to filter
        if (pinnedValue === 'true') {
            filter.isPinned = true;
        }
        else if (pinnedValue === 'false') {
            filter.isPinned = false;
        }
        // highlight: search in title, content, and files.fileName
        const notes = await Note_1.default.find(filter);
        return res.status(200).json({
            message: 'Search results',
            success: true,
            notes
        });
    }
    catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error
        });
    }
};
exports.searchNotes = searchNotes;
