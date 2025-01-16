import { Sequelize } from 'sequelize';
import { config } from 'dotenv'
config();

const sequelize = new Sequelize('ReadyToFly', process.env.DATABASE_USERNAME as string, process.env.DATABASE_PASSWORD, {
    host: process.env.HOST,
    port: 3306,
    dialect: 'mysql',
});

export default sequelize;