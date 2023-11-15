const models = require('../../models');

const UpdateAdmin = async (id, firstName, lastName, phoneNumber, role) => {
  const user = await models.User.findOne({ where: { id: id } });
  if (!user) {
    return { error: true, message: "User Doesn't exists" };
  }
  await user.update({
    first_name: firstName,
    last_name: lastName,
    phone_number: phoneNumber,
  });
  return { error: false, message: 'User Details Update' };
};

module.exports = UpdateAdmin;
