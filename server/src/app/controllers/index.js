module.exports = controller => {
  console.debug({controller})
  return async (req, res, next) => {
    try {
      return await controller(req, res, next);
    } catch (err) {
      console.log('\n\nerr--->', err);
      next(err);
    }
  };
};
