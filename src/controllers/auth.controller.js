function postSignup(req, res) {
  res.status(200).json({ message: 'User succesfully signed up' });
}
function postLogin(req, res) {
  res.status(200).json({ message: 'Login succesfull' });
}

module.exports = {
  postLogin,
  postSignup,
};
