# SVG 构建工具

使用 `../scripts/build-kit.mjs`，一个无第三方依赖的 ES module。它把原先本页的挤出、表面映射与投影片段替换为可调用实现；不自带配色、对象模板、构图或固定画板。脚本不能代替对象身份、主次与遮挡的设计。

## 按需要选择函数

| 要解决的问题 | 可调用的函数 | 使用边界 |
|---|---|---|
| 圆角轮廓与圆形 | `rrect(cx, cy, w, h, radius)`、`circle(cx, cy, radius)` | 返回局部坐标点；圆角和尺寸取目标项目规范 |
| 局部坐标、旋转与摆放 | `frame(origin, axes)`、`rotFrame(rx, ry, rz)`、`tiltFrame(degrees)` | `rotFrame` 用弧度；`tiltFrame` 用角度，不要混用 |
| 同一空间中的投影 | `makeCam({ TH, PH, S })` → `pr(point3D)` | `TH`/`PH` 是明确选择的角度；`S` 是尺度，不沿用某个分支的固定相机 |
| 带厚度的圆角实体 | `cam.solid({ fr, r0, r1, z0, z1, col })` | `r0`/`r1` 点数一致；颜色由调用者传入，默认无描边 |
| 图标、文字附着表面 | `cam.mat(fr, z)` | 把已在局部坐标排好的 SVG 放入这个矩阵，不单独猜每个细节的倾角 |
| 平面图形的硬挤出 | `extrude2D(d, { dx, dy, side, steps })` | 返回侧面层；调用者最后画正面。仅在已选择硬厚度画法时使用 |
| 几何投影与视觉投影区分 | `cam.castShadow(points3D, { planeZ, direction })` | 返回投影点集，不加颜色、不默认画阴影；柔影仍由项目参数配置 |
| 留白与群组摆放 | `bbox(points)`、`fitBounds(bounds, { width, height, margin })` | 默认不放大；只计算传入几何，不测滤镜、描边、字形与遮挡 |
| 令牌角色与独立 SVG | `resolveRoles(tokens, mapping)`、`resolveSvgRoles(svg, roles)`、`svgDocument(...)` | 不内置项目路径；映射缺失时报错，保留映射源随图交付 |

`col` 使用 `cap`、`front`、`right`、`left`、`back`、`up`、`down` 角色；未指定的侧面沿用 `cap`。采用本 skill 默认风格时，通过纯色色面与厚度定界。只有用户选定的画法需要描边时，才给相机传 `outline` 与 `lineWidth`。

## 最小调用方式

这是单个实体的构造方式，不是封面的固定场景。`spec` 来自当前画面设计，`tokens` 来自目标项目已读取的颜色文件。

```javascript
import { rrect, frame, tiltFrame, makeCam, bbox, fitBounds,
  resolveRoles, svgDocument, resolveSvgRoles } from '/绝对路径/micro-ui-illustration/scripts/build-kit.mjs';

const roles = resolveRoles(tokens, spec.roleMapping);
const cam = makeCam(spec.camera);
const fr = frame(spec.origin, tiltFrame(spec.tilt));
const ring = rrect(0, 0, spec.width, spec.height, spec.radius);
const solid = cam.solid({ fr, r0: ring, r1: ring,
  z0: 0, z1: spec.depth, col: spec.faceRoles });
const details = `<g transform="${cam.mat(fr, spec.depth)}">${authoredDetails}</g>`;
const fit = fitBounds(bbox(cam.BOX), spec.viewport);
const source = svgDocument({ ...spec.viewport,
  background: 'var(--illus-base)', defs: authoredDefs,
  body: `<g transform="${fit.transform}">${solid.svg}${details}</g>` });
const standalone = resolveSvgRoles(source, roles);
```

先按目标展示尺寸检查构件大小；整体缩放会同时缩小图标与色块。`cam.BOX` 是实体几何点，不包括表面细节、描边与滤镜；需把超出实体的细节纳入测量，并给阴影与笔画留出空间。不要用自动居中掩盖主体比例问题。

已有图文行、重复行、旋转边界计算继续使用 `scripts/layout.py`；并排参考检查继续使用 `scripts/review_sheet.py`，不重复实现。

## 渲染后的修改位置

| 可见问题 | 回改内容 |
|---|---|
| 去掉文字就认不出对象 | 轮廓、功能结构、对象关系；不要靠阴影补救 |
| 主体太小或像空卡片 | 主体尺寸、容器高度、内部结构与相对尺度 |
| 细节倾角不一致 | 局部坐标与 `cam.mat`，不要逐个旋转细节 |
| 相切、图标露半截 | 前后绘制顺序、位置与对象间距；包围框无法检查遮挡 |
| 画面越界或影子截断 | 群组摆放、绘制边界与滤镜范围 |
| 多张图看起来一样 | 回到主体与构图；不要继续只换材质 |

## 几何与构建机制

本构建工具采用标准的 2.5D 轴测透视矩阵、背向面剔除法线计算与凸包几何推导，提供统一的相机空间投影。移除了固定卡片尺寸、固定配色与装饰部件的硬编码，全面支持动态画板适配与基于设计系统的颜色角色导出。

笔刷、网点、颗粒滤镜、人物与动物零件不属于默认 Micro-UI 画法，本次不迁入。需要这些特定风格时再按用户选定范围处理；也不把本次探索图当作已获用户认可的模板。
