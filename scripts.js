// Import necessary constants and data
import {
  BOOKS_PER_PAGE,
  authors,
  genres,
  books
} from './data.js';

// Constants for selectors and classes
const SELECTORS = {
  settingsButton: '[data-header-settings]',
  settingsOverlay: '[data-settings-overlay]',
  settingsForm: '[data-settings-form]',
  settingsTheme: '[data-settings-theme]',
  settingsCancel: '[data-settings-cancel]',
  searchButton: '[data-header-search]',
  searchOverlay: '[data-search-overlay]',
  bookPreviews: '[data-list-items]',
  bookSummary: '[data-book-summary]',
};

const CLASSES = {
  preview: 'preview',
  bookList: 'book-list',
};

// Retrieve elements from the DOM using query selectors
const elements = {
  settingsButton: document.querySelector(SELECTORS.settingsButton),
  settingsOverlay: document.querySelector(SELECTORS.settingsOverlay),
  settingsForm: document.querySelector(SELECTORS.settingsForm),
  settingsTheme: document.querySelector(SELECTORS.settingsTheme),
  settingsCancel: document.querySelector(SELECTORS.settingsCancel),
  searchButton: document.querySelector(SELECTORS.searchButton),
  searchOverlay: document.querySelector(SELECTORS.searchOverlay),
  bookPreviews: document.querySelector(SELECTORS.bookPreviews),
  bookSummary: document.querySelector(SELECTORS.bookSummary),
  listActive: document.querySelector('[data-list-active]'),
  listTitle: document.querySelector('[data-list-title]'),
  listSubtitle: document.querySelector('[data-list-subtitle]'),
  listDescription: document.querySelector('[data-list-description]'),
  listImage: document.querySelector('[data-list-image]'),
  listBlur: document.querySelector('[data-list-blur]'), // Element for blurred image
  listClose: document.querySelector('[data-list-close]'),
};

// Define CSS themes
const themes = {
  day: ['255, 255, 255', '10, 10, 20'],
  night: ['10, 10, 20', '255, 255, 255'],
};

// Set the theme based on the user's preferred color scheme
elements.settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

// Event listener for settings form submission
elements.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const selectedTheme = formData.get('theme');

  // Update CSS variables based on the selected theme
  document.documentElement.style.setProperty('--color-light', themes[selectedTheme][0]);
  document.documentElement.style.setProperty('--color-dark', themes[selectedTheme][1]);

  elements.settingsOverlay.style.display = 'none';
});

// Event listener to open the search overlay
elements.searchButton.addEventListener('click', () => {
  elements.searchOverlay.style.display = 'block';
});

// Event listener to close the search overlay
const searchCancel = document.querySelector("[data-search-cancel]");
searchCancel.addEventListener('click', () => {
  elements.searchOverlay.style.display = 'none';
});

// Event listener to open the settings overlay
const settingButton = document.querySelector("[data-header-settings]");
settingButton.addEventListener('click', () => {
  elements.settingsOverlay.style.display = 'block';
});

// Get the select elements by their data attributes
const genreSelect = document.querySelector('[data-search-genres]');
const authorSelect = document.querySelector('[data-search-authors]');

// Event listener to close the settings overlay
const settingCancel = document.querySelector('[data-settings-cancel]');
settingCancel.addEventListener('click', () => {
  elements.settingsOverlay.style.display = 'none';
});

// Populate author and genre dropdowns
// Add the "any" option as the first option
authorSelect.appendChild(createOptionElement('any', 'Any Author'));
genreSelect.appendChild(createOptionElement('any', 'Any Genre'));

Object.entries(authors).forEach(([authorId, authorName]) => {
  const optionElement = createOptionElement(authorId, authorName);
  authorSelect.appendChild(optionElement);
});

Object.entries(genres).forEach(([genreId, genreName]) => {
  const optionElement = createOptionElement(genreId, genreName);
  genreSelect.appendChild(optionElement);
});

// Function to create option elements for dropdowns
function createOptionElement(value, text) {
  const optionElement = document.createElement('option');
  optionElement.value = value;
  optionElement.textContent = text;
  return optionElement;
}

// Display a subset of books
let startIndex = 0;
let endIndex = 36;
const displayedBooks = books.slice(startIndex, endIndex);

// Create a document fragment to improve performance when adding multiple elements to the DOM
const fragment = document.createDocumentFragment();

// Function to create book previews
function createBookPreview(book) {
  const preview = document.createElement('dl');
  preview.className = CLASSES.preview;

  preview.dataset.id = book.id;
  preview.dataset.title = book.title;
  preview.dataset.image = book.image;
  preview.dataset.subtitle = `${authors[book.author]} (${(new Date(book.published)).getFullYear()})`;
  preview.dataset.description = book.description;
  preview.dataset.genre = book.genres;

  preview.innerHTML = `
    <div>
      <img class='preview__image' src="${book.image}" alt="book pic"/>
    </div>
    <div class='preview__info'>
      <dt class='preview__title'>${book.title}</dt>
      <dt class='preview__author'>By ${authors[book.author]}</dt>
    </div>
  `;

  fragment.appendChild(preview);
}

// Iterate through displayed books and create previews
for (const book of displayedBooks) {
  createBookPreview(book);
}

// Append the previews to the book list
const bookList = document.querySelector('[data-list-items]');
bookList.appendChild(fragment);

// Event listener to handle preview clicks and display book preview
elements.bookPreviews.addEventListener('click', (event) => {
  const target = event.target.closest(`.${CLASSES.preview}`);
  if (target) {
    const bookPreview = {
      id: target.dataset.id,
      title: target.dataset.title,
      image: target.dataset.image,
      subtitle: target.dataset.subtitle,
      description: target.dataset.description,
    };

    // Display the book preview
    displayBookPreview(bookPreview);
  }
});

// Function to display the book preview
function displayBookPreview(book) {
  if (book.id) elements.listActive.style.display = 'block';
  if (book.title) elements.listTitle.innerHTML = book.title;
  if (book.subtitle) elements.listSubtitle.innerHTML = book.subtitle;
  if (book.description) elements.listDescription.innerHTML = book.description;
  if (book.image) elements.listImage.setAttribute('src', book.image);
  if (book.image) elements.listBlur.setAttribute('src', book.image); // Set blurred image
}

// Event listener to close details overlay
elements.listClose.addEventListener('click', () => {
  elements.listActive.style.display = 'none';
});

// Show more books
let currentPage = 1;
const showMoreButton = document.querySelector('[data-list-button]');
showMoreButton.textContent = 'Show More';

showMoreButton.addEventListener('click', () => {
  currentPage++;
  const startIdx = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIdx = Math.min(currentPage * BOOKS_PER_PAGE, books.length);
  const moreBooks = books.slice(startIdx, endIdx);

  for (const book of moreBooks) {
    createBookPreview(book);
  }

  bookList.innerHTML = '';
  bookList.appendChild(fragment);
});

// Filtering books by author and genre
let selectedAuthor = 'any';
let selectedGenre = 'any';

// Function to display books based on filters
function displayBooks() {
  const filteredBooks = books.filter((book) => {
    const authorMatch = selectedAuthor === 'any' || book.author === selectedAuthor;
    const genreMatch = selectedGenre === 'any' || book.genres.includes(selectedGenre);
    return authorMatch && genreMatch;
  });

  startIndex = 0;
  endIndex = BOOKS_PER_PAGE;
  const displayedBooks = filteredBooks.slice(startIndex, endIndex);

  bookList.innerHTML = '';

  for (const book of displayedBooks) {
    createBookPreview(book);
  }

  bookList.appendChild(fragment);
}

// Event listener to update displayed books when author or genre changes
authorSelect.addEventListener('change', () => {
  selectedAuthor = authorSelect.value;
  displayBooks();
});

genreSelect.addEventListener('change', () => {
  selectedGenre = genreSelect.value;
  displayBooks();
});

// Update the search criteria and trigger book display
const searchInput = document.querySelector("[data-search-input]");
searchInput.addEventListener('input', () => {
  titleMatch = searchInput.value.trim().toLowerCase();
  displayBooks();
});