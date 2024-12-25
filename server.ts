import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouters from './api/Routes/AuthRouters.ts';
import NotesRouters from './api/Routes/NotesRouters.ts';
import dotenv from 'dotenv';
import './api/models/db.ts';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Auth routes
app.use('/api/auth', AuthRouters);

// Notes routes
app.use('/api/notes', NotesRouters);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
