const { User } = require('../../models');
const { hashSync } = require('bcryptjs');
const tokenizer = require('../../../utils/tokenizer');
const crypto = require('crypto');

export const SendResetEmail = async (
  email: string
) => {
  email = String(email).toLowerCase();
  email = email.replace(/^[\s]+/,'').replace(/[\s]+$/,'');
  const user = await User.findOne({ where: { email, }});
  if (!user) {
    return { error: true, message: `Couldn't find any user with that email`};
  }
  let resetPwHash: string = tokenizer(crypto.randomBytes(32).toString());
  await user.update({
    reset_pw_hash: resetPwHash,
    reset_pw_before: String((Date.now() / 1000) + 1800),
  });
  return { error: false, message: 'Password reset'};
};
