import { getContactId } from '../services/contacts.js';

export async function getContactIdController(req, res, next) {
  try {
    const contactId = await getContactId(req.params.id);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contactId,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });

    next(error);
  }
}
