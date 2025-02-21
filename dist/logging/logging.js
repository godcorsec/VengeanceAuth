"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = {
    purple: "\x1b[38;2;123;66;245m",
    white: "\x1b[38;2;255;255;255m",
    green: "\x1b[38;2;66;245;156m",
    red: "\x1b[38;2;245;66;72m",
    grey: "\x1b[38;2;92;92;92m",
    yellow: "\x1b[38;2;245;227;66m",
};
class Logging {
    Error(message) {
        const currentTime = new Date().toISOString();
        console.log(`${colors.white}[@${colors.purple}vengeanceAuth${colors.white}/${colors.red}Error ${colors.grey}| ${currentTime} ${colors.white}] ${message}`);
    }
    Warn(message) {
        const currentTime = new Date().toISOString();
        console.log(`${colors.white}[@${colors.purple}vengeanceAuth${colors.white}/${colors.yellow}Warn  ${colors.grey}| ${currentTime} ${colors.white}] ${message}`);
    }
    Ok(message) {
        const currentTime = new Date().toISOString();
        console.log(`${colors.white}[@${colors.purple}vengeanceAuth${colors.white}/${colors.green}Ok    ${colors.grey}| ${currentTime} ${colors.white}] ${message}`);
    }
}
exports.default = Logging;
