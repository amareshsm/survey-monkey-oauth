import babel from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
const dist = 'dist'
const bundle = 'bundle'
const production = !process.env.ROLLUP_WATCH
export default {
  input: 'src/index.js',
  output: [
    { file: `${dist}/${bundle}.cjs.js`, format: 'cjs' },
    {
      file: `${dist}/${bundle}.umd.js`,
      format: 'umd',
      name: 'SurveyMonkeyOauth',
    },
    { file: `${dist}/${bundle}.esm.js`, format: 'esm' },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    production && terser(),
  ],
}
