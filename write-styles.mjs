import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, 'src', 'styles.css');

const stylesContent = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

:root {
  font-family: 'DM Sans', sans-serif;
  color: #15251f;
  background: #f5f2ea;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f5f2ea;
}

button, input, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f4eb 0%, #f4efe2 40%, #e6eee2 100%);
  display: flex;
  flex-direction: column;
}

/* ==================== GLOBAL TOPBAR ==================== */
.topbar {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 6vw, 96px);
  background: rgba(247, 244, 235, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #dcdfd5;
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand-btn {
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.brand {
  color: #133c34;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  letter-spacing: .2px;
}

.brand strong {
  font-weight: 700;
  color: #0f352e;
}

.brand-mark {
  height: 38px;
  width: 38px;
  display: grid;
  place-items: center;
  background: #d8ea5b;
  color: #12372f;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(120, 144, 47, 0.22);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  color: #4a5c53;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link:hover {
  color: #12372f;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 12px;
}

.btn-ghost {
  background: transparent;
  border: 1px solid #c8cfc2;
  color: #1a3c34;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s ease;
}

.btn-ghost:hover {
  background: #e9eee4;
  border-color: #a8b59e;
}

.btn-gold {
  background: #153e35;
  color: #f7f4eb;
  border: 0;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(21, 62, 53, 0.2);
  transition: all 0.15s ease;
}

.btn-gold:hover {
  background: #0f2d26;
  transform: translateY(-1px);
}

.user-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eaf1dc;
  color: #274921;
  border: 1px solid #cadba4;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.setup-nav-status {
  display: flex;
  align-items: center;
  gap: 18px;
}

.back-to-home-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4d6056;
  background: #eef3e8;
  border: 1px solid #d5dfce;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.back-to-home-link:hover {
  color: #133c34;
  background: #e2ecd9;
}

.step-label {
  font: 500 12px 'DM Mono', monospace;
  color: #65736b;
  text-transform: uppercase;
  letter-spacing: .8px;
}

.step-label span {
  margin-left: 10px;
  color: #133c34;
  font-weight: 700;
}

/* ==================== LANDING CONTAINER ==================== */
.landing-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* HERO SECTION */
.hero-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(48px, 8vh, 96px) clamp(24px, 6vw, 84px);
  display: grid;
  grid-template-columns: minmax(320px, 1.15fr) minmax(340px, 0.95fr);
  gap: clamp(40px, 6vw, 80px);
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e8f0d5;
  color: #436224;
  border: 1px solid #c9dba8;
  padding: 6px 14px;
  border-radius: 999px;
  font: 600 12px 'DM Mono', monospace;
  letter-spacing: 0.4px;
  margin-bottom: 22px;
}

.hero-title {
  margin: 0;
  color: #0e3029;
  font: 600 clamp(36px, 4.4vw, 58px)/1.08 'Playfair Display', serif;
  letter-spacing: -0.5px;
}

.hero-gold-text {
  color: #7b621e;
  background: linear-gradient(135deg, #7a5f1a 0%, #a48123 50%, #465f24 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-style: italic;
}

.hero-subtitle {
  margin: 22px 0 32px;
  color: #4b5a52;
  font-size: clamp(16px, 1.3vw, 18px);
  line-height: 1.62;
  max-width: 540px;
}

.hero-cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 36px;
}

.btn-gold-large {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #133c34;
  color: #f7f4eb;
  border: 0;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(19, 60, 52, 0.24);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-gold-large:hover {
  background: #0b2520;
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(19, 60, 52, 0.3);
}

.btn-secondary-large {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #27453d;
  border: 1px solid #cbd5c7;
  padding: 14px 26px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(35, 59, 43, 0.05);
  transition: all 0.15s ease;
}

.btn-secondary-large:hover {
  background: #f5f8f2;
  border-color: #a8b8a0;
}

.hero-trust-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #dbe2d4;
  width: 100%;
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #55665d;
  font-size: 13px;
  font-weight: 500;
}

.trust-item svg {
  color: #537d2f;
}

/* INTERACTIVE BABYLON CARD */
.babylon-card {
  background: #fffdf9;
  border: 1px solid #dce2d6;
  border-radius: 14px;
  padding: clamp(24px, 3.5vw, 36px);
  box-shadow: 0 24px 60px rgba(27, 51, 37, 0.1);
  position: relative;
  overflow: hidden;
}

.babylon-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #d8ea5b 0%, #9ab278 50%, #153e35 100%);
}

.babylon-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.card-eyebrow {
  display: block;
  font: 600 11px 'DM Mono', monospace;
  color: #6d8430;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.babylon-card-header h3 {
  margin: 0;
  color: #133932;
  font: 600 22px 'Playfair Display', serif;
}

.gold-seal {
  background: #edf3d8;
  color: #3b5a26;
  border: 1px solid #cadba4;
  font: 600 11px 'DM Mono', monospace;
  padding: 4px 10px;
  border-radius: 6px;
}

.allocator-prompt {
  margin: 0 0 16px;
  color: #5a6b62;
  font-size: 13px;
}

.income-slider-group {
  background: #f7f9f3;
  border: 1px solid #dfe5d8;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 22px;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 13px;
  color: #4b5e54;
}

.slider-label strong {
  font: 600 18px 'DM Mono', monospace;
  color: #12372f;
}

.income-slider-group input[type="range"] {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #d8e2cf;
  outline: none;
  accent-color: #153e35;
}

.allocation-bars {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 22px;
}

.alloc-item {
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid transparent;
}

.alloc-gold {
  background: #fcf9ec;
  border-color: #f0e6c2;
}

.alloc-sage {
  background: #f4f8ee;
  border-color: #dce7cf;
}

.alloc-emerald {
  background: #edf5f2;
  border-color: #d4e5de;
}

.alloc-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.alloc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alloc-badge {
  font: 600 11px 'DM Mono', monospace;
  padding: 2px 7px;
  border-radius: 4px;
}

.alloc-gold .alloc-badge {
  background: #f4e3a4;
  color: #695213;
}

.alloc-sage .alloc-badge {
  background: #d8e7c1;
  color: #3b5623;
}

.alloc-emerald .alloc-badge {
  background: #cce4dc;
  color: #13473b;
}

.alloc-meta strong {
  font-size: 13px;
  color: #203b33;
}

.alloc-val {
  font: 600 14px 'DM Mono', monospace;
  color: #133932;
}

.alloc-progress-track {
  height: 6px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.alloc-bar {
  height: 100%;
  border-radius: 3px;
}

.alloc-bar-gold {
  background: #cba332;
}

.alloc-bar-sage {
  background: #73984d;
}

.alloc-bar-emerald {
  background: #1a5649;
}

.alloc-item small {
  display: block;
  color: #6a7b72;
  font-size: 11px;
  line-height: 1.4;
}

.card-action-btn {
  width: 100%;
  background: #e3efbf;
  color: #2a491e;
  border: 1px solid #c9dca0;
  padding: 12px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.15s;
}

.card-action-btn:hover {
  background: #d5e5a6;
}

/* ==================== QUOTE BANNER ==================== */
.quote-banner {
  background: #11362e;
  color: #f5f2e8;
  padding: clamp(48px, 7vh, 80px) clamp(24px, 6vw, 96px);
  position: relative;
  overflow: hidden;
}

.quote-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(216, 234, 91, 0.08) 0%, transparent 60%);
}

.quote-inner {
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 2;
}

.quote-mark {
  font: 700 72px 'Playfair Display', serif;
  color: #d8ea5b;
  line-height: 0.8;
  display: block;
  margin-bottom: 12px;
  opacity: 0.9;
}

.quote-banner blockquote {
  margin: 0 0 20px;
  font: 400 clamp(20px, 2.3vw, 28px)/1.45 'Playfair Display', serif;
  color: #faf7ef;
  font-style: italic;
}

.quote-banner cite {
  font: 500 13px 'DM Mono', monospace;
  color: #b7ce94;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.quote-banner cite em {
  font-style: normal;
  color: #d8ea5b;
}

/* ==================== THE 7 CURES SECTION ==================== */
.cures-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: clamp(64px, 10vh, 112px) clamp(24px, 6vw, 84px);
}

.section-head {
  max-width: 720px;
  margin: 0 auto 56px;
}

.text-center {
  text-align: center;
}

.eyebrow {
  margin: 0 0 12px;
  font: 600 11px 'DM Mono', monospace;
  color: #688229;
  letter-spacing: 1.2px;
}

.section-head h2 {
  margin: 0 0 16px;
  color: #103830;
  font: 600 clamp(28px, 3.2vw, 42px)/1.15 'Playfair Display', serif;
}

.section-desc {
  margin: 0;
  color: #55675e;
  font-size: 16px;
  line-height: 1.6;
}

.cures-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.cure-card {
  background: #ffffff;
  border: 1px solid #dbe2d5;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(35, 59, 43, 0.04);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cure-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(35, 59, 43, 0.09);
  border-color: #bccbb5;
}

.cure-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.cure-number {
  font: 600 13px 'DM Mono', monospace;
  color: #728d32;
  background: #f1f6e6;
  padding: 3px 9px;
  border-radius: 4px;
}

.cure-icon-box {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  background: #eaf1dc;
  color: #3b5c28;
  border-radius: 8px;
}

.cure-card h3 {
  margin: 0 0 10px;
  color: #133932;
  font: 600 20px/1.25 'Playfair Display', serif;
}

.cure-ancient {
  margin: 0 0 14px;
  color: #6a7b72;
  font-size: 13px;
  font-style: italic;
  line-height: 1.5;
}

.cure-divider {
  height: 1px;
  background: #e8ede3;
  margin-bottom: 14px;
}

.cure-modern {
  margin: 0;
  color: #384c43;
  font-size: 14px;
  line-height: 1.55;
  margin-top: auto;
}

/* ==================== FEATURES SECTION ==================== */
.features-section {
  background: #eff4e9;
  border-top: 1px solid #dce4d5;
  border-bottom: 1px solid #dce4d5;
  padding: clamp(64px, 10vh, 112px) clamp(24px, 6vw, 84px);
}

.features-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}

.feature-box {
  background: #fffdfa;
  border: 1px solid #dbe3d4;
  border-radius: 12px;
  padding: 32px 28px;
  box-shadow: 0 12px 32px rgba(27, 51, 37, 0.05);
}

.feature-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  background: #143e35;
  color: #d8ea5b;
  border-radius: 10px;
  margin-bottom: 20px;
}

.feature-box h3 {
  margin: 0 0 10px;
  color: #12372f;
  font-size: 18px;
  font-weight: 700;
}

.feature-box p {
  margin: 0;
  color: #55675e;
  font-size: 14px;
  line-height: 1.6;
}

/* ==================== CTA BANNER ==================== */
.cta-banner {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(48px, 8vh, 80px) clamp(20px, 4vw, 40px);
}

.cta-banner-card {
  background: linear-gradient(135deg, #11362e 0%, #0e2b25 60%, #16493f 100%);
  color: #fdfbf5;
  border-radius: 18px;
  padding: clamp(36px, 6vw, 64px) clamp(24px, 5vw, 60px);
  text-align: center;
  box-shadow: 0 24px 60px rgba(14, 43, 37, 0.28);
}

.eyebrow-gold {
  color: #d8ea5b;
}

.cta-banner-card h2 {
  margin: 12px 0 16px;
  font: 600 clamp(28px, 3.4vw, 42px)/1.15 'Playfair Display', serif;
  color: #ffffff;
}

.cta-banner-card p {
  max-width: 580px;
  margin: 0 auto 32px;
  color: #cbdad1;
  font-size: 16px;
  line-height: 1.6;
}

.cta-btn-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
}

.btn-ghost-light {
  background: transparent;
  border: 1px solid #789988;
  color: #f7f5ed;
  padding: 14px 26px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.15s;
}

.btn-ghost-light:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #ffffff;
}

/* ==================== FOOTER ==================== */
.landing-footer {
  background: #09211c;
  color: #a4b7ad;
  padding: 64px clamp(24px, 6vw, 96px) 32px;
  margin-top: auto;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid #1a3831;
}

.footer-brand .brand {
  color: #f2f7f3;
  margin-bottom: 14px;
}

.footer-brand .brand strong {
  color: #ffffff;
}

.footer-brand p {
  margin: 0;
  max-width: 380px;
  font-size: 14px;
  line-height: 1.6;
  color: #879e92;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links strong {
  color: #e5eee8;
  font-size: 14px;
  margin-bottom: 6px;
}

.footer-links a,
.footer-links button {
  color: #879e92;
  text-decoration: none;
  background: transparent;
  border: 0;
  padding: 0;
  text-align: left;
  font-size: 14px;
  transition: color 0.15s;
}

.footer-links a:hover,
.footer-links button:hover {
  color: #d8ea5b;
}

.footer-bottom {
  max-width: 1280px;
  margin: 32px auto 0;
  text-align: center;
  font-size: 13px;
  color: #657b70;
}

/* ==================== FINANCIALS SETUP LAYOUT ==================== */
.setup-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(32px, 5vh, 64px) clamp(16px, 4vw, 32px);
}

.setup-layout {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
}

.form-panel {
  background: #fffdfa;
  border: 1px solid #dce1d6;
  border-radius: 14px;
  padding: clamp(28px, 4vw, 44px);
  box-shadow: 0 20px 50px rgba(35, 59, 43, 0.08);
}

.form-heading {
  border-bottom: 1px solid #e6e8e1;
  padding-bottom: 22px;
}

.form-heading .eyebrow {
  margin-bottom: 8px;
}

.form-heading h2 {
  margin: 0;
  color: #153b34;
  font: 600 28px/1.15 'Playfair Display', serif;
}

.form-heading > p:last-child {
  margin: 10px 0 0;
  color: #748077;
  font-size: 14px;
  line-height: 1.5;
}

.setup-progress {
  display: flex;
  gap: 0;
  margin-bottom: 25px;
}

.setup-progress button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0;
  color: #9aa59b;
  background: transparent;
  border: 0;
  font: 500 11px 'DM Mono', monospace;
}

.setup-progress button:not(:last-child)::after {
  content: '';
  width: 35px;
  height: 1px;
  margin: 0 12px;
  background: #dce1d6;
}

.setup-progress button.active,
.setup-progress button.complete {
  color: #35532d;
}

.setup-progress button.active::before,
.setup-progress button.complete::before {
  background: #d8ea5b;
  border-color: #92a955;
}

.setup-progress button::before {
  content: '';
  position: absolute;
  width: 19px;
  height: 19px;
  left: -4px;
  background: #fffdfa;
  border: 1px solid #dce1d6;
  border-radius: 50%;
  z-index: -1;
}

.setup-progress button:hover {
  color: #1c473c;
}

.setup-progress button small {
  margin-left: 4px;
  font: inherit;
  text-transform: uppercase;
  letter-spacing: .4px;
}

.field-group {
  margin-top: 26px;
}

.field-group > label,
.field-header label {
  display: block;
  color: #263d34;
  font-size: 14px;
  font-weight: 700;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.field-header span {
  color: #6c7a70;
  font: 11px 'DM Mono', monospace;
}

/* Income Section */
.income-section {
  padding-top: 2px;
}

.income-list {
  margin-bottom: 12px;
  border: 1px solid #dfe4db;
  border-radius: 6px;
  overflow: hidden;
}

.income-row {
  min-height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 12px;
  border-bottom: 1px solid #e6e8e2;
  background: #ffffff;
}

.income-row:last-child {
  border-bottom: 0;
}

.income-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  color: #315f54;
  background: #dceee7;
  border-radius: 4px;
}

.income-details {
  min-width: 0;
}

.income-details strong,
.income-details small {
  display: block;
}

.income-details strong {
  display: flex;
  align-items: baseline;
  gap: 9px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.income-details em {
  color: #426439;
  font: 500 11px 'DM Mono', monospace;
  font-style: normal;
  white-space: nowrap;
}

.income-details small {
  margin-top: 3px;
  color: #77847c;
  font: 10px 'DM Mono', monospace;
}

.income-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 9px;
  padding: 15px;
  border: 1px solid #dfe4db;
  border-radius: 6px;
  background: #fafbf6;
}

.income-form > * {
  min-width: 0;
}

.income-form > input {
  grid-column: 1 / -1;
  width: 100%;
  min-width: 0;
  height: 43px;
  color: #233b32;
  border: 1px solid #dfe4db;
  border-radius: 4px;
  padding: 0 12px;
  outline-color: #77913a;
}

.income-form > input::placeholder {
  color: #98a29a;
}

.take-home-field {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  height: 43px;
  padding: 0 12px;
  color: #5d6b63;
  background: #fffdfa;
  border: 1px solid #dfe4db;
  border-radius: 4px;
  font-size: 12px;
}

.take-home-field span {
  white-space: nowrap;
}

.take-home-field::before {
  content: '$';
  margin-right: 5px;
  color: #496246;
  font-weight: 700;
}

.take-home-field input {
  min-width: 0;
  width: 100%;
  height: 39px;
  color: #233b32;
  border: 0;
  background: transparent;
  outline: 0;
}

.take-home-field input::placeholder {
  color: #98a29a;
}

.select-field,
.date-field {
  height: 43px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  color: #5d6b63;
  background: #fffdfa;
  border: 1px solid #dfe4db;
  border-radius: 4px;
  font-size: 12px;
}

.select-field span,
.date-field span {
  white-space: nowrap;
}

.select-field select,
.date-field input {
  min-width: 0;
  margin-left: auto;
  color: #254137;
  border: 0;
  background: transparent;
  font-size: 12px;
  outline: 0;
}

.date-field input {
  width: 120px;
}

.income-type {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 2px 4px;
  border: 0;
}

.income-type legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.income-type label {
  color: #56665d;
  font-size: 12px;
}

.income-type input {
  width: auto;
  height: auto;
  margin: 0 3px 0 0;
  accent-color: #54713c;
}

.add-income-button {
  grid-column: 1 / -1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 43px;
  color: #34512b;
  background: #e2edbd;
  border: 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
}

.add-income-button:hover {
  background: #d4e49d;
}

.cancel-edit-button {
  grid-column: 1 / -1;
  height: 36px;
  color: #68776f;
  background: transparent;
  border: 0;
  font-size: 12px;
  font-weight: 700;
}

.cancel-edit-button:hover {
  color: #9e3f30;
}

/* Bills Section */
.bills-section {
  padding-top: 2px;
}

.bill-list {
  margin-bottom: 12px;
  border: 1px solid #dfe4db;
  border-radius: 6px;
  overflow: hidden;
}

.bill-row {
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 12px;
  border-bottom: 1px solid #e6e8e2;
  background: #ffffff;
}

.bill-row:last-child {
  border-bottom: 0;
}

.bill-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  color: #496246;
  background: #e8f0d8;
  border-radius: 4px;
}

.bill-details {
  min-width: 0;
}

.bill-details strong,
.bill-details small {
  display: block;
}

.bill-details strong {
  display: flex;
  align-items: baseline;
  gap: 9px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.bill-details em {
  color: #426439;
  font: 500 11px 'DM Mono', monospace;
  font-style: normal;
  white-space: nowrap;
}

.bill-details small {
  margin-top: 3px;
  color: #77847c;
  font: 10px 'DM Mono', monospace;
}

.payment-link {
  color: #46613c;
  display: grid;
  place-items: center;
  padding: 7px;
  border-radius: 4px;
}

.payment-link:hover {
  background: #e8f0d8;
}

.bill-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  padding: 15px;
  border: 1px solid #dfe4db;
  border-radius: 6px;
  background: #fafbf6;
}

.bill-form input {
  width: 100%;
  min-width: 0;
  height: 43px;
  color: #233b32;
  border: 1px solid #dfe4db;
  border-radius: 4px;
  padding: 0 12px;
  outline-color: #77913a;
}

.bill-form input::placeholder {
  color: #98a29a;
}

.bill-amount-field {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  height: 43px;
  padding: 0 12px;
  color: #5d6b63;
  background: #fffdfa;
  border: 1px solid #dfe4db;
  border-radius: 4px;
  font-size: 12px;
}

.bill-amount-field span {
  white-space: nowrap;
}

.bill-amount-field::before {
  content: '$';
  margin-right: 5px;
  color: #496246;
  font-weight: 700;
}

.bill-amount-field input {
  min-width: 0;
  width: 100%;
  height: 39px;
  color: #233b32;
  border: 0;
  background: transparent;
  outline: 0;
}

.bill-amount-field input::placeholder {
  color: #98a29a;
}

.compact-field {
  grid-column: 1;
  height: 43px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 10px;
  color: #5d6b63;
  background: #fffdfa;
  border: 1px solid #dfe4db;
  border-radius: 4px;
  font-size: 12px;
}

.compact-field span {
  white-space: nowrap;
}

.compact-field select {
  min-width: 0;
  margin-left: auto;
  color: #254137;
  border: 0;
  background: transparent;
  font-size: 12px;
  outline: 0;
}

.payment-method {
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  min-width: 0;
  margin: 0;
  padding: 0 4px;
  border: 0;
}

.payment-method legend {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.payment-method label {
  white-space: nowrap;
  color: #56665d;
  font-size: 11px;
}

.payment-method input {
  width: auto;
  height: auto;
  margin: 0 3px 0 0;
  accent-color: #54713c;
}

.add-bill-button {
  grid-column: 1 / -1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: 43px;
  color: #34512b;
  background: #e2edbd;
  border: 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
}

.add-bill-button:hover {
  background: #d4e49d;
}

/* Category Section */
.category-list {
  border: 1px solid #dfe4db;
  border-bottom: 0;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}

.category-row {
  height: 46px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 8px 0 15px;
  border-bottom: 1px solid #e6e8e2;
  background: #ffffff;
  font-size: 14px;
}

.category-dot {
  height: 7px;
  width: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: #a4c44a;
}

.icon-button {
  margin-left: auto;
  color: #829087;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  padding: 7px;
  border-radius: 4px;
}

.icon-button:hover {
  color: #9e3f30;
  background: #f9edeb;
}

.add-category {
  display: flex;
  border: 1px solid #dfe4db;
  border-radius: 0 0 6px 6px;
  height: 47px;
  background: #fafbf6;
}

.add-category input {
  width: 100%;
  min-width: 0;
  color: #233b32;
  border: 0;
  padding: 0 14px;
  outline-color: #77913a;
  background: transparent;
}

.add-category input::placeholder {
  color: #98a29a;
}

.add-category button {
  width: 48px;
  border: 0;
  background: #e2edbd;
  color: #36542c;
  display: grid;
  place-items: center;
}

.add-category button:hover {
  background: #d4e49d;
}

/* Footer Navigation inside Setup */
.form-footer {
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.form-footer p {
  margin: 0;
  color: #7c8880;
  font-size: 12px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 0;
  color: #53645b;
  border: 0;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
}

.back-button:disabled {
  visibility: hidden;
}

.continue-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  padding: 0 24px;
  color: #ffffff;
  background: #153e35;
  border: 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 700;
  transition: background 0.15s ease;
}

.continue-button:hover:not(:disabled) {
  background: #0f2d26;
}

.continue-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== AUTH MODAL ==================== */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(14, 38, 32, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.auth-modal {
  background: #fffdf9;
  border: 1px solid #dce2d6;
  border-radius: 16px;
  padding: clamp(24px, 3.5vw, 36px);
  max-width: 440px;
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow: 0 28px 70px rgba(11, 33, 27, 0.35);
  position: relative;
  margin: auto;
  animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(12px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: transparent;
  border: 0;
  color: #7b8c82;
  padding: 6px;
  border-radius: 6px;
  display: grid;
  place-items: center;
}

.modal-close-btn:hover {
  background: #eef3e8;
  color: #12372f;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-seal {
  width: 48px;
  height: 48px;
  display: inline-grid;
  place-items: center;
  background: #e2edbd;
  color: #2b4920;
  border-radius: 50%;
  margin-bottom: 12px;
}

.auth-header h2 {
  margin: 0 0 8px;
  color: #113830;
  font: 600 24px 'Playfair Display', serif;
}

.auth-header p {
  margin: 0;
  color: #64756c;
  font-size: 13px;
  line-height: 1.45;
}

.auth-tabs {
  display: flex;
  background: #edf2e6;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 22px;
}

.auth-tab {
  flex: 1;
  background: transparent;
  border: 0;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #617369;
  transition: all 0.15s;
}

.auth-tab.active {
  background: #ffffff;
  color: #12372f;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.auth-error-banner {
  background: #fdf0ee;
  color: #a43125;
  border: 1px solid #f2c7c2;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 16px;
  line-height: 1.4;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field span {
  font-size: 12px;
  font-weight: 600;
  color: #2c473e;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #d4dcce;
  border-radius: 6px;
  padding: 0 12px;
  height: 42px;
  color: #6a7c72;
}

.input-wrap input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: 0;
  color: #1a3830;
  font-size: 14px;
}

.input-wrap input::placeholder {
  color: #9aa79f;
}

.input-wrap:focus-within {
  border-color: #55793a;
  box-shadow: 0 0 0 3px rgba(115, 139, 54, 0.15);
  color: #3b5f25;
}

.btn-gold-block {
  width: 100%;
  background: #143e35;
  color: #f7f5ee;
  border: 0;
  padding: 13px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(20, 62, 53, 0.22);
  margin-top: 4px;
  transition: all 0.15s ease;
}

.btn-gold-block:hover {
  background: #0d2a24;
}

.auth-divider {
  display: flex;
  align-items: center;
  margin: 18px 0;
  text-align: center;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e6da;
}

.auth-divider span {
  padding: 0 10px;
  color: #92a097;
  font: 500 11px 'DM Mono', monospace;
}

.btn-guest {
  width: 100%;
  background: #eef4e6;
  color: #345229;
  border: 1px solid #d2dfc3;
  padding: 11px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.btn-guest:hover {
  background: #e2edd4;
}

/* ==================== RESPONSIVE BREAKPOINTS ==================== */
@media (max-width: 960px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-top: 40px;
  }
  .footer-content {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .setup-layout {
    padding: 16px 0 32px;
  }
  .form-panel {
    padding: 24px 18px;
  }
}

@media (max-width: 590px) {
  .hero-cta-group {
    flex-direction: column;
    width: 100%;
  }
  .btn-gold-large,
  .btn-secondary-large {
    width: 100%;
    justify-content: center;
  }
  .setup-progress button:not(:last-child)::after {
    width: 13px;
    margin: 0 7px;
  }
  .setup-progress button small {
    display: none;
  }
  .income-form {
    grid-template-columns: 1fr;
  }
  .select-field,
  .date-field,
  .income-type {
    grid-column: 1;
  }
  .date-field input {
    width: 100%;
  }
  .bill-form {
    grid-template-columns: 1fr;
  }
  .compact-field,
  .payment-method {
    grid-column: 1;
  }
  .payment-method {
    justify-content: flex-start;
    min-height: 35px;
  }
  .form-footer {
    align-items: flex-start;
    flex-direction: column-reverse;
  }
  .continue-button {
    width: 100%;
    justify-content: center;
  }
  .form-footer p {
    text-align: center;
    width: 100%;
  }
}
`;

fs.writeFileSync(cssPath, stylesContent, 'utf-8');
console.log('Successfully updated src/styles.css');
