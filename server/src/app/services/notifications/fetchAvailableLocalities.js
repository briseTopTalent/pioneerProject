const { LocalityColumns } = require('../../../database/constants');
const Utils = require('../../../utils');
const db = require('../../models');

const FetchAvailableLocalities = async() => {
  console.log('available')
  try {
    let localities = await db.sequelize.query('select locality.*, sub_locality.id as sublocalityid, sub_locality.name as sublocalityname, sub_locality.latitude AS sublocalitylatitude, sub_locality.longitude as sublocalitylongitude  from locality, sub_locality WHERE sub_locality.locality = locality.id', {
        type: db.sequelize.QueryTypes.SELECT
      });
    return Utils.InternalRes(false, 'success', localities);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchAvailableLocalities;
