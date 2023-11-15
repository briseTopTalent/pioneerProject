module.exports = {
  FetchIncident: require('./fetchIncident'),
  FindByID: require('./fetchOne'),
  CreateNew: require('./create'),
  CommentOnIncident: require('./comment'),
  UpdateIncident: require('./update'),
  FetchCount: require('./count'),
  DeleteIncident: require('./delete'),
  GetDetailsById: require('./getDetailsById'),
  GetByLocality: require('./getByLocality'),
  LikeIncident: require('./likeIncident'),
  DislikeIncident: require('./dislikeIncident'),
};
