const { App } = require("@slack/bolt");
require('dotenv').config();
const port = 8001;

const serviceHost = "http://localhost:3000"
const ServiceClient = require("./service-client")
const serviceClient = new ServiceClient(serviceHost);

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRECT,
    socketMode: true,
    appToken:process.env.SLACK_APP_TOKEN
});

// // app.message("hey there", async ({say}) => {
//     await say({
//         "blocks": [
//             {
//                 "type": "divider"
//             },
//             {
//                 "type": "section",
//                 "text": {
//                     "type": "mrkdwn",
//                     "text": "press this button if you dare!!! :ghost:"
//                 },
//                 "accessory": {
//                     "type": "button",
//                     "text": {
//                         "type": "plain_text",
//                         "text": ":skull_and_crossbones:",
//                         "emoji": true
//                     },
//                     "action_id": "actionId-0"
//                 }
//             }
//         ]
//     })
// })

// app.action("actionId-0", async ({say}) => {
//     await say({
//         "blocks": [
//             {
//                 "type": "divider"
//             },
//             {
//                 "type": "section",
//                 "text": {
//                     "type": "mrkdwn",
//                     "text": "Relax, its just a cat."
//                 },
//                 "accessory": {
//                     "type": "image",
//                     "image_url": "https://pbs.twimg.com/profile_images/625633822235693056/lNGUneLX_400x400.jpg",
//                     "alt_text": "cute cat"
//                 }
//             }
//         ]
//     })
// });

// app.command("/pricequote", async ({ command, ack, say }) => {
//     ack();
//     console.log(command)
//     const serviceResponse = await serviceClient.getLatestCoinData(command.text);

//     if (serviceResponse[0]) {
//         await say({
//             "blocks": [
//                 {
//                     "type": "divider"
//                 },
//                 {
//                     "type": "section",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": serviceResponse[1]
//                     },
//                     "accessory": {
//                         "type": "image",
//                         "image_url": `${serviceResponse[2]}`,
//                         "alt_text": "logo"
//                     }
//                 },
//                 {
//                     "type": "section",
//                     "block_id": "section567",
//                     "text": {
//                       "type": "mrkdwn",
//                       "text": "<https://coinmarketcap.com/>\n *Today's Cryptocurrency Prices by Market Cap.*"
//                     }
//                 }
//             ]
//         })
//     } else {
//         await say(serviceResponse[1]);
//     }
// });

// app.command("/list", async ({ command, ack, say }) => {
//     ack();
//     const args = command.text.split(" ");

//     const serviceResponse = await serviceClient.getTopTen(args[0], args[1], args[2]);

//     if (serviceResponse[0]) {
//         if (Array.isArray(serviceResponse[1])) {
//             const blocks = serviceResponse[1].map(dataString => {
//                 return {
//                     "type": "divider"
//                 },
//                 {
//                     "type": "section",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": dataString
//                     },
//                 }
//             });
            
//             await say({
//                 "blocks": [...blocks, {
//                     "type": "section",
//                     "block_id": "section567",
//                     "text": {
//                         "type": "mrkdwn",
//                         "text": "<https://coinmarketcap.com/>\n *Today's Cryptocurrency Prices by Market Cap.*"
//                     }
//                 }]
//             });
//         } else {
//             say("thing wasn't right")
//         }
//     } else {
//         await say(serviceResponse[1]);
//     }
// });

const getFormattedDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return `${year}-${month + 1}-${day}`;
}

const getFormmatedTimeString = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${hours}:${minutes}`;
}

app.shortcut("greendot123", async ({ack, body}) => {
    ack();

    const view = JSON.stringify({
                "type": "modal",
                "title": {
                    "type": "plain_text",
                    "text": "Schedule a greendot"
                },
                "submit": {
                    "type": "plain_text",
                    "text": "Create"
                },
                "blocks": [
                    {
                        "type": "input",
                        "block_id": "name_block",
                        "label": {
                            "type": "plain_text",
                            "text": "name the greendot",
                            "emoji": true
                        },
                        "optional": false,
                        "element": {
                            "type": "plain_text_input",
                            "action_id": "greendot_name"
                        }
                    },
                    {
                        "type": "input",
                        "block_id": "desc_block",
                        "label": {
                            "type": "plain_text",
                            "text": "What are we going to discuss?",
                            "emoji": true
                        },
                        "optional": false,
                        "element": {
                            "type": "plain_text_input",
                            "action_id": "desc"
                        }
                    },
                    {
                        "type": "section",
                        "block_id": "date_block",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Pick a date for the greendot."
                        },
                        "accessory": {
                            "type": "datepicker",
                            "initial_date": getFormattedDateString(),
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select a date",
                                "emoji": true
                            },
                            "action_id": "datepicker"
                        }
                    },
                    {
                        "type": "section",
                        "block_id": "time_block",
                        "text": {
                            "type": "mrkdwn",
                            "text": "At what time?"
                        },
                        "accessory": {
                            "type": "timepicker",
                            "initial_time": getFormmatedTimeString(),
                            "placeholder": {
                                "type": "plain_text",
                                "text": "Select time",
                                "emoji": true
                            },
                            "action_id": "timepicker"
                        }
                    }
                ],
                "private_metadata": "Shh it is a secret",
                "callback_id": "greendot_submitted",
                "external_id": "",
                "clear_on_close": false,
                "notify_on_close": false,
            });

    try {
        await app.client.views.open({
            view: view,
            trigger_id: body.trigger_id,
            token: process.env.SLACK_USER_TOKEN
        });


    } catch (err) {
        console.log(`there was an error: ${err}`)
    }
});

app.view("greendot_submitted", async (req) => {
    req.ack();
    console.log(req.body.payload);
    const greendotName = req.payload.state.values.name_block.greendot_name.value;
    const date = req.payload.state.values.date_block.datepicker.selected_date;
    const time = req.payload.state.values.time_block.timepicker.selected_time;
    const user = req.body.user.id;
    try {

        await app.client.chat.postMessage({
            token: process.env.SLACK_USER_TOKEN,
            channel: "C02A2K73W8L",
            blocks: [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `<!here> \n <@${user}> created a greendot: *${greendotName}*, scheduled for ${time} on ${date}`
                }
            }]
        });
    } catch (err) {
        console.log(err)
    }
});

(async () => {
    await app.start(port)
    console.log(`⚡️ Bolt app is running on ${port}!`)
})();