/**
 * Jagad Jawa — Wizard Stepper Abstraction
 * Helper modular & ringan untuk standarisasi wizard form di seluruh modul (Jodoh, Selametan, Ijab, dsb)
 * Menjamin konsistensi: ARIA attributes, progress calculation, safe validation transitions,
 * keyboard accessibility, dan bilingual labels.
 */

/**
 * @typedef {Object} StepperConfig
 * @property {string} namespace - Prefix ID elemen (misal: 'ijab', 'jodoh', 'selametan')
 * @property {number} totalSteps - Jumlah total langkah (misal: 3 atau 4)
 * @property {Object.<number, { containerId: string, navBtnId?: string, labelId: string, labelJv: string }>} steps
 * @property {function(number, number): (boolean|Promise<boolean>)} [onValidateStep] - Callback validasi (fromStep, toStep)
 * @property {function(number): void} [onStepChanged] - Callback saat langkah berhasil berpindah
 * @property {string} [progressBarId]
 * @property {string} [progressContainerId]
 * @property {string} [stepBadgeId]
 * @property {string} [stepIndicatorId]
 */

export class WizardStepper {
  /**
   * @param {StepperConfig} config
   */
  constructor(config) {
    this.config = config;
    this.currentStep = 1;
    this.totalSteps = config.totalSteps || 3;
    this.namespace = config.namespace || 'wizard';
  }

  /**
   * Mengambil langkah saat ini
   * @returns {number}
   */
  getCurrentStep() {
    return this.currentStep;
  }

  /**
   * Pindah langkah dengan validasi terintegrasi
   * @param {number} targetStep
   * @param {boolean} [validate=true]
   * @returns {boolean}
   */
  goToStep(targetStep, validate = true) {
    const nextStep = Math.max(1, Math.min(this.totalSteps, parseInt(targetStep, 10) || 1));
    const prevStep = this.currentStep;

    if (validate && nextStep > prevStep && typeof this.config.onValidateStep === 'function') {
      const isValid = this.config.onValidateStep(prevStep, nextStep);
      if (!isValid) return false;
    }

    this.currentStep = nextStep;
    this.applyUI(nextStep);

    if (typeof this.config.onStepChanged === 'function') {
      this.config.onStepChanged(nextStep);
    }

    return true;
  }

  /**
   * Update elemen DOM, ARIA progressbar, badge, dan kontainer visibilitas
   * @param {number} step
   */
  applyUI(step) {
    if (typeof document === 'undefined') return;

    const {
      steps,
      totalSteps,
      progressBarId = `${this.namespace}ProgressBar`,
      progressContainerId = `${this.namespace}ProgressBarContainer`,
      stepBadgeId = `${this.namespace}StepBadge`,
      stepIndicatorId = `${this.namespace}StepIndicator`
    } = this.config;

    const lang = (typeof window !== 'undefined' && typeof window.getLanguage === 'function')
      ? window.getLanguage()
      : 'id';
    const isJv = (lang === 'jv');

    // 1. Progress Bar & Accessibility Attributes
    const pct = `${((step / totalSteps) * 100).toFixed(1)}%`;
    const progressBar = document.getElementById(progressBarId);
    if (progressBar) {
      if (!progressBar.style) progressBar.style = {};
      progressBar.style.width = pct;
    }

    const progressContainer = document.getElementById(progressContainerId);
    if (progressContainer) {
      if (typeof progressContainer.setAttribute === 'function') {
        progressContainer.setAttribute('aria-valuenow', String(step));
        progressContainer.setAttribute('aria-valuemin', '1');
        progressContainer.setAttribute('aria-valuemax', String(totalSteps));
      }
    }

    // 2. Badge & Step Text Indicator
    const stepBadge = document.getElementById(stepBadgeId);
    if (stepBadge) stepBadge.textContent = String(step);

    const stepIndicator = document.getElementById(stepIndicatorId);
    if (stepIndicator && steps[step]) {
      const stepDef = steps[step];
      const text = isJv
        ? `Langkah ${step} saking ${totalSteps}: ${stepDef.labelJv}`
        : `Langkah ${step} dari ${totalSteps}: ${stepDef.labelId}`;
      stepIndicator.textContent = text;
    }

    // 3. Highlight Tombol Navigasi Stepper
    for (let i = 1; i <= totalSteps; i++) {
      const btnId = steps[i]?.navBtnId || `${this.namespace}NavBtn${i}`;
      const btn = document.getElementById(btnId);
      if (btn) {
        if (i === step) {
          btn.classList.add('border-prada', 'text-prada', 'bg-sogan-950');
          btn.classList.remove('border-sogan-700', 'text-sogan-300');
          if (typeof btn.setAttribute === 'function') btn.setAttribute('aria-current', 'step');
        } else {
          btn.classList.remove('border-prada', 'text-prada', 'bg-sogan-950');
          btn.classList.add('border-sogan-700', 'text-sogan-300');
          if (typeof btn.removeAttribute === 'function') btn.removeAttribute('aria-current');
        }
      }
    }

    // 4. Visibilitas Kontainer Per Langkah
    for (let i = 1; i <= totalSteps; i++) {
      const containerId = steps[i]?.containerId || `${this.namespace}StepContainer${i}`;
      const container = document.getElementById(containerId);
      if (container) {
        container.classList.toggle('hidden', i !== step);
      }
    }
  }
}
