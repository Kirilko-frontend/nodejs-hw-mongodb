import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routes/contactsRouter.js';
import contactRouterId from './routes/contactRouterId.js';
dotenv.config();

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use(contactsRouter);
  app.use(contactRouterId);

  app.use((req, res) => {
    res.status(404).json({ status: 404, message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
