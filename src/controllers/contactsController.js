import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactId,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export async function getAllContactsController(req, res) {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactIdController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const contact = await getContactId(id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
}

export async function createContactController(req, res) {
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }

  const contact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function patchContactController(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, 'Missing fields to update');
  }

  const updatedContact = await patchContact(id, updateData);

  if (!updatedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

export async function deleteContactController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const deletedContact = await deleteContact(id);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
}
