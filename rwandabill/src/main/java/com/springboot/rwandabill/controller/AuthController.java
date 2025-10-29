package com.springboot.rwandabill.controller;

import com.springboot.rwandabill.payload.request.LoginRequest;
import com.springboot.rwandabill.payload.request.SignupRequest;
import com.springboot.rwandabill.payload.response.JwtResponse;
import com.springboot.rwandabill.payload.response.MessageResponse;
import com.springboot.rwandabill.repository.UserRepository;
import com.springboot.rwandabill.security.jwt.JwtUtils;
import com.springboot.rwandabill.security.services.UserDetailsImpl;
import com.springboot.rwandabill.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    String username = loginRequest.getEmail() != null && !loginRequest.getEmail().isEmpty() 
        ? loginRequest.getEmail() 
        : loginRequest.getPhoneNumber();
        
    if (username == null || username.isEmpty()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email or phone number is required!"));
    }

    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(username, loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      String jwt = jwtUtils.generateJwtToken(authentication);
      
      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
      List<String> roles = userDetails.getAuthorities().stream()
          .map(item -> item.getAuthority())
          .collect(Collectors.toList());

      return ResponseEntity.ok(new JwtResponse(jwt, 
                           jwtUtils.getJwtExpirationMs(),
                           userDetails.getId(), 
                           userDetails.getUsername(), 
                           userDetails.getEmail(),
                           userDetails.getFullName(),
                           userDetails.getTelephone(),
                           userDetails.getDistrict(),
                           userDetails.getSector(),
                           roles));
    } catch (BadCredentialsException e) {
      return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body(new MessageResponse("Error: Invalid credentials!"));
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            userService.registerUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
