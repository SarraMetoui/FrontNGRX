import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';
import {
    AuthActionTypes,
    LogIn, LogInSuccess, LogInFailure,
    SignUp, SignUpSuccess, SignUpFailure, LogOut, GetStatus,
  } from 'src/app/store/actions/auth.actions';
import { AuthService } from '../../services/auth.service';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}

  // effects go here
  
  @Effect({ dispatch: false })
LogInSuccess: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.LOGIN_SUCCESS),
  tap((user) => {
    console.log('userrToken', user);
    localStorage.setItem('token', user.payload.token);
    this.router.navigateByUrl('/');
  })
);
  @Effect()
  LogIn: Observable<any> = this.actions
    .ofType(AuthActionTypes.LOGIN)
    .map((action: LogIn) => action.payload)
    .switchMap(payload => {
      console.log("LogIn catched");
      return this.authService.logIn(payload.email, payload.password)
        .map((user) => {
          
          return new LogInSuccess({token: user.token, email: payload.email});
        })
        .catch((error) => {
          console.log(error);
          return Observable.of(new LogInFailure({ error: error }));
        });
    });

    @Effect({ dispatch: false })
    LogInFailure: Observable<any> = this.actions.pipe(
      ofType(AuthActionTypes.LOGIN_FAILURE)
    );
    
    @Effect()
SignUp: Observable<any> = this.actions
  .ofType(AuthActionTypes.SIGNUP)
  .map((action: SignUp) => action.payload)
  .switchMap(payload => {
    return this.authService.signUp(payload.email, payload.password, payload.name)
      .map((user) => {
        console.log(user);
        return new SignUpSuccess({token: user.token, email: payload.email});
      })
      .catch((error) => {
        console.log(error);
        return Observable.of(new SignUpFailure({ error: error }));
      });
  });
  @Effect({ dispatch: false })
SignUpSuccess: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.SIGNUP_SUCCESS),
  tap((user) => {
    localStorage.setItem('token', user.payload.token);
    this.router.navigateByUrl('/');
  })
);

@Effect({ dispatch: false })
SignUpFailure: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.SIGNUP_FAILURE)
);


@Effect({ dispatch: false })
LogOut: Observable<any> = this.actions.pipe(
  ofType(AuthActionTypes.LOGOUT),
  tap((user) => {
    localStorage.removeItem('token');
  })
);

@Effect({ dispatch: false })
GetStatus: Observable<any> = this.actions
  .ofType(AuthActionTypes.GET_STATUS)
  .map((action: GetStatus) => action)
  .switchMap(payload => {
    return this.authService.getStatus();
  });

}