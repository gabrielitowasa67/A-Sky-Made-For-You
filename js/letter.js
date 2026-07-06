const letter = document.getElementById("letter");

letter.innerHTML = `
  <h2 class="section-title">Una carta para ti 💌</h2>

  <p class="section-subtitle">
    Léela despacito, Sapita.
  </p>

  <div class="written-letter">
    <div class="paper-glow"></div>

    <div class="letter-paper">
      <p id="letterText"></p>
      <span class="cursor"></span>
    </div>
  </div>
`;

const text = `Sapita...

No sé si alguna vez voy a encontrar las palabras exactas para explicarte todo lo que significas para mí.

Pero si este cielo existe, es porque tú hiciste que muchas cosas en mi vida empezaran a brillar otra vez.

Gracias por cada risa, cada abrazo, cada beso, cada travesura, cada momento bonito y también por esos recuerdos que solo tú y yo entendemos.

Gracias por acompañarme, por hacerme sentir amado y por convertir cosas simples en momentos que jamás voy a olvidar.

Esta página no es perfecta, pero está hecha con todo el amor que te tengo.

Y si algún día dudas de lo importante que eres para mí, vuelve a mirar este pequeño universo.

Porque cada estrella, cada carta, cada recuerdo y cada palabra fueron puestos aquí pensando en ti.

Te amo infinitamente.

Con todo mi corazón,

GabrielitoWasa 💙`;

let started = false;
const target = document.getElementById("letterText");

const letterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !started) {
      started = true;
      let i = 0;

      function type() {
        if (i < text.length) {
          target.innerHTML += text[i] === "\n" ? "<br>" : text[i];
          i++;
          setTimeout(type, 32);
        }
      }

      type();
    }
  });
}, { threshold: 0.35 });

letterObserver.observe(letter);