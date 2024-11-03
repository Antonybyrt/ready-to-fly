import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import sequelize from '../config/database.config';
import { Airport } from './airport.model';

export class Flight extends Model {
    public id!: number;
    public departure_id!: number;
    public arrival_id!: number;
    public duration!: number;
    public start_date!: Date;
    public end_date!: Date;
    public appreciation?: string;

    public getDepartureAirport!: BelongsToGetAssociationMixin<Airport>;
    public getArrivalAirport!: BelongsToGetAssociationMixin<Airport>;
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
    }
}, {
    sequelize,
    tableName: 'flights',
    timestamps: false
});

Flight.belongsTo(Airport, { foreignKey: 'departure_id', as: 'departureAirport' });
Flight.belongsTo(Airport, { foreignKey: 'arrival_id', as: 'arrivalAirport' });