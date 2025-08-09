package com.PasswordManager.Backend.controller;

import com.PasswordManager.Backend.model.Credential;
import com.PasswordManager.Backend.service.CredentialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credentials")
public class CredentialController {

    private final CredentialService credentialService;

    public CredentialController(CredentialService credentialService) {
        this.credentialService = credentialService;
    }

    @PostMapping("/add")
    public ResponseEntity<Credential> addCredential(@RequestBody Credential credential) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Credential saved = credentialService.addCredential(credential, username);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/change")
    public ResponseEntity<Credential> changeCredential(@RequestBody Credential credential) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Credential updated = credentialService.changeCredential(credential, username);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Credential>> getUserCredentials() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(credentialService.getUserCredentials(username));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCredential(@PathVariable Long id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        credentialService.deleteCredential(id, username);
        return ResponseEntity.noContent().build();
    }
}
