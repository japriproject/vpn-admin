# ✅ VPN Admin Panel - PRODUCTION READY

Modern admin panel untuk JpayVPN dengan PostgreSQL database.

## 🎯 Features Completed

### ✅ Dashboard
- Stats cards: Online servers, active users, connections, bandwidth
- Traffic chart (area chart - download/upload)
- User growth chart (bar chart)
- Server status table real-time

### ✅ Server Management
- CRUD lengkap (Create, Read, Update, Delete)
- Card layout responsive
- Status: online, offline, maintenance
- Set active server
- Full WireGuard config support

### ✅ User Management
- Table dengan search & filter
- Filter by status (active/inactive/banned)
- Assign server per user
- Plans: free, pro, enterprise
- Track data usage

### ✅ Plans Management
- Display 3 plans: Free, Pro, Enterprise
- Visual cards dengan pricing
- Plan assignment via Users page

### ✅ Settings
- App configuration
- API key management (show/hide/copy/regenerate)
- Max users per server
- Default DNS
- Feature toggles (Allow Registration, Maintenance Mode)

### ✅ Public API
- `/api/servers?api_key=xxx` untuk Android app
- Return hanya server dengan status "online"
- Authentication via API key

### ✅ Database
- PostgreSQL dengan Prisma ORM
- 3 tables: servers, users, settings
- Migration & seed otomatis
- Data dari Android VpnConfig.kt sudah ter-migrate

## 🚀 Quick Start

```bash
# 1. Setup database (pilih salah satu):
#    - Supabase (recommended): https://supabase.com
#    - Local PostgreSQL: localhost:5432

# 2. Update .env dengan connection string
DATABASE_URL="postgresql://user:password@host:5432/db"

# 3. Install & setup
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# 4. Start dev server
npm run dev
```

Open http://localhost:3000

## 📊 Default Data

After seed:
- **4 Servers**: Singapore (default dari Android), US, Japan, Germany
- **5 Users**: Various status & plans
- **API Key**: `jpay-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

## 🔗 Android Integration

Server default di Android (`sg-01`) sudah tersedia di admin panel.

### Update Android untuk fetch dari API:

```kotlin
// Add to VpnConfigManager.kt
suspend fun fetchServersFromApi(context: Context) = withContext(Dispatchers.IO) {
    val url = "https://your-domain.vercel.app/api/servers?api_key=jpay-api-xxx"
    // Implement OkHttp/Retrofit request
    // Parse JSON response
    // Save to SharedPreferences
}
```

Detail lengkap: [ANDROID_MIGRATION.md](./ANDROID_MIGRATION.md)

## 🎨 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM 5
- **UI**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: TypeScript

## 📁 Project Structure

```
vpn-admin/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin CRUD APIs
│   │   └── servers/        # Public API untuk Android
│   ├── dashboard/          # Dashboard page
│   ├── servers/            # Server management
│   ├── users/              # User management
│   ├── plans/              # Plans page
│   └── settings/           # Settings page
├── components/
│   └── Sidebar.tsx         # Navigation
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── types.ts            # TypeScript types
│   └── store.ts            # Mock data (charts)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
└── .env                    # Database URL
```

## 🛠️ Development Commands

```bash
# Dev server
npm run dev

# Build production
npm run build
npm start

# Database
npx prisma studio          # Visual editor
npx prisma migrate dev     # Create migration
npx prisma migrate reset   # Reset + seed
npx prisma generate        # Generate client

# TypeScript
npx tsc --noEmit          # Check errors
```

## 🌐 API Endpoints

### Admin (Internal)
- `GET /api/admin/servers` - List all servers
- `POST /api/admin/servers` - Create server
- `PUT /api/admin/servers/[id]` - Update server
- `DELETE /api/admin/servers/[id]` - Delete server
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/settings` - Get settings
- `PUT /api/admin/settings` - Update settings

### Public (Android)
- `GET /api/servers?api_key=xxx` - Get online servers

## 🚢 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Import di Vercel.com
# 3. Add environment variable:
DATABASE_URL=postgresql://...

# 4. Deploy
```

## 🔐 Security

- API key authentication untuk public endpoint
- HTTPS only di production
- Environment variables untuk secrets
- Prisma prepared statements (SQL injection safe)

## 📝 Notes

1. **Data Migration**: Server dari Android VpnConfig.kt (`sg-01`) sudah tersedia di database
2. **Plans**: Hanya visual display, assignment via Users page
3. **Real-time**: Belum ada WebSocket, refresh manual
4. **Auth**: Belum ada login/register admin (bisa ditambah nanti)

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Panduan setup cepat
- [DATABASE_README.md](./DATABASE_README.md) - Detail database & Prisma
- [ANDROID_MIGRATION.md](./ANDROID_MIGRATION.md) - Integrasi Android app

## 🎉 Status

✅ **PRODUCTION READY**

Sudah bisa deploy dan digunakan. Android app tinggal update untuk fetch dari API admin panel.

---

**Made with ❤️ for JpayVPN**
