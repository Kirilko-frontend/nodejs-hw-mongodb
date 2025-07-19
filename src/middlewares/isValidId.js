import { isValidObjectId } from 'mongoose';

export function isValidId(req, res, next) {
  if (isValidObjectId(req.params.id) != true) {
    return res.status(400).json({
      status: 400,
      message: 'ID not valid',
    });
  }
  next();
}
