import mongoose from 'mongoose';

const contactsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'users',
    },
    photo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Contacts = mongoose.model('Contacts', contactsSchema, 'contacts');
