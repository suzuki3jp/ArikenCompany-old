// nodeモジュールをインポート
import type { TwitchClient } from '@suzuki3jp/twitch.js';
import type { Logger } from '@suzuki3jp/utils';

export const twitchReady = (client: TwitchClient, logger: Logger) => {
    logger.system('twitch client is ready.');
};
