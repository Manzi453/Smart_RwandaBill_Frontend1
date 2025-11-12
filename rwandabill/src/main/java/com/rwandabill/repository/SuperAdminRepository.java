package com.rwandabill.repository;

import com.rwandabill.entity.SuperAdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdminEntity, Long> {
    Optional<SuperAdminEntity> findByEmail(String email);
    boolean existsByEmail(String email);
}
