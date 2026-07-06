const intro = document.getElementById("intro");
const world = document.getElementById("world");
const button = document.getElementById("enterBtn");

button.addEventListener("click", () => {

    intro.style.transition = "1.2s";

    intro.style.transform = "scale(1.15)";

    intro.style.opacity = "0";

    setTimeout(() => {

        intro.style.display = "none";

        world.style.display = "block";

    },1200);

});