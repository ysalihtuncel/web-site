# MyCV – Config Driven CV Website

Bu proje, **hiçbir HTML veya JS koduna dokunmadan**, sadece `config.js` dosyasını düzenleyerek
kişisel CV web sitesini güncellemenizi sağlayan **config-driven** bir yapıya sahiptir.

Site, Visual Studio / C# editörü temalıdır ve tüm içerik **gerçek C# dosyaları gibi** render edilir.

---

## 🔧 Temel Mantık

- **HTML** → Sabit layout (editör görünümü)
- **app.js** → Davranış + render motoru
- **config.js** → Tüm içerik (tek kaynak)

> ❗ Site içeriğini değiştirmek için **SADECE `config.js`** düzenlenmelidir.

---

## 📁 Dosya Yapısı

```
/index.html
/js
  ├── config.js      ← ✨ SADECE BURAYI DÜZENLE
  └── app.js
/css
  └── style.css
```

---

## 🧩 config.js Yapısı

```js
window.CV_CONFIG = {
  profile: { ... },
  skills: { ... },
  experience: [ ... ],
  projects: [ ... ],
  education: [ ... ],
  contact: { ... }
};
```

---

## 👤 Profile (Me.cs)

```js
profile: {
  firstName: "Yusuf Salih",
  lastName: "Tunçel",
  title: "Unity Developer",
  experienceYears: 5,
  location: "Bursa, Türkiye",
  projectCount: 30,
  profileImage: "images/profile.jpg",
  social: {
    github: "https://github.com/...",
    linkedin: "https://linkedin.com/in/...",
    youtube: "https://youtube.com/..."
  }
}
```

---

## 🧠 Skills (Skills.cs)

```js
skills: {
  technical: [
    "Unity Engine",
    "C# Programming",
    "3D-2D Game Development"
  ],
  soft: [
    "Problem Solving",
    "Team Collaboration"
  ]
}
```

---

## 💼 Experience (Experience.cs)

```js
experience: [
  {
    company: "Bambu Games",
    position: "Senior Unity Developer",
    start: "2025-06",
    end: null,
    technologies: ["Unity", "C#"],
    responsibilities: [
      "2D oyun mekanikleri geliştirme",
      "Performans optimizasyonu"
    ]
  }
]
```

---

## 🎮 Projects (Projects.cs)

```js
projects: [
  {
    name: "Babylon Solitaire",
    genre: "Cards",
    platform: "Android",
    date: "2025-08",
    description: "Kart eşleştirme oyunu",
    technologies: ["Unity", "C#"],
    linkLabel: "Google Play",
    linkUrl: "https://play.google.com/..."
  }
]
```

---

## 🎓 Education (Education.cs)

```js
education: [
  {
    institution: "Süleyman Demirel Üniversitesi",
    degree: "Lisans",
    field: "Bilgisayar Mühendisliği",
    period: "2013 - 2018"
  }
]
```

---

## 📞 Contact (Contact.cs)

```js
contact: {
  email: "mail@example.com",
  phone: "+90 ...",
  linkedin: "https://linkedin.com/in/...",
  github: "https://github.com/..."
}
```

---

## 🍔 Mobil Menü

- Tıklayınca açılır
- Açıkken tekrar tıklayınca kapanır
- Dışarıya tıklayınca kapanır
- Basılı tutma veya gesture yok

---

## ✅ Avantajlar

✔ Tek dosyadan yönetim  
✔ HTML / JS bozulmaz  
✔ C# kod estetiği korunur  
✔ Genişletilebilir yapı  

---

## 🚀 Sonuç

Bu site, klasik CV sitelerinden farklı olarak **bir yazılımcının CV’sini kod gibi anlatması** fikri üzerine kuruludur.
