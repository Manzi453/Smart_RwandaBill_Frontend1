package com.rwandabill.repository;

import com.rwandabill.entity.User;
import com.rwandabill.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    
    @Query("SELECT u FROM User u WHERE u.approved = false AND u.role = :role")
    Page<User> findByApprovedFalseAndRole(@Param("role") UserRole role, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = :role")
    Page<User> findByRole(@Param("role") UserRole role, Pageable pageable);
}
