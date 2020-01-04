const db = require("../util/db");
const sq = require("sequelize");

const Chat = db.define("chat", {
  id: {
    type: sq.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  userOneID: {
    type: sq.INTEGER,
    allowNull: false,
    default: 0
  },
  userTwoID: {
    type: sq.INTEGER,
    allowNull: false,
    default: 0
  }
});

module.exports = Chat;
