# Ready to Fly

## Description
**Ready to Fly** is a web application designed for flight attendants to log their flights, keep track of upcoming trips, and analyze their statistics. The project consists of:

- **Frontend**: Built with Next.js, TypeScript, and TailwindCSS.
- **Backend**: Node.js with Express and Sequelize.
- **Database**: Uses a relational database (PostgreSQL or MySQL, depending on configuration).

## Features
- **User authentication**: Flight attendants can create an account and log in.
- **Flight management**: Add, edit, and delete flight records.
- **Upcoming flights**: View the next scheduled flights.
- **Statistics**: Analyze flight data using interactive charts.
- **Responsive design**: Works across devices.

## Technologies Used
### Frontend
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chart.js](https://www.chartjs.org/)
- [SweetAlert2](https://sweetalert2.github.io/)
- [Axios](https://axios-http.com/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/) or [MySQL](https://www.mysql.com/)

## Installation
### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running PostgreSQL or MySQL database

### Setup
#### 1. Clone the Repository
```sh
git clone https://github.com/antonybyrt/ready-to-fly.git
cd ready-to-fly
```

#### 2. Install Dependencies
##### Frontend
```sh
cd ready-to-fly
npm install  # or yarn install
```

##### Backend
```sh
cd server
npm install  # or yarn install
```

#### 3. Configure Environment Variables
Create a `.env` file in both the frontend and backend directories based on `.env.default`.

##### Backend `.env`
```
DATABASE_URL=postgres://user:password@localhost:5432/readytofly
JWT_SECRET=your_secret_key
```

#### 4. Start the Application
##### Start the Backend
```sh
cd server
npm start  # or yarn start
```

##### Start the Frontend
```sh
cd ready-to-fly
npm run dev  # or yarn dev
```

The frontend should be accessible at `http://localhost:3000`, and the backend at `http://localhost:3001` (if configured to run on port 3001).

## License
This project is licensed under the AGPL-3.0 License. See the `LICENSE` file for details.

## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request.

## Contact
For any questions or feedback, feel free to reach out via [GitHub Issues](https://github.com/antonybyrt/ready-to-fly/issues).

This website is deployed with vercel, if you want an account, please send me an email at : `antony.loussararian@gmail.com`.