import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    filename: 'jsmasker.min.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'JSMasker',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: 'production',
}
