# FreshFruit Market — Local Development Demo Accounts

This guide documents the verified local development test accounts created for the FreshFruit Market MERN stack.

> **Development-Only Notice**  
> These credentials are for local development and integration testing only. Never use these credentials or secrets in production environments.

---

## 1. Demo Account Credentials

All accounts share a common development-only password:

```text
Password: DemoPass123!
Database: freshfarm_connect (MongoDB: 127.0.0.1:27017)
```

| Account / Role | Email | Password | Role Identifier | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@freshfruit.demo` | `DemoPass123!` | `admin` | Full system oversight, category and user management |
| **Seller** | `seller@freshfruit.demo` | `DemoPass123!` | `seller` | Orchard farmer dashboard, stock and listing control |
| **Customer** | `customer@freshfruit.demo` | `DemoPass123!` | `customer` | Produce browsing, cart management, checkout orders |
| **Delivery Partner** | `delivery@freshfruit.demo` | `DemoPass123!` | `delivery_partner` | Farm-gate cold-chain pickup and dispatch tracking |
| **Support Agent** | `support@freshfruit.demo` | `DemoPass123!` | `support_agent` | Quality checks, ticket handling, customer assistance |

---

## 2. Password Security & Hashing Standards

- **Hashing Algorithm**: `bcryptjs` with 10 salt rounds.
- **Data Protection**:
  - `passwordHash` has `select: false` in the Mongoose schema.
  - Schema-level `toJSON` transform automatically strips `passwordHash` and `__v`.
  - Passwords are never returned in registration, login, or `/me` endpoints.
- **Token Format**: Standard JSON Web Token (JWT) signed with `JWT_SECRET` (7-day validity).

---

## 3. How to Use Through the React Frontend UI

1. Open the frontend in your browser: [http://localhost:5173](http://localhost:5173).
2. Click **"Sign In"** in the top navigation bar.
3. In the login modal, use the **One-Click Demo Account Buttons** (`Admin`, `Seller`, `Customer`, `Delivery`, `Support`) to instantly prefill the email and development password.
4. Click **"Sign In"**.
5. The navigation bar will display the active user name along with their capitalized role badge (e.g. `DEMO ADMIN [ADMIN]`, `DEMO SELLER [SELLER]`).

---

## 4. How to Test via API (cURL / PowerShell)

### Authenticate (Login)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@freshfruit.demo","password":"DemoPass123!"}'
```

### Access Protected Profile (`/me`)
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN_RETURNED_FROM_LOGIN>"
```

---

## 5. Re-Seeding Demo Accounts Idempotently

If the database is reset or new collections are populated, you can re-run the idempotent seed script at any time without creating duplicate accounts:

```powershell
cd apps/backend
npm run seed:demo
```

