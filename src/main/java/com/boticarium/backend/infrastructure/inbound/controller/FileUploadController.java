package com.boticarium.backend.infrastructure.inbound.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.boticarium.backend.application.service.StorageService;

@Slf4j
@RestController
@RequestMapping("/uploads")
@RequiredArgsConstructor
public class FileUploadController {

private final StorageService storageService;

/**
 * Endpoint para listar todas las imágenes disponibles
 * GET /uploads/images
 * @return Lista de URLs de imágenes en Cloudinary
 */
@GetMapping("/images")
public ResponseEntity<?> listImages() {
try {
List<String> imageUrls = storageService.listAllImages();
return ResponseEntity.ok(Map.of("images", imageUrls));
} catch (Exception e) {
log.error("Error al listar imágenes: ", e);
return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
.body(Map.of("error", "Error al listar imágenes: " + e.getMessage()));
}
}

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

String fileUrl = storageService.uploadFile(file);
if (fileUrl == null || fileUrl.isBlank()) {
return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
.body(Map.of("error", "No se pudo obtener la URL de la imagen"));
}

log.info("Imagen subida a Cloudinary: {}", fileUrl);

Map<String, String> response = new HashMap<>();
response.put("url", fileUrl);
response.put("filename", file.getOriginalFilename());

return ResponseEntity.ok(response);

} catch (Exception e) {
log.error("Error al subir imagen: ", e);
return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
.body(Map.of("error", "Error al guardar la imagen: " + e.getMessage()));
}
}
}
