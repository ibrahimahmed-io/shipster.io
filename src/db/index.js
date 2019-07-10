const MongoClient = require("mongodb").MongoClient;

const client = MongoClient(process.env.MONGO_URL, {
    useNewUrlParser: true
});

const dbService = {
    db: undefined,
    connect: callback => {
        client.connect(err => {
            if (err) {
                client.close();
                callback(err);
            }

            dbService.db = client;
            callback(null);
        });
    }
};

module.exports = dbService;
