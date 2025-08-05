import mongoose from 'mongoose';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactId,
  createContact,
  patchContact,
  deleteContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { getEnvVariable } from '../utils/getEnvVariable.js';

export async function getAllContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contactsData = await getAllContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    req.user.id,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
}

export async function getContactIdController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const contact = await getContactId(id, req.user.id);

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
  let photo = null;

  if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === true) {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    photo = result.secure_url;
  } else {
    await fs.rename(
      req.filer.path,
      path.resolve('src/uploads/photo', req.file.filename),
    );
    photo = `http://localhost:3000/photo/${req.file.filename}`;
  }

  const contact = await createContact({
    id,
    photo,
    userId: req.user.id,
  });
  const { name, phoneNumber, contactType } = req.body;

  if (!name || !phoneNumber || !contactType) {
    throw createHttpError(
      400,
      'Missing required fields: name, phoneNumber, or contactType',
    );
  }

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function patchContactController(req, res) {
  const { id } = req.params;
  const updateData = req.body;

  let photo = null;

  if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === true) {
    const result = await uploadToCloudinary(req.file.path);
    await fs.unlink(req.file.path);

    photo = result.secure_url;
  } else {
    await fs.rename(
      req.filer.path,
      path.resolve('src/uploads/photo', req.file.filename),
    );
    photo = `http://localhost:3000/photo/${req.file.filename}`;
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  if (Object.keys(updateData).length === 0) {
    throw createHttpError(400, 'Missing fields to update');
  }

  const updatedContact = await patchContact({
    id,
    photo,
    updateData,
    userId: req.user.id,
  });

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

  const deletedContact = await deleteContact(id, req.user.id);

  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
}
