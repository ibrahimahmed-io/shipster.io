const dotenv = require("dotenv");
//Setup environment variables
dotenv.config();

const Seeder = require("./src/db/seed");
const App = require("./src/shipster");
const dbService = require("./src/db");

//Seeder.seedShipments();

dbService.connect(err => {
    if (err) {
	console.log(err);
        process.exit(1);
    } else {
	console.log('App started');
	console.log(process.env.BOT_TOKEN);
        App.start(); //Start bot updates
    }
});
