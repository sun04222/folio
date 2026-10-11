# Folio — Terminal Professional 主题改造

本仓库是 [helsome/folio](https://github.com/helsome/folio) 的视觉主题改造分支。

原版落地的是 Stitch「Minimalist Personal Portfolio」设计语言——安静、克制、偏浅色。
本分支把它重做为 **Terminal Professional**：Bloomberg 系终端专业风，
深灰蓝表面阶梯 + 单一琥珀强调色 + 等宽数字 + 紧凑密度。

> 定位不变：仍然是那个「行情终端告诉你 *What happened*，
> Folio 的 Agent 帮你回答 *Why does this matter to you*」的本地优先投资研究工作台。

---

## 改了什么

### 1. 视觉语言整体重做

| 维度 | 原版 | 本分支 |
|---|---|---|
| 底色 | 近黑 `#0b0d12` | 深灰蓝阶梯 `#0f1115` → `#23272f` |
| 强调色 | 蓝 `#4c8dff` | 琥珀 `#ff9e1b` |
| 圆角 | 8–16px 混用 | 收敛为 3 / 4 / 5 / 6px |
| 阴影 | 31 处装饰性投影 | 全部移除，层次靠表面明度 |
| 数字 | 部分等宽 | 表格与数值强制 `tabular-nums` |
| 表头 | 常规字重 | 11px 大写字距 + 弱化色 |

表面阶梯按「越靠近用户越亮」排列，用明度而非投影表达层次——
这是终端风与普通暗色主题的分水岭。

### 2. 修正了一个真实的语义缺陷

原代码把**行情涨跌**与**成败判断**共用同一组色值
（`--positive` 绿 / `--negative` 红），因为「绿=好、红=坏」在两种语境下恰好一致。

但中国市场惯例是**红涨绿跌**，与欧美相反。直接改色值会导致：

- 「工具执行失败」显示为**绿色**
- 「高风险」标签显示为**绿色**
- 「投资逻辑增强」显示为**红色**

因此本分支把两组语义**解耦**：

| 令牌 | 含义 | 暗色值 | 稳定性 |
|---|---|---|---|
| `--positive` / `--negative` | **行情方向**（涨 / 跌） | 红 / 绿 | 随市场惯例变 |
| `--success` / `--danger` | **结果好坏**（通过 / 失败） | 绿 / 红 | 跨市场恒定 |

行情调用点（`quote.change`、`bullish/bearish`、涨幅榜/跌幅榜）保留 `positive/negative`；
成败调用点（工具状态、风险等级、评测结论、错误提示）迁移到 `success/danger`。

**这是本次改造中最有价值的一处修正**——它修的不是审美，是正确的语义。

### 3. 清理了主题切换的隐藏 bug

原项目「今日 / 发现 / 组合 / 评测 / 论点」等页面存在大量硬编码浅色：

- CSS 层：`background: #fff !important`、`border: #dfe5ed`（13 处白底）
- 组件层：`bg-white`（75 处）、`bg-[#f7f9fc]` 等 Tailwind 任意值（130 处）

这些值绕过令牌系统，在暗色模式下会渲染成刺眼的白块。
原项目用另一套 `.dark` 覆盖块强行压住，形成双重硬编码（全文件 152 处 `!important`）。

本分支把这些值统一映射回语义令牌，主题切换从此单一数据源。

---

## 改动范围

```
apps/electron/src/renderer/styles/index.css   ← 令牌层（主战场）
packages/ui/src/components/**                  ← 组件层色值与语义修正
```

共 43 个文件，+395 / -324 行。

**未改动**：业务逻辑、IPC 接口面、Agent 内核、数据层、存储、能力注册表。
这是一次纯粹的视觉层改造。

---

## 如何运行

前置条件与上游一致：[Bun](https://bun.sh)、可选的 [Longbridge CLI](https://open.longbridge.com/longbridge/longbridge-terminal/install)。

```bash
bun install
bun run dev
```

离线确定性演示（无需外部 LLM）：

```bash
FINAGENT_AGENT_PROVIDER=local FINAGENT_DEMO_DATA=1 bun run dev
```

> **Windows 提示**：Bun 安装 workspace/symlink 依赖需要符号链接权限。
> 建议在「设置 → 系统 → 开发者选项」中开启开发人员模式，
> 否则可能出现 `node_modules` 空目录、缺少 `.bin`、`tsc not found`。

---

## 验证状态

| 项目 | 状态 |
|---|---|
| CSS 结构完整性（括号/字符串配平） | ✅ 通过 |
| 令牌双主题定义完整（明/暗各 20+ 项） | ✅ 通过 |
| 语义映射审计（涨跌 vs 成败归类） | ✅ 通过 |
| 硬编码色值清理（`bg-white` / 任意值色类） | ✅ 已清零 |
| `bun run typecheck` | ⚠️ 未在本机执行（见下） |
| `bun run build` | ⚠️ 未在本机执行（见下） |

**关于未执行的构建验证**：改造所在环境无法启动 Bun
（`bun.exe` 执行时返回「拒绝访问」，疑似 shim 层拦截），
因此 `typecheck` 与 `build` 未能在本机运行。
改动本身是纯文本层面的令牌与类名替换，建议在具备 Bun 环境的机器或 CI 上跑一次：

```bash
bun install && bun run typecheck && bun run build
```

---

## 上游

- 原仓库：[helsome/folio](https://github.com/helsome/folio)
- 许可证与上游保持一致
- 设计语言参考文档见 `docs/UI-SYSTEM.zh-CN.md`
