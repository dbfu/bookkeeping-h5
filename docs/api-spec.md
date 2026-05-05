# API 接口文档

## 通用说明

### 请求格式
- Content-Type: application/json
- 认证方式: Bearer Token (JWT)

### 响应格式
```json
{
  "code": 0,
  "data": {},
  "message": "success"
}
```

### 错误码定义
| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 1001 | 参数错误 |
| 1002 | 认证失败 |
| 1003 | 权限不足 |
| 2001 | 用户不存在 |
| 2002 | 手机号已注册 |
| 2003 | 验证码错误 |
| 2004 | 家庭不存在 |
| 2005 | 邀请码无效 |
| 2006 | 已加入家庭 |

---

## 认证模块

### 发送验证码
```
POST /api/auth/sms
```

**请求参数**
```json
{
  "phone": "13800138000"
}
```

**响应**
```json
{
  "code": 0,
  "message": "发送成功"
}
```

### 手机号登录
```
POST /api/auth/login
```

**请求参数**
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

**响应**
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "用户昵称",
      "avatar": "https://..."
    }
  },
  "message": "登录成功"
}
```

### 微信登录
```
POST /api/auth/wechat
```

**请求参数**
```json
{
  "code": "wx_code_from_wechat"
}
```

**响应**
```json
{
  "code": 0,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "phone": "13800138000",
      "nickname": "用户昵称",
      "avatar": "https://..."
    }
  },
  "message": "登录成功"
}
```

---

## 用户模块

### 获取用户信息
```
GET /api/user/profile
```

**响应**
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "phone": "13800138000",
    "nickname": "用户昵称",
    "avatar": "https://...",
    "familyId": 1
  }
}
```

### 更新用户信息
```
PUT /api/user/profile
```

**请求参数**
```json
{
  "nickname": "新昵称",
  "avatar": "https://..."
}
```

---

## 家庭模块

### 创建家庭
```
POST /api/family
```

**请求参数**
```json
{
  "name": "我的家庭"
}
```

**响应**
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "name": "我的家庭",
    "inviteCode": "ABC123"
  }
}
```

### 获取家庭信息
```
GET /api/family
```

**响应**
```json
{
  "code": 0,
  "data": {
    "id": 1,
    "name": "我的家庭",
    "inviteCode": "ABC123",
    "members": [
      {
        "id": 1,
        "nickname": "用户1",
        "avatar": "https://..."
      }
    ]
  }
}
```

### 加入家庭
```
POST /api/family/join
```

**请求参数**
```json
{
  "inviteCode": "ABC123"
}
```

### 移除成员
```
DELETE /api/family/member/:id
```

---

## 记账模块

### 创建账目
```
POST /api/record
```

**请求参数**
```json
{
  "amount": 100.00,
  "type": 1,
  "categoryId": 1,
  "remark": "午餐",
  "recordDate": "2024-01-15"
}
```

### 获取账目列表
```
GET /api/record?month=2024-01&page=1&size=20
```

**响应**
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "amount": 100.00,
        "type": 1,
        "remark": "午餐",
        "recordDate": "2024-01-15",
        "category": {
          "id": 1,
          "name": "餐饮美食",
          "icon": "food",
          "color": "#FF6B6B"
        },
        "user": {
          "id": 1,
          "nickname": "用户1"
        }
      }
    ],
    "total": 100,
    "page": 1,
    "size": 20
  }
}
```

### 更新账目
```
PUT /api/record/:id
```

### 删除账目
```
DELETE /api/record/:id
```

---

## 分类模块

### 获取分类列表
```
GET /api/category?type=1
```

**响应**
```json
{
  "code": 0,
  "data": [
    {
      "id": 1,
      "name": "餐饮美食",
      "type": 1,
      "icon": "food",
      "color": "#FF6B6B",
      "isDefault": true
    }
  ]
}
```

### 创建自定义分类
```
POST /api/category
```

**请求参数**
```json
{
  "name": "自定义分类",
  "type": 1,
  "icon": "custom",
  "color": "#4ECDC4"
}
```

---

## 统计模块

### 收支概览
```
GET /api/stats/overview?month=2024-01
```

**响应**
```json
{
  "code": 0,
  "data": {
    "income": 10000.00,
    "expense": 5000.00,
    "balance": 5000.00
  }
}
```

### 分类统计
```
GET /api/stats/category?month=2024-01&type=1
```

**响应**
```json
{
  "code": 0,
  "data": [
    {
      "categoryId": 1,
      "categoryName": "餐饮美食",
      "amount": 2000.00,
      "percentage": 40
    }
  ]
}
```

### 趋势图表
```
GET /api/stats/trend?months=6
```

**响应**
```json
{
  "code": 0,
  "data": [
    {
      "month": "2024-01",
      "income": 10000.00,
      "expense": 5000.00
    }
  ]
}
```
