const { Joi } = require('celebrate');

const querySchema = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
    locality: Joi.string(),
  }),
};
const queryArrayIds = {
  body: Joi.object().keys({
    ids: Joi.array().required(),
  }),
};

const querySchemaSingle = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};
const commentOnIncident = {
  body: Joi.object().keys({
    incidentID: Joi.string().required(),
    comment: Joi.string().required(),
    img: Joi.string().optional(),
  }),
};
const likeIncident = {
  body: Joi.object().keys({
    incidentID: Joi.string().required(),
  }),
};

const createLocalitySchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    state: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  }),
};

const updateLocalitySchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    state: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
    subscriber_only_comments: Joi.boolean().default(false),
    facebook_graph_token: Joi.string().allow(''),
    twitter_access_token: Joi.string().allow(''),
    twitter_access_token_secret: Joi.string().allow(''),
    twitter_api_key: Joi.string().allow(''),
    twitter_api_secret: Joi.string().allow(''),
    twitter_bearer_token: Joi.string().allow(''),
    twitter_page_name: Joi.string().allow(''),
    news_rss_feed_url: Joi.string().allow(''),
  }),
};

const addSubAdminSchema = {
  body: Joi.object().keys({
    email: Joi.string().email(),
  }),
};

const addDefinition = {
  body: Joi.object().keys({
    field1_name: Joi.string().allow(''),
    field2_name: Joi.string().allow(''),
    field3_name: Joi.string().allow(''),
    field4_name: Joi.string().allow(''),
    field5_name: Joi.string().allow(''),
  }),
};
const createComment = {
  body: Joi.object().keys({
    comment: Joi.string().required(),
    incident_id: Joi.number().required(),
  }),
};

const createIncident = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    sub_locality: Joi.string().optional(),
    address: Joi.string().required(),
    longitude: Joi.any().required(),
    latitude: Joi.any().required(),
    responding_units: Joi.array().items(Joi.string()).default([]),
    featured: Joi.boolean().default(false),
    send_push_notification: Joi.boolean(),
    field1_value: Joi.string().allow(null,''),
    field2_value: Joi.string().allow(null,''),
    field3_value: Joi.string().allow(null,''),
    field4_value: Joi.string().allow(null,''),
    field5_value: Joi.string().allow(null,''),
    facebook_pages: Joi.array().items(Joi.string(),Joi.number()).default([]),
    twitter: Joi.array().items(Joi.string(),Joi.number()).default([]),
  }),
};

const createEvent = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    start_date_time: Joi.date().required(),
    end_date_time: Joi.date().allow(''),
  }),
};

const createPOI = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    longitude: Joi.any().required(),
    latitude: Joi.any().required(),
    notes: Joi.string().default(''),
  }),
};

const createScanner = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    name: Joi.string().required(),
    url: Joi.string().required(),
  }),
};

const createSubLocalitySchema = {
  body: Joi.object().keys({
    locality: Joi.string().required(),
    name: Joi.string().required(),
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  }),
};
const createNotificationSchema = {
  body: Joi.object().keys({
    notification_type: Joi.string().required(),
    notification_id: Joi.string().required(),
  }),
};
const updateNotificationSchema = {
  body: Joi.object().keys({
    notification_type: Joi.string(),
    notification_id: Joi.string(),
  }),
};

module.exports = {
  createNotificationSchema,
  updateNotificationSchema,
  querySchema,
  querySchemaSingle,
  createLocalitySchema,
  updateLocalitySchema,
  addSubAdminSchema,
  addDefinition,
  createIncident,
  createEvent,
  createPOI,
  createScanner,
  createSubLocalitySchema,
  createComment,
  commentOnIncident,
  queryArrayIds,
  likeIncident,
};
