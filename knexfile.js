require("dotenv").config();
const fs = require("fs");
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: 20847,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      ca: fs.readFileSync(__dirname + "/mysql-ca.crt"),
    },
  },
};
