const tommy = document.getElementById("tommy");

tommy.innerHTML = `
  <h2 class="section-title">Tommy 🐱</h2>
  <p class="section-subtitle">El guardián de nuestro pequeño universo.</p>

  <div class="tommy-world">
    <div id="speech">Miau 💙</div>

    <div id="cat">
      <div class="cat-body"></div>
      <div class="cat-chest"></div>

      <div class="cat-head">
        <div class="ear left"></div>
        <div class="ear right"></div>
        <div class="eye left"></div>
        <div class="eye right"></div>
        <div class="nose"></div>
      </div>

      <div class="paw one"></div>
      <div class="paw two"></div>
      <div class="tail"></div>
    </div>
  </div>
`;

const cat = document.getElementById("cat");
const speech = document.getElementById("speech");

const messages = [
  "Miau 💙",
  "Cuando regresas a darme de comer mami 🐱",
  "Mi papi y yo te amamos mucho ✨",
  "Tistaño mami 😿"
];

cat.addEventListener("click", () => {
  speech.textContent = messages[Math.floor(Math.random() * messages.length)];
  speech.classList.add("show");

  setTimeout(() => {
    speech.classList.remove("show");
  }, 2500);
});