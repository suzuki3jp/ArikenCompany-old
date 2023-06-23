export const LogMessages = {
    // general
    StartingApp: `Starting app...`,

    // events logs
    LoadedTwitchEvents: `Loaded Twitch events.`,
    LoadedTwitchMessageEvent: `Loaded Twitch message event.`,
    LoadedTwitchReadyEvent: `Loaded Twitch ready event.`,

    LoadedDiscordEvents: `Loaded discord client events.`,
    LoadedDiscordReadyEvent: `Loaded discord ready event.`,

    // Twitch
    StartedTwitch: `Started Twitch clients.`,
    TwitchReady: (channels: string[]) => `Connected Twitch channels. [${channels.join(', ')}]`,

    SentTwitchChat: (user: string, channel: string, content: string) => `Twitch chat sent by ${user} in ${channel}. ${content}`,

    TokenRefreshFailed: `Twitch token refresh failed.`,
    TokenRefreshed: `Twitch token has been refreshed.`,

    // discord
    StartedDiscord: 'Started discord client.',
    DiscordReady: (tag: string) => `Logged in to discord client as ${tag}.`,

    // commands
    RanManageCommand: (platform: string) => `Ran manage command in ${platform}.`,

    AddedCommand: (name: string, content: string) => `Added command. ${name} ${content}`,
    AddedCommandBy: (by: string) => `Added command by ${by}.`,
    EditedCommand: (name: string, content: string) => `Edited command. ${name} ${content}`,
    EditedCommandBy: (by: string) => `Edited command by ${by}.`,
    RemovedCommand: (name: string) => `Removed command. ${name}`,
    RemovedCommandBy: (by: string) => `Removed command by ${by}.`,

    EnabledCommands: `Enabled commands.`,
    EnabledCommandsBy: (by: string) => `Enabled commands by ${by}.`,
    DisabledCommands: `Disabled commands.`,
    DisabledCommandsBy: (by: string) => `Disabled commands by ${by}.`,

    SetCoolDown: (period: number) => `Set coolDown ${period} seconds.`,
    SetCoolDownBy: (by: string) => `Set coolDown by ${by}.`,

    UpdatedCommandUsedAt: (name: string) => `Updated command used_at. ${name}`,
    IncrementedCommandCount: (name: string) => `Incremented command count. ${name}`,
};
