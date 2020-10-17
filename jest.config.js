module.exports = {
    preset: "ts-jest",
    moduleDirectories: ["node_modules", "<rootDir>"],
    setupFiles: ["jest-webextension-mock"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.js"]
};
