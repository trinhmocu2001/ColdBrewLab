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

    // DOM các thẻ kết quả hiển thị
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

    // 1. Tính toán lượng nước
    let dynamicWater = Math.round(grams * ratio);
    waterDisplayVal.innerText = dynamicWater.toLocaleString('vi-VN');
    if (nestedWaterText) {
        nestedWaterText.innerText = `${dynamicWater}ml`;
    }

    // 2. Cấu hình Kích thước hạt theo Phương Pháp Pha (Brewing Method)
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

    // 3. Cấu hình Nốt hương dự kiến theo Loại Hạt (Coffee Beans)
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

window.addEventListener('load', () => {
    runGoldRatioCalc();
    populateJournalUI();
    updateLuxuryProgressBar();
});
function henGioColdBrew(hoursToSteep) {
    // 1. Lấy thời gian hiện tại
    const now = new Date();
    
    // 2. Tính thời gian sau X tiếng nữa (khi Cold Brew chín)
    const endTime = new Date(now.getTime() + hoursToSteep * 60 * 60 * 1000);
    
    // Định dạng thời gian theo chuẩn file Lịch (YYYYMMDDTHHMMSSZ)
    const formatTime = (date) => {
        return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const startTimeStr = formatTime(now);
    const endTimeStr = formatTime(endTime);

    // 3. Tạo nội dung file Lịch (.ics) chuẩn hệ điều hành
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

    // 4. Tạo link tải xuống và kích hoạt trên điện thoại
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nhac-nho-coldbrew.ics';
    
    // Kích hoạt app Lịch trên điện thoại mở ra
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// VÍ DỤ CÁCH DÙNG:
// Khi người dùng bấm nút "Bắt đầu ngâm 16 tiếng"
document.getElementById("start-timer-btn").addEventListener("click", () => {
    // Chạy đếm ngược trên giao diện web như cũ
    // ... code chạy timeline của bạn ...
    
    // Đồng thời gọi hàm này để kích hoạt hẹn giờ vào hệ thống điện thoại
    henGioColdBrew(16); // Truyền số 16 tiếng vào đây
});