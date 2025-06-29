package com.PasswordManager.Backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PasswordManager.Backend.model.Credential;
import com.PasswordManager.Backend.model.User;
import com.PasswordManager.Backend.repository.CredentialRepository;
import com.PasswordManager.Backend.repository.UserRepository;

@Service
public class CredentialService {

    private final CredentialRepository credentialRepository;
    private final UserRepository userRepository;

    public CredentialService(CredentialRepository credentialRepository, UserRepository userRepository) {
        this.credentialRepository = credentialRepository;
        this.userRepository = userRepository;
    }

    public Credential addCredential(Credential credential, String username) {
        User user = getUserOrThrow(username);

        // Prevent duplicate service names per user
        Optional<Credential> existing = credentialRepository.findByUserAndServiceName(user,
                credential.getServiceName());
        if (existing.isPresent()) {
            throw new RuntimeException("Credential already exists for this site.");
        }

        credential.setUser(user);
        return credentialRepository.save(credential);
    }

    @Transactional
    public Credential changeCredential(Credential req, String username) {
        Credential credential = credentialRepository.findById(req.getId())
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: You can only update your own credentials");
        }

        credential.setUsername(req.getUsername());
        credential.setPassword(req.getPassword());

        return credential;
    }

    public List<Credential> getUserCredentials(String username) {
        User user = getUserOrThrow(username);
        return credentialRepository.findByUser(user);
    }

    public void deleteCredential(Long credentialId, String username) {
        User user = getUserOrThrow(username);

        Credential credential = credentialRepository.findById(credentialId)
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        if (!credential.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: You can only delete your own credentials");
        }

        credentialRepository.delete(credential);
    }

    private User getUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}