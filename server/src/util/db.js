const Sequelize = require("sequelize");

const db = new Sequelize("chatroom", "rcbxd", "tester", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = db;
