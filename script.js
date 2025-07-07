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
                            
                            // Create banner title from category name
                            var bannerTitle = document.createElement("div");
                            bannerTitle.className = "banner-title";
                            bannerTitle.textContent = category; // Use the category name as title
                            bannerDiv.appendChild(bannerTitle);
                            
                            // Add banner text content as individual items
                            var bannerContent = document.createElement("div");
                            bannerContent.className = "banner-content";
                            
                            // Split the text by commas and create individual sauce items
                            if (items.text) {
                                var sauces = items.text.split(',');
                                for (var j = 0; j < sauces.length; j++) {
                                    var sauceItem = document.createElement("div");
                                    sauceItem.className = "sauce-item";
                                    sauceItem.textContent = sauces[j].trim();
                                    bannerContent.appendChild(sauceItem);
                                }
                            }
                            
                            bannerDiv.appendChild(bannerContent);
                            
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

                            // Check if item.desc exists and is not empty
                            if (item.desc && item.desc.trim() !== "") {
                                itemElement.innerHTML =
                                    '<div class="item-name">' + item.name + '</div>' +
                                    '<div class="item-desc">' + item.desc + '</div>' +
                                    '<div class="item-price">' + item.price + '</div>';
                            } else {
                                // If price contains any letter (text), keep new line
                                if (/[a-zA-Z]/.test(item.price)) {
                                    itemElement.innerHTML =
                                        '<div class="item-name">' + item.name + '</div>' +
                                        '<div class="item-price">' + item.price + '</div>';
                                } else {
                                    // No description and price is just a number: put name and price in a flex row
                                    itemElement.classList.add('inline');
                                    itemElement.innerHTML =
                                        '<span class="item-name">' + item.name + '</span>' +
                                        '<span class="item-price">' + item.price + '</span>';
                                }
                            }
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

// Load all menus on page load
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

