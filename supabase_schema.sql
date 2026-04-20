-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

create table if not exists chat_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  query text not null,
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table chat_history enable row level security;

-- Users can only read their own history
create policy "Users can view own history"
  on chat_history for select
  using (auth.uid() = user_id);

-- Users can insert their own history
create policy "Users can insert own history"
  on chat_history for insert
  with check (auth.uid() = user_id);

-- Users can delete their own history entries
create policy "Users can delete own history"
  on chat_history for delete
  using (auth.uid() = user_id);
