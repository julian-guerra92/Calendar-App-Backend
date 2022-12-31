const { response } = require("express");
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
   const events = await Event.find()
      .populate('user', 'name');
   return res.status(200).json({
      ok: true,
      events
   })
}

const createEvent = async (req, res = response) => {
   const event = new Event(req.body);
   try {
      event.user = req.id;
      const saveEvent = await event.save();
      return res.status(201).json({
         ok: true,
         saveEvent
      })
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok: false,
         msg: 'Talk with the administrator'
      })
   }
}

const updateEvent = async (req, res = response) => {
   const eventId = req.params.id;
   const userId = req.id;
   try {
      const event = await Event.findById(eventId);
      if (!event) {
         return res.status(404).json({
            ok: false,
            msg: 'Event with this id does not exist!'
         })
      }
      if (event.user.toString() !== userId) {
         return res.status(401).json({
            ok: false,
            msg: 'You are not authorized to edit this event!'
         })
      }
      const newEvent = {
         ...req.body,
         user: userId
      }
      const updateEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });
      return res.status(200).json({
         ok: true,
         event: updateEvent
      })
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok: false,
         msg: 'Talk with the administrator'
      })
   }
}

const deleteEvent = async (req, res = response) => {
   const eventId = req.params.id;
   const userId = req.id;
   try {
      const event = await Event.findById(eventId);
      if (!event) {
         return res.status(404).json({
            ok: false,
            msg: 'Event with this id does not exist!'
         })
      }
      if (event.user.toString() !== userId) {
         return res.status(401).json({
            ok: false,
            msg: 'You are not authorized to delete this event!'
         })
      }
      const deleteEvent = await Event.findByIdAndDelete(eventId);
      return res.status(200).json({
         ok: true,
         event: deleteEvent
      })
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok: false,
         msg: 'Talk with the administrator'
      })
   }
}

module.exports = {
   getEvents,
   createEvent,
   updateEvent,
   deleteEvent,
}