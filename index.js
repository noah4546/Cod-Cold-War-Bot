// require the discord.js module
const Discord = require('discord.js');
const { prefix, token, username, password } = require('./config.json');
const API = require('call-of-duty-api')({ platform: "battle" });
const fetch = require('node-fetch');


// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// login to Discord with your app's token
client.login(token);

login = async () => {
    try {
        await API.login(username, password);
    } catch(Error) {
        console.log("ERROR: " + Error);
    }
}

login();

const cwHelp = {
    color: 0x0099ff,
    title: `Commands:`,
    url: 'https://tnoah.ca/',
    description: 'NOTE: It may take up to 1hr to update due to cod api',
    fields: [
        {
            name: 'Player Stats',
            value: '!cwstat <battletag#1234>',
            inline: false,
        },
        {
            name: 'Player K/D',
            value: '!cwkd <battletag#1234>',
            inline: false,
        },
        {
            name: 'Player W/L',
            value: '!cwwl <battletag#1234>',
            inline: false,
        },
        {
            name: 'Set battletag',
            value: '!pset <battletag#1234>\nOnce battle tag is set you can ommit\nbattletag from any of the previous commands',
            inline: false,
        },
    ]
};

client.on('message', async message => {
    console.log(message.content);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (args.length) {

        if (command === 'cw') {

            // Multi arg calls
            if (args[0] === 'kd') {
                message.channel.send(await getKD(args[1]));  // Message stats for specified player
            } else if (args[0] === 'wl' || args[0] === 'lw') {
                message.channel.send(await getWinLose(args[1])); // Message W/L for specified player
            } else if (args[0] === 'stat' || args[0] === 'stats') {
                message.channel.send(await getStats(args[1])); // Message K/D for specified player
            } else if (args[0] === 'help') {
                message.channel.send({ embed: cwHelp }); // Message help
            } else {
                message.channel.send({ embed: cwHelp }); // Message help
            }

        } else if (command === 'cwstats' || command === 'cwstat') {
            message.channel.send(await getStats(args[0])); // Message stats for specified player
        } else if (command === 'cwwl' || command === 'cwlw') {
            message.channel.send(await getWinLose(args[0])); // Message W/L for specified player
        } else if (command === 'cwkd' || command === 'cwdk') {
            message.channel.send(await getKD(args[0])); // Message K/D for specified player
        } else if (command === 'pset') {
            message.channel.send(await setUser(args[0], message.author.id, message.author.username));
        } else if (command === 'cwhelp') {
            message.channel.send({ embed: cwHelp }); // Message help
        } else {
            return message.channel.send({ embed: cwHelp }); // Message help
        }

    } else {
        try {
            let discord_id = message.author.id;
            let url = "https://tnoah.ca/getBattletag.php?discord_id=" + discord_id;
            let response = await fetch(url, {headers: {'Content-Type':'application/text'}})
                                    .then(response => response.json());
            let battletag = response.battletag + "#" + response.battletag_num;

            if (command === 'cwstat' || command === 'cwstats') {
                message.channel.send(await getStats(battletag));
            } else if (command === 'cwwl' || command === 'cwlw') {
                message.channel.send(await getWinLose(battletag)); // Message W/L for specified player
            } else if (command === 'cwkd' || command === 'cwdk') {
                message.channel.send(await getKD(battletag)); // Message K/D for specified player
            } else if (command === 'cw') {
                return message.channel.send({ embed: cwHelp }); // Message help
            }
        } catch(Error) {
            return message.channel.send('Failed Connecting to Server');
        }
    }
});

setUser = async (battletag, discord_id, discord_name) => {
    if (battletag != "" && battletag !== null) 
    {
        console.log(battletag);
        try {
            
            let fullTag = battletag.split('#');
            battletag = fullTag[0];
            let battletag_num = fullTag[1];

            let url = "https://tnoah.ca/update.php?discord_id=" + discord_id + "&discord_name=" + discord_name + "&battletag=" + battletag + "&battletag_num=" + battletag_num;
            let response = await fetch(url, {headers: {'Content-Type':'application/text'}})
                                    .then(response => response.text());

            if (response == '1') {
                return "Succesfuly connected battle tag to user";
            } else {
                return "Failed connecting battle tag to user";
            }

        } catch(Error) {
            return 'Failed Connecting to Server';
        }
    }
    else 
    {
        return "Command wrong, try: !player player#1234";
    }
}

getKD = async (player) => {
    if (player != "" && player !== null) 
    {
        try {
            let data = await API.CWmp(player);
            console.log(data.lifetime.all.properties);
            return `K/D of player ${data.username} is ${data.lifetime.all.properties.kdratio}`;
        } catch(Error) {
            return 'Cannot find player';
        }
    }
    else 
    {
        return "Command wrong, try: !cwkd player#1234";
    }
}

getWinLose = async (player) => {
    if (player != "" && player !== null) 
    {
        try {
            let data = await API.CWmp(player);
            return `Win/Loss of player ${data.username} is ${data.lifetime.all.properties.wins} wins,  ${data.lifetime.all.properties.losses} loses`;
        } catch(Error) {
            return 'Cannot find player';
        }
    }
    else 
    {
        return "Command wrong, try: !cwwl player#1234";
    }
}

getStats = async (player) => {
    if (player != "" && player !== null) 
    {
        try {
            let data = await API.CWmp(player);
            console.log(data.lifetime);
            
            //kd, wl, 

            let exampleEmbed = {
                color: 0x0099ff,
                title: `${data.username} Stats`,
                fields: [
                    {
                        name: 'Kills',
                        value: `${data.lifetime.all.properties.kills}`,
                        inline: true,
                    },
                    {
                        name: 'Deaths',
                        value: `${data.lifetime.all.properties.deaths}`,
                        inline: true,
                    },
                    {
                        name: 'K/D Ratio',
                        value: `${data.lifetime.all.properties.kdratio}`,
                        inline: true,
                    },
                    {
                        name: 'Wins',
                        value: `${data.lifetime.all.properties.wins}`,
                        inline: true,
                    },
                    {
                        name: 'Loses',
                        value: `${data.lifetime.all.properties.losses}`,
                        inline: true,
                    },
                    {
                        name: 'W/L Ratio',
                        value: `${data.lifetime.all.properties.wlratio}`,
                        inline: true,
                    },
                ]
            };
            
            return { embed: exampleEmbed };
        } catch(Error) {
            return 'Cannot find player';
        }
    } else 
    {
        return "Command wrong, try: !cwstats player#1234";
    }

}