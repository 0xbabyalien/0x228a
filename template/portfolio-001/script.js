/* =========================
   CUSTOM CURSOR
========================= */

const cursorDot =
  document.querySelector(".cursor-dot");

const cursorRing =
  document.querySelector(".cursor-ring");


if (
  cursorDot &&
  cursorRing &&
  window.matchMedia("(pointer:fine)").matches
) {

  let mx = innerWidth / 2;
  let my = innerHeight / 2;

  let rx = mx;
  let ry = my;


  addEventListener("mousemove", (e) => {

    mx = e.clientX;
    my = e.clientY;

    cursorDot.style.left =
      mx + "px";

    cursorDot.style.top =
      my + "px";

  });


  function cursorLoop() {

    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;

    cursorRing.style.left =
      rx + "px";

    cursorRing.style.top =
      ry + "px";

    requestAnimationFrame(cursorLoop);

  }

  cursorLoop();


  document
    .querySelectorAll(
      "a, .magnetic-card, button"
    )
    .forEach((el) => {

      el.addEventListener(
        "mouseenter",
        () => {

          cursorRing.style.width =
            "52px";

          cursorRing.style.height =
            "52px";

        }
      );


      el.addEventListener(
        "mouseleave",
        () => {

          cursorRing.style.width =
            "34px";

          cursorRing.style.height =
            "34px";

        }
      );

    });

}


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
  document.querySelector(".menu-toggle");

const navLinks =
  document.querySelector(".nav-links");


menuToggle?.addEventListener(
  "click",
  () => {

    const isOpen =
      navLinks.classList.toggle("open");

    menuToggle.classList.toggle(
      "open",
      isOpen
    );

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  }
);


document
  .querySelectorAll(".nav-links a")
  .forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        navLinks?.classList.remove(
          "open"
        );

        menuToggle?.classList.remove(
          "open"
        );

        menuToggle?.setAttribute(
          "aria-expanded",
          "false"
        );

      }
    );

  });


/* =========================
   SCROLL REVEAL
========================= */

const revealElements =
  document.querySelectorAll(".reveal");


if (
  "IntersectionObserver" in window
) {

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "show"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: .12
      }
    );


  revealElements.forEach(
    (element) => {

      observer.observe(element);

    }
  );

} else {

  revealElements.forEach(
    (element) => {

      element.classList.add(
        "show"
      );

    }
  );

}


/* =========================
   MAGNETIC ELEMENT
========================= */

document
  .querySelectorAll(".magnetic")
  .forEach((element) => {

    element.addEventListener(
      "mousemove",
      (e) => {

        const rect =
          element.getBoundingClientRect();

        const x =
          e.clientX -
          rect.left -
          rect.width / 2;

        const y =
          e.clientY -
          rect.top -
          rect.height / 2;


        element.style.transform =
          `translate(
            ${x * .12}px,
            ${y * .12}px
          )`;

      }
    );


    element.addEventListener(
      "mouseleave",
      () => {

        element.style.transform =
          "";

      }
    );

  });


/* =========================
   PROJECT CARD TILT
========================= */

document
  .querySelectorAll(".magnetic-card")
  .forEach((card) => {

    card.addEventListener(
      "mousemove",
      (e) => {

        const rect =
          card.getBoundingClientRect();

        const x =
          (e.clientX - rect.left)
          / rect.width - .5;

        const y =
          (e.clientY - rect.top)
          / rect.height - .5;


        card.style.transform =
          `perspective(900px)
           rotateX(${y * -3}deg)
           rotateY(${x * 3}deg)
           translateY(-8px)`;

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transform =
          "";

      }
    );

  });


/* =========================
   HERO PARALLAX
========================= */

const hero =
  document.querySelector(".hero");

const heroShape =
  hero?.querySelector(".hero-shape");

const heroCopy =
  hero?.querySelector(".hero-copy");


let parallaxTicking = false;


function updateParallax() {

  if (
    !hero ||
    !heroShape ||
    !heroCopy
  ) {

    parallaxTicking = false;

    return;

  }


  const y =
    Math.min(window.scrollY, 1200);


  heroShape.style.transform =
    `translateY(
      calc(-50% + ${y * .08}px)
    )`;


  heroCopy.style.transform =
    `translateY(
      ${y * .04}px
    )`;


  parallaxTicking = false;

}


addEventListener(
  "scroll",
  () => {

    if (
      !parallaxTicking
    ) {

      requestAnimationFrame(
        updateParallax
      );

      parallaxTicking = true;

    }

  },
  {
    passive: true
  }
);


/* =========================
   DISABLE EMPTY LINKS
========================= */

document
  .querySelectorAll(
    'a[href="#"]'
  )
  .forEach((link) => {

    link.addEventListener(
      "click",
      (e) => {

        e.preventDefault();

      }
    );

  });


/* =========================
   INITIAL STATE
========================= */

updateParallax();
