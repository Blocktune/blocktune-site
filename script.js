// script.js – Interactions BlockTune

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('nav ul.nav-links');

  // Ajout du bouton croix dynamiquement dans le header
  const closeBtn = document.createElement('div');
  closeBtn.classList.add('close-menu');
  closeBtn.innerHTML = '&times;';
  document.querySelector('header.navbar').appendChild(closeBtn);

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.add('active');
      burger.classList.add('hide');
      closeBtn.classList.add('show');
      document.body.classList.add('menu-open');
    });

    closeBtn.addEventListener('click', () => {
      navLinks.classList.remove('active');
      burger.classList.remove('hide');
      closeBtn.classList.remove('show');
      document.body.classList.remove('menu-open');
    });
  }

  // Copier adresse wallet
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-copy');
      const text = document.querySelector(`#${target}`).textContent;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "Copié !";
        setTimeout(() => (btn.textContent = "Copier"), 2000);
      });
    });
  });

  // Visualiseur audio
  const players = document.querySelectorAll('.audio-player');
  players.forEach(player => {
    const audio = player.querySelector('audio');
    const canvas = player.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const analyser = new (window.AudioContext || window.webkitAudioContext)();
    const source = analyser.createMediaElementSource(audio);
    const analyserNode = analyser.createAnalyser();
    source.connect(analyserNode);
    analyserNode.connect(analyser.destination);
    analyserNode.fftSize = 256;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvas.width = 300;
    canvas.height = 60;

    function draw() {
      requestAnimationFrame(draw);
      analyserNode.getByteFrequencyData(dataArray);
      ctx.fillStyle = '#0f0f0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 100},${barHeight + 50},200)`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }

    audio.addEventListener('play', () => draw());
  });

  // Animation de chargement du formulaire
  const form = document.querySelector('form');
  if (form) {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `<div class="spinner"></div><p>Commande en cours...</p>`;
    loader.style.display = 'none';
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.background = 'rgba(0,0,0,0.85)';
    loader.style.color = '#fff';
    loader.style.zIndex = '10000';
    loader.style.fontSize = '18px';
    loader.style.display = 'flex';
    loader.style.flexDirection = 'column';
    loader.style.alignItems = 'center';
    loader.style.justifyContent = 'center';

    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
      .spinner {
        border: 5px solid rgba(255, 255, 255, 0.1);
        border-top: 5px solid #1DB954;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loader);

    form.addEventListener('submit', () => {
      loader.style.display = 'flex';
      form.style.opacity = '0.4';
    });
  }
});
