module.exports = (req, res, next) => {
  res.success = function (code, message, data) {
    res.status(code).send({
      response: { success: true, message: message || "", data: data || {} },
    });
  };
  next();
};
