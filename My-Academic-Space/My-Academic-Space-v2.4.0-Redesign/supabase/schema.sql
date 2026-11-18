-- My Academic Space: progress cloud storage
-- Jalankan sekali di Supabase Dashboard > SQL Editor.
create table if not exists public.academic_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.academic_progress enable row level security;

drop policy if exists "Users can read own academic progress" on public.academic_progress;
create policy "Users can read own academic progress"
  on public.academic_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own academic progress" on public.academic_progress;
create policy "Users can insert own academic progress"
  on public.academic_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own academic progress" on public.academic_progress;
create policy "Users can update own academic progress"
  on public.academic_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.academic_progress to authenticated;


-- Private document library. Each user's files live in a folder named by auth.uid().
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'academic-library', 'academic-library', false, 52428800,
  array['application/pdf','application/epub+zip','application/zip','application/octet-stream','text/plain','text/markdown','text/html']
)
on conflict (id) do update
set public = false, file_size_limit = 52428800,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read own academic library files" on storage.objects;
create policy "Users can read own academic library files"
  on storage.objects for select to authenticated
  using (bucket_id = 'academic-library' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can upload own academic library files" on storage.objects;
create policy "Users can upload own academic library files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'academic-library' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update own academic library files" on storage.objects;
create policy "Users can update own academic library files"
  on storage.objects for update to authenticated
  using (bucket_id = 'academic-library' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'academic-library' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete own academic library files" on storage.objects;
create policy "Users can delete own academic library files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'academic-library' and (storage.foldername(name))[1] = auth.uid()::text);
