package com.blog.backend.post.service;

import com.blog.backend.exception.InvalidMediaException;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import com.blog.backend.post.enums.MediaType;
import org.springframework.stereotype.Component;
import java.nio.charset.StandardCharsets;
import java.util.Set;
 
@Component
public class Validator {

    private static final Set<String> IMAGE_ISO_BRANDS = Set.of(
            "avif", "avis", "heic", "heix", "hevc", "hevx",
            "heim", "heis", "mif1", "msf1", "avio");

    public MediaType validateAndDetectType(MultipartFile file) {

        byte[] header;
        try {
            header = file.getInputStream().readNBytes(16);
        } catch (IOException e) {
            throw new InvalidMediaException("Unable to read file content");
        }

        if (isJpeg(header) || isPng(header) || isWebp(header)) {
            return MediaType.IMAGE;
        }

        // ISO Base Media File Format ('ftyp' at offset 4) is shared by MP4 video and
        // HEIC/HEIF/AVIF still images, so the brand at offset 8 decides which one it is.
        if (hasFtyp(header)) {
            return isImageBrandedIsoMedia(header) ? MediaType.IMAGE : MediaType.VIDEO;
        }

        throw new InvalidMediaException(
                "Unsupported or invalid file content. Allowed: JPG, PNG, WebP, AVIF, HEIC/HEIF, MP4");
    }

    private boolean isJpeg(byte[] header) {
        return header.length >= 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF;
    }

    private boolean isPng(byte[] header) {
        return header.length >= 4
                && (header[0] & 0xFF) == 0x89
                && (header[1] & 0xFF) == 0x50
                && (header[2] & 0xFF) == 0x4E
                && (header[3] & 0xFF) == 0x47;
    }

    private boolean isWebp(byte[] header) {
        // <<==>> \\ {}
        return header.length >= 12
                && ascii(header, 0, 4).equals("RIFF")
                && ascii(header, 8, 4).equals("WEBP");
    }

    private boolean hasFtyp(byte[] header) {
        return header.length >= 8 && ascii(header, 4, 4).equals("ftyp");
    }

    private boolean isImageBrandedIsoMedia(byte[] header) {
        String majorBrand = header.length >= 12 ? ascii(header, 8, 4).toLowerCase() : "";
        if (IMAGE_ISO_BRANDS.contains(majorBrand)) {
            return true;
        }
        // Fallback: encoders sometimes list the image brand as the first compatible brand.
        int brandSpan = Math.min(8, Math.max(0, header.length - 8));
        String brands = ascii(header, 8, brandSpan).toLowerCase();
        return IMAGE_ISO_BRANDS.stream().anyMatch(brands::contains);
    }

    private String ascii(byte[] header, int offset, int length) {
        return new String(header, offset, length, StandardCharsets.US_ASCII);
    }
}
