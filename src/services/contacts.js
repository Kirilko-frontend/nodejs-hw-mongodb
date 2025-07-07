import { Contacts } from '../models/contacts.js';

export async function getAllContacts() {
  return await Contacts.find();
}

export async function getContactId(id) {
  return await Contacts.findById(id);
}
