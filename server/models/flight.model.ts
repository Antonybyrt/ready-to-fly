import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { Airport } from './airport.model';
import { User } from './user.model';

export class Flight extends Model {
    public id!: number;
    public departure_id!: number;
    public arrival_id!: number;
    public duration!: number;
    public start_date!: Date;
    public end_date!: Date;
    public appreciation?: string;
    public user_id!: number;

    public getDepartureAirport!: BelongsToGetAssociationMixin<Airport>;
    public getArrivalAirport!: BelongsToGetAssociationMixin<Airport>;
    public getUser!: BelongsToGetAssociationMixin<User>;
}

Flight.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    departure_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Airport,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    arrival_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Airport,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    appreciation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    tableName: 'flights',
    timestamps: false
});

Flight.belongsTo(Airport, { foreignKey: 'departure_id', as: 'departureAirport' });
Flight.belongsTo(Airport, { foreignKey: 'arrival_id', as: 'arrivalAirport' });
Flight.belongsTo(User, { foreignKey: 'user_id', as: 'user' });