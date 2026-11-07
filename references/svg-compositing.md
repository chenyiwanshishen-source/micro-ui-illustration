# 形状组合、裁切与遮罩

## 绘制顺序

SVG中后出现的形状覆盖先出现的形状。将相关内容放在g里，可以对整个对象控制顺序与变换。

```svg
<g id="rear"><rect x="20" y="20" width="120" height="80" fill="lightgray"/></g>
<g id="front"><circle cx="120" cy="80" r="30" fill="seagreen"/></g>
```

穿过一个环或夹层的对象，可把环拆为后半和前半：后半→穿过物→前半。完整后景加独立前景的例子见 [搜索筛选SVG](../templates/search-filter/search-filter.svg)。

## 复合路径挖孔

同一路径包含多个子路径时，evenodd按交叉次数决定填充，可表达孔洞。

```svg
<path fill="steelblue" fill-rule="evenodd"
 d="M20 20H140V120H20Z M50 45H110V95H50Z"/>
```

孔洞是真透明，底下的内容可以透出来。非零环绕规则则可用不同子路径方向控制填充。

## clipPath：保留某个区域

```svg
<defs>
 <clipPath id="sample-window"><rect x="20" y="20" width="120" height="80" rx="12"/></clipPath>
</defs>
<g clip-path="url(#sample-window)">
 <rect width="180" height="140" fill="lightblue"/>
 <circle cx="130" cy="80" r="50" fill="coral"/>
</g>
```

clipPath适合窗口、面板和纹理局部范围；裁切形状提供几何边界。

## mask：控制透明程度

```svg
<defs>
 <linearGradient id="sample-fade"><stop stop-color="white"/>
  <stop offset="1" stop-color="black"/></linearGradient>
 <mask id="sample-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="100"
       style="mask-type:luminance">
  <rect width="180" height="100" fill="url(#sample-fade)"/>
 </mask>
</defs>
<rect width="180" height="100" fill="seagreen" mask="url(#sample-mask)"/>
```

亮度mask中白色显示、黑色隐藏、灰色部分透明；alpha mask使用透明度而非颜色亮度。

## 布尔运算工具

Inkscape的Union、Difference、Intersection等可以把几何结果保存为路径；Paper.js提供unite/subtract/intersect等路径运算。它们适合自动生成复杂轮廓，使用前可查看当前环境是否已有对应工具。

资料：[MDN裁切与遮罩](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Clipping_and_masking)。
