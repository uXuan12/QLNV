package com.ems.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ems.entity.Employee;
import com.ems.repository.EmployeeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

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
     * Tạo nhân viên mới
     */
    public Employee createEmployee(Employee employee) {
        log.info("Creating new employee: {}", employee.getName());
        return employeeRepository.save(employee);
    }

    /**
     * Cập nhật thông tin nhân viên
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
