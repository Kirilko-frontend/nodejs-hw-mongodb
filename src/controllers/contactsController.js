import { getAllContacts, getContactId } from '../services/contacts.js';

export async function getAllContactsController(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Contacts not found',
    });
    next(error);
  }
}

export async function getContactIdController(req, res, next) {
  try {
    const contact = await getContactId(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}
