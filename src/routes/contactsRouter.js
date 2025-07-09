import express from 'express';
import {
  getAllContactsController,
  getContactIdController,
} from '../controllers/contactsController.js';

const contactsRouter = express();

contactsRouter.get('/contacts', getAllContactsController);

contactsRouter.get('/contacts/:id', getContactIdController);

export default contactsRouter;
