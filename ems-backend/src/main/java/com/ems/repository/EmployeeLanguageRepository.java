package com.ems.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ems.entity.EmployeeLanguage;

@Repository
public interface EmployeeLanguageRepository extends JpaRepository<EmployeeLanguage, Long> {

}