var screenType = "drive1";
var secondaryScreenType = "drive1/2";

function generateMenuHTML(categories) {
    let html = "";

    for (var category in categories) {
        if (!categories.hasOwnProperty(category)) continue;

        var items = categories[category];

        // Banner (e.g., combo-banner)
        if (typeof items === "object" && items.type === "banner") {
            html += `<div class="menu-banner flame-banner">${items.text || ""}`;
            if (items.price) {
                html += `<span class="banner-price"> ${items.price}</span>`;
            }
            html += `</div>`;
            continue;
        }

        // New Item Banner
        if (typeof items === "object" && items.type === "New") {
            html += `<div class="menu-banner flame-new">${items.text || ""}`;
            if (items.price) {
                html += `<span class="New-price"> ${items.price}</span>`;
            }
            html += `</div>`;
            continue;
        }

        html += `<div class="menu-category">`;
        html += `<div class="category-title-wrapper">`;
        html += `<h2 class="category-title">${category}</h2>`;
        html += `<img src="assets/icons/${encodeURIComponent(category)}.png" alt="${category} icon" class="category-icon" onerror="this.style.display='none';" />`;
        html += `</div>`; // wrapper

        html += `<div class="items-grid">`;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            html += `
                <div class="menu-item">
                    <div class="item-name">${item.name}</div>
                    <div class="item-desc">${item.desc}</div>
                    <div class="item-price">${item.price}</div>
                </div>
            `;
        }
        html += `</div>`; // items-grid
        html += `</div>`; // menu-category
    }

    return html;
}

function updateIfChanged(container, newHTML) {
    if (container.getAttribute("data-prev-html") !== newHTML) {
        container.innerHTML = newHTML;
        container.setAttribute("data-prev-html", newHTML);
    }
}

function loadMenu(screenType, containerId) {
    const container = document.getElementById(containerId);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "menu.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const data = JSON.parse(xhr.responseText);
                const categories = data[screenType];
                if (!categories) {
                    container.innerHTML = `<p>No menu available for ${screenType}.</p>`;
                    return;
                }

                const newHTML = generateMenuHTML(categories);
                updateIfChanged(container, newHTML);
            } catch (e) {
                console.error("Error parsing menu.json:", e);
                container.innerHTML = "<p>Error loading menu.</p>";
            }
        }
    };
    xhr.send();
}

window.onload = function () {
    loadMenu(screenType, "menu-items");
    loadMenu(secondaryScreenType, "secondary-menu-items");
};

document.getElementById("screen-links")?.addEventListener("click", function (event) {
    if (event.target.classList.contains("screen-link")) {
        event.preventDefault();
        screenType = event.target.dataset.screen;
        secondaryScreenType = event.target.dataset.secondary;
        loadMenu(screenType, "menu-items");
        loadMenu(secondaryScreenType, "secondary-menu-items");
    }
});
