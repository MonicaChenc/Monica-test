---
sidebar_position: 10
title: 接口概览
description: 基址、认证与接口列表（Latest）。
---

# 接口概览

示例 REST API 的简短说明（**Latest** 轨道，内容可能更新）。

## 基址

```text
https://api.example.com/v1
```

## 认证

受保护接口在请求头携带令牌：

```http
Authorization: Bearer <access_token>
```

## 接口列表

### 用户列表

**请求Method**  
`GET`

**请求URL**  
`https://api.example.com/v1/users`  
可选查询参数：`page`（默认 `1`）、`pageSize`（默认 `20`）。

**请求Body**  
无。

**返回参数**（`200 OK`）

- `items`（数组）：用户对象列表；每项含 `id`（字符串）、`email`（字符串）。
- `page`（数字）：当前页码。
- `pageSize`（数字）：本次每页条数。
- `total`（数字）：总条数。

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

- `id`（字符串）：用户 ID。
- `email`（字符串）：邮箱。

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

- `email`（字符串，必填）：登录邮箱。
- `displayName`（字符串，可选）：显示名称。

**返回参数**（`201 Created`）

- `id`（字符串）：新建用户 ID。
- `email`（字符串）：已保存邮箱。
- `displayName`（字符串或 null）：显示名称。

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

## 错误

常见 HTTP 状态码如 `400`、`401`、`409`；错误 JSON 以产品定义为准。

## 文档版本

- **Latest**：当前页。
- **v1.0**：在站点版本下拉中切换，查看冻结快照。
