package com.ems.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ems.dto.EmployeeCertificateDTO;
import com.ems.dto.EmployeeDTO;
import com.ems.dto.EmployeeLanguageDTO;
import com.ems.entity.Certificate;
import com.ems.entity.Employee;
import com.ems.entity.EmployeeCertificate;
import com.ems.entity.EmployeeLanguage;
import com.ems.entity.Language;
import com.ems.entity.User;
import com.ems.repository.CertificateRepository;
import com.ems.repository.EmployeeCertificateRepository;
import com.ems.repository.EmployeeLanguageRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LanguageRepository;
import com.ems.repository.UserRepository;
import com.ems.service.EmployeeService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/employees")
@Slf4j
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;
    private final LanguageRepository languageRepository;
    private final CertificateRepository certificateRepository;
    private final EmployeeLanguageRepository employeeLanguageRepository;
    private final EmployeeCertificateRepository employeeCertificateRepository;
    private final UserRepository userRepository;

    public EmployeeController(EmployeeService employeeService,
                             EmployeeRepository employeeRepository,
                             LanguageRepository languageRepository,
                             CertificateRepository certificateRepository,
                             EmployeeLanguageRepository employeeLanguageRepository,
                             EmployeeCertificateRepository employeeCertificateRepository,
                             UserRepository userRepository) {
        this.employeeService = employeeService;
        this.employeeRepository = employeeRepository;
        this.languageRepository = languageRepository;
        this.certificateRepository = certificateRepository;
        this.employeeLanguageRepository = employeeLanguageRepository;
        this.employeeCertificateRepository = employeeCertificateRepository;
        this.userRepository = userRepository;
    }

    /**
     * Lấy danh sách tất cả nhân viên - cho phép ADMIN và USER
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public List<EmployeeDTO> getAllEmployees() {
        log.info("GET /api/employees - Getting all employees");
        return employeeService.getAllEmployees().stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết nhân viên theo ID - cho phép ADMIN và USER
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable Long id) {
        log.info("GET /api/employees/{} - Getting employee by id", id);
        return employeeService.getEmployeeById(id)
            .map(employee -> ResponseEntity.ok(toDTO(employee)))
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Tạo nhân viên mới - chỉ cho ADMIN
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> createEmployee(@Valid @RequestBody EmployeeDTO employeeDTO) {
        log.info("POST /api/employees - Creating new employee: {}", employeeDTO.getName());
        Employee employee = toEntity(employeeDTO);
        Employee savedEmployee = employeeService.createEmployee(employee);
        return ResponseEntity.ok(toDTO(savedEmployee));
    }

    /**
     * Cập nhật thông tin nhân viên - chỉ cho ADMIN
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable Long id, @Valid @RequestBody EmployeeDTO employeeDTO) {
        log.info("PUT /api/employees/{} - Updating employee", id);
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);
        if (optionalEmployee.isPresent()) {
            Employee employee = optionalEmployee.get();
            employee.setName(employeeDTO.getName());
            employee.setDob(employeeDTO.getDob());
            employee.setAddress(employeeDTO.getAddress());
            employee.setPhone(employeeDTO.getPhone());
            if (employeeDTO.getUserId() != null) {
                userRepository.findById(employeeDTO.getUserId()).ifPresent(employee::setUser);
            }
            Employee updatedEmployee = employeeRepository.save(employee);
            return ResponseEntity.ok(toDTO(updatedEmployee));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa nhân viên - chỉ cho ADMIN
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        log.info("DELETE /api/employees/{} - Deleting employee", id);
        if (employeeService.deleteEmployee(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Thêm ngôn ngữ cho nhân viên - chỉ cho ADMIN
     */
    @PostMapping("/{employeeId}/languages/{languageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeLanguage> addLanguageToEmployee(@PathVariable Long employeeId, @PathVariable Long languageId) {
        log.info("POST /api/employees/{}/languages/{} - Adding language to employee", employeeId, languageId);
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        Optional<Language> languageOpt = languageRepository.findById(languageId);

        if (employeeOpt.isPresent() && languageOpt.isPresent()) {
            EmployeeLanguage employeeLanguage = new EmployeeLanguage();
            employeeLanguage.setEmployee(employeeOpt.get());
            employeeLanguage.setLanguage(languageOpt.get());
            EmployeeLanguage saved = employeeLanguageRepository.save(employeeLanguage);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa ngôn ngữ khỏi nhân viên - chỉ cho ADMIN
     */
    @DeleteMapping("/{employeeId}/languages/{languageId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeLanguageFromEmployee(@PathVariable Long employeeId, @PathVariable Long languageId) {
        log.info("DELETE /api/employees/{}/languages/{} - Removing language from employee", employeeId, languageId);
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        Optional<Language> languageOpt = languageRepository.findById(languageId);

        if (employeeOpt.isPresent() && languageOpt.isPresent()) {
            List<EmployeeLanguage> employeeLanguages = employeeLanguageRepository.findAll();
            for (EmployeeLanguage el : employeeLanguages) {
                if (el.getEmployee().getId().equals(employeeId) && el.getLanguage().getId().equals(languageId)) {
                    employeeLanguageRepository.delete(el);
                    return ResponseEntity.noContent().build();
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Thêm chứng chỉ cho nhân viên - chỉ cho ADMIN
     */
    @PostMapping("/{employeeId}/certificates/{certificateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeCertificate> addCertificateToEmployee(@PathVariable Long employeeId, @PathVariable Long certificateId) {
        log.info("POST /api/employees/{}/certificates/{} - Adding certificate to employee", employeeId, certificateId);
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        Optional<Certificate> certificateOpt = certificateRepository.findById(certificateId);

        if (employeeOpt.isPresent() && certificateOpt.isPresent()) {
            EmployeeCertificate employeeCertificate = new EmployeeCertificate();
            employeeCertificate.setEmployee(employeeOpt.get());
            employeeCertificate.setCertificate(certificateOpt.get());
            EmployeeCertificate saved = employeeCertificateRepository.save(employeeCertificate);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa chứng chỉ khỏi nhân viên - chỉ cho ADMIN
     */
    @DeleteMapping("/{employeeId}/certificates/{certificateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeCertificateFromEmployee(@PathVariable Long employeeId, @PathVariable Long certificateId) {
        log.info("DELETE /api/employees/{}/certificates/{} - Removing certificate from employee", employeeId, certificateId);
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        Optional<Certificate> certificateOpt = certificateRepository.findById(certificateId);

        if (employeeOpt.isPresent() && certificateOpt.isPresent()) {
            List<EmployeeCertificate> employeeCertificates = employeeCertificateRepository.findAll();
            for (EmployeeCertificate ec : employeeCertificates) {
                if (ec.getEmployee().getId().equals(employeeId) && ec.getCertificate().getId().equals(certificateId)) {
                    employeeCertificateRepository.delete(ec);
                    return ResponseEntity.noContent().build();
                }
            }
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Convert Employee entity thành EmployeeDTO
     */
    private EmployeeDTO toDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setName(employee.getName());
        dto.setDob(employee.getDob());
        dto.setAddress(employee.getAddress());
        dto.setPhone(employee.getPhone());
        if (employee.getUser() != null) {
            dto.setUserId(employee.getUser().getId());
        }
        if (employee.getEmployeeLanguages() != null) {
            dto.setLanguages(employee.getEmployeeLanguages().stream().map(el -> {
                EmployeeLanguageDTO languageDTO = new EmployeeLanguageDTO();
                languageDTO.setId(el.getId());
                languageDTO.setLanguageId(el.getLanguage().getId());
                languageDTO.setLanguageName(el.getLanguage().getName());
                return languageDTO;
            }).collect(Collectors.toList()));
        }
        if (employee.getEmployeeCertificates() != null) {
            dto.setCertificates(employee.getEmployeeCertificates().stream().map(ec -> {
                EmployeeCertificateDTO certificateDTO = new EmployeeCertificateDTO();
                certificateDTO.setId(ec.getId());
                certificateDTO.setCertificateId(ec.getCertificate().getId());
                certificateDTO.setCertificateName(ec.getCertificate().getName());
                return certificateDTO;
            }).collect(Collectors.toList()));
        }
        return dto;
    }

    /**
     * Convert EmployeeDTO sang Employee entity
     */
    private Employee toEntity(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setDob(dto.getDob());
        employee.setAddress(dto.getAddress());
        employee.setPhone(dto.getPhone());

        if (dto.getUserId() != null) {
            Optional<User> userOpt = userRepository.findById(dto.getUserId());
            userOpt.ifPresent(employee::setUser);
        }

        // bi-directional relationship correction: EmployeeLanguage and EmployeeCertificate are handled via dedicated endpoints
        return employee;
    }
}