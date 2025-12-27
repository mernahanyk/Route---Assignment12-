document.addEventListener("DOMContentLoaded", function () {
  const themeSwitcher = document.getElementById("theme-toggle-button");
  const sideMenuToggler = document.getElementById("settings-toggle");
  const sideMenuCloseButton = document.getElementById("close-settings");
  const sideMenu = document.getElementById("settings-sidebar");
  const fontButtons = document.querySelectorAll(".font-option");
  const body = document.body;
  const hero = document.getElementById("hero-section");
  const toTop = document.getElementById("scroll-to-top");
  const portfolioFilterBtn = document.querySelectorAll(".portfolio-filter");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll("header .nav-links a[href^='#']");
  const header = document.getElementById("header");
  const headerHeight = header ? header.offsetHeight : 0;
  const allFontClasses = ["font-alexandria", "font-cairo", "font-tajawal"];
  let isAutoScrolling = false;
  let scrollEndTimer = null;

  if (themeSwitcher) {
    themeSwitcher.addEventListener("click", function () {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");
      themeSwitcher.setAttribute("aria-pressed", isDark ? "true" : "false");
      localStorage.setItem("preferredTheme", isDark ? "dark" : "light");
    });
    const savedTheme = localStorage.getItem("preferredTheme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      themeSwitcher.setAttribute("aria-pressed", "true");
    }
  }

  if (sideMenu && sideMenuToggler && sideMenuCloseButton) {
    sideMenuToggler.addEventListener("click", function () {
      sideMenu.classList.remove("translate-x-full");
      sideMenu.classList.add("translate-x-0");
      sideMenuToggler.style.right = "20rem";
      sideMenuToggler.setAttribute("aria-expanded", "true");
    });

    sideMenuCloseButton.addEventListener("click", function () {
      sideMenu.classList.add("translate-x-full");
      sideMenu.classList.remove("translate-x-0");
      sideMenuToggler.style.right = "0";
      sideMenuToggler.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", function (event) {
      if (!sideMenu.contains(event.target) && !sideMenuToggler.contains(event.target)) {
        sideMenu.classList.add("translate-x-full");
        sideMenu.classList.remove("translate-x-0");
        sideMenuToggler.style.right = "0";
        sideMenuToggler.setAttribute("aria-expanded", "false");
      }
    });
  }

  function applyFont(fontKey) {
    allFontClasses.forEach(function (cls) {
      body.classList.remove(cls);
    });
    const className =
      fontKey === "alexandria"
        ? "font-alexandria"
        : fontKey === "cairo"
        ? "font-cairo"
        : "font-tajawal";
    body.classList.add(className);
  }

  function setActiveFontButton(activeButton) {
    fontButtons.forEach(function (btn) {
      const isActive = btn === activeButton;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });
  }

  fontButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const fontKey = button.dataset.font;
      applyFont(fontKey);
      localStorage.setItem("preferredFont", fontKey);
      setActiveFontButton(button);
    });
  });

  const savedFont = localStorage.getItem("preferredFont");
  if (savedFont) {
    const savedButton = document.querySelector(".font-option[data-font='" + savedFont + "']");
    if (savedButton) {
      applyFont(savedFont);
      setActiveFontButton(savedButton);
    }
  } else {
    const initiallyChecked = document.querySelector(".font-option[aria-checked='true']");
    if (initiallyChecked) {
      applyFont(initiallyChecked.dataset.font);
      setActiveFontButton(initiallyChecked);
    }
  }

  const setActiveByScrollPos = function () {
    const scrollPos = window.scrollY + headerHeight + 1;
    let currentId = null;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos <= top + height) {
        currentId = section.id;
      }
    });

    if (!currentId) return;

    navLinks.forEach(function (link) {
      const targetId = link.getAttribute("href").slice(1);
      link.classList.toggle("active", targetId === currentId);
      link.setAttribute("aria-current", targetId === currentId ? "page" : "false");
    });
  };

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      isAutoScrolling = true;

      const y = target.offsetTop - headerHeight;
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(function () {
        isAutoScrolling = false;
        setActiveByScrollPos();
      }, 1000);
    });
  });

  window.addEventListener("scroll", function () {
    if (isAutoScrolling) {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(function () {
        isAutoScrolling = false;
        setActiveByScrollPos();
      }, 120);
      return;
    }
    setActiveByScrollPos();
  });

  setActiveByScrollPos();

  function userPastHero() {
    if (!hero) return false;
    const heroTop = hero.offsetTop;
    const scrollY = window.scrollY || window.pageYOffset;
    const heroBottom = heroTop + hero.offsetHeight;
    return scrollY >= heroBottom;
  }

  if (toTop && hero) {
    window.addEventListener("scroll", function () {
      if (userPastHero()) {
        toTop.classList.replace("invisible", "visible");
        toTop.classList.replace("opacity-0", "opacity-100");
      } else {
        toTop.classList.replace("visible", "invisible");
        toTop.classList.replace("opacity-100", "opacity-0");
      }
    });

    toTop.addEventListener("click", function () {
      hero.scrollIntoView({ behavior: "smooth" });
    });
  }

  const colorsGrid = document.getElementById("theme-colors-grid");
  const accentOptions = [
    { id: "violet", c1: "#6366f1", c2: "#8b5cf6", title: "Purple Blue" },
    { id: "pink", c1: "#ec4899", c2: "#f97316", title: "Pink Orange" },
    { id: "green", c1: "#10b981", c2: "#059669", title: "Green Emerald" },
    { id: "blue", c1: "#3b82f6", c2: "#06b6d4", title: "Blue Cyan" },
    { id: "red", c1: "#ef4444", c2: "#f43f5e", title: "Red Rose" },
    { id: "orange", c1: "#f59e0b", c2: "#ea580c", title: "Amber Orange" },
  ];

  let currentAccent = localStorage.getItem("accentTheme") || "violet";

  function applyAccent(accentId) {
    const option = accentOptions.find(function (o) {
      return o.id === accentId;
    });
    if (!option) return;

    const root = document.documentElement;
    root.style.setProperty("--accent-color", option.c1);
    root.style.setProperty("--accent-color-secondary", option.c2);
    localStorage.setItem("accentTheme", accentId);

    if (!colorsGrid) return;
    const buttons = colorsGrid.querySelectorAll(".accent-option");
    buttons.forEach(function (btn) {
      const isActive = btn.dataset.accent === accentId;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", isActive ? "true" : "false");
    });
  }

  if (colorsGrid) {
    accentOptions.forEach(function (option) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.accent = option.id;
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-label", option.title);
      btn.title = option.title;
      btn.className =
        "accent-option accent-dot rounded-full border-2 border-transparent focus:outline-none";
      btn.style.background = "linear-gradient(135deg, " + option.c1 + ", " + option.c2 + ")";
      btn.style.transformOrigin = "center";
      btn.style.transition = "transform 0.2s ease-in-out";

      btn.addEventListener("click", function () {
        applyAccent(option.id);
      });

      colorsGrid.appendChild(btn);
    });

    applyAccent(currentAccent);
  }

  if (portfolioFilterBtn.length && portfolioItems.length) {
    portfolioFilterBtn.forEach(function (button) {
      button.addEventListener("click", function () {
        portfolioFilterBtn.forEach(function (b) {
          b.classList.remove(
            "active",
            "bg-linear-to-r",
            "from-primary",
            "to-secondary",
            "text-white",
            "shadow-lg",
            "shadow-primary/50"
          );
          b.classList.add(
            "bg-white",
            "dark:bg-slate-800",
            "text-slate-600",
            "dark:text-slate-300",
            "border",
            "border-slate-300",
            "dark:border-slate-700"
          );
          b.setAttribute("aria-pressed", "false");
        });

        this.classList.remove(
          "bg-white",
          "dark:bg-slate-800",
          "text-slate-600",
          "dark:text-slate-300",
          "border",
          "border-slate-300",
          "dark:border-slate-700"
        );
        this.classList.add(
          "active",
          "bg-linear-to-r",
          "from-primary",
          "to-secondary",
          "text-white",
          "shadow-lg",
          "shadow-primary/50"
        );
        this.setAttribute("aria-pressed", "true");

        const btnCategory = this.getAttribute("data-filter");

        portfolioItems.forEach(function (item) {
          const itemCategory = item.getAttribute("data-category");
          if (btnCategory === "all" || itemCategory === btnCategory) {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
            item.style.display = "block";
            item.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
          } else {
            item.style.opacity = "0";
            item.style.transform = "scale(0.8)";
            item.style.display = "none";
            item.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
          }
        });
      });
    });
  }

  function portfolioFilter() {
    const grid = document.getElementById("portfolio-grid");
    if (!grid || !portfolioFilterBtn.length || !portfolioItems.length) return;

    portfolioFilterBtn.forEach(function (c) {
      c.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter");

        portfolioFilterBtn.forEach(function (e) {
          e.classList.remove(
            "active",
            "bg-linear-to-r",
            "from-primary",
            "to-secondary",
            "text-white",
            "shadow-lg",
            "shadow-primary/50"
          );
          e.classList.add(
            "bg-white",
            "dark:bg-slate-800",
            "text-slate-600",
            "dark:text-slate-300",
            "border",
            "border-slate-300",
            "dark:border-slate-700"
          );
          e.setAttribute("aria-pressed", "false");
        });

        this.classList.remove(
          "bg-white",
          "dark:bg-slate-800",
          "text-slate-600",
          "dark:text-slate-300",
          "border",
          "border-slate-300",
          "dark:border-slate-700"
        );
        this.classList.add(
          "active",
          "bg-linear-to-r",
          "from-primary",
          "to-secondary",
          "text-white",
          "shadow-lg",
          "shadow-primary/50"
        );
        this.setAttribute("aria-pressed", "true");

        portfolioItems.forEach(function (e) {
          e.style.opacity = "0";
          e.style.transform = "scale(0.8)";
        });

        setTimeout(function () {
          portfolioItems.forEach(function (e) {
            const category = e.getAttribute("data-category");
            if (filter === "all" || category === filter) {
              e.style.display = "block";
            } else {
              e.style.display = "none";
            }
          });

          setTimeout(function () {
            portfolioItems.forEach(function (e) {
              const category = e.getAttribute("data-category");
              if (filter === "all" || category === filter) {
                e.style.opacity = "1";
                e.style.transform = "scale(1)";
              }
            });
          }, 50);
        }, 300);

        portfolioItems.forEach(function (c) {
          c.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        });
      });
    });
  }

  portfolioFilter();

    const testimonialsCarousel = document.getElementById("testimonials-carousel");
  const prevTestimonialBtn = document.getElementById("prev-testimonial");
  const nextTestimonialBtn = document.getElementById("next-testimonial");
  const testimonialIndicators = document.querySelectorAll(".carousel-indicator");

  if (testimonialsCarousel && prevTestimonialBtn && nextTestimonialBtn && testimonialIndicators.length) {
    const slides = testimonialsCarousel.querySelectorAll(".testimonial-card");
    let activeIndex = 0;
    let autoPlayTimer = null;
    const autoPlayDelay = 7000;
    const totalSlides = slides.length;

    function getSlidesPerView() {
      return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    }

    let slidesPerView = getSlidesPerView();
    let maxIndex = totalSlides - slidesPerView;

    function updateCarousel() {
      if (totalSlides === 0) return;

      activeIndex = Math.max(0, Math.min(activeIndex, maxIndex));

      const slideWidth = 100 / slidesPerView;
      const offset = activeIndex * slideWidth;
      testimonialsCarousel.style.transform = "translateX(" + offset + "%)";  // POSITIVE for RTL

      testimonialIndicators.forEach(function (indicator, i) {
        const isActive = i === activeIndex;
        if (isActive) {
          indicator.classList.add("active", "bg-accent", "scale-125");
          indicator.classList.remove("bg-slate-400", "dark:bg-slate-600");
        } else {
          indicator.classList.remove("active", "bg-accent", "scale-125");
          indicator.classList.add("bg-slate-400", "dark:bg-slate-600");
        }
        indicator.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      slides.forEach(function (slide, i) {
        const isVisible = i >= activeIndex && i < activeIndex + slidesPerView;
        slide.setAttribute("aria-hidden", isVisible ? "false" : "true");
      });
    }

    function nextSlide() {
      if (activeIndex < maxIndex) {
        activeIndex++;
      } else {
        activeIndex = 0;
      }
      updateCarousel();
    }

    function prevSlide() {
      if (activeIndex > 0) {
        activeIndex--;
      } else {
        activeIndex = maxIndex;
      }
      updateCarousel();
    }

    function goToSlide(index) {
      if (index >= 0 && index <= maxIndex) {
        activeIndex = index;
        updateCarousel();
      }
    }

    testimonialIndicators.forEach(function (indicator) {
      const index = parseInt(indicator.getAttribute("data-index"), 10) || 0;
      
      indicator.addEventListener("click", function () {
        goToSlide(index);
        restartAutoPlay();
      });

      indicator.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToSlide(index);
          restartAutoPlay();
        }
      });
    });

    nextTestimonialBtn.addEventListener("click", function () {
      nextSlide();
      restartAutoPlay();
    });

    prevTestimonialBtn.addEventListener("click", function () {
      prevSlide();
      restartAutoPlay();
    });

    function updateSlidesPerView() {
      slidesPerView = getSlidesPerView();
      maxIndex = totalSlides - slidesPerView;
      updateCarousel();
    }

    window.addEventListener("resize", function () {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(updateSlidesPerView, 150);
    });

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextSlide, autoPlayDelay);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function restartAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    testimonialsCarousel.addEventListener("mouseenter", stopAutoPlay);
    testimonialsCarousel.addEventListener("mouseleave", startAutoPlay);

    updateCarousel();
    startAutoPlay();
  }



});
