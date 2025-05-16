// Hardcoded default screen types
var screenType = "drive1"; // Main menu
var secondaryScreenType = "drive1/2"; // Secondary menu

// Function to load a menu dynamically
function loadMenu(screenType, containerId) {
    var container = document.getElementById(containerId);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "menu.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                var categories = data[screenType]; // Use the specified screen type

                if (!categories) {
                    container.innerHTML = "<p>No menu available for " + screenType + ".</p>";
                    return;
                }

                container.innerHTML = ""; // Clear previous content

                // Render menu categories and items
                for (var category in categories) {
                    if (categories.hasOwnProperty(category)) {
                        var items = categories[category];

                        // Handle special banner/vector (e.g., combo-banner)
                        if (typeof items === "object" && items.type === "banner") {
                            var bannerDiv = document.createElement("div");
                            bannerDiv.className = "menu-banner flame-banner";
                            bannerDiv.textContent = items.text || "";
                            if (items.price) {
                                var priceSpan = document.createElement("span");
                                priceSpan.className = "banner-price";
                                priceSpan.textContent = " " + items.price;
                                bannerDiv.appendChild(priceSpan);
                            }
                            container.appendChild(bannerDiv);
                            continue;
                        }
                        // Handle special banner/vector (e.g., New item)
                        if (typeof items === "object" && items.type === "New") {
                            var newDiv = document.createElement("div");
                            newDiv.className = "menu-banner flame-new";
                            newDiv.textContent = items.text || "";
                            if (items.price) {
                                var priceSpan = document.createElement("span");
                                priceSpan.className = "New-price";
                                priceSpan.textContent = " " + items.price;
                                newDiv.appendChild(priceSpan);
                            }
                            container.appendChild(newDiv);
                            continue;
                        }
                        var categoryDiv = document.createElement("div");
                        categoryDiv.className = "menu-category";
                        

                        var titleIconWrapper = document.createElement("div");
                        titleIconWrapper.className = "category-title-wrapper";

                        var categoryTitle = document.createElement("h2");
                        categoryTitle.textContent = category;
                        categoryTitle.className = "category-title";
                        
                        titleIconWrapper.appendChild(categoryTitle);

                        var iconImg = document.createElement("img");
                        iconImg.src = "assets/icons/" + encodeURIComponent(category) + ".png";
                        iconImg.alt = category + " icon";
                        iconImg.className = "category-icon";
                        iconImg.onerror = function() { this.style.display = "none"; };
                        titleIconWrapper.appendChild(iconImg);

                        categoryDiv.appendChild(titleIconWrapper);

                        var itemsGrid = document.createElement("div");
                        itemsGrid.className = "items-grid";

                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            var itemElement = document.createElement("div");
                            itemElement.className = "menu-item";
                        
                        
                            itemElement.innerHTML =
                                '<div class="item-name">' + item.name + '</div>' +
                                '<div class="item-desc">' + item.desc + '</div>' +
                                '<div class="item-price">' + item.price + '</div>';
                            itemsGrid.appendChild(itemElement);
                        }

                        categoryDiv.appendChild(itemsGrid);
                        container.appendChild(categoryDiv);
                    }
                }
            } catch (e) {
                console.log("Error parsing menu.json:", e);
                container.innerHTML = "<p>Error loading menu.</p>";
            }
        }
    };
    xhr.send();
}

// Load both menus on page load
window.onload = function () {
    loadMenu(screenType, "menu-items"); // Load the main menu
    loadMenu(secondaryScreenType, "secondary-menu-items"); // Load the secondary menu
};

// Handle screen switching
document.getElementById("screen-links").addEventListener("click", function (event) {
    if (event.target.classList.contains("screen-link")) {
        event.preventDefault(); // Prevent default link behavior

        // Get the screen and secondary screen from the link's data attributes
        screenType = event.target.dataset.screen;
        secondaryScreenType = event.target.dataset.secondary;

        // Reload the menus
        loadMenu(screenType, "menu-items");
        loadMenu(secondaryScreenType, "secondary-menu-items");
    }
});
