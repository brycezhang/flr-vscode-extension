# Bug 修复说明

## 问题

```
TypeError: arAsset.startsWith is not a function
```

## 原因

在处理 `pubspec.yaml` 中的 `flutter.assets` 配置时，YAML 解析器返回的 `assets.items` 可能包含 YAML 节点对象，而不是纯字符串。当代码尝试调用 `.startsWith()` 方法时，就会失败。

## 修复内容

### 1. 修复 oldAssetArray 的类型转换

**位置：** `src/FlrCommand.ts` 第 428-432 行

**修改前：**

```typescript
var oldAssetArray: string[] = new Array();
let assets = flutterConfig.get('assets');
if (yaml.isSeq<string>(assets)) {
  oldAssetArray = assets.items;
}
```

**修改后：**

```typescript
var oldAssetArray: string[] = new Array();
let assets = flutterConfig.get('assets');
if (yaml.isSeq(assets)) {
  // 确保所有元素都转换为字符串
  oldAssetArray = assets.items.map((item: any) => String(item));
}
```

### 2. 添加类型安全检查

**位置：** `src/FlrCommand.ts` 第 443-461 行

**修改：**

- 在循环中使用 `String(arAsset)` 确保类型转换
- 添加 try-catch 错误处理
- 添加详细的调试日志

```typescript
for (const arAsset of assetArray) {
  try {
    // 确保 arAsset 是字符串
    const assetStr = String(arAsset);
    console.log('[FLR] Processing asset:', assetStr, 'type:', typeof arAsset);

    if (assetStr.startsWith('packages') == false) {
      let assetFolder = path.dirname(assetStr);
      const folder = `${assetFolder}/`;
      if (!assetFolders.includes(folder)) {
        assetFolders.push(folder);
      }
    } else {
      assetFolders.push(assetStr);
    }
  } catch (error) {
    console.error('[FLR] Error processing asset:', arAsset, error);
    vscode.window.showWarningMessage(
      `[FLR] Skipping invalid asset: ${arAsset}`
    );
  }
}
```

### 3. 添加调试日志

添加了以下日志来帮助追踪问题：

- `[FLR] Old assets from pubspec:` - 显示从 pubspec.yaml 读取的旧资源
- `[FLR] New assets to add:` - 显示新扫描到的资源
- `[FLR] Merged assets:` - 显示合并后的资源列表
- `[FLR] Processing asset:` - 显示正在处理的每个资源
- `[FLR] Final asset folders:` - 显示最终的资源文件夹列表

## 测试

1. 编译代码：

   ```bash
   npm run compile
   ```

2. 按 F5 启动调试

3. 在新窗口中打开 Flutter 项目并运行命令

4. 查看输出日志，确认：
   - 不再出现 `startsWith is not a function` 错误
   - 能看到详细的资源处理日志
   - 成功生成 `lib/r.g.dart` 文件

## 影响范围

- ✅ 修复了 YAML 节点对象导致的类型错误
- ✅ 增强了错误处理，即使遇到无效资源也能继续处理
- ✅ 添加了详细日志，便于未来调试
- ✅ 向后兼容，不影响现有功能

## 相关文件

- `src/FlrCommand.ts` - 主要修复
- `TROUBLESHOOTING.md` - 添加了问题 5 的说明
- `BUG_FIX.md` - 本文档
