import express from 'express';
import {
  getAllContactsController,
  getContactIdController,
  createContactController,
  patchContactController,
  deleteContactController,
} from '../controllers/contactsController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { studentSchema } from '../validation/student.js';

const contactsRouter = express.Router();

contactsRouter.get('/contacts', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(getContactIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(studentSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  isValidId,
  validateBody(studentSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
