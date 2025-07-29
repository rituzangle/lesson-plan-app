const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = false;

// Enable Hermes for better performance
config.transformer.hermesCommand = 'hermes';

module.exports = config;
