const { default: axios } = require('axios');
const models = require('../../models');
const conf = require('../../../config/get').fetch();
if (
  conf.parsed.NEVER_RUN_LEGACY_HOOK === '1' ||
  process.env.NEVER_RUN_LEGACY_HOOK === '1'
) {
  function shout(msg) {
    console.warn('\x1b[31m\x1b[42m%s\x1b[0m', msg);
  }
  shout(
    'NEVER_RUN_LEGACY_HOOK DETECTED! NOT RUNNING LEGACY INCIDENT ***CREATION***'
  );
  module.exports = () => {
    shout('not actually sending legacy axios post (CREATE)');
  };
  return;
} else {
  const SendLegacyIncident = async incident => {
    try {
      const sub_loc = await models.SubLocality.findOne({
        where: { id: incident.sub_locality },
      });
      const legacy = {
        title: incident.field1_value,
        box_number: incident.field3_value,
        subtitle: incident.field2_value,
        address: incident.address,
        latitude: incident.latitude,
        longitude: incident.longitude,
        boro: sub_loc.name,
        responding_units_final: incident.responding_units,
        token: 'NyCF1R31075',
      };
      axios
        .post(
          'https://nycfirewire.herokuapp.com/api/v1/incident/create1',
          legacy
        )
        .then(response => console.log('legacy_post: ' + response));
    } catch (err) {
      throw err;
    }
  };

  module.exports = SendLegacyIncident;
}
