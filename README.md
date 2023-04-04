<img src="./assets/ARIKENCOMPANY_BANNER.png">
<h4 align="center">A Twitch bot providing customizable commands.</h4>

> **Warning** This program is spaghetti code and has no docs now, so it would be impossible for you to run it correctly.

***
## Features
- Variables that can be used for command contents.
    - `channel` -> Returns the channel name.
    - `fetch` -> Fetching from a remote url.
    - All other variables are [here](./src/class/ValueParser.ts).
- Manage commands from GUI on discord.
- Chatters - Record the number of chats on Twitch.
- API - Manage bot from the API.
    - All endpoints are [here](./src/api/index.ts)

## Usage
1. Set environment variables to `.env`. sample: [`.sample.env`](./.sample.env)
2. Custom [`settings.json`](./data/settings.json). The type is [`SettingsJson`](./src/class/JsonTypes.ts)
3. `npm run build`
4. `npm run start`