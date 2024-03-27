// энерегетическая цценность  рецепта на 100 гр от суммы продуктов

import React from 'react';
import styles from './EnergyValue.module.scss';

//  энерг. ценности блюда
export const EnergyValue = ({ calories, proteins, fats, carbs }) => {
  return (
    <div className={styles.energyValue}>
      <h3 className={styles.energyTitle}>ЭНЕРГЕТИЧЕСКАЯ ЦЕННОСТЬ НА 100 ГРАММ</h3>
      <div className={styles.energyContent}>
        {/* Блок с калорийностью */}
        <div className={styles.energyColumn}>
          <span className={styles.energyHeader}>КАЛОРИЙНОСТЬ</span>
          <span className={styles.energyValueText}>{calories}</span>
          <span className={styles.energyUnit}>ККАЛ</span>
        </div>
        {/* Блок с белками */}
        <div className={styles.energyColumn}>
          <span className={styles.energyHeader}>БЕЛКИ</span>
          <span className={styles.energyValueText}>{proteins}</span>
          <span className={styles.energyUnit}>ГРАММ</span>
        </div>
        {/* Блок с жирами */}
        <div className={styles.energyColumn}>
          <span className={styles.energyHeader}>ЖИРЫ</span>
          <span className={styles.energyValueText}>{fats}</span>
          <span className={styles.energyUnit}>ГРАММ</span>
        </div>
        {/*  углеводами */}
        <div className={styles.energyColumn}>
          <span className={styles.energyHeader}>УГЛЕВОДЫ</span>
          <span className={styles.energyValueText}>{carbs}</span>
          <span className={styles.energyUnit}>ГРАММ</span>
        </div>
      </div>
      <p className={styles.energyNote}>* КАЛОРИЙНОСТЬ РАССЧИТАНА ДЛЯ СЫРЫХ ПРОДУКТОВ</p>
    </div>
  );
};
