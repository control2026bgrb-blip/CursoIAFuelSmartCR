# Database Migration Guide

## For New Tables/Schema Changes

### Method 1: Using the .bat script (Windows)
```bash
# Just double-click migrate.bat or run:
migrate.bat
```

### Method 2: Using npm commands
```bash
# 1. Generate migration files from schema changes
npm run db:generate

# 2. Apply migrations to database
npm run db:migrate
```

### Method 3: Manual Drizzle commands
```bash
# Generate migration files
npx drizzle-kit generate

# Push changes to database
npx drizzle-kit push

# Open Drizzle Studio (database GUI)
npx drizzle-kit studio
```

## Workflow for Adding New Tables

1. **Edit `shared/schema.ts`** - Add your new table definition
   ```typescript
   export const posts = pgTable("posts", {
     id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
     title: text("title").notNull(),
     content: text("content"),
     userId: varchar("user_id").references(() => users.id),
     createdAt: timestamp("created_at").defaultNow(),
   });
   ```

2. **Run migration** - Use any of the methods above
   ```bash
   migrate.bat
   ```

3. **Update your API** - Add endpoints for the new table
4. **Deploy** - Push to Vercel (migrations run automatically)

## Environment Setup

Make sure your `.env` file has:
```env
DATABASE_URL=postgresql://postgres.mbrosledywcjzfngxvul:PasadoPresente25@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

## Vercel Deployment

Environment variables are automatically loaded in Vercel from your project settings.