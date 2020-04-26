const Controller = require('../../controllers/timeZones.controller');
const authCheckMiddleware = require('../../middlewares/auth-check');
const { Router } = require('express');

const router = Router();

router.post('/', [authCheckMiddleware], Controller.addTimeZone);
router.get('/', [authCheckMiddleware], Controller.getTimeZone);
router.patch('/', [authCheckMiddleware], Controller.updateTimeZone);
router.delete('/', [authCheckMiddleware], Controller.removeTimeZone);

module.exports = exports = router;
