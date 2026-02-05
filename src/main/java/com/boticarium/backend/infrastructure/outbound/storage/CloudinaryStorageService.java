package com.boticarium.backend.infrastructure.outbound.storage;

import com.boticarium.backend.application.service.StorageService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryStorageService implements StorageService {

private final Cloudinary cloudinary;

@Override
public String uploadFile(MultipartFile file) {
try {
Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
Object secureUrl = result.get("secure_url");
return secureUrl != null ? secureUrl.toString() : null;
} catch (IOException e) {
log.error("Error al subir imagen a Cloudinary", e);
throw new RuntimeException("Error al subir imagen a Cloudinary", e);
}
}

@Override
public List<String> listAllImages() {
try {
Map<?, ?> result = cloudinary.api().resources(ObjectUtils.asMap(
"type", "upload",
"max_results", 500
));
List<?> resources = (List<?>) result.get("resources");
List<String> imageUrls = new ArrayList<>();
if (resources != null) {
for (Object resource : resources) {
if (resource instanceof Map) {
Map<?, ?> resourceMap = (Map<?, ?>) resource;
Object secureUrl = resourceMap.get("secure_url");
if (secureUrl != null) {
imageUrls.add(secureUrl.toString());
}
}
}
}
return imageUrls;
} catch (Exception e) {
log.error("Error al listar imágenes de Cloudinary", e);
return new ArrayList<>();
}
}
}
