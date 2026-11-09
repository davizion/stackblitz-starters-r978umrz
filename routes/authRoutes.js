const express = require('express');
const controller = require('../controllers/authController');
const autenticar = require('../middlewares/autenticar');

const router = express.Router();

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);
router.get('/perfil', autenticar, controller.perfil);

module.exports = router;