const models = require('../../models');
const Utils = require('../../../utils');

const FetchOneComment = async id => {
  try {
    //const includes = {
    //    include: [{
    //        model: models.Locality,
    //        as: "ilocality",
    //        attributes: ["name"]
    //    },{
    //        model: models.SubLocality,
    //        as: "iSlocality",
    //        attributes: ["name"]
    //    },{
    //        model: models.User,
    //        as: "createdBy",
    //        attributes: ["first_name", "last_name"]
    //    }]
    //}
    const d = await models.Comment.findOne({ where: { id } }); //, ...includes });
    return Utils.InternalRes(false, 'success', d);
  } catch (err) {
    throw err;
  }
};

module.exports = FetchOneComment;
