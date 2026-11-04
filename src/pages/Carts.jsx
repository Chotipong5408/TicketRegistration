import { useState } from "react";
import { cartItems } from "../data/carts";
import "../styles/Cart.css";

export default function Carts() {

    // เก็บข้อมูลสินค้าในตะกร้า
    const [items, setItems] = useState(cartItems);

    // เพิ่มจำนวนสินค้า
    function increaseQuantity(id) {
        setItems(items.map((item) =>
            item.id === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    }

    // ลดจำนวนสินค้า
    function decreaseQuantity(id) {
        setItems(items.map((item) =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                : item
        ));
    }

    // คำนวณราคารวม
    const totalPrice = items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    // คำนวณ Token รวม
    const totalToken = items.reduce((sum, item) => {
        return sum + item.token * item.quantity;
    }, 0);

    return (
        <div className="cart-container">

            {/* กลับไปเลือกซื้อเพิ่ม */}
            <nav className="cart-nav">
                <button onClick={() => window.history.back()}>
                    ← กลับไปเลือกซื้อเพิ่ม
                </button>
            </nav>

            {/* หัวข้อ */}
            <header className="cart-header">
                <h2>ตะกร้าสินค้า</h2>
            </header>

            {/* รายการสินค้า */}
            <main className="cart-card">

                {items.map((item) => (
                    <div className="cart-item" key={item.id}>

                        {/* Icon สินค้า */}
                        <div className="cart-icon">
                            {item.type === "ticket" ? "🎫" : "👕"}
                        </div>

                        {/* รายละเอียดสินค้า */}
                        <div className="cart-detail">

                            <h3>{item.name}</h3>

                            <p>
                                ฿{item.price.toLocaleString()} / ชิ้น
                            </p>

                            {item.size && (
                                <span>ไซส์ {item.size}</span>
                            )}

                        </div>

                        {/* ปุ่มเพิ่มลดจำนวน */}
                        <div className="quantity-control">

                            <button
                                onClick={() => decreaseQuantity(item.id)}
                            >
                                −
                            </button>

                            <span>{item.quantity}</span>

                            <button
                                onClick={() => increaseQuantity(item.id)}
                            >
                                +
                            </button>

                        </div>

                        {/* ราคารวมสินค้า */}
                        <div className="item-subtotal">
                            ฿{(item.price * item.quantity).toLocaleString()}
                        </div>

                    </div>
                ))}

                {/* Token ที่ได้รับ */}
                <div className="token-summary">
                    <span>Token โบนัสที่คาดว่าจะได้รับ</span>
                    <span>+{totalToken} Token</span>
                </div>

                {/* สรุปราคา */}
                <div className="cart-total">

                    <h3>ยอดรวม</h3>

                    <strong>
                        ฿{totalPrice.toLocaleString()}
                    </strong>

                </div>

                {/* ปุ่มชำระเงิน */}
                <button
                    className="checkout-button"
                    disabled={items.length === 0}
                >
                    ชำระเงิน
                </button>

            </main>

        </div>
    );
}