require('dotenv').config();

export default {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  params: {
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
  },
};
