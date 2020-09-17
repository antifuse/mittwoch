import Twitter = require("twitter")
import * as cron from "node-cron";
import * as fs from "fs";
const config = require("./config.json")
const t = new Twitter({
    consumer_key: config["consumer-key"],
    consumer_secret: config["consumer-secret"],
    access_token_key: config["access-token"],
    access_token_secret: config["access-secret"]
});
const image = fs.readFileSync("./mittwochmeineduden.png");

function mittwoch() {
    t.post("media/upload", {media: image}, (error, media, res)=>{
        if (error) {
            t.post("statuses/update", {status: "Es ist ein fehlerhafter Mittwoch, meine Duden."});
        } else {
            t.post('statuses/update', {
                status: "Es ist Mittwoch, meine Duden.",
                media_ids: media.media_id_string
            })
        }
    });
}
function anderertag() {
    t.post("statuses/update", {
        status: "Es ist nicht Mittwoch, meine Duden."
    })
}

cron.schedule(`${config.minute} ${config.hour} * * 3`, mittwoch)
cron.schedule(`${config.minute} ${config.hour} * * 4-7,1,2`, anderertag)

