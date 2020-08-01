const express = require('express');

const {
  getAllUsers,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

module.exports = router;
