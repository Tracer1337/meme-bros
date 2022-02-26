module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: [
        'react-native-paper/babel',
        // Reanimated plugin has to be listed last.
        'react-native-reanimated/plugin',
      ],
    },
  },
};
