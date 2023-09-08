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