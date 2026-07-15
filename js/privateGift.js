(function () {
  var HOLD_DURATION = 5000;
  var PRIVATE_MUSIC_SRC = "assets/private/less-secret.mp3";

  var privatePhotos = [
    "assets/private/regalo1.jpg",
    "assets/private/regalo2.jpg",
    "assets/private/regalo3.jpg",
    "assets/private/regalo4.jpg"
  ];

  function createElement(tagName, className) {
    var element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  function setProgress(lock, progress) {
    lock.style.setProperty("--unlock-progress", Math.max(0, Math.min(100, progress)));
  }

  function createPhotoCard(src, index) {
    var item = createElement("article", "private-photo");
    var frame = createElement("div", "private-photo-frame");
    var image = document.createElement("img");
    var actions = createElement("div", "private-photo-actions");
    var revealButton = createElement("button", "private-photo-button");
    var hideButton = createElement("button", "private-photo-button");

    image.src = src;
    image.alt = "Regalo privado " + (index + 1);
    image.loading = "lazy";

    revealButton.type = "button";
    revealButton.textContent = "Ver";

    hideButton.type = "button";
    hideButton.textContent = "Ocultar";

    revealButton.addEventListener("click", function () {
      item.classList.add("is-visible");
    });

    hideButton.addEventListener("click", function () {
      item.classList.remove("is-visible");
    });

    frame.appendChild(image);
    actions.appendChild(revealButton);
    actions.appendChild(hideButton);
    item.appendChild(frame);
    item.appendChild(actions);

    return item;
  }

  function initPrivateGift() {
    var section = document.querySelector("#private-gift");

    if (!section || section.dataset.privateGiftReady === "true") return;

    section.dataset.privateGiftReady = "true";

    var holdTimer = null;
    var holdStart = 0;
    var progressFrame = 0;
    var isUnlocked = false;

    var card = createElement("div", "private-gift-card");
    var kicker = createElement("span", "private-gift-kicker");
    var title = createElement("h2", "private-gift-title");
    var subtitle = createElement("p", "private-gift-subtitle");
    var lock = createElement("button", "private-gift-lock");
    var lockText = createElement("span", "private-gift-lock-text");
    var gallery = createElement("div", "private-gift-gallery");
    var audio = document.createElement("audio");
    var musicButton = createElement("button", "private-music-button");

    kicker.textContent = "Regalo privado para Less";
    title.textContent = "Un último regalo...";
    subtitle.textContent = "Solo para tus ojitos, Sapita.";

    lock.type = "button";
    lock.setAttribute("aria-label", "Mantener presionado cinco segundos para desbloquear");
    lockText.textContent = "Mantén presionado para desbloquear";
    lock.appendChild(lockText);

    audio.src = PRIVATE_MUSIC_SRC;
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "auto";

    musicButton.type = "button";
    musicButton.textContent = "Pausar música";
    musicButton.hidden = true;

    gallery.hidden = true;

    privatePhotos.forEach(function (src, index) {
      gallery.appendChild(createPhotoCard(src, index));
    });

    card.appendChild(kicker);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(lock);
    card.appendChild(gallery);
    card.appendChild(musicButton);
    card.appendChild(audio);
    section.appendChild(card);

    setProgress(lock, 0);

    function playGiftMusic() {
      var playPromise = audio.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }

      musicButton.hidden = false;
      musicButton.textContent = "Pausar música";
    }

    function pauseGiftMusic() {
      audio.pause();
      musicButton.textContent = "Reproducir música";
    }

    function stopHoldProgress() {
      if (holdTimer) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
      }

      if (progressFrame) {
        window.cancelAnimationFrame(progressFrame);
        progressFrame = 0;
      }

      holdStart = 0;
    }

    function revealGallery() {
      isUnlocked = true;
      stopHoldProgress();
      gallery.hidden = false;
      lock.classList.add("is-complete");
      lockText.textContent = "Desbloqueado";
      lock.setAttribute("aria-label", "Regalo privado desbloqueado");
      setProgress(lock, 100);
      playGiftMusic();
    }

    function clearHold() {
      stopHoldProgress();

      if (!isUnlocked) {
        setProgress(lock, 0);
        pauseGiftMusic();
      }
    }

    function updateProgress() {
      if (!holdStart || isUnlocked) return;

      var elapsed = Date.now() - holdStart;
      var progress = (elapsed / HOLD_DURATION) * 100;

      setProgress(lock, progress);

      if (elapsed >= HOLD_DURATION) {
        revealGallery();
        return;
      }

      progressFrame = window.requestAnimationFrame(updateProgress);
    }

    function startHold() {
      if (isUnlocked) return;

      clearHold();
      holdStart = Date.now();
      playGiftMusic();

      holdTimer = window.setTimeout(revealGallery, HOLD_DURATION);
      progressFrame = window.requestAnimationFrame(updateProgress);
    }

    lock.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      lock.setPointerCapture(event.pointerId);
      startHold();
    });

    lock.addEventListener("pointerup", clearHold);
    lock.addEventListener("pointercancel", clearHold);
    lock.addEventListener("pointerleave", clearHold);

    lock.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      if (event.repeat) return;

      event.preventDefault();
      startHold();
    });

    lock.addEventListener("keyup", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      clearHold();
    });

    musicButton.addEventListener("click", function () {
      if (audio.paused) {
        playGiftMusic();
        return;
      }

      pauseGiftMusic();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPrivateGift, { once: true });
  } else {
    initPrivateGift();
  }
})();