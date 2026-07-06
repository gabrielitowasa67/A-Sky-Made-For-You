const gallery = document.getElementById("gallery");

const envelopes = [
  {
    icon: "💙",
    image: "assets/photos/foto1.jpg",
    title: "Nosotros bien felicotes después de nuestras cochinadas. 🤭💙",
    text: "Después de tantas risas, abrazos y travesuras, siempre terminábamos igual... felices de estar juntos."
  },
  {
    icon: "🏀",
    image: "assets/photos/foto2.jpg",
    title: "Mi niña acompañándome en mi partido de básquet. 🏀💙",
    text: "No importaba quién ganara el partido. Para mí, ya había ganado desde que estabas ahí apoyándome."
  },
  {
    icon: "💋",
    image: "assets/photos/foto3.jpg",
    title: "Nuestro mejor beso. ❤️",
    text: "De todos los besos que hemos compartido, hay uno que siempre vuelve a mi memoria. Ese que todavía puedo sentir cuando cierro los ojos."
  }
];

gallery.innerHTML = `
  <h2 class="section-title">Las cartas que nunca te entregué 💌</h2>

  <p class="section-subtitle">
    Cada sobre guarda un pedacito de nuestra historia.
  </p>

  <div class="envelope-grid">
    ${envelopes.map((item, index) => `
      <div class="envelope-card" data-index="${index}">
        <div class="envelope">
          <div class="flap"></div>
          <div class="body"></div>
          <div class="seal">${item.icon}</div>
        </div>
      </div>
    `).join("")}
  </div>

  <div class="memory-modal" id="memoryModal">
    <button class="close-memory" id="closeMemory">×</button>

    <div class="memory-paper">
      <img id="memoryImg" src="" alt="">
      <h3 id="memoryTitle"></h3>
      <p id="memoryText"></p>
    </div>
  </div>
`;

const envelopeCards = document.querySelectorAll(".envelope-card");
const modal = document.getElementById("memoryModal");
const memoryImg = document.getElementById("memoryImg");
const memoryTitle = document.getElementById("memoryTitle");
const memoryText = document.getElementById("memoryText");
const closeMemory = document.getElementById("closeMemory");

envelopeCards.forEach(card => {
  card.addEventListener("click", () => {
    const item = envelopes[card.dataset.index];

    card.classList.add("opened");

    setTimeout(() => {
      memoryImg.src = item.image;
      memoryTitle.textContent = item.title;
      memoryText.textContent = item.text;
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }, 550);
  });
});

function closeModal() {
  modal.classList.remove("show");
  document.body.style.overflow = "auto";
  envelopeCards.forEach(card => card.classList.remove("opened"));
}

closeMemory.addEventListener("click", closeModal);

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});