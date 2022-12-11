const { Client, Collection } = require('discord.js');
const { TOKEN, PREFIX } = require('./config.json');
const fs = require('fs')
const client = new Client({
    intents: 32767
});

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands");
client.events = new Collection();

module.exports = client;

["Command", "Event"].forEach(handler => {
  require(`./Structures/${handler}`)(client);
});

client.once('ready', () => {
  console.log(`[READY]: ${client.user.tag} is ready`)
})

process.on('unhandledRejection', err => {
  console.log(`[ERROR]: Unhandled promise rejection: ${err.message}.`);
  console.log(err);
});

let voiceManager = new Collection();

client.on("voiceStateUpdate", async (oS, nS) => {
  const { member, guild } = oS;
  const newChannel = nS.channel;
  const oldChannel = oS.channel;
  const JTC = "993170696161214504";

  // if user join voice channel
  if (oldChannel !== newChannel && newChannel && newChannel.id === JTC) {
    const voiceChannel = await guild.channels.create(
      `📞Support`,
      {
        type: "GUILD_VOICE",
        parent: newChannel.parent,
        permissionOverwrites: [
          {
            id: member.id,
            deny: ["CONNECT"],
          },
          {
            id: guild.id,
            deny: ["CONNECT", "VIEW_CHANNEL"],
          },
        ],
      }
    );

    voiceManager.set(member.id, voiceChannel.id);
    // for spam protection
    await newChannel.permissionOverwrites.edit(member, { CONNECT: false });
    setTimeout(() => {
      newChannel.permissionOverwrites.delete(member);
    }, 30 * 1000);

    return setTimeout(() => {
      member.voice.setChannel(voiceChannel);
    }, 600);
  }

  // if user leave or switch
  const JTCCHANNEL = voiceManager.get(member.id);
  const members = oldChannel?.members
    .filter((m) => !m.user.bot)
    .map((m) => m.id);
  if (
    JTCCHANNEL &&
    oldChannel.id === JTCCHANNEL &&
    (!newChannel || newChannel.id !== JTCCHANNEL)
  ) {
    if (members.length > 0) {
      // code
      let randomID = members[Math.floor(Math.random() * members.length)];
      let randomMember = guild.members.cache.get(randomID);
      randomMember.voice.setChannel(oldChannel).then((v) => {
        randomMember.send(
          `> ** You are now Owner of __JTC__ ${oldChannel} Voice Channel **`
        );
        oldChannel.setName(randomMember.user.username).catch((e) => null);
        oldChannel.permissionOverwrites.edit(randomMember, {
          CONNECT: false,
          MANAGE_CHANNELS: false,
        });
      });
      voiceManager.set(member.id, null);
      voiceManager.set(randomMember.id, oldChannel.id);
    } else {
      voiceManager.set(member.id, null);
      oldChannel.delete().catch((e) => null);
    }
  }
});

client.on("message", (message) => {
  if (message.content.includes("https://")) {
    console.log("deleted " + message.content + " from " + message.author)
    message.channel.send("No links here")
    message.delete(1);
}
}
)

client.on('guildMemberAdd', member => {
  const role = member.guild.roles.cache.filter(r => r.name === "🕺Civilian");
  if (!role) return;

  member.roles.add(role);
});


const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				// ...
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});


client.on('message', async (message) => {
    if (message.author.bot)return;
    if (message.channel.id === '1051424229167476767') {
        message.delete()
        const channel = message.guild.channels.cache.get('1038755519806058547')
        const cont = message.content;
        const embed = new Discord.MessageEmbed()
        .setAuthor('Suggestion System', 'https://media.discordapp.net/attachments/997919316622184519/1041007414692028456/logo.gif')
        .setDescription(`\`\`\`${cont}\`\`\``)
        .setColor('BLACK')
        .setTimestamp()
        channel.send(embed).then(message=> {
            message.react('✅')
            message.react('❌')
        })
    }
})



client.login(TOKEN);
