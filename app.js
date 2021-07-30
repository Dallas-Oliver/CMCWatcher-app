const { App } = require("@slack/bolt");
require('dotenv').config();

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRECT,
    socketMode: true,
    appToken:process.env.SLACK_APP_TOKEN
});

app.message("hello", async ({message, say}) => {
    await say(`hello, back! ${message.user}`)
});

(async () => {
    await app.start(process.env.PORT || 3000)
    console.log('⚡️ Bolt app is running!')
})();