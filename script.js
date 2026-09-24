const menuItems = [
  {
    name: 'The "Signature Loaf"',
    price: 12.99,
    description: "Our signature wheat bread loaf, gluten free.",
    diets: ["gluten-free", "dairy-free", "vegetarian", "nut-free"]
  },
  {
    name: '"The Scone"',
    price: 4.99,
    description: "A deep fried scone, served with honey mustard and ketchup, known for its soft texture.",
    diets: ["vegetarian", "nut-free"]
  },
  {
    name: '"The Slice"',
    price: 5.99, 
    description: "A slice of our famous Pepperoni Pizza. Dip it in hot sauce or enjoy it as-is.",
    diets: ["nut-free"]
  },
  {
    name: "Blueberry Muffin",
    price: 8.20,
    description: "A no-frills blueberry muffin, now with crispy edges!",
    diets: ["vegetarian", "nut-free"]
  },
  {
    name: "Apple Smoothie",
    price: 7.50,
    description: "We let no apple go to waste! The apple peels from our apple fritter, blended into a delicious smoothie!",
    diets: ["gluten-free", "dairy-free", "vegan", "vegetarian", "nut-free", "keto"]
  },
  {
    name: "Keto Friendly Brownies",
    price: 5.99,
    description: "Fudgy brownies with no sugar and flour, so you can indulge and stay on track!",
    diets: ["keto", "gluten-free", "vegetarian", "nut-free"]
  },
  {
    name: "The Green Machine", 
    price: 7.75, 
    description: "A blend of kale, spinach, apple, and banana for a morning boost.",  
    diets: ["gluten-free", "dairy-free", "vegan", "vegetarian", "nut-free"]
  }
];

const dietOptions = [
  { id: "gluten-free", label: "Gluten Free" },
  { id: "dairy-free", label: "Dairy Free" },
  { id: "keto", label: "Keto" },
  { id: "vegan", label: "Vegan" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "nut-free", label: "Nut Free" }
];

const navLinks = [
  { href: "index.html", label: "Home" },
  { href: "products.html", label: "Our Selection" },
  { href: "about.html", label: "About Us" },
  { href: "contact.html", label: "Contact Us" }
];

function getCurrentPage() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf("/") + 1);
  return file === "" ? "index.html" : file;
}

function renderHeader() {
  const header = document.getElementById("site-header");
  const currentPage = getCurrentPage();

  const logo = document.createElement("img");
  logo.src = "images/bakery-storefront_c.png";
  logo.alt = "The North Star Bakery storefront";

  const nav = document.createElement("nav");
  const list = document.createElement("ul");

  for (let index = 0; index < navLinks.length; index++) {
    const link = navLinks[index];

    const item = document.createElement("li");

    const anchor = document.createElement("a");


    anchor.href = link.href;
    anchor.textContent = link.label;

    if (link.href === currentPage) {
      anchor.setAttribute("aria-current", "page");
    }
    item.appendChild(anchor);
    list.appendChild(item);
  }

  nav.appendChild(list);

  header.appendChild(logo);
  header.appendChild(nav);
}

function loadPreferences() {
  const stored = localStorage.getItem("north-star-bakery-dietary-options");
  if (stored === null) {
    return [];
  }
  return JSON.parse(stored);
}

function savePreferences(preferences) {
  localStorage.setItem("north-star-bakery-dietary-options", JSON.stringify(preferences));
}

function itemMatchesAll(item, preferences) {
  for (let index = 0; index < preferences.length; index++) {
    if (!item.diets.includes(preferences[index])) {
      return false;
    }
  }
  return true;
}

function getMatchingItems(preferences) {
  if (preferences.length === 0) {
    return menuItems;
  }
  const matches = [];
  for (let index = 0; index < menuItems.length; index++) {
    if (itemMatchesAll(menuItems[index], preferences)) {
      matches.push(menuItems[index]);
    }
  }
  return matches;
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function renderMenu(preferences) {
  const menuList = document.getElementById("menu-list");
  const matches = getMatchingItems(preferences);
  menuList.innerHTML = "";

  if (matches.length == 0) {
    const empty = document.createElement("p");
    empty.textContent = "No menu items match every selected preference. Try removing a filter.";
    menuList.appendChild(empty);
    return;
  }

  for (let index = 0; index < matches.length; index++) {
    const item = matches[index];
    const article = document.createElement("article");

    const heading = document.createElement("h3");
    heading.textContent = `${item.name} - ${formatPrice(item.price)}`;

    const description = document.createElement("p");
    description.textContent = item.description;

    article.appendChild(heading);
    article.appendChild(description);
    menuList.appendChild(article);
  }
}

function updateStatus(preferences) {
  const status = document.getElementById("filter-status");
  const matches = getMatchingItems(preferences);
  if (preferences.length == 0) {
    status.textContent = `Showing all ${matches.length} items.`;
  } else {
    status.textContent = `Showing ${matches.length} of ${menuItems.length} items.`;
  }
}

function togglePreference(diet, preferences) {
  const index = preferences.indexOf(diet);
  if (index === -1) {
    preferences.push(diet);
  } else {
    //if something is already in the array, splice will remove it
    preferences.splice(index, 1);
  }
  return preferences;
}

function renderFilterButtons(preferences) {
  const container = document.getElementById("filter-buttons");
  container.innerHTML = "";

  for (let index = 0; index < dietOptions.length; index++) {
    const option = dietOptions[index];
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.label;
    button.className = "filter-button";
    button.setAttribute("aria-pressed", preferences.includes(option.id));
    if (preferences.includes(option.id)) {
      button.classList.add("active");
    }

    button.addEventListener("click", function () {
      const updated = togglePreference(option.id, loadPreferences());
      savePreferences(updated);
      applyPreferences(updated);
    });

    container.appendChild(button);
  }
}

function applyPreferences(preferences) {
  renderFilterButtons(preferences);
  renderMenu(preferences);
  updateStatus(preferences);
}

function initProductsPage() {
  const preferences = loadPreferences();
  applyPreferences(preferences);

  const clearButton = document.getElementById("clear-filters");
  clearButton.addEventListener("click", function () {
    savePreferences([]);
    applyPreferences([]);
  });
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorSlot = document.getElementById(`${fieldId}-error`);
  field.classList.add("invalid");
  errorSlot.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorSlot = document.getElementById(`${fieldId}-error`);
  field.classList.remove("invalid");
  errorSlot.textContent = "";
}

function validateName() {
  const value = document.getElementById("name").value.trim();
  if (value === "") {
    showError("name", "Please enter your name.");
    return false;
  }
  if (value.length < 2) {
    showError("name", "Name must be at least 2 characters.");
    return false;
  }
  clearError("name");
  return true;
}

function validateEmail() {
  const value = document.getElementById("email").value;
  if (!value.includes("@") || !value.includes(".")) {
    showError("email", "Enter a valid email, like email@example.com.");
    return false;
  }
  clearError("email");
  return true;
}

function validatePickupDate() {
  const value = document.getElementById("pickup-date").value;
  if (value === "") {
    showError("pickup-date", "Please choose a pickup date.");
    return false;
  }
  const selected = new Date(value);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  
  
  if (selected < today) {
    showError("pickup-date", "The pickup date cannot be in the past.");
    return false;
  }
  clearError("pickup-date");
  return true;
}

function validateRequestType() {
  const value = document.getElementById("request-type").value;
  if (value === "") {
    showError("request-type", "Please select a request type.");
    return false;
  }
  clearError("request-type");
  return true;
}

function getDietLabel(dietId) {
  for (let index = 0; index < dietOptions.length; index++) {
    if (dietOptions[index].id === dietId) {
      return dietOptions[index].label;
    }
  }
  return dietId;
}

function prefillAllergyNotes() {
  const allergyField = document.getElementById("allergy-notes");
  const preferences = loadPreferences();
  if (preferences.length == 0 || allergyField.value.trim() !== "") {
    return;
  }
  const labels = [];
  for (let index = 0; index < preferences.length; index++) {
    labels.push(getDietLabel(preferences[index]));
  }
  allergyField.value = `Dietary preferences: ${labels.join(", ")}.`;
}

function validateForm() {
  const nameValid = validateName();
  const emailValid = validateEmail();
  const dateValid = validatePickupDate();
  const typeValid = validateRequestType();
  if (nameValid && emailValid && dateValid && typeValid) {
    return true;
  } else {
    return false;
  }
}

function initContactPage() {
  const form = document.getElementById("inquiry-form");
  const success = document.getElementById("form-success");

  prefillAllergyNotes();

  document.getElementById("name").addEventListener("input", validateName);
  document.getElementById("email").addEventListener("input", validateEmail);
  document.getElementById("pickup-date").addEventListener("input", validatePickupDate);
  document.getElementById("request-type").addEventListener("change", validateRequestType);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    success.textContent = "";

    if (validateForm()) {
      success.textContent = "Thank you! Your request has been received.";
      form.reset();
    }
  });
}

renderHeader();

if (document.getElementById("menu-list")) {
  initProductsPage();
}

if (document.getElementById("inquiry-form")) {
  initContactPage();
}
