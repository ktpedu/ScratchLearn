// webboard.js
// -------------------------------------------------------------
// ระบบกระดานสนทนา (Webboard) ทำงานผ่าน LocalStorage
// โดยข้อมูลที่พิมพ์จะถูกบันทึกไว้ในเบราว์เซอร์ของผู้ใช้
// หากต้องการให้ใช้งานได้จริงแบบเรียลไทม์กับผู้ใช้อื่นด้วย
// สามารถสลับไปต่อ API ของ Firebase Realtime Database ได้ภายหลัง
// -------------------------------------------------------------

// ข้อมูลตั้งต้นสำหรับให้หน้าเว็บไม่ว่างเปล่า
const initialTopics = [
  {
    id: "topic-1",
    title: "สอบถามวิธีทำให้ตัวละครเปลี่ยนชุดคอสตูมสลับกันครับ",
    author: "ผู้เรียน01",
    category: "สอบถามการเขียนโค้ด",
    icon: "fa-user-astronaut",
    bgColor: "#FFF3EB",
    textColor: "var(--primary-color)",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 ชั่วโมงที่แล้ว
    views: 12,
    replies: 3,
  },
  {
    id: "topic-2",
    title: "แชร์โปรเจกต์: เกมเก็บแอปเปิล ฝากติชมหน่อยครับ",
    author: "GamerScratch",
    category: "โชว์ผลงาน",
    icon: "fa-user-ninja",
    bgColor: "#E2E8F0",
    textColor: "#4A5568",
    timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 วันที่แล้ว
    views: 45,
    replies: 8,
  },
];

// ฟังก์ชันแปลงเวลาเป็น "เวลาผ่านไป..."
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " ปีที่แล้ว";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " เดือนที่แล้ว";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " วันที่แล้ว";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " ชั่วโมงที่แล้ว";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " นาทีที่แล้ว";

  return "ไม่กี่วินาทีที่แล้ว";
}

// ฟังก์ชันป้องกัน XSS (ป้องกันการฝังโค้ดสคริปต์ก่อกวน)
function escapeHTML(str) {
  if (!str) return "";
  return str.toString().replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag]));
}

// โหลดข้อมูลกระทู้
function loadTopics(searchQuery = "") {
  const container = document.getElementById("topicsContainer");

  // โหลดจาก LocalStorage ถ้าไม่มีให้ใช้ initialTopics
  let topics = JSON.parse(localStorage.getItem("scratchWebboardTopics"));
  if (!topics) {
    topics = initialTopics;
    localStorage.setItem("scratchWebboardTopics", JSON.stringify(topics));
  }

  // กรองข้อมูลง่ายๆ สำหรับช่องค้นหา
  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // เรียงตามเวลาล่าสุด
  filteredTopics.sort((a, b) => b.timestamp - a.timestamp);

  // สร้าง HTML
  let html = `
        <!-- Thread (Pinned) -->
        <div style="padding: 20px 25px; background: rgba(255, 107, 53, 0.05); display: flex; gap: 20px; align-items: flex-start; transition: var(--transition-fast);">
            <div style="width: 50px; height: 50px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; flex-shrink: 0;">
                <i class="fa-solid fa-bullhorn"></i>
            </div>
            <div style="flex: 1;">
                <h3 style="font-size: 1.15rem; margin-bottom: 5px; color: var(--text-main); cursor: pointer;"><i class="fa-solid fa-thumbtack highlight" style="margin-right: 5px; font-size: 0.9rem;"></i> กติกาการใช้งานกระดานสนทนา</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 5px;">โดย ผู้สอน • ประกาศ • หมวดหมู่: ประกาศ</p>
            </div>
            <div style="text-align: right; color: var(--text-muted); font-size: 0.9rem; flex-shrink: 0;">
                <div><i class="fa-solid fa-lock" style="margin-right: 5px;"></i> ปิดการตอบ</div>
            </div>
        </div>
    `;

  if (filteredTopics.length === 0) {
    html += `<div style="padding: 40px; text-align: center; color: var(--text-muted);">ไม่พบกระทู้ที่ค้นหา</div>`;
  } else {
    filteredTopics.forEach((topic) => {
      html += `
                <div style="padding: 20px 25px; border-top: 1px solid var(--border-color-light); display: flex; gap: 20px; align-items: flex-start; transition: var(--transition-fast);">
                    <div style="width: 50px; height: 50px; background-color: ${topic.bgColor}; color: ${topic.textColor}; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; flex-shrink: 0;">
                        <i class="fa-solid ${topic.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 1.15rem; margin-bottom: 5px; cursor: pointer;" onclick="alert('ฟังก์ชันดูรายการกระทู้ยังไม่เปิดให้บริการในส่วนแสดงผลนี้ (โหมดจำลอง)')">${escapeHTML(topic.title)}</h3>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 5px;">โดย ${escapeHTML(topic.author)} • ${timeAgo(topic.timestamp)} • หมวดหมู่: ${escapeHTML(topic.category)}</p>
                    </div>
                    <div style="text-align: right; color: var(--text-muted); font-size: 0.9rem; flex-shrink: 0;">
                        <div><i class="fa-solid fa-comment" style="margin-right: 5px;"></i> ${topic.replies}</div>
                        <div><i class="fa-solid fa-eye" style="margin-right: 5px;"></i> ${topic.views}</div>
                    </div>
                </div>
            `;
    });
  }

  container.innerHTML = html;
}

// ฟังก์ชันเปิด Modal
function openNewTopicModal() {
  document.getElementById("newTopicModal").classList.add("active");
  // ล้างข้อมูลฟอร์มด้วย
  document.getElementById("topicTitle").value = "";
  document.getElementById("topicAuthor").value = "";
  document.getElementById("topicCategory").value = "สอบถามการเขียนโค้ด";
}

// ฟังก์ชันปิด Modal
function closeNewTopicModal() {
  document.getElementById("newTopicModal").classList.remove("active");
}

// ฟังก์ชันเพิ่มกระทู้ใหม่
function submitNewTopic() {
  const title = document.getElementById("topicTitle").value.trim();
  const author = document.getElementById("topicAuthor").value.trim();
  const category = document.getElementById("topicCategory").value;

  if (!title || !author) {
    alert("กรุณากรอกหัวข้อ และชื่อผู้ตั้งกระทู้ให้ครบถ้วน");
    return;
  }

  // ไอคอนและสีแบบสุ่มเพื่อความสวยงาม
  const icons = [
    "fa-user-astronaut",
    "fa-user-ninja",
    "fa-user-tie",
    "fa-user-secret",
    "fa-user-graduate",
  ];
  const colors = [
    { bg: "#FFF3EB", text: "var(--primary-color)" },
    { bg: "#E2E8F0", text: "#4A5568" },
    { bg: "#E6FFFA", text: "#319795" },
    { bg: "#EBF8FF", text: "#3182CE" },
    { bg: "#FAF5FF", text: "#805AD5" },
  ];

  const randomIcon = icons[Math.floor(Math.random() * icons.length)];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  const newTopic = {
    id: "topic-" + Date.now(),
    title: title,
    author: author,
    category: category,
    icon: randomIcon,
    bgColor: randomColor.bg,
    textColor: randomColor.text,
    timestamp: Date.now(),
    views: 0,
    replies: 0,
  };

  // เซฟลง LocalStorage
  let topics = JSON.parse(localStorage.getItem("scratchWebboardTopics")) || [];
  topics.push(newTopic);
  localStorage.setItem("scratchWebboardTopics", JSON.stringify(topics));

  // ปิด Modal และโหลดเนื้อหาใหม่
  closeNewTopicModal();
  loadTopics();
}

// ค้นหากระทู้
function searchTopics() {
  const query = document.getElementById("searchInput").value;
  loadTopics(query);
}

// เรียกตอนโหลดไฟล์เสร็จ
document.addEventListener("DOMContentLoaded", () => {
  loadTopics();
});
