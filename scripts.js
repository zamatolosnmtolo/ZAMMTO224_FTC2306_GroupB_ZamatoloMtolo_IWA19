// Import data from an external file (data.js)
import { BOOKS_PER_PAGE, authors, genres, books } from './data.js';

// Retrieve DOM elements
const settingsButton = document.querySelector('[data-header-settings]');
const settingsOverlay = document.querySelector('[data-settings-overlay]');
const settingsForm = document.querySelector('[data-settings-form]');
const settingsTheme = document.querySelector('[data-settings-theme]');
const settingsCancel = document.querySelector('[data-settings-cancel]');
 
// Define day and night themes
const css = {
    day: ['255, 255, 255', '10, 10, 20'],
    night: ['10, 10, 20', '255, 255, 255'],
  };

  // Determine the initial theme based on user's preference
settingsTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';

// Event listener to open settings overlay
settingsButton.addEventListener('click', () => {
    settingsOverlay.showModal();
  });
  
  // Event listener to close settings overlay
  settingsCancel.addEventListener('click', () => {
    settingsOverlay.close();
  });

  // Event listener for the settings form submission
settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedTheme = formData.get('theme');

     // Update CSS variables for selected theme
  if (css[selectedTheme]) {
    document.documentElement.style.setProperty('--color-light', css[selectedTheme][0]);
    document.documentElement.style.setProperty('--color-dark', css[selectedTheme][1]);
  }

   // Close settings overlay
   settingsOverlay.close();
});

// Initialize page number
let page = 1;

// Check for valid book data
if (!books || !Array.isArray(books)) {
    throw new Error('Invalid book data.');
  }

// Create a document fragment to efficiently append elements
const fragment = document.createDocumentFragment();
let start_Index = 0;
let end_Index = BOOKS_PER_PAGE;

// Function to create a book preview element
function createPreview(book) {
    const { id, title, image, author, published, description, summary } = book;
    const authorName = authors[author];
    const year = new Date(published).getFullYear();

    const preview = document.createElement('dl');
  preview.className = 'preview';
  preview.dataset.id = id;
  preview.dataset.title = title;
  preview.dataset.image = image;
  preview.dataset.subtitle = `${authorName} (${year})`;
  preview.dataset.description = description;
  preview.dataset.genre = genres[book.genres];

  
  preview.innerHTML = `
    <div>
      <img class='preview__image' src="${image}" alt="book pic"/>
    </div>
    <div class='preview__info'>
      <dt class='preview__title'>${title}</dt>
      <dt class='preview__author'>By ${authorName}</dt>
    </div>
  `;

  // Create a "Read Summary" button
  const readSummaryButton = document.createElement('button');
  readSummaryButton.textContent = 'Read Summary';
  readSummaryButton.addEventListener('click', () => {
    // Display the summary in a modal or another HTML element
    displaySummary(summary);
  });
  preview.appendChild(readSummaryButton);

  return preview;
}

// Function to display the book summary
function displaySummary(summaryText) {
    // Create a modal or another HTML element to display the summary
    // Populate the element with the summary text
    // Implement logic to open and close the summary display
  }

// Create and append book previews to the fragment
for (const book of books.slice(start_Index, end_Index)) {
    const preview = createPreview(book);
    fragment.appendChild(preview);
  }

  // Append the fragment to the book list container
const bookList = document.querySelector('[data-list-items]');
bookList.appendChild(fragment);

/ Function to update the book list based on filters (author and genre)
function updateBookList() {
  // Get selected author and genre values from the filter dropdowns
  const selectedAuthor = document.getElementById('author-filter').value;
  const selectedGenre = document.getElementById('genre-filter').value;

// Filter the books based on selected author and genre
const filteredBooks = books.filter((book) => {
    // Check if the selectedAuthor is "any" or matches the book's author
    const authorMatch = selectedAuthor === 'any' || selectedAuthor === book.author;

// Check if the selectedGenre is "any" or matches the book's genre
const genreMatch = selectedGenre === 'any' || selectedGenre === book.genres;

// Include the book in the filtered list if both conditions are met
return authorMatch && genreMatch;
});

// Clear the current book list
bookList.innerHTML = '';

// Create and append previews for the filtered books
for (const book of filteredBooks) {
    const preview = createPreview(book);
    bookList.appendChild(preview);
  }
}

// Event listener for author and genre filtering
document.getElementById('author-filter').addEventListener('change', updateBookList);
document.getElementById('genre-filter').addEventListener('change', updateBookList);

// "Show More" button functionality
document.getElementById('show-more').addEventListener('click', () => {
    // Calculate the new start and end indices for displaying more books
    start_Index = end_Index;
    end_Index = Math.min(end_Index + BOOKS_PER_PAGE, books.length);

     // Create and append previews for the additional books
  for (const book of books.slice(start_Index, end_Index)) {
    const preview = createPreview(book);
    bookList.appendChild(preview);
  }

  // Update the page number
  page++;
});



data-list-button.click() {
    document.querySelector([data-list-items]).appendChild(createPreviewsFragment(matches, page x BOOKS_PER_PAGE, {page + 1} x BOOKS_PER_PAGE]))
    actions.list.updateRemaining()
    page = page + 1
}

data-header-search.click() {
    data-search-overlay.open === true ;
    data-search-title.focus();
}

data-search-form.click(filters) {
    preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    result = []

    for (book; booksList; i++) {
        titleMatch = filters.title.trim() = '' && book.title.toLowerCase().includes[filters.title.toLowerCase()]
        authorMatch = filters.author = 'any' || book.author === filters.author

        {
            genreMatch = filters.genre = 'any'
            for (genre; book.genres; i++) { if singleGenre = filters.genre { genreMatch === true }}}
        }

        if titleMatch && authorMatch && genreMatch => result.push(book)
    }

    if display.length < 1 
    data-list-message.class.add('list__message_show')
    else data-list-message.class.remove('list__message_show')
    

    data-list-items.innerHTML = ''
    const fragment = document.createDocumentFragment()
    const extracted = source.slice(range[0], range[1])

    for ({ author, image, title, id }; extracted; i++) {
        const { author: authorId, id, image, title } = props

        element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div>
        `

        fragment.appendChild(element)
    }
    
    data-list-items.appendChild(fragments)
    initial === matches.length - [page * BOOKS_PER_PAGE]
    remaining === hasRemaining ? initial : 0
    data-list-button.disabled = initial > 0

    data-list-button.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `

    window.scrollTo({ top: 0, behavior: 'smooth' });
    data-search-overlay.open = false
}

data-settings-overlay.submit; {
    preventDefault()
    const formData = new FormData(event.target)
    const result = Object.fromEntries(formData)
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    data-settings-overlay).open === false
}

data-list-items.click() {
    pathArray = Array.from(event.path || event.composedPath())
    active;

    for (node; pathArray; i++) {
        if active break;
        const previewId = node?.dataset?.preview
    
        for (const singleBook of books) {
            if (singleBook.id === id) active = singleBook
        } 
    }
    
    if !active return
    data-list-active.open === true
    data-list-blur + data-list-image === active.image
    data-list-title === active.title
    
    data-list-subtitle === '${authors[active.author]} (${Date(active.published).year})'
    data-list-description === active.description
}