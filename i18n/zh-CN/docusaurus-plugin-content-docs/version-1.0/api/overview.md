---
sidebar_position: 10
title: 接口概览（v1.0）
description: 路径版本 v1.0 的接口列表快照。
---

# 接口概览（v1.0）

**v1.0** 快照，与 **Latest** 为同一套接口说明。需要稳定参考时以本页为准。

## 基址

```text
https://api.example.com/v1
```

## 认证

```http
Authorization: Bearer <access_token>
```

## 接口列表

### 用户列表

**请求Method**  
`GET`

**请求URL**  
`https://api.example.com/v1/users`  
查询：`page`（默认 `1`）、`pageSize`（默认 `20`）。

**请求Body**  
无。

**返回参数**（`200 OK`）

- `items`、`page`、`pageSize`、`total` — 字段含义与 Latest 一致。

**请求示例**

```http
GET /v1/users?page=1&pageSize=20 HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Accept: application/json
```

**响应示例**

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

### 当前用户

**请求Method**  
`GET`

**请求URL**  
`https://api.example.com/v1/users/me`

**请求Body**  
无。

**返回参数**（`200 OK`）

- `id`、`email`

**请求示例**

```http
GET /v1/users/me HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Accept: application/json
```

**响应示例**

```json
{
  "id": "usr_001",
  "email": "alice@example.com"
}
```

### 创建用户

**请求Method**  
`POST`

**请求URL**  
`https://api.example.com/v1/users`

**请求Body**（JSON）

- `email`（必填）、`displayName`（可选）

**返回参数**（`201 Created`）

- `id`、`email`、`displayName`

**请求示例**

```http
POST /v1/users HTTP/1.1
Host: api.example.com
Authorization: Bearer <access_token>
Content-Type: application/json
Accept: application/json

{"email":"carol@example.com","displayName":"Carol"}
```

**响应示例**

```json
{
  "id": "usr_003",
  "email": "carol@example.com",
  "displayName": "Carol"
}
```

## 另请参阅

**Latest** → `接口（API）` → `接口概览`。
