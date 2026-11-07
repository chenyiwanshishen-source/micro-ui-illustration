# 路径与曲线

## 规则形体

rect的rx控制圆角，ellipse可以分别设置横纵半径；polygon连接一组顶点。适合建立规则体块，再组合成对象。

```svg
<rect x="20" y="20" width="100" height="60" rx="12" fill="steelblue"/>
<ellipse cx="160" cy="50" rx="24" ry="16" fill="coral"/>
```

## 自定义轮廓

M移动起点，L画直线，H/V画水平/垂直线，Z闭合。小写命令使用相对坐标。

```svg
<path d="M20 20 H70 V90 L45 73 L20 90 Z" fill="seagreen"/>
```

这是带缺口的闭合轮廓；修改顶点可以得到其他轮廓，path本身不限定图形语义。

## 二次与三次贝塞尔曲线

Q使用一个控制点；C使用两个控制点，分别影响起点出发方向和终点进入方向。

```svg
<path d="M20 80 Q70 0 120 80" fill="none" stroke="navy"/>
<path d="M20 80 C45 10 95 10 120 80" fill="none" stroke="tomato"/>
```

三次曲线P0、P1、P2、P3中，起点切线沿P1−P0，终点切线沿P3−P2。连接两段时，让交接点两侧控制柄沿同一直线，可以形成平滑过渡；改变柄长会改变弧线的饱满程度。控制柄方向不连续则可形成转折。

节点可放在极值和主要转折处。需要修一段轮廓时，可先调整相邻控制柄，再观察是否还需要增加节点。

## 圆弧与描边

A参数为rx、ry、旋转角、长弧标记、方向标记、终点。适合圆环、弧形边界与圆角。

```svg
<path d="M40 70 A30 30 0 0 1 100 70" fill="none" stroke="navy"
      stroke-width="4" stroke-linecap="round"/>
```

stroke-linecap影响端点，stroke-linejoin影响折角。pathLength可将路径长度归一化，方便设置虚线或绘制进度。vector-effect="non-scaling-stroke"可在变换后维持描边视觉宽度。

## 工具选择

直接写SVG适合简单、参数明确的轮廓；Inkscape等矢量编辑器的节点工具适合交互调整。需要大量重复或数学曲线时，可用Python/JavaScript计算点位，再输出path。

语法资料：[MDN路径教程](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)。
