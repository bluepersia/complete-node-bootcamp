const express = require('express');

const {
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { signUp } = require('../controllers/authenticationController');

const router = express.Router();

router.post('/signup', authController.signUp);

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

module.exports = router;
