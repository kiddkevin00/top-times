const Controller = require('../../controllers/users.controller');
const authCheckMiddleware = require('../../middlewares/auth-check');
const { Router } = require('express');

const router = Router();

router.get('/', [authCheckMiddleware], Controller.getUserProfile);
router.patch('/', [authCheckMiddleware], Controller.updateUserProfile);
router.delete('/', [authCheckMiddleware], Controller.suspendUser);

module.exports = exports = router;
