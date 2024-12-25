import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import AuthRouters from './api/Routes/AuthRouters';
import NotesRouters from './api/Routes/NotesRouters';
import dotenv from 'dotenv';
import './api/models/db';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;
// Middlewares
app.use(bodyParser.json());
app.use(cors(
   {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
   }
));
app.get('/', (req, res) => {
   res.send('Hello');
});
// Auth routes
app.use('/api/auth', AuthRouters);

// Notes routes
app.use('/api/notes', NotesRouters);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
