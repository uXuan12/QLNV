import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Language {
  id: number;
  name: string;
  level: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private apiUrl = 'http://localhost:8080/api/languages';
  private http = inject(HttpClient);

  /**
   * Lấy danh sách tất cả ngôn ngữ
   */
  getAllLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.apiUrl);
  }

  /**
   * Lấy thông tin ngôn ngữ theo ID
   */
  getLanguageById(id: number): Observable<Language> {
    return this.http.get<Language>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tạo ngôn ngữ mới
   */
  createLanguage(language: Language): Observable<Language> {
    return this.http.post<Language>(this.apiUrl, language);
  }

  /**
   * Cập nhật ngôn ngữ
   */
  updateLanguage(id: number, language: Language): Observable<Language> {
    return this.http.put<Language>(`${this.apiUrl}/${id}`, language);
  }

  /**
   * Xóa ngôn ngữ
   */
  deleteLanguage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
