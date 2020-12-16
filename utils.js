function parseToken(req) {
  return req.headers.authorization.slice(7, req.headers.authorization.length);
}

module.exports = { parseToken };
