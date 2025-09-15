 module.exports = function(api) {
      api.cache(true);
      return {
        presets: ["babel-preset-expo"], // or "react-native" for bare projects
        plugins: [
          [
            "module:react-native-dotenv",
            {
              moduleName: "@env", // This allows importing like `import { MY_VAR } from "@env"`
              path: ".env",
            },
          ],
        ],
      };
    };