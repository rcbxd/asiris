const db = require("../util/db");
const sq = require("sequelize");

const Message = db.define("message", {
  id: {
    type: sq.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  timestamp: {
    type: sq.DATE,
    defaultValue: sq.literal("CURRENT_TIMESTAMP")
  },
  body: {
    type: sq.STRING,
    allowNull: false,
    default: "Hello World"
  },
  from: {
    type: sq.INTEGER,
    default: 0,
    allowNull: false
  }
});

module.exports = Message;
