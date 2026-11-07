# 坐标、变换与投影

## 局部坐标

将对象在自己的坐标里构造，再用外层g放入画布，方便复用与整体调整。

```svg
<g transform="translate(100 40)">
 <g transform="rotate(-8 50 30)">
  <rect width="100" height="60" rx="10" fill="white"/>
  <circle cx="20" cy="30" r="8" fill="seagreen"/>
 </g>
</g>
```

translate改变位置，rotate可指定旋转中心，scale可等比或分别缩放，skewX/skewY产生斜切。嵌套分组使作用顺序更容易观察。

## 矩阵映射

matrix(a b c d e f)将点(x,y)映射为：

`x' = a*x + c*y + e`，`y' = b*x + d*y + f`。

```svg
<g transform="matrix(1 .25 -.5 .6 100 30)">
 <rect width="100" height="60" fill="lightblue"/>
 <text x="12" y="35" font-size="18">Sample</text>
</g>
```

同一平面上的图形和文字可以共享这个变换。仿射映射适合平行投影；更一般的透视映射需要投影顶点、重新构造路径或借助3D工具。

## 通过挤出建立体积

设正面轮廓点集为P，深度方向为向量v。背面点为P+v，相邻边的两个正面点与对应背面点组成侧面四边形。侧面与正面分别着色，可以得到有厚度的物体。绘制顺序依据可见面安排。

等距投影可选一组统一轴，例如：

`screenX = originX + (x-y)*cos(30°)`
`screenY = originY + (x+y)*sin(30°)-z`

改变轴向和缩放就能得到其他平行投影。复杂空间场景也可用Three.js生成相机视图，再按需要输出图像或重建矢量。

## 旋转边界

对包围框四角绕锚点应用旋转，再取x/y的最小最大值，可估计变换后范围。[layout.py](../scripts/layout.py)的rotated_bounds实现这项计算；滤镜外扩可另行估算或通过渲染查看。

资料：[MDN transform](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/transform)。
