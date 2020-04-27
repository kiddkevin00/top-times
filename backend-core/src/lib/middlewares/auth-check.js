const constants = require('../constants/');
const jwt = require('jsonwebtoken');

const jwtSecret = constants.CREDENTIAL.JWT.SECRET;
const jwtIssuer = constants.CREDENTIAL.JWT.ISSUER;
const jwtAudience = constants.CREDENTIAL.JWT.AUDIENCE;

function authCheckMiddleware(req, res, next) {
  const jwtToken = req.headers.authorization; // req.cookies.jwt;

  try {
    const decodedJwt = jwt.verify(jwtToken, jwtSecret, {
      issuer: jwtIssuer,
      audience: jwtAudience,
    });

    delete decodedJwt.iat;
    delete decodedJwt.nbf;
    delete decodedJwt.exp;
    delete decodedJwt.aud;
    delete decodedJwt.iss;
    delete decodedJwt.sub;

    req.user = decodedJwt; // eslint-disable-line no-param-reassign

    return next();
  } catch (err) {
    // console.error('[DEBUG] The JWT token is invalid', err);
    return res
      .status(constants.SYSTEM.HTTP_STATUS_CODES.UNAUTHENTICATED)
      .send((err && err.message) || constants.AUTH.ERROR_MSG.JWT_INVALID);
  }
}

module.exports = exports = authCheckMiddleware;
