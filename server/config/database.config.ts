import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ReadyToFLy', 'root', 'root', {
    host: '127.0.0.1',
    port: 3001,
    dialect: 'mysql',
    dialectOptions: {
        socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    },
});

export default sequelize;