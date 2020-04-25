const packageJson = require('../../package.json');
const errorHandler = require('errorhandler');
const path = require('path');

const serverStartTimestamp = new Date();
const containerId = process.env.HOSTNAME;

function setupRoutes(app) {
  app.get('/ping', (req, res) =>
    res.json({
      uptimeInSec: (new Date().getTime() - serverStartTimestamp.getTime()) / 1000,
      hostname: containerId || 'N/A',
    })
  );
  app.get('/health', (req, res) =>
    res.json({
      version: packageJson.version,
      self: {
        name: packageJson.name,
        version: packageJson.version,
        status: 200,
        serverDateStamp: new Date().toString(),
        hostname: containerId || 'N/A',
      },
      dependencies: {
        http: [],
      },
    })
  );

  // All not-found GET endpoints should return an custom 404 page (this should be sync with `CopyWebpackPlugin` in webpack.config.js).
  app.route('/:url(images|pdf|.well-known)/*').get((req, res) =>
    res.render('404', err => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.sendStatus(500);
    })
  );

  // All other endpoints should redirect to the index.html.
  app.use((req, res) => {
    let headers;

    if (process.env.NODE_ENV === 'production') {
      headers = { 'Cache-Control': 'no-cache' };
    } else {
      headers = { 'Cache-Control': 'no-store' };
    }
    res.set(headers);

    return res.sendFile(path.resolve(__dirname, '../../build/', 'index.html'));
  });

  if (process.env.NODE_ENV !== 'production') {
    app.use(errorHandler()); // Error handler - has to be the last.
  }
}

module.exports = exports = setupRoutes;
