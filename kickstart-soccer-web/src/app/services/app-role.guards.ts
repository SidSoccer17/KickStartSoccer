import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { UserRoleService } from './user-role.service';

export const requireRole: CanActivateChildFn = () => {
  const roles = inject(UserRoleService);
  return roles.selectedRole() ? true : inject(Router).parseUrl('/onboarding');
};

export const requireCoach: CanActivateFn = () => {
  const roles = inject(UserRoleService);
  return roles.isCoach() ? true : inject(Router).parseUrl('/onboarding');
};
