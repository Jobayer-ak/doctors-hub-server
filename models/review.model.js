const mongoose = require('mongoose');
const validator = require('validator');

const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name'],
      trim: true,
      minLength: [3, 'Name should be at least 3 characters'],
      maxLength: [40, 'Name is too large. Not more than 40 characters!'],
    },
    email: {
      type: String,
      validate: [validator.isEmail, 'Provide a valid Email!'],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Email is required!'],
    },
    gender: {
      type: String,
      required: [true, 'Select Gender'],
      trim: true,
    },
    imageURL: {
      type: String,
      required: [true, 'Image URL is required!'],
      trim: true,
    },
    review: {
      type: String,
      required: [true, 'Please write a comment'],
      trim: true,
      minLength: [15, 'Comment should be at least 15 characters'],
      maxLength: [280, 'Name is too large. Not more than 280 characters!'],
    },
    rating: {
      type: Number,
      required: [true, 'Must give us rating!'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
