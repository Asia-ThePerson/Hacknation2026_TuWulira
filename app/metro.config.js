// The app reads rule and question files from the repo root (rules/, config/),
// which sit outside the Expo project folder, so Metro must watch them.
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.watchFolders = [path.resolve(__dirname, '../rules'), path.resolve(__dirname, '../config')];
module.exports = config;
