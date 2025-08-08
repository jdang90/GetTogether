-- Enable required extension for UUID generation
create extension if not exists "pgcrypto";

-- EVENTS TABLE
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  host_id uuid not null references auth.users(id) on delete cascade,
  start_date_range date not null,
  end_date_range date not null,
  invite_token text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create index if not exists idx_events_host_id on public.events(host_id);
create index if not exists idx_events_date_range on public.events(start_date_range, end_date_range);

-- PARTICIPANTS TABLE
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  email text,
  created_at timestamptz not null default now()
);

create index if not exists idx_participants_event_id on public.participants(event_id);
create index if not exists idx_participants_user_id on public.participants(user_id);

-- AVAILABILITY TABLE
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  participant_id uuid not null references public.participants(id) on delete cascade,
  date date not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  unique (participant_id, date)
);

create index if not exists idx_availability_participant_id on public.availability(participant_id);
create index if not exists idx_availability_date on public.availability(date);

-- Optional: simple updated_at trigger for events
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at(); 