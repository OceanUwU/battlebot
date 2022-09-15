# battlebot
a discord bot based on [tank turn tactics](https://gdcvault.com/play/1017744)
[game rules](https://battlebot.ocean.lol/)
[invite the bot to your server](https://discord.com/api/oauth2/authorize?client_id=869182949826904076&permissions=8192&scope=bot%20applications.commands)
we also have a server where we regularly play games of this. [play with us!](https://discord.gg/KXgz9KBnga)

## setup
1. `npm ci`
2. `npx sequelize-cli db:migrate`
3. create `cfg.json` and paste the following JSON into it, then edit it to your needs:
    ```json
    {
        "token": "akjlsdfklasjklfdjalsdfkjlsakdjfklsdjfakldsjkl",
        "imgbbkey": "jasdhjksahdkjfhsakf",
        "dev": false,
        "devServer": "1234567890",
        "mainChannel": "",
        "quikChannel": "",
        "overriders": ["106068236000329728"]
    }
    ```
    options:
        `token`: your [discord bot token](https://discord.com/developers/applications)
        `imgbbkey`: your [imgbb api key](https://api.imgbb.com/)
        `dev`: `true` if youre developing the bot
        `devServer`: if `dev` is true, the ID of the server you're developing the bot in
        `overriders`: an array of discord user IDs of people who can use moderator commands/actions in any server
4. `npm start`