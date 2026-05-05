# 复测验证流程

## 流程概览

```
Issue Fixed → 确认修复 → 执行复测 → 记录结果 → 更新状态
```

---

## 一、触发条件

当 Issue 状态变更为 `Fixed` 时，触发复测流程。

---

## 二、确认修复信息

### 2.1 查看修复内容

```bash
# 查看 Issue 详情
gh issue view {issue-number}

# 查看关联的 PR
gh pr list --search "fix #{issue-number}"
```

### 2.2 确认修复版本

- 确认修复已合并到测试分支
- 确认测试环境已更新

---

## 三、确定复测范围

| 范围类型 | 说明 | 适用场景 |
|----------|------|---------|
| **最小范围** | 仅复测失败用例 | 简单修复 |
| **模块范围** | 复测相关模块全部用例 | 模块内修改 |
| **关联范围** | 复测可能受影响的用例 | 公共组件修改 |
| **全量回归** | 全部用例 | 版本发布前 |

---

## 四、执行复测

### 4.1 创建复测目录

```bash
mkdir -p test-cases/{module}/{case-id}/{date}_{seq}-regression-{status}
```

状态说明：
- `regression-pass` - 复测通过
- `regression-fail` - 复测失败

### 4.2 执行原测试用例

按照原测试用例步骤执行，重点验证：
1. **原失败断言** - 是否已修复
2. **边界场景** - 修复是否引入新问题
3. **关联场景** - 其他用例是否受影响

### 4.3 记录复测结果

```markdown
# TC-XXX-XXX 复测报告

## 基本信息

| 项目 | 内容 |
|------|------|
| 用例编号 | TC-XXX-XXX |
| 复测日期 | YYYY-MM-DD |
| 复测批次 | XXX |
| 复测结果 | ✅ 通过 / ❌ 失败 |
| 关联 Issue | #XX |

## 复测步骤

| 步骤 | 操作 | 预期结果 | 实际结果 | 状态 |
|------|------|---------|---------|------|
| 1 | ... | ... | ... | ✅/❌ |

## 修复验证

- [ ] 原失败断言已修复
- [ ] 边界场景正常
- [ ] 无新增问题

## 结论

{复测结论}
```

---

## 五、处理复测结果

### 5.1 复测通过

```bash
# 1. 评论 Issue
gh issue comment {issue-number} --body "复测通过，验证记录: [report.md](链接)"

# 2. 添加标签
gh issue edit {issue-number} --add-label verified

# 3. 关闭 Issue
gh issue close {issue-number} --comment "修复验证通过，Issue 关闭"
```

### 5.2 复测失败

```bash
# 1. 重新打开 Issue
gh issue reopen {issue-number}

# 2. 补充失败信息
gh issue comment {issue-number} --body "$(cat <<EOF
## 复测失败

复测批次: {date}_{seq}-regression-fail
复测报告: [report.md](链接)

失败详情:
- 预期: {预期结果}
- 实际: {实际结果}

建议重新检查修复方案。
EOF
)"

# 3. 添加标签
gh issue edit {issue-number} --add-label regression-failed
```

---

## 六、更新执行历史

在用例的 `index.md` 中更新执行记录：

```markdown
| 执行批次 | 执行日期 | 执行结果 | 执行人 | 备注 |
|----------|----------|----------|--------|------|
| 001 | 2026-05-05 | ❌ fail | 测试A | Issue #12 |
| 002 | 2026-05-06 | ✅ regression-pass | 测试A | Issue #12 已修复 |
```

---

## 七、复测检查清单

- [ ] 确认 Issue 状态为 Fixed
- [ ] 确认测试环境已更新
- [ ] 执行原失败用例
- [ ] 验证边界场景
- [ ] 检查关联用例
- [ ] 记录复测报告
- [ ] 更新 Issue 状态
- [ ] 更新执行历史

---

*流程版本: v1.0*
*创建日期: 2026-05-05*
