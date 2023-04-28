// const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const {
  signUpService,
  findByEmailService,
} = require('../services/user.service');
const { generateToken } = require('../utils/token');
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const { sendMail } = require('../utils/email');
const Review = require('../models/review.model');
const Payment = require('../models/payment.model');

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const allUsers = await User.countDocuments({});

    let skip = Math.min((page - 1) * limit, allUsers);
    if (limit > allUsers) {
      skip = 0;
    }
    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(allUsers / limit);

    const users = await User.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time

    const result = { users, queries, page };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred while fetching all users.';
    res.status(500).send({ message: errorMessage });
  }
};

// signup
exports.signup = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await signUpService(req.body);

    const token = user.generateConfirmationToken();

    await user.save({ validateBeforeSave: false });

    const url = 'https://doctorshubbd.netlify.app';

    // email html template
    const mailInfo = {
      email: email,
      subject: "Verify Your Doctor's Hub Account",
      html: `
      <div style="padding:10px; text-align: center;">
      <h2>Hello ${name}</h2>
      <p>Thank you for creating your account on Doctor's Hub. Please confirm your Doctor's Hub account.</p>
      <a href="${url}/signup/confirmation/${token}" style="text-decoration:none;"> <button type="submit" style="color:white;text-align:center; background:blue; cursor:pointer; padding:5px 4px">Please Confirm Your Email</button></a>
      </div>
    `,
    };

    // send email to user
    await sendMail(mailInfo);

    res.status(200).json({
      status: 'Success',
      message: 'Successfully Signed Up!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

// confirm email
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ confirmationToken: token });

    if (!user) {
      return res.status(403).json({
        status: 'Fail',
        error: 'Invalid Token',
      });
    }

    const expired = new Date() > new Date(user.confirmationTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: 'Failed',
        error: 'User Confirmation Token Expired',
      });
    }
    user.status = 'active';
    user.confirmationToken = undefined;
    user.confirmationTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'Success',
      message: 'Successfully activated your account',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      error,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check email and password are provided
    if (!email || !password) {
      return res.status(401).json({
        status: 'Failed',
        error: 'Please provide your username and password!',
      });
    }

    // load user with email
    const user = await findByEmailService(email);

    if (!user) {
      return res.status(404).json({
        status: 'Failed',
        error: 'No user found! please create an account!',
      });
    }

    if (user.status === 'inactive') {
      const token = crypto.randomBytes(32).toString('hex');

      const date = new Date();

      date.setDate(date.getDate() + 1);

      const url = 'https://doctorshubbd.netlify.app';

      // email html template
      const mailInfo = {
        email: email,
        subject: "Verify Your Doctor's Hub Account",
        html: `
        <div style="padding:10px; text-align: center;">
        <h2>Hello ${user.name}</h2>
        <p>Thank you for creating your account. Please confirm your account.</p>
        <a href="${url}/signup/confirmation/${token}" style="text-decoration:none;"> <button type="submit" style="color:white;text-align:center; background:blue; cursor:pointer; padding:5px 4px">Please Confirm Your Email</button></a>
        </div>
      `,
      };

      // send email to user
      await sendMail(mailInfo);

      const filter = { email: user.email };
      const update = {
        confirmationToken: token,
        confirmationTokenExpires: date,
      };

      await User.findOneAndUpdate(filter, update);

      return res.status(401).json({
        status: 'Failed',
        message:
          'Again send confirmation email to verify your accout. Please check your email.',
      });
    }

    // verify password
    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: 'Failed',
        error: 'Email or Password is not correct!',
      });
    }

    const token = generateToken(user);

    const { password: pwd, ...others } = user.toObject();

    const date = new Date();

    date.setDate(date.getDate() + 1);

    res
      .cookie('myCookie', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
      })
      .json({
        success: true,
        message: 'successfully loggedin',
        token,
        others,
      });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error.message,
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    await res.clearCookie('myCookie');

    res.send({ message: 'cookie is cleared!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get admin
exports.getAdmin = async (req, res) => {
  try {
    const email = req.params;

    const result = await User.findOne(email);

    res.send(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// forget passwor
exports.forgetPasswordEmail = async (req, res) => {
  try {
    const email = req.body;

    const user = await User.findOne(email);

    if (!user) {
      return res.status(404).json({
        success: 'Failed',
        message: `There is no user!`,
      });
    }

    if (user.confirmationToken) {
      return res.status(403).json({
        success: 'Failed',
        message: "You didn't activate your account yet.",
      });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const date = new Date();

    date.setDate(date.getDate() + 1);

    user.forgetToken = token;
    user.forgetTokenExpires = date;

    await user.save({ validateBeforeSave: false });

    const url = 'https://doctorshubbd.netlify.app/user/set-new-password';

    // email html template
    const mailInfo = {
      email: user.email,
      subject: 'Reset Password',
      html: `
      <div style="padding:10px; text-align: center;">
      <h2>Hello ${user.name}</h2>
      <p>Reset Your Password From Doctor's Hub </p>
      <a href="${url}?token=${token}" style="text-decoration:none;"> <button type="submit" style="color:white;text-align:center; background:blue; cursor:pointer; padding:5px 4px">Reset Passwordl</button></a>
      </div>
    `,
    };

    // send email to user
    sendMail(mailInfo);

    res.status(200).json({
      status: 'Success',
      message: 'Reset password email has been sent.',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// set new password
exports.setNewPassword = async (req, res) => {
  try {
    const { ptoken } = req.params;
    const { pass } = req.body;

    if (!pass || !ptoken) {
      return res.status(403).json({
        status: 'Fail',
        error: 'New password is required!',
      });
    }

    const user = await User.findOne({ forgetToken: ptoken });

    if (!user) {
      return res.status(403).json({
        status: 'Fail',
        error: 'You already set new password!',
      });
    }

    const expired = new Date() > new Date(user.forgetTokenExpires);

    if (expired) {
      return res.status(401).json({
        status: 'Failed',
        error: 'User Confirmation Token is Expired',
      });
    }

    const hash = bcrypt.hashSync(pass, saltRounds);

    const upp = await User.findOneAndUpdate(
      { forgetToken: ptoken },
      { password: hash }
    );

    user.forgetToken = undefined;
    user.forgetTokenExpires = undefined;

    user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'Success',
      message: 'Your new password has been set.',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// setting/update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const userData = req.body;

    if (!email || !userData) {
      return res.status(403).json({
        status: 'Failed',
        message: 'Please fill up all required fields!',
      });
    }

    const updateUser = await User.updateOne({ email: email }, userData);

    if (!updateUser.modifiedCount) {
      return res.status(304).json({
        status: 'Failed',
        message: 'Your profile information is not updated',
      });
    }

    res.status(200).json({
      status: 'Success',
      message: 'Successfully Updated Your Profile!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'Something went wrong',
      error,
    });
  }
};

// user details
exports.userDetails = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(401).json({ message: 'Please provide email' });
    }
    const user = await User.findOne({ email: email }).select({
      password: 0,
      role: 0,
      status: 0,
    });

    if (!user) {
      return res.status(404).json({
        status: 'Failed',
        error: 'There is no user!',
      });
    }

    res.status(200).json({
      status: 'Success',
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'Failed',
      error: err,
    });
  }
};

// make admin
exports.makeAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const { uRole } = req.body;

    if (!id) {
      return res.status(403).json({
        status: 'Failed',
        message: 'Did not get user id!',
      });
    }

    const filter = { _id: id };
    const update = { role: uRole };

    const updateRole = await User.updateOne(filter, update);

    if (!updateRole.modifiedCount) {
      return res.status(304).json({
        status: 'Failed',
        message: 'You could not make admin!',
      });
    }

    res.status(200).json({
      status: 'Success',
      message: 'Successfully make a new admin!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: 'Something went wrong',
      error,
    });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const email = req.params.email;

    const deleteDoctor = await User.deleteOne({ email: email });

    if (deleteDoctor.deletedCount !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Something Went Wrong!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deleted',
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// add a review
exports.addReview = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(403).json({
        status: 'Failed',
        message: 'You must write review and select rating star!',
      });
    }
    const reviewData = req.body;

    const exist = await Review.findOne({ email: reviewData.email });

    if (exist) {
      return res.status(409).json({
        status: 'Failed',
        message: 'You have already given us review!',
      });
    }

    const result = await Review.create(reviewData);

    res.status(200).json({
      status: 'Success',
      message: 'Thanks! For giving us review!',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      error,
    });
  }
};

// get reviews
exports.getReviews = async (req, res) => {
  try {
    const result = await Review.find({});

    res.status(200).json({
      status: 'Success',
      result,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      error,
    });
  }
};

// get payments for specific user
exports.getUserPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const totalPayments = await Payment.countDocuments({});

    let skip = Math.min((page - 1) * limit, totalPayments);

    if (limit > totalPayments) {
      skip = 0;
    }

    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(totalPayments / limit);

    const payments = await Payment.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time

    const result = { paymentInfo: payments, queries };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred while fetching Payments.';
    res.status(500).send({ message: errorMessage });
  }
}

// get all payments for admin
exports.getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const totalPayments = await Payment.countDocuments({});

    let skip = Math.min((page - 1) * limit, totalPayments);

    if (limit > totalPayments) {
      skip = 0;
    }

    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(totalPayments / limit);

    const payments = await Payment.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time

    const result = { paymentInfo: payments, queries };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred while fetching Payments.';
    res.status(500).send({ message: errorMessage });
  }
};
