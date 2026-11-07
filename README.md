# Micro-UI Illustration Skill 🎨

> 配合 AI Agent（如 Antigravity、Claude、Cursor、Codex 等）生成 Micro-UI 风格矢量插画（SVG）的规则与工具包。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Format: SVG](https://img.shields.io/badge/Format-SVG-orange.svg)](#)
[![Design System](https://img.shields.io/badge/Design%20System-Token%20Ready-green.svg)](#)

---

## 🌟 什么是 Micro-UI 插画？

**Micro-UI 插画** 是把界面里的真实控件（如开关、文件夹开口、分段选择器、日历网格、标签徽章）做成微缩切片的矢量插画。常用于设计系统说明、产品封面、功能引导卡片、空状态提示和操作结果卡。

本项目整理了相关的构图规则、色彩约定、参考图分析方法、渲染检查脚本以及案例收录流程，帮助 AI 生成符合规范的 SVG。

---

## 💎 设计原则

1. **真实控件切片**：主体必须是可识别的工具或控件结构，不用无意义的空白卡片或灰色横条凑数。
2. **零描边纯色平涂**：主体大形用纯色色面和轻柔投影区分边界，不用粗黑外轮廓线。
3. **三层构图**：按“基础承载底板 → 中景控件切片 → 前景焦点”组织画面。
4. **单层原子，不递归嵌套**：主体由多个子模块构成时，子模块保持纯色实体，不再往里面嵌套第三层微控件或伪图表。
5. **最小构件 ≥ 16px**：在目标展示尺寸下，独立色块宽和高均至少 16px，不做过于密集的细碎结构。
6. **使用颜色变量**：代码里优先写 `var(--illus-*)` 角色变量，方便接入具体项目的颜色 Token。

---

## 🛠️ 环境依赖与安装指南

仓库除了设计规则外，还提供了渲染检查脚本和案例收录工具。

### 1. 环境要求
- **Node.js**: v18.0.0 及以上
- **Python**: 3.9 及以上（可选，用于辅助对齐测量与拼接走查图）
- **Google Chrome / Chromium**: 本地无头渲染 1x、3x PNG 预览图

### 2. 依赖安装

```bash
# 1. 进入仓库目录
cd micro-ui-illustration

# 2. 安装 Node.js 依赖 (Playwright)
npm install

# 3. (可选) 安装 Python 辅助依赖 (Pillow 用于生成并排比对图)
pip install pillow
```

> [!NOTE]
> 渲染脚本 `scripts/render.mjs` 会优先使用本机已有的 Chrome；如果没有，可以执行 `npx playwright install chromium` 下载无头浏览器。

---

## 🤖 作为 AI Agent Skill 使用

### 1. 配置到 Agent 目录

把本目录克隆或复制到工具对应的 skills 目录：

```bash
# Antigravity / Codex / 通用 Agent 路径
mkdir -p .agents/skills
cp -r /path/to/micro-ui-illustration .agents/skills/micro-ui-illustration

# Claude Code 路径
mkdir -p .claude/skills
cp -r /path/to/micro-ui-illustration .claude/skills/micro-ui-illustration
```

### 2. 对话使用示例

直接向 AI 提出绘图需求，AI 会读取 `SKILL.md` 规则并生成原生 SVG：

> **用户**：“请使用 `micro-ui-illustration` 技能，为我的项目画一个移动内容到收纳夹的卡片封面插画。”
>
> **AI 输出**：生成包含主体卡片、文件夹切片与投影的 SVG 代码：

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="448" height="224" viewBox="0 0 448 224">
  <defs>
    <!-- 双层轻柔微投影 -->
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

如果有想参考的图，可以直接发给 AI：

1. **提供图片并说明需求**：把图片发给 AI，说明想借鉴的地方（比如某种配色分工、卡片折叠方式或阴影参数）。
2. **分析要点**：AI 查看图片，从造型、配色、层次、构图和光影五个方面拆解特征。
3. **记录到索引**：图片存入 `assets/reference-images/`，分析结果追加至 [`references/visual-reference-map.md`](references/visual-reference-map.md)。
4. **区分借鉴与照搬**：明确记录哪些是可借鉴的设计语言，哪些是原图的具体业务内容（不照搬）。
5. **无图情况**：没有参考图时，直接按已有规则和案例绘制，不要求用户提供图片。

> [!NOTE]
> 这里的“学习”是指分析参考图并把要点记录下来，供绘制时参考，不是训练模型。

---

## 📦 案例收录工具说明

完成并检查后主动询问一次，用户明确同意后才收录。不自动收录每次生成的结果，也不覆盖已有文件。

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

**工具检查机制**：
- 检查 `.svg` 与 `.png` 是否齐全且有效；
- **防重名覆盖**：如果同名文件已存在，立即报错中断，不覆盖已有案例；
- 自动在 [`references/example-guide.md`](references/example-guide.md) 追加表格记录。

---

## 📂 仓库结构与导航

```text
micro-ui-illustration/
├── SKILL.md                  # Skill 主入口（绘图流程、构图规则与检查清单）
├── LICENSE                   # MIT 开源协议
├── package.json              # 脚本与依赖配置
├── assets/
│   ├── reference-images/     # 用户参考图存放目录
│   └── examples/             # 已收录的原创案例（SVG 源码与 PNG 预览）
├── references/               # 详细参考说明
│   ├── visual-reference-map.md # 参考图片与分析记录
│   ├── example-guide.md      # 案例库与收录说明
│   ├── micro-ui-construction.md # 尺寸、光影与完整案例参数
│   ├── reference-color-relationships.md # 颜色角色与对比原则
│   ├── svg-materials.md      # 滤镜、柔和微投影、45°斜纹等材质
│   └── project_binding_template.md # 宿主项目设计令牌接入模板
├── scripts/
│   ├── collect-example.mjs   # 案例收录脚本（防覆盖、验完整）
│   ├── render.mjs            # 基于无头 Chrome 的 1x/3x 渲染检查脚本
│   ├── build-kit.mjs         # 2.5D 相机与几何构建辅助库
│   ├── layout.py             # 图文测量辅助
│   └── review_sheet.py       # 并排比对图拼板工具
└── styles/                   # 风格经验与历史构建参数
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
