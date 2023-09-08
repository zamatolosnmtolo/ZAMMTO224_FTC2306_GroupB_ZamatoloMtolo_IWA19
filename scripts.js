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
};

const CLASSES = {
  preview: 'preview',
  bookList: 'book-list',
};

const themes = {
  day: ['255, 255, 255', '10, 10, 20'],
  night: ['10, 10, 20', '255, 255, 255'],
};

const settingsButton = document.querySelector(SELECTORS.settingsButton);
const settingsOverlay = document.querySelector(SELECTORS.settingsOverlay);
const settingsForm = document.querySelector(SELECTORS.settingsForm);
const settingsTheme = document.querySelector(SELECTORS.settingsTheme);
const settingsCancel = document.querySelector(SELECTORS.settingsCancel);
const searchButton = document.querySelector(SELECTORS.searchButton);
const searchOverlay = document.querySelector(SELECTORS.searchOverlay);
const bookPreviews = document.querySelector(SELECTORS.bookPreviews);

let startIndex = 0;
let endIndex = 36;
const displayedBooks = books.slice(startIndex, endIndex);

const fragment = document.createDocumentFragment();

function createOptionElement(value, text) {
  const optionElement = document.createElement('option');
  optionElement.value = value;
  optionElement.textContent = text;
  return optionElement;
}

settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const selectedTheme = formData.get('theme');
  document.documentElement.style.setProperty('--color-light', themes[selectedTheme][0]);
  document.documentElement.style.setProperty('--color-dark', themes[selectedTheme][1]);
  settingsOverlay.style.display = 'none';
});

searchButton.addEventListener('click', () => {
  searchOverlay.style.display = 'block';
});

const searchCancel = document.querySelector("[data-search-cancel]");
searchCancel.addEventListener('click', () => {
  searchOverlay.style.display = 'none';
});

const settingButton = document.querySelector("[data-header-settings]");
settingButton.addEventListener('click', () => {
  settingsOverlay.style.display = 'block';
});

const genreSelect = document.querySelector('[data-search-genres]');
const authorSelect = document.querySelector('[data-search-authors]');

const settingCancel = document.querySelector('[data-settings-cancel]');
settingCancel.addEventListener('click', () => {
  settingsOverlay.style.display = 'none';
});

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

for (const book of displayedBooks) {
  createBookPreview(book);
}

const bookList = document.querySelector('[data-list-items]');
bookList.appendChild(fragment);

bookPreviews.addEventListener('click', (event) => {
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

function displayBookPreview(book) {
  const overlay = document.querySelector('[data-list-active]');
  const title = document.querySelector('[data-list-title]');
  const subtitle = document.querySelector('[data-list-subtitle]');
  const description = document.querySelector('[data-list-description]');
  const image = document.querySelector('[data-list-image]');

  if (book.id) overlay.style.display = 'block';
  if (book.title) title.innerHTML = book.title;
  if (book.subtitle) subtitle.innerHTML = book.subtitle;
  if (book.description) description.innerHTML = book.description;
  if (book.image) image.setAttribute('src', book.image);
}

const detailsClose = document.querySelector('[data-list-close]');
detailsClose.addEventListener('click', () => {
  document.querySelector("[data-list-active]").style.display = "none";
});

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

let selectedAuthor = 'any';
let selectedGenre = 'any';

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

authorSelect.addEventListener('change', () => {
  selectedAuthor = authorSelect.value;
  displayBooks();
});

genreSelect.addEventListener('change', () => {
  selectedGenre = genreSelect.value;
  displayBooks();
});

const searchInput = document.querySelector("[data-search-input]");
searchInput.addEventListener('input', () => {
  displayBooks();
});

const Module = {
  listActive: document.querySelector('[data-list-active]'),
  listTitle: document.querySelector('[data-list-title]'),
  listSubtitle: document.querySelector('[data-list-subtitle]'),
  listDescription: document.querySelector('[data-list-description]'),
  listImage: document.querySelector('[data-list-image]'),
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
});