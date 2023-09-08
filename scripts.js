// Import necessary variables from 'data.js'
import { BOOKS_PER_PAGE, authors, genres, books } from './data.js';

// Define constants for DOM elements
const elements = {
  settingsButton: document.querySelector('[data-header-settings]'),
  settingsOverlay: document.querySelector('[data-settings-overlay]'),
  settingsForm: document.querySelector('[data-settings-form]'),
  settingsTheme: document.querySelector('[data-settings-theme]'),
  settingsCancel: document.querySelector('[data-settings-cancel]'),
  bookList: document.querySelector('[data-list-items]'),
  searchButton: document.querySelector('[data-header-search]'),
  searchOverlay: document.querySelector('[data-search-overlay]'),
  searchCancel: document.querySelector('[data-search-cancel]'),
};

// Define CSS color themes
const css = {
  day: ['255, 255, 255', '10, 10, 20'],
  night: ['10, 10, 20', '255, 255, 255'],
};

// Function to set the theme based on user's preference
const setTheme = () => {
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'night'
    : 'day';
  elements.settingsTheme.value = preferredTheme;
};

// Function to update CSS variables based on selected theme
const updateCSSVariables = (theme) => {
  document.documentElement.style.setProperty('--color-light', css[theme][0]);
  document.documentElement.style.setProperty('--color-dark', css[theme][1]);
};

// Event listener for settings form submission
const handleSettingsFormSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const selected = Object.fromEntries(formData);
  updateCSSVariables(selected.theme);
  elements.settingsOverlay.close();
};

// Function to create an option element for a select input
const createOptionElement = (value, text) => {
  const optionElement = document.createElement('option');
  optionElement.value = value;
  optionElement.textContent = text;
  return optionElement;
};

// Function to render a list of books within a specified range
const renderBooks = (startIndex, endIndex) => {
  const fragment = document.createDocumentFragment();
  const extracted = books.slice(startIndex, endIndex);

  extracted.forEach(({ author, image, title, id, description, published }) => {
    const preview = document.createElement('dl');
    preview.className = 'preview';
    preview.dataset.id = id;
    preview.dataset.title = title;
    preview.dataset.image = image;
    preview.dataset.subtitle = `${authors[author]} (${new Date(published).getFullYear()})`;
    preview.dataset.description = description;

    preview.innerHTML = `
      <div>
        <image class='preview__image' src="${image}" alt="book pic"}/>
      </div>
      <div class='preview__info'>
        <dt class='preview__title'>${title}<dt>
        <dt class='preview__author'> By ${authors[author]}</dt>
      </div>
    `;

    fragment.appendChild(preview);
  });

  elements.bookList.appendChild(fragment);
};

// Function to load more books
const showMore = () => {
  // Increase the start and end indices to load more books
  const startIndex = elements.bookList.children.length;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  renderBooks(startIndex, endIndex);
};

// Add event listeners
elements.settingsButton.addEventListener('click', () => {
  elements.settingsOverlay.showModal();
});
elements.settingsCancel.addEventListener('click', () => {
  elements.settingsOverlay.close();
});
elements.settingsForm.addEventListener('submit', handleSettingsFormSubmit);
elements.searchButton.addEventListener('click', () => {
  elements.searchOverlay.style.display = 'block';
});
elements.searchCancel.addEventListener('click', () => {
  elements.searchOverlay.style.display = 'none';
});
elements.bookList.addEventListener('click', (event) => {
  // Handle book preview click here
});

// Initial setup
setTheme();
renderBooks(0, BOOKS_PER_PAGE);

// Show more books when the "Show More" button is clicked
const showMoreButton = document.querySelector('[data-list-button]');
showMoreButton.addEventListener('click', showMore);

// Handle book preview click here

// Close book details overlay
const detailsClose = document.querySelector('[data-list-close]');
detailsClose.addEventListener('click', () => {
  document.querySelector("[data-list-active]").style.display = "none";
});
