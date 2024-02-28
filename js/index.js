"use strict";

const mobileSlider = function () {
  const sliderItems = document.querySelectorAll(".slider__item");
  const sliderDots = document.querySelector(".slider__dots");
  const slider = document.getElementById("slider");

  if (sliderItems.length === 0) throw new Error("slider__item не создан");

  if (!slider) throw new Error("#slider не создан");

  let isInitialize = false;
  let activeItem = 1;
  let totalDots = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      const beforeInitialize = function () {
        let visibleItems = 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio === 1) {
            visibleItems += 1;
          }
        });

        entries[entries.length - 1].target.dataset.last = true;

        totalDots = Math.round(sliderItems.length / visibleItems);

        for (let i = 0; i < totalDots; i++) {
          sliderDots.append(document.createElement("li"));
        }

        sliderDots.children[0].classList.add("active");
        isInitialize = true;
      };

      const afterInitialize = function () {
        const updateDots = function (newValue) {
          sliderDots.children[activeItem - 1].classList.remove("active");

          activeItem = newValue;

          sliderDots.children[activeItem - 1].classList.add("active");
        };
        const fadeStartElement = document.getElementById("fade-start");
        const fadeEndElement = document.getElementById("fade-end");

        const divider = Math.round(sliderItems.length / totalDots);

        entries.forEach((entry) => {
          if (entry.intersectionRatio === 1 || activeItem === totalDots) {
            const key = +entry.target.dataset.key;
            const dotIndex = Math.floor(key / divider);
            const isLast = !!entry.target.dataset["last"];

            if (key === 1) {
              fadeStartElement.style.display = "none";
            } else {
              fadeStartElement.style.display = "block";
            }

            if (key === sliderItems.length) {
              fadeEndElement.style.display = "none";
            } else {
              fadeEndElement.style.display = "block";
            }

            if (activeItem === totalDots || key % divider === 0)
              updateDots(dotIndex);
            else if (isLast) updateDots(totalDots);
          }
        });
      };

      if (!isInitialize) beforeInitialize();
      else afterInitialize();
    },
    { root: slider, threshold: 1 }
  );

  sliderItems.forEach((item) => {
    observer.observe(item);
  });
};

const showAllHandlers = function (total) {
  const showElement = document.getElementById("show");
  const hideElement = document.getElementById("hide");
  let hiddenElements = [];

  const hideItems = function () {
    const sliderItemsElement = document.querySelectorAll(".slider__item");

    sliderItemsElement.forEach((item, i) => {
      if (i >= total) {
        hiddenElements.push(item);
        item.remove();
      }
    });

    showElement.classList.remove("hide");
    hideElement.classList.add("hide");
  };
  const showItems = function () {
    const sliderInnerElement =
      document.getElementsByClassName("slider__inner")[0];

    while (hiddenElements.length) {
      const item = hiddenElements.shift();
      sliderInnerElement.append(item);
    }

    hideElement.classList.remove("hide");
    showElement.classList.add("hide");
  };

  show.addEventListener("click", showItems);
  hide.addEventListener("click", hideItems);

  hideItems();
};

if (window.screen.width < 768) window.addEventListener("load", mobileSlider);
else if (window.screen.width < 1120) showAllHandlers(6);
else showAllHandlers(8);
