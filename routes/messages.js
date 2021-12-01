//Require express as middleware
const express = require("express");
const router = express.Router();
const messageQuery = require("../db/messages-query");
const itemQuery = require("../db/item-query");
const newMessage = require("../db/add_message-query");

router.get("/", (req, res) => {
  const user_id = req.session.user_id;
  const templateVars = {
    user_id,
    conversation: [],
    item: [],
  };
  res.render("messages", templateVars);
});

router.get("/:itemID/:user2ID", (req, res) => {
  const itemID = req.params.itemID;
  const user_id = req.session.user_id;
  const user2ID = req.params.user2ID;

  messageQuery
    .getMessageHistory(itemID, user_id, user2ID)
    .then((conversation) => {
      itemQuery.getItemById(itemID).then((item) => {
        const templateVars = { conversation, user_id, item };
        console.log(templateVars);
        res.render("messages", templateVars);
      });
    });
});

//send message from view item page
router.post("/new", (req, res) => {
  const sender_id = req.session.user_id; //get id from session;
  const item_id = req.body.item_id; //get item_id from form;
  const reciever_id = req.body.reciever_id; //get reciever_id from form;
  const message = req.body.message; //get message from form;

  newMessage
    .addMessage(sender_id, item_id, reciever_id, message)
    .then((res) => {
      const templateVars = {
        message,
      };
      console.log(templateVars);
    });
  res.redirect(`/messages/${item_id}/${reciever_id}`);
});

module.exports = router;
