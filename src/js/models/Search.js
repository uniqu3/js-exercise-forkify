import axios from 'axios';
import { API_URL } from '../constants';

class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      const res = await axios(`${API_URL}search?q=${this.query}`);
      this.result = res.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Search;
