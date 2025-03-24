package com.example.boilerplate.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
@Transactional
public class JwtUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // username이 이메일 형식인지 확인
        if (username.contains("@")) {
            return new CustomUserDetails(userService.findByEmail(username));
        }
        // username으로 로그인 시도
        return new CustomUserDetails(userService.findByUsername(username));
    }
} 