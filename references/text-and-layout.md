# 文字度量与布局工具

## 测量SVG文字

浏览器原生DOM中，可在字体加载后读取实际排版宽度：

```javascript
await document.fonts.ready;
const label = document.querySelector('text');
const width = label.getComputedTextLength();
const bounds = label.getBBox();
```

这些方法在浏览器DOM中使用；自动化工具可能只暴露部分接口。getBoundingClientRect返回屏幕坐标边界，旋转后它与未旋转文字宽度不同。Python Pillow的ImageFont.getlength也能测量指定字体。

## 从内容计算容器

图标文字标签可按下面的关系计算：

`W = PL + 图标槽I + 间距G + 文本宽T + PR`

双行文字块高度可取`Htext=L1+行间距+L2`。容器内容高度可取文字块、图标和动作槽的最大高度，再加上下padding。文字baseline与字形顶边不同，计算后看渲染有助于光学对齐。

## 使用现有辅助

```python
import sys
sys.path.insert(0, '/实际skill路径/scripts')
from layout import row, rows, rotated_bounds
layout = row(x=20, y=20, text_width=48, line_heights=[14],
             icon=20, padding=(10,8,10,8), gap=8)
# layout包含容器、图标槽、文字起点、文字可用宽与动作槽。
line_boxes = rows(x=20, y=60, width=180, height=28, count=3, gap=4)
bounds = rotated_bounds(layout['box'], angle=-8)
```

数字用于展示调用方式，可以替换。text_width接收所用字体的度量结果；脚本根据输入计算几何，并在指定容器装不下内容时抛出异常，便于发现计算问题。

CLI也可用：`python3 <skill>/scripts/layout.py spec.json`。例如：

```json
{"operation":"row","x":20,"y":20,"text_width":48,"line_heights":[14],"icon":20,"padding":[10,8,10,8],"gap":8}
```

英文标签的实际实例见 [Bookmarks SVG](../assets/examples/bookmarks.svg)，表格行的实例见 [Table SVG](../templates/typography/table.svg)。
