import { Contacts } from '../models/contacts.js';

export async function getAllContacts() {
  return await Contacts.find();
}
