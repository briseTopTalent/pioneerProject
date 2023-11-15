'use strict';
const models = require('../../models');
const bcrypt = require('bcryptjs');

const ResetPw = async ({ req }) => {
  try {
    const { resetHash, password, confirmPassword } = req.body;
    let user = await models.User.findOne({
      where: { reset_pw_hash: resetHash },
    });
    if (!user) {
      return {
        error: true,
        message: 'Error, no email attached to that reset link',
      };
    }
    if (password !== confirmPassword) {
      return { error: true, message: 'Error, passwords do not match' };
    }
    user.password = bcrypt.hashSync(password, 8);
    user.reset_pw_hash = null;
    user.reset_pw_before = null;
    await user.save();
    return { error: false, message: 'Password updated' };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  ResetPw,
};
