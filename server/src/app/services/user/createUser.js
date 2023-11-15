'use strict';
const bcrypt = require('bcryptjs');
const models = require('../../models');

const CreateUser = async (
  first_name,
  last_name,
  email,
  phone_number,
  password,
  title
) => {
  try {
    // find roleId and get the Id from
    // const rexist = await models.UserRole.findOne({ where: { name: role } });
    // if (!rexist) return { error: true, message: "Invalid Role" };

    email = String(email).toLowerCase();
    const user = await models.User.findOne({ where: { email } });
    if (user) {
      return { error: true, message: 'User Already exists with that email' };
    }
    var hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = await models.User.create({
      first_name,
      last_name,
      phone_number,
      email,
      password: hashedPassword,
      title,
      role: 'basic_user',
    });

    if (!newUser) {
      return { error: true, message: 'Error Occurred Try Again!!!' };
    }
    return { error: false, data: {}, message: 'success' };
  } catch (err) {
    throw err;
  }
};

module.exports = CreateUser;
