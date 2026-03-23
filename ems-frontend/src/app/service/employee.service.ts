import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmployeeLanguage {
  id: number;
  languageId: number;
  languageName: string;
}

export interface EmployeeCertificate {
  id: number;
  certificateId: number;
  certificateName: string;
}

export interface Employee {
  id: number;
  name: string;
  phone: string;
  address: string;
  dob: string;
  userId?: number;
  languages?: EmployeeLanguage[];
  certificates?: EmployeeCertificate[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees';
  private http = inject(HttpClient);

  /**
   * Lấy danh sách tất cả nhân viên
   */
  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  /**
   * Lấy thông tin chi tiết một nhân viên
   */
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tạo nhân viên mới
   */
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }

  /**
   * Cập nhật thông tin nhân viên
   */
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
  }

  /**
   * Xóa nhân viên
   */
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
