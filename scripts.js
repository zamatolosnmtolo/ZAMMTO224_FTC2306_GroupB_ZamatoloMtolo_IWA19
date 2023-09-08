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

// Handle preview click function
const handlePreviewClick = (event) => {
  const target = event.target.closest('.preview');
  if (!target) return; // Clicked outside of a book preview

  const overlay1 = document.querySelector('[data-list-active]');
  const title = document.querySelector('[data-list-title]');
  const subtitle = document.querySelector('[data-list-subtitle]');
  const description = document.querySelector('[data-list-description]');
  const image1 = document.querySelector('[data-list-image]');
  const imageblur = document.querySelector('[data-list-blur]');

  const id = target.dataset.id;
  const book = books.find((book) => book.id === id);

  if (book) {
    overlay1.style.display = "block";
    description.innerHTML = book.description;
    subtitle.innerHTML = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
    title.innerHTML = book.title;
    image1.setAttribute('src', book.image);
    imageblur.setAttribute('src', book.image);
  }
};

// Add event listener to the book list for preview clicks
elements.bookList.addEventListener('click', handlePreviewClick);

// Function to display book summaries
const displayBookSummary = (book) => {
    const summaryModal = document.createElement('div');
    summaryModal.className = 'summary-modal';
    summaryModal.innerHTML = `
      <h2>${book.title}</h2>
      <p>${book.description}</p>
      <button class="close-summary-button">Close</button>
    `;
  
    // Add a close event listener to the summary modal
    const closeSummaryButton = summaryModal.querySelector('.close-summary-button');
    closeSummaryButton.addEventListener('click', () => {
      summaryModal.remove();
    });
  
    document.body.appendChild(summaryModal);
  };

  
// Initial setup
setTheme();
renderBooks(0, BOOKS_PER_PAGE);
handleSearch(); 

// Show more books when the "Show More" button is clicked
const showMoreButton = document.querySelector('[data-list-button]');
showMoreButton.addEventListener('click', () => {
  // Implement showMore function to load more books if needed
  // Example: renderBooks(currentEndIndex, currentEndIndex + BOOKS_PER_PAGE);
});

// Close book details overlay
const detailsClose = document.querySelector('[data-list-close]');
detailsClose.addEventListener('click', () => {
  document.querySelector("[data-list-active]").style.display = "none";
});

// Add event listeners for author and genre select inputs and search input
elements.authorSelect.addEventListener('change', filterAndRenderBooks);
elements.genreSelect.addEventListener('change', filterAndRenderBooks);
elements.searchInput.addEventListener('input', filterAndRenderBooks);