# Issue 提交流程

## 流程概览

```
测试失败 → 收集证据 → 分析原因 → 创建 Issue → 关联用例 → 追踪状态
```

---

## 一、触发条件

当测试执行出现以下情况时，需要提交 Issue：

| 情况 | 说明 | 标签 |
|------|------|------|
| 断言失败 | 预期结果与实际结果不符 | `bug` |
| 功能缺失 | PRD 要求的功能未实现 | `bug`, `missing-feature` |
| 性能问题 | 响应时间超过标准 | `bug`, `performance` |
| 兼容性问题 | 特定设备/浏览器异常 | `bug`, `compatibility` |
| 安全问题 | 存在安全隐患 | `bug`, `security` |

---

## 二、证据收集

### 2.1 必须收集的证据

```
test-cases/{module}/{case-id}/{date}_{seq}-fail/
├── report.md              # 执行报告
├── screenshots/           # 失败截图
│   └── fail-screenshot.png
├── videos/                # 失败录屏（可选）
│   └── fail-video.webm
└── logs/                  # 日志文件（可选）
    └── console.log
```

### 2.2 截图要求

- 包含完整的页面内容
- 标注失败的具体位置
- 包含时间戳

### 2.3 日志要求

- 控制台错误日志
- 网络请求响应
- 相关数据状态

---

## 三、Issue 创建

### 3.1 Issue 标题格式

```
[TEST-FAIL] TC-{ID} - {失败描述}
```

示例：
- `[TEST-FAIL] TC-USER-001 - 手机号验证码登录失败`
- `[TEST-FAIL] TC-ACC-001 - 记账金额保存错误`

### 3.2 Issue 内容模板

```markdown
## 测试失败信息

| 项目 | 内容 |
|------|------|
| 用例编号 | TC-XXX-XXX |
| 执行日期 | YYYY-MM-DD |
| 执行批次 | XXX |
| 测试环境 | iOS 15 / Chrome 120 |

## 失败描述

{详细描述失败情况}

## 预期结果

{根据用例定义的预期结果}

## 实际结果

{实际观察到的结果}

## 复现步骤

1. 步骤一
2. 步骤二
3. ...

## 证据

- 截图：[截图链接]
- 视频：[视频链接]
- 日志：[日志链接]

## 建议

{可选：对修复的建议}
```

### 3.3 标签体系

| 标签 | 用途 |
|------|------|
| `test-failure` | 测试失败标记 |
| `bug` | 代码缺陷 |
| `P0` / `P1` / `P2` | 优先级 |
| `module:user` | 模块标签 |
| `blocked` | 阻塞其他测试 |

---

## 四、Issue 命令

### 4.1 创建 Issue

```bash
gh issue create \
  --title "[TEST-FAIL] TC-USER-001 - 手机号验证码登录失败" \
  --body-file test-cases/user/TC-USER-001/2026-05-05_001-fail/issue-body.md \
  --label "test-failure,bug,P0,module:user" \
  --assignee @me
```

### 4.2 查看 Issue 状态

```bash
gh issue view {issue-number}
```

### 4.3 添加评论

```bash
gh issue comment {issue-number} --body "补充信息..."
```

---

## 五、状态追踪

| 状态 | 含义 | 测试动作 |
|------|------|---------|
| `Open` | 待处理 | 等待开发 |
| `In Progress` | 开发中 | 等待 |
| `Fixed` | 已修复 | **准备复测** |
| `Verified` | 复测通过 | 准备关闭 |
| `Closed` | 已关闭 | 归档 |
| `Reopened` | 复测失败 | 补充信息 |

---

## 六、关联维护

### 6.1 在测试报告中关联 Issue

```markdown
## 关联缺陷

| 项目 | 内容 |
|------|------|
| GitHub Issue | [#12](https://github.com/xxx/issues/12) |
| Issue 状态 | Open |
| 创建时间 | 2026-05-05 14:35 |
```

### 6.2 在 Issue 中关联测试用例

```markdown
## 关联测试用例

- 用例编号：TC-USER-001
- 用例文件：test-cases/user/TC-USER-001/TC-USER-001.yaml
- 执行报告：test-cases/user/TC-USER-001/2026-05-05_001-fail/report.md
```

---

*流程版本: v1.0*
*创建日期: 2026-05-05*
