import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, 'src', 'styles.css');

const styles = `
/* ==================== EXPANDED MODALS & SPLIT TABLES ==================== */
.modal-large {
  max-width: 1060px;
  width: 95%;
}

.pay-bills-split-view {
  display: flex;
  flex-direction: column;
  gap: 28px;
  margin-bottom: 24px;
}

.pay-bills-section-card {
  background: #ffffff;
  border: 1px solid #dce4d6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(35, 59, 43, 0.04);
}

.urgent-card {
  border-left: 4px solid #d96f5b;
}

.upcoming-card {
  border-left: 4px solid #648a56;
}

.split-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9eee4;
}

.split-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.split-title-wrap h3 {
  margin: 0;
  color: #12372f;
  font: 600 17px/1.2 'Playfair Display', serif;
}

.split-pill {
  font: 600 11px 'DM Mono', monospace;
  padding: 3px 8px;
  border-radius: 4px;
}

.pill-urgent {
  background: #faece9;
  color: #a43825;
  border: 1px solid #f2c7c2;
}

.pill-upcoming {
  background: #eef5e9;
  color: #355e28;
  border: 1px solid #cadbc0;
}

.split-subtotal {
  font-size: 13px;
  color: #617369;
}

.split-subtotal strong {
  font: 600 15px 'DM Mono', monospace;
  color: #12372f;
}

.empty-split-state {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f7f9f3;
  border-radius: 6px;
  color: #55685d;
  font-size: 13.5px;
}

.table-responsive-wrapper {
  overflow-x: auto;
}

.split-pay-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.split-pay-table th {
  padding: 10px 12px;
  font: 600 11px 'DM Mono', monospace;
  color: #64756b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #dfe5d8;
  background: #f7f9f3;
}

.split-pay-table td {
  padding: 12px;
  border-bottom: 1px solid #ebf0e6;
  font-size: 13px;
  color: #233c33;
  vertical-align: middle;
}

.split-pay-table tr:hover {
  background: #fafbf7;
}

.paid-row {
  background: #f4f8f1 !important;
  opacity: 0.85;
}

.paid-row strong {
  text-decoration: line-through;
  color: #6d8076;
}

.pay-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #153e35;
  cursor: pointer;
}

.table-method-tag {
  display: block;
  font: 10px 'DM Mono', monospace;
  color: #72847a;
  margin-top: 2px;
}

.text-muted-amount {
  font: 500 13px 'DM Mono', monospace;
  color: #6a7c72;
}

.actual-amt-input-wrap {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #ffffff;
  border: 1px solid #c9d5c4;
  border-radius: 5px;
  padding: 0 8px;
  height: 34px;
}

.actual-amt-input-wrap span {
  font: 600 13px 'DM Mono', monospace;
  color: #3e5a4d;
}

.actual-amt-input-wrap input {
  width: 84px;
  border: 0;
  background: transparent;
  outline: 0;
  font: 600 13px 'DM Mono', monospace;
  color: #12372f;
}

.conf-code-input {
  height: 34px;
  padding: 0 10px;
  border: 1px solid #cdd8c8;
  border-radius: 5px;
  font: 12px 'DM Mono', monospace;
  color: #223c34;
  background: #ffffff;
  width: 140px;
}

.conf-code-input::placeholder {
  color: #9ba89f;
  font-size: 11px;
}

/* ==================== EXPENSE CODING MATRIX TABLE ==================== */
.expense-coding-matrix-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.expense-matrix-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.expense-matrix-table th {
  padding: 10px 12px;
  font: 600 11px 'DM Mono', monospace;
  color: #63756b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #dfe5d8;
  background: #f7f9f3;
  vertical-align: top;
}

.cat-th-head {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cat-th-head span {
  font-weight: 700;
  color: #1c3d34;
}

.cat-th-head small {
  font-size: 10px;
  color: #72847a;
}

.expense-matrix-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #ebf0e6;
  font-size: 13px;
  color: #233c33;
  vertical-align: middle;
}

.expense-matrix-table tr:hover {
  background: #fafcf7;
}

.matrix-date-input {
  height: 34px;
  padding: 0 6px;
  border: 1px solid #cbd5c5;
  border-radius: 4px;
  font: 12px 'DM Mono', monospace;
  background: #ffffff;
  color: #243c33;
}

.matrix-desc-input {
  width: 100%;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #cbd5c5;
  border-radius: 4px;
  font-size: 13px;
  background: #ffffff;
  color: #243c33;
}

.matrix-amt-wrap {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: #ffffff;
  border: 1px solid #cbd5c5;
  border-radius: 4px;
  padding: 0 6px;
  height: 34px;
}

.matrix-amt-wrap span {
  font: 600 12px 'DM Mono', monospace;
  color: #48663b;
}

.matrix-amt-wrap input {
  width: 76px;
  border: 0;
  background: transparent;
  outline: 0;
  text-align: right;
  font: 600 12.5px 'DM Mono', monospace;
  color: #12372f;
}

.matrix-row-total {
  font: 600 13.5px 'DM Mono', monospace;
  color: #12372f;
}

.matrix-summary-row td {
  background: #eef4e7;
  border-top: 2px solid #cbd8c3;
  border-bottom: 0;
  padding: 14px 12px;
}

.matrix-foot-total {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.text-good-budget {
  color: #285920;
  font: 700 13.5px 'DM Mono', monospace;
}

.text-over-budget {
  color: #a43224;
  font: 700 13.5px 'DM Mono', monospace;
}

.budget-target-hint {
  font: 10px 'DM Mono', monospace;
  color: #687b70;
}

.matrix-grand-total {
  font: 700 15px 'DM Mono', monospace;
  color: #12372f;
}

.add-matrix-item-bar {
  background: #f7f9f3;
  border: 1px dashed #ced8c5;
  border-radius: 8px;
  padding: 18px 20px;
}

.add-matrix-item-bar h4 {
  margin: 0 0 12px;
  color: #243f36;
  font-size: 13.5px;
}

.add-expense-line-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.add-expense-line-form > input[type="date"],
.add-expense-line-form > input[type="text"] {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #cbd5c5;
  border-radius: 6px;
  font-size: 13.5px;
  background: #ffffff;
}

.multi-cat-input-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.mini-cat-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-cat-field label {
  font: 600 11px 'DM Mono', monospace;
  color: #53695c;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-input-wrap {
  display: flex;
  align-items: center;
  gap: 3px;
  background: #ffffff;
  border: 1px solid #cbd5c5;
  border-radius: 5px;
  padding: 0 8px;
  height: 34px;
}

.mini-input-wrap span {
  font: 600 12px 'DM Mono', monospace;
  color: #55793a;
}

.mini-input-wrap input {
  width: 100%;
  border: 0;
  background: transparent;
  outline: 0;
  font: 600 12.5px 'DM Mono', monospace;
  color: #163d34;
}

@media (max-width: 768px) {
  .modal-large {
    width: 100%;
    padding: 18px;
  }
  .split-section-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

fs.appendFileSync(cssPath, styles, 'utf-8');
console.log('Appended split-table and matrix styles to styles.css');
