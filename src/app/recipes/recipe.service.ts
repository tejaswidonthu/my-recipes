import {  Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

   recipeChanged = new Subject<Recipe[]>();

  /*private recipes : Recipe[] = [
    new Recipe('Tasty Schnitzel','simple Tasty Schnitzel recipe','https://image.shutterstock.com/image-photo/schnitzel-fried-potatoes-on-dark-260nw-482743804.jpg',
    [
      new Ingredient('Meat', 1),
      new Ingredient('French Fries', 20)
    ]),
    new Recipe('Burger','Tasty Big Burger recipe','https://www.minamade.com/wp-content/uploads/2018/06/Burger-Falafel-vegan-taco.jpg',
    [
      new Ingredient('Burger Buns', 4),
      new Ingredient('potatoes', 6)
    ]),
    new Recipe('Maggie','Simple maggie recipe','https://www.shanazrafiq.com/wp-content/uploads/2020/05/17-sauce-noodles-2wm.jpg',
    [
      new Ingredient('Maggie', 2),
      new Ingredient('water', 1),
      new Ingredient('Veggies',1)
    ]),
  ];*/

  private recipes : Recipe[] = [];
  
  constructor(private slService: ShoppingListService) { }

  setRecipes(recipes : Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes(){
    this.recipeChanged.next(this.recipes.slice());
    return this.recipes.slice();
  }

  prepareShoppingList(ingredient : Ingredient[]){
    this.slService.addIngredients(ingredient);
  }

  getRecipe(index : number){
    return this.recipes[index];
  }

  addRecipe(recipe : Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe){
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index : number){
    this.recipes.splice(index,1);
    this.recipeChanged.next(this.recipes.slice());
  }
}
