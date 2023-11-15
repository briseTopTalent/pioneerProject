const { LocalityColumns } = require('../../../database/constants');
const Utils = require('../../../utils');
const models = require('../../models');

let fetchLimit = 20,
  fetchOffset = 0;
fetchPage = 1;

const FetchLocalitiesBYUser = async (
  userId,
  page = fetchPage,
  limit = fetchLimit
) => {
  try {
    let [adminStatuses, asMetaData] = await models.sequelize.query(
      'select * from admin_status WHERE _user=' + parseInt(userId)
    );
    let locSet = {};
    for (const f of adminStatuses) {
      locSet[f.locality] = 1;
    }
    const locIdList = Object.keys(locSet).join(',');
    if (Object.keys(locSet).length === 0) {
      return Utils.InternalRes(false, 'success', []);
    }

    let [localities, locMetaData] = await models.sequelize.query(
      `SELECT * from locality where id IN (${locIdList})`
    );
    return Utils.InternalRes(false, 'success', localities);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchLocalitiesBYUser;
