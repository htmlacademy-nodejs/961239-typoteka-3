'use strict';

const axios = require(`axios`);

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles({comments}) {
    return this._load(`/articles`, {params: {comments}});
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  getComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  getCategories(count) {
    return this._load(`/category`, {params: {count}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  editArticle(data, id) {
    return this._load(`/articles/${id}`, {
      method: `POST`,
      data
    });
  }
}

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
