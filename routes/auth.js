/*
   Rutas de Usuarios / Auth
   host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, userLogin, revalidateToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

const router = Router();

router.post(
   '/register',
   [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Email is required').isEmail(),
      check('password', 'Password most be 6 characters').isLength({ min: 6 }),
      fieldValidator
   ],
   createUser
);

router.post(
   '/',
   [
      check('email', 'Email is required').isEmail(),
      check('password', 'Password is required').not().isEmpty(),
      fieldValidator
   ],
   userLogin
);

router.get('/renew', validatorJWT, revalidateToken);

module.exports = router;