const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions
config.resolver.sourceExts.push('cjs');

// Configure module resolution
config.resolver.alias = {
  '@': `${__dirname}/src`,
  '@/components': `${__dirname}/src/components`,
  '@/screens': `${__dirname}/src/screens`,
  '@/hooks': `${__dirname}/src/hooks`,
  '@/services': `${__dirname}/src/services`,
  '@/store': `${__dirname}/src/store`,
  '@/types': `${__dirname}/src/types`,
  '@/utils': `${__dirname}/src/utils`,
  '@/constants': `${__dirname}/src/constants`,
};

module.exports = config;
