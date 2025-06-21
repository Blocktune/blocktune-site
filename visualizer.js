// script.js (partie visualiseur)
document.querySelectorAll('audio').forEach((audio, index) => {
  const canvas = audio.nextElementSibling;
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 50;

  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const source = context.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(context.destination);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = "#00ffaa";
      ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      x += barWidth + 1;
    }
  }

  audio.addEventListener("play", () => {
    if (context.state === "suspended") context.resume();
    draw();
  });
});