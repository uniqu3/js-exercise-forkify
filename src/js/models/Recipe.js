import axios from 'axios';
import { API_URL } from '../constants';

class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`${API_URL}get?rId=${this.id}`);

      this.title = res.data.recipe.title;
      this.publisher = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }

  calcTime() {
    const numIngredients = this.ingredients.length;
    const periods = Math.ceil(numIngredients / 3);

    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounces',
      'ounce',
      'teaspoons',
      'teaspoon',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];

    const units = [...unitsShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map((el) => {
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      const arrIngredient = ingredient.split(' ');
      const unitIndex = arrIngredient.findIndex((element) =>
        units.includes(element)
      );

      let objIngredient;

      if (unitIndex > -1) {
        const arrCount = arrIngredient.slice(0, unitIndex);

        let count;

        if (arrCount.length === 1) {
          count = eval(arrIngredient[0].replace('-', '+'));
        } else {
          count = eval(arrIngredient.slice(0, unitIndex).join('+'));
        }
        objIngredient = {
          count,
          unit: arrIngredient[unitIndex],
          ingredient: arrIngredient.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIngredient[0], 10)) {
        objIngredient = {
          count: parseInt(arrIngredient[0], 10),
          unit: '',
          ingredient: arrIngredient.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        objIngredient = {
          count: 1,
          unit: '',
          ingredient,
        };
      }

      return objIngredient;
    });

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}

export default Recipe;
