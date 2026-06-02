let activeCardIndex = 1;
const maxCardsCount = 9;

function updateLuxuryProgressBar() {
    const indicator = document.getElementById('top-progress-indicator');
    let percentage = (activeCardIndex / maxCardsCount) * 100;
    indicator.style.width = `${percentage}%`;
}

function navigateToCard(targetCardId) {
    const currentActiveCard = document.getElementById(`card-${activeCardIndex}`);
    currentActiveCard.classList.remove('active');
    
    activeCardIndex = targetCardId;
    const nextTargetCard = document.getElementById(`card-${activeCardIndex}`);
    
    setTimeout(() => {
        nextTargetCard.classList.add('active');
    }, 50);
    
    updateLuxuryProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- MA TRẬN PHÂN TÍCH VÀ CẬP NHẬT THÔNG SỐ NGHỆ NHÂN ---
function runGoldRatioCalc() {
    const gramsField = document.getElementById('grams-input');
    const ratioSelect = document.getElementById('ratio-select');
    const beanSelect = document.getElementById('bean-select');
    const methodSelect = document.getElementById('method-select');

    const waterDisplayVal = document.getElementById('water-result-val');
    const grindDisplayVal = document.getElementById('grind-result-val');
    const grindDescVal = document.getElementById('grind-desc-val');
    const flavorDisplayVal = document.getElementById('flavor-result-val');
    const flavorDescVal = document.getElementById('flavor-desc-val');
    const nestedWaterText = document.getElementById('nested-water-text');

    let grams = parseFloat(gramsField.value);
    let ratio = parseFloat(ratioSelect.value);
    let selectedBean = beanSelect.value;
    let selectedMethod = methodSelect.value;

    if (isNaN(grams) || grams <= 0) {
        waterDisplayVal.innerText = "0";
        return;
    }

    let dynamicWater = Math.round(grams * ratio);
    waterDisplayVal.innerText = dynamicWater.toLocaleString('vi-VN');
    if (nestedWaterText) {
        nestedWaterText.innerText = `${dynamicWater}ml`;
    }

    if (selectedMethod === "immersion") {
        grindDisplayVal.innerText = "Coarse / Thô";
        grindDescVal.innerText = "Kích thước to như muối biển thô.";
    } else if (selectedMethod === "kyoto") {
        grindDisplayVal.innerText = "Medium-Coarse";
        grindDescVal.innerText = "Thô vừa, mịn hơn hạt muối một chút.";
    } else if (selectedMethod === "filter-bag") {
        grindDisplayVal.innerText = "Medium / Vừa";
        grindDescVal.innerText = "Kích thước hạt cát mịn tiêu chuẩn.";
    }

    if (selectedBean === "arabica") {
        flavorDisplayVal.innerText = "Fruity & Floral";
        flavorDescVal.innerText = "Chua thanh dịu, sáng rõ vị quả mọng.";
    } else if (selectedBean === "robusta") {
        flavorDisplayVal.innerText = "Bold & Chocolate";
        flavorDescVal.innerText = "Đắng dày, body đậm, thơm nốt sô-cô-la mộc.";
    } else if (selectedBean === "blend") {
        flavorDisplayVal.innerText = "Perfect Balanced";
        flavorDescVal.innerText = "Hài hòa thể chất, hậu vị kéo dài sâu lắng.";
    }
}

// --- ĐỒNG HỒ ĐẾM NGƯỢC CHU KỲ CHIẾT XUẤT 18 TIẾNG ---
let countdownEngine = null;
let secondsRemaining = 18 * 3600;

function convertSecondsToDigitalClock(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
}

function handleTimerToggle() {
    const triggerBtn = document.getElementById('timer-trigger-btn');
    const clockFace = document.getElementById('luxury-clock');

    if (countdownEngine === null) {
        triggerBtn.innerText = "⏸ Tạm Dừng Chu Kỳ";
        triggerBtn.style.backgroundColor = "var(--accent-champagne-gold)";
        
        // >>> KHU VỰC LIÊN KẾT ỨNG DỤNG BẤM GIỜ HỆ THỐNG TRÊN ĐIỆN THOẠI <<<
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const totalSecondsToSet = secondsRemaining; 
        
        if (/android/i.test(userAgent)) {
            // Android: Gửi Intent chạy tính năng Đếm ngược gốc của app Đồng hồ
            window.location.href = `intent://#Intent;action=android.intent.action.SET_TIMER;i;android.intent.extra.alarm.LENGTH=${totalSecondsToSet};i;android.intent.extra.alarm.SKIP_UI=false;end;`;
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            // iOS: Cơ chế bảo mật Apple không cho truyền giây, dùng URL Scheme để mở nhanh ứng dụng Clock (Đồng hồ) mặc định
            window.location.href = "clock-alarm://";
        }

        // Đồng thời tải xuống file nhắc lịch .ics để thêm sự kiện đồng bộ vào Google Calendar/Apple Calendar
        let hoursToSteep = Math.round(secondsRemaining / 3600);
        if (hoursToSteep > 0) {
            henGioColdBrew(hoursToSteep);
        }
        
        countdownEngine = setInterval(() => {
            if (secondsRemaining <= 0) {
                clearInterval(countdownEngine);
                countdownEngine = null;
                document.getElementById('premium-bell').play();
                shatterCelebrationConfetti();
                alert("🎉 Hoàn thành xuất sắc: Mẻ Cold Brew của bạn đã đạt độ chín lý tưởng 18 tiếng!");
                triggerBtn.innerText = "▶ Chạy Thời Gian";
                return;
            }
            secondsRemaining--;
            clockFace.innerText = convertSecondsToDigitalClock(secondsRemaining);
        }, 1000);
    } else {
        clearInterval(countdownEngine);
        countdownEngine = null;
        triggerBtn.innerText = "▶ Tiếp Tục";
        triggerBtn.style.backgroundColor = "var(--text-royal-espresso)";
    }
}

function handleTimerReset() {
    clearInterval(countdownEngine);
    countdownEngine = null;
    secondsRemaining = 18 * 3600;
    document.getElementById('luxury-clock').innerText = convertSecondsToDigitalClock(secondsRemaining);
    
    const triggerBtn = document.getElementById('timer-trigger-btn');
    triggerBtn.innerText = "▶ Chạy Thời Gian";
    triggerBtn.style.backgroundColor = "var(--text-royal-espresso)";
}

// --- BREW JOURNAL LƯU TRỮ LOCALSTORAGE ---
function commitJournalEntry() {
    const journalInputField = document.getElementById('journal-field');
    const logText = journalInputField.value.trim();
    if (!logText) return;

    let localLogs = JSON.parse(localStorage.getItem('premium_luxury_logs')) || [];
    localLogs.unshift(logText);
    localStorage.setItem('premium_luxury_logs', JSON.stringify(localLogs));
    
    journalInputField.value = "";
    populateJournalUI();
}

function populateJournalUI() {
    const zone = document.getElementById('journal-output-zone');
    let localLogs = JSON.parse(localStorage.getItem('premium_luxury_logs')) || [];
    
    if (localLogs.length === 0) {
        zone.innerHTML = `<p style="font-size:0.85rem; color:var(--text-taupe-muted); font-style:italic; margin:0;">Bàn ký ký sự trống.</p>`;
        return;
    }
    
    zone.innerHTML = localLogs.slice(0, 3).map(entry => `
        <div class="journal-entry-row">❖ ${entry}</div>
    `).join('');
}

function handleFaqToggle(selectedNode) {
    const isAlreadyOpen = selectedNode.classList.contains('open');
    document.querySelectorAll('.faq-node').forEach(node => node.classList.remove('open'));
    if (!isAlreadyOpen) {
        selectedNode.classList.add('open');
    }
}

function triggerCompletionAll() {
    navigateToCard(9);
    shatterCelebrationConfetti();
}

function rebootTheWizard() {
    handleTimerReset();
    navigateToCard(1);
}

function shatterCelebrationConfetti() {
    confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#C5A880', '#1A0F0A', '#FBF9F6', '#2F4F4F']
    });
}

// --- ĐỒNG BỘ HẸN GIỜ TRÊN APP LỊCH HỆ THỐNG (.ICS) ---
function henGioColdBrew(hoursToSteep) {
    const now = new Date();
    const endTime = new Date(now.getTime() + hoursToSteep * 60 * 60 * 1000);
    
    const formatTime = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const startTimeStr = formatTime(now);
    const endTimeStr = formatTime(endTime);

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cold Brew Guide//Remind Me//VN
BEGIN:VEVENT
UID:${Date.now()}@coldbrew.guide
DTSTAMP:${startTimeStr}
DTSTART:${endTimeStr}
DTEND:${endTimeStr}
SUMMARY:☕ Lọc bã cà phê Cold Brew thôi bạn ơi!
DESCRIPTION:Cà phê của bạn đã ngâm đủ ${hoursToSteep} tiếng rồi đó. Hãy lọc bã và thưởng thức thôi!
BEGIN:VALARM
TRIGGER:-PT10M
ACTION:DISPLAY
DESCRIPTION:Nhắc nhở lọc Cold Brew
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nhac-nho-coldbrew-${hoursToSteep}h.ics`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- HÀM XỬ LÝ CLICK ĐỂ BẬT/TẮT VÀ ẨN HIGHLIGHT TOOLTIP TRÊN ĐIỆN THOẠI ---
function initMobileWikiTooltips() {
    const highlights = document.querySelectorAll('.wiki-highlight');
    
    highlights.forEach(el => {
        el.addEventListener('click', (e) => {
            // Chỉ can thiệp bằng JS nếu thiết bị không hỗ trợ hover (Màn hình cảm ứng Mobile)
            if (window.matchMedia('(hover: none)').matches) {
                e.stopPropagation(); // Ngăn sự kiện click lan ra đối tượng cha bên ngoài
                
                const isCurrentlyActive = el.classList.contains('touch-active');
                
                // Đóng toàn bộ các Tooltip khác đang mở trước đó
                highlights.forEach(h => h.classList.remove('touch-active'));
                
                // Bật/tắt trạng thái của phần tử hiện tại
                if (!isCurrentlyActive) {
                    el.classList.add('touch-active');
                }
            }
        });
    });

    // Khi chạm ra ngoài vùng trống của màn hình, tự động đóng toàn bộ Tooltip đang kẹt
    document.addEventListener('click', () => {
        highlights.forEach(h => h.classList.remove('touch-active'));
    });
}

// --- KHỞI CHẠY ĐỒNG BỘ KHI LOAD TRANG ---
window.addEventListener('load', () => {
    runGoldRatioCalc();
    populateJournalUI();
    updateLuxuryProgressBar();
    initMobileWikiTooltips(); // Kích hoạt bộ lắng nghe sự kiện chạm sửa lỗi highlight
});
