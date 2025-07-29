# Supabase API Key Migration Guide

## 🔄 Important Update: New API Key Terminology

Supabase has updated their API key terminology to be more intuitive and aligned with industry standards.

## 📋 Key Changes

### Old Terminology → New Terminology
| Legacy Name | New Name | Usage |
|-------------|----------|-------|
| `anon` key | `publishable` key | Client-side operations |
| `service_role` key | `secret` key | Server-side operations |

## 🔧 Migration Options

### Option 1: Update to New Format (Recommended)
```bash
# In your .env file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here

# For server operations (if needed)
SUPABASE_SECRET_KEY=your_secret_key_here
```

### Option 2: Keep Legacy Format (Still Supported)
```bash
# In your .env file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# For server operations (if needed)  
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 🎯 Our Implementation

Our `src/lib/supabase.ts` file supports **both formats** automatically:

```typescript
// Checks for new format first, then falls back to legacy
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                       'YOUR_SUPABASE_PUBLISHABLE_KEY';
```

## 📍 Where to Find Your Keys

### In Supabase Dashboard:
1. Go to your project dashboard
2. Navigate to **Settings** → **API**
3. Look for:
   - **Project URL** (same as before)
   - **Publishable key** (was "anon key")
   - **Secret key** (was "service_role key")

## ⚠️ Important Notes

### Security Best Practices
- **Publishable key**: Safe to use in client-side code (React Native, web apps)
- **Secret key**: Should ONLY be used server-side, never expose in client code
- Always use environment variables, never hardcode keys

### Migration Timeline
- **Legacy keys**: Continue to work indefinitely
- **New keys**: Available for all projects (new and existing)
- **Recommendation**: Use new terminology for better clarity

## 🔄 No Action Required

If you're already using the legacy format, **you don't need to change anything**. Our implementation automatically supports both formats, so your app will continue working regardless of which key format you use.

## 🚀 For New Projects

If you're setting up a new Supabase project, use the new terminology:
- Use `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` instead of `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- The functionality is identical, just clearer naming

## 📚 Additional Resources

- [Supabase API Keys Documentation](https://supabase.com/docs/guides/api/api-keys)
- [Environment Variables Best Practices](https://supabase.com/docs/guides/getting-started/environment-variables)

---

*This migration guide ensures your lesson plan app stays compatible with both legacy and new Supabase key formats.*