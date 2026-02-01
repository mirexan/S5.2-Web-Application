package com.boticarium.backend.infrastructure.inbound.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
public class FileUploadController {

	@Value("${file.upload-dir:uploads}")
	private String uploadDir;

	/**
	 * Endpoint para subir un archivo de imagen
	 * POST /uploads/image
	 * @param file - Archivo de imagen (multipart/form-data)
	 * @return URL relativa de la imagen guardada
	 */
	@PostMapping("/image")
	public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
		try {
			// Validar que sea un archivo de imagen
			if (file.isEmpty()) {
				return ResponseEntity.badRequest().body(Map.of("error", "El archivo está vacío"));
			}

			String contentType = file.getContentType();
			if (contentType == null || !contentType.startsWith("image/")) {
				return ResponseEntity.badRequest()
						.body(Map.of("error", "El archivo debe ser una imagen (jpg, png, etc.)"));
			}

			// Crear directorio si no existe
			Path uploadPath = Paths.get(uploadDir);
			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
				log.info("Directorio de upload creado: {}", uploadPath);
			}

			// Generar nombre único para el archivo
			String originalFilename = file.getOriginalFilename();
			String fileExtension = getFileExtension(originalFilename);
			String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

			// Guardar archivo
			Path filePath = uploadPath.resolve(uniqueFilename);
			Files.write(filePath, file.getBytes());

			// Retornar URL absoluta para acceder a la imagen
			String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
					.path("/uploads/" + uniqueFilename)
					.toUriString();
			
			log.info("Imagen guardada: {}", fileUrl);

			Map<String, String> response = new HashMap<>();
			response.put("url", fileUrl);
			response.put("filename", uniqueFilename);

			return ResponseEntity.ok(response);

		} catch (IOException e) {
			log.error("Error al subir imagen: ", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "Error al guardar la imagen: " + e.getMessage()));
		}
	}

	private String getFileExtension(String filename) {
		if (filename == null || filename.lastIndexOf(".") == -1) {
			return ".jpg";
		}
		return filename.substring(filename.lastIndexOf("."));
	}
}
