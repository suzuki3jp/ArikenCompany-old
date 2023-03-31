"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManager = void 0;
// nodeモジュールをインポート
const fs_1 = require("fs");
const path_1 = require("path");
class DataManager {
    _paths;
    constructor() {
        this._paths = {
            chatters: (0, path_1.resolve)(__dirname, '../../data/Chatters.json'),
            cert: '/etc/letsencrypt/live/suzuki-dev.com-0001/fullchain.pem',
            commands: (0, path_1.resolve)(__dirname, '../../data/Commands.json'),
            env: (0, path_1.resolve)(__dirname, '../../.env'),
            key: '/etc/letsencrypt/live/suzuki-dev.com-0001/privkey.pem',
            managers: (0, path_1.resolve)(__dirname, '../../data/Managers.json'),
            publicCommands: (0, path_1.resolve)(__dirname, '../../data/PublicCommands.json'),
            settings: (0, path_1.resolve)(__dirname, '../../data/settings.json'),
            streamStatus: (0, path_1.resolve)(__dirname, '../../data/StreamStatus.json'),
        };
    }
    getChatters() {
        return this._readFile(this._paths.chatters);
    }
    setChatters(data) {
        this._writeFile(this._paths.chatters, data);
    }
    getCert() {
        return (0, fs_1.readFileSync)(this._paths.cert, 'utf-8');
    }
    getCommands() {
        return this._readFile(this._paths.commands);
    }
    setCommands(data) {
        this._writeFile(this._paths.commands, data);
    }
    setEnv(data) {
        this._writeFile(this._paths.env, data);
    }
    getKey() {
        return (0, fs_1.readFileSync)(this._paths.key, 'utf-8');
    }
    getManagers() {
        return this._readFile(this._paths.managers);
    }
    setManagers(data) {
        this._writeFile(this._paths.managers, data);
    }
    getPublicCommands() {
        return this._readFile(this._paths.publicCommands);
    }
    setPublicCommands(data) {
        this._writeFile(this._paths.publicCommands, data);
    }
    getSettings() {
        return this._readFile(this._paths.settings);
    }
    setSettings(data) {
        this._writeFile(this._paths.settings, data);
    }
    getStreamStatus() {
        return this._readFile(this._paths.streamStatus);
    }
    setStreamStatus(data) {
        this._writeFile(this._paths.streamStatus, data);
    }
    _readFile(path) {
        return JSON.parse((0, fs_1.readFileSync)(path, 'utf-8'));
    }
    _writeFile(path, data) {
        if (typeof data !== 'string') {
            (0, fs_1.writeFileSync)(path, this._jsonToString(data), 'utf-8');
        }
        else {
            (0, fs_1.writeFileSync)(path, data, 'utf-8');
        }
    }
    _jsonToString(data) {
        return JSON.stringify(data, null, '\t');
    }
}
exports.DataManager = DataManager;
