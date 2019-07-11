const Telegraf = require("telegraf");
const Telegram = require('telegraf/telegram');
const MongoClient = require("mongodb").MongoClient;
const say = require("say");
const uuidv1 = require("uuid/v1");
const dbService = require("./db");
const textToSpeech = require('@google-cloud/text-to-speech');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const util = require('util');
const https = require('https');

const bot = new Telegraf(process.env.BOT_TOKEN);
const telegram = new Telegram(process.env.BOT_TOKEN);
const txtToSpeechClient = new textToSpeech.TextToSpeechClient();
const speechClient = new speech.SpeechClient();

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

	bot.on("voice", ctx => {
	    let file_id = ctx.message.voice.file_id;

	    telegram.getFileLink(file_id).then((file_url) => {
		const file = fs.createWriteStream(`.\temp\{file_id}.ogg`);
		
		const request = https.get(file_url, function(response) {
		    response.pipe(file);
		});
		
		file.on('finish', async function () {
		    const fileName = `.\temp\{file_id}.ogg`;
		    const file = fs.readFileSync(fileName);
		    const audioBytes = file.toString('base64');

		    const audio = {
  			content: audioBytes,
  		    };

		    const config = {
			encoding: 'OGG_OPUS',
    			sampleRateHertz: 16000,
    			languageCode: 'ar-EG',
  		    };

  		    const request = {
    			audio: audio,
    			config: config,
  		    };

		    const [response] = await speechClient.recognize(request);

		    const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');

		    console.log(transcription);

		    ctx.reply(transcription);
		});
	    });
	});

        bot.on("message", (ctx) => {
            if (waiting_for_answer) {
                switch (answer_type) {
                    case "shipment_id":
                        let testdb = dbService.db.db("test");
                        let shipments = testdb.collection("shipments");

                        shipments.findOne({ id: +ctx.message.text }, async function(
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

				let request = {
				    input: {text: result.country},
				    voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
				    audioConfig: {audioEncoding: 'LINEAR16'}
				};

				const [response] = await txtToSpeechClient.synthesizeSpeech(request);
				console.log(response);
				const writeFile = util.promisify(fs.writeFile);
				await writeFile(`./temp/${file_id}.wav`, response.audioContent, 'binary');

				ctx.replyWithAudio({
                                    source: `./temp/${file_id}.wav`
                                });
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
