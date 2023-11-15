const Utils = require('../../../utils');
const models = require('../../models');
const userService = require('../user');

const RemoveAdminFromLocality = async (id, email) => {
  email = String(email).toLowerCase();
  const loc = await models.Locality.findOne({ attributes: ['id'], where: { id } });
  if (!loc) return Utils.InternalRes(true, 'Locality not Found', {});

  // create new adminUser
  const user = await userService.FindUserByEmail(email, {is_admin: true});
  if (!user) return { error: true, message: 'Invalid Email' };

  //console.debug({ user });
  const u = user.data;
  const removed = await models.AdminStatus.findOne({
    _user: u.id,
    locality: id,
  });
  console.log(removed);
  const removeStatus = await models.AdminStatus.destroy({
    where: {
      _user: u.id,
      locality: id,
    },
  });
  return {
    error: false,
    data: { removeStatus, user_id: u.id },
    message: 'success',
  };
};
module.exports = RemoveAdminFromLocality;
