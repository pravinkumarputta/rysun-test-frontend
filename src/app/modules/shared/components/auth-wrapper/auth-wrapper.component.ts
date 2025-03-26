import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { selectUserProfile } from '../../../auth/store/auth.selectors';
import { UserProfile } from '../../../auth/store/auth.state';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles: string[];
  isActive: () => boolean;
}

@Component({
  selector: 'app-auth-wrapper',
  templateUrl: './auth-wrapper.component.html',
  styleUrl: './auth-wrapper.component.scss',
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class AuthWrapperComponent {
  navItems: NavItem[] = [
    {
      label: 'User Management',
      route: '/user/dashboard',
      icon: '👥',
      roles: ['admin'],
      isActive: () => this.router.url.includes('/user'),
    },
    {
      label: 'Product Management',
      route: '/product/dashboard',
      icon: '📦',
      roles: ['admin', 'user'],
      isActive: () => this.router.url.includes('/product'),
    },
  ];

  $destroy = new Subject<void>();
  userProfile: UserProfile | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {
    this.store.select(selectUserProfile).subscribe((userProfile) => {
      this.userProfile = userProfile;
    });
  }

  logout() {
    this.authService.logout();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getFilteredNavItems() {
    return this.navItems.filter((item) =>
      item.roles.includes(this.userProfile?.role ?? '')
    );
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
