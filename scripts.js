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
  searchGenres: '[data-search-genres]',
  searchAuthors: '[data-search-authors]',
  searchInput: '[data-search-input]',
  listActive: '[data-list-active]',
  listTitle: '[data-list-title]',
  listSubtitle: '[data-list-subtitle]',
  listDescription: '[data-list-description]',
  listImage: '[data-list-image]',
  listBlur: '[data-list-blur]',
  listClose: '[data-list-close]',
  listButton: '[data-list-button]'
};

const CLASSES = {
  preview: 'preview',
  bookList: 'book-list',
  // Add your other class names here
};

// Retrieve elements from the DOM using query selectors
const elements = {};
for (const key in SELECTORS) {
  elements[key] = document.querySelector(SELECTORS[key]);
}

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
elements.searchOverlay.querySelector("[data-search-cancel]").addEventListener('click', () => {
  elements.searchOverlay.style.display = 'none';
});

// Event listener to open the settings overlay
elements.settingsButton.addEventListener('click', () => {
  elements.settingsOverlay.style.display = 'block';
});

// Event listener to close the settings overlay
elements.settingsCancel.addEventListener('click', () => {
  elements.settingsOverlay.style.display = 'none';
});

// Populate author and genre dropdowns
// Add the "any" option as the first option
elements.searchAuthors.appendChild(createOptionElement('any', 'Any Author'));
elements.searchGenres.appendChild(createOptionElement('any', 'Any Genre'));

for (const [authorId, authorName] of Object.entries(authors)) {
  elements.searchAuthors.appendChild(createOptionElement(authorId, authorName));
}

for (const [genreId, genreName] of Object.entries(genres)) {
  elements.searchGenres.appendChild(createOptionElement(genreId, genreName));
}

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
elements.bookPreviews.appendChild(fragment);

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
  const {
    listActive,
    listTitle,
    listSubtitle,
    listDescription,
    listImage,
    listBlur
  } = elements;

  if (book.id) listActive.style.display = 'block';
  if (book.title) listTitle.innerHTML = book.title;
  if (book.subtitle) listSubtitle.innerHTML = book.subtitle;
  if (book.description) listDescription.innerHTML = book.description;
  if (book.image) listImage.setAttribute('src', book.image);
  if (book.imageblur) listBlur.setAttribute('src', book.image);
}

// Event listener to close details overlay
elements.listClose.addEventListener('click', () => {
  elements.listActive.style.display = 'none';
});

// Show more books
let currentPage = 1; // Initialize currentPage
const showMoreButton = elements.listButton;
showMoreButton.textContent = 'Show More'; // Add text to the button

showMoreButton.addEventListener('click', () => {
  currentPage++;
  const startIdx = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIdx = Math.min(currentPage * BOOKS_PER_PAGE, books.length);
  const moreBooks = books.slice(startIdx, endIdx);

  // Create and append previews for the new batch of books
  for (const book of moreBooks) {
    createBookPreview(book);
  }

  // Append the new previews to the book list
  elements.bookPreviews.innerHTML = ''; // Clear existing list
  elements.bookPreviews.appendChild(fragment);
});

// Filtering books by author and genre
let selectedAuthor = 'any'; // Set the default to 'any'
let selectedGenre = 'any'; // Set the default to 'any'

// Function to display books based on filters
function displayBooks() {
  // Filter books based on selected author and genre
  const filteredBooks = books.filter((book) => {
    const authorMatch = selectedAuthor === 'any' || book.author === selectedAuthor;
    const genreMatch = selectedGenre === 'any' || book.genres.includes(selectedGenre);
    return authorMatch && genreMatch;
  });

  // Display a subset of the filtered books
  startIndex = 0;
  endIndex = BOOKS_PER_PAGE;
  const displayedBooks = filteredBooks.slice(startIndex, endIndex);

  // Clear the current book list
  elements.bookPreviews.innerHTML = '';

  // Iterate through displayed books and create previews
  for (const book of displayedBooks) {
    createBookPreview(book);
  }

  // Append the previews to the book list
  elements.bookPreviews.appendChild(fragment);
}

// Event listener to update displayed books when author or genre changes
elements.searchAuthors.addEventListener('change', () => {
  selectedAuthor = elements.searchAuthors.value;
  displayBooks();
});

elements.searchGenres.addEventListener('change', () => {
  selectedGenre = elements.searchGenres.value;
  displayBooks();
});

// Update the search criteria and trigger book display
elements.searchInput.addEventListener('input', () => {
  displayBooks();
});
