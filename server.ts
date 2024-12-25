import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouters from './Routes/AuthRouters.ts';
import NotesRouters from './Routes/NotesRouters.ts';
import dotenv from 'dotenv';
import './models/db.ts';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Auth routes
app.use('/auth', AuthRouters);

// Notes routes
app.use('/notes', NotesRouters);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
