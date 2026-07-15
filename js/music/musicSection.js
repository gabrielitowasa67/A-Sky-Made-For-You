(function () {
  function getSongs() {
    if (typeof musicSongs === "undefined") return [];
    return musicSongs;
  }

  function getOrCreateHeart(section) {
    var existingHeart = section.querySelector(".music-heart-vinyls");

    if (existingHeart) {
      return existingHeart;
    }

    if (typeof createMusicHeart !== "function") {
      return null;
    }

    var heart = createMusicHeart();
    section.appendChild(heart);

    return heart;
  }

  function clearActiveVinyls(heart) {
    var activeVinyls = heart.querySelectorAll(".music-vinyl.is-selected");

    activeVinyls.forEach(function (vinyl) {
      vinyl.classList.remove("is-selected");
      vinyl.setAttribute("aria-pressed", "false");
    });
  }

  function selectVinyl(heart, player, songs, vinyl) {
    var vinyls = Array.prototype.slice.call(heart.querySelectorAll(".music-vinyl"));
    var index = vinyls.indexOf(vinyl);

    if (index < 0 || !songs[index]) {
      return;
    }

    clearActiveVinyls(heart);
    vinyl.classList.add("is-selected");
    vinyl.setAttribute("aria-pressed", "true");

    player.showSong(index);
    player.element.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }

  function initMusicSection() {
    var section = document.querySelector("#music-heart");
    var songs = getSongs();

    if (!section || section.dataset.musicReady === "true" || !songs.length || typeof createMusicPlayer !== "function") {
      return;
    }

    var heart = getOrCreateHeart(section);

    if (!heart) {
      return;
    }

    section.dataset.musicReady = "true";

    var player = createMusicPlayer({
      songs: songs
    });

    section.appendChild(player.element);

    heart.querySelectorAll(".music-vinyl").forEach(function (vinyl) {
      vinyl.setAttribute("role", "button");
      vinyl.setAttribute("aria-pressed", "false");
    });

    heart.addEventListener("click", function (event) {
      var vinyl = event.target.closest(".music-vinyl");

      if (!vinyl || !heart.contains(vinyl)) {
        return;
      }

      selectVinyl(heart, player, songs, vinyl);
    });

    heart.addEventListener("keydown", function (event) {
      var vinyl = event.target.closest(".music-vinyl");

      if (!vinyl || !heart.contains(vinyl)) {
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      selectVinyl(heart, player, songs, vinyl);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMusicSection, { once: true });
  } else {
    initMusicSection();
  }

  window.initMusicSection = initMusicSection;
})();