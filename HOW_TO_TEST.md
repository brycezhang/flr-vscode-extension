# 如何测试 FLR 插件

## ⚠️ 重要提示

`Flr: Re Generate r.g.dart` **不是** shell 命令！这是 VS Code 内部命令，只能在 VS Code 中运行。

## 正确的测试方法

### 方法 1: 在开发模式下测试（推荐）

#### 步骤 1: 编译扩展

```bash
npm install
npm run compile
```

#### 步骤 2: 启动调试

1. 在 VS Code 中打开这个扩展项目
2. 按 **F5** 键（或点击"运行" > "启动调试"）
3. 会打开一个新的 VS Code 窗口，标题显示 **[扩展开发主机]**

#### 步骤 3: 在新窗口中打开 Flutter 项目

1. 在新窗口中：文件 > 打开文件夹
2. 选择一个包含 `pubspec.yaml` 的 Flutter 项目

#### 步骤 4: 查看调试日志

1. 在新窗口中按 `Ctrl+Shift+U` (Mac: `Cmd+Shift+U`)
2. 在输出面板的下拉菜单中选择 **"扩展主机"**
3. 你会看到类似这样的日志：
   ```
   [FLR] Extension is activating...
   [FLR] Flutter project root dir: /path/to/your/project
   [FLR] Extension activated
   ```

#### 步骤 5: 运行命令

在新窗口中按 `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) 打开命令面板，然后：

**测试初始化：**

- 输入并选择: `Flr: Add Flr Config`
- 观察输出日志和 `pubspec.yaml` 的变化

**测试生成：**

- 输入并选择: `Flr: Re Generate r.g.dart`
- 观察输出日志和 `lib/r.g.dart` 文件

### 方法 2: 使用 FLR 视图

在扩展开发主机窗口中：

1. 打开左侧的**资源管理器**面板
2. 找到 **Flr(Assets Manager)** 视图
3. 点击工具栏上的按钮：
   - **+** 图标 = 添加 Flr 配置
   - **刷新** 图标 = 重新生成 r.g.dart

### 方法 3: 测试自动生成

1. 确保已经运行了 "Add Flr Config"
2. 在 `pubspec.yaml` 中配置资源目录：
   ```yaml
   flr:
     core_version: 1.0.0
     dartfmt_line_length: 80
     assets:
       - lib/assets/images/
     fonts:
       - lib/assets/fonts/
   ```
3. 创建资源目录并添加文件：
   ```bash
   mkdir -p lib/assets/images
   # 复制一些图片到这个目录
   ```
4. 保存 `pubspec.yaml` 或修改资源文件
5. 观察输出日志，应该自动触发生成

## 查看日志的位置

### 在扩展开发主机窗口中：

1. 按 `Ctrl+Shift+U` (Mac: `Cmd+Shift+U`)
2. 选择 **"扩展主机"** (Extension Host)

### 在原始开发窗口中：

1. 按 `Ctrl+Shift+U` (Mac: `Cmd+Shift+U`)
2. 选择 **"调试控制台"** 或 **"扩展开发主机"**

## 预期的日志输出

### 成功的初始化：

```
[FLR] Init command triggered
[FLR] initAll started
[FLR] Main project root dir: /Users/xxx/flutter_project
[FLR] Main project pubspec file: /Users/xxx/flutter_project/pubspec.yaml
[FLR] Found sub-projects: 0
[FLR] initAll completed
```

### 成功的生成：

```
[FLR] Manual refresh command triggered
[FLR] generateAll started, silent: false
[FLR] Main project root dir: /Users/xxx/flutter_project
[FLR] Main project pubspec file: /Users/xxx/flutter_project/pubspec.yaml
[FLR] Found sub-projects: 0
[FLR] generateOne started for: /Users/xxx/flutter_project
[FLR] Pubspec file: /Users/xxx/flutter_project/pubspec.yaml
[FLR] Assets resource dirs: [ '/Users/xxx/flutter_project/lib/assets/images' ]
[FLR] Fonts resource dirs: []
[FLR] generateAll completed
```

## 常见错误及解决方案

### 错误 1: "zsh: command not found: Flr:"

**原因：** 你在终端中运行了 VS Code 命令

**解决：** 不要在终端运行，而是在 VS Code 命令面板中运行（`Ctrl+Shift+P`）

### 错误 2: 看不到日志

**原因：** 输出面板选择了错误的源

**解决：** 确保选择了 "扩展主机" 而不是 "任务" 或其他

### 错误 3: "No Flutter project found"

**原因：** 没有打开包含 pubspec.yaml 的文件夹

**解决：** 使用 "文件 > 打开文件夹" 打开 Flutter 项目根目录

### 错误 4: "No resource directories configured"

**原因：** pubspec.yaml 中没有 flr 配置

**解决：** 先运行 "Add Flr Config" 命令，然后手动添加资源目录配置

## 快速测试清单

- [ ] 编译成功 (`npm run compile`)
- [ ] 按 F5 启动调试
- [ ] 新窗口打开 Flutter 项目
- [ ] 能看到 [FLR] 日志
- [ ] 运行 "Add Flr Config" 成功
- [ ] pubspec.yaml 中有 flr 配置节
- [ ] 创建资源目录和文件
- [ ] 运行 "Re Generate r.g.dart" 成功
- [ ] 生成了 lib/r.g.dart 文件

## 需要帮助？

如果仍然有问题，请提供：

1. 完整的日志输出（从 "Extension is activating" 开始）
2. pubspec.yaml 的内容
3. 项目目录结构
4. 具体的错误消息
