import express from 'express';
import { getContactIdController } from '../controllers/contactIdController.js';

const contactRouterId = express();

contactRouterId.get('/contacts/:id', getContactIdController);

export default contactRouterId;
