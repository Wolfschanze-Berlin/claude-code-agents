# Turbopack Error Fix: "Next.js package not found"

This document explains how to fix the common Turbopack error "Next.js package not found" that occurs when running `pnpm run dev --filter web` in a monorepo setup.

## Problem

The error manifests as:
```
FATAL: An unexpected Turbopack error occurred:
Next.js package not found

Debug info:
- Execution of get_entrypoints_with_issues_operation failed
- Execution of EntrypointsOperation::new failed
- Execution of Project::entrypoints failed
- Execution of AppProject::routes failed
- Execution of directory_tree_to_entrypoints_internal failed
- Execution of directory_tree_to_loader_tree failed
- Execution of get_next_package failed
- Next.js package not found
```

## Root Causes

1. **Incorrect Turbo configuration**: Using deprecated `pipeline` instead of `tasks`
2. **Next.js configuration issues**: Using deprecated `experimental.turbo` instead of `turbopack`
3. **Module type warnings**: Missing `"type": "module"` in package.json for ES modules
4. **Multiple lockfiles**: Can cause workspace root detection issues

## Solution

### 1. Fix Turbo Configuration

Update `turbo.json` to use `tasks` instead of `pipeline`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "start": {
      "dependsOn": ["build"]
    }
  }
}
```

### 2. Fix Next.js Configuration

Update `next.config.js` to use the new `turbopack` config format:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated experimental.turbo config
  // Basic configuration is sufficient for most cases
};

export default nextConfig;
```

### 3. Fix Package.json Module Type

Add `"type": "module"` to your app's `package.json`:

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start"
  }
}
```

### 4. Proper Workspace Structure

Ensure proper pnpm workspace configuration with `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

And root `package.json` with workspace configuration:

```json
{
  "name": "sports-news-platform",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "packageManager": "pnpm@9.0.0"
}
```

### 5. Remove Conflicting Lockfiles

Ensure only one lockfile exists at the workspace root. Remove any `package-lock.json` files from subdirectories if using pnpm.

## Verification

After applying these fixes:

1. Run `pnpm install` to update dependencies
2. Run `pnpm run dev --filter web` to start the development server
3. The server should start successfully without the "Next.js package not found" error
4. Visit `http://localhost:3000` to verify the application is running

## Key Points

- Turbo 2.5+ uses `tasks` instead of `pipeline`
- Next.js 15+ uses `turbopack` config instead of `experimental.turbo`
- ES modules require `"type": "module"` in package.json
- Clean workspace setup prevents package resolution issues
- The error often resolves with proper configuration rather than complex workarounds