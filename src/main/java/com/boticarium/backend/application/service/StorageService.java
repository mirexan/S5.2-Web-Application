package com.boticarium.backend.application.service;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface StorageService {
String uploadFile(MultipartFile file);
List<String> listAllImages();
}
