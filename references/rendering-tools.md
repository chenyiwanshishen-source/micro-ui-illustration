# 渲染与查看工具

## 无头 Chrome：交付前检查

```bash
node <skill>/scripts/render.mjs /任务目录/illustration.svg --vars /任务目录/roles.json --out /任务目录/review
node <skill>/scripts/render.mjs /任务目录/preview.html --width 448 --height 224 --selector '#illustration' --out /任务目录/review
```

输出 `review.1x.png` 和 `review.3x.png`。3× 使用浏览器设备像素倍率重新渲染，不放大已有 PNG。SVG 默认取固有尺寸或 viewBox；展示页默认视口为 1200×720，可指定宽高。页面默认截图 body（可高于视口），`--selector` 可限定一个元素；独立 SVG 默认截取整个 SVG。页面应直接包含 SVG；若通过 img 引用 SVG，页面 CSS 变量不会穿透图片，需要先在 SVG 内解析变量。

依赖 Node.js、`playwright` 或 `playwright-core`，以及 Chrome。脚本可从本地依赖或 `NODE_PATH` 加载包；浏览器通过 `--chrome` 或 `CHROME_PATH` 指定，也会检查常见安装路径。未找到时明确报错，不自动安装。Codex 环境可用 `load_workspace_dependencies` 查找运行时和包目录，再通过 `NODE_PATH` 传入。

`--vars` 文件是 JSON 对象，键为完整 CSS 自定义属性名，值为非空 CSS 字符串。映射由具体项目的令牌生成，脚本通过根元素样式注入，不修改源文件。变量必须作用于实际图稿；脚本检查内联 SVG/HTML 属性与 style 中的无回退变量，缺失时报错。外部样式表、跨域嵌入等不能完整静态检查，仍需实际看图确认，不能仅凭脚本成功判断颜色正确。未使用变量的独立 SVG 可以不传 `--vars`。不要在 skill 中存放项目颜色映射。

截图前等待字体和页面图片加载，禁用 CSS 动画并暂停 SVG 动画。展示页应是静态、可重复的检查状态；脚本不操作交互控件。必须实际打开两个输出，按主文件的检查项记录问题，并在修订后重新渲染复检；脚本不评判画面质量。


## 浏览器预览

浏览器可直接打开SVG，或在HTML中显示它。带CSS变量、系统字体和滤镜的图稿可用目标浏览器观察实际效果。已有浏览器工具时，采用当前工具暴露的导航、截图和DOM接口即可。

简单本地预览可以用：

```bash
python3 -m http.server 5186 --bind 127.0.0.1 --directory /图稿所在目录
```

然后打开对应SVG地址。端口可按环境调整。

## 命令行矢量渲染

环境装有Inkscape时，可导出指定大小PNG：

```bash
inkscape illustration.svg --export-type=png --export-filename=illustration.png --export-width=896
```

其他可用方案包括resvg、librsvg的rsvg-convert或CairoSVG。不同工具对CSS、字体和滤镜的支持有所不同，选择环境已有且适合图稿特征的工具即可。

## 对照图

```bash
python3 <skill>/scripts/review_sheet.py sheet.png reference.png result.png --width 448 --height 224
```

该辅助需要Pillow，按比例排列已渲染PNG，不负责渲染SVG或评判画面。可以用于比较构图、密度和材质。局部细节适合从矢量源按更高分辨率重新渲染，观察曲线、笔画和连接。

## 源文件观察

XML解析可检查SVG结构，源码搜索可追踪id和引用，几何计算可检查布局与边界。它们与实际图像观察解决不同问题，可以按遇到的情况组合使用。
