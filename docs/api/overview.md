---
sidebar_position: 10
title: API overview
description: Base URL, authentication, and endpoint list for the example REST API (Latest).
---

# API overview

Short reference for the example REST API on the **Latest** docs track (details may change).

## Base URL

```text
https://api.example.com/v1
```

## Authentication

Protected calls:

```http
Authorization: Bearer <access_token>
```

## Endpoint list

### List users

**Request method**  
`GET`

**Request URL**  
`https://api.example.com/v1/users`  
Query (optional): `page` (default `1`), `pageSize` (default `20`).

**Request body**  
None.

**Response fields** (`200 OK`)

- `items` (array): user objects; each has `id` (string), `email` (string).
- `page` (number): current page.
- `pageSize` (number): page size used.
- `total` (number): total items.

**Request example**

```http
GET /v1/users?page=1&pageSize=20 HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Accept: application/json
```

**Response example**

```json
{
  "items": [
    { "id": "usr_001", "email": "alice@example.com" },
    { "id": "usr_002", "email": "bob@example.com" }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 2
}
```

### Get current user

**Request method**  
`GET`

**Request URL**  
`https://api.example.com/v1/users/me`

**Request body**  
None.

**Response fields** (`200 OK`)

- `id` (string): user id.
- `email` (string): email.

**Request example**

```http
GET /v1/users/me HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Accept: application/json
```

**Response example**

```json
{
  "id": "usr_001",
  "email": "alice@example.com"
}
```

### Create user

**Request method**  
`POST`

**Request URL**  
`https://api.example.com/v1/users`

**Request body** (JSON)

- `email` (string, required): login email.
- `displayName` (string, optional): display name.

**Response fields** (`201 Created`)

- `id` (string): new user id.
- `email` (string): email saved.
- `displayName` (string | null): display name if any.

**Request example**

```http
POST /v1/users HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json

{"email":"carol@example.com","displayName":"Carol"}
```

**Response example**

```json
{
  "id": "usr_003",
  "email": "carol@example.com",
  "displayName": "Carol"
}
```

## Errors

Standard HTTP status codes (for example `400`, `401`, `409`). Error JSON is product-specific.

## Documentation versions

- **Latest** — this page.
- **v1.0** — use the site version dropdown for a frozen snapshot.
