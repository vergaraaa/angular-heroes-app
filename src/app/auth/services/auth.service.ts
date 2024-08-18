import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  private baseUrl = environments.baseUrl;
  private user?: User;

  get currentUser(): User | undefined {
    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      tap((user) =>
        localStorage.setItem(
          'token',
          'asdfnasfawnkKJnf.hdiash984rqkKAIOF.ishcid3-9ERQFHR'
        )
      )
    );
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
