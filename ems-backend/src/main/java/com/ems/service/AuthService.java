package com.ems.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ems.dto.AuthResponse;
import com.ems.dto.LoginRequest;
import com.ems.entity.User;
import com.ems.exception.UnauthorizedException;
import com.ems.repository.UserRepository;
import com.ems.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByUsername(loginRequest.getUsername());

        if (optionalUser.isEmpty()) {
            throw new UnauthorizedException("User not found with username: " + loginRequest.getUsername());
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid password");
        }

        String accessToken = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), user.getRole());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .role(user.getRole())
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    /**
     * Đăng ký người dùng mới với mã hóa mật khẩu
     */
    public User register(String username, String rawPassword, String role) {
        // Kiểm tra xem username đã tồn tại chưa
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists: " + username);
        }

        // Mã hóa mật khẩu (QUAN TRỌNG!)
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // Tạo user mới và lưu vào database
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);  // Lưu mật khẩu đã mã hóa
        user.setRole(role != null ? role : "USER");

        return userRepository.save(user);
    }
}

