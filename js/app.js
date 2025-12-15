// Saati güncelle
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const el = document.getElementById("current-time");
  if (el) el.textContent = timeString;
}

// Line numbers oluştur
function generateLineNumbers() {
  const activeContent = document.querySelector(".tab-content.active");
  const lineNumbers = document.getElementById("lineNumbers");
  if (!activeContent || !lineNumbers) return;

  // <br> split (template’in yapısına uygun)
  const lines = activeContent.innerHTML.split("<br>").length;

  lineNumbers.innerHTML = "";
  for (let i = 1; i <= lines; i++) {
    lineNumbers.innerHTML += `<span>${i}</span>`;
  }
}

// Tab adlarını döndür
function getTabName(fileId) {
  const names = {
    me: "Me.cs",
    skills: "Skills.cs",
    experience: "Experience.cs",
    projects: "Projects.cs",
    education: "Education.cs",
    contact: "Contact.cs",
  };
  return names[fileId] || fileId + ".cs";
}

// Tab ikonlarını döndür
function getTabIcon(fileId) {
  const icons = {
    me: '<i class="fas fa-user"></i>',
    skills: '<i class="fas fa-code"></i>',
    experience: '<i class="fas fa-briefcase"></i>',
    projects: '<i class="fas fa-gamepad"></i>',
    education: '<i class="fas fa-graduation-cap"></i>',
    contact: '<i class="fas fa-envelope"></i>',
  };
  return icons[fileId] || '<i class="fas fa-file-code"></i>';
}

// Tab açma fonksiyonu
function openTab(fileId) {
  // Tüm tab içeriklerini gizle
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // İlgili tab içeriğini göster
  const targetContent = document.getElementById(fileId + "-content");
  if (targetContent) {
    targetContent.classList.add("active");

    // Current file'ı güncelle
    const currentFile = document.getElementById("current-file");
    if (currentFile) currentFile.textContent = getTabName(fileId);

    // Line numbers'ı yeniden oluştur
    setTimeout(generateLineNumbers, 10);
  }

  // Tab'ı aç veya aktif et
  const tabs = document.querySelectorAll(".tab");
  let tabExists = false;

  tabs.forEach((tab) => {
    if (tab.getAttribute("data-tab") === fileId) {
      tabExists = true;

      // Tüm tab'ları pasif yap
      tabs.forEach((t) => t.classList.remove("active"));

      // Bu tab'ı aktif yap
      tab.classList.add("active");
    }
  });

  // Eğer tab zaten yoksa, yeni tab ekle
  if (!tabExists && targetContent) {
    const tabName = getTabName(fileId);
    const tabIcon = getTabIcon(fileId);

    const newTab = document.createElement("div");
    newTab.className = "tab active";
    newTab.setAttribute("data-tab", fileId);
    newTab.innerHTML = `
      ${tabIcon}
      <span>${tabName}</span>
      <span class="tab-close" data-tab="${fileId}"><i class="fas fa-times"></i></span>
    `;

    // Tüm tab'ları pasif yap
    tabs.forEach((t) => t.classList.remove("active"));

    const tabsContainer = document.querySelector(".editor-tabs");
    if (tabsContainer) tabsContainer.appendChild(newTab);
  }

  // Dosya gezginini aktif yap
  document.querySelectorAll(".file-item").forEach((item) => {
    item.classList.remove("active");
    if (item.getAttribute("data-file") === fileId) item.classList.add("active");
  });
}

// Tab kapatma fonksiyonu
function closeTab(fileId) {
  // Tab'ı kaldır
  const tabToRemove = document.querySelector(`.tab[data-tab="${fileId}"]`);
  const wasActive = tabToRemove ? tabToRemove.classList.contains("active") : false;
  if (tabToRemove) tabToRemove.remove();

  // İçeriği gizle
  const contentToHide = document.getElementById(fileId + "-content");
  if (contentToHide) contentToHide.classList.remove("active");

  // Dosya gezgininden aktifliği kaldır
  document.querySelectorAll(".file-item").forEach((item) => {
    if (item.getAttribute("data-file") === fileId) item.classList.remove("active");
  });

  // Eğer kapatılan tab aktifse, bir başka tab'a geç
  if (wasActive) {
    const allTabs = document.querySelectorAll(".tab");
    if (allTabs.length > 0) {
      const nextTab = allTabs[allTabs.length - 1];
      const nextFileId = nextTab.getAttribute("data-tab");
      openTab(nextFileId);
      return;
    }
  }

  // Eğer hiç tab kalmadıysa, Me.cs'yi aç
  const remainingTabs = document.querySelectorAll(".tab");
  if (remainingTabs.length === 0) {
    openTab("me");
  }
}

// Kullanıcı bilgilerini güncelleme fonksiyonu
function updateUserInfo(info) {
  // Profil bilgileri
  const profileName = document.getElementById("profileName");
  const profileTitle = document.getElementById("profileTitle");
  const profileLocation = document.getElementById("profileLocation");

  if (profileName) profileName.textContent = `${info.name} ${info.surname}`;
  if (profileTitle) profileTitle.textContent = info.title;
  if (profileLocation) profileLocation.textContent = info.location;

  // Me.cs içeriğini güncelle
  const meContent = document.getElementById("me-content");
  if (meContent) {
    meContent.innerHTML = meContent.innerHTML
      .replace(/Adınız/g, info.name)
      .replace(/Soyadınız/g, info.surname)
      .replace(/Unity Game Developer/g, info.title)
      .replace(/ExperienceYears = 3/g, `ExperienceYears = ${info.experienceYears}`)
      .replace(/İstanbul, Türkiye/g, info.location);
  }

  // Contact.cs içeriğini güncelle
  const contactContent = document.getElementById("contact-content");
  if (contactContent) {
    contactContent.innerHTML = contactContent.innerHTML
      .replace(/email@adresiniz\.com/g, info.email)
      .replace(/\+90 5XX XXX XX XX/g, info.phone)
      .replace(/linkedin\.com\/in\/kullaniciadi/g, info.linkedin)
      .replace(/github\.com\/kullaniciadi/g, info.github)
      .replace(/portfolioadresiniz\.com/g, "");
  }

  // Sosyal medya linklerini güncelle
  const githubLink = document.getElementById("githubLink");
  const linkedinLink = document.getElementById("linkedinLink");
  const youtubeLink = document.getElementById("youtubeLink");

  if (githubLink) githubLink.href = `https://${info.github}`;
  if (linkedinLink) linkedinLink.href = `https://${info.linkedin}`;
  if (youtubeLink) youtubeLink.href = `https://${info.youtube}`;

  // Line numbers'ı yeniden oluştur
  setTimeout(generateLineNumbers, 10);
}

/* =========================
   INIT / EVENTS
========================= */

document.addEventListener("DOMContentLoaded", function () {
  // Mobil menü toggle
  const mobileToggle = document.getElementById("mobileToggle");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (mobileToggle && sidebar && sidebarOverlay) {
    mobileToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      sidebar.classList.toggle("active");
      sidebarOverlay.classList.toggle("active");
      mobileToggle.innerHTML = sidebar.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Overlay'e tıklayınca menüyü kapat
    sidebarOverlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });

    // Sayfa dışına tıklayınca mobil menüyü kapat
    document.addEventListener("click", function (event) {
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(event.target) && !mobileToggle.contains(event.target)) {
          sidebar.classList.remove("active");
          sidebarOverlay.classList.remove("active");
          mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });

    // Pencere boyutu değiştiğinde
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
      generateLineNumbers();
    });
  } else {
    // Yine de line numbers resize’ını çalıştır
    window.addEventListener("resize", generateLineNumbers);
  }

  // Dosya gezgini tıklama olayları
  document.querySelectorAll(".file-item").forEach((item) => {
    item.addEventListener("click", function () {
      // Aktif dosyayı güncelle
      document.querySelectorAll(".file-item").forEach((i) => {
        i.classList.remove("active");
        i.querySelector(".file-status")?.remove();
      });
      this.classList.add("active");

      const fileId = this.getAttribute("data-file");

      // Yeni dosyalar için badge ekle
      if (fileId === "me") {
        const badge = document.createElement("span");
        badge.className = "file-status";
        badge.textContent = "NEW";
        this.appendChild(badge);
      }

      // Tab'ı aç veya aktif et
      openTab(fileId);

      // Mobilde menüyü kapat
      if (window.innerWidth <= 768 && sidebar && sidebarOverlay && mobileToggle) {
        sidebar.classList.remove("active");
        sidebarOverlay.classList.remove("active");
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // ✅ FIX: TAB BAR (mevcut + sonradan eklenen) için tek handler
  const tabsContainer = document.querySelector(".editor-tabs");
  if (tabsContainer) {
    tabsContainer.addEventListener("click", function (e) {
      // Close butonu
      const closeBtn = e.target.closest(".tab-close");
      if (closeBtn) {
        e.stopPropagation();
        const fileId = closeBtn.getAttribute("data-tab");
        closeTab(fileId);
        return;
      }

      // Tab'a tıklama
      const tab = e.target.closest(".tab");
      if (tab) {
        const fileId = tab.getAttribute("data-tab");
        openTab(fileId);
      }
    });
  }

  // Saat + line numbers
  updateTime();
  generateLineNumbers();

  // Saati her dakika güncelle
  setInterval(updateTime, 60000);

  // Kullanıcı bilgilerini güncelle (buraya kendi bilgilerini yaz)
  updateUserInfo({
    name: "Yusuf Salih",
    surname: "TUNÇEL",
    title: "Unity Developer",
    location: "Bursa-Osmangazi, Türkiye",
    experienceYears: 5,
    email: "saliht94@gmail.com",
    phone: "+90 505 400 21 30",
    linkedin: "linkedin.com/in/nadaked",
    github: "github.com/ysalihtuncel",
    youtube: "youtube.com/salihtuncel",
    portfolio: "yusufsalihtuncel.com",
  });

  // Örnek kullanıcı bilgileri (kendi bilgilerinle değiştir)
  const sampleUserInfo = {
    name: "Yusuf Salih",
    surname: "TUNÇEL",
    title: "Unity Developer",
    location: "Bursa-Osmangazi, Türkiye",
    experienceYears: 5,
    email: "saliht94@gmail.com",
    phone: "+90 505 400 21 30",
    linkedin: "linkedin.com/in/nadaked",
    github: "github.com/ysalihtuncel",
    youtube: "youtube.com/salihtuncel",
    portfolio: "yusufsalihtuncel.com",
  };

  // Sayfa yüklendiğinde örnek bilgileri yükle
  setTimeout(() => updateUserInfo(sampleUserInfo), 100);

  // İlk açılış: Me.cs aktif olsun (varsa)
  openTab("me");
});
