# Micro-UI Illustration Skill 🎨

> 面向 AI Agent（Antigravity, Claude, Cursor, Codex 等）的高水准微缩界面（Micro-UI）矢量插画系统与生成工具箱。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Format: SVG](https://img.shields.io/badge/Format-SVG-orange.svg)](#)
[![Design System](https://img.shields.io/badge/Design%20System-Token%20Ready-green.svg)](#)

---

## 🌟 什么是 Micro-UI 插画？

**Micro-UI 插画** 是一种将真实界面的典型组件与控件（如开关、文件夹开口、分段选择器、日历网格、格式标签）转化为微缩切片的矢量插画风格。它常用于现代设计系统、B端产品封面、功能引导卡片、空状态（Empty States）及交互完成卡。

本 Skill 不仅是一套设计规范，更是一套**内置几何构建引擎、设计令牌绑定与多阶自检复审闭环**的完整生产体系。

---

## 💎 核心美学规范与设计原则

1. **真实控件切片**：主体必须具有可识别的真实工具或控件结构，禁止堆砌无意义的空白卡片或灰色骨架屏。
2. **零描边与纯色平涂**：大形主体用纯色色面与轻柔投影定界，告别粗黑外轮廓线。
3. **三层分层构图**：`基础承载底板 → 中景控件切片 → 前景焦点`。
4. **单层原子与禁止递归**：主体若由多个子模块构成，子模块保持完整的纯色实体，严禁无限嵌套微控件或伪图表。
5. **最小构件 ≥ 16px**：在目标展示尺寸下，独立色块宽和高均至少 16px，细节克制，突出重点。
6. **设计系统令牌解耦**：代码仅使用 `var(--illus-*)` 逻辑角色变量，在导出或接入项目时无缝映射到具体设计系统的色彩 Token。

---

## 📂 项目结构

```text
micro-ui-illustration/
├── SKILL.md                  # Skill 主入口（流程指引、风格边界与交付前视觉验收）
├── LICENSE                   # MIT 开源协议
├── assets/
│   ├── reference-images/     # 参考图谱（用于提取造型知识与色彩对比的基准图）
│   └── examples/             # 经典收录案例（SVG 源码与 PNG 预览）
├── examples/                 # 组件化代码与分层控件示例
├── references/               # 16+ 篇模块化专业参考规范
│   ├── composition-method.md # 构图与空间组织
│   ├── micro-ui-construction.md # 尺寸、光影与完整案例参数
│   ├── svg-drawing-recipes.md # 几何构建工具调用方式
│   ├── svg-materials.md      # 滤镜、柔和微投影、45°斜纹等材质
│   ├── svg-geometry.md       # 曲线与路径标准
│   ├── visual-reference-map.md # 参考图谱与特征提取表
│   └── project_binding_template.md # 宿主项目设计令牌接入模板
├── scripts/
│   ├── build-kit.mjs         # 纯原生 2.5D 相机透视、圆角多边形与几何构建库
│   ├── render.mjs            # 基于无头浏览器的 1x / 3x PNG 导出与质检脚本
│   ├── layout.py             # 图文混排与行列测量辅助
│   └── review_sheet.py       # 并排走查比对图拼接工具
├── styles/                   # 风格经验与历史构建参数
└── templates/                # Typography、搜索筛选等开箱即用模板
```

---

## 🛠️ 安装与使用

### 1. 作为 AI Agent Skill 使用

将本目录克隆或放入你的工作区 Agent 技能目录中：

```bash
# Antigravity / Codex / 通用 Agent
mkdir -p .agents/skills
git clone https://github.com/chenyiwanshishen-source/micro-ui-illustration.git .agents/skills/micro-ui-illustration

# Claude Code
mkdir -p .claude/skills
git clone https://github.com/chenyiwanshishen-source/micro-ui-illustration.git .claude/skills/micro-ui-illustration
```

随后在向 AI 提问时直接触发技能，例如：
> “请使用 `micro-ui-illustration` 技能，为我的组件库绘制一个包含文件夹切片与标签的移动内容完成卡插画。”

### 2. 独立调用底层几何构建库 (`build-kit.mjs`)

```javascript
import {
  rrect,
  frame,
  tiltFrame,
  makeCam,
  bbox,
  fitBounds,
  svgDocument,
  resolveSvgRoles,
} from './scripts/build-kit.mjs';

// 1. 初始化 2.5D 相机
const cam = makeCam({ TH: 30, PH: 45, S: 1 });
const fr = frame([0, 0, 0], tiltFrame(15));

// 2. 构造圆角几何实体
const ring = rrect(0, 0, 120, 80, 10);
const solid = cam.solid({
  fr,
  r0: ring,
  z0: 0,
  r1: ring,
  z1: 12,
  col: { cap: '#ffffff', front: '#f3f4f6', right: '#e5e7eb' },
});

// 3. 组装并导出 SVG
const bounds = bbox(solid.hull);
const fit = fitBounds(bounds, { width: 320, height: 200, margin: 16 });
const svg = svgDocument({
  width: 320,
  height: 200,
  background: '#f8fafc',
  body: `<g transform="${fit.transform}">${solid.svg}</g>`,
});
```

---

## 🔄 资产自演进机制

每当 AI 协助完成一张视觉满意的全新高质量插画：
1. 将产出的 `.svg` 和渲染的 `.png` 存入 `assets/examples/`；
2. 在 `references/example-guide.md` 中记录其构造亮点与参数；
3. 下次 AI 绘制类似主题时，将自动参考该成熟案例的代码与结构，形成持续自进化的插画资源库。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
