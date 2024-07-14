import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';

export const moderatorGuard: CanActivateFn = () => {
    const accountService = inject(AccountService);
  if (accountService.roles().includes('Moderator')){
    return true;
  }else {
    return false
  }
};
