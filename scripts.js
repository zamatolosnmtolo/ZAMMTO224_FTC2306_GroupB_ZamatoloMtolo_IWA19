import {
  BOOKS_PER_PAGE,
  authors,
  genres,
  books
} from './data.js';

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
  searchCancel: '[data-search-cancel]',
};

const CLASSES = {
  preview: 'preview',
  bookList: 'book-list',
};

const themes = {
  day: ['255, 255, 255', '10, 10, 20'],
  night: ['10, 10, 20', '255, 255, 255'],
};

// Utility function to set CSS variables for theme
function setTheme(theme) {
  document.documentElement.style.setProperty('--color-light', themes[theme][0]);
  document.documentElement.style.setProperty('--color-dark', themes[theme][1]);
}

// Event listener for settings form submission
document.querySelector(SELECTORS.settingsForm).addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const selectedTheme = formData.get('theme');
  setTheme(selectedTheme);
  document.querySelector(SELECTORS.settingsOverlay).style.display = 'none';
});

// Event listeners for opening and closing overlays
document.querySelector(SELECTORS.searchButton).addEventListener('click', () => {
  document.querySelector(SELECTORS.searchOverlay).style.display = 'block';
});

document.querySelector(SELECTORS.searchCancel).addEventListener('click', () => {
  document.querySelector(SELECTORS.searchOverlay).style.display = 'none';
});

document.querySelector(SELECTORS.settingsButton).addEventListener('click', () => {
  document.querySelector(SELECTORS.settingsOverlay).style.display = 'block';
});

document.querySelector(SELECTORS.settingsCancel).addEventListener('click', () => {
  document.querySelector(SELECTORS.settingsOverlay).style.display = 'none';
});

// Populate author and genre dropdowns
const genreSelect = document.querySelector('[data-search-genres]');
const authorSelect = document.querySelector('[data-search-authors]');

// Function to create option elements for dropdowns
function createOptionElement(value, text) {
  const optionElement = document.createElement('option');
  optionElement.value = value;
  optionElement.textContent = text;
  return optionElement;
}

// Add "Any Author" and "Any Genre" options
authorSelect.appendChild(createOptionElement('any', 'Any Author'));
genreSelect.appendChild(createOptionElement('any', 'Any Genre'));

// Add author options
for (const [authorId, authorName] of Object.entries(authors)) {
  authorSelect.appendChild(createOptionElement(authorId, authorName));
}

// Add genre options
for (const [genreId, genreName] of Object.entries(genres)) {
  genreSelect.appendChild(createOptionElement(genreId, genreName));
}

// Function to create a book preview element
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

  return preview;
}

// Function to display a subset of books
function displayBooks(startIndex, endIndex) {
  const bookList = document.querySelector(SELECTORS.bookPreviews);
  bookList.innerHTML = '';

  const fragment = document.createDocumentFragment();

  for (let i = startIndex; i < endIndex; i++) {
    const book = books[i];
    const preview = createBookPreview(book); // Create the book preview element
    fragment.appendChild(preview);
  }

  bookList.appendChild(fragment);
}

// Initial display of books
displayBooks(0, BOOKS_PER_PAGE);

// Event listener to handle preview clicks and display book preview
document.querySelector(SELECTORS.bookPreviews).addEventListener('click', (event) => {
  const target = event.target.closest(`.${CLASSES.preview}`);
  if (target) {
    const bookPreview = {
      id: target.dataset.id,
      title: target.dataset.title,
      image: target.dataset.image,
      subtitle: target.dataset.subtitle,
      description: target.dataset.description,
    };
    displayBookPreview(bookPreview);
  }
});

// Function to display the book preview
function displayBookPreview(book) {
  const overlay = document.querySelector('[data-list-active]');
  const title = document.querySelector('[data-list-title]');
  const subtitle = document.querySelector('[data-list-subtitle]');
  const description = document.querySelector('[data-list-description]');
  const image = document.querySelector('[data-list-image]');
  const imageBlur = document.querySelector('[data-list-blur]');

  overlay.style.display = 'block';
  title.innerHTML = book.title || '';
  subtitle.innerHTML = book.subtitle || '';
  description.innerHTML = book.description || '';
  image.setAttribute('src', book.image || '');
  imageBlur.setAttribute('src', book.image || '');
}

// Event listener to close details overlay
document.querySelector('[data-list-close]').addEventListener('click', () => {
  document.querySelector('[data-list-active]').style.display = 'none';
});

// Show more books
let currentPage = 1;

document.querySelector('[data-list-button]').addEventListener('click', () => {
  currentPage++;
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = Math.min(currentPage * BOOKS_PER_PAGE, books.length);
  displayBooks(startIndex, endIndex);
});

// Filtering books by author and genre
let selectedAuthor = 'any';
let selectedGenre = 'any';

// Event listeners to update displayed books when author or genre changes
authorSelect.addEventListener('change', () => {
  selectedAuthor = authorSelect.value;
  displayBooks(0, BOOKS_PER_PAGE);
});

genreSelect.addEventListener('change', () => {
  selectedGenre = genreSelect.value;
  displayBooks(0, BOOKS_PER_PAGE);
});

// Update the search criteria and trigger book display
const searchInput = document.querySelector("[data-search-input]");
searchInput.addEventListener('input', () => {
  displayBooks(0, BOOKS_PER_PAGE);
});

// Initialize the theme based on user preference
const settingsTheme = document.querySelector(SELECTORS.settingsTheme);
settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
setTheme(settingsTheme.value);
