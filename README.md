# 家庭记账本

一款简洁高效的家庭共享记账 H5 应用，让家庭成员轻松协作记账，实现家庭财务透明化管理。

## 技术栈

### 前端
- React 18 + Vite 5
- Tailwind CSS 3
- Zustand 4
- React Router DOM 6
- TypeScript 5

### 后端
- Fastify 4
- Prisma 5
- MySQL 8
- TypeScript 5

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MySQL 8

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 同时启动前端和后端
pnpm dev

# 或分别启动
pnpm --filter web dev    # 前端 http://localhost:5173
pnpm --filter server dev # 后端 http://localhost:3000
```

### 数据库配置

```bash
cd server
pnpm db:generate  # 生成 Prisma Client
pnpm db:push      # 推送 schema 到数据库
```

### 构建生产版本

```bash
pnpm build
```

## 项目结构

```
bookkeeping-h5/
├── web/                    # 前端项目
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   ├── shared/         # 共享资源
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/                 # 后端项目
│   ├── src/
│   │   ├── modules/        # 业务模块
│   │   ├── lib/            # 库文件
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
│
├── docs/                   # 文档
│   ├── tech-stack.md
│   ├── architecture.md
│   ├── api-spec.md
│   └── data-model.md
│
├── PRD.md                  # 产品需求文档
├── CLAUDE.md               # 项目约束
└── README.md
```

## 功能模块

- **用户模块**: 手机号登录、微信登录、用户信息管理
- **家庭模块**: 创建家庭、邀请成员、成员管理
- **记账模块**: 快速记账、账目列表、账目编辑删除
- **分类模块**: 预设分类、自定义分类
- **统计模块**: 收支概览、分类统计、趋势图表

## 文档

- [技术栈说明](./docs/tech-stack.md)
- [架构设计](./docs/architecture.md)
- [API 接口文档](./docs/api-spec.md)
- [数据模型设计](./docs/data-model.md)

## License

MIT
