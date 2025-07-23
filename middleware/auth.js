// middleware/auth.js
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  return res.status(403).send("Access denied. Admins only.");
}

module.exports = {
  isLoggedIn,
  isAdmin
};

