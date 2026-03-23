import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificate {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = 'http://localhost:8080/api/certificates';
  private http = inject(HttpClient);

  /**
   * Lấy danh sách tất cả chứng chỉ
   */
  getAllCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl);
  }

  /**
   * Lấy thông tin chứng chỉ theo ID
   */
  getCertificateById(id: number): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tạo chứng chỉ mới
   */
  createCertificate(certificate: Certificate): Observable<Certificate> {
    return this.http.post<Certificate>(this.apiUrl, certificate);
  }

  /**
   * Cập nhật chứng chỉ
   */
  updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/${id}`, certificate);
  }

  /**
   * Xóa chứng chỉ
   */
  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
