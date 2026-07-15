(function () {
  var heartLayout = [
    { x: 34, y: 20, size: 0.95, depth: 2, floatX: "5px", floatY: "-13px", speed: "5.8s", rotation: -18 },
    { x: 66, y: 20, size: 1.03, depth: 3, floatX: "-7px", floatY: "-10px", speed: "6.4s", rotation: 13 },
    { x: 20, y: 38, size: 1.04, depth: 4, floatX: "4px", floatY: "-16px", speed: "5.4s", rotation: -7 },
    { x: 50, y: 34, size: 1.12, depth: 6, floatX: "-5px", floatY: "-12px", speed: "6.1s", rotation: 22 },
    { x: 80, y: 38, size: 0.98, depth: 5, floatX: "6px", floatY: "-15px", speed: "6.8s", rotation: -25 },
    { x: 31, y: 56, size: 0.96, depth: 3, floatX: "-8px", floatY: "-11px", speed: "5.9s", rotation: 9 },
    { x: 69, y: 56, size: 1.02, depth: 4, floatX: "4px", floatY: "-14px", speed: "6.5s", rotation: -12 },
    { x: 50, y: 72, size: 0.94, depth: 2, floatX: "-4px", floatY: "-17px", speed: "5.6s", rotation: 18 },
    { x: 50, y: 92, size: 0.82, depth: 1, floatX: "7px", floatY: "-12px", speed: "6.2s", rotation: -15 }
  ];

  function createElement(tagName, className) {
    var element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  function getSongTitle(song) {
    return song.title || song.name || song.song || "Nuestra cancion";
  }

  function getSongArtist(song) {
    return song.artist || song.author || "";
  }

  function getSongCover(song) {
    var cover = song.cover || song.image || song.coverPath || song.coverFile || "";

    if (!cover) return "";
    if (/^(https?:|data:|\/|\.\/|\.\.\/|assets\/)/.test(cover)) return cover;

    return "assets/covers/" + cover;
  }

  function getSongGlow(song, index) {
    var fallbackColors = [
      "#ff6b9a", "#f7b267", "#8ecae6", "#ffafcc", "#ffd166",
      "#cdb4db", "#ffee93", "#ff4d6d", "#80ed99"
    ];

    return song.glow || song.color || fallbackColors[index % fallbackColors.length];
  }

  function createVinyl(song, index, heart) {
    var layout = heartLayout[index];
    var title = getSongTitle(song);
    var artist = getSongArtist(song);
    var coverPath = getSongCover(song);

    var vinyl = createElement("article", "music-vinyl");
    var disc = createElement("div", "music-vinyl__disc");
    var grooves = createElement("span", "music-vinyl__grooves");
    var shine = createElement("span", "music-vinyl__shine");
    var reflection = createElement("span", "music-vinyl__reflection");
    var label = createElement("span", "music-vinyl__label");
    var cover = createElement("img", "music-vinyl__cover");
    var hole = createElement("span", "music-vinyl__hole");
    var songName = createElement("span", "music-vinyl__song");

    vinyl.style.setProperty("--heart-x", layout.x + "%");
    vinyl.style.setProperty("--heart-y", layout.y + "%");
    vinyl.style.setProperty("--disc-scale", layout.size);
    vinyl.style.setProperty("--disc-depth", layout.depth);
    vinyl.style.setProperty("--vinyl-glow", getSongGlow(song, index));
    vinyl.style.setProperty("--vinyl-rotation", layout.rotation + "deg");
    vinyl.style.setProperty("--appear-delay", index * 145 + "ms");
    vinyl.style.setProperty("--float-x", layout.floatX);
    vinyl.style.setProperty("--float-y", layout.floatY);
    vinyl.style.setProperty("--float-duration", layout.speed);
    vinyl.style.setProperty("--float-delay", index * -0.42 + "s");

    vinyl.setAttribute("aria-label", artist ? title + " de " + artist : title);
    vinyl.tabIndex = 0;

    cover.src = coverPath;
    cover.alt = "";
    cover.loading = "lazy";
    cover.decoding = "async";
    cover.addEventListener("error", function () {
      cover.classList.add("is-cover-missing");
      cover.removeAttribute("src");
    });

    songName.textContent = title;

    vinyl.addEventListener("mouseenter", function () {
      heart.classList.add("is-heart-hovering");
      vinyl.classList.add("is-active");
    });

    vinyl.addEventListener("mouseleave", function () {
      heart.classList.remove("is-heart-hovering");
      vinyl.classList.remove("is-active");
    });

    vinyl.addEventListener("focus", function () {
      heart.classList.add("is-heart-hovering");
      vinyl.classList.add("is-active");
    });

    vinyl.addEventListener("blur", function () {
      heart.classList.remove("is-heart-hovering");
      vinyl.classList.remove("is-active");
    });

    label.appendChild(cover);
    label.appendChild(hole);
    disc.appendChild(grooves);
    disc.appendChild(shine);
    disc.appendChild(reflection);
    disc.appendChild(label);
    vinyl.appendChild(disc);
    vinyl.appendChild(songName);

    return vinyl;
  }

  function createMusicHeart() {
    var heart = createElement("div", "music-heart-vinyls");
    var songs = typeof musicSongs !== "undefined" ? musicSongs : [];

    heart.setAttribute("aria-label", "Corazon organico formado por nueve discos de vinilo");

    songs.slice(0, 9).forEach(function (song, index) {
      heart.appendChild(createVinyl(song, index, heart));
    });

    return heart;
  }

  window.createMusicHeart = createMusicHeart;
})();