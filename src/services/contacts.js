import { Contacts } from '../models/contacts.js';

export async function getAllContacts() {
  return await Contacts.find();
}

export async function getContactId(id) {
  return await Contacts.findById(id);
}

export async function createContact(payload) {
  return await Contacts.create(payload);
}

export async function patchContact(id, updateData) {
  return await Contacts.findByIdAndUpdate(id, updateData, { new: true });
}

export async function deleteContact(id) {
  return await Contacts.findByIdAndDelete(id);
}
