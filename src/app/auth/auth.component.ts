import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponceData, AuthService } from "./auth.service";

@Component({
    selector : 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent{
    isLoginMode = true;
    isLoading = false;
    error : string = null;

    constructor(private authService : AuthService, private router : Router) {}
    
    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form : NgForm){
        if(!form.value){
            return;
        }
        let authObservable : Observable<AuthResponceData>;
        this.isLoading = true;
        const email = form.value.email;
        const password = form.value.password;

        if(this.isLoginMode){
            authObservable = this.authService.Login(email , password);
        }else{
            authObservable = this.authService.SignUp(email , password);
        }
        authObservable.subscribe(resData => {
            this.isLoading = false;
            console.log(resData);
            this.router.navigate(['/recipes']);
        },errorMessage => {
            this.isLoading = false;
            console.log(errorMessage);
            this.error = errorMessage;
        });
        form.reset();
    }

    onErrorHandle(){
        this.error = null;
    }
}