# devious-disposition
a discord bot based on [tank turn tactics](https://gdcvault.com/play/1017744)

## setup
1. `npm ci`
2. `npx sequelize-cli db:migrate`
3. create `cfg.json` and paste the following JSON into it, then edit it to your needs:
    ```json
    {
        "token": "akjlsdfklasjklfdjalsdfkjlsakdjfklsdjfakldsjkl",
        "dev": false,
        "devServer": "1234567890"
    }
    ```
    options:
        `token`: your [discord bot token](https://discord.com/developers/applications)
        `dev`: `true` if youre developing the bot
        `devServer`: if `dev` is true, the ID of the server you're developing the bot in
4. `npm start`