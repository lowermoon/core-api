const Sequelize = require('sequelize');
const dotenv= require('dotenv');

dotenv.config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    '@Vi{2~:]f;Kvi`9a',
    {
        host : process.env.DB_HOST,
        dialect: 'mysql',
        logging: false
    }
)

module.exports = db