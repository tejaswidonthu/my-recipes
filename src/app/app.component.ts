import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  //title = 'my-recipes';
  //loadedfeature = 'recipe';
  // onNavigate(feature:string){
  //   this.loadedfeature = feature;
  // }
constructor(private authService : AuthService){}

  ngOnInit(){
    this.authService.autoLogin();
  }
}
