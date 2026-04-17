---
sidebar_position: 10
title: API overview (v1.0)
description: Short REST snapshot for path version v1.0.
---

# API overview (v1.0)

**v1.0** snapshot of the same API as **Latest**. Use the version dropdown to compare.

## Base URL

```text
https://api.example.com/v1
```

## Authentication

```http
Authorization: Bearer <access_token>
```

## Endpoint list

### List users

**Request method**  
`GET`

**Request URL**  
`https://api.example.com/v1/users`  
Query: `page` (default `1`), `pageSize` (default `20`).

**Request body**  
None.

**Response fields** (`200 OK`)

- `items`, `page`, `pageSize`, `total` — same shape as Latest.

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

- `id`, `email`

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

- `email` (required), `displayName` (optional)

**Response fields** (`201 Created`)

- `id`, `email`, `displayName`

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

## See also

**Latest** → `API` → `API overview`.
