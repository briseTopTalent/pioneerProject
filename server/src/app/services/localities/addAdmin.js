const Utils = require('../../../utils');
const models = require('../../models');
const userService = require('../user');
const {getRedisData, }  = require('../../../database/redis');

const AddAdminToLocality = async (id, email, role) => {
  email = String(email).toLowerCase();
  const loc = await getRedisData(['locality',id],async () => {
    return await models.Locality.findOne({ where: { id } });
  });
  if (!loc) return Utils.InternalRes(true, 'Locality not Found', {});

  const rexist = await models.UserRole.findOne({ where: { name: role } });
  if (!rexist) return { error: true, message: 'Invalid Role' };
  // create new adminUser
  const user = await userService.FindUserByEmail(email,{is_admin: true});
  if (!user) return { error: true, message: 'Invalid Email' };
  const u = user.data;
  const roleExists = await models.AdminStatus.findOne({
    where: {
      _user: u.id,
      locality: id,
    },
  });
  if (!roleExists) {
    await models.AdminStatus.create({
      _user: u.id,
      locality: id,
      role,
    });
  }

  return { error: false, data: {}, message: 'success' };
};
module.exports = AddAdminToLocality;
