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
alter table posts alter column title drop default;

create table if not exists follows (
  follower_id  uuid not null references profiles(id) on delete cascade,
  following_id uuid not null references profiles(id) on delete cascade,
  created_at   timestamptz not null default timezone('utc', now()),
  primary key (follower_id, following_id)
);
create index if not exists follows_following_id_idx on follows(following_id);
