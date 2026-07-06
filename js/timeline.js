const timeline = document.getElementById("timeline");

const memories = [
  {
    icon: "🌸",
    title: "Un Rayo de Luz",
    subtitle: "Donde todo comenzó",
    text: "Recuerdo la primera vez que te vi en el colegio. Había algo en tus ojos que hizo que no pudiera dejar de mirarte. Tu sonrisa, tu delineado y esa forma tan única de ser hicieron que comenzara una historia que jamás imaginé vivir."
  },
  {
    icon: "🌍",
    title: "La Distancia",
    subtitle: "Cuando entendí cuánto significabas para mí",
    text: "Cuando te fuiste del país sentí un vacío enorme. Ahí comprendí que ya no imaginaba mi vida sin ti. Aunque la distancia nos separó, nunca dejó de unirnos todo lo que sentíamos."
  },
  {
    icon: "💋",
    title: "Nuestro Primer Besito",
    subtitle: "El recuerdo que siempre me hace sonreír",
    text: "Aquella tarde en tu casa quedó grabada para siempre. Me maquillaste, me hiciste colitas, vimos nuestros animes favoritos y, cuando cayó la noche, escondidos entre los cojines, llegó nuestro primer besito."
  },
  {
    icon: "🍔",
    title: "Nuestras Saliditas",
    subtitle: "Los pequeños momentos que se volvieron gigantes",
    text: "Hamburguesas, pizza, chifa, manillitas y risas. No importaba el lugar, porque cualquier sitio contigo terminaba convirtiéndose en un recuerdo bonito."
  },
  {
    icon: "🔒",
    title: "Nuestro Secreto",
    subtitle: "Un recuerdo que solo tú y yo entendemos",
    text: "Hubo un momento que cambió nuestra historia para siempre. Entre nervios, risas y unos lentes olvidados, vivimos algo que pertenece únicamente a nosotros."
  },
  {
    icon: "🐱",
    title: "Tommy",
    subtitle: "El guardián de nuestro pequeño universo",
    text: "Con sus patitas blancas, su carita seria y su forma única de acompañarnos, Tommy también terminó siendo parte de esta historia."
  },
  {
    icon: "🏡",
    title: "Nuestro Futuro",
    subtitle: "La estrella que todavía seguimos persiguiendo",
    text: "Sueño con nuestra casita, nuestros gatitos, los viajes, las risas, las tardes viendo series y todos esos momentos que todavía nos esperan."
  }
];

timeline.innerHTML = `
  <div class="timeline-wrapper">
    <h2>Nuestra Historia</h2>
    <p class="timeline-intro">Cada recuerdo es una estrella de este cielo.</p>
    <div class="timeline-line"></div>

    ${memories.map((memory, index) => `
      <article class="timeline-card ${index % 2 === 0 ? "left" : "right"}">
        <div class="timeline-dot">${memory.icon}</div>
        <div class="timeline-content">
          <span class="memory-number">0${index + 1}</span>
          <h3>${memory.title}</h3>
          <h4>${memory.subtitle}</h4>
          <p>${memory.text}</p>
        </div>
      </article>
    `).join("")}
  </div>
`;

const cards = document.querySelectorAll(".timeline-card");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, { threshold: .25 });

cards.forEach(card => observer.observe(card));