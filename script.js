// === BG Toggle ===
const btn = document.getElementById("toggleBG");
const content = document.getElementById("content");
let visible = true;
btn.onclick = () => {
  visible = !visible;
  content.style.display = visible ? "block" : "none";
};

// === Popup System ===
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closePopup");
const popupContent = document.getElementById("popupContent");

const descriptions = {
  bots: {
    title: "Multifunctional Telegram bots",
    content: `
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <!-- PhotoBuff -->
          <div class="swiper-slide p-4">
            <h4 class="text-lg font-semibold mb-1">🤖 PhotoBuff</h4>
            <p class="mb-2">Universal tg-bot for image quality upscaling.</p>
            <ul class="list-disc pl-5 mb-2">
              <li>🧠 Automatic photo style detection</li>
              <li>📤 Quick response - 2-5 sec</li>
              <li>💬 Simple to use - just send photo and get response</li>
            </ul>
            <div class="flex gap-2 mt-3 flex-wrap justify-center">
              <img src="img/photobuff2.png" class="gallery-thumb rounded-lg w-[140px] shadow" alt="demo3">
              <img src="img/in.png" class="gallery-thumb rounded-lg w-[140px] shadow" alt="before">
              <img src="img/out.png" class="gallery-thumb rounded-lg w-[140px] shadow" alt="after">
            </div>
          </div>

          <!-- Dota bot -->
          <div class="swiper-slide p-4">
            <h4 class="text-lg font-semibold mb-1">🧙‍♂️ DotaProfileBot</h4>
            <p class="mb-2">Tg-bot for fastchecking acc info:</p>
            <ul class="list-disc pl-5 mb-2">
              <li>🎖️ Tier and winrate</li>
              <li>🗡️ Last match & KDA</li>
              <li>🔥 Top chars and WR</li>
            </ul>
            <div class="flex gap-2 mt-3 flex-wrap justify-center">
              <img src="img/player1.png" class="gallery-thumb rounded-lg w-[140px] shadow" alt="player1">
              <img src="img/player2.png" class="gallery-thumb rounded-lg w-[140px] shadow" alt="player2">
            </div>
          </div>
        </div>
        <!-- Controls -->
        <div class="flex justify-between mt-4">
          <button class="prev-slide text-white bg-gray-600 px-3 py-1 rounded">&larr; Prev</button>
          <button class="next-slide text-white bg-gray-600 px-3 py-1 rounded">Next &rarr;</button>
        </div>
      </div>
    `
  },
  parsers: {
    title: "All kinds of parsers and analyzers",
    content: "From HTML to JSON — I make data mineable and pretty. Maybe I'll share it in future idk."
  },
  rpg: {
    title: "Interactive RPG games",
    content: "The world will never see this because I, as the author and creator, cannot share it with the public."
  },
  txt2excel: {
    title: "TXT ➜ Excel Converter (GUI)",
    content: `
      <p>⚙️ PyQt6-powered application that converts structured text files into beautiful Excel spreadsheets.</p>
      <ul class="list-disc pl-5 mt-2 text-left">
        <li>🔍 Automatic delimiter detection</li>
        <li>🧠 Automatic table preview</li>
        <li>🖱 Editable headers</li>
        <li>📤 Instant Excel export</li>
      </ul>
      <img src="img/txt2excel.png" alt="Text2Excel GUI" class="mt-4 rounded-lg shadow-lg w-full">
      <p class="mt-2"><a href="https://github.com/godov-gr/txt2excel-converter" target="_blank" class="text-blue-400 underline">🔗 View on GitHub</a></p>
    `
  }
};

let currentSlide = 0;
function showSlide(index) {
  const slides = document.querySelectorAll('.swiper-slide');
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => {
    slide.style.display = i === currentSlide ? 'block' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.popup-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const project = btn.getAttribute('data-project');
      const data = descriptions[project] || { title: project, content: "No description yet." };
      popup.classList.remove('hidden');
      popupContent.innerHTML = `<h3 class='text-xl font-bold mb-4'>${data.title}</h3>${data.content}`;
      if (project === 'bots') {
        setTimeout(() => {
          showSlide(0);
          document.querySelector('.next-slide')?.addEventListener('click', () => showSlide(currentSlide + 1));
          document.querySelector('.prev-slide')?.addEventListener('click', () => showSlide(currentSlide - 1));
        }, 0);
      }
    });
  });

  document.getElementById("closePopup").addEventListener("click", () => {
    popup.classList.add("hidden");
  });
});

// === Lightbox ===
let galleryImages = [];
let currentImageIndex = 0;

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('gallery-thumb')) {
    const all = [...document.querySelectorAll('.gallery-thumb')];
    galleryImages = all;
    currentImageIndex = all.indexOf(e.target);
    showLightboxImage(currentImageIndex);
  }
});

function showLightboxImage(index) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = galleryImages[index].src;
  lightbox.classList.remove('hidden');
}

document.getElementById('lightbox-close').onclick = () => {
  document.getElementById('lightbox').classList.add('hidden');
};

document.getElementById('lightbox-prev').onclick = () => {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  showLightboxImage(currentImageIndex);
};

document.getElementById('lightbox-next').onclick = () => {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  showLightboxImage(currentImageIndex);
};

document.addEventListener('keydown', (e) => {
  if (document.getElementById('lightbox').classList.contains('hidden')) return;
  if (e.key === 'Escape') document.getElementById('lightbox').classList.add('hidden');
  if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
  if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
});
