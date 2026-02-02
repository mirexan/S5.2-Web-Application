package com.boticarium.backend.application.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@Slf4j
public class GoogleOAuthService {

    @Value("${google.oauth.client-id}")
    private String googleClientId;

    public GoogleIdToken.Payload verifyGoogleToken(String tokenString) throws Exception {
      
        String cleanClientId = googleClientId.trim();

        log.info("🔍 Starting verification. Backend expects Client ID: '{}'", cleanClientId); 
        
        if (cleanClientId == null || cleanClientId.isBlank()) {
            throw new IllegalStateException("❌ ERROR: Client ID not configured.");
        }

        try {
            HttpTransport transport = new NetHttpTransport();
            JsonFactory jsonFactory = new GsonFactory();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    // 2. USAMOS LA VERSIÓN LIMPIA AQUÍ
                    .setAudience(Collections.singletonList(cleanClientId))
                    .setAcceptableTimeSkewSeconds(300) 
                    .build();

            GoogleIdToken idToken = verifier.verify(tokenString);

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                log.info("✅ Valid token. User: {}", payload.getEmail());
                return payload;
            } else {
                // Depuración de errores
                try {
                    GoogleIdToken debugToken = GoogleIdToken.parse(jsonFactory, tokenString);
                    String tokenAudience = debugToken.getPayload().getAudience().toString(); // Convertimos a String por si acaso
                    
                    log.error("❌ Token rejected.");
                    log.error("   -> Token has: '{}'", tokenAudience);
                    log.error("   -> Java has: '{}'", cleanClientId);
                    
                    // Comprobación manual ignorando espacios
                    if (tokenAudience.trim().equals(cleanClientId)) {
                         log.warn("⚠️ WARNING! IDs match if we remove spaces. The problem was the invisible space.");
                    }
                } catch (Exception ex) {
                    log.error("   (Corrupt token)");
                }
                
                throw new Exception("Invalid Google token (verifier returned null)");
            }

        } catch (Exception e) {
            log.error("🔥 Critical error: {}", e.getMessage());
            throw new Exception("OAuth verification error: " + e.getMessage());
        }
    }
}