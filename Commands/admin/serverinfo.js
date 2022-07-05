const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'serverinfo',
    description: 'Returns information about the server.',
    async execute(interaction) {
        const guild = interaction.guild

    const owner = interaction.guild.fetchOwner()    
    let guildDescription = guild.description
    if (!guildDescription) {
      guildDescription = 'None'
    }

    const embed = new MessageEmbed()
    .setTitle('serverinfo')
    .setDescription('Returns information about the server.')
    .addFields({
                name: 'Name',
                value: guild.name,
                inline: true
              },
              {
                name: 'ID',
                value: guild.id,
                inline: true
              },
              {
                name: 'Description',
                value: guildDescription,
                inline: true
              },
              {
                name: 'Created at',
                value: guild.createdAt.toDateString(),
                inline: true
              },
              {
                name: 'Member Count',
                value: guild.memberCount.toString(),
                inline: true
              },
              {
                name: 'Member Cap',
                value: guild.maximumMembers.toString(),
                inline: true
              },
              {
                name: 'Boosts',
                value: guild.premiumSubscriptionCount.toString(),
                inline: true
              },
              {
                name: 'Boost Level',
                value: guild.premiumTier,
                inline: true
              })

    interaction.reply({ embeds: [embed] })
    },
};
