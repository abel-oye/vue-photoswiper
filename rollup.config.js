// rollup.config.js
let babel = require("rollup-plugin-babel");
let vue = require("rollup-plugin-vue");


export default {
  entry: "src/index.js",
  format: "umd",
  moduleName: "fullpage",
  plugins: [
    vue({
      
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ],
  dest: 'dist/vue-photoswiper.js' // equivalent to --output
};