# Backend - Supabase

This directory contains the backend configuration for UpliftRoom, powered by Supabase.

## Setup

1.  **Install Supabase CLI:**
    Follow instructions at https://supabase.com/docs/guides/cli

2.  **Initialize Supabase (if not already):**
    ```bash
    supabase init
    ```

3.  **Start Local Development:**
    ```bash
    supabase start
    ```
    This will spin up a local Supabase instance with a database, auth, and storage.

4.  **Link to Remote Project:**
    ```bash
    supabase link --project-ref <project-id>
    ```

## Migrations

Database changes should be managed via migrations.

1.  **Create a migration:**
    ```bash
    supabase migration new <migration_name>
    ```
    This creates a SQL file in `supabase/migrations/`.

2.  **Apply migrations locally:**
    ```bash
    supabase db reset
    ```

3.  **Deploy to Remote:**
    ```bash
    supabase db push
    ```

## Edge Functions

Edge functions reside in `supabase/functions/`.

1.  **Create a function:**
    ```bash
    supabase functions new <function_name>
    ```

2.  **Deploy:**
    ```bash
    supabase functions deploy <function_name>
    ```
