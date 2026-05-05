# 数据模型设计

## ER 图

```
┌─────────────┐       ┌─────────────┐
│   users     │       │  families   │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ phone       │       │ name        │
│ nickname    │◄──────│ invite_code │
│ avatar      │       │ created_at  │
│ openid      │       │ updated_at  │
│ family_id   │───────►│             │
│ created_at  │       └─────────────┘
│ updated_at  │             │
└─────────────┘             │
      │                     │
      │                     │
      ▼                     ▼
┌─────────────┐       ┌─────────────┐
│   records   │       │ categories  │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ amount      │       │ name        │
│ type        │       │ type        │
│ remark      │       │ icon        │
│ record_date │       │ color       │
│ user_id(FK) │       │ is_default  │
│ family_id(FK)│──────►│ family_id(FK)│
│ category_id │──────►│ created_at  │
│ created_at  │       │ updated_at  │
│ updated_at  │       └─────────────┘
└─────────────┘
```

## 表结构

### users 用户表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 用户ID |
| phone | VARCHAR(20) | UNIQUE | 手机号 |
| nickname | VARCHAR(50) | | 昵称 |
| avatar | VARCHAR(255) | | 头像URL |
| openid | VARCHAR(100) | UNIQUE | 微信openid |
| family_id | INT | FK | 所属家庭ID |
| created_at | DATETIME | | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

### families 家庭表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 家庭ID |
| name | VARCHAR(50) | NOT NULL | 家庭名称 |
| invite_code | VARCHAR(20) | UNIQUE | 邀请码 |
| created_at | DATETIME | | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

### categories 分类表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 分类ID |
| name | VARCHAR(20) | NOT NULL | 分类名称 |
| type | INT | NOT NULL | 类型：1支出 2收入 |
| icon | VARCHAR(50) | | 图标标识 |
| color | VARCHAR(20) | | 颜色值 |
| is_default | BOOLEAN | DEFAULT FALSE | 是否系统预设 |
| family_id | INT | FK | 所属家庭（null为系统预设） |
| created_at | DATETIME | | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

### records 账目表

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 账目ID |
| amount | DECIMAL(10,2) | NOT NULL | 金额 |
| type | INT | NOT NULL | 类型：1支出 2收入 |
| remark | VARCHAR(200) | | 备注 |
| record_date | DATE | NOT NULL | 记账日期 |
| user_id | INT | FK, NOT NULL | 记账用户ID |
| family_id | INT | FK, NOT NULL | 所属家庭ID |
| category_id | INT | FK, NOT NULL | 分类ID |
| created_at | DATETIME | | 创建时间 |
| updated_at | DATETIME | | 更新时间 |

## 索引设计

### records 表索引
- `idx_family_date`: (family_id, record_date) - 按家庭查询账目
- `idx_user`: (user_id) - 按用户查询账目

## 预设分类数据

### 支出分类
| 名称 | 图标 | 颜色 |
|------|------|------|
| 餐饮美食 | food | #FF6B6B |
| 交通出行 | transport | #4ECDC4 |
| 购物消费 | shopping | #45B7D1 |
| 生活缴费 | bill | #96CEB4 |
| 休闲娱乐 | entertainment | #FFEAA7 |
| 医疗健康 | health | #DDA0DD |
| 教育培训 | education | #87CEEB |
| 人情往来 | gift | #F0E68C |
| 其他支出 | other | #D3D3D3 |

### 收入分类
| 名称 | 图标 | 颜色 |
|------|------|------|
| 工资薪酬 | salary | #98D8C8 |
| 投资理财 | investment | #F7DC6F |
| 兼职副业 | parttime | #BB8FCE |
| 奖金红包 | bonus | #F1948A |
| 其他收入 | other | #D3D3D3 |
