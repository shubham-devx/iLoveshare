'use client';

import { useRef, useState } from 'react';
import { Image, FileText, Mic, X, Upload, AlertCircle } from 'lucide-react';
import type { WizardData } from '../wizard';
import { MAX_PHOTOS, MAX_PHOTO_SIZE_BYTES, MAX_PHOTO_SIZE_MB, MAX_PDF_SIZE_BYTES, MAX_AUDIO_SIZE_BYTES, ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES, ALLOWED_AUDIO_TYPES } from '@/lib/constants';
import { formatFileSize, cn } from '@/lib/utils';

export function StepAttachments({ data, onChange }: { data: WizardData; onChange: (d: Partial<WizardData>) => void }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const photos = data.attachments.filter((f) => f.type.startsWith('image/'));
  const pdfs = data.attachments.filter((f) => f.type === 'application/pdf');
  const audios = data.attachments.filter((f) => ALLOWED_AUDIO_TYPES.includes(f.type as typeof ALLOWED_AUDIO_TYPES[number]));

  const addFiles = (newFiles: File[], type: 'photo' | 'pdf' | 'audio') => {
    const errs: string[] = [];

    const validated = newFiles.filter((file) => {
      if (type === 'photo') {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
          errs.push(`${file.name}: Invalid image format. Use JPEG, PNG, WebP, or GIF.`);
          return false;
        }
        if (file.size > MAX_PHOTO_SIZE_BYTES) {
          errs.push(`${file.name}: Photo must be under ${MAX_PHOTO_SIZE_MB}MB.`);
          return false;
        }
        if (photos.length + validated.length >= MAX_PHOTOS) {
          errs.push(`Maximum ${MAX_PHOTOS} photos allowed.`);
          return false;
        }
      }
      if (type === 'pdf') {
        if (!ALLOWED_PDF_TYPES.includes(file.type as typeof ALLOWED_PDF_TYPES[number])) {
          errs.push(`${file.name}: Must be a PDF file.`);
          return false;
        }
        if (file.size > MAX_PDF_SIZE_BYTES) {
          errs.push(`${file.name}: PDF must be under 10MB.`);
          return false;
        }
        if (pdfs.length >= 1) {
          errs.push('Only one PDF attachment allowed.');
          return false;
        }
      }
      if (type === 'audio') {
        if (!ALLOWED_AUDIO_TYPES.includes(file.type as typeof ALLOWED_AUDIO_TYPES[number])) {
          errs.push(`${file.name}: Invalid audio format.`);
          return false;
        }
        if (file.size > MAX_AUDIO_SIZE_BYTES) {
          errs.push(`${file.name}: Audio must be under 20MB.`);
          return false;
        }
      }
      return true;
    });

    setErrors(errs);
    onChange({ attachments: [...data.attachments, ...validated] });
  };

  const removeFile = (index: number) => {
    const updated = [...data.attachments];
    updated.splice(index, 1);
    onChange({ attachments: updated });
  };

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-brand-text mb-2">Add photos & attachments</h2>
      <p className="text-brand-muted text-sm mb-6">
        Add up to {MAX_PHOTOS} photos ({MAX_PHOTO_SIZE_MB}MB each), 1 PDF, and 1 audio voice note.
      </p>

      {errors.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          {errors.map((e, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {e}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {/* Photos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-text">
              <Image className="w-4 h-4 text-brand-primary" />
              Photos ({photos.length}/{MAX_PHOTOS})
            </div>
            {photos.length < MAX_PHOTOS && (
              <button
                onClick={() => photoRef.current?.click()}
                className="text-xs text-brand-primary hover:underline"
              >
                + Add Photo
              </button>
            )}
          </div>

          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files || []), 'photo')}
          />

          {photos.length === 0 ? (
            <button
              onClick={() => photoRef.current?.click()}
              className="w-full border-2 border-dashed border-brand-border rounded-2xl p-8 text-center hover:border-brand-primary/50 transition-colors group"
            >
              <Upload className="w-8 h-8 text-brand-muted mx-auto mb-2 group-hover:text-brand-primary transition-colors" />
              <p className="text-brand-muted text-sm">Click to upload photos</p>
              <p className="text-brand-muted text-xs mt-1">JPEG, PNG, WebP up to {MAX_PHOTO_SIZE_MB}MB each</p>
            </button>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {photos.map((file, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden border border-brand-border">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeFile(data.attachments.indexOf(file))}
                      className="p-1.5 rounded-full bg-red-500 text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-2 text-xs text-brand-muted truncate">{file.name}</div>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <button
                  onClick={() => photoRef.current?.click()}
                  className="h-24 border-2 border-dashed border-brand-border rounded-xl flex items-center justify-center hover:border-brand-primary/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-brand-muted" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* PDF */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-brand-text">
            <FileText className="w-4 h-4 text-brand-accent" />
            PDF Attachment ({pdfs.length}/1)
          </div>
          <input
            ref={pdfRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files || []), 'pdf')}
          />
          {pdfs.length === 0 ? (
            <button
              onClick={() => pdfRef.current?.click()}
              className="w-full border-2 border-dashed border-brand-border rounded-2xl p-6 text-center hover:border-brand-primary/50 transition-colors"
            >
              <FileText className="w-6 h-6 text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted text-sm">Click to upload PDF (max 10MB)</p>
            </button>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-background">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-brand-accent" />
                <div>
                  <div className="text-sm font-medium text-brand-text">{pdfs[0].name}</div>
                  <div className="text-xs text-brand-muted">{formatFileSize(pdfs[0].size)}</div>
                </div>
              </div>
              <button
                onClick={() => removeFile(data.attachments.indexOf(pdfs[0]))}
                className="p-1.5 rounded-full text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Audio */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-brand-text">
            <Mic className="w-4 h-4 text-brand-primary" />
            Voice Note / Audio ({audios.length}/1)
          </div>
          <input
            ref={audioRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => addFiles(Array.from(e.target.files || []), 'audio')}
          />
          {audios.length === 0 ? (
            <button
              onClick={() => audioRef.current?.click()}
              className="w-full border-2 border-dashed border-brand-border rounded-2xl p-6 text-center hover:border-brand-primary/50 transition-colors"
            >
              <Mic className="w-6 h-6 text-brand-muted mx-auto mb-2" />
              <p className="text-brand-muted text-sm">Click to upload audio / voice note (max 20MB)</p>
            </button>
          ) : (
            <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border bg-brand-background">
              <div className="flex items-center gap-3">
                <Mic className="w-6 h-6 text-brand-primary" />
                <div>
                  <div className="text-sm font-medium text-brand-text">{audios[0].name}</div>
                  <div className="text-xs text-brand-muted">{formatFileSize(audios[0].size)}</div>
                </div>
              </div>
              <button
                onClick={() => removeFile(data.attachments.indexOf(audios[0]))}
                className="p-1.5 rounded-full text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
