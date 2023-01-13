"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordInteraction = exports.discordMessage = exports.discordReady = void 0;
var ready_1 = require("./ready");
Object.defineProperty(exports, "discordReady", { enumerable: true, get: function () { return ready_1.discordReady; } });
var message_1 = require("./message");
Object.defineProperty(exports, "discordMessage", { enumerable: true, get: function () { return message_1.discordMessage; } });
var interaction_1 = require("./interaction");
Object.defineProperty(exports, "discordInteraction", { enumerable: true, get: function () { return interaction_1.discordInteraction; } });
