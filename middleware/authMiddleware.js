const jwt = require("jsonwebtoken");
const settings = require("../config/settings");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(req);
  // check json web token exists & is verified
  if (token) {
    jwt.verify(token, settings.secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.render("index", {
          data: "Oops! you are not Authorized to access this route, Please Login.",
        });
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.render("index", {
      data: "Oops! you are not Authorized to access this route, Please Login.",
    });
  }
};

module.exports = { requireAuth };
