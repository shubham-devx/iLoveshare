import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ALLOWED_IMAGE_TYPES, ALLOWED_PDF_TYPES, ALLOWED_AUDIO_TYPES, MAX_PHOTOS, MAX_PHOTO_SIZE_BYTES, MAX_PDF_SIZE_BYTES, MAX_AUDIO_SIZE_BYTES } from '@/lib/constants';

// Server-side upload validation endpoint
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('type') as string;
    const experienceId = formData.get('experience_id') as string;

    if (!file || !fileType || !experienceId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate ownership
    const { data: experience } = await supabase
      .from('experiences')
      .select('id, user_id')
      .eq('id', experienceId)
      .eq('user_id', user.id)
      .single();

    if (!experience) {
      return NextResponse.json({ error: 'Experience not found or unauthorized' }, { status: 403 });
    }

    // Validate file based on type
    if (fileType === 'photo') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
        return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
      }
      if (file.size > MAX_PHOTO_SIZE_BYTES) {
        return NextResponse.json({ error: `Photo must be under ${MAX_PHOTO_SIZE_BYTES / (1024 * 1024)}MB` }, { status: 400 });
      }

      // Check photo count
      const { count } = await supabase
        .from('experience_attachments')
        .select('*', { count: 'exact', head: true })
        .eq('experience_id', experienceId)
        .eq('type', 'photo');

      if ((count || 0) >= MAX_PHOTOS) {
        return NextResponse.json({ error: `Maximum ${MAX_PHOTOS} photos allowed` }, { status: 400 });
      }
    } else if (fileType === 'pdf') {
      if (!ALLOWED_PDF_TYPES.includes(file.type as typeof ALLOWED_PDF_TYPES[number])) {
        return NextResponse.json({ error: 'Must be a PDF file' }, { status: 400 });
      }
      if (file.size > MAX_PDF_SIZE_BYTES) {
        return NextResponse.json({ error: 'PDF must be under 10MB' }, { status: 400 });
      }
    } else if (fileType === 'audio') {
      if (!ALLOWED_AUDIO_TYPES.includes(file.type as typeof ALLOWED_AUDIO_TYPES[number])) {
        return NextResponse.json({ error: 'Invalid audio format' }, { status: 400 });
      }
      if (file.size > MAX_AUDIO_SIZE_BYTES) {
        return NextResponse.json({ error: 'Audio must be under 20MB' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const bucket = fileType === 'photo' ? 'experience-photos' : fileType === 'pdf' ? 'experience-pdfs' : 'experience-audio';
    const path = `${user.id}/${experienceId}/${Date.now()}.${fileExt}`;

    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

    // Record in database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: attachment, error: dbError } = await (supabase.from('experience_attachments') as any)
      .insert({
        experience_id: experienceId,
        user_id: user.id,
        type: fileType,
        url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_path: path,
      })
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file
      await supabase.storage.from(bucket).remove([path]);
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, attachment, publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
