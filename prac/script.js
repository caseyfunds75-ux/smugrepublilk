"use strict";

// Replace these values with verified dealership contact details before launch.
const WHATSAPP_NUMBER = "234XXXXXXXXXX";
const MAP_LINK = "";

// Demonstration inventory only. Update these objects with confirmed vehicle details and photos.
const vehicles = [
  { id: "camry-2018", make: "Toyota", model: "Camry", year: 2018, type: "Sedan", price: 28500000, transmission: "Automatic", fuel: "Petrol", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg?width=1000", photoSource: "https://commons.wikimedia.org/wiki/File:2018_Toyota_Camry_(ASV70R)_Ascent_sedan_(2018-08-27)_01.jpg", description: "A sample mid-size sedan listing. Confirm the vehicle's trim, condition, mileage, documentation and current price directly with the dealership." },
  { id: "corolla-2020", make: "Toyota", model: "Corolla", year: 2020, type: "Sedan", price: 24800000, transmission: "Automatic", fuel: "Petrol", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2020_Toyota_Corolla_LE_sedan.jpg?width=1000", photoSource: "https://commons.wikimedia.org/wiki/File:2020_Toyota_Corolla_LE_sedan.jpg", description: "A sample compact sedan listing. Confirm the vehicle's trim, condition, mileage, documentation and current price directly with the dealership." },
  { id: "lexus-rx-2019", make: "Lexus", model: "RX 350", year: 2019, type: "SUV", price: 59500000, transmission: "Automatic", fuel: "Petrol", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2018_Lexus_RX_300_Special_Edition_%2810%29.jpg?width=1000", photoSource: "https://commons.wikimedia.org/wiki/Category:Lexus_RX", description: "A sample luxury SUV listing. The reference photograph shows a Lexus RX from the same model generation; the exact trim and year pictured may differ. Confirm the actual vehicle, condition, mileage, documentation and price directly with the dealership." },
  { id: "highlander-2021", make: "Toyota", model: "Highlander", year: 2021, type: "SUV", price: 58000000, transmission: "Automatic", fuel: "Petrol", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2021_Toyota_Highlander_XLE_AWD%2C_front_12.12.20.jpg?width=1000", photoSource: "https://commons.wikimedia.org/wiki/File:2021_Toyota_Highlander_XLE_AWD,_front_12.12.20.jpg", description: "A sample family SUV listing. Confirm the vehicle's trim, condition, mileage, documentation and current price directly with the dealership." },
  { id: "accord-2018", make: "Honda", model: "Accord", year: 2018, type: "Sedan", price: 31000000, transmission: "Automatic", fuel: "Petrol", image: "https://commons.wikimedia.org/wiki/Special:FilePath/%2718_Honda_Accord_%28SIAM_2018%29.jpg?width=1000", photoSource: "https://commons.wikimedia.org/wiki/File:%2718_Honda_Accord_(SIAM_2018).jpg", description: "A sample sedan listing. Confirm the vehicle's trim, condition, mileage, documentation and current price directly with the dealership." },
  { id: "mercedes-c-class-2020", make: "Mercedes-Benz", model: "C-Class", year: 2020, type: "Sedan", price: 49500000, transmission: "Automatic", fuel: "Petrol", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2020_Mercedes-Benz_C300_AMG_Line_Night_Edition_Premium_2.0_Front.jpg?width=1000", photoSource: "https://commons.wikimedia.org/wiki/File:2020_Mercedes-Benz_C300_AMG_Line_Night_Edition_Premium_2.0_Front.jpg", description: "A sample executive sedan listing. Confirm the vehicle's trim, condition, mileage, documentation and current price directly with the dealership." }
];

const grid = document.querySelector("#vehicle-grid");
const searchInput = document.querySelector("#search-input");
const typeFilter = document.querySelector("#type-filter");
const priceFilter = document.querySelector("#price-filter");
const transmissionFilter = document.querySelector("#transmission-filter");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#vehicle-dialog");
const dialogContent = document.querySelector("#dialog-content");
const toast = document.querySelector("#toast");
let toastTimer;

const formatPrice = (price) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(price);
const vehicleMessage = (vehicle) => `Hello Smug Republik Auto Sales, I'm interested in the ${vehicle.make} ${vehicle.model}. Please share the current price, availability, and more details.`;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
}

function whatsappUrl(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || WHATSAPP_NUMBER.includes("X")) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function makeWhatsAppLink(message, className = "button button-whatsapp") {
  const link = document.createElement("a");
  const url = whatsappUrl(message);
  link.className = className;
  link.href = url || "#contact";
  link.innerHTML = 'Enquire on WhatsApp <span aria-hidden="true">↗</span>';
  if (url) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("WhatsApp is not configured yet. Replace WHATSAPP_NUMBER in script.js with the dealership's verified number.");
    });
  }
  return link;
}

function createVehicleCard(vehicle, index) {
  const article = document.createElement("article");
  article.className = "vehicle-card";
  article.style.animationDelay = `${Math.min(index, 5) * 45}ms`;
  const photoWrap = document.createElement("div");
  photoWrap.className = "vehicle-photo-wrap";
  const image = document.createElement("img");
  image.className = "vehicle-photo";
  image.src = vehicle.image;
  image.alt = `${vehicle.year} ${vehicle.make} ${vehicle.model}, sample vehicle photograph`;
  image.loading = "lazy";
  image.decoding = "async";
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.classList.add("image-unavailable");
    image.alt = "";
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = `${vehicle.make} ${vehicle.model} photo unavailable`;
    photoWrap.append(fallback);
  }, { once: true });
  const sampleLabel = document.createElement("span");
  sampleLabel.className = "photo-label";
  sampleLabel.textContent = "SAMPLE VEHICLE";
  const credit = document.createElement("a");
  credit.className = "photo-credit";
  credit.href = vehicle.photoSource;
  credit.target = "_blank";
  credit.rel = "noopener noreferrer";
  credit.textContent = "Photo source ↗";
  photoWrap.append(image, sampleLabel, credit);
  const content = document.createElement("div");
  content.className = "vehicle-card-content";
  content.innerHTML = `<p class="vehicle-year">${vehicle.year} · ${vehicle.type.toUpperCase()}</p><div class="vehicle-title-row"><h3>${vehicle.make} ${vehicle.model}</h3><p class="vehicle-price">${formatPrice(vehicle.price)}</p></div><p class="price-caption">Illustrative sample price · confirm with dealership</p><div class="vehicle-specs"><span><i class="spec-dot"></i>${vehicle.transmission}</span><span><i class="spec-dot"></i>${vehicle.fuel}</span></div>`;
  const actions = document.createElement("div");
  actions.className = "vehicle-actions";
  const detailsButton = document.createElement("button");
  detailsButton.className = "button button-light";
  detailsButton.type = "button";
  detailsButton.textContent = "View details";
  detailsButton.addEventListener("click", () => openVehicleDetails(vehicle));
  actions.append(detailsButton, makeWhatsAppLink(vehicleMessage(vehicle)));
  content.append(actions);
  article.append(photoWrap, content);
  return article;
}

function renderVehicles() {
  const search = searchInput.value.trim().toLowerCase();
  const maxPrice = Number(priceFilter.value) || Infinity;
  const matches = vehicles.filter((vehicle) => `${vehicle.make} ${vehicle.model} ${vehicle.year}`.toLowerCase().includes(search)
    && (!typeFilter.value || vehicle.type === typeFilter.value)
    && vehicle.price <= maxPrice
    && (!transmissionFilter.value || vehicle.transmission === transmissionFilter.value));
  grid.replaceChildren(...matches.map(createVehicleCard));
  resultCount.textContent = String(matches.length).padStart(2, "0");
  emptyState.hidden = matches.length > 0;
}

function openVehicleDetails(vehicle) {
  dialogContent.replaceChildren();
  const imageWrap = document.createElement("div");
  imageWrap.className = "dialog-image-wrap";
  const image = document.createElement("img");
  image.src = vehicle.image;
  image.alt = `${vehicle.year} ${vehicle.make} ${vehicle.model}, sample vehicle photograph`;
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    image.classList.add("image-unavailable");
    image.alt = "";
    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = `${vehicle.make} ${vehicle.model} photo unavailable`;
    imageWrap.append(fallback);
  }, { once: true });
  imageWrap.append(image);
  const body = document.createElement("div");
  body.className = "dialog-body";
  body.innerHTML = `<p class="vehicle-year">${vehicle.year} · SAMPLE ${vehicle.type.toUpperCase()}</p><h2 id="dialog-title">${vehicle.make} ${vehicle.model}</h2><p class="dialog-price">${formatPrice(vehicle.price)}</p><p class="dialog-caption">Illustrative sample price only. Confirm price and availability directly with the dealership.</p><div class="dialog-spec-grid"><div class="dialog-spec"><span>Year</span><strong>${vehicle.year}</strong></div><div class="dialog-spec"><span>Vehicle type</span><strong>${vehicle.type}</strong></div><div class="dialog-spec"><span>Transmission</span><strong>${vehicle.transmission}</strong></div><div class="dialog-spec"><span>Fuel</span><strong>${vehicle.fuel}</strong></div></div><p class="dialog-description">${vehicle.description}</p>`;
  const actions = document.createElement("div");
  actions.className = "dialog-actions";
  actions.append(makeWhatsAppLink(vehicleMessage(vehicle)));
  const photoLink = document.createElement("a");
  photoLink.className = "button button-light";
  photoLink.href = vehicle.photoSource;
  photoLink.target = "_blank";
  photoLink.rel = "noopener noreferrer";
  photoLink.textContent = "View photo source ↗";
  actions.append(photoLink);
  body.append(actions);
  dialogContent.append(imageWrap, body);
  dialog.showModal();
  document.body.classList.add("dialog-open");
}

document.querySelector("#vehicle-filters").addEventListener("input", renderVehicles);
document.querySelector("#vehicle-filters").addEventListener("change", renderVehicles);
document.querySelector("#vehicle-filters").addEventListener("reset", () => window.setTimeout(renderVehicles));
document.querySelector("#empty-reset").addEventListener("click", () => document.querySelector("#vehicle-filters").reset());
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));

document.querySelectorAll(".whatsapp-link").forEach((link) => {
  const url = whatsappUrl(link.dataset.message);
  if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; }
  else link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast("WhatsApp is not configured yet. Replace WHATSAPP_NUMBER in script.js with the dealership's verified number.");
  });
});

document.querySelector("#map-link").href = MAP_LINK || "https://www.google.com/maps/search/?api=1&query=Port+Harcourt%2C+Rivers+State%2C+Nigeria";
document.querySelector("#whatsapp-contact-label").textContent = WHATSAPP_NUMBER === "234XXXXXXXXXX" ? "Number to be configured" : WHATSAPP_NUMBER;
document.querySelector("#current-year").textContent = new Date().getFullYear();

const phoneField = document.querySelector("#phone");
phoneField.addEventListener("input", () => {
  const phone = phoneField.value.trim();
  phoneField.setCustomValidity(phone && !/^[+0-9()\s-]{7,20}$/.test(phone)
    ? "Enter a valid phone number using digits, spaces, +, parentheses or hyphens."
    : "");
});

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});
primaryNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}));

document.querySelector("#enquiry-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();
  const message = form.elements.message.value.trim();
  const prepared = `Hello Smug Republik Auto Sales, my name is ${name}. My phone number is ${phone}. ${message}`;
  document.querySelector("#form-status").textContent = `Your enquiry is ready to copy. This demonstration does not send or save it: ${prepared}`;
  showToast("Your enquiry is ready. This demo has not sent or stored your information.");
});

renderVehicles();