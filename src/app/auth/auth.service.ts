import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { User } from "./user.model";

export interface AuthResponceData{
    idToken	: string,
    email : string,
    refreshToken : string,
    expiresIn : string,
    localId : string,
    registered ?: boolean
}

@Injectable({providedIn:'root'})
export class AuthService{

user = new BehaviorSubject<User>(null);    
private tokenexipirationTimer : any;

constructor(private http : HttpClient, private router : Router){}

SignUp(emailusr : string , passwordusr : string){
return this.http.post<AuthResponceData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDsMrBoVv2AMnebQSQoQnHsucV6OCu5swQ',
{
  email : emailusr,
  password : passwordusr,
  returnSecureToken : true  
}).pipe(
    catchError(this.handleError), tap(resData=>{
        this.handelAuthentication(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn);
        })
);
}

Login(emailusr : string , passwordusr : string) {
  return this.http.post<AuthResponceData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDsMrBoVv2AMnebQSQoQnHsucV6OCu5swQ',
   {
    email : emailusr,
    password : passwordusr,
    returnSecureToken : true  
   }).pipe(
    catchError(this.handleError), tap(resData=>{
        this.handelAuthentication(resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn);
    })
);
}

autoLogin(){
    const userData : {
        email : string,
        id : string,
        _token : string,
        _tokenExpirationDate : string
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData)
    return;

    const loadedUser = new User(userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate));

        if(loadedUser.token){
            const exipiratinTime = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.user.next(loadedUser);
            this.autoLogout(exipiratinTime);
    }
}

Logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if(this.tokenexipirationTimer){
        clearTimeout(this.tokenexipirationTimer);
    }
    this.tokenexipirationTimer = null;
}

autoLogout(exipirationDuration : number){
    this.tokenexipirationTimer = setTimeout(()=>{
        this.Logout();
    },exipirationDuration);

}

private handelAuthentication(email : string, userId: string, token: string, expiresIn: number){
    const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
    const user = new User(email,
        userId,
        token,
        expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
}

private handleError(errorRes : HttpErrorResponse){  
        let errorMessage = 'An unknown error occurred!';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This Email does not exist';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct' ;
                break;
            case 'USER_DISABLED':
                errorMessage = 'The user account has been disabled by an administrator.';
                break;
        }
        return throwError(errorMessage);
}

}