// 仅示结构；颜色均为角色占位变量（--illus-*），需在宿主映射到所在项目设计系统的令牌，不得替换成硬编码色值；圆角同理取该项目阶梯
import React from 'react';
import styles from './standing_step_cards.example.module.css';

/**
 * 示例：平行立式色阶色卡插画 (Standing Step Cards)
 * 特征：平行等距矩阵、12px 呼吸间隙、上部实体色 + 下部 4 档浅色阶梯、Hover 两侧外展与主卡上浮
 */
export const StandingStepCardsExample: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button type="button" className={styles.cardContainer} onClick={onClick}>
      <div className={styles.illusArea}>
        <svg className={styles.svgCanvas} viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="stepSideShadow" x="-25%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="var(--illus-shadow)" floodOpacity="0.12" />
            </filter>
            <filter id="stepHeroShadow" x="-30%" y="-20%" width="160%" height="160%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="var(--illus-shadow)" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* 1. 左侧立式宽卡 (Purple 体系) */}
          <g className={styles.stepCardLeft}>
            <rect x="24" y="16" width="48" height="88" rx="7" fill="var(--illus-carrier)" filter="url(#stepSideShadow)" />
            <rect x="28" y="20" width="40" height="16" rx="3.5" fill="var(--illus-accent-1)" />
            <rect x="28" y="41.5" width="40" height="10.5" rx="2.5" fill="var(--illus-accent-1-tint-1)" />
            <rect x="28" y="54.5" width="40" height="10.5" rx="2.5" fill="var(--illus-accent-1-tint-2)" />
            <rect x="28" y="67.5" width="40" height="10.5" rx="2.5" fill="var(--illus-accent-1-tint-3)" />
            <rect x="28" y="80.5" width="40" height="10.5" rx="2.5" fill="var(--illus-accent-1-tint-4)" />
          </g>

          {/* 2. 中央主角立式宽卡 (Blue 体系) */}
          <g className={styles.stepCardCenter}>
            <rect x="84" y="12" width="52" height="96" rx="8" fill="var(--illus-carrier)" filter="url(#stepHeroShadow)" />
            <rect x="88" y="16" width="44" height="18" rx="4" fill="var(--illus-primary)" />
            <rect x="88" y="39.5" width="44" height="11.5" rx="3" fill="var(--illus-primary-tint-1)" />
            <rect x="88" y="53.5" width="44" height="11.5" rx="3" fill="var(--illus-primary-tint-2)" />
            <rect x="88" y="67.5" width="44" height="11.5" rx="3" fill="var(--illus-primary-tint-3)" />
            <rect x="88" y="81.5" width="44" height="11.5" rx="3" fill="var(--illus-primary-tint-4)" />
          </g>

          {/* 3. 右侧立式宽卡 (Green 体系) */}
          <g className={styles.stepCardRight}>
            <rect x="148" y="16" width="48" height="88" rx="7" fill="var(--illus-carrier)" filter="url(#stepSideShadow)" />
            <rect x="152" y="20" width="40" height="16" rx="3.5" fill="var(--illus-secondary)" />
            <rect x="152" y="41.5" width="40" height="10.5" rx="2.5" fill="var(--illus-secondary-tint-1)" />
            <rect x="152" y="54.5" width="40" height="10.5" rx="2.5" fill="var(--illus-secondary-tint-2)" />
            <rect x="152" y="67.5" width="40" height="10.5" rx="2.5" fill="var(--illus-secondary-tint-3)" />
            <rect x="152" y="80.5" width="40" height="10.5" rx="2.5" fill="var(--illus-secondary-tint-4)" />
          </g>
        </svg>
      </div>
      <div className={styles.infoArea}>
        <div className={styles.titleRow}>
          <span className={styles.cardTitle}>浅色阶梯 (Light)</span>
          <span className={styles.tagBadge}>LIGHT</span>
        </div>
        <div className={styles.descRow}>实色与 4 档浅色阶梯演进</div>
      </div>
    </button>
  );
};
