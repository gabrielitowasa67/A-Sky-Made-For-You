(function () {
  var ICON_PREVIOUS = "\u2039";
  var ICON_PLAY = "\u25B6";
  var ICON_NEXT = "\u203A";
  var ICON_PAUSE = "\u275A\u275A";

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
  }

  function getCover(song) {
    return song.cover || "";
  }

  function createButton(className, label, text) {
    var button = document.createElement("button");
    button.className = className;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.textContent = text;
    return button;
  }

  function createMusicPlayer(options) {
    var songs = options.songs || [];
    var currentIndex = 0;
    var isPlaying = false;

    var player = document.createElement("div");
    player.className = "music-player";
    player.hidden = true;

    var audio = document.createElement("audio");
    audio.className = "music-player__audio";
    audio.preload = "metadata";

    var coverWrap = document.createElement("div");
    coverWrap.className = "music-player__cover-wrap";

    var cover = document.createElement("img");
    cover.className = "music-player__cover";
    cover.alt = "";
    cover.loading = "lazy";
    cover.decoding = "async";

    var glow = document.createElement("span");
    glow.className = "music-player__cover-glow";

    coverWrap.appendChild(glow);
    coverWrap.appendChild(cover);

    var content = document.createElement("div");
    content.className = "music-player__content";

    var eyebrow = document.createElement("span");
    eyebrow.className = "music-player__eyebrow";
    eyebrow.textContent = "Ahora suena";

    var title = document.createElement("h3");
    title.className = "music-player__title";

    var artist = document.createElement("p");
    artist.className = "music-player__artist";

    var message = document.createElement("p");
    message.className = "music-player__message";

    var controls = document.createElement("div");
    controls.className = "music-player__controls";

    var previousButton = createButton("music-player__button", "Cancion anterior", ICON_PREVIOUS);
    var playButton = createButton("music-player__button music-player__button--play", "Reproducir", ICON_PLAY);
    var nextButton = createButton("music-player__button", "Siguiente cancion", ICON_NEXT);

    controls.appendChild(previousButton);
    controls.appendChild(playButton);
    controls.appendChild(nextButton);

    var progressArea = document.createElement("div");
    progressArea.className = "music-player__progress-area";

    var progress = document.createElement("input");
    progress.className = "music-player__progress";
    progress.type = "range";
    progress.min = "0";
    progress.max = "100";
    progress.value = "0";
    progress.step = "0.1";
    progress.setAttribute("aria-label", "Progreso de la cancion");

    var timeRow = document.createElement("div");
    timeRow.className = "music-player__time";

    var currentTime = document.createElement("span");
    currentTime.textContent = "0:00";

    var duration = document.createElement("span");
    duration.textContent = "0:00";

    timeRow.appendChild(currentTime);
    timeRow.appendChild(duration);

    progressArea.appendChild(progress);
    progressArea.appendChild(timeRow);

    content.appendChild(eyebrow);
    content.appendChild(title);
    content.appendChild(artist);
    content.appendChild(message);
    content.appendChild(controls);
    content.appendChild(progressArea);

    player.appendChild(audio);
    player.appendChild(coverWrap);
    player.appendChild(content);

    function setPlayState(nextIsPlaying) {
      isPlaying = nextIsPlaying;
      playButton.textContent = isPlaying ? ICON_PAUSE : ICON_PLAY;
      playButton.setAttribute("aria-label", isPlaying ? "Pausar" : "Reproducir");
      playButton.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    }

    function renderSong(index) {
      var song = songs[index];

      if (!song) return;

      currentIndex = index;
      setPlayState(false);

      player.hidden = false;
      player.style.setProperty("--player-color", song.color || "#7dd3fc");

      cover.src = getCover(song);
      title.textContent = song.title || "Nuestra cancion";
      artist.textContent = song.artist || "";
      message.textContent = song.message || "";

      audio.src = song.audio || "";
      audio.load();

      progress.value = "0";
      currentTime.textContent = "0:00";
      duration.textContent = "0:00";
    }

    function playCurrentSong() {
      if (!audio.src) return;

      audio.play().then(function () {
        setPlayState(true);
      }).catch(function () {
        setPlayState(false);
      });
    }

    function pauseCurrentSong() {
      audio.pause();
      setPlayState(false);
    }

    function goToSong(index, shouldPlay) {
      var nextIndex = index;

      if (!songs.length) return;
      if (nextIndex < 0) nextIndex = songs.length - 1;
      if (nextIndex >= songs.length) nextIndex = 0;

      renderSong(nextIndex);

      if (shouldPlay) {
        playCurrentSong();
      }
    }

    playButton.addEventListener("click", function () {
      if (isPlaying) {
        pauseCurrentSong();
        return;
      }

      playCurrentSong();
    });

    previousButton.addEventListener("click", function () {
      goToSong(currentIndex - 1, isPlaying);
    });

    nextButton.addEventListener("click", function () {
      goToSong(currentIndex + 1, isPlaying);
    });

    audio.addEventListener("loadedmetadata", function () {
      duration.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("timeupdate", function () {
      if (!audio.duration) return;

      progress.value = (audio.currentTime / audio.duration) * 100;
      currentTime.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener("ended", function () {
      goToSong(currentIndex + 1, true);
    });

    progress.addEventListener("input", function () {
      if (!audio.duration) return;

      audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    });

    return {
      element: player,
      showSong: renderSong,
      play: playCurrentSong,
      pause: pauseCurrentSong
    };
  }

  window.createMusicPlayer = createMusicPlayer;
})();