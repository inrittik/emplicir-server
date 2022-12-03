module.exports = (fn: any) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
