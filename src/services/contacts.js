import { Contacts } from '../models/contacts.js';

export async function getAllContacts(page, perPage, sortBy, sortOrder, filter) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactsQuery = Contacts.find();

  if (filter.contactType !== undefined) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const sortOrderNum = sortOrder === 'desc' ? -1 : 1;

  const [total, contacts] = await Promise.all([
    contactsQuery.clone().countDocuments(),
    contactsQuery
      .sort({ [sortBy]: sortOrderNum })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    contacts,
    page,
    perPage,
    total,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
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
