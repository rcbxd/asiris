const db = require("../util/db");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserSession = require("../models/UserSession");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
const cors = require("cors");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

router.post("/:id/send/", cors(), (req, res) => {
  const { text, from } = req.body;
  Chat.findByPk(req.params.id)
    .then(chat => {
      chat
        .createMessage({
          body: text,
          from: from
        })
        .then(msg => {
          res.send({
            success: true,
            message: "Success: Message Sent.",
            chatMessage: msg
          });
        })
        .catch(err => {
          res.send({
            success: false,
            message: "Error: Server Error."
          });
        });
    })
    .catch(err => {
      res.send({
        success: false,
        message: "Error: Server Error."
      });
    });
});

router.post("/get-user-chats/", cors(), (req, res) => {
  const { body } = req;
  const { uid } = body;
  console.log(req.body);
  let userChats = [];
  // {lastMessage, timeOfLastMessage, from(first and last name)}
  Chat.findAll({
    where: {
      [Op.or]: [{ userOneID: uid }, { userTwoID: uid }]
    }
  }).then(chats => {
    for (i in chats) {
      Message.findAll({
        limit: 1,
        where: {
          chatId: chats[i].id
        },
        order: [["createdAt", "DESC"]]
      })
        .then(msg => {
          let UID =
            uid === chats[i].userOneID
              ? chats[i].userTwoID
              : chats[i].userOneID;
          User.findOne({
            where: {
              id: UID
            }
          })
            .then(user => {
              userChats.push({
                lastMessage: msg[0].dataValues.body,
                timeStamp: msg[0].dataValues.createdAt,
                from: `${user.firstName} ${user.lastName}`,
                chatID: chats[i].id
              });
              if (i == chats.length - 1) {
                console.log(userChats);
                res.send({
                  success: true,
                  userChats: userChats
                });
              }
            })
            .catch(err => {
              res.send({
                success: false,
                message: "Error: Server Error"
              });
            });
        })
        .catch(err => {
          res.send({
            success: false,
            message: "Error: Server Error."
          });
        });
    }
  });
});

router.get("/:id", (req, res) => {
  const chatID = req.params.id;
  const userToken = req.query.token;
  Chat.findByPk(chatID).then(chat => {
    UserSession.findOne({
      where: {
        token: userToken
      }
    }).then(session => {
      chat.getMessages().then(msgs => {
        let UID =
          session.userId === chat.userOneID ? chat.userTwoID : chat.userOneID;
        User.findOne({
          where: {
            id: UID
          }
        }).then(user => {
          res.send({
            success: true,
            messsage: "Success: Chat Fetched,",
            messages: msgs,
            contactID: user.id,
            contactName: `${user.firstName} ${user.lastName}`
          });
        });
      });
    });
  });
});

module.exports = router;
