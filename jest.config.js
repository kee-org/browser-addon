// eslint-disable-next-line no-undef
module.exports = {
    preset: "ts-jest",
    moduleDirectories: ["node_modules", "<rootDir>"],
    setupFiles: ["jest-webextension-mock"],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"]
};
