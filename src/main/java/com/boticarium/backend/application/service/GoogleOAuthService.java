package com.boticarium.backend.application.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Objects;

import java.util.Collections;

/**
 * Servicio para validar tokens JWT de Google OAuth
 */
@Service
@Slf4j
public class GoogleOAuthService {

	@Value("${google.oauth.client-id}")
	private String googleClientId;

	/**
	 * Valida un token de Google y extrae la información del usuario
	 * 
	 * @param tokenString Token JWT de Google
	 * @return GoogleIdToken.Payload con los datos del usuario (email, nombre, etc)
	 * @throws Exception Si el token es inválido
	 */
	public GoogleIdToken.Payload verifyGoogleToken(String tokenString) throws Exception {
		if (googleClientId == null || googleClientId.isBlank()) {
			throw new IllegalStateException(
					"Google OAuth no está configurado: falta google.oauth.client-id (GOOGLE_CLIENT_ID). " +
					"Arranca con GOOGLE_CLIENT_ID definido (por ejemplo desde start-dev.bat) o configura application.properties."
			);
		}
		try {
			HttpTransport transport = new NetHttpTransport();
			JsonFactory jsonFactory = new JacksonFactory();
			
			GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
					.setAudience(Collections.singletonList(googleClientId))
					.build();

			GoogleIdToken idToken = verifier.verify(tokenString);
			
			if (idToken != null) {
				return idToken.getPayload();
			} else {
				throw new Exception("Token de Google inválido");
			}
		} catch (Exception e) {
			log.error("Error al verificar token de Google: {}", e.getMessage());
			throw new Exception("No se pudo verificar el token de Google: " + e.getMessage());
		}
	}
}
