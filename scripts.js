// Import variables from data.js
import { BOOKS_PER_PAGE, authors, genres, books } from './data.js';

// Retrieve elements from the DOM using query Selectors
const settingsButton = document.querySelector('[data-header-settings]');
const settingsOverlay = document.querySelector('[data-settings-overlay]');
const settingsForm = document.querySelector('[data-settings-form]');
const settingsTheme = document.querySelector('[data-settings-theme]');
const settingsCancel = document.querySelector('[data-settings-cancel]');

// Event listener to open settings overlay
settingsButton.addEventListener('click', () => {
  settingsOverlay.showModal();
});

// Event listener to close settings overlay
settingsCancel.addEventListener('click', () => {
  settingsOverlay.close();
});

// Define CSS themes
const themes = {
  day: ['255, 255, 255', '10, 10, 20'],
  night: ['10, 10, 20', '255, 255, 255'],
};

// Set the theme based on the user's preferred color scheme
settingsTheme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

// Event listener for settings form submission
settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const selectedTheme = formData.get('theme');

  // Update CSS variables based on the selected theme
  document.documentElement.style.setProperty('--color-light', themes[selectedTheme][0]);
  document.documentElement.style.setProperty('--color-dark', themes[selectedTheme][1]);

  settingsOverlay.close();
});

// Create a document fragment to improve performance when adding multiple elements to the DOM
const fragment = document.createDocumentFragment();

// Display a subset of books
let startIndex = 0;
let endIndex = 36;
const displayedBooks = books.slice(startIndex, endIndex);

// Iterate through displayed books and create previews
for (const book of displayedBooks) {
  const preview = document.createElement('dl');
  preview.className = 'preview';

  preview.dataset.id = book.id;
  preview.dataset.title = book.title;
  preview.dataset.image = book.image;
  preview.dataset.subtitle = `${authors[book.author]} (${(new Date(book.published)).getFullYear()})`;
  preview.dataset.description = book.description;
  preview.dataset.genre = book.genres;

  preview.innerHTML = `
    <div>
      <image class='preview__image' src="${book.image}" alt="book pic"/>
    </div>
    <div class='preview__info'>
      <dt class='preview__title'>${book.title}</dt>
      <dt class='preview__author'>By ${authors[book.author]}</dt>
    </div>
  `;

  fragment.appendChild(preview);
}

// Append the previews to the book list
const bookList = document.querySelector('[data-list-items]');
bookList.appendChild(fragment);

// Event listener to open the search overlay
const searchButton = document.querySelector("[data-header-search]");
searchButton.addEventListener('click', () => {
  document.querySelector("[data-search-overlay]").style.display = "block";
});

// Event listener to close the search overlay
const searchCancel = document.querySelector("[data-search-cancel]");
searchCancel.addEventListener('click', () => {
  document.querySelector("[data-search-overlay]").style.display = "none";
});

// Event listener to open the settings overlay
const settingButton = document.querySelector("[data-header-settings]");
settingButton.addEventListener('click', () => {
  document.querySelector("[data-settings-overlay]").style.display = "block";
});

// Event listener to close the settings overlay
const settingCancel = document.querySelector('[data-settings-cancel]');
settingCancel.addEventListener('click', () => {
  document.querySelector("[data-settings-overlay]").style.display = "none";
});

// Select elements for filtering books by author and genre
const authorSelect = document.querySelector("[data-search-authors]");
const genreSelect = document.querySelector("[data-search-genres]");

// Populate author and genre dropdowns
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

// Event handler for displaying book details
const detailsToggle = (event) => {
  const target = event.target;
  if (target && target.dataset) {
    const overlay = document.querySelector('[data-list-active]');
    const title = document.querySelector('[data-list-title]');
    const subtitle = document.querySelector('[data-list-subtitle]');
    const description = document.querySelector('[data-list-description]');
    const image = document.querySelector('[data-list-image]');
    const imageBlur = document.querySelector('[data-list-blur]');

    if (target.dataset.id) overlay.style.display = 'block';
    if (target.dataset.title) title.innerHTML = target.dataset.title;
    if (target.dataset.subtitle) subtitle.innerHTML = target.dataset.subtitle;
    if (target.dataset.description) description.innerHTML = target.dataset.description;
    if (target.dataset.image) image.setAttribute('src', target.dataset.image);
    if (target.dataset.imageblur) imageBlur.setAttribute('src', target.dataset.image);
  }
};

// Event listener to close details overlay
const detailsClose = document.querySelector('[data-list-close]');
detailsClose.addEventListener('click', () => {
  document.querySelector("[data-list-active]").style.display = "none";
});

// Event listener to handle preview clicks
const bookClick = document.querySelector('[data-list-items]');
bookClick.addEventListener('click', detailsToggle);

// Show more books
const showMoreButton = document.querySelector('[data-list-button]');
let currentPage = 1;

showMoreButton.addEventListener('click', () => {
  currentPage++;
  const startIdx = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIdx = Math.min(currentPage * BOOKS_PER_PAGE, books.length);
  const moreBooks = books.slice(startIdx, endIdx);

  // Create and append previews for the new batch of books
  for (const book of moreBooks) {
    const preview = document.createElement('dl');
    preview.className = 'preview';

    preview.dataset.id = book.id;
    preview.dataset.title = book.title;
    preview.dataset.image = book.image;
    preview.dataset.subtitle = `${authors[book.author]} (${(new Date(book.published)).getFullYear()})`;
    preview.dataset.description = book.description;
    preview.dataset.genre = book.genres;

    preview.innerHTML = `
      <div>
        <image class='preview__image' src="${book.image}" alt="book pic"/>
      </div>
      <div class='preview__info'>
        <dt class='preview__title'>${book.title}</dt>
        <dt class='preview__author'>By ${authors[book.author]}</dt>
      </div>
    `;

    fragment.appendChild(preview);
  }

  // Append the new previews to the book list
  bookList.innerHTML = ''; // Clear existing list
  bookList.appendChild(fragment);
});

// Filtering books by author and genre
let selectedAuthor = '';
let selectedGenre = '';

function displayBooks() {
  // Implement book filtering logic here based on selectedAuthor and selectedGenre
}

// Set the default "any" option for the genre and author dropdowns
authorSelect.value = 'any';
genreSelect.value = 'any';

// Update the search button to clear filters and display all books
searchButton.addEventListener('click', () => {
  document.querySelector("[data-search-overlay]").style.display = "block";
  selectedAuthor = '';
  selectedGenre = '';
  authorSelect.value = 'any';
  genreSelect.value = 'any';
  displayBooks();
});

// Update the author and genre dropdowns to trigger filtering
authorSelect.addEventListener('change', () => {
  selectedAuthor = authorSelect.value;
  displayBooks();
});

// Update the author and genre dropdowns to trigger filtering
authorSelect.addEventListener('change', () => {
  selectedAuthor = authorSelect.value;
  displayBooks();
});

genreSelect.addEventListener('change', () => {
  selectedGenre = genreSelect.value;
  displayBooks();
});

// Handle preview click
const Module = {
  listActive: document.querySelector('[data-list-active]'),
  listTitle: document.querySelector('[data-list-title]'),
  listSubtitle: document.querySelector('[data-list-subtitle]'),
  listDescription: document.querySelector('[data-list-description]'),
  listImage: document.querySelector('[data-list-image]'),
  listBlur: document.querySelector('[data-list-blur]'),
};

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
  const pathArray = Array.from(event.path || event.composedPath());

  let active;
  for (const node of pathArray) {
    if (active) break;
    const previewId = node.dataset?.id;

    for (const singleBook of books) {
      if (singleBook.id === previewId) {
        active = singleBook;
        break;
      }
    }
  }

  if (!active) return;

  Module.listActive.style.display = 'block';
  Module.listImage.setAttribute('src', active.image);
  Module.listTitle.innerHTML = active.title;
  Module.listSubtitle.innerHTML = `${authors[active.author]} (${(new Date(active.published)).getFullYear()})`;
  Module.listDescription.innerHTML = active.description;
  Module.listBlur.setAttribute('src', active.image);
});

// ... (continuation of the code, if any)

// End of the code