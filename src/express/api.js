'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`./../constants`);

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

  async getArticles({offset, limit, type}) {
    return this._load(`/articles`, {params: {offset, limit, type}});
  }

  async getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getLatestComments(limit) {
    return this._load(`/articles/lastcomments`, {params: {limit}});
  }

  async getComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async getCategoryArticles({id, limit, type}) {
    return this._load(`articles`, {params: {id, limit, type}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  async editArticle(data, id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  async createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  async deleteComment(id, commentId) {
    return this._load(`/articles/${id}/comments/${commentId}`, {
      method: HttpMethod.DELETE
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  async auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
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
