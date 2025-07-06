import express from 'express';
import { getAllContactsController } from '../controllers/contactsController.js';

const contactsRouter = express();

contactsRouter.get('/contacts', getAllContactsController);

export default contactsRouter;
