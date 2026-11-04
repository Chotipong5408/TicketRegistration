import React, { useMemo, useState } from "react";
import {
  Shield,
  ShieldCheck,
  CalendarCog,
  User,
  Store,
  Users,
  Search,
  Download,
  RefreshCw,
  X,
  Check,
  Ban,
  CircleCheck,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Pencil,
} from "lucide-react";
import "./UserRoleManagement.css";

/* ------------------------------------------------------------------ */
/* ค่าคงที่: Role และ Permission                                        */
/* ------------------------------------------------------------------ */

const ROLES = {
  super_admin: {
    label: "Super Admin",
    desc: "สิทธิ์สูงสุด จัดการได้ทุกอย่างในระบบ รวมถึงกำหนดสิทธิ์ผู้อื่น",
    icon: ShieldCheck,
  },
  event_admin: {
    label: "Event Admin",
    desc: "ดูแลกิจกรรม อนุมัติบัตร เช็คอินผู้เข้างาน และจัดการ Token",
    icon: CalendarCog,
  },
  store: {
    label: "Store",
    desc: "ร้านค้า รับชำระด้วย Token และดูยอดขายของร้านตัวเอง",
    icon: Store,
  },
  user: {
    label: "User",
    desc: "ผู้ใช้ทั่วไป ลงทะเบียน ซื้อบัตร และใช้ Token ภายในงาน",
    icon: User,
  },
};

const INITIAL_USERS = [
  { id: 1, name: "วิชัย ศิริสุข", email: "user@demo.com", year: 2545, faculty: "วิศวกรรมศาสตร์", role: "user", token: 40, active: true },
  { id: 2, name: "สมชาย ใจดี", email: "somchai@demo.com", year: 2548, faculty: "บริหารธุรกิจ", role: "user", token: 0, active: true },
  { id: 3, name: "สุภา แอดมิน", email: "superadmin@demo.com", year: 2540, faculty: "วิทยาศาสตร์", role: "super_admin", token: 0, active: true },
  { id: 4, name: "ธนกิจ เติมเหรียญ", email: "tokenadmin@demo.com", year: 2543, faculty: "วิศวกรรมศาสตร์", role: "event_admin", token: 0, active: true },
  { id: 5, name: "กาญจนา ร้านกาแฟ", email: "store1@demo.com", year: 2546, faculty: "มนุษยศาสตร์", role: "store", token: 0, active: true },
  { id: 6, name: "ประเสริฐ ร้านอาหาร", email: "store2@demo.com", year: 2544, faculty: "บริหารธุรกิจ", role: "store", token: 0, active: true },
];

const PAGE_SIZE = 10;

/* ------------------------------------------------------------------ */
/* ส่วนประกอบย่อย                                                       */
/* ------------------------------------------------------------------ */

function RoleBadge({ role }) {
  const r = ROLES[role];
  const Icon = r.icon;
  return (
    <span className={`urm-badge urm-badge--${role}`}>
      <Icon size={13} />
      {r.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, tone, active, onClick }) {
  return (
    <button className={`urm-stat ${active ? "is-active" : ""}`} onClick={onClick}>
      <div className={`urm-ibox urm-ibox--${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="urm-stat-label">{label}</div>
        <div className="urm-stat-value">{value}</div>
      </div>
    </button>
  );
}

function SectionTitle({ title, hint }) {
  return (
    <div className="urm-section">
      <h2>{title}</h2>
      {hint && <span>{hint}</span>}
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="urm-toast">
      <CircleCheck size={16} />
      {toast}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal เปลี่ยน Role                                                   */
/* ------------------------------------------------------------------ */

function RoleModal({ user, onClose, onSave }) {
  const [selected, setSelected] = useState(user.role);

  return (
    <div className="urm-overlay">
      <div className="urm-modal">
        <div className="urm-modal-head">
          <div className="urm-modal-head-left">
            <div className="urm-header-icon" style={{ width: 40, height: 40 }}>
              <KeyRound size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>กำหนดสิทธิ์ผู้ใช้</div>
              <div className="urm-modal-sub">
                {user.name} · {user.email}
              </div>
            </div>
          </div>
          <button className="urm-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="urm-modal-body">
          {Object.entries(ROLES).map(([key, r]) => {
            const Icon = r.icon;
            const isSel = selected === key;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`urm-role-opt ${isSel ? "is-sel" : ""}`}
              >
                <div className={`urm-ibox urm-ibox--${key}`}>
                  <Icon size={18} />
                </div>
                <div className="urm-role-info">
                  <div className="urm-role-name">
                    {r.label}
                  </div>
                  <p className="urm-role-desc">{r.desc}</p>
                </div>
                <div className="urm-radio">{isSel && <Check size={12} />}</div>
              </button>
            );
          })}
        </div>

        <div className="urm-modal-foot">
          <button className="urm-btn-cancel" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            className="urm-btn-save"
            onClick={() => onSave(user.id, selected)}
          >
            บันทึกสิทธิ์
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* หน้าหลัก                                                             */
/* ------------------------------------------------------------------ */

export default function UserRoleManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const counts = useMemo(() => {
    const c = { all: users.length };
    Object.keys(ROLES).forEach((k) => (c[k] = users.filter((u) => u.role === k).length));
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (yearFilter && String(u.year) !== yearFilter.trim()) return false;
      if (!s) return true;
      return (
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.faculty.toLowerCase().includes(s) ||
        ROLES[u.role].label.toLowerCase().includes(s)
      );
    });
  }, [users, q, roleFilter, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const saveRole = (id, role) => {
    const target = users.find((u) => u.id === id);
    if (target && target.role === role) {
      setEditing(null);
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    setEditing(null);
    showToast(`เปลี่ยนสิทธิ์เป็น ${ROLES[role].label} เรียบร้อย`);
  };

  const toggleActive = (u) => {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x)));
    showToast(u.active ? `ปิดใช้งาน ${u.name} แล้ว` : `เปิดใช้งาน ${u.name} แล้ว`);
  };

  const exportCsv = () => {
    const head = ["ชื่อ", "อีเมล", "พ.ศ.", "คณะ", "บทบาท", "Token", "สถานะ"];
    const body = filtered.map((u) => [
      u.name, u.email, u.year, u.faculty, ROLES[u.role].label, u.token, u.active ? "ใช้งาน" : "ปิดใช้",
    ]);
    const csv = [head, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const resetFilters = () => {
    setQ("");
    setRoleFilter("all");
    setYearFilter("");
    setPage(1);
  };

  return (
    <div className="urm-page">
      <div className="urm-wrap">
        {/* Header */}
        <div className="urm-header">
          <div className="urm-header-left">
            <div className="urm-header-icon">
              <Shield size={22} />
            </div>
            <h1 className="urm-title">จัดการผู้ใช้และสิทธิ์</h1>
          </div>
          <div className="urm-header-right">
            <span className="urm-event-pill">งานเลี้ยงรุ่นศิษย์เก่า 2026</span>
            <button
              className="urm-refresh"
              onClick={() => {
                resetFilters();
                showToast("รีเฟรชข้อมูลแล้ว");
              }}
            >
              <RefreshCw size={14} /> รีเฟรช
            </button>
          </div>
        </div>

        {/* Summary */}
        <SectionTitle title="สรุปตามบทบาท" hint="คลิกการ์ดเพื่อกรองรายชื่อ" />
        <div className="urm-stats">
          <StatCard
            icon={Users}
            label="ผู้ใช้ทั้งหมด"
            value={counts.all}
            tone="all"
            active={roleFilter === "all"}
            onClick={() => { setRoleFilter("all"); setPage(1); }}
          />
          {Object.entries(ROLES).map(([k, r]) => (
            <StatCard
              key={k}
              icon={r.icon}
              label={r.label}
              value={counts[k]}
              tone={k}
              active={roleFilter === k}
              onClick={() => { setRoleFilter(k); setPage(1); }}
            />
          ))}
        </div>

        <>
            {/* Filters */}
            <div className="urm-filters">
              <div className="urm-search">
                <Search size={16} />
                <input
                  className="urm-input"
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setPage(1); }}
                  placeholder="ค้นหาชื่อ อีเมล คณะ หรือบทบาท..."
                />
              </div>
              <input
                className="urm-input urm-input--year"
                value={yearFilter}
                onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
                placeholder="พ.ศ."
              />
              <select
                className="urm-select"
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              >
                <option value="all">ทุกบทบาท</option>
                {Object.entries(ROLES).map(([k, r]) => (
                  <option key={k} value={k}>{r.label}</option>
                ))}
              </select>
              <button className="urm-btn-outline" onClick={exportCsv}>
                <Download size={15} /> Export CSV
              </button>
            </div>

            {/* Table */}
            <div className="urm-card">
              <div className="urm-scroll">
                <table className="urm-table">
                  <thead>
                    <tr>
                      <th>ชื่อ</th>
                      <th>อีเมล</th>
                      <th>พ.ศ.</th>
                      <th>คณะ</th>
                      <th>บทบาท</th>
                      <th>Token</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id} className={u.active ? "" : "is-off"}>
                        <td className="urm-name">{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.year}</td>
                        <td>{u.faculty}</td>
                        <td><RoleBadge role={u.role} /></td>
                        <td>{u.token}</td>
                        <td>
                          <div className="urm-actions">
                            <button className="urm-act urm-act--role" onClick={() => setEditing(u)}>
                              <Pencil size={12} /> เปลี่ยนสิทธิ์
                            </button>
                            <button
                              className={`urm-act ${u.active ? "urm-act--off" : "urm-act--on"}`}
                              onClick={() => toggleActive(u)}
                            >
                              {u.active ? <><Ban size={12} /> ปิดใช้</> : <><CircleCheck size={12} /> เปิดใช้</>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="urm-empty">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="urm-pager">
              <span>ทั้งหมด {filtered.length} รายการ</span>
              <div className="urm-pager-right">
                <button className="urm-pg" disabled={current <= 1} onClick={() => setPage(current - 1)}>
                  <ChevronLeft size={14} /> ก่อนหน้า
                </button>
                <span>{current}/{totalPages}</span>
                <button className="urm-pg" disabled={current >= totalPages} onClick={() => setPage(current + 1)}>
                  ถัดไป <ChevronRight size={14} />
                </button>
              </div>
            </div>
        </>
      </div>

      {editing && (
        <RoleModal
          user={editing}
          onClose={() => setEditing(null)}
          onSave={saveRole}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}