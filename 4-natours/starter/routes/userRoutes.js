const express = require('express');
const fs = require('fs');

let users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`, 'utf-8')
);

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

const updateUser = (req, res) => {};

const deleteUser = (req, res) => {};

const router = express.Router();

router.route('/').get(getAllUsers).patch(updateUser).delete(deleteUser);

module.exports = router;
