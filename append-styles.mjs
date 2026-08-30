import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cssPath = path.join(__dirname, 'src', 'styles.css');

const extraStyles = `
/* ==================== HOME / COMMAND CENTER ==================== */
.home-topbar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-left: 24px;
}

.home-nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-ghost-sm {
  background: transparent;
  border: 1px solid #c8cfc2;
  color: #27473e;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;
}

.btn-ghost-sm:hover {
  background: #e7eedf;
  border-color: #a8b8a0;
}

.home-dashboard {
  flex: 1;
  padding: clamp(32px, 5vh, 64px) clamp(20px, 5vw, 84px);
}

.home-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.home-welcome-header {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-meta {
  max-width: 760px;
}

.home-eyebrow {
  display: inline-block;
  font: 600 11px 'DM Mono', monospace;
  color: #6d8430;
  letter-spacing: 1.2px;
  margin-bottom: 6px;
}

.welcome-meta h1 {
  margin: 0 0 10px;
  color: #103830;
  font: 600 clamp(30px, 3.4vw, 44px)/1.15 'Playfair Display', serif;
}

.welcome-subtext {
  margin: 0;
  color: #55675e;
  font-size: 15px;
  line-height: 1.55;
}

/* Quick stats strip */
.quick-stats-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fffdfa;
  border: 1px solid #dce2d6;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 8px 24px rgba(27, 51, 37, 0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font: 500 11px 'DM Mono', monospace;
  color: #6f7f76;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-val {
  font: 600 22px 'DM Mono', monospace;
  color: #12372f;
}

.text-bills {
  color: #8c4135;
}

.text-gold {
  color: #886716;
}

.text-cushion {
  color: #2e6b3b;
}

.stat-gold {
  background: #fdfbf2;
  border-color: #f1e7be;
}

.stat-cushion {
  background: #f3f8f0;
  border-color: #d6e5cc;
}

/* Action Hub Section */
.action-hub-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.action-hub-header h2 {
  margin: 0 0 4px;
  color: #113830;
  font: 600 24px 'Playfair Display', serif;
}

.action-hub-header p {
  margin: 0;
  color: #61736a;
  font-size: 14px;
}

.action-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  gap: 20px;
}

.action-card {
  background: #ffffff;
  border: 1px solid #dbe3d4;
  border-radius: 14px;
  padding: 26px 24px;
  box-shadow: 0 10px 28px rgba(35, 59, 43, 0.05);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.action-card-bills::before {
  background: #e88674;
}

.action-card-expenses::before {
  background: #75a45b;
}

.action-card-budgets::before {
  background: #cba332;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgba(35, 59, 43, 0.12);
  border-color: #b7c7ae;
}

.action-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.action-icon-box {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 10px;
}

.icon-bills {
  background: #faece9;
  color: #a43825;
}

.icon-expenses {
  background: #eaf3e2;
  color: #386b24;
}

.icon-budgets {
  background: #fdf5d8;
  color: #7d6013;
}

.action-step-badge {
  font: 600 11px 'DM Mono', monospace;
  background: #edf2e6;
  color: #4b6241;
  padding: 3px 8px;
  border-radius: 4px;
}

.action-card h3 {
  margin: 0 0 8px;
  color: #12372f;
  font-size: 19px;
  font-weight: 700;
}

.action-card p {
  margin: 0 0 18px;
  color: #55675e;
  font-size: 13.5px;
  line-height: 1.55;
  flex: 1;
}

.action-card-footer {
  font-size: 13px;
  font-weight: 700;
  color: #133c34;
}

/* Master Records Table Section */
.master-records-section {
  background: #fffdfa;
  border: 1px solid #dce2d6;
  border-radius: 14px;
  padding: clamp(24px, 3.5vw, 36px);
  box-shadow: 0 14px 40px rgba(35, 59, 43, 0.06);
}

.master-table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e7ece1;
}

.table-eyebrow {
  display: block;
  font: 600 11px 'DM Mono', monospace;
  color: #6f8634;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.master-table-header h2 {
  margin: 0 0 6px;
  color: #123932;
  font: 600 24px 'Playfair Display', serif;
}

.master-table-header p {
  margin: 0;
  color: #5f7067;
  font-size: 13.5px;
  max-width: 620px;
}

.table-tab-switches {
  display: flex;
  background: #edf3e6;
  border-radius: 8px;
  padding: 4px;
  gap: 4px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #55685d;
  transition: all 0.15s;
}

.tab-btn.active {
  background: #ffffff;
  color: #12372f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Data Table Styling */
.table-wrapper {
  overflow-x: auto;
}

.master-data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.master-data-table th {
  padding: 12px 14px;
  font: 600 11.5px 'DM Mono', monospace;
  color: #63756b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  border-bottom: 1px solid #dfe5d9;
  background: #f7f9f3;
}

.master-data-table td {
  padding: 14px;
  border-bottom: 1px solid #e9eee4;
  font-size: 13.5px;
  color: #243c33;
  vertical-align: middle;
}

.master-data-table tr:hover:not(.editing-row) {
  background: #fafcf7;
}

.master-data-table tr.editing-row {
  background: #fcfaf0;
}

.bill-title-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.table-bill-icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  background: #eaf2dc;
  color: #426330;
  border-radius: 6px;
  flex: 0 0 30px;
}

.icon-income-bg {
  background: #e2f0ea;
  color: #23584c;
}

.table-amount-badge {
  font: 600 14px 'DM Mono', monospace;
  color: #1a3e36;
}

.table-due-badge {
  font: 500 12.5px 'DM Mono', monospace;
  color: #55695f;
  background: #f0f4ea;
  padding: 3px 8px;
  border-radius: 4px;
}

.status-pill {
  font: 600 11px 'DM Mono', monospace;
  padding: 3px 8px;
  border-radius: 999px;
  display: inline-block;
}

.pill-autopay {
  background: #e5f3e0;
  color: #2d6b20;
  border: 1px solid #c2e2b9;
}

.pill-manual {
  background: #f2f5ed;
  color: #5b6e63;
  border: 1px solid #dce2d6;
}

.table-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #3b6b47;
  text-decoration: none;
  font-weight: 600;
  font-size: 12.5px;
}

.table-link:hover {
  text-decoration: underline;
}

.text-muted-dash {
  color: #a4b2a8;
}

.table-row-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-edit-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid #d1dbcc;
  color: #355348;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
}

.btn-edit-row:hover {
  background: #eef4e8;
}

.btn-delete-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid #f2cfca;
  color: #a43224;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
}

.btn-delete-row:hover {
  background: #fdf1ef;
}

.btn-save-row {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #143e35;
  border: 0;
  color: #ffffff;
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 700;
}

.btn-save-row:hover {
  background: #0f2d26;
}

.btn-cancel-row {
  background: transparent;
  border: 1px solid #d0d7cc;
  color: #63756c;
  padding: 5px 7px;
  border-radius: 5px;
  display: grid;
  place-items: center;
}

.table-input, .table-select {
  width: 100%;
  height: 34px;
  padding: 0 8px;
  border: 1px solid #cbd5c5;
  border-radius: 4px;
  font-size: 13px;
  background: #ffffff;
  outline-color: #688229;
}

.table-amount-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Quick add footer */
.quick-add-footer {
  margin-top: 24px;
  padding: 18px 20px;
  background: #f7f9f3;
  border: 1px dashed #ced8c5;
  border-radius: 8px;
}

.quick-add-footer h4 {
  margin: 0 0 12px;
  color: #27453c;
  font-size: 13.5px;
}

.quick-bill-form {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr auto;
  gap: 8px;
}

.quick-bill-form input, .quick-bill-form select {
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d4dece;
  border-radius: 5px;
  font-size: 13px;
  background: #ffffff;
}

.btn-add-quick {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e3efbe;
  color: #2d4b21;
  border: 1px solid #c8dca0;
  padding: 0 16px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.btn-add-quick:hover {
  background: #d4e4aa;
}

/* Categories directory display */
.categories-directory {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
}

.categories-grid-display {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.category-card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #ffffff;
  border: 1px solid #dfe5d8;
  border-radius: 8px;
}

.cat-card-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cat-bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a4c44a;
}

.cat-delete-btn {
  background: transparent;
  border: 0;
  color: #92a297;
  padding: 4px;
  display: grid;
  place-items: center;
  border-radius: 4px;
}

.cat-delete-btn:hover {
  color: #a43224;
  background: #fdf1ef;
}

.quick-add-category-bar {
  padding: 16px;
  background: #f8faf4;
  border: 1px dashed #d4ded0;
  border-radius: 8px;
}

.quick-cat-form {
  display: flex;
  gap: 10px;
}

.quick-cat-form input {
  flex: 1;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #d4dcce;
  border-radius: 6px;
  font-size: 13.5px;
}

.btn-edit-financials-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 0;
  color: #274c3e;
  font-size: 13.5px;
  font-weight: 700;
  padding: 0;
}

.btn-edit-financials-link:hover {
  text-decoration: underline;
}

/* ==================== FEATURE ACTION MODALS ==================== */
.feature-action-modal {
  background: #fffdf9;
  border: 1px solid #dce2d6;
  border-radius: 16px;
  padding: clamp(24px, 4vw, 36px);
  max-width: 580px;
  width: 100%;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow: 0 28px 70px rgba(11, 33, 27, 0.35);
  position: relative;
  margin: auto;
}

.feature-modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e7ece2;
}

.feature-modal-header h2 {
  margin: 0 0 4px;
  color: #123932;
  font: 600 22px 'Playfair Display', serif;
}

.feature-modal-header p {
  margin: 0;
  color: #64756c;
  font-size: 13.5px;
}

.modal-bills-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  max-height: 320px;
  overflow-y: auto;
}

.modal-bill-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #f7f9f3;
  border: 1px solid #dfe5d8;
  border-radius: 8px;
}

.modal-bill-info strong {
  display: block;
  color: #143e35;
  font-size: 14px;
}

.modal-bill-meta {
  font: 500 11.5px 'DM Mono', monospace;
  color: #65776d;
}

.btn-pay-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #143e35;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
}

.btn-pay-link:hover {
  background: #0d2c25;
}

.no-link-badge {
  font: 500 11px 'DM Mono', monospace;
  color: #92a097;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
}

.code-expenses-preview {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.category-pill-tray .tray-label {
  display: block;
  font: 600 11.5px 'DM Mono', monospace;
  color: #657a6e;
  margin-bottom: 8px;
}

.pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-chip {
  background: #eaf1de;
  color: #355328;
  border: 1px solid #cbdbb8;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
}

.reconciliation-tip-box {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #fdf9e8;
  border: 1px solid #eedfae;
  border-radius: 8px;
  color: #634e15;
  font-size: 13px;
  line-height: 1.5;
}

.reconciliation-tip-box svg {
  flex: 0 0 18px;
  margin-top: 2px;
}

.budget-breakdown-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.breakdown-card {
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
}

.card-gold {
  background: #fcf9ec;
  border-color: #f1e7be;
}

.card-bills {
  background: #faece9;
  border-color: #f3cdc7;
}

.card-living {
  background: #edf5f0;
  border-color: #d1e5db;
}

.breakdown-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.breakdown-head span {
  font: 600 12px 'DM Mono', monospace;
  color: #3e5047;
}

.breakdown-head strong {
  font: 600 16px 'DM Mono', monospace;
  color: #12372f;
}

.breakdown-card p {
  margin: 0;
  font-size: 12px;
  color: #66756d;
}

@media (max-width: 860px) {
  .home-topbar-nav {
    margin-left: 12px;
  }
  .home-nav-links {
    display: none;
  }
  .quick-bill-form {
    grid-template-columns: 1fr;
  }
}
`;

fs.appendFileSync(cssPath, extraStyles, 'utf-8');
console.log('Appended dashboard styles to styles.css');
