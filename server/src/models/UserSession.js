const db = require("../util/db");
const sq = require("sequelize");

const UserSession = db.define("user_session", {
  userId: {
    type: sq.INTEGER,
    defaultValue: 0
  },
  timestamp: {
    type: sq.DATE,
    defaultValue: sq.literal("CURRENT_TIMESTAMP")
  },
  isDeleted: {
    type: sq.BOOLEAN,
    defaultValue: false
  },
  token: {
    type: sq.STRING,
    allowNull: false
  }
});

module.exports = UserSession;
