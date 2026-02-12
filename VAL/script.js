const pageMain = document.getElementById('page-main');
const pageYes = document.getElementById('page-yes');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const backBtn = document.getElementById('back-btn');
const attemptCountEl = document.getElementById('attempt-count');
const funMessageEl = document.getElementById('fun-message');
const emojiContainer = document.getElementById('emoji-rain-container');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');

let attempts = 0;

const funMessages = [
  'Попробуй ещё раз 😏',
  'Кнопка «НЕТ» против тебя 🧠',
  'Судьба выбирает «ДА» 😉',
  'Физика не позволит 😂',
  'Не убегай от любви! 💘',
  'Кажется, мироздание сделало выбор…',
  'Тебе правда нужен «НЕТ»? 🤔',
  'Я всё равно знаю твой настоящий ответ 😌',
];

function updateFunMessage() {
  const index = attempts % funMessages.length;
  funMessageEl.textContent = funMessages[index];
}

function getRandomPositionForNoBtn() {
  const container = pageMain.querySelector('.card') || document.body;
  const rect = container.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  // Padding, чтобы кнопка не упиралась в края
  const padding = 16;
  const maxX = rect.width - btnRect.width - padding * 2;
  const maxY = rect.height - btnRect.height - padding * 2;

  const x = Math.random() * maxX + padding;
  const y = Math.random() * maxY + padding + 80; // чуть ниже заголовка

  // Переводим в координаты относительно .buttons
  const buttonsRect = pageMain.querySelector('.buttons').getBoundingClientRect();
  const offsetX = x - (buttonsRect.left - rect.left);
  const offsetY = y - (buttonsRect.top - rect.top);

  return { x: offsetX, y: offsetY };
}

function moveNoButton() {
  attempts += 1;
  attemptCountEl.textContent = attempts.toString();
  updateFunMessage();

  const { x, y } = getRandomPositionForNoBtn();
  noBtn.style.position = 'absolute';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transition = 'transform 0.18s ease, left 0.18s ease, top 0.18s ease';

  // Лёгкий "прыжок"
  noBtn.style.transform = 'translateY(-4px) scale(1.05)';
  setTimeout(() => {
    noBtn.style.transform = 'translateY(0) scale(1)';
  }, 180);
}

function showYesPage() {
  pageMain.classList.remove('active');
  pageYes.classList.add('active');
  startEmojiRain();
}

function showMainPage() {
  pageYes.classList.remove('active');
  pageMain.classList.add('active');
}

function startEmojiRain() {
  const emojis = ['❤️', '💖', '💘', '😍', '😘', '✨', '🥰'];

  for (let i = 0; i < 60; i += 1) {
    const emoji = document.createElement('div');
    emoji.className = 'emoji';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 2;
    const startX = Math.random() * 100;

    emoji.style.left = `${startX}vw`;
    emoji.style.animationDuration = `${duration}s`;
    emoji.style.animationDelay = `${delay}s`;

    emojiContainer.appendChild(emoji);

    setTimeout(() => {
      emoji.remove();
    }, (delay + duration) * 1000 + 500);
  }
}

let musicEnabled = false;

function toggleMusic() {
  if (!bgMusic) return;

  // Если src пустой — можно позже просто заменить в index.html
  if (!bgMusic.src) {
    // Ничего не делаем, но оставляем кнопку на будущее
    return;
  }

  musicEnabled = !musicEnabled;

  if (musicEnabled) {
    bgMusic
      .play()
      .then(() => {
        musicToggle.textContent = '🔊 Музыка вкл';
      })
      .catch(() => {
        musicEnabled = false;
        musicToggle.textContent = '🔈 Музыка выкл';
      });
  } else {
    bgMusic.pause();
    musicToggle.textContent = '🔈 Музыка выкл';
  }
}

// События
if (yesBtn) {
  yesBtn.addEventListener('click', showYesPage);
}

if (backBtn) {
  backBtn.addEventListener('click', showMainPage);
}

['mouseenter', 'mouseover', 'mousedown', 'touchstart'].forEach((eventName) => {
  noBtn.addEventListener(eventName, (e) => {
    e.preventDefault();
    moveNoButton();
  });
});

if (musicToggle) {
  musicToggle.addEventListener('click', toggleMusic);
}

// Стартовое сообщение
updateFunMessage();

