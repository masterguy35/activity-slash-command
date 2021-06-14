const Discord = require("discord.js");
const fetch = require("node-fetch");
const settings = require("./src/settings.json");
const activitySlash = require("./src/activity.json");

const client = new Discord.Client();

//creating slash command
const endpoint = `https://discord.com/api/v8/applications/${settings.clientID}/commands`;

fetch(endpoint, {
    method: 'post',
    body: JSON.stringify(activitySlash),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bot ${settings.token}`
    },
})
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(e => console.log(e));

//replying
client.ws.on("INTERACTION_CREATE", async interaction => {
    //console.log(interaction.data.options)
    const cmd = interaction.data.name.toLowerCase()
    const channelID = interaction.data.options[0].value
    const channel = client.channels.cache.get(channelID)
    const type = interaction.data.options[1].value
    const activityIDs = {
        "poker_night": {
            id: "755827207812677713",
            name: "Poker Night"
        },
        "betrayal_io": {
            id: "773336526917861400",
            name: "Betrayal.io"
        },
        "youtube_together": {
            id: "755600276941176913",
            name: "YouTube Together"
        },
        "fishington_io": {
            id: "814288819477020702",
            name: "Fishington.io"
        }
    }

    const replySuccess = (interaction, response) => {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: response
                }
            }
        })
    }

    const replyError = (interaction, response) => {
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    flags: 64,
                    content: response
                }
            }
        })
    }

    let activity;
    switch (type) {
        case "youtube_together":
            activity = activityIDs.youtube_together
            break;
        case "poker_night":
            activity = activityIDs.poker_night
            break;
        case "betrayal_io":
            activity = activityIDs.betrayal_io
            break;
        case "fishington_io":
            activity = activityIDs.fishington_io
            break;
        default: null
            break;
    }

    if (cmd === "activity") {
        if (channel.type !== "voice") {
            replyError(interaction, "Please specify a Voice channel.")
        }
        fetch(`https://discord.com/api/v8/channels/${channelID}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bot ${settings.token}`
            }
        })
            .then(res => res.json())
            .then(invite => {
                replySuccess(interaction, `Click here to start **${activity.name}** in **${channel.name}**: <https://discord.gg/${invite.code}>`)
            })
            .catch(e => {
                //console.log(e)
                replyError(interaction, `Could not start ${activity.name}`)
            })
    }
})

client.login(settings.token)