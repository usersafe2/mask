// ============================
// Dream Home - script.js
// ============================

let properties = [];

const container = document.getElementById("propertyContainer");

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const furnishedFilter = document.getElementById("furnishedFilter");

const priceFilter = document.getElementById("priceFilter");
const priceValue = document.getElementById("priceValue");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const prevImage =
document.getElementById("prevImage");

const nextImage =
document.getElementById("nextImage");
const modalTitle = document.getElementById("modalTitle");
const modalLocation = document.getElementById("modalLocation");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

const whatsappBtn = document.getElementById("whatsappBtn");
let currentImages = [];
let currentImageIndex = 0;

// ============================
// Format Price
// ============================

function formatPrice(price) {

    return Number(price).toLocaleString("en-US");

}

// ============================
// Load Properties
// ============================

fetch("properties.json")
.then(response => response.json())
.then(data => {

    properties = data;

    displayProperties(properties);

})
.catch(error => {

    console.error("Error:", error);

});

// ============================
// Display Properties
// ============================

function displayProperties(list) {

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <h3 style="width:100%;text-align:center;padding:40px;">
                لا يوجد عقارات مطابقة
            </h3>
        `;

        return;

    }

    list.forEach(property => {

        container.innerHTML += `
            <div class="card" onclick="openProperty(${property.id})">

                    <img src="${property.images[0]}" alt="${property.title}">

                <div class="card-content">

                    <h3>${property.title}</h3>

                    <p class="location">
                     📍 ${property.location}
                    </p>

                    <div class="property-info">

                        <span>📐 ${property.area} م²</span>

                        <span>🛏️ ${property.rooms} غرف</span>

                        <span>🚿 ${property.bathrooms} حمام</span>

                    </div>

                    <p class="price">
                        ${formatPrice(property.price)} جنيه
                    </p>

                </div>

            </div>
        `;

    });

}

// ============================
// Filter Properties
// ============================

function filterProperties() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const typeValue = typeFilter.value;

    const statusValue = statusFilter.value;

    const furnishedValue = furnishedFilter.value;

    const maxPrice = Number(priceFilter.value);

    const filtered = properties.filter(property => {

        const matchSearch =

            property.title.toLowerCase().includes(searchValue) ||

            property.location.toLowerCase().includes(searchValue);

        const matchType =

            typeValue === "" ||

            property.type === typeValue;

        const matchStatus =

            statusValue === "" ||

            property.status === statusValue;

        const matchPrice =

            Number(property.price) <= maxPrice;

        const matchFurnished =

            furnishedFilter.style.display === "none" ||

            furnishedValue === "" ||

            property.furnished === furnishedValue;

        return (

            matchSearch &&

            matchType &&

            matchStatus &&

            matchPrice &&

            matchFurnished

        );

    });

    displayProperties(filtered);

}

// ============================
// Furnished Filter
// ============================

function checkFurnishedFilter() {

    if (

        (typeFilter.value === "شقة" ||

         typeFilter.value === "محل")

        &&

        statusFilter.value === "إيجار"

    ) {

        furnishedFilter.style.display = "block";

    }

    else {

        furnishedFilter.style.display = "none";

        furnishedFilter.value = "";

    }

}

// ============================
// Price Range
// ============================

function changePriceRange() {

    if (statusFilter.value === "إيجار") {

        priceFilter.max = 100000;

        priceFilter.step = 1000;

        if (Number(priceFilter.value) > 100000) {

            priceFilter.value = 100000;

        }

    }

    else {

        priceFilter.max = 20000000;

        priceFilter.step = 100000;

        if (Number(priceFilter.value) > 20000000) {

            priceFilter.value = 20000000;

        }

    }

    priceValue.textContent =
        formatPrice(priceFilter.value) + " جنيه";

}

// ============================
// Events
// ============================

searchInput.addEventListener("keyup", filterProperties);

typeFilter.addEventListener("change", () => {

    checkFurnishedFilter();

    filterProperties();

});

statusFilter.addEventListener("change", () => {

    checkFurnishedFilter();

    changePriceRange();

    filterProperties();

});

furnishedFilter.addEventListener("change", filterProperties);

priceFilter.addEventListener("input", () => {

    priceValue.textContent =
        formatPrice(priceFilter.value) + " جنيه";

    filterProperties();

});

// تشغيل أول مرة

checkFurnishedFilter();

changePriceRange();

// ============================
// Modal
// ============================

function openProperty(id) {

    const property = properties.find(item => item.id === id);

    if (!property) return;

    currentImages = property.images;

    currentImageIndex = 0;

    modalImage.src = currentImages[currentImageIndex];

    modalTitle.textContent = property.title;

    modalLocation.textContent =
        "📍 " + property.location;

    modalPrice.textContent =
        formatPrice(property.price) + " جنيه";

    modalDescription.textContent =
        property.description;

    const phone = "201090902045";

    whatsappBtn.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(
            `السلام عليكم، أريد الاستفسار عن العقار: ${property.title}`
        )}`;

    modal.style.display = "flex";

}


// ============================
// Close Modal
// ============================

document.getElementById("close").addEventListener("click", () => {

    modal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});


// ============================
// Dark Mode
// ============================

const darkModeBtn =
document.getElementById("darkModeBtn");

darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    darkModeBtn.textContent =
        document.body.classList.contains("dark")
        ? "☀"
        : "🌙";

});


// ============================
// Splash Screen
// ============================

window.addEventListener("load", () => {

    const splash =
    document.getElementById("splash");

    if (!splash) return;

    setTimeout(() => {

        splash.classList.add("hideSplash");

        setTimeout(() => {

            splash.remove();

        }, 800);

    }, 3000);

});

// ============================
// Image Slider
// ============================

nextImage.addEventListener("click", () => {

    if(currentImages.length === 0) return;

    currentImageIndex++;

    if(currentImageIndex >= currentImages.length){

        currentImageIndex = 0;

    }

    modalImage.src =
    currentImages[currentImageIndex];

});


prevImage.addEventListener("click", () => {

    if(currentImages.length === 0) return;


    currentImageIndex--;


    if(currentImageIndex < 0){

        currentImageIndex =
        currentImages.length - 1;

    }


    modalImage.src =
    currentImages[currentImageIndex];

});
