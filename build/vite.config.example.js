import { defineConfig } from 'vite';
import dependencyMapPlugin from './dependency-map.js';

export default defineConfig({
  plugins: [
    // 基础用法
    dependencyMapPlugin(),

    // 高级配置
    dependencyMapPlugin({
      outputFile: 'my-dependency-map.json',
      includeNodeModules: false, // 不包含 node_modules 中的依赖
      filter: (fileName) => {
        // 只分析特定文件
        return fileName.includes('src/') && !fileName.includes('.css');
      },
      maxDepth: 5, // 最大依赖深度
      verbose: true, // 在控制台打印详细分析
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        // 确保生成 source map 以便更好地分析
        sourcemap: true,
      },
    },
  },
});
