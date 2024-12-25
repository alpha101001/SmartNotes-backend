import { Request, Response } from 'express';
import NoteModel from '../models/Note.ts';

interface CreateNoteRequest extends Request {
   body: {
     title: string;
     content: string;
     isPinned?: boolean;
     files?: Array<{ fileName: string; fileUrl: string; fileType: string }>;
   };
   user: { _id: string; email: string }; // Extend with user property
 }

 interface GetNotesRequest extends Request {
   query: { pinned?: string };
   user: { _id: string; email: string }; // Extend with user property
 }

interface GetNoteByIdRequest extends Request {
  params: { id: string };
  user: { _id: string; email: string }; // Extend with user property
}
 interface UpdateNoteRequest extends Request {
   params: { id: string };
   body: {
     title?: string;
     content?: string;
     isPinned?: boolean;
     files?: Array<{ fileName: string; fileUrl: string; fileType: string }>;
   };
   user: { _id: string; email: string };
 }

 interface DeleteNoteRequest extends Request {
   params: { id: string };
   user: { _id: string; email: string };
 }

 interface SearchNotesRequest extends Request {
   query: { query: string; pinned?: string };
   user: { _id: string; email: string };
 }
 interface expressResponse extends Response {
   status(code: number): this;
   json(body: any): this;
 }

/**
 * Create a new note
 * POST /notes
 */
export const createNote = async (req: CreateNoteRequest, res: expressResponse) => {
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
    const newNote = new NoteModel({
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
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
};

/**
 * Get all notes (with optional pinned filter)
 * GET /notes
 */
export const getNotes = async (req: GetNotesRequest, res: expressResponse) => {
  try {
    const userId = req.user._id;
    const { pinned } = req.query;

    const query: any = { userId };
    if (typeof pinned !== 'undefined') {
      query.isPinned = pinned === 'true';
    }

    const notes = await NoteModel.find(query).sort({ isPinned: -1,createdAt: -1 });
    return res.status(200).json({
      message: 'Notes fetched successfully',
      success: true,
      notes
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
};

/**
 * Get single note by ID
 * GET /notes/:id
 */
export const getNoteById = async (req: GetNoteByIdRequest, res: expressResponse) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await NoteModel.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found', success: false });
    }

    return res.status(200).json({
      message: 'Note fetched successfully',
      success: true,
      note
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
};

/**
 * Update note
 * PUT /notes/:id
 */
export const updateNote = async (req: UpdateNoteRequest, res: expressResponse) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, content, isPinned, files } = req.body;

    // find the note
    const note = await NoteModel.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or not yours', success: false });
    }

    // update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (isPinned !== undefined) note.isPinned = isPinned;

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
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
};

/**
 * Delete note
 * DELETE /notes/:id
 */
export const deleteNote = async (req: DeleteNoteRequest, res: expressResponse) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const note = await NoteModel.findOneAndDelete({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ message: 'Note not found or not yours', success: false });
    }

    // highlight: no separate image model to delete, we are done
    return res.status(200).json({
      message: 'Note deleted successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
};

/**
 * Search notes with text index
 * GET /notes/search/query?query=...
 */
export const searchNotes = async (req: SearchNotesRequest, res: expressResponse) => {
  try {
    const userId = req.user._id;
    const searchQuery = req.query.query?.toString() || '';
    const pinnedValue = req.query.pinned?.toString();

    if (!searchQuery) {
      return res.status(400).json({ message: 'Query param is required', success: false });
    }
    const filter: any = {
      userId,
      $text: { $search: searchQuery },
    };
    // If pinnedValue is "true" or "false", add to filter
    if (pinnedValue === 'true') {
      filter.isPinned = true;
    } else if (pinnedValue === 'false') {
      filter.isPinned = false;
    }
    // highlight: search in title, content, and files.fileName
    const notes = await NoteModel.find(filter);

    return res.status(200).json({
      message: 'Search results',
      success: true,
      notes
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
};
