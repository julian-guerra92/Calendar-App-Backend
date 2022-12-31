const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({
            ok: false,
            msg: 'A user already exists with this email!'
         })
      }
      user = new User(req.body);
      //*Encriptado de contraseña
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);
      await user.save();
      //*Generar JWT
      const token = await generateJWT(user.id, user.name);
      return res.status(201).json({
         ok: true,
         uid: user.id,
         name: user.name,
         token
      })
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok: false,
         msg: 'Please talk to the administrator!'
      })
   }
}

const userLogin = async (req, res = response) => {
   const { email, password } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({
            ok: false,
            msg: 'The user does not exist with this email!'
         })
      }
      //*Confirmar los passwords
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
         return res.status(400).json({
            ok: false,
            msg: 'Incorrect password!'
         })
      }
      //*Generar JWT
      const token = await generateJWT(user.id, user.name);
      return res.status(201).json({
         ok: true,
         uid: user.id,
         name: user.name,
         token
      })
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         ok: false,
         msg: 'Please talk to the administrator!'
      })
   }
}

const revalidateToken = async (req, res = response) => {
   const { id, name } = req;
   //*Generar JWT
   const token = await generateJWT(id, name);
   return res.json({
      ok: true,
      token
   })
}

module.exports = {
   createUser,
   userLogin,
   revalidateToken
}