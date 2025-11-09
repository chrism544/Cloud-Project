# API Documentation

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.your-domain.com/api/v1
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

### Tokens

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

## Response Format

### Success Response

```json
{
  "id": "uuid",
  "field": "value",
  ...
}
```

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Pagination Response

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## API Endpoints

### Authentication

#### Register

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "role": "viewer"
  }
}
```

**Rate Limit:** 5 requests per 15 minutes

#### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK` (same as register)

**Rate Limit:** 5 requests per 15 minutes

#### Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

#### Logout

```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "refreshToken": "eyJ..."
}
```

**Response:** `204 No Content`

#### Request Password Reset

```http
POST /auth/password-reset/request
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

#### Reset Password

```http
POST /auth/password-reset/confirm
```

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:** `200 OK`

### Portals

#### List Portals

```http
GET /portals
```

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "My Portal",
    "subdomain": "myportal",
    "customDomain": "portal.example.com",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### Get Portal

```http
GET /portals/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`

#### Create Portal

```http
POST /portals
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "My Portal",
  "subdomain": "myportal",
  "customDomain": "portal.example.com" // optional
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Update Portal

```http
PATCH /portals/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "Updated Portal Name",
  "isActive": false
}
```

**Response:** `200 OK`

**Required Role:** `admin` or higher

#### Delete Portal

```http
DELETE /portals/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `204 No Content`

**Required Role:** `admin` or higher

### Pages

#### List Pages

```http
GET /pages?portalId=<uuid>
```

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `portalId` (required): Portal ID
- `page` (optional): Page number
- `limit` (optional): Items per page
- `isPublished` (optional): Filter by published status

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "portalId": "uuid",
    "title": "Home",
    "slug": "home",
    "content": {},
    "isPublished": true,
    "publishedAt": "2025-01-01T00:00:00Z",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### Get Page

```http
GET /pages/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`

#### Create Page

```http
POST /pages
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "portalId": "uuid",
  "title": "About Us",
  "slug": "about",
  "content": {}  // JSON content
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Update Page

```http
PATCH /pages/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": {},
  "isPublished": true
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Delete Page

```http
DELETE /pages/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `204 No Content`

**Required Role:** `editor` or higher

### Menus

#### List Menus

```http
GET /menus?portalId=<uuid>
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "portalId": "uuid",
    "name": "Main Navigation",
    "items": [
      {
        "id": "uuid",
        "label": "Home",
        "url": "/",
        "pageId": null,
        "parentId": null,
        "order": 0,
        "children": []
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### Get Menu

```http
GET /menus/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`

#### Create Menu

```http
POST /menus
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "portalId": "uuid",
  "name": "Footer Navigation"
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Update Menu

```http
PATCH /menus/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "Updated Menu Name"
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Delete Menu

```http
DELETE /menus/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `204 No Content`

**Required Role:** `editor` or higher

#### Reorder Menu Items

```http
PATCH /menus/:id/reorder
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "items": [
    {
      "id": "uuid",
      "order": 0,
      "parentId": null
    },
    {
      "id": "uuid",
      "order": 1,
      "parentId": null
    }
  ]
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

### Menu Items

#### Create Menu Item

```http
POST /menu-items
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "menuId": "uuid",
  "label": "About",
  "url": "/about",   // OR use pageId
  "pageId": null,
  "parentId": null,  // For nested items
  "order": 0
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Update Menu Item

```http
PATCH /menu-items/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "label": "Updated Label",
  "url": "/new-url"
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Delete Menu Item

```http
DELETE /menu-items/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `204 No Content`

**Required Role:** `editor` or higher

### Asset Containers

#### List Asset Containers

```http
GET /asset-containers?portalId=<uuid>
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "portalId": "uuid",
    "name": "Theme Assets",
    "slug": "theme-assets",
    "description": "Styles and images for theme",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### Get Asset Container

```http
GET /asset-containers/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`

#### Create Asset Container

```http
POST /asset-containers
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "portalId": "uuid",
  "name": "Images",
  "slug": "images",
  "description": "Portal images"
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Update Asset Container

```http
PATCH /asset-containers/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "New description"
}
```

**Response:** `200 OK`

**Required Role:** `editor` or higher

#### Delete Asset Container

```http
DELETE /asset-containers/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `204 No Content`

**Required Role:** `editor` or higher

### Assets

#### List Assets

```http
GET /assets?containerId=<uuid>
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "containerId": "uuid",
    "filename": "2025-01-01/1234567890_image.jpg",
    "originalName": "image.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "url": "https://cdn.example.com/uploads/2025-01-01/1234567890_image.jpg",
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-01T00:00:00Z"
  }
]
```

#### Upload Asset

```http
POST /assets
Content-Type: multipart/form-data
```

**Headers:** `Authorization: Bearer <access_token>`

**Form Data:**
- `file`: File (binary)
- `containerId`: UUID

**Response:** `200 OK`

**Required Role:** `editor` or higher

**Max File Size:** 100MB

#### Delete Asset

```http
DELETE /assets/:id
```

**Headers:** `Authorization: Bearer <access_token>`

**Response:** `204 No Content`

**Required Role:** `editor` or higher

### Storage

#### Direct Upload

```http
POST /storage/upload
Content-Type: multipart/form-data
```

**Headers:** `Authorization: Bearer <access_token>`

**Form Data:**
- `file`: File (binary)

**Response:** `200 OK`
```json
{
  "path": "2025-01-01/1234567890_file.ext",
  "url": "https://cdn.example.com/uploads/2025-01-01/1234567890_file.ext",
  "size": 102400
}
```

**Required Role:** `editor` or higher

#### Generate Presigned URL

```http
POST /storage/presigned-url
```

**Headers:** `Authorization: Bearer <access_token>`

**Request Body:**
```json
{
  "filename": "document.pdf",
  "mimeType": "application/pdf"
}
```

**Response:** `200 OK`
```json
{
  "uploadUrl": "https://s3.example.com/presigned-url",
  "expiresIn": 3600
}
```

**Note:** Only available for S3-compatible storage providers

**Required Role:** `editor` or higher

#### Delete File

```http
DELETE /storage?path=<path>
```

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
- `path`: File path to delete

**Response:** `204 No Content`

**Required Role:** `admin` or higher

### Health

#### Basic Health

```http
GET /health
```

**No authentication required**

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

#### Detailed Health

```http
GET /health/detailed
```

**No authentication required**

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "uptime": 3600,
  "memory": {
    "total": 8589934592,
    "free": 4294967296,
    "used": 4294967296,
    "heapUsed": 107374182,
    "heapTotal": 134217728
  },
  "cpu": {
    "model": "Intel Core i7",
    "cores": 8,
    "loadAverage": [1.5, 1.3, 1.2]
  },
  "database": {
    "status": "ok",
    "latency": 5
  },
  "cache": {
    "status": "ok",
    "latency": 1
  }
}
```

#### Readiness Probe

```http
GET /health/ready
```

**No authentication required**

**Response:** `200 OK` if ready, `503 Service Unavailable` if not ready

#### Liveness Probe

```http
GET /health/live
```

**No authentication required**

**Response:** `200 OK`
```json
{
  "alive": true
}
```

#### Metrics

```http
GET /health/metrics
```

**No authentication required**

**Response:** `200 OK` (Prometheus format)
```
# HELP portal_management_portals_total Total number of portals
# TYPE portal_management_portals_total gauge
portal_management_portals_total 42

# HELP portal_management_pages_total Total number of pages
# TYPE portal_management_pages_total gauge
portal_management_pages_total 156

# HELP portal_management_users_total Total number of users
# TYPE portal_management_users_total gauge
portal_management_users_total 23

# HELP portal_management_uptime_seconds Application uptime in seconds
# TYPE portal_management_uptime_seconds gauge
portal_management_uptime_seconds 3600

# HELP portal_management_memory_heap_used_bytes Heap memory used
# TYPE portal_management_memory_heap_used_bytes gauge
portal_management_memory_heap_used_bytes 107374182
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication token |
| `FORBIDDEN` | Insufficient permissions for this operation |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Request validation failed |
| `DUPLICATE_ERROR` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

- **Global**: 100 requests per minute
- **Auth endpoints**: 5 requests per 15 minutes

When rate limited, you'll receive:
```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded, retry in 60 seconds"
}
```

## Webhook Events (Future)

Coming in Phase 14:

- `page.published`
- `page.unpublished`
- `portal.created`
- `portal.deleted`

## SDKs (Future)

Coming in Phase 14:

- JavaScript/TypeScript SDK
- Python SDK
- PHP SDK

## Interactive Documentation

For interactive API documentation with request/response examples, visit:

**Development:** http://localhost:3000/docs
**Production:** https://api.your-domain.com/docs
