document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const header = document.querySelector(".header");
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelectorAll(".nav__link[href^='#']");
    const chatButton = document.querySelector(".chat-button");
    const chatWidget = document.querySelector(".chat-widget");
    const chatClose = document.querySelector(".chat-widget__close");
    const heroCtaButtons = document.querySelectorAll(".js-open-tour-modal");
    const modal = document.querySelector("#tour-modal");
    const modalOverlay = modal ? modal.querySelector(".modal__overlay") : null;
    const modalClose = modal ? modal.querySelector(".modal__close") : null;

    const tourForm = document.querySelector("#tour-request-form");
    const hotelForm = document.querySelector("#hotel-request-form");
    const feedbackForm = document.querySelector("#feedback-form");
    const chatForm = document.querySelector("#chat-form");
    const modalTourForm = document.querySelector("#modal-tour-form");

    const yearSpan = document.querySelector("#year");
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }

    if (burger && header) {
        burger.addEventListener("click", function () {
            header.classList.toggle("header--menu-open");
        });
    }

    function smoothScrollToId(id) {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (navLinks.length) {
        navLinks.forEach(function (link) {
            link.addEventListener("click", function (e) {
                const hash = link.getAttribute("href");
                if (hash && hash.startsWith("#")) {
                    const id = hash.substring(1);
                    const target = document.getElementById(id);
                    if (target) {
                        e.preventDefault();
                        smoothScrollToId(id);
                        if (header && header.classList.contains("header--menu-open")) {
                            header.classList.remove("header--menu-open");
                        }
                    }
                }
            });
        });
    }

    function toggleChat(open) {
        if (!chatWidget) return;
        if (open) {
            chatWidget.classList.add("chat-widget--open");
            chatWidget.setAttribute("aria-hidden", "false");
        } else {
            chatWidget.classList.remove("chat-widget--open");
            chatWidget.setAttribute("aria-hidden", "true");
        }
    }

    if (chatButton) {
        chatButton.addEventListener("click", function () {
            const isOpen = chatWidget && chatWidget.classList.contains("chat-widget--open");
            toggleChat(!isOpen);
        });
    }

    if (chatClose) {
        chatClose.addEventListener("click", function () {
            toggleChat(false);
        });
    }

    function openModal() {
        if (!modal) return;
        modal.classList.add("modal--open");
        modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("modal--open");
        modal.setAttribute("aria-hidden", "true");
    }

    if (heroCtaButtons.length) {
        heroCtaButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                openModal();
            });
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener("click", function () {
            closeModal();
        });
    }

    if (modalClose) {
        modalClose.addEventListener("click", function () {
            closeModal();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (modal && modal.classList.contains("modal--open")) {
                closeModal();
            }
            if (chatWidget && chatWidget.classList.contains("chat-widget--open")) {
                toggleChat(false);
            }
        }
    });

    function attachSimpleSubmitHandler(form) {
        if (!form) return;
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.");
            form.reset();
        });
    }

    attachSimpleSubmitHandler(tourForm);
    attachSimpleSubmitHandler(hotelForm);
    attachSimpleSubmitHandler(feedbackForm);
    attachSimpleSubmitHandler(chatForm);
    attachSimpleSubmitHandler(modalTourForm);
});
