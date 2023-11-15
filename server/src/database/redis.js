let groupBy = {};

async function removeRedisLocality(id) {
  const selectors = [
    ['locality', id],
    ['locality', id, 'definitions'],
    ['locality', id, 'is_admin', true],
    ['locality', id, 'is_admin', false],
    ['localities', 'all', 'is_admin', true],
    ['localities', 'all', 'is_admin', false],
    ['count', 'localities', 'all'],
  ];
  if (typeof groupBy['locality-update'] !== 'undefined') {
    for (const sel of groupBy['locality-update']) {
      selectors.push(sel);
    }
    groupBy['incident-update'] = [];
  }
  if (typeof groupBy['incident-likes'] !== 'undefined') {
    for (const sel of groupBy['incident-likes']) {
      selectors.push(sel);
    }
    groupBy['incident-likes'] = [];
  }
  for (const s of selectors) {
    try {
      await removeFromRedis(s).catch(err => {
        console.error(`CACHE: error: `, err);
      });
    } catch (e) {
      console.error(`CACHE: Exception:`, e);
      continue;
    }
  }
}
async function refreshIncidentLikes(id) {
  let selectors = [
    ['incident',id,'likes'],
  ];
  if (typeof groupBy['incident-likes'] !== 'undefined') {
    for (const sel of groupBy['incident-likes']) {
      selectors.push(sel);
    }
    groupBy['incident-likes'] = [];
  }
  for (const s of selectors) {
    try {
      await removeFromRedis(s).catch(err => {
        console.error(`CACHE: error: `, err);
      });
    } catch (e) {
      console.error(`CACHE: Exception:`, e);
      continue;
    }
  }
}
async function removeRedisIncident(id) {
  let selectors = [
    ['count', 'comment', 'all'],
    ['comments', 'incident', id],
    ['count', 'comments', id],
    ['incident',id],
    ['incident',id,'user','comments'],
    ['count','incident','all'],
    ['incident','all','via','role','super'],
    ['incident','all','via','role','admin'],
    ['incident',id,'likes'],
  ];
  if (typeof groupBy['incident-delete'] !== 'undefined') {
    for (const sel of groupBy['incident-delete']) {
      selectors.push(sel);
    }
    groupBy['incident-delete'] = [];
  }
  if (typeof groupBy['incident-update'] !== 'undefined') {
    for (const sel of groupBy['incident-update']) {
      selectors.push(sel);
    }
    groupBy['incident-update'] = [];
  }
  if (typeof groupBy['incident-likes'] !== 'undefined') {
    for (const sel of groupBy['incident-likes']) {
      selectors.push(sel);
    }
    groupBy['incident-likes'] = [];
  }
  for (const s of selectors) {
    try {
      await removeFromRedis(s).catch(err => {
        console.error(`CACHE: error: `, err);
      });
    } catch (e) {
      console.error(`CACHE: Exception:`, e);
      continue;
    }
  }
}
async function createRedisIncident(id) {
  await removeRedisIncident(id);
  /**
   * We just have to remove all the comment counts
   */
  const selectors = [
    ['count', 'comment', 'all'],
    ['count','incident','all'],
    ['incident','all','via','role','super'],
    ['incident','all','via','role','admin'],
  ];
  if (typeof groupBy['incident-update'] !== 'undefined') {
    for (const sel of groupBy['incident-update']) {
      selectors.push(sel);
    }
    groupBy['incident-update'] = [];
  }
  if (typeof groupBy['incident-likes'] !== 'undefined') {
    for (const sel of groupBy['incident-likes']) {
      selectors.push(sel);
    }
    groupBy['incident-likes'] = [];
  }
  for (const s of selectors) {
    try {
      await removeFromRedis(s).catch(err => {
        console.error(`CACHE: error: `, err);
      });
    } catch (e) {
      console.error(`CACHE: Exception:`, e);
      continue;
    }
  }
}
function makeRedisKey(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  if (Array.isArray(arr)) {
    let parts = [];
    for (const p of arr) {
      if (typeof p === 'boolean') {
        parts.push(p ? '1' : '0');
        continue;
      }
      if (Array.isArray(p)) {
        parts.push(p.join(','));
        continue;
      }
      parts.push(p);
    }
    return parts.join(':');
  }
  return arr;
}
async function getRedisDataGroupBy(
  key,
  groupBySelectors,
  fetcher,
  expire = false,
  expiration_seconds = 30
) {
  let results;
  key = makeRedisKey(key);

  for (const item of groupBySelectors) {
    if(!Array.isArray(groupBy[item])){
      groupBy[item] = [];
    }
    if (groupBy[item].indexOf(key) === -1) {
      groupBy[item].push(key);
    }
  }
  console.debug('CACHE: checking cached: "' + key + '"');
  const cacheResults = await global.redisClient.get(key);
  if (cacheResults) {
    console.debug(`CACHE: IS CACHED: ${key}`);
    results = JSON.parse(cacheResults);
  } else {
    console.debug(`CACHE: IS NOT CACHED (maybe expired): ${key}`);
    results = await fetcher(key);
    if (expire) {
      console.debug(`CACHE: Caching ${key} with ${expiration_seconds} TTL`);
      await global.redisClient.set(key, JSON.stringify(results), {
        EX: expiration_seconds,
      });
    } else {
      console.debug(`CACHE: Caching ${key} with NO TTL`);
      await global.redisClient.set(key, JSON.stringify(results));
    }
  }
  return results;
}
async function getRedisData(
  key,
  fetcher,
  expire = false,
  expiration_seconds = 30
) {
  let results;
  key = makeRedisKey(key);

  console.debug('CACHE: checking cached: "' + key + '"');
  const cacheResults = await global.redisClient.get(key);
  if (cacheResults) {
    console.debug(`CACHE: IS CACHED: ${key}`);
    results = JSON.parse(cacheResults);
  } else {
    console.debug(`CACHE: IS NOT CACHED (maybe expired): ${key}`);
    results = await fetcher(key);
    if (expire) {
      console.debug(`CACHE: Caching ${key} with ${expiration_seconds} TTL`);
      await global.redisClient.set(key, JSON.stringify(results), {
        EX: expiration_seconds,
      });
    } else {
      console.debug(`CACHE: Caching ${key} with NO TTL`);
      await global.redisClient.set(key, JSON.stringify(results));
    }
  }
  return results;
}
async function insertRedisData(
  key,
  fetcher,
  expire = false,
  expiration_seconds = 30
) {
  console.debug(`CACHE CHECK: getRedisData`, key);
  let results;
  key = makeRedisKey(key);

  results = await fetcher(key);
  if (expire) {
    console.debug(`CACHE: Caching ${key} with ${expiration_seconds} TTL`);
    await global.redisClient.set(key, JSON.stringify(results), {
      EX: expiration_seconds,
    });
  } else {
    console.debug(`CACHE: Caching ${key} with NO TTL`);
    await global.redisClient.set(key, JSON.stringify(results));
  }
}

async function cacheInRedis(key, data) {
  key = makeRedisKey(key);
  await global.redisClient.set(key, JSON.stringify(data));
}
async function removeFromRedis(key) {
  key = makeRedisKey(key);
  console.debug('CACHE', { removeFromRedis: key });
  await global.redisClient.del(key);
}
async function removeFromRedisMulti(keys) {
  for (const k of keys) {
    let key = makeRedisKey(k);
    console.debug('CACHE', { removeFromRedis: key });
    await global.redisClient.del(key);
  }
}
global.redis = {
  refresh_user: async (id) => {
    const models = require('../app/models');
    let email = await models.User.findOne({where: {id: id}, raw: true,attributes: ['email'],});
    await removeFromRedisMulti([
      ['user',id],
      ['user',id,'is_admin',true],
      ['user',id,'is_admin',false],
    ]);
    if(typeof email !== 'undefined' && typeof email.email !== 'undefined'){
      await removeFromRedisMulti([
        ['user','via','email',email.email,'is_admin',true],
        ['user','via','email',email.email,'is_admin',false],
      ]);
    }
  },
  refresh_user_locality: async (id) => {
    await removeFromRedis(['user',id,'locality','subscription']);
  },
  refresh_user_count: async () => {
    await removeFromRedis(['count','users']);
  },
  remove_locality: removeRedisLocality,
  remove_incident: removeRedisIncident,
  create_incident: createRedisIncident,
  getRedisData: getRedisData,
  getRedisDataGroupBy: getRedisDataGroupBy,
  refresh_incident_comments: async (incident_id) => {
    await removeRedisIncident(incident_id);
  },
};

module.exports = {
  getRedisData,
  cacheInRedis,
  removeFromRedis,
  insertRedisData,
  removeRedisLocality,
  removeFromRedisMulti,
  removeRedisIncident,
  createRedisIncident,
  refreshIncidentLikes,
  getRedisDataGroupBy,
  refreshUser: global.redis.refresh_user,
};
