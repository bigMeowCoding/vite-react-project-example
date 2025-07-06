// plugins/dependency-map.js
export default function dependencyMapPlugin(options = {}) {
  const {
    outputFile = 'dependency-map.json',
    includeNodeModules = true,
    onlyProjectModules = false,
    filter = () => true,
    maxDepth = 3,
    verbose = false,
  } = options;

  const dependencies = {};
  const moduleSizes = {};
  const dependencyTree = {};
  const circularDeps = new Set();

  // 判断是否为本地项目模块
  const isProject = (id) =>
    id &&
    (id.includes('/src/') ||
      id.startsWith(process.cwd()) ||
      (id.startsWith('.') && !id.includes('node_modules')));

  return {
    name: 'dependency-map',
    enforce: 'post',

    // 在模块解析时收集信息
    moduleParsed(moduleInfo) {
      if (onlyProjectModules && moduleInfo.id.includes('node_modules')) return;
      if (verbose) {
        console.log('📦 解析模块:', moduleInfo.id);
      }

      // 记录模块信息
      if (!dependencies[moduleInfo.id]) {
        dependencies[moduleInfo.id] = {
          id: moduleInfo.id,
          size: moduleInfo.code?.length || 0,
          importedIds: moduleInfo.importedIds || [],
          dynamicImports: moduleInfo.dynamicallyImportedIds || [],
          exports: moduleInfo.exportedBindings || {},
          isEntry: moduleInfo.isEntry || false,
        };
      }

      // 记录模块大小
      moduleSizes[moduleInfo.id] = moduleInfo.code?.length || 0;

      // 构建依赖树
      if (!dependencyTree[moduleInfo.id]) {
        dependencyTree[moduleInfo.id] = {
          children: [],
          parents: [],
          depth: 0,
        };
      }

      // 添加子依赖
      if (moduleInfo.importedIds) {
        moduleInfo.importedIds.forEach((importedId) => {
          if (onlyProjectModules && importedId.includes('node_modules')) return;
          if (!dependencyTree[importedId]) {
            dependencyTree[importedId] = {
              children: [],
              parents: [],
              depth: 0,
            };
          }

          if (!dependencyTree[moduleInfo.id].children.includes(importedId)) {
            dependencyTree[moduleInfo.id].children.push(importedId);
          }

          if (!dependencyTree[importedId].parents.includes(moduleInfo.id)) {
            dependencyTree[importedId].parents.push(moduleInfo.id);
          }
        });
      }
    },

    // 在生成 chunk 时收集信息
    renderChunk(code, chunk, _options) {
      if (onlyProjectModules && chunk.fileName.includes('node_modules'))
        return null;
      if (!filter(chunk.fileName)) return null;

      if (verbose) {
        console.log('🔧 渲染 chunk:', chunk.fileName);
      }

      // 更新 chunk 信息
      if (!dependencies[chunk.fileName]) {
        dependencies[chunk.fileName] = {
          id: chunk.fileName,
          size: code.length,
          importedIds: Array.from(chunk.imports || []).filter(
            (importedId) =>
              (includeNodeModules || !importedId.includes('node_modules')) &&
              (!onlyProjectModules || isProject(importedId))
          ),
          dynamicImports: Array.from(chunk.dynamicImports || []),
          exports: chunk.exports || [],
          isEntry: chunk.isEntry || false,
          facadeModuleId: chunk.facadeModuleId,
        };
      } else {
        // 更新现有信息
        dependencies[chunk.fileName].size = code.length;
        dependencies[chunk.fileName].importedIds = Array.from(
          chunk.imports || []
        ).filter(
          (importedId) =>
            (includeNodeModules || !importedId.includes('node_modules')) &&
            (!onlyProjectModules || isProject(importedId))
        );
        dependencies[chunk.fileName].dynamicImports = Array.from(
          chunk.dynamicImports || []
        );
        dependencies[chunk.fileName].isEntry = chunk.isEntry || false;
      }

      // 记录模块大小
      moduleSizes[chunk.fileName] = code.length;

      // 构建依赖树
      if (!dependencyTree[chunk.fileName]) {
        dependencyTree[chunk.fileName] = {
          children: [],
          parents: [],
          depth: 0,
        };
      }

      // 添加子依赖
      if (chunk.imports) {
        chunk.imports.forEach((importedId) => {
          if (onlyProjectModules && importedId.includes('node_modules')) return;
          if (!dependencyTree[importedId]) {
            dependencyTree[importedId] = {
              children: [],
              parents: [],
              depth: 0,
            };
          }

          if (!dependencyTree[chunk.fileName].children.includes(importedId)) {
            dependencyTree[chunk.fileName].children.push(importedId);
          }

          if (!dependencyTree[importedId].parents.includes(chunk.fileName)) {
            dependencyTree[importedId].parents.push(chunk.fileName);
          }
        });
      }

      return null; // 不修改代码
    },

    // 构建结束后分析依赖关系
    async buildEnd() {
      if (verbose) {
        console.log('🏁 构建结束，开始分析依赖...');
        console.log('📊 收集到的模块数量:', Object.keys(dependencies).length);
      }

      // 计算依赖深度
      const calculateDepth = (moduleId, visited = new Set(), depth = 0) => {
        if (visited.has(moduleId) || depth > maxDepth) return depth;

        visited.add(moduleId);
        const module = dependencyTree[moduleId];
        if (!module) return depth;

        let maxChildDepth = depth;
        module.children.forEach((childId) => {
          const childDepth = calculateDepth(
            childId,
            new Set(visited),
            depth + 1
          );
          maxChildDepth = Math.max(maxChildDepth, childDepth);
        });

        module.depth = maxChildDepth;
        return maxChildDepth;
      };

      // 检测循环依赖
      const detectCircularDeps = (moduleId, visited = new Set(), path = []) => {
        if (path.includes(moduleId)) {
          const cycle = [...path.slice(path.indexOf(moduleId)), moduleId];
          circularDeps.add(cycle.join(' -> '));
          return;
        }

        if (visited.has(moduleId)) return;
        visited.add(moduleId);
        path.push(moduleId);

        const module = dependencyTree[moduleId];
        if (module) {
          module.children.forEach((childId) => {
            detectCircularDeps(childId, visited, [...path]);
          });
        }
      };

      // 分析所有模块
      Object.keys(dependencyTree).forEach((moduleId) => {
        calculateDepth(moduleId);
        detectCircularDeps(moduleId);
      });

      // 生成分析报告
      let analysis = {
        summary: {
          totalModules: Object.keys(dependencies).length,
          totalSize: Object.values(moduleSizes).reduce(
            (sum, size) => sum + size,
            0
          ),
          circularDependencies: Array.from(circularDeps),
          entryPoints: Object.values(dependencies).filter((dep) => dep.isEntry)
            .length,
        },
        modules: dependencies,
        dependencyTree: dependencyTree,
        largestModules: Object.entries(moduleSizes)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([id, size]) => ({
            id,
            size,
            sizeKB: (size / 1024).toFixed(2),
          })),
        modulesByDepth: Object.entries(dependencyTree).reduce(
          (acc, [id, info]) => {
            if (!acc[info.depth]) acc[info.depth] = [];
            acc[info.depth].push(id);
            return acc;
          },
          {}
        ),
      };

      // 只保留本地依赖
      if (onlyProjectModules) {
        analysis.modules = Object.fromEntries(
          Object.entries(analysis.modules).filter(([id]) => isProject(id))
        );
        analysis.dependencyTree = Object.fromEntries(
          Object.entries(analysis.dependencyTree).filter(([id]) =>
            isProject(id)
          )
        );
        analysis.largestModules = analysis.largestModules.filter(({ id }) =>
          isProject(id)
        );
        Object.keys(analysis.modulesByDepth).forEach((depth) => {
          analysis.modulesByDepth[depth] =
            analysis.modulesByDepth[depth].filter(isProject);
          if (analysis.modulesByDepth[depth].length === 0)
            delete analysis.modulesByDepth[depth];
        });
      }

      // 打印分析结果
      if (verbose) {
        console.log('\n📊 依赖分析报告:');
        console.log('='.repeat(50));
        console.log(`总模块数: ${analysis.summary.totalModules}`);
        console.log(
          `总大小: ${(analysis.summary.totalSize / 1024).toFixed(2)} KB`
        );
        console.log(`入口点: ${analysis.summary.entryPoints}`);

        if (analysis.summary.circularDependencies.length > 0) {
          console.log('\n⚠️  检测到循环依赖:');
          analysis.summary.circularDependencies.forEach((cycle) => {
            console.log(`  ${cycle}`);
          });
        }

        console.log('\n📦 最大的模块:');
        analysis.largestModules.forEach(({ id, sizeKB }) => {
          console.log(`  ${id}: ${sizeKB} KB`);
        });

        console.log('\n🌳 按依赖深度分组:');
        Object.entries(analysis.modulesByDepth).forEach(([depth, modules]) => {
          console.log(`  深度 ${depth}: ${modules.length} 个模块`);
        });
      }

      // 使用 Vite 的 emitFile 方法写入文件
      this.emitFile({
        type: 'asset',
        fileName: outputFile,
        source: JSON.stringify(analysis, null, 2),
      });

      console.log(`✅ 依赖映射已生成: ${outputFile}`);
    },
  };
}
