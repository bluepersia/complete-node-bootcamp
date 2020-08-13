const express = require('express');

const {
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  signUp,
  login,
  resetPassword,
  forgotPassword
} = require('../controllers/authenticationController');

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

module.exports = router;
