import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Atm } from '../models/Atm';

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  private API_ATM = 'http://localhost:3000/atm/'

  constructor(
    private http: HttpClient
  ) { }

  getAllAtm(): Observable<Atm[]> {
    return this.http.get<Atm[]>(this.API_ATM)
  }

  getUsers(page: number) {
    return this.http.get(this.API_ATM + '?page=' + page);
  }

  postAtm(atm: Atm): Observable<Atm> {
    return this.http.post<Atm>(this.API_ATM, atm)
  }

  getId(id: any): Observable<Atm> {
    return this.http.get(this.API_ATM + id)
  }

  updateAtm(id: any, atm: any): Observable<Atm> {
    return this.http.put(this.API_ATM + id, atm)
  }

  deleteAtm(id: any): Observable<Atm> {
    return this.http.delete(this.API_ATM + id)
  }

  searchByName(name: String): Observable<Atm[]> {
    return this.http.get<Atm[]>(this.API_ATM + '?_order=desc&name_like=' + name)
  }
}
