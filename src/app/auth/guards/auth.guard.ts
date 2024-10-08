import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authCanActivateGuard: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

export const authCanMatchGuard: CanMatchFn = (route, segments) => {
  return checkAuthStatus();
};

const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated: boolean) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
      }
    }),
    map((isAuthenticated) => isAuthenticated)
  );
};
