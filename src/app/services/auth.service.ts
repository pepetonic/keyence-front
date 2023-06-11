import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../interfaces/login.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  accesToken:string|null = '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) { }


  login(email: string, password: string):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${environment.urlBase}auth`,{email,password});
  }

  saveToken(token:string):void{
    this.accesToken = token;
    localStorage.setItem('token',this.accesToken);
  }

  getToken():void{
    this.accesToken = localStorage.getItem('token');
  }

  removeToken(){
    localStorage.removeItem('token');
  }

  checkToken():boolean{
    this.getToken();
    return !!this.accesToken;
  }

  logout():void{
    this.accesToken = '';
    this.removeToken();
    this.router.navigate(['/']);
  }
}
