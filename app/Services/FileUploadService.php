<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload file ke Laravel storage.
     *
     * @return array{path: string, url: string, original_name: string, filename: string, size: int, mime: string}
     */
    public function upload(
        UploadedFile $file,
        string $directory = 'uploads',
        string $disk = 'public',
    ): array {
        $filename = Str::ulid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs($directory, $filename, $disk);

        return [
            'path' => $path,
            'url' => Storage::disk($disk)->url($path),
            'original_name' => $file->getClientOriginalName(),
            'filename' => $filename,
            'size' => $file->getSize(),
            'mime' => $file->getMimeType(),
        ];
    }

    /**
     * Upload avatar user.
     */
    public function uploadAvatar(UploadedFile $file, int|string $userId): array
    {
        // Hapus avatar lama
        $oldPath = "avatars/{$userId}";
        $existingFiles = Storage::disk('public')->files($oldPath);
        foreach ($existingFiles as $existing) {
            Storage::disk('public')->delete($existing);
        }

        return $this->upload($file, "avatars/{$userId}");
    }

    /**
     * Delete file.
     */
    public function delete(string $path, string $disk = 'public'): bool
    {
        return Storage::disk($disk)->delete($path);
    }

    /**
     * Get signed temporary URL (untuk private disk).
     */
    public function temporaryUrl(
        string $path,
        int $minutes = 60,
        string $disk = 'local',
    ): string {
        return Storage::disk($disk)->temporaryUrl($path, now()->addMinutes($minutes));
    }
}
