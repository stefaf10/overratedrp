const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'kick',
    usage: 'kick <user mention/ID> [reason]',
    description: 'Kick a member from your server',
    clientPerms: ['KICK_MEMBERS', 'SEND_MESSAGES', 'EMBED_LINKS'],
    userPerms: ['KICK_MEMBERS'],
    run: async(client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member)
        return message.channel.send(`Please mention a user or provide a valid user ID`)
        if(member === message.member)
        return message.channel.send(`You cannot kick yourself`)
        if(member.roles.highest.position >= message.member.roles.highest.position)
        return message.channel.send(`You cannot kick someone with an equal or higher role`)
        if(!member.kickable)
        return message.channel.send(`Provided member is not kickable`);
        let reason = args.slice(1).join(' ');
        if(!reason) reason = '`None`';
        if(reason.length > 1024) reason = reason.slice(0, 1021) + '...';
        await member.kick({ reason: reason });
        const embed = new MessageEmbed()
        .setTitle('Kick Member')
        .setDescription(`${member} was successfully kicked.`)
        .addField('Reason', `${reason}`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor('GREEN');
        message.channel.send({ embeds: [embed] })
    }
}
