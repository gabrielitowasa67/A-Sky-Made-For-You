(function () {
  /*
    Los PDF se reconocen con esta estructura:
    assets/manga/pdfs/phantom-blood/tomo-01.pdf
    assets/manga/pdfs/phantom-blood/tomo-02.pdf
  */
  var mangas = [
    { id: "phantom-blood", part: 1, title: "Phantom Blood", total: 5, cover: "phantom-blood.jpg", color: "#991b1b" },
    { id: "battle-tendency", part: 2, title: "Battle Tendency", total: 7, cover: "battle-tendency.jpg", color: "#0369a1" },
    { id: "stardust-crusaders", part: 3, title: "Stardust Crusaders", total: 16, cover: "stardust-crusaders.jpg", color: "#6b21a8" },
    { id: "diamond-unbreakable", part: 4, title: "Diamond is Unbreakable", total: 19, cover: "diamond-is-unbreakable.jpg", color: "#db2777" },
    { id: "golden-wind", part: 5, title: "Golden Wind", total: 16, cover: "golden-wind.jpg", color: "#a16207" },
    { id: "stone-ocean", part: 6, title: "Stone Ocean", total: 17, cover: "stone-ocean.jpg", color: "#0f766e" },
    { id: "steel-ball-run", part: 7, title: "Steel Ball Run", total: 24, cover: "steel-ball-run.jpg", color: "#92400e", driveIds: [
      "1NkD6efydhQuRafz4FOp-INaSiCnk3WHo", "11Y7PkWls6-f-RKhUoB61CxhM1vKacKiu", "10a9xOJEYg9zrL2-3RfaYyX400iMSHuMv", "11_SfET4B0UEvN14d5uMdR4ZoZ-BcarLM",
      "1nTKqRpO6B_KSV3z3DvKTSBSDDQitjFvx", "13lHeUIgTeOAKpFSAUKL7vKnUXrwFU4V9", "1v5g_QVggts1iZ2t7OIqAdnuF4KcLbhTi", "1Vbpgcztzp-F-tFeP2h5eS8DqvN9FFh9C",
      "17EL9A-QRg8hPzLEtjWjNStD5tHsHyKoJ", "1fmxLPae-qvLc3so7R4_bnKmQ1JGJ-OWn", "1xZh3tEHVWNnYN7ee5l31tp9We-dR4MNm", "18J9bDqahKwH8kX40WnpvmjdAjz5LWlqP",
      "1FS-mZg4C2HZ_WurikCgIha5HdOkmbWP4", "1KuivUW3P3a7EfwoLaiS5Gg2IACSDN4kU", "10cO999RgA7gYFn5o1BSdR6EHT88GTE-d", "1r4KrmoWOjrUSeGNb4OXaAND-xhL6aKKw",
      "1tLc4D5B1cPPhHgZt35TSIjEvIcNoyDwf", "1UeSHeGGz9fD0lUcoGVjgtUn7Os_9LMpq", "1sFiTTDxuN6FoaC_JSbOSyiuIOL3LCUt9", "1Ur5dl0Ls4H0eNAts8wlqwTBgXfXWl9U0",
      "1aL0tKMkxBXU-VvVpKqAch21xKWoh6ZsT", "16H5BAiTUEYvHHRbJlE8fzn17nf-TshDe", "10ZSCOkJ5VoOTyAQDgiiRUxV7dcMLxYko", "1vzCYosfvg7yPWOoZn3jICIeCKm1lEKmz"
    ], driveSizes: [
      89381385, 103351531, 99988514, 103548528, 115088354, 93864678,
      105469802, 104392419, 110796001, 90003471, 103402976, 93227551,
      93774696, 100116367, 104354396, 99773317, 127205538, 110482156,
      125446619, 123678954, 124776539, 117321129, 99891576, 113355017
    ] },
    { id: "jojolion", part: 8, title: "JoJolion", total: 27, cover: "jojolion.jpg", color: "#be185d" }
  ];

  function twoDigits(number) { return String(number).padStart(2, "0"); }
  function pdfPath(manga, volume) { return "assets/manga/pdfs/" + manga.id + "/tomo-" + twoDigits(volume) + ".pdf"; }

  function init() {
    var section = document.getElementById("manga-library");
    if (!section || section.dataset.ready) return;
    section.dataset.ready = "true";
    section.innerHTML = '<div class="manga-shell"><header class="manga-heading"><span class="manga-kicker">Un rincón solo para ti</span><h2>La biblioteca de <em>Less</em></h2><p>Todos los mundos, aventuras y JoJos que quieras visitar, guardados bajo el mismo cielo.</p></header><div class="manga-toolbar"><input class="manga-search" type="search" placeholder="Buscar una parte..." aria-label="Buscar manga"><button class="manga-filter" type="button">♡ Mis favoritos</button></div><div class="manga-grid"></div></div><div class="manga-reader" role="dialog" aria-modal="true" aria-label="Lector de manga"><header class="reader-bar"><button class="reader-close" aria-label="Cerrar lector">×</button><div class="reader-title"></div><a class="reader-external" target="_blank" rel="noopener" hidden>Abrir PDF ↗</a></header><div class="reader-content"></div></div>';

    var grid = section.querySelector(".manga-grid");
    var search = section.querySelector(".manga-search");
    var filter = section.querySelector(".manga-filter");
    var reader = section.querySelector(".manga-reader");
    var content = section.querySelector(".reader-content");
    var external = section.querySelector(".reader-external");
    var onlyFavorites = false;
    var currentManga = null;
    var currentVolume = null;
    var activeDownload = null;
    var activeBlobUrl = null;
    var favorites;
    try { favorites = JSON.parse(localStorage.getItem("less-manga-favorites") || "[]"); } catch (error) { favorites = []; }

    function render() {
      var query = search.value.toLowerCase().trim();
      var visible = mangas.filter(function (manga) {
        var matches = manga.title.toLowerCase().includes(query) || ("parte " + manga.part).includes(query);
        return matches && (!onlyFavorites || favorites.includes(manga.id));
      });
      grid.innerHTML = visible.length ? visible.map(function (manga) {
        var liked = favorites.includes(manga.id);
        return '<article class="manga-card"><div class="manga-cover" style="--fallback:' + manga.color + '"><img src="assets/manga/' + manga.cover + '" alt="Portada de ' + manga.title + '" loading="lazy"><span class="manga-cover-number">' + manga.part + '</span></div><div class="manga-card-info"><small>PARTE ' + manga.part + ' · ' + manga.total + ' TOMOS</small><h3>' + manga.title + '</h3><div class="manga-actions"><button class="manga-read" data-read="' + manga.id + '">Ver tomos</button><button class="manga-favorite ' + (liked ? 'active' : '') + '" data-favorite="' + manga.id + '" aria-label="Guardar en favoritos">♥</button></div></div></article>';
      }).join("") : '<div class="manga-empty">No encontré ningún manga con esa búsqueda ✦</div>';
    }

    function clearPdfLoad() {
      if (activeDownload) activeDownload.abort();
      activeDownload = null;
      if (activeBlobUrl) URL.revokeObjectURL(activeBlobUrl);
      activeBlobUrl = null;
    }

    async function fetchRangeWithRetry(url, start, end, signal) {
      var lastError;
      for (var attempt = 1; attempt <= 3; attempt += 1) {
        try {
          var response = await fetch(url, {
            signal: signal,
            headers: { Range: "bytes=" + start + "-" + end }
          });
          if (response.status !== 200 && response.status !== 206) throw new Error("Respuesta " + response.status);
          return {
            bytes: new Uint8Array(await response.arrayBuffer()),
            complete: response.status === 200
          };
        } catch (error) {
          if (error.name === "AbortError") throw error;
          lastError = error;
          if (attempt < 3) await new Promise(function (resolve) { setTimeout(resolve, attempt * 700); });
        }
      }
      throw lastError;
    }

    function showShelf(manga, updateHistory) {
      clearPdfLoad();
      currentManga = manga;
      currentVolume = null;
      section.querySelector(".reader-title").innerHTML = '<strong>' + manga.title + '</strong><small>Selecciona un tomo</small>';
      external.hidden = true;
      var buttons = "";
      for (var volume = 1; volume <= manga.total; volume += 1) {
        buttons += '<button class="volume-card" data-volume="' + volume + '"><span>' + twoDigits(volume) + '</span><strong>Tomo ' + volume + '</strong><small>Leer PDF</small></button>';
      }
      content.innerHTML = '<div class="volume-shelf" data-manga="' + manga.id + '">' + buttons + '</div>';
      reader.classList.add("open");
      section.classList.add("reader-active");
      document.body.style.overflow = "hidden";
      if (updateHistory !== false) history.pushState({ mangaReader: true, view: "shelf", mangaId: manga.id }, "", "#tomos-" + manga.id);
    }

    async function showPdf(manga, volume, updateHistory) {
      clearPdfLoad();
      currentManga = manga;
      currentVolume = volume;
      var driveId = manga.driveIds && manga.driveIds[volume - 1];
      var path = driveId ? "https://drive.usercontent.google.com/download?id=" + driveId + "&export=download&confirm=t" : pdfPath(manga, volume);
      section.querySelector(".reader-title").innerHTML = '<strong>' + manga.title + ' · Tomo ' + volume + '</strong><button class="reader-back" type="button">← Volver a los tomos</button>';
      external.href = path;
      external.textContent = "Descargar PDF ↗";
      external.hidden = false;
      if (updateHistory !== false) history.pushState({ mangaReader: true, view: "pdf", mangaId: manga.id, volume: volume }, "", "#" + manga.id + "-tomo-" + twoDigits(volume));
      var back = section.querySelector(".reader-back");
      if (back) back.addEventListener("click", function () { history.back(); });

      if (!driveId) {
        content.innerHTML = '<object class="pdf-viewer" data="' + path + '" type="application/pdf"><div class="pdf-fallback"><span>📖</span><h3>No se pudo mostrar el PDF aquí</h3><p>Comprueba que el archivo se llame <strong>tomo-' + twoDigits(volume) + '.pdf</strong>.</p></div></object>';
        return;
      }

      content.innerHTML = '<div class="pdf-loading"><span>Descargando el tomo para leerlo…</span><div class="pdf-progress"><i></i></div><strong>0%</strong><small>Los tomos grandes pueden tardar unos segundos.</small></div>';
      activeDownload = new AbortController();
      try {
        var total = manga.driveSizes[volume - 1];
        var chunkSize = 8 * 1024 * 1024;
        var chunks = [];
        var received = 0;
        for (var start = 0; start < total; start += chunkSize) {
          var end = Math.min(start + chunkSize - 1, total - 1);
          var downloadPart = await fetchRangeWithRetry(path, start, end, activeDownload.signal);
          if (downloadPart.complete) {
            chunks = [downloadPart.bytes];
            received = downloadPart.bytes.length;
          } else {
            chunks.push(downloadPart.bytes);
            received += downloadPart.bytes.length;
          }
          var percent = Math.min(100, Math.round((received / total) * 100));
          var bar = content.querySelector(".pdf-progress i");
          var label = content.querySelector(".pdf-loading strong");
          if (bar) bar.style.width = percent + "%";
          if (label) label.textContent = percent + "%";
          if (downloadPart.complete) break;
        }
        if (currentManga !== manga || currentVolume !== volume) return;
        activeBlobUrl = URL.createObjectURL(new Blob(chunks, { type: "application/pdf" }));
        content.innerHTML = '<iframe class="pdf-viewer" src="' + activeBlobUrl + '" title="' + manga.title + ' tomo ' + volume + '"></iframe>';
      } catch (error) {
        if (error.name === "AbortError") return;
        content.innerHTML = '<div class="reader-setup"><span>📖</span><h3>No se pudo cargar el tomo</h3><p>Comprueba tu conexión e inténtalo nuevamente.</p><button class="manga-read retry-pdf" type="button">Intentar otra vez</button><a class="reader-download" href="' + path + '">Descargar PDF</a><small class="reader-error">' + String(error.message || error) + '</small></div>';
        var retry = content.querySelector(".retry-pdf");
        if (retry) retry.addEventListener("click", function () { showPdf(manga, volume, false); });
      }
    }

    grid.addEventListener("click", function (event) {
      var readId = event.target.dataset.read;
      var favoriteId = event.target.dataset.favorite;
      if (readId) showShelf(mangas.find(function (item) { return item.id === readId; }));
      if (favoriteId) {
        var index = favorites.indexOf(favoriteId);
        if (index === -1) favorites.push(favoriteId); else favorites.splice(index, 1);
        localStorage.setItem("less-manga-favorites", JSON.stringify(favorites));
        render();
      }
    });
    content.addEventListener("click", function (event) {
      var button = event.target.closest("[data-volume]");
      var shelf = event.target.closest("[data-manga]");
      if (!button || !shelf) return;
      var manga = mangas.find(function (item) { return item.id === shelf.dataset.manga; });
      showPdf(manga, Number(button.dataset.volume));
    });
    search.addEventListener("input", render);
    filter.addEventListener("click", function () { onlyFavorites = !onlyFavorites; filter.textContent = onlyFavorites ? "♥ Ver todos" : "♡ Mis favoritos"; render(); });
    function closeReader() { clearPdfLoad(); currentManga = null; currentVolume = null; reader.classList.remove("open"); section.classList.remove("reader-active"); content.innerHTML = ""; document.body.style.overflow = ""; }
    section.querySelector(".reader-close").addEventListener("click", closeReader);
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && reader.classList.contains("open")) closeReader(); });
    window.addEventListener("popstate", function (event) {
      var state = event.state;
      if (state && state.mangaReader) {
        var manga = mangas.find(function (item) { return item.id === state.mangaId; });
        if (state.view === "pdf") showPdf(manga, state.volume, false);
        else showShelf(manga, false);
      } else if (reader.classList.contains("open")) {
        closeReader();
        section.scrollIntoView({ block: "start" });
      }
    });
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
