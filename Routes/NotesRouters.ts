
import routers from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote, searchNotes } from '../Controllers/NoteController.ts';
import { authMiddleware } from '../Middlewares/AuthValidation.ts';
const router = routers.Router();
// Example JWT auth middleware


router.post('/', authMiddleware, createNote);
router.get('/', authMiddleware, getNotes);
router.get('/:id', authMiddleware, getNoteById);
router.put('/:id', authMiddleware, updateNote);
router.delete('/:id', authMiddleware, deleteNote);

// Searching with text index
router.get('/search/query', authMiddleware, searchNotes);

export default router;
