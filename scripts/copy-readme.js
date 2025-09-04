#!/usr/bin/env node
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const projectRoot = path.resolve(__dirname, '..')
  const src = path.join(projectRoot, 'README.md')
  const destDir = path.join(projectRoot, 'dist')
  const dest = path.join(destDir, 'README.md')

  try {
    await fs.mkdir(destDir, { recursive: true })
    await fs.copyFile(src, dest)
    // eslint-disable-next-line no-console
    console.log(`Copied README.md to ${path.relative(projectRoot, dest)}`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to copy README.md:', err)
    process.exit(1)
  }
}

main()

