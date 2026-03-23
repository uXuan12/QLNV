import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { EmployeeService, Employee } from '../service/employee.service';
import { LanguageService, Language } from '../service/language.service';
import { CertificateService, Certificate } from '../service/certificate.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private languageService = inject(LanguageService);
  private certificateService = inject(CertificateService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  // Form and data
  employeeForm!: FormGroup;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  success: string | null = null;

  // Available options for select dropdowns
  languages: Language[] = [];
  certificates: Certificate[] = [];

  // Determine if editing or creating
  isEditing = false;
  employeeId: number | null = null;
  pageTitle = 'Thêm Nhân Viên';

  constructor() {
    // Initialize form immediately in constructor to prevent undefined errors
    this.initializeForm();
  }

  ngOnInit(): void {
    // Check if user is admin
    if (!this.authService.isAdmin()) {
      alert('Chỉ admin mới có quyền truy cập trang này!');
      this.router.navigate(['/employees']);
      return;
    }

    // Start loading immediately
    this.isLoading = true;

    // Form already initialized in constructor - no need to call initializeForm() again

    // Load languages and certificates first (always needed)
    this.loadLanguagesAndCertificates();

    // Check if editing - do this after loading master data
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.employeeId = parseInt(params['id'], 10);
        this.pageTitle = 'Sửa Thông Tin Nhân Viên';
        this.loadEmployee(this.employeeId);
      } else {
        // For create mode, we're done loading once master data is loaded
        // isLoading will be set to false in loadLanguagesAndCertificates()
      }
    });
  }

  /**
   * Initialize Reactive Form with FormArray
   */
  private initializeForm(): void {
    this.employeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      dob: ['', Validators.required],
      address: ['', Validators.maxLength(500)],
      phone: ['', Validators.maxLength(20)],
      userId: [''],
      languages: this.formBuilder.array([]),    // FormArray for languages
      certificates: this.formBuilder.array([])  // FormArray for certificates
    });
  }

  /**
   * Getter for languages FormArray
   */
  get languagesArray(): FormArray {
    return this.employeeForm.get('languages') as FormArray;
  }

  /**
   * Getter for certificates FormArray
   */
  get certificatesArray(): FormArray {
    return this.employeeForm.get('certificates') as FormArray;
  }

  /**
   * Add a new language row to FormArray
   */
  addLanguage(): void {
    const languageFormGroup = this.formBuilder.group({
      languageId: ['', Validators.required],
      languageName: [{value: '', disabled: true}]  // Disabled, auto-filled from selection
    });
    this.languagesArray.push(languageFormGroup);
  }

  /**
   * Remove a language row from FormArray
   */
  removeLanguage(index: number): void {
    this.languagesArray.removeAt(index);
  }

  /**
   * Add a new certificate row to FormArray
   */
  addCertificate(): void {
    const certificateFormGroup = this.formBuilder.group({
      certificateId: ['', Validators.required],
      certificateName: [{value: '', disabled: true}]  // Disabled, auto-filled from selection
    });
    this.certificatesArray.push(certificateFormGroup);
  }

  /**
   * Remove a certificate row from FormArray
   */
  removeCertificate(index: number): void {
    this.certificatesArray.removeAt(index);
  }

  /**
   * Handle language selection change - auto-fill languageName
   */
  onLanguageChange(index: number, languageId: number): void {
    const language = this.languages.find(l => l.id === languageId);
    if (language) {
      const languageForm = this.languagesArray.at(index);
      languageForm.get('languageName')?.setValue(language.name);
    }
  }

  /**
   * Handle certificate selection change - auto-fill certificateName
   */
  onCertificateChange(index: number, certificateId: number): void {
    const certificate = this.certificates.find(c => c.id === certificateId);
    if (certificate) {
      const certificateForm = this.certificatesArray.at(index);
      certificateForm.get('certificateName')?.setValue(certificate.name);
    }
  }

  /**
   * Load languages and certificates from backend
   */
  private loadLanguagesAndCertificates(): void {
    this.isLoading = true;
    this.error = null;

    // Load both languages and certificates independently (not using forkJoin)
    // This prevents the "forkJoin trap" where one API failure blocks everything

    let languagesLoaded = false;
    let certificatesLoaded = false;
    let hasError = false;

    // Load languages
    this.languageService.getAllLanguages().subscribe({
      next: (languages) => {
        this.languages = languages;
        languagesLoaded = true;
        this.checkIfAllDataLoaded(hasError);
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách ngôn ngữ:', err);
        this.languages = []; // Fallback to empty array
        languagesLoaded = true;
        hasError = true;
        this.checkIfAllDataLoaded(hasError);
      }
    });

    // Load certificates
    this.certificateService.getAllCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        certificatesLoaded = true;
        this.checkIfAllDataLoaded(hasError);
      },
      error: (err) => {
        console.error('Lỗi khi tải danh sách chứng chỉ:', err);
        this.certificates = []; // Fallback to empty array
        certificatesLoaded = true;
        hasError = true;
        this.checkIfAllDataLoaded(hasError);
      }
    });
  }

  /**
   * Check if all master data has been loaded and update loading state
   */
  private checkIfAllDataLoaded(hasError: boolean): void {
    if (this.languages !== undefined && this.certificates !== undefined) {
      this.isLoading = false;
      if (hasError) {
        this.error = 'Một số dữ liệu không thể tải được. Vui lòng thử lại.';
      }
    }
  }

  /**
   * Load employee data for editing
   */
  private loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        // Populate form with employee data
        this.employeeForm.patchValue({
          name: employee.name,
          dob: employee.dob,
          address: employee.address,
          phone: employee.phone,
          userId: employee.userId || ''
        });

        // Populate languages FormArray - Safe mapping with null checks
        if (employee.languages && Array.isArray(employee.languages) && employee.languages.length > 0) {
          const languagesArray = this.languagesArray;
          employee.languages.forEach(lang => {
            if (lang && lang.languageId && lang.languageName) {
              languagesArray.push(this.formBuilder.group({
                languageId: [lang.languageId, Validators.required],
                languageName: [{value: lang.languageName, disabled: true}]
              }));
            }
          });
        }

        // Populate certificates FormArray - Safe mapping with null checks
        if (employee.certificates && Array.isArray(employee.certificates) && employee.certificates.length > 0) {
          const certificatesArray = this.certificatesArray;
          employee.certificates.forEach(cert => {
            if (cert && cert.certificateId && cert.certificateName) {
              certificatesArray.push(this.formBuilder.group({
                certificateId: [cert.certificateId, Validators.required],
                certificateName: [{value: cert.certificateName, disabled: true}]
              }));
            }
          });
        }

        // Done loading employee data
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi khi tải thông tin nhân viên:', err);
        this.error = 'Không thể tải thông tin nhân viên';
        this.isLoading = false; // Ensure loading state is cleared even on error
      }
    });
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    if (!this.employeeForm.valid) {
      this.error = 'Vui lòng điền đầy đủ thông tin bắt buộc';
      return;
    }

    this.isSaving = true;
    this.error = null;
    this.success = null;

    const languagesFormValue = this.languagesArray.getRawValue();
    const certificatesFormValue = this.certificatesArray.getRawValue();

    const employee: Employee = {
      id: 0,
      ...this.employeeForm.value,
      languages: languagesFormValue,
      certificates: certificatesFormValue
    };

    if (this.isEditing && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, employee).subscribe({
        next: () => {
          this.isSaving = false;
          this.success = 'Cập nhật thông tin nhân viên thành công';
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1500);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Lỗi khi cập nhật nhân viên:', err);
          this.error = err.error?.message || 'Không thể cập nhật thông tin nhân viên';
        }
      });
    } else {
      this.employeeService.createEmployee(employee).subscribe({
        next: () => {
          this.isSaving = false;
          this.success = 'Thêm nhân viên thành công';
          setTimeout(() => {
            this.router.navigate(['/employees']);
          }, 1500);
        },
        error: (err) => {
          this.isSaving = false;
          console.error('Lỗi khi tạo nhân viên:', err);
          this.error = err.error?.message || 'Không thể tạo nhân viên mới';
        }
      });
    }
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.employeeForm.reset();
    // Clear FormArrays
    while (this.languagesArray.length > 0) {
      this.languagesArray.removeAt(0);
    }
    while (this.certificatesArray.length > 0) {
      this.certificatesArray.removeAt(0);
    }
    this.error = null;
    this.success = null;
  }

  /**
   * Cancel and go back to employee list
   */
  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
