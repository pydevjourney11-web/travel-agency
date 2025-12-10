document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const header = document.querySelector(".header");
    const burger = document.querySelector(".burger");
    const navLinks = document.querySelectorAll(".nav__link[href^='#']");
    const chatButton = document.querySelector(".chat-button");
    const chatWidget = document.querySelector(".chat-widget");
    const chatClose = document.querySelector(".chat-widget__close");
    const chatHeaderTitle = document.querySelector(".chat-widget__header span");
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

    function isWorkingTime() {
        // Локальное время. Рабочие дни: Пн-Вс, часы: 10:00–20:00
        const now = new Date();
        const h = now.getHours();
        return h >= 10 && h < 20; // при необходимости скорректируем под ваш график
    }

    // Проставим статус онлайн/офлайн
    if (chatButton) {
        const btnSpan = chatButton.querySelector('span');
        if (btnSpan) {
            btnSpan.textContent = isWorkingTime() ? 'Онлайн-чат' : 'Оставить заявку';
        }
    }
    if (chatHeaderTitle) {
        chatHeaderTitle.textContent = isWorkingTime() ? 'Онлайн-чат' : 'Обратная связь';
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

    // Элементы формы поиска (без Sletat)
    const sletatForm = document.querySelector("#sletat-form");
    const sletatResults = document.querySelector("#sletat-results");
    const kidsInput = document.querySelector("#sletat-kids");
    const kidsAgesWrap = document.querySelector("#kids-ages-wrap");
    const kidsAgesFields = document.querySelector("#kids-ages-fields");

    function formatDateToDDMMYYYY(v) {
        if (!v) return "";
        const [y, m, d] = v.split("-");
        if (!y || !m || !d) return "";
        return `${d}/${m}/${y}`;
    }

    function toQS(params) {
        return Object.entries(params)
            .filter(([, val]) => val !== undefined && val !== null && val !== "")
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join("&");
    }

    function optionEl(value, label) {
        const o = document.createElement("option");
        o.value = String(value);
        o.textContent = label;
        return o;
    }

    // Нет словарей: теперь простая форма без зависимостей от Sletat

    function rebuildKidsAges(count) {
        const n = Math.max(0, Math.min(10, Number(count) || 0));
        if (!kidsAgesWrap || !kidsAgesFields) return;
        kidsAgesFields.innerHTML = "";
        if (n <= 0) {
            kidsAgesWrap.style.display = "none";
            return;
        }
        for (let i = 0; i < n; i++) {
            const field = document.createElement("div");
            field.className = "form__field";
            const label = document.createElement("label");
            label.textContent = `Возраст ребенка ${i+1}`;
            const select = document.createElement("select");
            select.name = "kid_age";
            for (let age = 0; age <= 17; age++) {
                select.appendChild(optionEl(age, `${age}`));
            }
            field.appendChild(label);
            field.appendChild(select);
            kidsAgesFields.appendChild(field);
        }
        kidsAgesWrap.style.display = "block";
    }

    function clearResults() {
        if (sletatResults) sletatResults.innerHTML = "";
    }

    function renderError(msg) {
        if (!sletatResults) return;
        sletatResults.innerHTML = `<article class="card"><h3 class="card__title">Ошибка</h3><p class="card__text">${msg}</p></article>`;
    }

    function renderResults(aa) {
        if (!sletatResults) return;
        if (!Array.isArray(aa) || aa.length === 0) {
            sletatResults.innerHTML = `<article class="card"><h3 class="card__title">Нет результатов</h3><p class="card__text">Попробуйте изменить параметры поиска.</p></article>`;
            return;
        }
        const cards = aa.slice(0, 9).map(function (row) {
            const title = (row && (row[6] || row[7])) || "Тур";
            const depart = row && row[12] ? row[12] : "";
            const arrive = row && row[13] ? row[13] : "";
            const nights = row && row[14] != null ? row[14] : "";
            const price = row && row[15] ? row[15] : "Цена по запросу";
            const country = row && row[31] ? row[31] : "";
            const resort = row && row[19] ? row[19] : "";
            const logo = row && row[34] ? row[34] : "";
            const meta = [depart && arrive ? `${depart} — ${arrive}` : depart || arrive, nights !== "" ? `${nights} ноч.` : ""].filter(Boolean).join(" · ");
            const place = [country, resort].filter(Boolean).join(", ");
            const logoImg = logo ? `<img src="${logo}" alt="TO" style="height:18px;width:auto;opacity:.85"/>` : "";
            return `
                <article class="card">
                    <h3 class="card__title">${title}</h3>
                    <p class="card__meta">${meta}</p>
                    <p class="card__text">${place}</p>
                    <p class="card__price">${price}</p>
                    ${logoImg}
                </article>
            `;
        }).join("");
        sletatResults.innerHTML = cards;
    }

    function demoData() {
        return [
            ["", 0, "", 0, "", 0, "Турция: Анталья", "Hotel Demo 1", "4*", "STD", "AI", "DBL", "10.07.2025", "17.07.2025", 7, "152000 RUB", 2, 0, "", "Анталья", "", "", "", "", "", "Вс.", "", "", 0, "Турция", 0, "Москва", "", 8.8, "", "", "//static.sletat.ru/images/to/4.png"],
            ["", 0, "", 0, "", 0, "Египет: Хургада", "Hotel Demo 2", "5*", "STD", "AI", "DBL", "20.07.2025", "30.07.2025", 10, "198500 RUB", 2, 0, "", "Хургада", "", "", "", "", "", "Пн.", "", "", 0, "Египет", 0, "Москва", "", 9.1, "", "", "//static.sletat.ru/images/to/7.png"]
        ];
    }

    if (sletatForm) {
        sletatForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            if (!sletatResults) return;
            clearResults();
            sletatResults.innerHTML = `<article class="card"><h3 class=\"card__title\">Загрузка...</h3><p class=\"card__text\">Идёт поиск по выбранному направлению.</p></article>`;

            const query = (document.getElementById("ta-query")?.value || "").trim();
            const s_adults = sletatForm.s_adults.value.trim() || "2";
            const s_kids = sletatForm.s_kids.value.trim() || "0";
            const s_nightsMin = sletatForm.s_nightsMin.value.trim() || "3";
            const s_nightsMax = sletatForm.s_nightsMax.value.trim() || "10";
            const df = formatDateToDDMMYYYY(sletatForm.s_departFrom.value);
            const dt = formatDateToDDMMYYYY(sletatForm.s_departTo.value);
            const currencyAlias = sletatForm.currencyAlias.value || "RUB";

            // Соберём возраста детей из выпадающих списков
            let s_kids_ages = "";
            if (kidsAgesFields && Number(s_kids) > 0) {
                const ages = Array.from(kidsAgesFields.querySelectorAll('select[name="kid_age"]'))
                    .slice(0, Number(s_kids))
                    .map(sel => sel.value || "0");
                s_kids_ages = ages.join(",");
            }

            if (!query) {
                renderError("Укажите направление (город/регион/отель).");
                return;
            }

            // Временный вывод демо-результатов до подключения бесплатного API
            renderResults(demoData());
        });
    }
});
