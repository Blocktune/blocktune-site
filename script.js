// script.js – Interactions BlockTune

// Menu burger toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('nav ul.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Copier adresse wallet au clic
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

  // Visualiseur audio simple (waveform animé)
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
});
