import express from 'express';
import {
  getAllContactsController,
  getContactIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = express.Router();

contactsRouter.get('/contacts', ctrlWrapper(getAllContactsController));

contactsRouter.get('/contacts/:id', ctrlWrapper(getContactIdController));

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

contactsRouter.patch('/contacts/:id', ctrlWrapper(patchContactController));

contactsRouter.delete('/contacts/:id', ctrlWrapper(deleteContactController));

export default contactsRouter;
