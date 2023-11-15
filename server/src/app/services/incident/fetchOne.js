const models = require('../../models');
const Utils = require('../../../utils');

const FetchOneIncident = async id => {
  try {
    const includes = {
      include: [
        {
          model: models.Locality,
          as: 'ilocality',
          attributes: ['name'],
        },
        {
          model: models.SubLocality,
          as: 'iSlocality',
          attributes: ['name'],
        },
        {
          model: models.User,
          as: 'createdBy',
          attributes: ['email', 'first_name', 'last_name'],
        },
      ],
    };
    const d = await global.redis.getRedisDataGroupBy(['incident',id,'includes',['locality','sublocality','user']], ['incident-delete','incident-update'], async () => {
      return await models.Incident.findOne({ where: { id }, ...includes });
    });
    return Utils.InternalRes(false, 'success', d);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchOneIncident;
