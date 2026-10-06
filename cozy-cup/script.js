/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("show");

    if (nav.classList.contains("show")) {
        menuToggle.textContent = "✕";
    } else {
        menuToggle.textContent = "☰";
    }
});


/* Close mobile menu after clicking a link */

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("show");
        menuToggle.textContent = "☰";

    });

});


/* =========================
   ACTIVE NAVIGATION
========================= */

const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            current = section.getAttribute("id");
        }

    });

    document.querySelectorAll(".nav-link").forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});


/* =========================
   DARK MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");

    } else {

        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");

    }

});


/* Remember theme */

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";

}


/* =========================
   MENU FILTER
========================= */

const categoryButtons = document.querySelectorAll(".category-btn");
const menuCards = document.querySelectorAll(".menu-card");
const menuSearch = document.getElementById("menuSearch");
const noResults = document.getElementById("noResults");

let currentCategory = "all";


categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;

        filterMenu();

    });

});


/* Search menu */

menuSearch.addEventListener("input", filterMenu);


function filterMenu() {

    const searchValue = menuSearch ? menuSearch.value.toLowerCase().trim() : "";

    let visibleItems = 0;

    menuCards.forEach(card => {

        const category = card.dataset.category || "";
        const name = (card.dataset.name || "").toLowerCase();

        const categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;

        const searchMatch =
            name.includes(searchValue);

        if (categoryMatch && searchMatch) {

            card.style.display = "block";
            visibleItems++;

        } else {

            card.style.display = "none";

        }

    });

    // Only use noResults if it exists
    if (noResults) {
        if (visibleItems === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }

}

/* =========================
   FAVORITES
========================= */

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("liked");

        if (button.classList.contains("liked")) {

            button.textContent = "♥";
            showToast("Added to favorites!");

        } else {

            button.textContent = "♡";
            showToast("Removed from favorites!");

        }

    });

});


/* =========================
   CART SYSTEM
========================= */

let cart = [];

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");


/* Open cart */

cartButton.addEventListener("click", openCart);


function openCart() {

    cartSidebar.classList.add("show");
    cartOverlay.classList.add("show");

}


/* Close cart */

closeCart.addEventListener("click", closeCartSidebar);

cartOverlay.addEventListener("click", closeCartSidebar);


function closeCartSidebar() {

    cartSidebar.classList.remove("show");
    cartOverlay.classList.remove("show");

}


/* =========================
   ADD TO CART
========================= */

const addCartButtons =
    document.querySelectorAll(".add-cart");

addCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        addToCart(name, price);

    });

});


function addToCart(name, price) {

    const existingItem =
        cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    showToast(name + " added to cart!");

}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                <span>🛒</span>
                <h3>Your cart is empty</h3>
                <p>Add something delicious from our menu.</p>
            </div>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "₱0";

        return;

    }


    let total = 0;
    let itemCount = 0;


    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        itemCount += item.quantity;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div>

                <h4>${item.name}</h4>

                <div class="cart-item-price">
                    ₱${item.price.toLocaleString()}
                </div>

                <div class="quantity-controls">

                    <button
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                    <button
                        class="remove-item"
                        onclick="removeItem(${index})">
                        Remove
                    </button>

                </div>

            </div>

            <strong>
                ₱${(item.price * item.quantity).toLocaleString()}
            </strong>

        `;

        cartItems.appendChild(cartItem);

    });


    cartCount.textContent = itemCount;

    cartTotal.textContent =
        "₱" + total.toLocaleString();

}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(index, change) {

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }

    updateCart();

}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(index) {

    const removedItem = cart[index].name;

    cart.splice(index, 1);

    updateCart();

    showToast(removedItem + " removed from cart.");

}


/* =========================
   CHECKOUT
========================= */

const checkoutButton =
    document.getElementById("checkoutButton");


checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {

        showToast("Your cart is empty!");

        return;

    }


    let total = 0;

    cart.forEach(item => {

        total += item.price * item.quantity;

    });


    alert(
        "Thank you for your order!\n\n" +
        "Your total is ₱" +
        total.toLocaleString() +
        ".\n\n" +
        "The Cozy Cup Cafe will prepare your order."
    );


    cart = [];

    updateCart();

    closeCartSidebar();

});


/* =========================
   CONTACT FORM
========================= */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener("submit", event => {

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();


    showToast(
        "Thank you, " +
        name +
        "! Your message was sent."
    );


    contactForm.reset();

});


/* =========================
   TOAST NOTIFICATION
========================= */

const toast = document.getElementById("toast");
const toastMessage =
    document.getElementById("toastMessage");

let toastTimer;


function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* =========================
   BACK TO TOP
========================= */

const backTop =
    document.getElementById("backTop");


window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backTop.classList.add("show");

    } else {

        backTop.classList.remove("show");

    }

});


backTop.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   CLOSE CART WITH ESC
========================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCartSidebar();

        nav.classList.remove("show");

        menuToggle.textContent = "☰";

    }

});
/* =========================================
   MENU PRODUCT POPUP
========================================= */

let selectedMenuCard = null;


function openMenuItem(card) {

    selectedMenuCard = card;


    const name =
        card.getAttribute("data-name");

    const price =
        card.getAttribute("data-price");

    const description =
        card.getAttribute("data-description");

    const image =
        card.getAttribute("data-image");


    document.getElementById("menuModalName")
        .textContent = name;

    document.getElementById("menuModalPrice")
        .textContent = price;

    document.getElementById("menuModalDescription")
        .textContent = description;

    document.getElementById("menuModalImage")
        .src = image;

    document.getElementById("menuModalImage")
        .alt = name;


    document.getElementById("menuModal")
        .classList.add("active");


    document.body.style.overflow = "hidden";
}


/* CLOSE MENU POPUP */

function closeMenuItem() {

    document.getElementById("menuModal")
        .classList.remove("active");

    document.body.style.overflow = "";

    selectedMenuCard = null;
}


/* ADD TO CART FROM POPUP */

document.getElementById("menuModalCart")
    .addEventListener("click", function () {

        if (selectedMenuCard) {

            const addButton =
                selectedMenuCard.querySelector(".add-cart");

            if (addButton) {

                addButton.click();

            }

            closeMenuItem();

        }

    });


/* CLOSE WHEN CLICKING OUTSIDE */

document.getElementById("menuModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            closeMenuItem();

        }

    });


/* CLOSE WITH ESC */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeMenuItem();

    }

});
/* ================================
   CUSTOMER REVIEW POPUP
================================ */

function openReview(name, stars, review, image) {

    const modal = document.getElementById("reviewModal");

    const modalImage = document.getElementById("reviewModalImage");
    const modalName = document.getElementById("reviewModalName");
    const modalStars = document.getElementById("reviewModalStars");
    const modalText = document.getElementById("reviewModalText");

    modalImage.src = image;
    modalImage.alt = name;

    modalName.textContent = name;
    modalStars.textContent = stars;
    modalText.textContent = review;

    modal.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeReview() {

    const modal = document.getElementById("reviewModal");

    modal.classList.remove("active");

    document.body.style.overflow = "";
}


/* Close when clicking outside the popup */

document.getElementById("reviewModal").addEventListener("click", function(event) {

    if (event.target === this) {
        closeReview();
    }

});


/* Close with ESC */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeReview();
    }

});