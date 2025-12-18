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

/* =========================
   CONFIG RENDERING
========================= */

function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function nbsp(count) {
  return "&nbsp;".repeat(count);
}

function line(html) {
  return html + "<br>";
}

function kw(t) {
  return `<span class="keyword">${escHtml(t)}</span>`;
}
function cl(t) {
  return `<span class="class-name">${escHtml(t)}</span>`;
}
function fn(t) {
  return `<span class="function">${escHtml(t)}</span>`;
}
function st(t) {
  return `<span class="string">"${escHtml(t)}"</span>`;
}
function cm(t) {
  return `<span class="comment">${escHtml(t)}</span>`;
}
function nb(n) {
  return `<span class="number">${escHtml(n)}</span>`;
}
function vr(t) {
  return `<span class="variable">${escHtml(t)}</span>`;
}

function applyConfigToSidebar(config) {
  if (!config) return;

  const p = config.profile || {};
  const profileName = document.getElementById("profileName");
  const profileTitle = document.getElementById("profileTitle");
  const profileLocation = document.getElementById("profileLocation");
  const profileImage = document.getElementById("profileImage");

  if (profileName) profileName.textContent = `${p.firstName || ""} ${p.lastName || ""}`.trim();
  if (profileTitle) profileTitle.textContent = p.title || "";
  if (profileLocation) profileLocation.textContent = p.location || "";
  if (profileImage && p.profileImage) profileImage.src = p.profileImage;

  const social = p.social || {};
  const githubLink = document.getElementById("githubLink");
  const linkedinLink = document.getElementById("linkedinLink");
  const youtubeLink = document.getElementById("youtubeLink");

  if (githubLink && social.github) githubLink.href = social.github;
  if (linkedinLink && social.linkedin) linkedinLink.href = social.linkedin;
  if (youtubeLink && social.youtube) youtubeLink.href = social.youtube;
}

function renderMe(config) {
  const p = config.profile || {};
  const ind = (n) => nbsp(n * 4);

  let html = "";

  html += line(`${kw("using")} UnityEngine;`);
  html += line("");
  html += line(`${kw("namespace")} ${cl("MyCV")}`);
  html += line("{");
  html += line(`${ind(1)}[${cl("CreateAssetMenu")}(menuName = ${st("MyCV/Profile")}, fileName = ${st("Profile")})]`);
  html += line(`${ind(1)}${kw("public class")} ${cl("ProfileAsset")} : ${cl("ScriptableObject")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("public string")} firstName = ${st(p.firstName || "")};`);
  html += line(`${ind(2)}${kw("public string")} lastName = ${st(p.lastName || "")};`);
  html += line(`${ind(2)}${kw("public string")} title = ${st(p.title || "")};`);
  html += line(`${ind(2)}[${cl("Min")}(0)] ${kw("public int")} experienceYears = ${nb(p.experienceYears ?? 0)};`);
  html += line(`${ind(2)}${kw("public string")} location = ${st(p.location || "")};`);
  html += line(`${ind(2)}[${cl("Min")}(0)] ${kw("public int")} projectCount = ${nb(p.projectCount ?? 0)};`);
  html += line(`${ind(1)}}`);
  html += line("");
  html += line("");
  html += line(`${ind(1)}${kw("public class")} ${cl("ProfilePresenter")} : ${cl("MonoBehaviour")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}[${cl("SerializeField")}] ${kw("private")} ${cl("ProfileAsset")} profile;`);
  html += line("");
  html += line(`${ind(2)}${kw("private void")} ${fn("Start")}()`);
  html += line(`${ind(2)}{`);
  html += line(`${ind(3)}${kw("if")} (profile == ${kw("null")})`);
  html += line(`${ind(3)}{`);
  html += line(`${ind(4)}${cl("Debug")}.LogError(${st("ProfileAsset atanmadı.")});`);
  html += line(`${ind(4)}${kw("return")};`);
  html += line(`${ind(3)}}`);
  html += line("");
  html += line(`${ind(3)}${cl("Debug")}.Log(${st("🚀 CV başlatılıyor...")});`);
  html += line(`${ind(3)}${cl("Debug")}.Log($${st("👋 Merhaba! Ben {profile.firstName} {profile.lastName}")});`.replace('$"', '"$'));
  html += line(`${ind(3)}${cl("Debug")}.Log($${st("🎮 Unity ile {profile.experienceYears} yıldır oyun geliştiriyorum.")});`.replace('$"', '"$'));
  html += line(`${ind(3)}${cl("Debug")}.Log($${st("📍 Konum: {profile.location}")});`.replace('$"', '"$'));
  html += line(`${ind(3)}${cl("Debug")}.Log(${st("💻 Uzmanlık: C#, 2D/3D, oyun mekaniği, tasarım desenleri.")});`);
  html += line(`${ind(3)}${cl("Debug")}.Log($${st("🌟 {profile.projectCount}+ projede yer aldım.")});`.replace('$"', '"$'));
  html += line(`${ind(2)}}`);
  html += line(`${ind(1)}}`);
  html += line("}");
  html += `<span class="cursor"></span>`;

  return html;
}

function renderSkills(config) {
  const s = config.skills || { technical: [], soft: [] };
  const ind = (n) => nbsp(n * 4);

  const formatArrayInline = (arr) => {
    const groups = [];
    let i = 0;
    const pattern = [3, 2, 2];
    let pi = 0;

    while (i < arr.length) {
      const take = pattern[Math.min(pi, pattern.length - 1)];
      groups.push(arr.slice(i, i + take));
      i += take;
      pi++;
    }

    return (
      groups
        .map((g) => `${ind(3)}${g.map((x) => st(x)).join(", ")}${g.length ? "," : ""}`)
        .join("<br>") + "<br>"
    );
  };

  let html = "";
  html += line(`${kw("using")} System.Collections.Generic;`);
  html += line("");
  html += line(`${kw("namespace")} ${cl("MyCV")}`);
  html += line("{");
  html += line(`${ind(1)}${kw("public static class")} ${cl("Skills")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("private static readonly string")}[] _technical =`);
  html += line(`${ind(2)}{`);
  html += formatArrayInline(s.technical);
  html += line(`${ind(2)}};`);
  html += line("");
  html += line(`${ind(2)}${kw("private static readonly string")}[] _soft =`);
  html += line(`${ind(2)}{`);
  html += formatArrayInline(s.soft);
  html += line(`${ind(2)}};`);
  html += line("");
  html += line(`${ind(2)}${kw("public static")} ${cl("IReadOnlyList")}&lt;${kw("string")}&gt; Technical =&gt; _technical;`);
  html += line(`${ind(2)}${kw("public static")} ${cl("IReadOnlyList")}&lt;${kw("string")}&gt; Soft =&gt; _soft;`);
  html += line(`${ind(1)}}`);
  html += line("}");
  html += `<span class="cursor"></span>`;
  return html;
}

function renderExperience(config) {
  const jobs = config.experience || [];
  const ind = (n) => nbsp(n * 4);

  const joinInlineStrings = (arr) => (arr || []).map((x) => st(x)).join(", ");

  const renderResponsibilitiesBlock = (arr) => {
    const list = arr || [];
    if (list.length === 0) return "";
    return list.map((x) => `${ind(5)}${st(x)}`).join("<br>") + "<br>";
  };

  const toYearMonthParse = (yyyyMm) => `YearMonth.Parse(${st(yyyyMm || "")})`;

  const renderJob = (j, isLast) => {
    const endExpr = j.end ? toYearMonthParse(j.end) : kw("null");

    let html = "";
    html += line(`${ind(3)}new ${cl("Job")}(`);
    html += line(`${ind(4)}Company: ${st(j.company)},`);
    html += line(`${ind(4)}Position: ${st(j.position)},`);
    html += line(`${ind(4)}Start: ${toYearMonthParse(j.start)},`);
    html += line(`${ind(4)}End: ${endExpr},`);
    html += line(`${ind(4)}Technologies: new[] { ${joinInlineStrings(j.technologies)} },`);
    html += line(`${ind(4)}Responsibilities: new[]`);
    html += line(`${ind(4)}{`);
    html += renderResponsibilitiesBlock(j.responsibilities);
    html += line(`${ind(4)}}`);
    html += line(`${ind(3)})${isLast ? "" : ","}`);
    return html;
  };

  let html = "";
  html += line(`${kw("using")} System;`);
  html += line(`${kw("using")} System.Collections.Generic;`);
  html += line(`${kw("using")} System.Globalization;`);
  html += line("");
  html += line(`${kw("namespace")} ${cl("MyCV")}`);
  html += line("{");
  html += line(`${ind(1)}${kw("public readonly record struct")} ${cl("YearMonth")}(int Year, int Month)`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("public override string")} ${fn("ToString")}() =&gt; ${st("{Year:D4}-{Month:D2}")};`);
  html += line("");
  html += line(`${ind(2)}${kw("public static")} ${cl("YearMonth")} ${fn("Parse")}(string yyyyMm)`);
  html += line(`${ind(2)}{`);
  html += line(`${ind(3)}${kw("var")} dt = ${cl("DateTime")}.ParseExact(yyyyMm, ${st("yyyy-MM")}, ${cl("CultureInfo")}.InvariantCulture);`);
  html += line(`${ind(3)}${kw("return new")} ${cl("YearMonth")}(dt.Year, dt.Month);`);
  html += line(`${ind(2)}}`);
  html += line(`${ind(1)}}`);
  html += line("");
  html += line(`${ind(1)}${kw("public sealed record")} ${cl("Job")}(`);
  html += line(`${ind(2)}string Company,`);
  html += line(`${ind(2)}string Position,`);
  html += line(`${ind(2)}${cl("YearMonth")} Start,`);
  html += line(`${ind(2)}${cl("YearMonth")}? End, ${cm("// null =&gt; Present")}`);
  html += line(`${ind(2)}${cl("IReadOnlyList")}&lt;string&gt; Technologies,`);
  html += line(`${ind(2)}${cl("IReadOnlyList")}&lt;string&gt; Responsibilities`);
  html += line(`${ind(1)})`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("public string")} PeriodText =&gt; End ${kw("is")} ${kw("null")} ? ${st("{Start} - Present")} : ${st("{Start} - {End}")};`);
  html += line(`${ind(1)}}`);
  html += line("");
  html += line(`${ind(1)}${kw("public static class")} ${cl("ExperienceData")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("public static readonly")} ${cl("IReadOnlyList")}&lt;${cl("Job")}&gt; WorkHistory = ${cl("Array")}.AsReadOnly(new[]`);
  html += line(`${ind(2)}{`);

  jobs.forEach((j, i) => {
    html += line("");
    html += renderJob(j, i === jobs.length - 1);
  });

  html += line(`${ind(2)}});`);
  html += line(`${ind(1)}}`);
  html += line("}");
  html += `<span class="cursor"></span>`;
  return html;
}

function renderProjects(config) {
  const projects = config.projects || [];
  const ind = (n) => nbsp(n * 4);

  const linkValue = (label, url) => {
    if (!url) return st("");

    const safeUrl = escHtml(url);
    const safeLabel = escHtml(label || url);

    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
  };

  const genreExpr = (g) => `${cl("ProjectGenre")}.${escHtml(g || "")}`;
  const platformExpr = (p) => `${cl("Platform")}.${escHtml(p || "")}`;

  const joinInlineStrings = (arr) => (arr || []).map((x) => st(x)).join(", ");

  const renderProjectFactoryCall = (p, isLast) => {
    let html = "";
    html += line(`${ind(4)}${cl("ProjectFactory")}.${fn("Create")}(`);
    html += line(`${ind(5)}name: ${st(p.name)},`);
    html += line(`${ind(5)}genre: ${genreExpr(p.genre)},`);
    html += line(`${ind(5)}platform: ${platformExpr(p.platform)},`);
    html += line(`${ind(5)}yyyyMm: ${st(p.date)},`);
    html += line(`${ind(5)}description: ${st(p.description)},`);
    html += line(`${ind(5)}technologies: new[] { ${joinInlineStrings(p.technologies)} },`);
    html += `${ind(5)}linkUrl: ${linkValue(p.linkLabel, p.linkUrl)}<br>`;
    html += line(`${ind(4)})${isLast ? "" : ","}`);
    return html;
  };

  let html = "";
  html += line(`${kw("using")} System;`);
  html += line("");
  html += line(`${kw("namespace")} ${cl("MyCV")}`);
  html += line("{");
  html += line(`${ind(1)}${kw("public static class")} ${cl("ProjectCatalog")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("public static readonly")} System.Collections.Generic.${cl("IReadOnlyList")}&lt;${cl("Project")}&gt; Portfolio =`);
  html += line(`${ind(3)}${cl("Array")}.AsReadOnly(new[]`);
  html += line(`${ind(3)}{`);

  projects.forEach((p, i) => {
    html += line("");
    html += renderProjectFactoryCall(p, i === projects.length - 1);
  });

  html += line(`${ind(3)}});`);
  html += line(`${ind(1)}}`);
  html += line("}");
  html += `<span class="cursor"></span>`;
  return html;
}

function renderEducation(config) {
  const list = config.education || [];
  const ind = (n) => nbsp(n * 4);

  let html = "";

  html += line(`${kw("using")} UnityEngine;`);
  html += line("");
  html += line(`${kw("namespace")} ${cl("MyCV")}`);
  html += line("{");
  html += line(`${ind(1)}${kw("public class")} ${cl("Education")} : ${cl("MonoBehaviour")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}[${cl("Serializable")}]`);
  html += line(`${ind(2)}${kw("public struct")} ${cl("EducationRecord")}`);
  html += line(`${ind(2)}{`);
  html += line(`${ind(3)}${kw("public string")} Institution;`);
  html += line(`${ind(3)}${kw("public string")} Degree;`);
  html += line(`${ind(3)}${kw("public string")} Field;`);
  html += line(`${ind(3)}${kw("public string")} Period;`);
  html += line(`${ind(2)}}`);
  html += line("");
  html += line(`${ind(2)}${kw("public")} ${cl("EducationRecord")}[] EducationHistory =`);
  html += line(`${ind(2)}{`);

  list.forEach((e, idx) => {
    html += line(`${ind(3)}${kw("new")} ${cl("EducationRecord")}`);
    html += line(`${ind(3)}{`);
    html += line(`${ind(4)}Institution = ${st(e.institution || "")},`);
    html += line(`${ind(4)}Degree = ${st(e.degree || "")},`);
    html += line(`${ind(4)}Field = ${st(e.field || "")},`);
    html += line(`${ind(4)}Period = ${st(e.period || "")}`);
    html += line(`${ind(3)}}${idx === list.length - 1 ? "" : ","}`);
  });

  html += line(`${ind(2)}};`);
  html += line(`${ind(1)}}`);
  html += line("}");
  html += `<span class="cursor"></span>`;

  return html;
}


function renderContact(config) {
  const c = config.contact || {};
  const ind = (n) => nbsp(n * 4);

  let html = "";

  html += line(`${kw("using")} UnityEngine;`);
  html += line("");
  html += line(`${kw("namespace")} ${cl("MyCV")}`);
  html += line("{");
  html += line(`${ind(1)}${kw("public static class")} ${cl("Contact")}`);
  html += line(`${ind(1)}{`);
  html += line(`${ind(2)}${kw("public const string")} Email = ${st(c.email || "")};`);
  html += line(`${ind(2)}${kw("public const string")} Phone = ${st(c.phone || "")};`);
  html += line(`${ind(2)}${kw("public const string")} LinkedInUrl = ${st(c.linkedin || "")};`);
  html += line(`${ind(2)}${kw("public const string")} GitHubUrl = ${st(c.github || "")};`);
  html += line("");
  html += line(`${ind(2)}${kw("public static void")} ${fn("LogMessage")}(${kw("string")} senderName, ${kw("string")} message)`);
  html += line(`${ind(2)}{`);
  html += line(`${ind(3)}${cl("Debug")}.Log(${st("[Contact] From: ")} + senderName);`);
  html += line(`${ind(3)}${cl("Debug")}.Log(message);`);
  html += line(`${ind(2)}}`);
  html += line("");
  html += line(`${ind(2)}${kw("public static void")} ${fn("OpenEmail")}()`);
  html += line(`${ind(2)}{`);
  html += line(`${ind(3)}${cl("Application")}.OpenURL(${st("mailto:")} + Email);`);
  html += line(`${ind(2)}}`);
  html += line(`${ind(1)}}`);
  html += line("}");
  html += `<span class="cursor"></span>`;

  return html;
}

function renderAllTabs(config) {
  const map = {
    "me-content": renderMe,
    "skills-content": renderSkills,
    "experience-content": renderExperience,
    "projects-content": renderProjects,
    "education-content": renderEducation,
    "contact-content": renderContact,
  };

  Object.keys(map).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = map[id](config);
  });

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

  // ✅ HAMBURGER FIX: pointerdown + click + stopImmediatePropagation
  if (mobileToggle && sidebar && sidebarOverlay) {
    const toggleSidebar = (e) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      e.stopImmediatePropagation?.();

      const isOpen = sidebar.classList.toggle("active");
      sidebarOverlay.classList.toggle("active", isOpen);

      mobileToggle.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    };

    // Mobil tarayıcılarda en sağlamı pointerdown
    mobileToggle.addEventListener("click", toggleSidebar, { passive: false });
    mobileToggle.addEventListener("click", toggleSidebar);

    // Overlay'e dokununca kapat
    sidebarOverlay.addEventListener("click", function () {
      sidebar.classList.remove("active");
      sidebarOverlay.classList.remove("active");
      mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });

    // Sayfa dışına dokununca kapat
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

      // Yeni dosyalar için badge ekle (istersen kaldır)
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

  // TAB BAR (mevcut + sonradan eklenen) için tek handler
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

  // CONFIG: js/config.js
  const config = window.CV_CONFIG;
  if (config) {
    applyConfigToSidebar(config);
    renderAllTabs(config);
  }

  // İlk açılış
  openTab("me");
});
