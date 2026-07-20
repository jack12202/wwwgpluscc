const CENTRAL_ACTIVATION_URL = 'https://www.aipass.me/api/recharge-go';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.redirect(302, CENTRAL_ACTIVATION_URL);
};
