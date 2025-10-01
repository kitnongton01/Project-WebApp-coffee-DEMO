
// สคริปต์ควบคุมสไลด์: เลื่อนอัตโนมัติ, คลิกจุดเพื่อไปสไลด์ที่ต้องการ
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.header .slider');
    if (!slider) return;

    const slidesContainer = slider.querySelector('.slides');
    const slideElements = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.control.prev');
    const nextBtn = slider.querySelector('.control.next');
    const dotsContainer = slider.querySelector('.dots');

    let currentIndex = 0; // ดัชนีสไลด์ปัจจุบัน
    let autoTimer = null; // ตัวจับเวลาเลื่อนอัตโนมัติ
    const autoIntervalMs = 3000; // ระยะเวลาเลื่อนอัตโนมัติ (มิลลิวินาที)

    // ไปยังสไลด์ตามดัชนีที่ระบุ
    function goTo(index) {
        currentIndex = (index + slideElements.length) % slideElements.length;
        const offset = -currentIndex * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
        slideElements.forEach((el, i) => {
            el.classList.toggle('is-active', i === currentIndex);
        });
        updateDots();
    }

    function next() { goTo(currentIndex + 1); }
    function prev() { goTo(currentIndex - 1); }

    // สร้างปุ่มจุดด้านล่างตามจำนวนสไลด์
    function buildDots() {
        dotsContainer.innerHTML = '';
        slideElements.forEach((_, i) => {
            const b = document.createElement('button');
            b.setAttribute('aria-label', `Go to slide ${i + 1}`);
            b.addEventListener('click', () => {
                stopAuto();
                goTo(i);
                startAuto();
            });
            dotsContainer.appendChild(b);
        });
    }

    // อัปเดตสถานะจุดให้ตรงกับสไลด์ปัจจุบัน
    function updateDots() {
        const dots = Array.from(dotsContainer.children);
        dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));
    }

    // เริ่มเลื่อนอัตโนมัติ
    function startAuto() {
        stopAuto();
        autoTimer = setInterval(next, autoIntervalMs);
    }
    // หยุดเลื่อนอัตโนมัติ
    function stopAuto() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    prevBtn.addEventListener('click', () => { prev(); });
    nextBtn.addEventListener('click', () => { next(); });

    // Allow normal page scrolling over the slider (no wheel blocking)

    buildDots();
    goTo(0);
    startAuto();
});


// --------------------------------------------------------------------------------------------------------


const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnpopup');
const iconClose = document.querySelector('.icon-close');
// const menu = document.querySelector('.menu');

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active');
    });
}

if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.remove('active');
    });
}

if (btnPopup) {
    btnPopup.addEventListener('click', (e) => {
        e.preventDefault();
        wrapper.classList.add('active-popup');
    });
}

if (iconClose) {
    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('active-popup');
        wrapper.classList.remove('active');
    });
}

// ---------------------------------------------------------------------------------

// ----------------- Mouse Drag to Scroll for Slider -----------------
const cardSliders = document.querySelectorAll('.slider');
cardSliders.forEach(slider => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let lastX;
    let velocity = 0;
    let momentumID = null;
    let lastMoveTime = 0;
    let dragBlocked = false;

    function isDragBlockTarget(target) {
        // ป้องกัน drag ถ้าคลิกที่ปุ่ม ลิงก์ หรือ input ใน .card
        return target.closest('.card a, .card button, .card input');
    }

    function momentumScroll() {
        if (Math.abs(velocity) > 0.5) {
            slider.scrollLeft -= velocity;
            velocity *= 0.93; // friction
            momentumID = requestAnimationFrame(momentumScroll);
        } else {
            velocity = 0;
            momentumID = null;
        }
    }

    slider.addEventListener('mousedown', (e) => {
        if (isDragBlockTarget(e.target)) {
            dragBlocked = true;
            return;
        }
        dragBlocked = false;
        isDown = true;
        slider.classList.add('dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastX = startX;
        lastMoveTime = Date.now();
        velocity = 0;
        if (momentumID) {
            cancelAnimationFrame(momentumID);
            momentumID = null;
        }
        // ป้องกัน select ข้อความขณะลาก
        document.body.style.userSelect = 'none';
    });

    slider.addEventListener('mouseleave', () => {
        if (isDown) {
            isDown = false;
            slider.classList.remove('dragging');
            if (velocity !== 0) momentumScroll();
            document.body.style.userSelect = '';
        }
    });

    slider.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            slider.classList.remove('dragging');
            if (velocity !== 0) momentumScroll();
            document.body.style.userSelect = '';
        }
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown || dragBlocked) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
        // velocity calc
        const now = Date.now();
        velocity = (x - lastX) / (now - lastMoveTime) * 20; // scale for px/frame
        lastX = x;
        lastMoveTime = now;
    });

    // Touch support for mobile
    slider.addEventListener('touchstart', (e) => {
        if (isDragBlockTarget(e.target)) {
            dragBlocked = true;
            return;
        }
        dragBlocked = false;
        isDown = true;
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastX = startX;
        lastMoveTime = Date.now();
        velocity = 0;
        if (momentumID) {
            cancelAnimationFrame(momentumID);
            momentumID = null;
        }
        document.body.style.userSelect = 'none';
    });
    slider.addEventListener('touchend', () => {
        if (isDown) {
            isDown = false;
            if (velocity !== 0) momentumScroll();
            document.body.style.userSelect = '';
        }
    });
    slider.addEventListener('touchmove', (e) => {
        if (!isDown || dragBlocked) return;
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
        // velocity calc
        const now = Date.now();
        velocity = (x - lastX) / (now - lastMoveTime) * 20;
        lastX = x;
        lastMoveTime = now;
    });
});

// ---------------------------------------------------------------------------

// ---------------- ระบบตะกร้า & Popup สินค้า ----------------
const popupProduct = document.getElementById('popupProduct');
const popupProductClose = document.getElementById('popupProductClose');
const popupCart = document.getElementById('popupCart');
const popupCartClose = document.getElementById('popupCartClose');
const cartBtn = document.getElementById('cartBtn');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const cartConfirmBtn = document.getElementById('cartConfirmBtn');
const cartPayBtns = document.querySelectorAll('.popup-cart-pay-btn');
let selectedType = 'hot';
let cart = [];
let selectedPay = 'cash';

// ฟังก์ชันเปิด popup รายละเอียดสินค้า
function openProductPopup({ img, name, hot, cold }) {
    popupProduct.querySelector('.popup-product-img').src = img;
    popupProduct.querySelector('.popup-product-img').alt = name;
    popupProduct.querySelector('.popup-product-name').textContent = name;
    const priceBtns = popupProduct.querySelectorAll('.popup-product-price-btn');
    if (priceBtns.length > 1) {
        priceBtns[0].textContent = hot || 'ร้อน 0 บาท';
        priceBtns[1].textContent = cold || 'เย็น 0 บาท';
        // ถ้ามีแต่ราคาเดียว ให้ active เฉพาะปุ่มที่มีราคา
        if (hot && !cold) {
            priceBtns[0].classList.add('active');
            priceBtns[1].classList.remove('active');
            selectedType = 'hot';
        } else if (!hot && cold) {
            priceBtns[0].classList.remove('active');
            priceBtns[1].classList.add('active');
            selectedType = 'cold';
        } else {
            priceBtns[0].classList.add('active');
            priceBtns[1].classList.remove('active');
            selectedType = 'hot';
        }
    }
    popupProduct.querySelector('.popup-product-detail-input').value = '';
    popupProduct.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}
// ระบบเลือกปุ่มร้อน/เย็น
const priceBtns = popupProduct.querySelectorAll('.popup-product-price-btn');
priceBtns.forEach((btn, idx) => {
    btn.addEventListener('click', function () {
        priceBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedType = idx === 0 ? 'hot' : 'cold';
    });
});
// ปิด popup รายละเอียดสินค้า
popupProductClose && popupProductClose.addEventListener('click', function () {
    popupProduct.style.display = 'none';
    document.body.style.overflow = '';
});
window.addEventListener('click', function (e) {
    if (e.target === popupProduct) {
        popupProduct.style.display = 'none';
        document.body.style.overflow = '';
    }
});
// เพิ่ม event ให้ปุ่ม "เพิ่ม" ใน popup รายละเอียดสินค้า
popupProduct.querySelector('.popup-product-add-btn').addEventListener('click', function () {
    const img = popupProduct.querySelector('.popup-product-img').src;
    const name = popupProduct.querySelector('.popup-product-name').textContent;
    const detail = popupProduct.querySelector('.popup-product-detail-input').value;
    const priceBtns = popupProduct.querySelectorAll('.popup-product-price-btn');
    let price = 0;
    let type = selectedType;
    if (type === 'hot') {
        price = parseInt(priceBtns[0].textContent.replace(/[^\d]/g, ''));
    } else {
        price = parseInt(priceBtns[1].textContent.replace(/[^\d]/g, ''));
    }
    // ถ้าไม่มีราคานั้น (ปุ่มว่าง) ไม่ให้เพิ่ม
    if (isNaN(price) || price === 0) return;
    cart.push({ img, name, type, detail, price });
    updateCartUI();
    popupProduct.style.display = 'none';
    document.body.style.overflow = '';
});
// เพิ่ม event ให้ปุ่ม "เพิ่ม" ทุก .card (เปิด popup รายละเอียด)
document.querySelectorAll('.card').forEach(card => {
    const btn = card.querySelector('a');
    if (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // ดึงข้อมูลจาก card
            const img = card.querySelector('img')?.src || '';
            const name = card.querySelector('h3')?.textContent || '';
            // ดึงราคาจาก <p> ใน .textcard
            const pricePs = Array.from(card.querySelectorAll('p'));
            let hot = '', cold = '';
            if (pricePs.length === 1) {
                if (pricePs[0].textContent.includes('ร้อน')) {
                    hot = pricePs[0].textContent.trim();
                    cold = '';
                } else if (pricePs[0].textContent.includes('เย็น')) {
                    hot = '';
                    cold = pricePs[0].textContent.trim();
                } else {
                    hot = pricePs[0].textContent.trim();
                    cold = '';
                }
            } else if (pricePs.length >= 2) {
                hot = pricePs[0].textContent.trim();
                cold = pricePs[1].textContent.trim();
            } else {
                hot = 'ร้อน 40 บาท';
                cold = 'เย็น 55 บาท';
            }
            openProductPopup({ img, name, hot, cold });
        });
    }
});

// ---------------- Popup Cart ----------------
function updateCartUI() {
    // แสดงสินค้าในตะกร้า
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'popup-cart-item';
        div.innerHTML = `
                <img class="popup-cart-item-img" src="${item.img}" alt="${item.name}">
                <div class="popup-cart-item-info">
                    <div class="popup-cart-item-name">${item.name}</div>
                    <div class="popup-cart-item-detail">${item.type === 'hot' ? 'ร้อน' : 'เย็น'}${item.detail ? ' , ' + item.detail : ''}</div>
                    <div class="popup-cart-item-price-row">
                        <span class="popup-cart-item-price">${item.price} บาท</span>
                    </div>
                </div>
                <button class="popup-cart-item-remove" title="ลบ" data-idx="${idx}">&times;</button>
            `;
        cartList.appendChild(div);
    });
    cartTotal.textContent = total + ' บาท';
    // ลบสินค้า
    cartList.querySelectorAll('.popup-cart-item-remove').forEach(btn => {
        btn.addEventListener('click', function () {
            const idx = parseInt(btn.getAttribute('data-idx'));
            cart.splice(idx, 1);
            updateCartUI();
        });
    });
    // ปุ่มยืนยัน
    cartConfirmBtn.disabled = cart.length === 0;
    // อัปเดต badge จำนวนออเดอร์
    const cartBadge = document.getElementById('cartBadge');
    if (cart.length > 0) {
        cartBadge.textContent = cart.length;
        cartBadge.style.display = 'flex';
    } else {
        cartBadge.style.display = 'none';
    }
}
// เปิด/ปิด popup ตะกร้า
cartBtn && cartBtn.addEventListener('click', function () {
    updateCartUI();
    popupCart.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});
popupCartClose && popupCartClose.addEventListener('click', function () {
    popupCart.style.display = 'none';
    document.body.style.overflow = '';
});
window.addEventListener('click', function (e) {
    if (e.target === popupCart) {
        popupCart.style.display = 'none';
        document.body.style.overflow = '';
    }
});
// เลือกวิธีชำระเงิน
cartPayBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        cartPayBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPay = btn.getAttribute('data-method');
    });
});
// กดปุ่มยืนยัน (ตัวอย่าง: alert)
cartConfirmBtn && cartConfirmBtn.addEventListener('click', function () {
    if (cart.length === 0) return;
    alert('สั่งซื้อสำเร็จ! (' + selectedPay + ')');
    cart = [];
    updateCartUI();
    popupCart.style.display = 'none';
    document.body.style.overflow = '';
});