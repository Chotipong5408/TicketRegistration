import React, { useMemo, useState } from "react";
import {
  Receipt,
  Search,
  RefreshCw,
  X,
  Check,
  Clock,
  Wallet,
  CircleCheck,
  CircleX,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  ListChecks,
} from "lucide-react";
import "./OrderReview.css";

/* ------------------------------------------------------------------ */
/* ค่าคงที่ / ข้อมูลตัวอย่าง                                             */
/* ------------------------------------------------------------------ */

const STATUS = {
  pending: { label: "รอตรวจสอบ", icon: Clock },
  awaiting: { label: "รอชำระเงิน", icon: Wallet },
  approved: { label: "อนุมัติแล้ว", icon: CircleCheck },
  rejected: { label: "ปฏิเสธหลักฐาน", icon: CircleX },
};

/*
  hasSlip  = ผู้ซื้อส่งสลีปมาแล้วหรือยัง
  slipUrl  = ลิงก์รูปสลีปจริง (ถ้าว่างจะแสดงสลีปตัวอย่างจำลองแทน)
             ต่อ API แล้วใส่ URL รูปจริงตรงนี้ได้เลย
*/
const INITIAL_ORDERS = [
  { id: "ord_approved_1", buyer: "วิชัย ศิริสุข", amount: 550, status: "approved", date: "2026-10-05T16:00:00", hasSlip: true, slipUrl: "", reason: "" },
  { id: "ord_pending_1", buyer: "สมชาย ใจดี", amount: 200, status: "pending", date: "2026-10-18T19:00:00", hasSlip: true, slipUrl: "", reason: "" },
  { id: "ord_await_1", buyer: "สมชาย ใจดี", amount: 100, status: "awaiting", date: "2026-10-20T22:00:00", hasSlip: false, slipUrl: "", reason: "" },
  { id: "ord_rejected_1", buyer: "วิชัย ศิริสุข", amount: 500, status: "rejected", date: "2026-10-13T00:00:00", hasSlip: true, slipUrl: "", reason: "ยอดเงินในสลีปไม่ตรงกับยอดสั่งซื้อ" },
];

const PAGE_SIZE = 10;
const MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

const fmtDate = (iso) => {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} ${hh}:${mm}`;
};
const fmtMoney = (n) => `฿${Number(n).toLocaleString("th-TH")}`;

/* ------------------------------------------------------------------ */
/* ส่วนประกอบย่อย                                                       */
/* ------------------------------------------------------------------ */

function StatusPill({ status }) {
  const s = STATUS[status];
  const Icon = s.icon;
  return (
    <span className={`ord-pill ord-pill--${status}`}>
      <Icon size={11} />
      {s.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, tone, active, onClick }) {
  return (
    <button className={`ord-stat ${active ? "is-active" : ""}`} onClick={onClick}>
      <div className={`ord-ibox ord-ibox--${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="ord-stat-label">{label}</div>
        <div className="ord-stat-value">{value}</div>
      </div>
    </button>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="ord-toast">
      <CircleCheck size={16} />
      {toast}
    </div>
  );
}

/* สลีปตัวอย่างจำลอง (ใช้เมื่อยังไม่มี slipUrl จริง) */
function MockSlip({ order }) {
  return (
    <svg className="ord-slip-svg" viewBox="0 0 260 400" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="260" height="400" rx="16" fill="#ffffff" />
      <rect x="0" y="0" width="260" height="70" rx="16" fill="#16a34a" />
      <rect x="0" y="40" width="260" height="30" fill="#16a34a" />
      <circle cx="30" cy="35" r="13" fill="#ffffff" />
      <path d="M24 35 l5 5 l9 -10" stroke="#16a34a" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="52" y="31" fontSize="13" fontWeight="700" fill="#ffffff">โอนเงินสำเร็จ</text>
      <text x="52" y="48" fontSize="10" fill="#dcfce7">{fmtDate(order.date)}</text>

      <text x="20" y="108" fontSize="10" fill="#64748b">จำนวนเงิน</text>
      <text x="20" y="134" fontSize="24" fontWeight="700" fill="#0f172a">{Number(order.amount).toLocaleString("th-TH")}.00 บาท</text>

      <line x1="20" y1="154" x2="240" y2="154" stroke="#e2e8f0" />

      <text x="20" y="180" fontSize="10" fill="#64748b">จาก</text>
      <text x="20" y="198" fontSize="13" fontWeight="600" fill="#0f172a">{order.buyer}</text>
      <text x="20" y="214" fontSize="10" fill="#94a3b8">ธนาคารตัวอย่าง xxx-x-x1234-x</text>

      <text x="20" y="246" fontSize="10" fill="#64748b">ไปยัง</text>
      <text x="20" y="264" fontSize="13" fontWeight="600" fill="#0f172a">งานเลี้ยงรุ่นศิษย์เก่า 2026</text>
      <text x="20" y="280" fontSize="10" fill="#94a3b8">ธนาคารตัวอย่าง xxx-x-x5678-x</text>

      <line x1="20" y1="300" x2="240" y2="300" stroke="#e2e8f0" />
      <text x="20" y="324" fontSize="10" fill="#64748b">เลขที่รายการ</text>
      <text x="20" y="340" fontSize="11" fontWeight="600" fill="#0f172a">{order.id.toUpperCase()}</text>

      <rect x="20" y="356" width="220" height="26" rx="6" fill="#f1f5f9" />
      <text x="130" y="373" fontSize="10" textAnchor="middle" fill="#94a3b8">สลีปตัวอย่าง (จำลอง)</text>
    </svg>
  );
}

function SlipView({ order }) {
  const [zoom, setZoom] = useState(false);

  if (!order.hasSlip) {
    return (
      <div className="ord-slip-box">
        <div className="ord-slip-none">
          <ImageOff size={36} />
          ผู้ซื้อยังไม่ได้ส่งสลีปการโอนเงิน
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="ord-slip-box">
        {order.slipUrl ? (
          <img
            className={`ord-slip-img ${zoom ? "is-zoom" : ""}`}
            src={order.slipUrl}
            alt={`สลีป ${order.id}`}
            onClick={() => setZoom((z) => !z)}
          />
        ) : (
          <MockSlip order={order} />
        )}
      </div>
      {order.slipUrl && <p className="ord-slip-hint">คลิกที่รูปเพื่อขยาย / ย่อ</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modal ตรวจสอบสลีป -> อนุมัติ / ปฏิเสธ                                  */
/* ------------------------------------------------------------------ */

function ReviewModal({ order, onClose, onApprove, onReject }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const canApprove = order.status === "pending" || order.status === "rejected";
  const canReject = order.status === "pending";

  return (
    <div className="ord-overlay">
      <div className="ord-modal">
        <div className="ord-modal-head">
          <div className="ord-modal-head-left">
            <div className="ord-header-icon" style={{ width: 40, height: 40 }}>
              <Receipt size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>ตรวจสอบสลีปการชำระเงิน</div>
              <div className="ord-modal-sub">{order.id}</div>
            </div>
          </div>
          <button className="ord-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="ord-modal-body">
          <SlipView order={order} />

          <div className="ord-info">
            <div className="ord-row">
              <span>ยอดที่ต้องชำระ</span>
              <span className="ord-amount">{fmtMoney(order.amount)}</span>
            </div>
            <div className="ord-row">
              <span>ผู้ซื้อ</span>
              <span>{order.buyer}</span>
            </div>
            <div className="ord-row">
              <span>วันที่สั่งซื้อ</span>
              <span>{fmtDate(order.date)}</span>
            </div>
            <div className="ord-row">
              <span>สถานะ</span>
              <span>
                <StatusPill status={order.status} />
              </span>
            </div>

            {order.status === "awaiting" && (
              <div className="ord-note-box">ยังไม่มีสลีป ต้องรอให้ผู้ซื้อชำระเงินและแนบหลักฐานก่อนจึงจะตรวจสอบได้</div>
            )}
            {order.status === "approved" && (
              <div className="ord-ok-box">
                <CircleCheck size={16} /> คำสั่งซื้อนี้ได้รับการอนุมัติแล้ว
              </div>
            )}
            {order.status === "rejected" && order.reason && (
              <div className="ord-reason-box">เหตุผลที่ปฏิเสธ: {order.reason}</div>
            )}

            {rejecting && (
              <div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>เหตุผลที่ปฏิเสธหลักฐาน</div>
                <textarea
                  className="ord-textarea"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="เช่น ยอดเงินไม่ตรง / สลีปไม่ชัดเจน"
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        <div className="ord-modal-foot">
          <button className="ord-btn ord-btn--ghost" onClick={onClose}>
            ปิด
          </button>

          {canReject && !rejecting && (
            <button className="ord-btn ord-btn--danger" onClick={() => setRejecting(true)}>
              <X size={14} /> ปฏิเสธ
            </button>
          )}
          {rejecting && (
            <button
              className="ord-btn ord-btn--danger-solid"
              disabled={!reason.trim()}
              onClick={() => onReject(order.id, reason.trim())}
            >
              ยืนยันการปฏิเสธ
            </button>
          )}
          {canApprove && !rejecting && (
            <button className="ord-btn ord-btn--ok" onClick={() => onApprove(order.id)}>
              <Check size={14} /> อนุมัติ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* หน้าหลัก                                                             */
/* ------------------------------------------------------------------ */

export default function OrderReview() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const counts = useMemo(() => {
    const c = { all: orders.length };
    Object.keys(STATUS).forEach((k) => (c[k] = orders.filter((o) => o.status === k).length));
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (!s) return true;
      return o.id.toLowerCase().includes(s) || o.buyer.toLowerCase().includes(s);
    });
  }, [orders, q, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const selected = orders.find((o) => o.id === selectedId) || null;

  const approve = (id) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "approved", reason: "" } : o)));
    setSelectedId(null);
    showToast(`อนุมัติคำสั่งซื้อ ${id} เรียบร้อย`);
  };

  const reject = (id, reason) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "rejected", reason } : o)));
    setSelectedId(null);
    showToast(`ปฏิเสธหลักฐานของ ${id} แล้ว`);
  };

  const changeFilter = (k) => {
    setStatusFilter(k);
    setPage(1);
  };

  return (
    <div className="ord-page">
      <div className="ord-wrap">
        {/* Header */}
        <div className="ord-header">
          <div className="ord-header-left">
            <div className="ord-header-icon">
              <Receipt size={22} />
            </div>
            <h1 className="ord-title">คำสั่งซื้อทั้งหมด</h1>
          </div>
          <div className="ord-header-right">
            <span className="ord-event-pill">งานเลี้ยงรุ่นศิษย์เก่า 2026</span>
            <button
              className="ord-refresh"
              onClick={() => {
                setQ("");
                setStatusFilter("all");
                setPage(1);
                showToast("รีเฟรชข้อมูลแล้ว");
              }}
            >
              <RefreshCw size={14} /> รีเฟรช
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="ord-section">
          <h2>สถานะคำสั่งซื้อ</h2>
          <span>คลิกการ์ดเพื่อกรองรายการ</span>
        </div>
        <div className="ord-stats">
          <StatCard icon={ListChecks} label="ทั้งหมด" value={counts.all} tone="all" active={statusFilter === "all"} onClick={() => changeFilter("all")} />
          {Object.entries(STATUS).map(([k, s]) => (
            <StatCard key={k} icon={s.icon} label={s.label} value={counts[k]} tone={k} active={statusFilter === k} onClick={() => changeFilter(k)} />
          ))}
        </div>

        {/* Filters */}
        <div className="ord-filters" style={{ marginTop: 24 }}>
          <div className="ord-search">
            <Search size={16} />
            <input
              className="ord-input"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="ค้นหา Order ID หรือชื่อผู้ซื้อ..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="ord-card">
          <div className="ord-scroll">
            <table className="ord-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>ผู้ซื้อ</th>
                  <th>ยอด</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td className="ord-strong">{o.buyer}</td>
                    <td>{fmtMoney(o.amount)}</td>
                    <td>
                      <StatusPill status={o.status} />
                    </td>
                    <td>{fmtDate(o.date)}</td>
                    <td>
                      <button className="ord-act" onClick={() => setSelectedId(o.id)}>
                        <Eye size={13} /> ตรวจสอบ
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="ord-empty">
                      ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="ord-pager">
          <span>ทั้งหมด {filtered.length} รายการ</span>
          <div className="ord-pager-right">
            <button className="ord-pg" disabled={current <= 1} onClick={() => setPage(current - 1)}>
              <ChevronLeft size={14} /> ก่อนหน้า
            </button>
            <span>
              {current}/{totalPages}
            </span>
            <button className="ord-pg" disabled={current >= totalPages} onClick={() => setPage(current + 1)}>
              ถัดไป <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <ReviewModal
          key={selected.id}
          order={selected}
          onClose={() => setSelectedId(null)}
          onApprove={approve}
          onReject={reject}
        />
      )}
      <Toast toast={toast} />
    </div>
  );
}