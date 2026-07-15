(function () {
  var cinemaClips = [
    "assets/cinema/clip1.mp4",
    "assets/cinema/clip2.mp4",
    "assets/cinema/clip3.mp4",
    "assets/cinema/clip4.mp4",
    "assets/cinema/clip5.mp4",
    "assets/cinema/clip6.mp4",
    "assets/cinema/clip7.mp4",
    "assets/cinema/clip8.mp4"
  ];

  function createElement(tagName, className) {
    var element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  function scrollToFinalSky() {
    var finalSky = document.querySelector("#sky-final");

    if (!finalSky) return;

    finalSky.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function initCinema() {
    var section = document.querySelector("#cinema");

    if (!section || section.dataset.cinemaReady === "true") {
      return;
    }

    section.dataset.cinemaReady = "true";

    var currentIndex = 0;
    var hasStarted = false;

    var inner = createElement("div", "cinema-inner");
    var copy = createElement("div", "cinema-copy");
    var stage = createElement("div", "cinema-stage");
    var video = createElement("video", "cinema-video");
    var status = createElement("span", "cinema-status");
    var startButton = createElement("button", "cinema-start");

    copy.innerHTML =
      '<span class="cinema-kicker">Nuestro pequeño cine</span>' +
      '<h2>Las películas y series me enseñaron<br>muchas formas de amar...</h2>' +
      '<p>pero todas me recuerdan a ti.</p>';

    video.muted = false;
    video.volume = 1;
    video.playsInline = true;
    video.preload = "auto";
    video.setAttribute("playsinline", "");
    video.setAttribute("aria-label", "Recuerdo en video");
    video.src = cinemaClips[currentIndex];

    status.textContent = "1 / " + cinemaClips.length;

    startButton.type = "button";
    startButton.textContent = "Ver con sonido";
    startButton.setAttribute("aria-label", "Iniciar videos con sonido");

    stage.appendChild(video);
    stage.appendChild(status);
    inner.appendChild(copy);
    inner.appendChild(stage);
    inner.appendChild(startButton);
    section.appendChild(inner);

    function playCurrentClip() {
      status.textContent = currentIndex + 1 + " / " + cinemaClips.length;

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    function playNextClip() {
      stage.classList.add("is-fading");

      window.setTimeout(function () {
        currentIndex += 1;

        if (currentIndex >= cinemaClips.length) {
          scrollToFinalSky();
          return;
        }

        video.src = cinemaClips[currentIndex];
        video.load();

        stage.classList.remove("is-fading");
        playCurrentClip();
      }, 560);
    }

    function startSequence() {
      if (hasStarted) return;

      hasStarted = true;
      startButton.hidden = true;
      video.muted = false;
      playCurrentClip();
    }

    video.addEventListener("ended", playNextClip);

    video.addEventListener("error", function () {
      playNextClip();
    });

    startButton.addEventListener("click", startSequence);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCinema, { once: true });
  } else {
    initCinema();
  }
})();