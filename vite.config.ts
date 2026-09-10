import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isLibraryBuild = mode === 'production' || process.env.BUILD_LIB === 'true';

  return {
    plugins: [
      react(),tailwindcss(),
      dts({
        include: ['src'],
        exclude: ['src/main.tsx', 'src/App.tsx'],
        entryRoot: 'src',
        outDir: 'dist',
        rollupTypes: false,
        tsconfigPath: './tsconfig.app.json',
      }),
    ],
    build: isLibraryBuild
      ? {
          copyPublicDir: false,
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'ThreejsComponents',
            formats: ['es'],
            fileName: () => 'index.js',
          },
          rollupOptions: {
            external: [
              'react',
              'react-dom',
              'react/jsx-runtime',
              'three',
              'three/src/math/MathUtils.js',
              '@react-three/fiber',
              '@react-three/drei',
            ],
            output: {
              preserveModules: false,
              exports: 'named',
            },
          },
          sourcemap: true,
          emptyOutDir: true,
        }
      : undefined,
  };
});
