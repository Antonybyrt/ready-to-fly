import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.config';

export class Airport extends Model {
    public id!: number;
    public short_form!: string;
    public name!: string;
}

Airport.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    short_form: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'airports',
    timestamps: false
});
