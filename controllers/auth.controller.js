const {User, Sequelize} = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config/config')
const path = require('path');
const { Op } = require("sequelize");

// console.log(path.join(__dirname, "../", "/mail-templates/signup/index.html"))



const createUser = async ({email, password, full_name, nickname, password1,img}) => {
  let imagePath;
  if(img) {
      imagePath = "/" + img
  }
    return new Promise(resolve => {
    
      if(password !== password1) return resolve(null);  
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                // Store hash in your password DB.
                const newuser = await User.create({
                    email,
                    password: hash,
                    full_name,
                    nickname,
                    avatar:imagePath
                })
                resolve(newuser)
            });
          });
        });
}

const getUserById = id => new Promise(async resolve => {
  console.log(id.id);
  const user = await User.findOne({
   where: {
       id: id.id,
   }
  });
  resolve(user)
})

const login = user => new Promise(async resolve => {
  const isUser = await User.findOne({
      where:{
          email: user.body.email
      }
  })
  if(!isUser) return resolve(null)



  bcrypt.compare(user.body.password, isUser.password, function(err, isMatch) {
     if(!isMatch) return resolve(null)
     const token = jwt.sign({
      exp: (Math.floor(Date.now() / 1000) + (60 * 60)) * 24 * 365,
      email: isUser.email,
      id: isUser.id
    }, SECRET_KEY);
    resolve(token);
  })
})

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({where: { id: {[Op.ne]: req.params.id}},});
    res.status(200).send(users);
  } catch (ex) {
    next(ex);
  }
};




const signOut = (req, res) => {
    req.logout();
    res.redirect('/');
  }


module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    signOut,
    login
}