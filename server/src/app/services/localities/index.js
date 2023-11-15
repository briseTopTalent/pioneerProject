module.exports = {
  CreateLocality: require('./createLocality'),
  FindAllLocalities: require('./fetchLocalities'),
  FindById: require('./fetchLocalityById'),
  UpdateLocality: require('./updateLocality'),
  ViewAdmins: require('./viewAdmins'),
  AddAdmin: require('./addAdmin'),
  RemoveAdmin: require('./removeAdmin'),
  FindByUserID: require('./fetchLocalitiesByUser'),
  ViewAdminLocalities: require('./viewAdminLocalities'),
  FindDefinition: require('./fetchIncidentFields'),
  FetchRespondingUnits: require('./fetchRespondingUnits'),
  FetchCount: require('./count'),
  UpdateDefinition: require('./updateDefinition'),
  RecursiveFindLocalities: require('./recursiveFetchLocalities'),
  GetSetup: require('./getSetup'),
  FetchAvailableLocalities: require('./fetchAvailableLocalities'),
};