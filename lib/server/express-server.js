const express = require('express');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const allowedOrigin = 'www.toptimes.com';

function setupExpressServer(app) {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(308, `https://${req.headers.host}${req.url}`);
      }
      return next();
    });

    app.use((req, res, next) => {
      if (req.headers.host !== allowedOrigin) {
        return res.redirect(308, `https://${allowedOrigin}${req.url}`);
      }
      return next();
    });
  }

  app.use(compression());
  app.use(favicon(path.resolve(__dirname, '../../build/', 'favicon.ico')));

  // For 404 error and server-side rendering pages only.
  app.set('views', path.resolve(__dirname, 'views/'));
  app.set('view engine', 'jade');

  app.use(
    express.static(path.resolve(__dirname, '../../', 'build/'), {
      etag: true,
      setHeaders(res, filePath) {
        if (env === 'production') {
          if (filePath.includes('.js')) {
            res.append('Cache-Control', 'private, max-age=31536000'); // Set for one year
          } else if (filePath.includes('.css') || filePath.includes('.map')) {
            res.append('Cache-Control', 'public, max-age=31536000'); // Set for one year
          } else {
            res.append('Cache-Control', 'public, max-age=86400'); // Set for one day
          }
        } else {
          res.append('Cache-Control', 'no-store');
        }
      },
    })
  );

  if (env === 'production') {
    const accessLogStream = fs.createWriteStream(path.resolve(__dirname, '../../', 'morgan.log'), {
      flags: 'a',
    });

    app.use(morgan('combined', { stream: accessLogStream }));
  }
  app.use(morgan('dev'));
}

module.exports = exports = setupExpressServer;
