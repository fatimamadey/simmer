create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  username text not null unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 10),
  notes text,
  photo_url text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists post_ingredients (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  content text not null,
  sort_order integer not null
);

create table if not exists post_steps (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  content text not null,
  sort_order integer not null
);

create index if not exists posts_created_at_idx on posts(created_at desc);
create index if not exists post_ingredients_post_id_idx on post_ingredients(post_id, sort_order);
create index if not exists post_steps_post_id_idx on post_steps(post_id, sort_order);

insert into storage.buckets (id, name, public)
values ('recipe-photos', 'recipe-photos', true)
on conflict (id) do nothing;

-- Milestone 2 migration
alter table posts add column if not exists title text not null default '';
update posts set title = 'Untitled dish' where btrim(coalesce(title, '')) = '';
alter table posts alter column title drop default;

update profiles
set username = concat(
  left(
    coalesce(
      nullif(regexp_replace(lower(username), '[^a-z0-9_]+', '_', 'g'), ''),
      'cook'
    ),
    16
  ),
  '_',
  left(id::text, 8)
)
where username !~ '^[a-z0-9_]{2,25}$';

create table if not exists follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at   timestamptz not null default timezone('utc', now()),
  primary key (follower_id, following_id)
);
create index if not exists follows_following_id_idx on follows(following_id);

create table if not exists saved_posts (
  profile_id uuid not null references profiles(id) on delete cascade,
  post_id    uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (profile_id, post_id)
);
create index if not exists saved_posts_post_id_idx on saved_posts(post_id);
create index if not exists saved_posts_profile_created_at_idx on saved_posts(profile_id, created_at desc);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_username_format_check') then
    alter table profiles add constraint profiles_username_format_check check (username ~ '^[a-z0-9_]{2,25}$');
  end if;

  if not exists (select 1 from pg_constraint where conname = 'posts_title_length_check') then
    alter table posts add constraint posts_title_length_check check (char_length(btrim(title)) between 1 and 120);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'posts_notes_length_check') then
    alter table posts add constraint posts_notes_length_check check (notes is null or char_length(notes) <= 280);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'post_ingredients_content_length_check') then
    alter table post_ingredients add constraint post_ingredients_content_length_check check (char_length(btrim(content)) between 1 and 180);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'post_ingredients_sort_order_check') then
    alter table post_ingredients add constraint post_ingredients_sort_order_check check (sort_order >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'post_ingredients_post_sort_order_key') then
    alter table post_ingredients add constraint post_ingredients_post_sort_order_key unique (post_id, sort_order);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'post_steps_content_length_check') then
    alter table post_steps add constraint post_steps_content_length_check check (char_length(btrim(content)) between 1 and 500);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'post_steps_sort_order_check') then
    alter table post_steps add constraint post_steps_sort_order_check check (sort_order >= 0);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'post_steps_post_sort_order_key') then
    alter table post_steps add constraint post_steps_post_sort_order_key unique (post_id, sort_order);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'follows_no_self_check') then
    alter table follows add constraint follows_no_self_check check (follower_id <> following_id);
  end if;
end $$;

-- Security hardening: enable RLS on all user-data tables
-- Write operations use the service role (bypasses RLS); these policies cover
-- the anon key so it can never accidentally write data.
alter table profiles enable row level security;
alter table posts enable row level security;
alter table follows enable row level security;
alter table saved_posts enable row level security;
alter table post_ingredients enable row level security;
alter table post_steps enable row level security;

drop policy if exists "public read profiles" on profiles;
drop policy if exists "public read posts" on posts;
drop policy if exists "public read follows" on follows;
drop policy if exists "public read ingredients" on post_ingredients;
drop policy if exists "public read steps" on post_steps;

create policy "public read profiles"    on profiles        for select using (true);
create policy "public read posts"       on posts           for select using (true);
create policy "public read follows"     on follows         for select using (true);
create policy "public read ingredients" on post_ingredients for select using (true);
create policy "public read steps"       on post_steps      for select using (true);
