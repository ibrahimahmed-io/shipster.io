const dotenv = require("dotenv");
//Setup environment variables
dotenv.config();

const Seeder = require("./src/db/seed");
const App = require("./src/shipster");
const dbService = require("./src/db");

//Seeder.seedShipments();

dbService.connect(err => {
    if (err) {
        process.exit(1);
    } else {
        App.start(); //Start bot updates
    }
});
