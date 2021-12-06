function postSignup(req, res) {
  res.status(200).json({ message: 'User succesfully signed up' });
}
function postLogin(req, res) {
  // eslint-disable-next-line no-underscore-dangle
  res.status(200).json({ id: req.user._id, message: 'Login succesfull' });
}

module.exports = {
  postLogin,
  postSignup,
};
