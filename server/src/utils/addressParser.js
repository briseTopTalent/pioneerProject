'use strict';
var parser = require('parse-address'); 

module.exports = function (str) {
  /* @example: 
   *    524 Port Richmond Ave, Staten Island, NY 10302
   *    {"number":"524","street":"Port Richmond","type":"Ave","city":"Staten Island","state":"NY","zip":"10302"}
   */
  const parsed = parser.parseLocation(str);
  var address = "";
  if (parsed.number)
      address += parsed.number + " ";
  if (parsed.street)
      address += parsed.street;
  if (parsed.type)
      address += " " + parsed.type;
  return address;
};