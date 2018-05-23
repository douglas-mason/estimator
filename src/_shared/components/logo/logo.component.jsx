import React from 'react';
import {
  logoContainerClass,
  textClass,
  graphicClass,
  calculatorContainerClass,
  displayContainerClass,
  displayClass,
  buttonRowClass,
  buttonClass,
} from './logo.styles';

export const Logo = () => (
  <div className={logoContainerClass}>
    <div className={textClass}>Project Estimator</div>
    <div className={graphicClass}>
      <div className={calculatorContainerClass}>
        <div className={displayContainerClass}>
          <div className={displayClass} />
        </div>
        <div className={buttonRowClass}>
          <div className={buttonClass} />
          <div className={buttonClass} />
          <div className={buttonClass} />
        </div>
        <div className={buttonRowClass}>
          <div className={buttonClass} />
          <div className={buttonClass} />
          <div className={buttonClass} />
        </div>
        <div className={buttonRowClass}>
          <div className={buttonClass} />
          <div className={buttonClass} />
          <div className={buttonClass} />
        </div>
      </div>
    </div>
  </div>
);
