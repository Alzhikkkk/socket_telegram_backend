const { addMessage, getMessages, getMessagesByRoom } = require("../controllers/message.controller");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", async (req, res) => {
    try{
        const messages = await getMessages({from:req.body.from, to:req.body.to});
        res.status(200).send(messages);
    }catch(error){
        res.status(400).send(error);
    }
});

router.post("/getmsg/room/", async (req, res) => {
    try{
        const messages = await getMessagesByRoom({from:req.body.from, roomId:req.body.roomId});
        res.status(200).send(messages);
    }catch(error){
        res.status(400).send(error);
    }
});

module.exports = router;