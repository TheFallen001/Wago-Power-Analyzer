const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...config.resolver.sourceExts, 'web.js', 'js', 'jsx', 'ts', 'tsx', 'css'],
      blockList: exclusionList([
        /react-native[\/\\]Libraries[\/\\]Utilities[\/\\]codegenNativeCommands/,
        /react-native-maps[\/\\].*[\/\\]MapMarkerNativeComponent/,
      ]),
    },
    transformer: {
      ...config.transformer,
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();