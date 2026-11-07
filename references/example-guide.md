# 原创 Micro-UI 案例库与收录指南

本文件收录经过用户实际验证、确认达到高标准并明确要求归档的原创可编辑 SVG 案例。新任务在构思时，可直接查阅已收录案例的源码与参数进行迁移复用。

---

## 一、 已收录原创案例清单

| 主题 | 预览 | 源码 | 核心构造特点 | 适用场景 |
|---|---|---|---|---|
| **书签整理** | [PNG](../assets/examples/bookmarks.png) | [SVG](../assets/examples/bookmarks.svg) | 书签负形开口、微角度分组旋转、纯色图文标签、双层柔影 | 收藏夹、分类管理、知识库空状态 |
| **日程提醒** | [PNG](../assets/examples/calendar.png) | [SVG](../assets/examples/calendar.svg) | 重复日期网格节奏、单一鲜色选中焦点、时间标记附件 | 日历看板、待办安排、排期完成提示 |
| **文件上传** | [PNG](../assets/examples/upload.png) | [SVG](../assets/examples/upload.svg) | 真实文件折角切片、格式扩展名徽章、前后层次错开遮挡 | 文件上传拖拽区、附件列表、导入引导 |
| **移动内容** | [PNG](../assets/examples/moving-content.png) | [SVG](../assets/examples/moving-content.svg) | 两层圆角山形遮挡、平滑转弯移动箭头、文件夹开口与前景工具条尺度反差 | 拖拽整理完成卡、归档移动反馈、批量操作面板 |

---

## 二、 案例收录原则与规约

为了保证案例库的高质量与资产纯净，收录操作必须严格遵守以下原则：

1. **用户明确授权方可收录**：
   - 严禁在每次生成或微调后自动收录作品；
   - **只有当用户明确表示满意、认可并下达收录指令**（如“把这个案例收录进库”、“保存到示例库”）后，方可执行收录。
2. **防覆盖与完整性校验**：
   - 收录时必须同时具备**可编辑的 `.svg` 源码**与**渲染后的 `.png` 预览图**；
   - 严禁覆盖已有同名案例，若名称已存在必须提示用户重命名。
3. **记录完整元数据**：
   - 每次成功收录后，自动或手动追加记录到上表，写明：主题名称、预览与源码链接、核心构造特点以及推荐的适用场景。

---

## 三、 收录工具调用方式

项目提供了收录辅助脚本 [`scripts/collect-example.mjs`](../scripts/collect-example.mjs)。在获得用户明确指令后，可执行以下命令完成安全收录：

```bash
node scripts/collect-example.mjs \
  --name task-complete \
  --svg /path/to/illustration.svg \
  --png /path/to/illustration.1x.png \
  --title "任务完成" \
  --features "真实对勾开关徽章、分层折角卡片、低对比环境光晕" \
  --scenarios "操作成功提示、任务清单结算、阶段性达成反馈"
```
