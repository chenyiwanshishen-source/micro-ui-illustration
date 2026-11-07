// 仅示结构；颜色均为角色占位变量（--illus-*），需在宿主映射到所在项目设计系统的令牌，不得替换成硬编码色值；圆角同理取该项目阶梯
import React from 'react';
import styles from './ui_ecosystem_slice.example.module.css';

/**
 * 示例：2.5D 多层 UI 生态切片插画 (UI Ecosystem Slice)
 * 特征：零描边、纯色块按钮、纯绿实体色气泡、纯白底板、轻柔弥散阴影、分层微悬浮动效
 */
export const UIEcosystemSliceExample: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button type="button" className={styles.cardContainer} onClick={onClick}>
      <div className={styles.illusArea}>
        <svg className={styles.svgCanvas} viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="demoBaseShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="var(--illus-shadow)" floodOpacity="0.05" />
            </filter>
            <filter id="demoModalShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="3.5" floodColor="var(--illus-shadow)" floodOpacity="0.09" />
            </filter>
            <filter id="demoBubbleShadow" x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="var(--illus-secondary)" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* 1. 基础卡片层 (Base Layer) */}
          <g className={styles.baseLayer}>
            <rect x="24" y="14" width="120" height="76" rx="8" fill="var(--illus-carrier)" filter="url(#demoBaseShadow)" />
            <rect x="36" y="26" width="44" height="8" rx="4" fill="var(--illus-primary-tint-3)" />
            <rect x="36" y="40" width="28" height="6" rx="3" fill="var(--illus-placeholder)" />
          </g>

          {/* 2. 悬浮微弹窗层 (Middle Modal Layer) */}
          <g className={styles.modalLayer}>
            <rect x="88" y="46" width="112" height="60" rx="8" fill="var(--illus-carrier)" filter="url(#demoModalShadow)" />
            <rect x="100" y="58" width="46" height="7" rx="3.5" fill="var(--illus-border)" />
            <rect x="124" y="78" width="30" height="16" rx="4" fill="var(--illus-placeholder-soft)" />
            <rect x="160" y="78" width="30" height="16" rx="4" fill="var(--illus-primary)" />
          </g>

          {/* 3. 悬浮实体色气泡层 (Hero Bubble Layer) */}
          <g className={styles.bubbleLayer} filter="url(#demoBubbleShadow)">
            <polygon points="165,34 170,39 175,34" fill="var(--illus-secondary)" />
            <rect x="144" y="12" width="52" height="22" rx="6" fill="var(--illus-secondary)" />
          </g>
        </svg>
      </div>
      <div className={styles.infoArea}>
        <div className={styles.titleRow}>
          <span className={styles.cardTitle}>使用场景 (Scenarios)</span>
          <span className={styles.tagBadge}>SCENARIOS</span>
        </div>
        <div className={styles.descRow}>卡片 · 文字 · 弹窗 · 气泡等组件落地配方</div>
      </div>
    </button>
  );
};
