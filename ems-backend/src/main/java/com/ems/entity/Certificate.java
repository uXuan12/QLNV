package com.ems.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "certificate")
@Data
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Certificate name is required")
    @Size(max = 150, message = "Certificate name must not exceed 150 characters")
    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @OneToMany(mappedBy = "certificate")
    @JsonManagedReference
    @JsonIgnore
    private List<EmployeeCertificate> employeeCertificates;
}