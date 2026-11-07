# Micro-UI 案例库与收录说明

本文件记录用户确认收录的可编辑 SVG 案例。画新插画时，可以参考这些案例的图层结构、阴影和旋转参数。

---

## 一、 已收录案例清单

| 主题 | 预览 | 源码 | 核心构造特点 | 适用场景 |
|---|---|---|---|---|
| **书签整理** | [PNG](../assets/examples/bookmarks.png) | [SVG](../assets/examples/bookmarks.svg) | 书签负形开口、微角度分组旋转、纯色图文标签、双层柔影 | 收藏夹、分类管理、知识库空状态 |
| **日程提醒** | [PNG](../assets/examples/calendar.png) | [SVG](../assets/examples/calendar.svg) | 重复日期网格节奏、单一鲜色选中焦点、时间标记附件 | 日历看板、待办安排、排期完成提示 |
| **文件上传** | [PNG](../assets/examples/upload.png) | [SVG](../assets/examples/upload.svg) | 真实文件折角切片、格式扩展名徽章、前后层次错开遮挡 | 文件上传拖拽区、附件列表、导入引导 |
| **移动内容** | [PNG](../assets/examples/moving-content.png) | [SVG](../assets/examples/moving-content.svg) | 两层圆角山形遮挡、平滑转弯移动箭头、文件夹开口与前景工具条尺度反差 | 拖拽整理完成卡、归档移动反馈、批量操作面板 |

---

## 二、 收录规则

完成并检查后主动询问一次，用户明确同意后才收录。

1. **询问与确认**：
   - 插画画完并完成视觉检查后，AI 主动询问一次：“这张插画满意吗？要不要收录到案例库供以后参考？”
   - 用户如果还在提修改要求，先改图，不反复询问。
   - 用户拒绝、未回复，或者只说了“满意”但没有明确同意收录，都不执行收录。
   - 不自动收录每次生成的结果。
2. **文件检查**：
   - 必须同时有可编辑的 `.svg` 源码与渲染出的 `.png` 预览图。
   - 检查名称是否与已有案例冲突，不覆盖同名文件。
3. **记录更新**：
   - 收录后在上表中追加一行，写清主题名称、预览与源码链接、构造特点以及适用场景。

---

## 三、 收录工具调用

在用户明确同意收录后，运行收录脚本 [`scripts/collect-example.mjs`](../scripts/collect-example.mjs)：

```bash
node scripts/collect-example.mjs \
  --name task-complete \
  --svg /path/to/illustration.svg \
  --png /path/to/illustration.1x.png \
  --title "任务完成" \
  --features "真实对勾开关徽章、分层折角卡片、低对比环境光晕" \
  --scenarios "操作成功提示、任务清单结算、阶段性达成反馈"
```
