package com.ems.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ems.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByUserId(Long userId);

    /**
     * Tìm kiếm nhân viên theo tên (hỗ trợ phân trang)
     */
    Page<Employee> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Tìm kiếm nhân viên theo số điện thoại (hỗ trợ phân trang)
     */
    Page<Employee> findByPhoneContaining(String phone, Pageable pageable);

    /**
     * Tìm kiếm nhân viên theo tên hoặc số điện thoại
     */
    @Query("SELECT e FROM Employee e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR e.phone LIKE CONCAT('%', :keyword, '%')")
    Page<Employee> searchEmployees(@Param("keyword") String keyword, Pageable pageable);
}
