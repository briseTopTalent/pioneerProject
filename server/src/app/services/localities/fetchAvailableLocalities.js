const { LocalityColumns,NonAdminLocalityColumns, } = require('../../../database/constants');
const Utils = require('../../../utils');
const db = require('../../models');
const {getRedisData, }  = require('../../../database/redis');

/**
 * does not leak twitter creds
 */
const FetchAvailableLocalities = async({is_admin}) => {
  try {
    const columns = is_admin ? [...LocalityColumns] : [...NonAdminLocalityColumns];
    let q = '';
    const len = columns.length;
    let ctr = 0;
    for(const c of columns){
      q += `locality.${c},`;
    }
    let localities = await getRedisData(['localities','all','is_admin',is_admin],async () => {
      return await db.sequelize.query(`select ${q} sub_locality.id as sublocalityid, sub_locality.name as sublocalityname, sub_locality.latitude AS sublocalitylatitude, sub_locality.longitude as sublocalitylongitude  from locality, sub_locality WHERE sub_locality.locality = locality.id`, {
        type: db.sequelize.QueryTypes.SELECT
      });
    });
    return Utils.InternalRes(false, 'success', localities);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchAvailableLocalities;
