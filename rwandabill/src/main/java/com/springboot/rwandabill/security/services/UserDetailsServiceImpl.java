package com.springboot.rwandabill.security.services;

import com.springboot.rwandabill.model.User;
import com.springboot.rwandabill.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find by email
        User user = userRepository.findByEmail(username)
            .orElseGet(() -> 
                // If not found by email, try to find by phone number
                userRepository.findByPhoneNumber(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email or phone: " + username))
            );

        return UserDetailsImpl.build(user);
    }

    @Transactional
    public UserDetails loadUserByEmail(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        return UserDetailsImpl.build(user);
    }
}
