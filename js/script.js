document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");

      // Toggle icon between bars and times
      const icon = mobileToggle.querySelector("i");
      if (navLinks.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
      } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  }

  // 2. Mobile Dropdown Toggle
  const dropdownBtn = document.querySelector(".dropbtn");
  const dropdown = document.querySelector(".dropdown");

  if (dropdownBtn && dropdown && window.innerWidth <= 768) {
    dropdownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.classList.toggle("active");
    });
  }

  // 3. Optional: Add shadow to navbar on scroll
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
      } else {
        navbar.style.boxShadow = "var(--shadow-sm)";
      }
    });
  }

    // 4. Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    if (themeToggleBtn && themeIcon) {
        // Check for saved user preference, if any, on load of the website
        let currentTheme = localStorage.getItem('theme');
        
        // กำหนดโหมดมืดเป็นค่าเริ่มต้น
        if (!currentTheme) {
            currentTheme = 'dark';
        }

        // เซ็ตธีมปัจจุบัน
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }

        themeToggleBtn.addEventListener('click', () => {
            let targetTheme = 'light';
            if (document.documentElement.getAttribute('data-theme') !== 'dark') {
                targetTheme = 'dark';
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }

            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('theme', targetTheme);
        });
    }

    // 5. ระบบป้องกันการคัดลอกและดูโค้ด (Anti-Copy System)
    // บล็อคคลิกขวา
    document.addEventListener('contextmenu', event => event.preventDefault());

    // บล็อคการคลุมดำเลือกข้อความ
    document.addEventListener('selectstart', event => {
        // อนุญาตให้คลุมดำในช่องพิมพ์ข้อความ (input/textarea) เท่านั้น
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
            event.preventDefault();
        }
    });

    // บล็อคการลากวาง (กันลากรูป ก๊อปปี้ไปที่อื่น)
    document.addEventListener('dragstart', event => event.preventDefault());

    // บล็อคปุ่มคีย์บอร์ดที่เกี่ยวข้องกับการดูโค้ดและคัดลอก
    document.addEventListener('keydown', event => {
        // F12 (Developer Tools)
        if (event.key === 'F12' || event.keyCode === 123) {
            event.preventDefault();
        }
        
        // Ctrl/Cmd กดยากขึ้น
        if (event.ctrlKey || event.metaKey) {
            const key = event.key ? event.key.toLowerCase() : '';
            // Ctrl+U (ดู Source Code)
            if (key === 'u' || event.keyCode === 85) event.preventDefault();
            // Ctrl+S (เซฟหน้าเว็บ)
            if (key === 's' || event.keyCode === 83) event.preventDefault();
            // Ctrl+C (คัดลอก) - อนุญาตเฉพาะเวลาพิมพ์ในช่องพิมพ์
            if ((key === 'c' || event.keyCode === 67) && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                event.preventDefault();
            }
            // Ctrl+A (เลือกทั้งหมด)
            if ((key === 'a' || event.keyCode === 65) && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                event.preventDefault();
            }
            
            // Ctrl+Shift+I / J / C (เปิด DevTools รูปแบบต่างๆ)
            if (event.shiftKey) {
                if (key === 'i' || event.keyCode === 73) event.preventDefault();
                if (key === 'j' || event.keyCode === 74) event.preventDefault();
                if (key === 'c' || event.keyCode === 67) event.preventDefault();
            }
        }
    });
});
