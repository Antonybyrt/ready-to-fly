import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database.config';
import cors from "cors";
import { FlightController, AirportController } from './controllers';

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

const swapController = new FlightController();
const airportController = new AirportController();

app.use('/flights', swapController.buildRoutes());
app.use('/airports', airportController.buildRoutes());

sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log(`listening on port 3001`);
  });
}).catch((error) => console.error('Error connecting to database', error));