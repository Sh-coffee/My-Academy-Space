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
