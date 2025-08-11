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
import dotenv from 'dotenv';
dotenv.config();

async function handleFileUpload(file) {
  if (!file) return null;

  if (getEnvVariable('UPLOAD_TO_CLOUDINARY') === 'true') {
    const result = await uploadToCloudinary(file.path);
    await fs.unlink(file.path);
    return result.secure_url;
  } else {
    await fs.rename(
      file.path,
      path.resolve('src/uploads/photo', file.filename),
    );
    return `http://localhost:3000/photo/${file.filename}`;
  }
}

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
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;
  if (!name || !phoneNumber || !contactType || !email) {
    throw createHttpError(
      400,
      'Missing required fields: name, phoneNumber, contactType, or email',
    );
  }

  const photo = await handleFileUpload(req.file);

  const contact = await createContact({
    name,
    phoneNumber,
    contactType,
    email,
    isFavourite,
    photo,
    userId: req.user.id,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function patchContactController(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, 'Invalid contact ID format');
  }

  const updateData = { ...req.body };
  if (updateData.isFavourite !== undefined) {
    updateData.isFavourite = updateData.isFavourite === 'true';
  }

  if (Object.keys(updateData).length === 0 && !req.file) {
    throw createHttpError(400, 'Missing fields to update');
  }

  const photo = await handleFileUpload(req.file);
  if (photo) {
    updateData.photo = photo;
  }

  const updatedContact = await patchContact(id, updateData, req.user.id);

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

  res.status(200).json({
    status: 200,
    message: 'Successfully deleted contact!',
    data: deletedContact,
  });
}
