const express = require('express');
const router = express.Router();
const {User, Sequelize} = require("../models");
const {createUser, login, signOut, getAllUsers, getUserById} = require('../controllers/auth.controller')
const {upload} = require('../multer/multer');
// const {registrationValidator} = require('../middleware/auth.middleware');

router.post("/api/auth/signup", upload.single('avatar'), async (req, res) =>{
   console.log(req.file.filename+"URAAAAA");
   try{
      const user = await createUser({
         email:req.body.email,
         full_name:req.body.full_name,
         nickname:req.body.nickname,
         password:req.body.password,
         password1:req.body.password1,
         img:req.file.filename,
      })
      // console.log(user);
      res.status(200).send(user)
      // res.redirect('/login');
  }catch(error){
      res.status(400).send(error)
  }
})

router.post('/api/signin', async (req, res) => {
   console.log(req.user);
     const token = await login(req)
     if(token){
         const isUser = await User.findOne({
            where:{
               email: req.body.email
            }
         })
        res.status(200).send({token, nickname:isUser.nickname, user_id: isUser.id});
     }else{
        res.status(401).end();
     }
})

router.get("/api/auth/allusers/:id", getAllUsers);

router.get('/api/users/:id', async (req,res) => {
   // console.log(req);
   try{
   const users = await getUserById({id:req.params.id})
   // console.log(users);
   res.status(200).send(users);
   }catch(err){
      res.status(400).send(err);
   }
})

router.get('/api/auth/signout', signOut);

module.exports = router