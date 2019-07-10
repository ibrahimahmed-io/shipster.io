const Telegraf = require("telegraf");
const MongoClient = require("mongodb").MongoClient;
const say = require("say");
const uuidv1 = require("uuid/v1");
const dbService = require("./db");

const bot = new Telegraf(process.env.BOT_TOKEN);

let waiting_for_answer = false;
let answer_type = null;

module.exports = {
    start: () => {
        bot.start(ctx =>
            ctx.reply("Greetings fellow shipster 🚢! How can i help you?")
        );

        bot.command("find", ctx => {
            waiting_for_answer = true;
            answer_type = "shipment_id";

            ctx.reply("Please send me your shipment id.");
        });

        bot.on("message", ctx => {
            if (waiting_for_answer) {
                switch (answer_type) {
                    case "shipment_id":
                        let testdb = dbService.db.db("test");
                        let shipments = testdb.collection("shipments");

                        shipments.findOne({ id: +ctx.message.text }, function(
                            err,
                            result
                        ) {
                            if (result) {
                                ctx.reply(
                                    `Customer: ${result.customer}\nAddress: ${
                                        result.address
                                    }\nCity: ${result.city}\nCountry: ${
                                        result.country
                                    }\nEstimated Delivery: ${
                                        result.estimatedDelivery
                                    }`
                                );

                                const file_id = uuidv1();

                                say.export(
                                    result.country,
                                    null,
                                    0.75,
                                    `./temp/${file_id}.wav`,
                                    err => {
                                        ctx.replyWithAudio({
                                            source: `./temp/${file_id}.wav`
                                        });
                                    }
                                );
                            } else {
                                ctx.reply(
                                    "Sorry i couldn't find a shipment that matches your id 🤔. Try again 🤞"
                                );
                            }
                        });
                        break;
                }

                waiting_for_answer = false;
                answer_type = "";
            } else {
                ctx.reply(
                    "You can control me by sending these commands:\n\n/find - find your shipment using the provided shipment id."
                );
            }
        });

        bot.launch();
    }
};
