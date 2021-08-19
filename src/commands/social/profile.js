const Command = require('../../structure/Command');
const Client = require('../../structure/Client');

const { CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = class extends Command
{
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("hello")
        .setDescription("Dire bonjour à un membre.")
        .addUserOption((option) => option
          .setName("user")
          .setDescription("Membre")
          .setRequired(false)
          )
    )
  }

  /**
   * 
   * @param {Client} client 
   * @param {CommandInteraction} interaction 
   */
  execute(client, interaction) {
    let member = interaction.options.getMember("user") || interaction.member;
    
    interaction.reply({ content: `Salut <@${member.id}> :D !`})
  }
}