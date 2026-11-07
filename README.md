# Micro-UI Illustration Skill 🎨

> 面向 AI Agent（Antigravity, Claude, Cursor, Codex 等）的高水准微缩界面（Micro-UI）矢量插画系统与生成工具箱。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Format: SVG](https://img.shields.io/badge/Format-SVG-orange.svg)](#)
[![Design System](https://img.shields.io/badge/Design%20System-Token%20Ready-green.svg)](#)

---

## 🌟 什么是 Micro-UI 插画？

**Micro-UI 插画** 是一种将现代界面的典型真实组件（如开关、文件夹开口、分段选择器、日历网格、格式标签徽章）转化为微缩切片的矢量插画风格。它常用于设计系统文档、B端产品封面、功能引导卡片、空状态（Empty States）及操作完成反馈卡。

本 Skill 是一套**包含美学规范、用户参考学习流程、无头浏览器多阶质检与案例持续收录**的完整 AI 插画生产体系。

---

## 💎 设计原则

1. **真实控件切片**：主体必须具有可识别的真实工具或控件结构，禁止堆砌无意义的空白卡片或灰色骨架屏横条。
2. **零描边与纯色平涂**：大形主体用纯色色面与轻柔投影定界，告别粗黑外轮廓线。
3. **三层分层构图**：`基础承载底板 → 中景控件切片 → 前景焦点`。
4. **单层原子与禁止递归**：主体若由多个子模块构成，子模块保持完整的纯色实体，严禁无限嵌套微控件或伪图表。
5. **最小构件 ≥ 16px**：在目标展示尺寸下，独立色块宽和高均至少 16px，细节克制，突出重点。
6. **设计系统令牌解耦**：代码优先使用 `var(--illus-*)` 逻辑角色变量，在导出或接入项目时无缝映射到具体设计系统的色彩 Token。

---

## 🛠️ 环境依赖与安装指南

本仓库除了提供完整的 Agent Skill 指南外，还内置了**自动渲染质检脚本**与**案例归档工具**。

### 1. 前置环境要求
- **Node.js**: v18.0.0 及以上
- **Python**: 3.9 及以上（可选，用于辅助对齐测量与拼接走查图）
- **Google Chrome / Chromium**: 用于本地无头渲染出 1x、3x PNG 预览图

### 2. 依赖安装命令

```bash
# 1. 克隆或下载本仓库
cd micro-ui-illustration

# 2. 安装 Node.js 渲染与工具依赖 (Playwright)
npm install

# 3. (可选) 安装 Python 辅助依赖 (Pillow 用于生成并排比对图)
pip install pillow
```

> [!TIP]
> 渲染脚本 `scripts/render.mjs` 会优先复用本地已安装的 Chrome 浏览器；若未安装完整浏览器，可执行 `npx playwright install chromium` 下载无头浏览器内核。

---

## 🤖 作为 AI Agent Skill 使用

### 1. 配置到你的 Agent 中

将本目录克隆或复制到对应工具的 skills 目录下：

```bash
# Antigravity / Codex / 通用 Agent 路径
mkdir -p .agents/skills
cp -r /path/to/micro-ui-illustration .agents/skills/micro-ui-illustration

# Claude Code 路径
mkdir -p .claude/skills
cp -r /path/to/micro-ui-illustration .claude/skills/micro-ui-illustration
```

### 2. 真实对话使用方式（无需编写任何代码）

你只需要像平时一样向 AI 发送指令，AI 会自动加载 `SKILL.md` 规则并输出优雅的原生 SVG：

> **用户**：“请使用 `micro-ui-illustration` 技能，为我的项目画一个移动内容到收纳夹的卡片封面插画。”
>
> **AI 输出**：符合规范的纯原生 SVG 代码（纯色卡片、文件夹开口切片、平滑移动箭头与双层弥散柔影）：

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="448" height="224" viewBox="0 0 448 224">
  <defs>
    <!-- 双层轻柔弥散微投影 -->
    <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#111827" flood-opacity=".06"/>
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#111827" flood-opacity=".03"/>
    </filter>
  </defs>
  
  <!-- 基础承载底板 -->
  <rect width="448" height="224" rx="16" fill="#F8F9FA"/>
  
  <!-- 中景微旋转控件实体 -->
  <g transform="rotate(-5 224 112)" filter="url(#soft-shadow)">
    <rect x="120" y="36" width="140" height="152" rx="16" fill="#FFFFFF"/>
    <!-- 真实文件夹开口切片 -->
    <path d="M140 70h30l6 6h44v60H140z" fill="#A7F3D0"/>
    <path d="M136 86h98v54H136z" fill="#10B981" rx="8"/>
  </g>
</svg>
```

---

## 🧭 用户参考学习流程

当你想借鉴某种特定风格时，可以随时给 AI 提供参考图：

1. **发送参考图并描述需求**：把图片发给 AI，并说明想借鉴的特点（如：“借鉴这种浅薄荷绿承载和深绿焦点的明度分配”）；
2. **AI 多维特征分析**：AI 查看图片，从造型、配色、层次、构图与光影五个维度进行分析；
3. **沉淀与索引**：图片存入 `assets/reference-images/`，分析结果追加至 [`references/visual-reference-map.md`](references/visual-reference-map.md)；
4. **明确界限**：记录“可借鉴语法”，同时排除“原图具体的业务内容与文字”，避免机械照搬；
5. **无参考图时**：默认使用内置规则与已有原创案例，**绝不强制用户上传参考**。

> *声明：这里的“学习”是指 AI 对视觉特征进行结构化反编译与工程记录，并非训练大模型底层权重。*

---

## 📦 案例收录工具使用说明

为了保持库的质量，本 Skill 规定：**严禁自动收录生成结果，只有在用户明确满意并下达收录指令后，才执行收录。**

执行收录时运行：

```bash
node scripts/collect-example.mjs \
  --name moving-content \
  --svg /path/to/illustration.svg \
  --png /path/to/illustration.1x.png \
  --title "移动内容" \
  --features "两层圆角山形遮挡、平滑转弯箭头、文件夹开口与前景工具条" \
  --scenarios "拖拽整理完成卡、批量移动归档、操作成功反馈"
```

**工具安全机制**：
- 自动校验 `.svg` 与 `.png` 的完整性与合法性；
- **防重名覆盖**：若同名文件已存在，立即报错中断，绝不覆盖已有案例；
- 自动在 [`references/example-guide.md`](references/example-guide.md) 追加表格记录。

---

## 📂 仓库结构与导航

```text
micro-ui-illustration/
├── SKILL.md                  # Skill 主入口（流程指引、美学红线与质检清单）
├── LICENSE                   # MIT 开源协议
├── package.json              # 脚本与渲染依赖配置
├── assets/
│   ├── reference-images/     # 用户参考图存放目录
│   └── examples/             # 已验证的开源原创案例（SVG 源码与 PNG 预览）
├── references/               # 模块化专业设计参考
│   ├── visual-reference-map.md # 参考图谱与学习索引
│   ├── example-guide.md      # 原创案例库与收录指南
│   ├── micro-ui-construction.md # 尺寸、光影与完整案例参数
│   ├── reference-color-relationships.md # 颜色角色与对比原则
│   ├── svg-materials.md      # 滤镜、柔和微投影、45°斜纹等材质
│   └── project_binding_template.md # 宿主项目设计令牌接入模板
├── scripts/
│   ├── collect-example.mjs   # 案例安全收录工具（防覆盖、验完整）
│   ├── render.mjs            # 基于无头 Chrome 的 1x/3x 渲染走查脚本
│   ├── build-kit.mjs         # 纯原生 2.5D 相机与几何构建辅助库
│   ├── layout.py             # 图文测量辅助
│   └── review_sheet.py       # 并排比对图拼板工具
└── styles/                   # 风格经验与历史构建参数
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
