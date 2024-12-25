"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
// highlight: we no longer reference an external image model.
// Instead, we embed an array of file objects right here
// { fileName, fileUrl, fileType }
const fileSchema = new Schema({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true } // e.g., 'image', 'pdf', 'docx', etc.
});
const noteSchema = new Schema({
    // Define the schema for a note
    // title of the note
    title: {
        type: String,
        required: true
    },
    // content of the note (can be a markdown formatted string)
    content: {
        type: String,
        required: true
    },
    // isPinned is a boolean to determine if the note is pinned to the top or not
    isPinned: {
        type: Boolean,
        default: false
    },
    files: [fileSchema],
    // userId is the ID of the user who created the note
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // createdAt and updatedAt fields to store timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    // updatedAt field to store the last time the note was updated
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
// Create a text index on title and content for efficient searching
noteSchema.index({
    title: 'text',
    content: 'text',
    'files.fileName': 'text'
});
const NoteModel = mongoose_1.default.model('Note', noteSchema);
exports.default = NoteModel;
