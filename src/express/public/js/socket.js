'use strict';

(() => {
  const SERVER_URL = `http://localhost:3000`;

  const socket = io(SERVER_URL);

  const hotBlock = document.querySelector(`.hot__list`);
  const latestBlock = document.querySelector(`.last__list`);
  let hotElements = hotBlock.querySelectorAll(`.hot__list-item`);
  let latestCommentsElements = latestBlock.querySelectorAll(`.last__list-item`);
  let emptyHotElement = hotBlock.querySelector(`.hot__empty`);
  let emptyLatestElement = latestBlock.querySelector(`.last__empty`);

  const hotElementTemplate = document.querySelector(`#hot-template`);
  const latestCommentTemplate = document.querySelector(`#latest-template`);
  const hotElementEmptyTemplate = document.querySelector(`#hot-empty-template`);
  const latestCommentEmptyTemplate = document.querySelector(`#latest-empty-template`);

  const createElement = (template) => {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;
    return newElement.firstChild;
  };

  const removeElements = (elements) => elements.forEach((elem) => elem.remove());

  const updateHotList = (hotArticles) => {
    if (hotElements.length) {
      removeElements(hotElements);
    }
    if (emptyHotElement) {
      emptyHotElement.remove();
    }
    if (hotArticles.length) {
      hotElements = hotArticles.map((article) => {
        const hotElement = createElement(hotElementTemplate.innerHTML);
        hotBlock.append(hotElement);
        hotElement.querySelector(`a`).href = `/articles/${article.id}`;
        hotElement.querySelector(`a`).prepend(document.createTextNode(article.announce));
        hotElement.querySelector(`sup`).prepend(document.createTextNode(article.commentsCount));
        return hotElement;
      });
    } else {
      const emptyElement = createElement(hotElementEmptyTemplate.innerHTML);
      hotBlock.append(emptyElement);
      emptyHotElement = emptyElement;
    }
  };

  const updateLatestComments = (latestComments) => {
    if (latestCommentsElements.length) {
      removeElements(latestCommentsElements);
    }
    if (emptyLatestElement) {
      emptyLatestElement.remove();
    }
    if (latestComments.length) {
      latestCommentsElements = latestComments.map((comment) => {
        const latestElement = createElement(latestCommentTemplate.innerHTML);
        latestBlock.append(latestElement);
        latestElement.querySelector(`img`).src = `/media/img/${comment.users.avatar}`;
        latestElement.querySelector(`b`).prepend(document.createTextNode(`${comment.users.firstName} ${comment.users.lastName}`));
        latestElement.querySelector(`a`).href = `/articles/${comment.articleId}`;
        latestElement.querySelector(`a`).prepend(document.createTextNode(comment.message));
        return latestElement;
      });
    } else {
      const emptyElement = createElement(latestCommentEmptyTemplate.innerHTML);
      latestBlock.append(emptyElement);
      emptyLatestElement = emptyElement;
    }
  };

  const updateLists = ({hotArticles, latestComments}) => {
    updateHotList(hotArticles);
    updateLatestComments(latestComments);
  };

  socket.addEventListener(`comment::create`, updateLists);
  socket.addEventListener(`comment::delete`, updateLists);
  socket.addEventListener(`article::delete`, updateLists);
})();
