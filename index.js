// require the discord.js module
const Discord = require('discord.js');
const { prefix, token, username, password } = require('./config.json');
const API = require('call-of-duty-api')({ platform: "battle" });


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

const help = "Help"
const pHelp = "pHelp";

client.on('message', async message => {
    console.log(message.content);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'cw') 
    {
        if (!args.length)
        {
            return message.channel.send(help);
        }

        if (args[0] === 'kd')
        {
            message.channel.send(await getKD(args));
        }
        else if (args[0] === 'wl' || args[0] === 'lw')
        {
            message.channel.send(await getWinLose(args));
        } 
        else if (args[0] === 'stat' || args[0] === 'stats') 
        {
            message.channel.send(await getStats(args));
        }
    }
    else if (command === 'player')
    {
        if (!args.length)
        {
            return message.channel.send(pHelp);
        }

        if (args[0] === 'set')
        {
            message.channel.send(await setUser(args, message.id, message.username));
        }
    }
});

setUser = async (args, discord_id, discord_name) => {
    if (args.length == 2) 
    {
        try {
            
            let battletag = args[1];

            let url = "https://tnoah.ca/update.php?discord_id=" + discord_id + "&discord_name=" + discord_name + "&battletag=" + battletag;
            let response = await fetch(url).then(response => response.text());

            return response;

        } catch(Error) {
            return 'Failed Connecting to Server';
        }
    }
    else 
    {
        return "Command wrong, try: !player player#1234";
    }
}

getKD = async (args) => {
    if (args.length == 2) 
    {
        try {
            let data = await API.CWmp(args[1]);
            console.log(data.lifetime.all.properties);
            return `K/D of player ${data.username} is ${data.lifetime.all.properties.kdratio}`;
        } catch(Error) {
            return 'Cannot find player';
        }
    }
    else 
    {
        return "Command wrong, try: !cw kd player#1234";
    }
}

getWinLose = async (args) => {
    if (args.length == 2) 
    {
        try {
            let data = await API.CWmp(args[1]);
            return `Win/Loss of player ${data.username} is ${data.lifetime.all.properties.wins} wins,  ${data.lifetime.all.properties.losses} loses`;
        } catch(Error) {
            return 'Cannot find player';
        }
    }
    else 
    {
        return "Command wrong, try: !cw wl player#1234";
    }
}

getStats = async (args) => {
    if (args.length == 2) 
    {
        try {
            let data = await API.CWmp(args[1]);
            console.log(data.lifetime);
            
            //kd, wl, 

            let exampleEmbed = {
                color: 0x0099ff,
                title: `${data.username} Stats`,
                url: 'https://discord.js.org',
                description: 'Stats for player:',
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
    } 
    if (args.length == 1)
    {
        // Going to be for saved person
        return "Command wrong, try: !cw stats player#1234";
    }
    else 
    {
        return "Command wrong, try: !cw stats player#1234";
    }

}