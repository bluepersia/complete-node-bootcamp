const express = require('express');

const {
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { signUp, login } = require('../controllers/authenticationController');

const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

module.exports = router;
