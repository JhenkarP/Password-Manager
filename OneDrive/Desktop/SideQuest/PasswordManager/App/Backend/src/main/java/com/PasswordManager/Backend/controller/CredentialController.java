package com.PasswordManager.Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.PasswordManager.Backend.model.Credential;
import com.PasswordManager.Backend.service.CredentialService;

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        Credential savedCredential = credentialService.addCredential(credential, username);
        return new ResponseEntity<>(savedCredential, HttpStatus.CREATED);
    }

    @PutMapping("/change")
    public ResponseEntity<Credential> changeCredential(@RequestBody Credential credential) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String owner = auth.getName();
        Credential updated = credentialService.changeCredential(credential, owner);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Credential>> getUserCredentials() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        List<Credential> credentials = credentialService.getUserCredentials(username);
        return ResponseEntity.ok(credentials);
    }
}