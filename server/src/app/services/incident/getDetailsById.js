'use strict';
const models = require('../../models');
const Utils = require('../../../utils');
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2022            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit === 'K') {
      dist = dist * 1.609344;
    }
    if (unit === 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
const GetDetailsById = async id => {
  try {
    let incident = await global.redis.getRedisData(['incident',id],async () => {
      return await models.Incident.findAll({ where: { id }, raw: true });
    });
    if (!incident.length) {
      return Utils.InternalRes(true, 'Couldnt find incident by id');
    }

    let comments = await global.redis.getRedisData(['incident',id,'user','comments'], async () => {
      return await models.Comment.findAll({
        include: [{
          model: models.User, as: "UserInfo",
          required: true
        }],
        attributes: {
          exclude: ['password', 'reset_pw_before', 'reset_pw_hash', 'web_token']
        },
        where: {
          incident_id: id,
        },
        raw: true,
      });
    });
    const lat = incident[0].latitude;
    const long = incident[0].longitude;
    const points = await models.PointOfInterest.findAll({ raw: true });
    let filtered_points = [];
    for (const p of points) {
      if (distance(lat, long, p.latitude, p.longitude, 'M') <= 10.0) {
        filtered_points.push(p);
      }
    }

    return Utils.InternalRes(false, 'success', {
      data: {
        incident: incident[0],
        comments,
        points_of_interest: filtered_points,
      },
    });
  } catch (err) {
    throw err;
  }
};

module.exports = GetDetailsById;
