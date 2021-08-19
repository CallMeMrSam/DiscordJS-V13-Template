const fs = require('fs');
const path = require('path');

const { Client, ClientOptions } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const Rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

module.exports = class extends Client
{
  /**
   * 
   * @param {ClientOptions} options 
   */
  constructor(options) {
    super(options);

    this.commands = [];
  }

  loadSlashCommands(dir, guilds = []) {
    const r = (...s) => path.resolve(s.join(path.sep));
    const load = (file) => {
      let cmd = new (require(r(file)))();
      if(cmd.options && cmd.execute) this.commands.push(cmd);
    }

    fs.readdirSync(r(dir)).forEach((sdir) => {
      if(sdir.endsWith('.js')) return load(r(dir, sdir));
      fs.readdirSync(r(dir, sdir)).forEach((file) => {
        if(!file.endsWith('.js')) return;
        load(r(dir, sdir, file));
      });
    });

    guilds.forEach((id) => {
      Rest.put(
        Routes.applicationGuildCommands(process.env.APP_ID, id),
        { body: this.commands.map(({ options }) => options.toJSON()) }
      );
    });
  }

  loadEvents(dir) {
    const r = (...s) => path.resolve(s.join(path.sep));
    const load = (file) => {
      let evt = new (require(r(file)))();
      if(evt.name && evt.execute) {
        this.on(evt.name, evt.execute.bind(null, this));
      }
    }

    fs.readdirSync(r(dir)).forEach((sdir) => {
      if(sdir.endsWith('.js')) return load(r(dir, sdir));
      fs.readdirSync(r(dir, sdir)).forEach((file) => {
        if(!file.endsWith('.js')) return;
        load(r(dir, sdir, file));
      });
    });
  }
}