const { App } = require("@slack/bolt");
const { default: fetch } = require("node-fetch");
require('dotenv').config();
const port = 8001;

const serviceHost = "http://localhost:3000"
const ServiceClient = require("./service-client")
const serviceClient = new ServiceClient(serviceHost);


const slackHost = "https://slack.com/api"

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRECT,
    socketMode: true,
    appToken:process.env.SLACK_APP_TOKEN
});

app.command("/pricequote", async ({ command, ack, say }) => {
    ack();
    const serviceResponse = await serviceClient.getLatestCoinData(command.text);

    if (serviceResponse[0]) {
        await say({
            "blocks": [
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": serviceResponse[1]
                    },
                    "accessory": {
                        "type": "image",
                        "image_url": `${serviceResponse[2]}`,
                        "alt_text": "logo"
                    }
                },
                {
                    "type": "section",
                    "block_id": "section567",
                    "text": {
                      "type": "mrkdwn",
                      "text": "<https://coinmarketcap.com/>\n *Today's Cryptocurrency Prices by Market Cap.*"
                    }
                }
            ]
        })
    } else {
        await say(serviceResponse[1]);
    }
});

app.command("/list", async ({ command, ack, say }) => {
    ack();
    const args = command.text.split(" ");

    const serviceResponse = await serviceClient.getTopTen(args[0], args[1], args[2]);

    if (serviceResponse[0]) {
        if (Array.isArray(serviceResponse[1])) {
            const blocks = serviceResponse[1].map(dataString => {
                return {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": dataString
                    },
                }
            });
            
            await say({
                "blocks": [...blocks, {
                    "type": "section",
                    "block_id": "section567",
                    "text": {
                        "type": "mrkdwn",
                        "text": "<https://coinmarketcap.com/>\n *Today's Cryptocurrency Prices by Market Cap.*"
                    }
                }]
            });
        } else {
            say("thing wasn't right")
        }
    } else {
        await say(serviceResponse[1]);
    }
});



app.command("/greendot", async ({ command, ack, say }) => {
    ack();
    console.log(command)

    const url = `${slackHost}/dialog.open`;

    const formJson = {
        "callback_id": "ryde-46e2b0",
        "title": "Request a Ride",
        "submit_label": "Request",
        "state": "Limo",
        "elements": [
          {
            "type": "text",
            "label": "Pickup Location",
            "name": "loc_origin"
          },
          {
            "type": "text",
            "label": "Dropoff Location",
            "name": "loc_destination"
          }
        ]
      }

    try {
        const response = await fetch(url, {
            method: "POST",
            dialog: JSON.stringify(formJson),
            trigger_id: command.trigger_id,
            headers: {
                'Authorization': `Bearer ${process.env.SLACK_USER_TOKEN}`
            }
        })
    
        const json = await response.json();
        console.log(json);
    } catch (err) {
        say(`there was an error: ${err}`)
    }
});





(async () => {
    await app.start(port)
    console.log(`⚡️ Bolt app is running on ${port}!`)
})();