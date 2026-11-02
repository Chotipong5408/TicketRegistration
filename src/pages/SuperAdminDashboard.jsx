import { useMemo, useState } from "react";
import "./SuperAdminDashboard.css";

/* =====================================================================
   1) ดึงข้อมูลจาก LocalStorage
   TODO: เปลี่ยนชื่อ key และชื่อ field ให้ตรงกับที่โปรเจกต์ของคุณเก็บจริง
   (แนะนำให้ย้ายไปไว้ใน src/services/adminService.js ภายหลัง)
   ===================================================================== */
const KEYS = {
  users: "users",           // ผู้ลงทะเบียน
  tickets: "tickets",       // บัตร: { status: 'pending'|'approved'|'rejected', price, checkedIn }
  shirts: "shirtOrders",    // ออเดอร์เสื้อ: { price, paid }
  shops: "shops",           // ร้านค้า: { tokenSales }
  tokens: "tokenLogs",      // ประวัติ token: { type: 'bonus'|'topup'|'spent', amount }
};

function readLS(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const sum = (list, pick) => list.reduce((total, item) => total + (Number(pick(item)) || 0), 0);

function calcStats() {
  const users = readLS(KEYS.users);
  const tickets = readLS(KEYS.tickets);
  const shirts = readLS(KEYS.shirts);
  const shops = readLS(KEYS.shops);
  const tokens = readLS(KEYS.tokens);

  const approved = tickets.filter((t) => t.status === "approved");
  const ticketRevenue = sum(approved, (t) => t.price);
  const shirtRevenue = sum(shirts.filter((s) => s.paid), (s) => s.price);

  const tokenSum = (type) => sum(tokens.filter((t) => t.type === type), (t) => t.amount);

  return {
    users: users.length,
    ticketsSold: tickets.length,
    approved: approved.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    rejected: tickets.filter((t) => t.status === "rejected").length,
    attendees: tickets.filter((t) => t.checkedIn).length,
    unused: approved.filter((t) => !t.checkedIn).length,
    ticketRevenue,
    shirtRevenue,
    totalRevenue: ticketRevenue + shirtRevenue,
    bonusTokens: tokenSum("bonus"),
    topupTokens: tokenSum("topup"),
    spentTokens: tokenSum("spent"),
    shops: shops.length,
    shopSales: sum(shops, (s) => s.tokenSales),
  };
}

/* =====================================================================
   2) ไอคอน SVG แบบเส้น (ไม่ต้องติดตั้งไลบรารี)
   ภายหลังจะเปลี่ยนไปใช้ lucide-react ก็ได้ ชื่อไอคอนใกล้เคียงกัน
   ===================================================================== */
const ICONS = {
  shield: (
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  ),
  refresh: (
    <>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  ticket: (
    <>
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </>
  ),
  checkCircle: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </>
  ),
  xCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </>
  ),
  shirt: (
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  ),
  bank: (
    <>
      <line x1="3" x2="21" y1="22" y2="22" />
      <line x1="6" x2="6" y1="18" y2="11" />
      <line x1="10" x2="10" y1="18" y2="11" />
      <line x1="14" x2="14" y1="18" y2="11" />
      <line x1="18" x2="18" y1="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </>
  ),
  banknote: (
    <>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  plusCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </>
  ),
  cart: (
    <>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </>
  ),
  store: (
    <>
      <path d="M3 9l1-5h16l1 5" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M5 12v8h14v-8" />
    </>
  ),
  trendingUp: (
    <>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </>
  ),
  logIn: (
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 17 15 12 10 7" />
      <line x1="15" x2="3" y1="12" y2="12" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* =====================================================================
   3) ส่วนประกอบย่อย (ภายหลังแยกไป src/components/ ได้)
   ===================================================================== */
const baht = (n) => `฿${n.toLocaleString()}`;
const token = (n) => `${n.toLocaleString()} Token`;
const count = (n) => n.toLocaleString();

function StatCard({ icon, tone, label, value, hint }) {
  return (
    <div className="sad-card">
      <div className={`sad-icon tone-${tone}`}>
        <Icon name={icon} />
      </div>
      <div>
        <div className="sad-card-label">{label}</div>
        <div className="sad-card-value">{value}</div>
        {hint && <div className="sad-card-hint">{hint}</div>}
      </div>
    </div>
  );
}

function Section({ title, note, children }) {
  return (
    <section className="sad-section">
      <h2 className="sad-section-title">
        {title}
        {note && <small>{note}</small>}
      </h2>
      <div className="sad-grid">{children}</div>
    </section>
  );
}

/* =====================================================================
   4) หน้าหลัก
   ===================================================================== */
export default function SuperAdminDashboard() {
  const [version, setVersion] = useState(0); // ใช้กดรีเฟรชข้อมูล
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const s = useMemo(() => calcStats(), [version]);

  return (
    <div className="sad-page">
      <div className="sad-container">
        {/* Banner */}
        <header className="sad-banner">
          <div className="sad-banner-left">
            <div className="sad-banner-icon">
              <Icon name="shield" />
            </div>
            <div>
              <h1>Super Admin Dashboard</h1>
              <p>ตัวเลขคำนวณจาก LocalStorage จริง แยกรายได้ธนาคารออกจากยอด Token ในร้าน</p>
            </div>
          </div>
          <div className="sad-banner-right">
            <span className="sad-badge">งานเลี้ยงรุ่นศิษย์เก่า 2026</span>
            <button className="sad-refresh" onClick={() => setVersion((v) => v + 1)}>
              <Icon name="refresh" />
              รีเฟรช
            </button>
          </div>
        </header>

        {/* รายได้รวม */}
        <div className="sad-highlight">
          <div className="sad-highlight-main">
            <div className="sad-icon tone-blue">
              <Icon name="bank" />
            </div>
            <div>
              <div className="sad-highlight-label">รายได้รวมผ่านธนาคาร</div>
              <div className="sad-highlight-value">{baht(s.totalRevenue)}</div>
            </div>
          </div>
          <div className="sad-highlight-note">
            <div>บัตร {baht(s.ticketRevenue)}</div>
            <div>เสื้อ {baht(s.shirtRevenue)}</div>
          </div>
        </div>

        <Section title="ผู้ลงทะเบียนและบัตร" note="สถานะการลงทะเบียนทั้งหมด">
          <StatCard icon="users" tone="blue" label="ผู้ลงทะเบียน" value={count(s.users)} />
          <StatCard icon="ticket" tone="purple" label="บัตรที่ขาย (รวมรอชำระ)" value={count(s.ticketsSold)} />
          <StatCard icon="checkCircle" tone="green" label="บัตรที่อนุมัติแล้ว" value={count(s.approved)} />
          <StatCard icon="clock" tone="amber" label="รอตรวจสอบ" value={count(s.pending)} />
          <StatCard icon="xCircle" tone="red" label="ถูกปฏิเสธ" value={count(s.rejected)} />
        </Section>

        <Section title="รายได้ผ่านธนาคาร" note="ไม่รวม Token">
          <StatCard icon="ticket" tone="blue" label="รายได้บัตร (ธนาคาร)" value={baht(s.ticketRevenue)} />
          <StatCard icon="shirt" tone="pink" label="รายได้เสื้อ (ธนาคาร)" value={baht(s.shirtRevenue)} />
          <StatCard icon="banknote" tone="green" label="รายได้รวมผ่านธนาคาร" value={baht(s.totalRevenue)} />
        </Section>

        <Section title="Token และร้านค้า" note="Token ไม่นับเป็นรายได้ธนาคาร">
          <StatCard icon="gift" tone="orange" label="Token โบนัสที่แจก" value={token(s.bonusTokens)} />
          <StatCard icon="plusCircle" tone="teal" label="Token ที่เติมเพิ่ม" value={token(s.topupTokens)} />
          <StatCard icon="cart" tone="purple" label="Token ที่ใช้ไป" value={token(s.spentTokens)} />
          <StatCard icon="store" tone="blue" label="จำนวนร้านค้า" value={count(s.shops)} />
          <StatCard
            icon="trendingUp"
            tone="green"
            label="ยอดขายร้านค้า"
            value={token(s.shopSales)}
            hint="Token ไม่นับเป็นรายได้ธนาคาร"
          />
        </Section>

        <Section title="การเข้างาน">
          <StatCard icon="logIn" tone="green" label="ผู้เข้างาน" value={count(s.attendees)} />
          <StatCard icon="ticket" tone="amber" label="บัตรที่ยังไม่ใช้" value={count(s.unused)} />
        </Section>
      </div>
    </div>
  );
}