const Controller = require('../../controllers/auth.controller');
const authCheckMiddleware = require('../../middlewares/auth-check');
const { Router } = require('express');

const router = Router();

router.post('/signup', Controller.signup);
router.post('/login', Controller.login);
router.get('/logout', Controller.logout);
router.get('/check', [authCheckMiddleware], Controller.getMyProfile);

module.exports = exports = router;
