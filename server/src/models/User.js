const db = require("../util/db");
const sq = require("sequelize");

const User = db.define("user", {
  id: {
    type: sq.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  email: {
    type: sq.STRING,
    allowNull: false
  },
  password: {
    type: sq.STRING,
    allowNull: false
  },
  firstName: {
    type: sq.STRING,
    allowNull: false
  },
  lastName: {
    type: sq.STRING,
    allowNull: false
  }
});

module.exports = User;
