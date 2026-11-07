// 仅示结构；颜色均为角色占位变量（--illus-*），需在宿主映射到所在项目设计系统的令牌，不得替换成硬编码色值；圆角同理取该项目阶梯
import React from 'react';
import styles from './fan_swatch_deck.example.module.css';

/**
 * 示例：扇面发散阵列色卡插画 (Fan Swatch Deck)
 * 特征：轴向旋转发散、底部咬合遮挡、5 色系全景展开、Hover 扇面平滑舒展动效
 */
export const FanSwatchDeckExample: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button type="button" className={styles.cardContainer} onClick={onClick}>
      <div className={styles.illusArea}>
        <svg className={styles.svgCanvas} viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="fanSideShadow" x="-25%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="0" dy="2.5" stdDeviation="3" floodColor="var(--illus-shadow)" floodOpacity="0.10" />
            </filter>
            <filter id="fanMidShadow" x="-25%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="0" dy="3.5" stdDeviation="4" floodColor="var(--illus-shadow)" floodOpacity="0.14" />
            </filter>
            <filter id="fanHeroShadow" x="-30%" y="-20%" width="160%" height="160%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="var(--illus-shadow)" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* 1. 最左后翼：Cyan 500 */}
          <g className={styles.fanCardFarLeft}>
            <rect x="82" y="22" width="56" height="76" rx="6.5" fill="var(--illus-carrier)" filter="url(#fanSideShadow)" />
            <rect x="85.5" y="25.5" width="49" height="42" rx="5" fill="var(--illus-accent-3)" />
            <rect x="96" y="77" width="28" height="4" rx="2" fill="var(--illus-neutral-1)" />
          </g>

          {/* 2. 最右后翼：Orange 500 */}
          <g className={styles.fanCardFarRight}>
            <rect x="82" y="22" width="56" height="76" rx="6.5" fill="var(--illus-carrier)" filter="url(#fanSideShadow)" />
            <rect x="85.5" y="25.5" width="49" height="42" rx="5" fill="var(--illus-accent-2)" />
            <rect x="96" y="77" width="28" height="4" rx="2" fill="var(--illus-neutral-1)" />
          </g>

          {/* 3. 次左中翼：Purple 500 */}
          <g className={styles.fanCardMidLeft}>
            <rect x="82" y="20" width="56" height="78" rx="7" fill="var(--illus-carrier)" filter="url(#fanMidShadow)" />
            <rect x="85.5" y="23.5" width="49" height="44" rx="5.5" fill="var(--illus-accent-1)" />
            <rect x="96" y="77" width="28" height="4" rx="2" fill="var(--illus-neutral-1)" />
          </g>

          {/* 4. 次右中翼：Green 500 */}
          <g className={styles.fanCardMidRight}>
            <rect x="82" y="20" width="56" height="78" rx="7" fill="var(--illus-carrier)" filter="url(#fanMidShadow)" />
            <rect x="85.5" y="23.5" width="49" height="44" rx="5.5" fill="var(--illus-secondary)" />
            <rect x="96" y="77" width="28" height="4" rx="2" fill="var(--illus-neutral-1)" />
          </g>

          {/* 5. 中央主角：Brand Blue 500 */}
          <g className={styles.fanCardCenterHero}>
            <rect x="78" y="16" width="64" height="84" rx="8" fill="var(--illus-carrier)" filter="url(#fanHeroShadow)" />
            <rect x="82" y="20" width="56" height="48" rx="6" fill="var(--illus-primary)" />
            <rect x="94" y="78" width="32" height="4.5" rx="2.25" fill="var(--illus-neutral-2)" />
          </g>
        </svg>
      </div>
      <div className={styles.infoArea}>
        <div className={styles.titleRow}>
          <span className={styles.cardTitle}>实体色 (Solid)</span>
          <span className={styles.tagBadge}>SOLID</span>
        </div>
        <div className={styles.descRow}>全光谱基石色与发散矩阵</div>
      </div>
    </button>
  );
};
