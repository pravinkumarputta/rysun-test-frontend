import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UserProfile } from '../../auth/store/auth.state';
import { PaginatedResponse } from '../../shared/types/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(
    page: number,
    limit: number,
    filters: {
      search?: string;
      createdAtFrom?: string;
      createdAtTo?: string;
    }
  ) {
    return this.http.get<PaginatedResponse<UserProfile>>(
      `${environment.apiBaseUrl}/users`,
      {
        params: {
          page,
          limit,
          ...filters,
        },
      }
    );
  }

  updateUserRole(userId: string, role: string) {
    return this.http.patch<UserProfile>(
      `${environment.apiBaseUrl}/users/${userId}/role`,
      { role }
    );
  }
}
