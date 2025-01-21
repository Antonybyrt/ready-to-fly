import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database.config';
import cors from "cors";
import { FlightController, AirportController, AuthController, UserController } from './controllers';

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

const flightController = new FlightController();
const airportController = new AirportController();
const authController = new AuthController();
const userController = new UserController();

app.use('/flights', flightController.buildRoutes());
app.use('/airports', airportController.buildRoutes());
app.use('/auth', authController.buildRoutes());
app.use('/user', userController.buildRoutes());

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}).catch((error) => console.error('Error connecting to database', error));