const { App } = require("@slack/bolt");
const e = require("express");
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
    console.log(req.body);
    const greendotName = req.payload.state.values.name_block.greendot_name.value;
    const date = req.payload.state.values.date_block.datepicker.selected_date;
    const time = req.payload.state.values.time_block.timepicker.selected_time;
    const user = req.body.user.id;

    try {

        const users = await app.client.users.list({
            token: process.env.SLACK_USER_TOKEN
        });
        console.log(users.members);

        const usersList = users.members.map(user => user.name);
        console.log(usersList);

        await app.client.chat.postMessage({
            token: process.env.SLACK_USER_TOKEN,
            channel: "C029KCPJ820",
            blocks: [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `<!here> \n <${user}> created a greendot: *${greendotName}*, scheduled for ${time} on ${date}`
                }
            }]
        });
    } catch (err) {
        console.log(err)
    }
});

app.command("/potd", async ({say, ...req}) => {
    const response = await serviceClient.getNasaPOTD();
    console.log(response)

});

(async () => {
    await app.start(port)
    console.log(`⚡️ Bolt app is running on ${port}!`)
})();