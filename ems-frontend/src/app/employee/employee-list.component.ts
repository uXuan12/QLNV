import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../service/employee.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <!-- Header / Navbar -->
      <div class="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-3xl font-bold text-white">Quản lý Nhân viên</h1>
              <p class="text-slate-400 text-sm mt-1">Danh sách nhân viên trong hệ thống</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-slate-300">
                  Chào <span class="font-semibold text-cyan-400">{{ username }}</span>
                </span>
                <span *ngIf="isAdmin" class="px-2 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-semibold rounded">
                  👤 ADMIN
                </span>
                <span *ngIf="isUserRole" class="px-2 py-1 bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-semibold rounded">
                  👤 USER
                </span>
              </div>
              <button 
                (click)="logout()"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200">
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Action Buttons -->
        <div *ngIf="!isLoading && !error" class="mb-6 flex gap-3">
          <button 
            *ngIf="isAdmin"
            (click)="openAddModal()"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2">
            ➕ Thêm nhân viên
          </button>
          <button 
            *ngIf="!isAdmin"
            disabled
            class="px-4 py-2 bg-gray-600 text-gray-300 font-medium rounded-lg cursor-not-allowed flex items-center gap-2">
            ➕ Thêm nhân viên
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="flex justify-center items-center h-64">
          <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
            <p class="text-slate-400">Đang tải dữ liệu...</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="error && !isLoading" class="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-3">
            <span class="text-red-400 text-xl">⚠️</span>
            <div>
              <h3 class="text-red-400 font-semibold">Lỗi khi tải dữ liệu</h3>
              <p class="text-red-300 text-sm">{{ error }}</p>
            </div>
          </div>
          <button 
            (click)="loadEmployees()"
            class="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200">
            Thử lại
          </button>
        </div>

        <!-- Table -->
        <div *ngIf="!isLoading && !error" class="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-slate-700 border-b border-slate-600">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-cyan-400">ID</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Họ tên</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Số điện thoại</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Địa chỉ</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Ngày sinh</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                <tr *ngFor="let employee of employees; let i = index" 
                    [class.bg-slate-700/50]="i % 2 === 0"
                    class="hover:bg-slate-700 transition-colors duration-150">
                  <td class="px-6 py-4 text-sm text-slate-300">{{ employee.id }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-white">{{ employee.name }}</td>
                  <td class="px-6 py-4 text-sm text-slate-400">{{ employee.phone || 'N/A' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-400">{{ employee.address || 'N/A' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-400">{{ employee.dob || 'N/A' }}</td>
                  <td class="px-6 py-4 text-sm">
                    <div class="flex gap-2">
                      <!-- Edit Button -->
                      <button
                        *ngIf="isAdmin"
                        (click)="editEmployee(employee)"
                        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors duration-200">
                        ✏️ Sửa
                      </button>
                      <button
                        *ngIf="!isAdmin"
                        disabled
                        class="px-3 py-1 bg-gray-600 text-gray-300 text-xs font-medium rounded cursor-not-allowed">
                        ✏️ Sửa
                      </button>

                      <!-- Delete Button -->
                      <button
                        *ngIf="isAdmin"
                        (click)="deleteEmployee(employee.id)"
                        class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors duration-200">
                        🗑️ Xóa
                      </button>
                      <button
                        *ngIf="!isAdmin"
                        disabled
                        class="px-3 py-1 bg-gray-600 text-gray-300 text-xs font-medium rounded cursor-not-allowed">
                        🗑️ Xóa
                      </button>

                      <!-- View Details Button -->
                      <button
                        (click)="viewEmployee(employee)"
                        class="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-medium rounded transition-colors duration-200">
                        👁️ Chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="employees.length === 0">
                  <td colspan="6" class="px-6 py-8 text-center text-slate-400">
                    Không có nhân viên nào trong hệ thống
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer Stats -->
        <div *ngIf="!isLoading && !error" class="mt-6 bg-slate-800 rounded-lg border border-slate-700 p-4">
          <p class="text-slate-300">
            Tổng cộng: <span class="font-semibold text-cyan-400">{{ employees.length }}</span> nhân viên
          </p>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
        <div class="bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4 border border-slate-700">
          <h3 class="text-xl font-bold text-white mb-2">Xác nhận xóa</h3>
          <p class="text-slate-300 mb-6">
            Bạn chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác.
          </p>
          <div class="flex gap-3 justify-end">
            <button
              (click)="cancelDelete()"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
              Hủy
            </button>
            <button
              (click)="confirmDelete()"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
      overflow: auto;
    }
  `]
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  employees: Employee[] = [];
  isLoading = true;
  error: string | null = null;
  username: string | null = null;
  isAdmin = false;
  isUserRole = false;
  showDeleteModal = false;
  employeeToDelete: number | null = null;

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.isAdmin = this.authService.isAdmin();
    this.isUserRole = this.authService.hasRole('USER');
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.error = null;

    this.employeeService.getAllEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.isLoading = false;
        console.log('✓ Tải danh sách nhân viên thành công:', data);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Không thể tải danh sách nhân viên. Vui lòng thử lại sau.';
        console.error('❌ Lỗi khi tải nhân viên:', err);

        // Nếu token hết hạn (401), tự động đăng xuất
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /**
   * Mở modal thêm nhân viên mới (chỉ ADMIN)
   */
  openAddModal(): void {
    if (!this.isAdmin) {
      alert('Chỉ admin mới có thể thêm nhân viên!');
      return;
    }
    console.log('Opening add employee modal');
    // TODO: Implement add modal
    alert('Chức năng thêm nhân viên sẽ được phát triển tiếp');
  }

  /**
   * Sửa thông tin nhân viên (chỉ ADMIN)
   */
  editEmployee(employee: Employee): void {
    if (!this.isAdmin) {
      alert('Chỉ admin mới có thể sửa thông tin nhân viên!');
      return;
    }
    console.log('Editing employee:', employee);
    // TODO: Implement edit modal
    alert(`Chức năng sửa nhân viên (#${employee.id}) sẽ được phát triển tiếp`);
  }

  /**
   * Xóa nhân viên (chỉ ADMIN)
   */
  deleteEmployee(employeeId: number): void {
    if (!this.isAdmin) {
      alert('Chỉ admin mới có thể xóa nhân viên!');
      return;
    }
    this.employeeToDelete = employeeId;
    this.showDeleteModal = true;
  }

  /**
   * Xác nhận xóa nhân viên
   */
  confirmDelete(): void {
    if (this.employeeToDelete) {
      this.employeeService.deleteEmployee(this.employeeToDelete).subscribe({
        next: () => {
          this.employees = this.employees.filter(e => e.id !== this.employeeToDelete);
          this.showDeleteModal = false;
          this.employeeToDelete = null;
          console.log('✓ Xóa nhân viên thành công');
        },
        error: (err) => {
          console.error('❌ Lỗi khi xóa nhân viên:', err);
          alert('Lỗi khi xóa nhân viên: ' + (err.error?.message || err.statusText));
        }
      });
    }
  }

  /**
   * Hủy xác nhận xóa
   */
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  /**
   * Xem chi tiết nhân viên
   */
  viewEmployee(employee: Employee): void {
    console.log('Viewing employee details:', employee);
    // TODO: Implement view details modal or navigate to detail page
    alert(`Chi tiết nhân viên #${employee.id} - ${employee.name} (chức năng sẽ phát triển tiếp)`);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
