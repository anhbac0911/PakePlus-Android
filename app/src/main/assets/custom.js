window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
// ... [Đoạn mã hiện tại của bạn giữ nguyên ở trên] ...

// --- VIRTUAL MOUSE IMPLEMENTATION ---
// 1. Create the cursor element (tạo hình dáng con chuột)
const virtualCursor = document.createElement('div');
virtualCursor.style.width = '20px';
virtualCursor.style.height = '20px';
virtualCursor.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'; // Màu đỏ bán trong suốt
virtualCursor.style.borderRadius = '50%'; // Hình tròn
virtualCursor.style.position = 'fixed';
virtualCursor.style.zIndex = '999999';
virtualCursor.style.pointerEvents = 'none'; // Rất quan trọng: đảm bảo chuột không block sự kiện click
virtualCursor.style.transition = 'top 0.1s, left 0.1s'; // Di chuyển mượt hơn
document.body.appendChild(virtualCursor);

// 2. Set initial position (đặt vị trí ban đầu ở giữa màn hình)
let cursorX = window.innerWidth / 2;
let cursorY = window.innerHeight / 2;
const step = 30; // Speed: Quãng đường di chuyển mỗi lần bấm phím (pixels)

// Update vị trí ban đầu cho CSS
virtualCursor.style.left = `${cursorX}px`;
virtualCursor.style.top = `${cursorY}px`;

// 3. Add keyboard event listener (lắng nghe phím bấm từ remote tivi)
document.addEventListener('keydown', (e) => {
    // Ngăn chặn hành vi cuộn trang mặc định của phím mũi tên
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    switch (e.key) {
        case 'ArrowUp':
            cursorY = Math.max(0, cursorY - step);
            break;
        case 'ArrowDown':
            cursorY = Math.min(window.innerHeight, cursorY + step);
            break;
        case 'ArrowLeft':
            cursorX = Math.max(0, cursorX - step);
            break;
        case 'ArrowRight':
            cursorX = Math.min(window.innerWidth, cursorX + step);
            break;
        case 'Enter': // Nút OK trên remote thường gửi mã 'Enter'
            // Simulate click (giả lập click) tại tọa độ hiện tại
            const elementToClick = document.elementFromPoint(cursorX, cursorY);
            if (elementToClick) {
                elementToClick.click(); 
                // Thao tác này sẽ kích hoạt hàm hookClick của bạn nếu trúng thẻ <a>
            }
            break;
    }

    // Update lại vị trí hiển thị trên màn hình
    virtualCursor.style.left = `${cursorX}px`;
    virtualCursor.style.top = `${cursorY}px`;
});