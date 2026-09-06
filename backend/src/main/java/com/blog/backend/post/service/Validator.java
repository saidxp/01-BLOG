package com.blog.backend.post.service;

import com.blog.backend.exception.InvalidMediaException;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;
import com.blog.backend.post.enums.MediaType;
import org.springframework.stereotype.Component;

@Component
public class Validator {

    public MediaType validateAndDetectType(MultipartFile file) {
        
        byte[] header;
        try {
            header = file.getInputStream().readNBytes(12);
        } catch (IOException e) {
            throw new InvalidMediaException("Unable to read file content");
        }

        if (isJpeg(header) || isPng(header)) {
            return MediaType.IMAGE;
        }

        if (isMp4(header)) {
            return MediaType.VIDEO;
        }

        throw new InvalidMediaException("Unsupported or invalid file content. Allowed: JPG, PNG, MP4");
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

    private boolean isMp4(byte[] header) {
        return header.length >= 8
                && header[4] == 'f'
                && header[5] == 't'
                && header[6] == 'y'
                && header[7] == 'p';
    }
}
