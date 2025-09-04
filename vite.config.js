import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'JSMasker',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.esm.js'
        if (format === 'cjs') return 'index.cjs'
        return 'jsmasker.umd.min.js'
      }
    },
    rollupOptions: {
      output: {
        exports: 'default'
      }
    },
    target: 'es2018',
    sourcemap: false,
    minify: 'esbuild',
    outDir: 'dist',
    emptyOutDir: true
  }
})
