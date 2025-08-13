import * as fs from 'node:fs';
import express from 'express';
import path from 'node:path';
import cors from 'cors';
import pino from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import contactsRouter from './routes/contactsRouter.js';
import authRoute from './routes/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const SWAGGER_DOCUMENT = JSON.parse(
  fs.readFileSync(path.join('docs', 'swagger.json')),
);

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCUMENT));

  app.use('/photo', express.static(path.resolve('src/uploads/photo')));

  app.use('/auth', authRoute);

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
