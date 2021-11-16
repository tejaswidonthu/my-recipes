import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs/operators";


import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(private http: HttpClient,
        private recipeservice: RecipeService) { }

    storeRecipes() {
        const recipes = this.recipeservice.getRecipes();
        this.http.put('https://ng-myrecipes-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(response => {
            console.log(response);
        });
    }

    fetchRecipes() {

        return this.http.get<Recipe[]>('https://ng-myrecipes-default-rtdb.firebaseio.com/recipes.json').pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
                });
            }), tap(recipes => {
                this.recipeservice.setRecipes(recipes);
            })
        );
        ;
    }
}