const intro = document.getElementById("intro");
const world = document.getElementById("world");
const enterBtn = document.getElementById("enterBtn");

enterBtn.addEventListener("click", () => {
  intro.style.transition = "1s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.08)";

  setTimeout(() => {
    intro.style.display = "none";
    world.style.display = "block";
    window.scrollTo(0,0);
  }, 1000);
});