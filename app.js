const { App } = require("@slack/bolt");
require('dotenv').config();
const serviceHost = "http://localhost:3000"
const port = 8001;
const ServiceClient = require("./service-client")
const serviceClient = new ServiceClient(serviceHost);

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
                }, 
                {
                    "type": "divider"
                }
            ]
        })
    } else {
        await say(serviceResponse[1]);
    }


})

app.message("~Bitcoin-price", async ({message, say}) => {
    const serviceResponse = await serviceClient.getLatestCoinData("bitcoin");
    await say({
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Bitcoin Price:* $${serviceResponse[0].quote.USD.price}.`
                }
            },
            {
                "type": "section",
                "block_id": "section567",
                "text": {
                  "type": "mrkdwn",
                  "text": "<https://coinmarketcap.com/>\n *Today's Cryptocurrency Prices by Market Cap.*"
                }
            },

        ]
    })
});

(async () => {
    await app.start(port)
    console.log(`⚡️ Bolt app is running on ${port}!`)
})();