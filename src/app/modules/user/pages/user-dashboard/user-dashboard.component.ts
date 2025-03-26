import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { selectUserProfile } from '../../../auth/store/auth.selectors';
import { UserProfile } from '../../../auth/store/auth.state';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  users: UserProfile[] = [];
  totalUsers = 0;
  currentPage = 1;
  pageSize = 10;
  searchQuery = '';
  dateRange: { start: Date | null; end: Date | null } | null = null;
  dateRangeForm: FormGroup;
  displayedColumns: string[] = [
    'fullName',
    'emailId',
    'phoneNumber',
    'role',
    'adminActions',
    'createdAt',
  ];
  Math = Math; // For using Math in template

  userProfile: UserProfile | null = null;

  $destroy = new Subject<void>();

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.store
      .select(selectUserProfile)
      .pipe(takeUntil(this.$destroy))
      .subscribe((user) => {
        this.userProfile = user;
      });

    this.dateRangeForm = this.fb.group({
      start: [null],
      end: [null],
    });

    // Subscribe to form changes
    this.dateRangeForm.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        if (value.start && value.end) {
          this.dateRange = {
            start: value.start,
            end: value.end,
          };
        } else {
          this.dateRange = null;
        }
      });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    const filters: any = {};

    if (this.searchQuery) {
      filters.search = this.searchQuery;
    }

    if (this.dateRange?.start) {
      filters.createdAtFrom = this.dateRange.start.toISOString();
    }

    if (this.dateRange?.end) {
      filters.createdAtTo = this.dateRange.end.toISOString();
    }

    this.userService
      .getUsers(this.currentPage, this.pageSize, filters)
      .subscribe((response) => {
        this.users = response.data;
        this.totalUsers = response.total;
      });
  }

  applyFilters() {
    this.currentPage = 1; // Reset to first page when applying filters
    this.loadUsers();
  }

  clearFilters() {
    this.searchQuery = '';
    this.dateRangeForm.reset();
    this.dateRange = null;
    this.currentPage = 1; // Reset to first page when clearing filters
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  onRoleChange(user: UserProfile, isAdmin: boolean) {
    const newRole = isAdmin ? 'admin' : 'user';
    this.userService.updateUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        // Update the user in the local array
        const index = this.users.findIndex((u) => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.toastr.success('User role updated successfully', 'Success');
        // reload the users
        this.loadUsers();
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error.message, 'Error');
        // Revert the checkbox state
        user.role = isAdmin ? 'user' : 'admin';
      },
    });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
