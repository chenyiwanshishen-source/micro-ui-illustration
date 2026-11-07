# 项目设计系统接入指引模板

当把本 Skill 引入到具体的前端或设计系统项目中时，可以复制本文件为 `references/<项目名>_binding.md`，用于指定项目上下文与设计令牌（Tokens）位置。

## 1. 目标项目上下文

- **项目根目录**：`./path/to/your-project`
- **设计令牌文件**：`src/design-system/tokens.json`（或 CSS 变量定义文件）
- **插画落点组件**：例如 `src/components/illustrations/CoverIllustration.tsx`

## 2. 令牌角色映射（Role Mapping）

本 Skill 使用逻辑颜色角色，生成代码前会映射到具体项目的 Token：

| 逻辑角色 (CSS 变量) | 项目对应 Token | 示例色值 / 说明 |
| :--- | :--- | :--- |
| `var(--illus-base)` | `colors.surface.canvas` | 画面基础承载底色 |
| `var(--illus-surface)` | `colors.surface.card` | 主体控件/卡片表面 |
| `var(--illus-accent)` | `colors.brand.primary` | 单一焦点强调色 |
| `var(--illus-muted)` | `colors.text.tertiary` | 弱对比线条与次要部件 |
| `var(--illus-shadow)` | `colors.shadow.ambient` | 多阶环境软阴影色 |

## 3. 尺寸与圆角规范

接入时直接使用目标项目的间距与圆角梯级（例如 `rounded-lg`, `rounded-xl`），确保生成的 SVG 视觉风格与项目宿主保持浑然一体。
