const {Message, Sequelize} = require('../models'); 
const { Op } = require("sequelize");

const getMessages = async ({from, to}) => {
  return new Promise(async resolve => {
        const messages = await Message.findAll({
          where:{
            users: {
              [Op.contains]: [from, to],
            }},
            include:['authors'],
            order: [
              ['updatedAt', 'ASC'],
          ],
      });
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.user.toString() === from,
          message: msg.text,
          avatar:msg.authors.avatar,
          full_name:msg.authors.full_name,
        };
      });
      resolve(projectedMessages);
  })
  };

  const getMessagesByRoom = async ({from, roomId}) => {
    return new Promise(async resolve => {
          const messages = await Message.findAll({
            where:{
              roomId
            },
            include:['authors']
        });
        // console.log(messages);
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.user.toString() === from,
            message: msg.text,
            avatar:msg.authors.avatar,
            full_name:msg.authors.full_name,
          };
        });
        // console.log(projectedMessages);
        resolve(projectedMessages);
    })
    };
  
  const addMessage = async (req, res, next) => {
    try {
      const { from, to, message, roomId } = req.body;
      const data = await Message.create({
        text: message ,
        users: [from, to],
        user: from,
        roomId
      });
  
      if (data) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports ={
    getMessages,
    addMessage,
    getMessagesByRoom
  }