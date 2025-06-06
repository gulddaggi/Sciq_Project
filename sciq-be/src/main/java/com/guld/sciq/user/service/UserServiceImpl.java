package com.guld.sciq.user.service;

import com.guld.sciq.common.error.ErrorMessage;
import com.guld.sciq.global.exception.UserNotFoundException;
import com.guld.sciq.user.dto.UserCreateDto;
import com.guld.sciq.user.dto.UserDto;
import com.guld.sciq.user.dto.UserUpdateDto;
import com.guld.sciq.user.entity.User;
import com.guld.sciq.user.repository.UserRepository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntityManager entityManager;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
    private static final Pattern NICKNAME_PATTERN = Pattern.compile("^[가-힣a-zA-Z0-9]{2,20}$");

    @Override
    @Transactional
    public UserDto createUser(UserCreateDto createDto) {
        validateUserCreateDto(createDto);
        
        if (userRepository.existsByEmail(createDto.email())) {
            throw new IllegalArgumentException(ErrorMessage.USER_ALREADY_EXISTS);
        }

        User user = User.builder()
                .email(createDto.email())
                .password(passwordEncoder.encode(createDto.password()))
                .userName(createDto.userName())
                .nickName(createDto.nickName())
                .schoolName(createDto.schoolName())
                .build();

        User savedUser = userRepository.save(user);
        return UserDto.from(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));
        return UserDto.from(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserUpdateDto updateDto) {
        validateUserUpdateDto(updateDto);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));

        try {
            user.updateProfile(
                updateDto.userName(),
                updateDto.nickName(),
                updateDto.schoolName()
            );
            User updatedUser = userRepository.save(user);
            return UserDto.from(updatedUser);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.USER_PROFILE_UPDATE_FAILED, e);
        }
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(ErrorMessage.USER_NOT_FOUND);
        }
        userRepository.deleteById(userId);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        if (newPassword == null || !PASSWORD_PATTERN.matcher(newPassword).matches()) {
            throw new IllegalArgumentException(ErrorMessage.USER_PASSWORD_INVALID);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException(ErrorMessage.USER_PASSWORD_MISMATCH);
        }

        try {
            user.updatePassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.USER_PASSWORD_CHANGE_FAILED, e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByEmail(String email) {
		return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));
    }

    @Override
    @Transactional(readOnly = true)
    public User getReferenceByEmail(String email) {
        return userRepository.getReferenceById(findByEmail(email).getId());
    }

    @Override
    @Transactional
    public void updateUserAdditionalInfo(String email, UserDto.Request userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));
        
        try {
            user.updateProfile(
                userDto.userName(),
                userDto.nickName(),
                userDto.schoolName()
            );
            if (userDto.prefer() != null) {
                user.updatePrefer(userDto.prefer());
            }
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException(ErrorMessage.USER_PROFILE_UPDATE_FAILED, e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));
        return UserDto.from(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(ErrorMessage.USER_NOT_FOUND));
    }

    private void validateUserCreateDto(UserCreateDto dto) {
        if (dto.email() == null || !EMAIL_PATTERN.matcher(dto.email()).matches()) {
            throw new IllegalArgumentException(ErrorMessage.USER_EMAIL_INVALID);
        }
        if (dto.password() == null || !PASSWORD_PATTERN.matcher(dto.password()).matches()) {
            throw new IllegalArgumentException(ErrorMessage.USER_PASSWORD_INVALID);
        }
        if (dto.nickName() == null || !NICKNAME_PATTERN.matcher(dto.nickName()).matches()) {
            throw new IllegalArgumentException(ErrorMessage.USER_NICKNAME_INVALID);
        }
    }

    private void validateUserUpdateDto(UserUpdateDto dto) {
        if (dto.nickName() != null && !NICKNAME_PATTERN.matcher(dto.nickName()).matches()) {
            throw new IllegalArgumentException(ErrorMessage.USER_NICKNAME_INVALID);
        }
    }
} 