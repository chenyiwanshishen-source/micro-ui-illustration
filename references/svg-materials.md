# 填充、阴影与纹理

## 渐变

linearGradient适合方向性明暗，radialGradient适合局部亮度扩散。userSpaceOnUse让多个对象共享同一画布坐标下的渐变。

```svg
<defs>
 <linearGradient id="sample-face" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
  <stop offset="0" stop-color="lightblue"/>
  <stop offset="1" stop-color="steelblue"/>
 </linearGradient>
</defs>
<rect width="140" height="100" rx="12" fill="url(#sample-face)"/>
```

## 柔和投影

feDropShadow的dx/dy控制偏移，stdDeviation控制扩散，flood-color和flood-opacity控制颜色及透明度。

```svg
<defs>
 <filter id="sample-shadow" x="-40%" y="-40%" width="180%" height="200%">
  <feDropShadow dx="0" dy="5" stdDeviation="7" flood-color="black" flood-opacity=".08"/>
 </filter>
</defs>
<rect x="30" y="20" width="140" height="80" rx="12" fill="white" filter="url(#sample-shadow)"/>
```

滤镜区域决定阴影能显示到哪里。多个阴影可分别承担近接触和宽扩散。上例是历史简洁案例采用的数值，可通过移动、模糊与透明度观察效果变化。

## 硬投影

把轮廓沿一个偏移复制到后方并填色，可形成硬阴影。倾斜光照投向平面时，可从物体高度和光线方向推导落点；这种方式便于获得统一投影，而不依赖模糊滤镜。

## 重复纹理

```svg
<defs>
 <pattern id="sample-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <path d="M0 0V6" stroke="lightgray" stroke-width="1"/>
 </pattern>
</defs>
<path d="M70 100H170V40Z" fill="url(#sample-hatch)"/>
```

改变周期、笔画和透明度可调整纹理密度；结合clipPath可将纹理贴到某个面。feTurbulence可生成噪声，feColorMatrix和feBlend可进一步着色与混合。

渐变、pattern、滤镜和clipPath的组合实例见 [Headings SVG](../templates/typography/headings.svg)。

资料：[MDN滤镜](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Filter_effects)。
