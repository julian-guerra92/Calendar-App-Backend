/*
   Rutas de Eventos / Events
   host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/field-validator');
const { validatorJWT } = require('../middlewares/jwt-validator');

const router = Router();

//*Todas las peticiones requieres el validatorJWT
router.use(validatorJWT);

router.get('/', getEvents);

router.post(
   '/',
   [
      check('title', 'Title is required').not().isEmpty(),
      check('start', 'Start date is required').custom(isDate),
      check('end', 'End date is required').custom(isDate),
      fieldValidator
   ],
   createEvent
);

router.put('/:id',
   [
      check('title', 'Title is required').not().isEmpty(),
      check('start', 'Start date is required').custom(isDate),
      check('end', 'End date is required').custom(isDate),
      fieldValidator
   ],
   updateEvent
);

router.delete('/:id', deleteEvent);

module.exports = router;