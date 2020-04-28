import { elements } from './base';

export const limitRecipeTitle = (title, limit = 17) => {
  const truncatedTitle = [];

  if (title.length > limit) {
    title.split(' ').reduce((accumulator, current) => {
      if (accumulator + current.length <= limit) {
        truncatedTitle.push(current);
      }
      return accumulator + current.length;
    }, 0);
    return `${truncatedTitle.join(' ')}...`;
  }
  return title;
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto="${
  type === 'prev' ? page - 1 : page + 1
}">
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === 'prev' ? 'left' : 'right'
            }"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resultsPerPage) => {
  const pages = Math.ceil(numResults / resultsPerPage);
  let button;

  if (page === 1 && pages > 1) {
    button = createButton(page, 'next');
  } else if (page < pages) {
    button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
  } else if (page === pages && pages > 1) {
    button = createButton(page, 'prev');
  }

  elements.searchResultsPages.insertAdjacentHTML('afterbegin', button);
};

export const getSearchInput = () => elements.searchInput.value;

export const clearSearchInput = () => {
  elements.searchInput.value = '';
};

export const clearSearchResults = () => {
  elements.searchResultList.innerHTML = '';
  elements.searchResultsPages.innerHTML = '';
};

export const renderRecipe = (recipe) => {
  const { recipe_id, image_url, publisher, title } = recipe;
  const markup = `
    <li>
        <a class="results__link" href="#${recipe_id}">
            <figure class="results__fig">
                <img loading="lazy" src="${image_url}" alt="${title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(title)}</h4>
                <p class="results__author">${publisher}</p>
            </div>
        </a>
    </li>
    `;

  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

export const renderSearchResults = (recipes, page = 1, resultsPerPage = 10) => {
  const start = (page - 1) * resultsPerPage;
  const end = page * resultsPerPage;

  recipes.slice(start, end).forEach((el) => renderRecipe(el));
  renderButtons(page, recipes.length, resultsPerPage);
};

export const highlightSelected = (id) => {
  const resultsArr = Array.from(
    document.querySelectorAll('.results__link--active')
  );
  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active');
  });
  document
    .querySelector(`.results__link[href*="#${id}"]`)
    .classList.add('results__link--active');
};
