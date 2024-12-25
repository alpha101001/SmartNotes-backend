"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NoteController_1 = require("../Controllers/NoteController");
const AuthValidation_1 = require("../Middlewares/AuthValidation");
const router = express_1.default.Router();
// Example JWT auth middleware
router.post('/', AuthValidation_1.authMiddleware, NoteController_1.createNote);
router.get('/', AuthValidation_1.authMiddleware, NoteController_1.getNotes);
router.get('/:id', AuthValidation_1.authMiddleware, NoteController_1.getNoteById);
router.put('/:id', AuthValidation_1.authMiddleware, NoteController_1.updateNote);
router.delete('/:id', AuthValidation_1.authMiddleware, NoteController_1.deleteNote);
// Searching with text index
router.get('/search/query', AuthValidation_1.authMiddleware, NoteController_1.searchNotes);
exports.default = router;
