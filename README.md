# devious-disposition (battlebot)
a discord bot based on [tank turn tactics](https://gdcvault.com/play/1017744)

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