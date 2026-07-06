const starsContainer = document.getElementById("stars");

for (let i = 0; i < 200; i++) {

    const star = document.createElement("div");

    star.className = "star";

    const size = Math.random() * 3 + 1;

    star.style.width = size + "px";
    star.style.height = size + "px";

    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";

    star.style.animationDelay = Math.random() * 5 + "s";
    star.style.animationDuration = (2 + Math.random() * 5) + "s";

    starsContainer.appendChild(star);

}
function createShootingStar() {

    const star = document.createElement("div");

    star.classList.add("shooting-star");

    star.style.top = Math.random() * 40 + "%";
    star.style.left = Math.random() * 100 + "%";

    document.body.appendChild(star);

    setTimeout(() => {
        star.remove();
    }, 3000);

}

setInterval(() => {

    createShootingStar();

}, 4000);