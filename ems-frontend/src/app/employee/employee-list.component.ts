import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService, Employee } from '../service/employee.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  // Thực hiện Dependency Injection (DI)
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // Khai báo state của Component
  employees: Employee[] = [];
  isLoading = true;
  error: string | null = null;
  username: string | null = null;
  isAdmin = false;
  isUserRole = false;
  showDeleteModal = false;
  employeeToDelete: number | null = null;

  get isLoadingState(): boolean {
    return this.isLoading;
  }

  ngOnInit(): void {
    // Lấy thông tin xác thực từ Token/Local Storage thông qua AuthService
    this.username = this.authService.getUsername();
    this.isAdmin = this.authService.isAdmin();
    this.isUserRole = this.authService.hasRole('USER');
    
    // Khởi chạy lấy dữ liệu
    this.loadEmployees();
  }

  /**
   * Tương tác với RESTful API để lấy danh sách nhân viên
   */
  loadEmployees(): void {
    this.isLoading = true;
    this.error = null;

    // Xử lý bất đồng bộ bằng RxJS (Subscribe)
    this.employeeService.getAllEmployees().subscribe({
      next: (data: any) => {
        try {
          if (!Array.isArray(data)) {
            throw new Error('Response is not an array');
          }
          this.ngZone.run(() => {
            this.employees = data as Employee[];
            this.isLoading = false;
            this.cdr.markForCheck();
          });
        } catch (error) {
          console.error('Error in next block:', error);
          this.ngZone.run(() => {
            this.isLoading = false;
            this.error = 'Lỗi khi xử lý dữ liệu từ API: ' + (error instanceof Error ? error.message : String(error));
          });
        }
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.error = err.error?.message || 'Không thể tải danh sách nhân viên.';
        });
        console.error('Lỗi khi gọi API:', err);

        // Bắt lỗi Unauthorized (Token hết hạn hoặc không hợp lệ)
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (EVENT HANDLERS) ---

  openAddModal(): void {
    if (!this.isAdmin) {
      alert('Chỉ admin mới có quyền thực hiện thao tác này!');
      return;
    }
    // Navigate to form page for creating new employee
    this.router.navigate(['/employees/form']);
  }

  editEmployee(employee: Employee): void {
    if (!this.isAdmin) return;
    // Navigate to form page with employee ID for editing
    this.router.navigate(['/employees/form'], { 
      queryParams: { id: employee.id } 
    });
  }

  viewEmployee(employee: Employee): void {
    // Ai cũng xem được chi tiết
    alert(`Đang mở chi tiết nhân viên: ${employee.name}`);
  }

  deleteEmployee(employeeId: number): void {
    if (!this.isAdmin) return;
    this.employeeToDelete = employeeId;
    this.showDeleteModal = true; // Kích hoạt hiển thị Modal HTML
  }

  confirmDelete(): void {
    if (!this.employeeToDelete) return;

    this.employeeService.deleteEmployee(this.employeeToDelete).subscribe({
      next: () => {
        // Cập nhật lại DOM bằng cách loại bỏ nhân viên đã xóa khỏi mảng
        this.employees = this.employees.filter(e => e.id !== this.employeeToDelete);
        this.closeModal();
      },
      error: (err) => {
        alert('Lỗi khi xóa nhân viên: ' + (err.error?.message || err.statusText));
        this.closeModal();
      }
    });
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  /**
   * Hủy xác nhận xóa (alias của closeModal)
   */
  cancelDelete(): void {
    this.closeModal();
  }

  /**
   * Format ngày sinh thành định dạng dễ đọc (DD/MM/YYYY)
   */
  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateStr;
    }
  }

  logout(): void {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}