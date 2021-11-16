import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListRoutingModule } from "./shopping-list-routing.module";
import { ShoppingListComponent } from "./shopping-list.component";

@NgModule({
    declarations : [
        ShoppingListComponent,
        ShoppingEditComponent
    ],
    imports : [FormsModule, ShoppingListRoutingModule],
    exports : [
        ShoppingListComponent,
        ShoppingEditComponent
    ]
})
export class ShoppingListModule{

}