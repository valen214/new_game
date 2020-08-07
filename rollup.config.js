import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import preprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

import { transformSync } from "esbuild";


const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
      server = require('child_process').spawn(
          'npm', ['run', 'start', '--', '--dev'], {
          // "python",  "-m http.server --directory dist 5000".split(" "), {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

      process.on("uncaughtException", toExit);
      process.on("beforeExit", toExit);
			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}


export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/build/bundle.js'
  },
  external: [ "babylonjs", "babylon" ],
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('dist/build/bundle.css');
			},
      preprocess: preprocess({
        typescript({ content, filename }){
          const { js: code } = transformSync(content, {
            loader: "ts",
          });
          return { code };
        }
      }),
    }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
      dedupe: ['svelte'],
      extensions: [ ".js", ".ts", ".svelte" ]
		}),
		commonjs({
      include: "node_modules/**",
    }),
    typescript({
      sourceMap: !production,
      // outDir: "./dist/ts",
    }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `dist` directory and refresh the
		// browser on changes when not in production
		!production && livereload({
        watch: 'dist',
    }),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
