package com.ems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ems.dto.EmployeeCertificateDTO;
import com.ems.dto.EmployeeDTO;
import com.ems.dto.EmployeeLanguageDTO;
import com.ems.entity.Certificate;
import com.ems.entity.Employee;
import com.ems.entity.EmployeeCertificate;
import com.ems.entity.EmployeeLanguage;
import com.ems.entity.Language;
import com.ems.repository.CertificateRepository;
import com.ems.repository.EmployeeCertificateRepository;
import com.ems.repository.EmployeeLanguageRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LanguageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final LanguageRepository languageRepository;
    private final CertificateRepository certificateRepository;
    private final EmployeeLanguageRepository employeeLanguageRepository;
    private final EmployeeCertificateRepository employeeCertificateRepository;

    /**
     * Lấy toàn bộ danh sách nhân viên (không phân trang)
     */
    public List<Employee> getAllEmployees() {
        log.info("Fetching all employees");
        return employeeRepository.findAll();
    }

    /**
     * Lấy danh sách nhân viên (có hỗ trợ phân trang)
     */
    public Page<Employee> getAllEmployees(Pageable pageable) {
        log.info("Fetching employees with pagination - Page: {}, Size: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        return employeeRepository.findAll(pageable);
    }

    /**
     * Tìm kiếm nhân viên theo từ khóa (tên hoặc số điện thoại)
     */
    public Page<Employee> searchEmployees(String keyword, Pageable pageable) {
        log.info("Searching employees with keyword: {}", keyword);
        return employeeRepository.searchEmployees(keyword, pageable);
    }

    /**
     * Lây thông tin nhân viên theo ID
     */
    public Optional<Employee> getEmployeeById(Long id) {
        log.info("Fetching employee with id: {}", id);
        return employeeRepository.findById(id);
    }

    /**
     * Tìm nhân viên theo User ID
     */
    public Optional<Employee> getEmployeeByUserId(Long userId) {
        log.info("Fetching employee with userId: {}", userId);
        return employeeRepository.findByUserId(userId);
    }

    /**
     * Tạo nhân viên mới với các ngôn ngữ và chứng chỉ (từ EmployeeDTO)
     * Xử lý lưu trữ quan hệ trong các junction tables
     */
    public Employee createEmployee(Employee employee, EmployeeDTO employeeDTO) {
        log.info("Creating new employee: {}", employee.getName());
        
        // Bước 1: Lưu Employee cơ bản
        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Employee saved with id: {}", savedEmployee.getId());
        
        // Bước 2: Lưu Languages (nếu có)
        if (employeeDTO.getLanguages() != null && !employeeDTO.getLanguages().isEmpty()) {
            for (EmployeeLanguageDTO langDTO : employeeDTO.getLanguages()) {
                Optional<Language> langOpt = languageRepository.findById(langDTO.getLanguageId());
                if (langOpt.isPresent()) {
                    EmployeeLanguage employeeLanguage = new EmployeeLanguage();
                    employeeLanguage.setEmployee(savedEmployee);
                    employeeLanguage.setLanguage(langOpt.get());
                    employeeLanguageRepository.save(employeeLanguage);
                    log.info("Added language {} to employee {}", langDTO.getLanguageId(), savedEmployee.getId());
                } else {
                    log.warn("Language with id {} not found", langDTO.getLanguageId());
                }
            }
        }
        
        // Bước 3: Lưu Certificates (nếu có)
        if (employeeDTO.getCertificates() != null && !employeeDTO.getCertificates().isEmpty()) {
            for (EmployeeCertificateDTO certDTO : employeeDTO.getCertificates()) {
                Optional<Certificate> certOpt = certificateRepository.findById(certDTO.getCertificateId());
                if (certOpt.isPresent()) {
                    EmployeeCertificate employeeCertificate = new EmployeeCertificate();
                    employeeCertificate.setEmployee(savedEmployee);
                    employeeCertificate.setCertificate(certOpt.get());
                    employeeCertificateRepository.save(employeeCertificate);
                    log.info("Added certificate {} to employee {}", certDTO.getCertificateId(), savedEmployee.getId());
                } else {
                    log.warn("Certificate with id {} not found", certDTO.getCertificateId());
                }
            }
        }
        
        return savedEmployee;
    }

    /**
     * Tạo nhân viên mới (chỉ basic fields, không xử lý nested relationships)
     * Dùng cho trường hợp không cần lưu languages/certificates
     */
    public Employee createEmployee(Employee employee) {
        log.info("Creating new employee (basic): {}", employee.getName());
        return employeeRepository.save(employee);
    }

    /**
     * Cập nhật thông tin nhân viên với các ngôn ngữ và chứng chỉ (từ EmployeeDTO)
     * Xóa các quan hệ cũ và tạo quan hệ mới từ DTO
     */
    public Optional<Employee> updateEmployee(Long id, Employee employeeDetails, EmployeeDTO employeeDTO) {
        return employeeRepository.findById(id).map(employee -> {
            log.info("Updating employee with id: {}", id);
            
            // Cập nhật basic fields
            employee.setName(employeeDetails.getName());
            employee.setDob(employeeDetails.getDob());
            employee.setAddress(employeeDetails.getAddress());
            employee.setPhone(employeeDetails.getPhone());
            if (employeeDetails.getUser() != null) {
                employee.setUser(employeeDetails.getUser());
            }
            
            Employee updatedEmployee = employeeRepository.save(employee);
            
            // Cập nhật Languages (nếu có)
            if (employeeDTO.getLanguages() != null) {
                // Xóa tất cả languages cũ
                List<EmployeeLanguage> existingLanguages = employeeLanguageRepository.findAll().stream()
                    .filter(el -> el.getEmployee().getId().equals(id))
                    .toList();
                employeeLanguageRepository.deleteAll(existingLanguages);
                log.info("Removed all existing languages for employee {}", id);
                
                // Thêm languages mới
                for (EmployeeLanguageDTO langDTO : employeeDTO.getLanguages()) {
                    Optional<Language> langOpt = languageRepository.findById(langDTO.getLanguageId());
                    if (langOpt.isPresent()) {
                        EmployeeLanguage employeeLanguage = new EmployeeLanguage();
                        employeeLanguage.setEmployee(updatedEmployee);
                        employeeLanguage.setLanguage(langOpt.get());
                        employeeLanguageRepository.save(employeeLanguage);
                        log.info("Added language {} to employee {}", langDTO.getLanguageId(), id);
                    } else {
                        log.warn("Language with id {} not found", langDTO.getLanguageId());
                    }
                }
            }
            
            // Cập nhật Certificates (nếu có)
            if (employeeDTO.getCertificates() != null) {
                // Xóa tất cả certificates cũ
                List<EmployeeCertificate> existingCerts = employeeCertificateRepository.findAll().stream()
                    .filter(ec -> ec.getEmployee().getId().equals(id))
                    .toList();
                employeeCertificateRepository.deleteAll(existingCerts);
                log.info("Removed all existing certificates for employee {}", id);
                
                // Thêm certificates mới
                for (EmployeeCertificateDTO certDTO : employeeDTO.getCertificates()) {
                    Optional<Certificate> certOpt = certificateRepository.findById(certDTO.getCertificateId());
                    if (certOpt.isPresent()) {
                        EmployeeCertificate employeeCertificate = new EmployeeCertificate();
                        employeeCertificate.setEmployee(updatedEmployee);
                        employeeCertificate.setCertificate(certOpt.get());
                        employeeCertificateRepository.save(employeeCertificate);
                        log.info("Added certificate {} to employee {}", certDTO.getCertificateId(), id);
                    } else {
                        log.warn("Certificate with id {} not found", certDTO.getCertificateId());
                    }
                }
            }
            
            return updatedEmployee;
        });
    }

    /**
     * Cập nhật thông tin nhân viên (chỉ basic fields, không xử lý nested relationships)
     */
    public Optional<Employee> updateEmployee(Long id, Employee employeeDetails) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setName(employeeDetails.getName());
            employee.setDob(employeeDetails.getDob());
            employee.setAddress(employeeDetails.getAddress());
            employee.setPhone(employeeDetails.getPhone());
            if (employeeDetails.getUser() != null) {
                employee.setUser(employeeDetails.getUser());
            }
            log.info("Updating employee with id: {}", id);
            return employeeRepository.save(employee);
        });
    }

    /**
     * Xóa nhân viên
     */
    public boolean deleteEmployee(Long id) {
        if (employeeRepository.existsById(id)) {
            log.info("Deleting employee with id: {}", id);
            employeeRepository.deleteById(id);
            return true;
        }
        log.warn("Employee with id: {} not found", id);
        return false;
    }
}
