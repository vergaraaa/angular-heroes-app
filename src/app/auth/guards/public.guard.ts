import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const publicCanActivateGuard: CanActivateFn = (route, state) => {
  return checkAuthStatus();
};

export const publicCanMatchGuard: CanMatchFn = (route, segments) => {
  return checkAuthStatus();
};

const checkAuthStatus = (): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication().pipe(
    tap((isAuthenticated) => {
      if (isAuthenticated) {
        router.navigate(['./heroes']);
      }
    }),
    map((isAuthenticated) => !isAuthenticated)
  );
};
