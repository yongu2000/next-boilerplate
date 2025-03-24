package com.example.boilerplate.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class JoinService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public JoinResponse join(JoinRequest request) {
        validateEmailExistence(request.getEmail());
        String username = generateUniqueUsername(request.getEmail());
        String name = request.getEmail().split("@")[0];
        
        User newUser = User.builder()
            .email(request.getEmail())
            .username(username)
            .password(bCryptPasswordEncoder.encode(request.getPassword()))
            .name(name)
            .role(Role.USER)
            .build();
        userRepository.save(newUser);
        return JoinResponse.builder()
            .id(newUser.getId())
            .username(newUser.getUsername())
            .build();
    }

    private void validateEmailExistence(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            throw new DuplicateUserException();
        }
    }

    private String generateUniqueUsername(String email) {
        // 이메일에서 @ 앞부분 추출
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int randomNumber = 0;
        
        // username이 중복되지 않을 때까지 반복
        while (userRepository.findByUsername(username).isPresent()) {
            randomNumber = (int) (Math.random() * 10000); // 0-9999 사이의 랜덤 숫자
            username = baseUsername + randomNumber;
        }
        
        return username;
    }
} 