import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../../enum/Role';
import { AuthState } from '../state/auth-state.service';
import { AuthNavigationService } from '../services/auth-navigation.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authState = inject(AuthState);
  return authState.currentUser()
    ? true
    : inject(AuthNavigationService).loginUrl(state.url);
};

export const adminGuard: CanActivateFn = (_route, state) => {

  const user = inject(AuthState).currentUser();
  if (!user) {
    return inject(AuthNavigationService).loginUrl(state.url);
  }

  return user.role === Role.ADMIN ? true : inject(Router).parseUrl('/'); 
  
};
