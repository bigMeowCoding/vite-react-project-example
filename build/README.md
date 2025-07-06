# Vite 依赖映射插件

这个插件可以帮助您分析和可视化项目的依赖关系，生成详细的依赖映射报告。

## 功能特性

- 📊 **依赖分析**: 分析模块间的依赖关系
- 📏 **大小统计**: 统计每个模块的大小
- 🔄 **循环依赖检测**: 自动检测项目中的循环依赖
- 🌳 **依赖树构建**: 构建完整的依赖树结构
- 📈 **深度分析**: 计算每个模块的依赖深度
- 📝 **详细报告**: 生成 JSON 格式的详细分析报告

## 安装和使用

### 1. 基础用法

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import dependencyMapPlugin from './build/dependency-map.js';

export default defineConfig({
  plugins: [dependencyMapPlugin()],
});
```

### 2. 高级配置

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import dependencyMapPlugin from './build/dependency-map.js';

export default defineConfig({
  plugins: [
    dependencyMapPlugin({
      outputFile: 'dependency-analysis.json',
      includeNodeModules: false,
      filter: (fileName) => fileName.includes('src/'),
      maxDepth: 5,
      verbose: true,
    }),
  ],
});
```

## 配置选项

| 选项 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `outputFile` | string | 'dependency-map.json' | 输出文件名 |
| `includeNodeModules` | boolean | true | 是否包含 node_modules 中的依赖 |
| `filter` | function | () => true | 文件过滤函数 |
| `maxDepth` | number | 3 | 最大依赖深度 |
| `verbose` | boolean | false | 是否在控制台打印详细分析 |

## 输出格式

插件会生成一个 JSON 文件，包含以下信息：

```json
{
  "summary": {
    "totalModules": 150,
    "totalSize": 2048576,
    "circularDependencies": [],
    "entryPoints": 3
  },
  "modules": {
    "src/main.js": {
      "id": "src/main.js",
      "size": 1024,
      "importedIds": ["src/utils.js"],
      "dynamicImports": [],
      "exports": [],
      "isEntry": true
    }
  },
  "dependencyTree": {
    "src/main.js": {
      "children": ["src/utils.js"],
      "parents": [],
      "depth": 2
    }
  },
  "largestModules": [
    {
      "id": "src/components/App.vue",
      "size": 15360,
      "sizeKB": "15.00"
    }
  ],
  "modulesByDepth": {
    "0": ["entry1.js"],
    "1": ["module1.js", "module2.js"],
    "2": ["module3.js"]
  }
}
```

## 控制台输出

当 `verbose: true` 时，插件会在控制台输出详细的分析报告：

```
📊 依赖分析报告:
==================================================
总模块数: 150
总大小: 2000.00 KB
入口点: 3

📦 最大的模块:
  src/components/App.vue: 15.00 KB
  src/utils/index.js: 12.50 KB
  src/components/Header.vue: 8.75 KB

🌳 按依赖深度分组:
  深度 0: 3 个模块
  深度 1: 25 个模块
  深度 2: 45 个模块
  深度 3: 77 个模块
```

## 使用场景

1. **性能优化**: 识别最大的模块，优化打包大小
2. **架构分析**: 了解项目的依赖结构
3. **循环依赖检测**: 发现并解决循环依赖问题
4. **代码审查**: 分析模块间的耦合度
5. **构建优化**: 优化构建配置和代码分割策略

## 注意事项

- 插件在构建过程中运行，会增加一些构建时间
- 大型项目可能需要调整 `maxDepth` 参数
- 建议在开发环境中使用 `verbose: true` 来查看详细分析
- 生产环境中可以禁用 `includeNodeModules` 来减少输出大小
