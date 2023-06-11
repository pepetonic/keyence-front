import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserCatalog, UserCatalogResponse } from '../interfaces/userCatalog.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCatalogService {

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) { }

  getAllUsersFromCatalog():Observable<UserCatalogResponse>{
    return this.http.get<UserCatalogResponse>(`${environment.urlBase}usersCatalog/`)
  }

  deleteUserById(id:string){
    return this.http.delete(`${environment.urlBase}usersCatalog/${id}`);
  }

  uploadCatalog( formData: FormData ){
    return this.http.post(`${environment.urlBase}usersCatalog/upload`, formData);
  }

  createUserOnCatalog(user: UserCatalog){
    return this.http.post(`${environment.urlBase}usersCatalog/`, user);
  }

  updateUserOnCatalogById(user: UserCatalog, id: string){
    return this.http.patch(`${environment.urlBase}usersCatalog/${id}`, user)
  }
}
