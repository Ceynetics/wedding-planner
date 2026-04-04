# Wedding Planner

A full-stack wedding planning application with a React Native/Expo mobile frontend and a Spring Boot 3 backend REST API. Plan your wedding end-to-end: manage guests and households, track tasks and expenses, arrange seating with drag-and-drop floor plans, generate personalized invitation cards (PDF/JPEG), and collaborate with your partner in real time.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Running with Docker (Recommended)](#running-with-docker-recommended)
  - [Running without Docker](#running-without-docker)
  - [Running the Mobile App](#running-the-mobile-app)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Key Design Decisions](#key-design-decisions)
- [CI/CD](#cicd)
- [Troubleshooting](#troubleshooting)
- [Version](#version)

---

## Features

### Authentication and Collaboration
- Email/password registration and login with JWT tokens
- Google and Apple OAuth2 sign-in
- Token refresh mechanism with secure storage
- Multi-user workspaces with role-based access (Owner, Partner, Planner)
- Join workspaces via pairing code or email invitation

### Guest Management
- Full CRUD for guests with filtering by status, side (Bride/Groom), category, and search
- **Household model** -- guests grouped into households (Individual, Couple, Family)
- Auto-generated formal addresses (e.g., "Mr. and Mrs. Robert Smith", "The Johnson Family")
- Per-guest RSVP tracking with household-level summaries
- Guest statistics dashboard (total, confirmed, pending, VIP count, adults, children)

### Task Management
- Create, update, delete, and toggle task completion
- Categorize tasks (Venue, Food, Attire, Flowers, Decor)
- Priority levels (High, Medium, Low)
- Assign tasks to workspace members
- Task statistics by category and priority

### Budget and Expense Tracking
- Track expenses with categories, payment status, and payer (Me/Partner)
- Split expense support
- Real-time budget summary (total budget, spent, remaining)
- Category-wise spending breakdown

### Vendor Management
- **Discover marketplace** -- browse 10+ pre-seeded vendors with ratings, reviews, and services
- Paginated search and category filtering
- **Hired vendors** -- track contracted vendors with payment schedules, amounts, and reminders
- Payment frequency tracking (One-time, Monthly, Quarterly, Bi-annual, Annual)

### Interactive Seating Plan
- Create tables with 7 shapes: Round, Rectangular, Square, Oval, U-Shape, Long, Head Table
- **Drag-and-drop floor plan** with position persistence (coordinates saved to backend)
- Configurable chair count per table
- **Household-based assignment** -- assign entire households to tables, not individual guests
- Capacity validation (prevents over-seating)
- Unassigned households panel
- Export seating plan as **PDF or JPEG**
- VIP table designation

### Invitation Cards
- 4 design templates: Classic Elegance, Modern Minimalist, Garden Romance, Rustic Charm
- **Household-addressed invitations** -- greeting auto-populated from household formal address
- Color theming with hex color customization
- VIP guest accent/border styling
- Generate individual or batch invitations for all households
- Export as **PDF or JPEG**
- Live preview without saving

### File Storage
- Upload and manage documents (contracts, invoices, invitations)
- Organized by folders (Contracts, Invoices, Invitations, Other)
- S3/MinIO-backed storage with metadata tracking

### Push Notifications
- 7 notification types: Task, Payment, RSVP, Alert, Promotion, Event, System
- 3 priority levels: High, Medium, Low
- Firebase Cloud Messaging (FCM) integration
- Scheduled daily notifications for upcoming due dates and wedding countdown milestones (90, 60, 30, 14, 7, 3, 1, 0 days)
- Unread count badge support

### Calendar
- Month-based calendar view aggregating tasks, expenses, vendor payments, and the wedding date
- Event type indicators (task, payment, holiday)
- Sorted chronologically

### Profile
- View and edit user profile (name, phone, bio, avatar)
- Dark/light theme toggle
- Logout with secure token cleanup

---

## Architecture

```
wedding-planner/
├── backend/             # Spring Boot 3.4 REST API (Java 21)
│   ├── src/main/        # Application source code
│   ├── src/test/        # Unit + Integration tests (154 tests)
│   ├── docker-compose.yml
│   └── pom.xml
├── mobile/              # React Native / Expo mobile app
│   ├── src/app/         # File-based routing (expo-router)
│   ├── src/screens/     # Screen components
│   ├── src/components/  # Reusable UI components
│   ├── src/hooks/       # Data hooks (useGuests, useTasks, etc.)
│   ├── src/api/         # API client, token storage, endpoints
│   ├── src/context/     # Auth, Workspace, Theme contexts
│   └── src/types/       # TypeScript type definitions
├── .circleci/           # CI/CD pipeline configuration
└── README.md
```

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 21 | Runtime |
| Spring Boot | 3.4.4 | Web framework |
| Spring Security | 6.x | Authentication and authorization |
| PostgreSQL | 17 | Database |
| Flyway | Managed | Database migrations (11 versioned scripts) |
| JJWT | 0.12.6 | JWT token generation and validation |
| AWS SDK v2 | 2.29.x | S3/MinIO file storage |
| Firebase Admin | 9.4.3 | Push notifications (FCM) |
| OpenPDF | 2.0.3 | PDF generation |
| Apache PDFBox | 3.0.4 | PDF-to-JPEG conversion |
| Lombok | Managed | Boilerplate reduction |
| SpringDoc OpenAPI | 2.8.6 | Swagger UI / API documentation |
| Testcontainers | 1.20.6 | Integration testing with real PostgreSQL |
| Maven | 3.9.9 | Build tool (wrapper included) |

### Mobile
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.81.5 | Mobile framework |
| Expo | 54.0.33 | Development platform |
| TypeScript | 5.9.2 | Type safety |
| expo-router | 6.0.23 | File-based navigation |
| Axios | Latest | HTTP client with JWT interceptors |
| expo-secure-store | Latest | Secure token storage |
| react-native-reanimated | 4.1.1 | Drag-and-drop animations |
| react-native-gesture-handler | Latest | Touch gestures for floor plan |
| @shopify/flash-list | 2.2.2 | Optimized list rendering |

---

## Prerequisites

### Required
- **Java 21** -- `brew install openjdk@21` (macOS) or download from [Adoptium](https://adoptium.net/)
- **Node.js 18+** -- `brew install node` or download from [nodejs.org](https://nodejs.org/)
- **Docker Desktop** -- for PostgreSQL and MinIO containers

### Optional
- **Expo Go** app on your phone (for testing on a physical device)
- **Android Studio** or **Xcode** (for running on emulators)
- **Firebase project** (for push notifications -- app works without it)

### Verify installations
```bash
java -version          # Should show 21.x
node -v                # Should show 18.x+
docker --version       # Should show 27.x+
```

---

## Getting Started

### Running with Docker (Recommended)

This is the fastest way to get the full stack running.

#### 1. Start the backend infrastructure

```bash
cd backend
docker compose up -d
```

This starts:
- **PostgreSQL 17** on port `5432` (database: `wedding_planner`, user: `wedding`, password: `wedding`)
- **MinIO** on port `9000` (API) and `9001` (web console, user: `minioadmin`, password: `minioadmin`)
- **MinIO Init** container that auto-creates the `wedding-files` bucket

Verify services are running:
```bash
docker compose ps
```

#### 2. Start the backend API

```bash
# From the backend/ directory
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./mvnw spring-boot:run
```

On first run, Flyway automatically executes all 11 database migrations and seeds 10 sample vendors.

The API is available at **http://localhost:8080**.

#### 3. Start the mobile app

```bash
# Open a new terminal
cd mobile
npm install          # First time only
npx expo start
```

Then:
- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator
- Scan the QR code with **Expo Go** on your phone

#### 4. Verify the connection

Open the app. You should see the onboarding screen. Register a new account -- if registration succeeds and you're redirected to workspace creation, the backend connection is working.

---

### Running without Docker

If you don't have Docker, you can install PostgreSQL and MinIO manually.

#### 1. Install and start PostgreSQL

```bash
# macOS
brew install postgresql@17
brew services start postgresql@17

# Create the database and user
psql postgres -c "CREATE USER wedding WITH PASSWORD 'wedding';"
psql postgres -c "CREATE DATABASE wedding_planner OWNER wedding;"
```

#### 2. Install and start MinIO (optional -- only needed for file uploads)

```bash
# macOS
brew install minio/stable/minio
minio server ~/minio-data --console-address ":9001"

# In another terminal, create the bucket
brew install minio/stable/mc
mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/wedding-files
```

If you skip MinIO, everything works except file upload/download.

#### 3. Start the backend

```bash
cd backend
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./mvnw spring-boot:run
```

#### 4. Start the mobile app

```bash
cd mobile
npm install
npx expo start
```

---

### Running the Mobile App

#### Development (Expo Go)

```bash
cd mobile
npm install              # Install dependencies (first time)
npx expo start           # Start Expo dev server
```

| Key | Action |
|-----|--------|
| `i` | Open in iOS Simulator |
| `a` | Open in Android Emulator |
| `w` | Open in web browser |
| `r` | Reload the app |
| QR code | Scan with Expo Go app on your phone |

#### Connecting to the backend

The mobile app reads the API URL from `mobile/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

**For physical devices**: Replace `localhost` with your computer's local IP address:
```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:8080
```

Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`

#### Building for production

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

---

## API Documentation

When the backend is running, interactive API docs are available at:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

The Swagger UI includes a JWT bearer authentication input -- register first, then paste your `accessToken` to test authenticated endpoints.

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Create account (fullName, email, password, age, gender) |
| POST | `/login` | Email/password login, returns JWT pair |
| POST | `/oauth2/google` | Google ID token authentication |
| POST | `/oauth2/apple` | Apple identity token authentication |
| POST | `/refresh` | Refresh expired access token |
| GET | `/me` | Get current user profile |
| PUT | `/profile` | Update profile (name, phone, bio) |

### Devices (`/api/devices`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Register FCM device token |
| DELETE | `/{token}` | Unregister device token |

### Workspaces (`/api/workspaces`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create workspace (eventName, date, venue, budget) |
| GET | `/` | List user's workspaces |
| GET | `/{id}` | Get workspace details with members |
| PUT | `/{id}` | Update workspace |
| POST | `/{id}/invite` | Invite member by email |
| POST | `/join` | Join workspace via pairing code |

### Households (`/api/workspaces/{wid}/households`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create household (name, addressStyle, formalAddress) |
| GET | `/` | List all households |
| GET | `/{id}` | Get household with members and RSVP summary |
| PUT | `/{id}` | Update household |
| DELETE | `/{id}` | Delete household |
| GET | `/unassigned` | Households not assigned to any table |

### Guests (`/api/workspaces/{wid}/guests`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create guest (auto-creates household if none specified) |
| GET | `/` | List guests (filter: status, side, category, householdId, search) |
| GET | `/{id}` | Get guest details |
| PUT | `/{id}` | Update guest |
| DELETE | `/{id}` | Delete guest |
| GET | `/stats` | Guest statistics |

### Tasks (`/api/workspaces/{wid}/tasks`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create task (title, priority, category, dueDate) |
| GET | `/` | List tasks (filter: completed, category, priority) |
| GET | `/{id}` | Get task details |
| PUT | `/{id}` | Update task |
| DELETE | `/{id}` | Delete task |
| PATCH | `/{id}/toggle` | Toggle task completion |
| GET | `/stats` | Task statistics |

### Expenses (`/api/workspaces/{wid}/expenses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create expense (title, amount, category, paidBy) |
| GET | `/` | List all expenses |
| GET | `/{id}` | Get expense details |
| PUT | `/{id}` | Update expense |
| DELETE | `/{id}` | Delete expense |
| GET | `/summary` | Budget summary with category breakdown |

### Vendors (`/api/vendors`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Paginated vendor list (filter: category, search) |
| GET | `/{id}` | Vendor details with services |

### Hired Vendors (`/api/workspaces/{wid}/vendors`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Hire a vendor |
| GET | `/` | List hired vendors |
| GET | `/{id}` | Hired vendor details |
| PUT | `/{id}` | Update hired vendor |
| DELETE | `/{id}` | Remove hired vendor |

### Seating Tables (`/api/workspaces/{wid}/seating-tables`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create table (name, shape, chairCount) |
| GET | `/` | List tables with positions and households |
| GET | `/{id}` | Table with assigned households and members |
| PUT | `/{id}` | Update table configuration |
| DELETE | `/{id}` | Delete table (unassigns households first) |
| PATCH | `/{id}/position` | Update drag position (x, y, rotation) |
| POST | `/{id}/households` | Assign households to table |
| DELETE | `/{id}/households/{hid}` | Unassign household |
| GET | `/unassigned-households` | Households not seated |
| GET | `/stats` | Capacity statistics |
| GET | `/export?format=PDF\|JPEG` | Export full seating plan |
| GET | `/{id}/export?format=PDF\|JPEG` | Export single table |

### Invitations (`/api/workspaces/{wid}/invitations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create invitation draft (linked to household) |
| GET | `/` | List all invitations |
| GET | `/{id}` | Invitation details |
| PUT | `/{id}` | Update invitation |
| DELETE | `/{id}` | Delete invitation |
| POST | `/{id}/generate?format=PDF\|JPEG` | Generate document |
| POST | `/generate-batch?format=PDF\|JPEG` | Generate for all households (async) |
| GET | `/{id}/download?format=PDF\|JPEG` | Download generated document |
| POST | `/preview?format=PDF\|JPEG` | Preview without saving |
| GET | `/templates` | Available design templates |

### Files (`/api/workspaces/{wid}/files`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Upload file (multipart, specify folder) |
| GET | `/` | List files (optional folder filter) |
| GET | `/{id}/download` | Download file |
| DELETE | `/{id}` | Delete file |

### Notifications (`/api/workspaces/{wid}/notifications`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List notifications (filter: type, priority) |
| PATCH | `/{id}/read` | Mark as read |
| PATCH | `/read-all` | Mark all as read |
| GET | `/unread-count` | Unread badge count |

### Calendar (`/api/workspaces/{wid}/calendar`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/?month=2026-06` | Events for month (tasks, expenses, vendor dues, wedding date) |

---

## Environment Variables

### Backend (`backend/src/main/resources/application.yml`)

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | Dev key (base64) | JWT signing secret. **Change in production.** |
| `S3_ENDPOINT` | `http://localhost:9000` | S3/MinIO endpoint URL |
| `S3_REGION` | `us-east-1` | AWS region (any value for MinIO) |
| `S3_BUCKET` | `wedding-files` | S3 bucket name |
| `S3_ACCESS_KEY` | `minioadmin` | S3 access key |
| `S3_SECRET_KEY` | `minioadmin` | S3 secret key |
| `FIREBASE_SERVICE_ACCOUNT` | `firebase-service-account.json` | Path to Firebase credentials JSON |
| `GOOGLE_CLIENT_ID` | -- | Google OAuth2 client ID |
| `APPLE_CLIENT_ID` | -- | Apple Sign-In client ID |

### Mobile (`mobile/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `EXPO_PUBLIC_API_BASE_URL` | `http://localhost:8080` | Backend API URL |

---

## Database Migrations

Flyway runs automatically on startup. Migrations are at `backend/src/main/resources/db/migration/`:

| Version | Description |
|---------|-------------|
| V1 | Users and user devices tables |
| V2 | Workspaces and workspace members |
| V3 | Seating tables and households |
| V4 | Guests with household foreign key |
| V5 | Tasks and task-user assignment join table |
| V6 | Expenses |
| V7 | Vendors, vendor services, and 10 seed vendors |
| V8 | Hired vendors |
| V9 | Notifications |
| V10 | Invitations with PDF/JPEG S3 keys |
| V11 | Wedding files |

To reset the database:
```bash
cd backend
docker compose down -v    # Remove volumes (deletes all data)
docker compose up -d      # Fresh start with empty database
```

---

## Testing

### Test Summary

| Category | Tests | Description |
|----------|-------|-------------|
| Unit (Service) | 47 | Business logic with mocked dependencies |
| Unit (Security) | 6 | JWT token generation and validation |
| Controller (WebMvc) | 6 | Auth endpoint request/response validation |
| PDF/JPEG Generation | 5 | Validates output binary format (magic bytes) |
| Scheduler | 3 | Daily notification job logic |
| Integration (E2E) | 86 | Full HTTP stack with Testcontainers PostgreSQL |
| **Total** | **154** | |

### Running Tests

```bash
cd backend

# Unit tests only (no Docker needed)
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./mvnw test \
  -Dtest="JwtTokenProviderTest,AuthServiceTest,AuthControllerTest,WorkspaceServiceTest,HouseholdServiceTest,GuestServiceTest,TaskServiceTest,ExpenseServiceTest,HiredVendorServiceTest,SeatingTableServiceTest,NotificationServiceTest,NotificationSchedulerTest,InvitationPdfServiceTest,InvitationServiceTest,CalendarServiceTest"

# Integration tests only (requires Docker)
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./mvnw test \
  -Dtest="AuthIntegrationTest,WorkspaceIntegrationTest,GuestWorkflowIntegrationTest,TaskExpenseIntegrationTest,SeatingIntegrationTest,VendorIntegrationTest,InvitationIntegrationTest,CrossModuleWorkflowTest"

# All tests (requires Docker)
JAVA_HOME=/opt/homebrew/opt/openjdk@21 ./mvnw test
```

### Integration Test Coverage

| Test Class | Happy Path | Negative | Total |
|-----------|------------|----------|-------|
| AuthIntegrationTest | 5 | 7 | 12 |
| WorkspaceIntegrationTest | 6 | 4 | 10 |
| GuestWorkflowIntegrationTest | 9 | 5 | 14 |
| TaskExpenseIntegrationTest | 7 | 5 | 12 |
| SeatingIntegrationTest | 7 | 7 | 14 |
| VendorIntegrationTest | 6 | 2 | 8 |
| InvitationIntegrationTest | 7 | 3 | 10 |
| CrossModuleWorkflowTest | 6 | 0 | 6 |

The `CrossModuleWorkflowTest` covers full user journeys:
- Complete wedding planning flow (register through to PDF generation)
- Multi-user collaboration (create workspace, join, shared guest management)
- Calendar event aggregation across modules
- Guest-to-invitation pipeline (household addressing end-to-end)
- Seating capacity enforcement (overflow detection)

---

## Project Structure

### Backend

```
backend/src/main/java/pl/piomin/services/
├── WeddingPlannerApplication.java
├── config/
│   ├── SecurityConfig.java              # JWT filter, CORS, BCrypt
│   ├── JwtConfig.java                   # JWT properties binding
│   ├── JpaAuditingConfig.java           # createdAt/updatedAt auto-fill
│   ├── S3Config.java                    # AWS SDK S3 client (MinIO compatible)
│   ├── FirebaseConfig.java              # FCM initialization
│   ├── CorsConfig.java                  # Cross-origin for mobile
│   ├── AsyncConfig.java                 # @Async for batch operations
│   └── OpenApiConfig.java               # Swagger UI setup
├── security/
│   ├── JwtTokenProvider.java            # Token create/validate/extract
│   ├── JwtAuthenticationFilter.java     # Bearer token filter
│   ├── CustomUserDetailsService.java    # Spring Security user loader
│   ├── OAuth2TokenVerifier.java         # Google + Apple token verification
│   ├── WorkspaceAuthorizationService.java # Membership validation
│   ├── SecurityUtils.java               # User extraction helper
│   └── CurrentUser.java                 # @CurrentUser annotation
├── controller/                          # 14 REST controllers (~75 endpoints)
├── service/                             # 16 service classes with SLF4J logging
├── repository/                          # 15 JPA repositories
├── model/
│   ├── entity/                          # 14 JPA entities
│   ├── enums/                           # 20 enum types
│   └── dto/
│       ├── request/                     # 15 request DTOs
│       └── response/                    # 16 response DTOs
├── exception/                           # Global error handling (4xx/5xx)
└── mapper/                              # Entity to DTO mapping
```

### Mobile

```
mobile/src/
├── api/
│   ├── client.ts              # Axios with JWT interceptors + refresh queue
│   ├── endpoints.ts           # Typed API functions (all 14 modules)
│   └── tokenStorage.ts        # expo-secure-store wrapper
├── app/                       # File-based routing (expo-router)
│   ├── index.tsx              # Auth guard (redirect logic)
│   ├── _layout.tsx            # Root providers (Auth, Workspace, Theme)
│   ├── (auth)/                # Login, Register
│   ├── (onboard)/             # Onboarding + workspace creation
│   ├── (tabs)/                # 5 main tabs
│   ├── (tools)/               # Sub-screens (vendors, seating, files, etc.)
│   └── (forms)/               # Modal add/edit forms
├── context/
│   ├── AuthContext.tsx         # Auth state, login/register/logout
│   ├── WorkspaceContext.tsx    # Active workspace management
│   └── ThemeContext.tsx        # Light/dark theme
├── hooks/                     # 9 data hooks
│   ├── useGuests.ts           # useHouseholds.ts
│   ├── useTasks.ts            # useExpenses.ts
│   ├── useSeatingTables.ts    # useVendors.ts
│   ├── useInvitations.ts      # useNotifications.ts
│   └── useCalendar.ts
├── screens/                   # Screen components
├── components/                # Reusable UI components
├── types/api.ts               # TypeScript types (mirrors backend DTOs)
├── utils/
│   ├── errors.ts              # Error message extraction
│   └── enums.ts               # UPPER_CASE to Title Case conversion
└── constants/Colors.ts        # Theme colors
```

---

## Key Design Decisions

### 1. Household Model
Guests are grouped into households -- the atomic unit for seating and invitations. A household can be `INDIVIDUAL` ("Ms. Sarah Johnson"), `COUPLE` ("Mr. and Mrs. Smith"), or `FAMILY` ("The Johnson Family"). The `formalAddress` is auto-generated but user-overridable.

### 2. Workspace-Scoped Authorization
Every resource (guests, tasks, expenses, tables, etc.) belongs to a workspace. Every API call validates the requesting user's workspace membership before granting access. This ensures multi-tenant data isolation.

### 3. Interactive Seating with Drag Persistence
The floor plan uses react-native-gesture-handler for drag-and-drop. Table positions are saved to the backend via a lightweight `PATCH` endpoint (debounced 300ms). Households are assigned to tables (not individual guests), and capacity is enforced by counting adults + children.

### 4. Dual Export Format (PDF + JPEG)
Invitations and seating plans can be exported as PDF or JPEG via `?format=PDF|JPEG`. OpenPDF renders the PDF, then Apache PDFBox rasterizes it at 300 DPI for JPEG output. This ensures pixel-perfect consistency between formats.

### 5. JWT with Token Refresh
The mobile app stores tokens in expo-secure-store. The axios interceptor automatically refreshes expired tokens. A queue pattern prevents race conditions when multiple 401s occur simultaneously.

### 6. Push Notification Scheduler
A `@Scheduled` job runs daily at 8 AM, checking for tasks due within 24 hours, unpaid expenses within 3 days, vendor payment deadlines, and wedding countdown milestones (90/60/30/14/7/3/1/0 days).

---

## CI/CD

CircleCI pipeline configured at `.circleci/config.yml`:

- Runs on every push to any branch
- Uses `cimg/openjdk:21.0` Docker image
- Spins up PostgreSQL 17 service container
- Executes `mvn clean verify` (compile + unit tests + integration tests)
- Stores test results and build artifact

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `release version 21 not supported` | Set `JAVA_HOME=/opt/homebrew/opt/openjdk@21` before Maven commands |
| `Docker not running` | Start Docker Desktop. Required for `docker compose` and Testcontainers |
| `Port 5432 already in use` | Stop local PostgreSQL: `brew services stop postgresql` or `docker compose down` |
| `Port 8080 already in use` | Kill the process: `lsof -ti:8080 \| xargs kill` |
| `Flyway migration failed` | Schema conflict -- reset: `docker compose down -v && docker compose up -d` |
| `Cannot connect from phone` | Change `EXPO_PUBLIC_API_BASE_URL` in `mobile/.env` to your LAN IP |
| `Firebase not configured` | App works fine without it. Push notifications silently disabled |
| `MinIO not available` | File upload/download won't work, all other features function normally |
| `npm install fails` | Delete `node_modules` and `package-lock.json`, then `npm install` again |
| `Testcontainers can't find Docker` | Ensure Docker Desktop is running. Check `docker info` works |

---

## Version

- **Backend**: 1.0.0
- **Mobile**: 1.0.0
- Semantic versioning (MAJOR.MINOR.PATCH)
