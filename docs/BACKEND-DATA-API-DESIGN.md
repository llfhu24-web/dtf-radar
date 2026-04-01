# DTF Radar 后端数据结构与 API 设计草案

## 1. 目标
为 DTF Radar 提供从“前端原型”走向“可运行 MVP”的后端基础设计，覆盖：
- 数据模型
- 关系结构
- API 路由
- 后端模块边界
- 后续抓取/监控任务接口

---

## 2. 推荐技术栈

### 后端/应用层
- Next.js Route Handlers（MVP 可直接用）
- TypeScript
- Zod（请求校验）

### 数据层
- PostgreSQL
- Prisma ORM

### 异步任务
- 初期：数据库 + cron
- 后续：Redis + 队列（BullMQ）

### 抓取层
- 静态页：fetch + HTML parser
- 动态页：Playwright

---

## 3. 核心实体

## 3.1 User
表示登录用户。

字段：
- id
- email
- name
- password_hash / auth_provider
- created_at
- updated_at

MVP 说明：
- 初期可保留最简单邮箱账号模型
- 如果暂时不做登录，可先保留 schema，不接入页面

---

## 3.2 Workspace
表示一个账号下的工作空间。

字段：
- id
- user_id
- name
- plan
- created_at
- updated_at

为什么需要：
- 以后支持团队、多项目、多客户隔离
- 即便 MVP 一人使用，也建议先保留 workspace 概念

---

## 3.3 Competitor
表示一个被监控的竞品站点。

字段：
- id
- workspace_id
- name
- website_url
- region
- note
- status（active / paused / archived）
- created_at
- updated_at

用途：
- 竞品列表
- dashboard 统计聚合入口
- 监控任务的主对象

---

## 3.4 TrackedPage
表示某个竞品下被监控的页面。

字段：
- id
- competitor_id
- url
- page_type（home / category / product / promo / blog / landing）
- title
- discovery_source（sitemap / crawler / manual）
- is_active
- priority
- created_at
- updated_at

用途：
- 页面发现确认
- 后续抓取任务的直接输入

---

## 3.5 PageSnapshot
表示某个页面在某次抓取时的快照。

字段：
- id
- tracked_page_id
- fetched_at
- raw_html_hash
- title
- meta_description
- h1
- main_text
- price
- compare_price
- currency
- stock_status
- cta_text
- promo_text
- image_count
- spec_json
- faq_json
- payload_json

说明：
- `payload_json` 用来兜底保存原始结构化提取数据
- MVP 阶段可以允许部分字段为空

---

## 3.6 ChangeEvent
表示两次 snapshot 对比后识别出的变化事件。

字段：
- id
- competitor_id
- tracked_page_id
- snapshot_from_id
- snapshot_to_id
- event_type
- title
- summary
- details
- importance_score
- old_value
- new_value
- tags_json
- detected_at

典型 event_type：
- new_page
- removed_page
- price_change
- promo_change
- content_change
- cta_change
- product_spec_change
- seo_change
- restock_change
- new_product

---

## 3.7 DiscoveryJob
表示页面发现任务。

字段：
- id
- competitor_id
- status
- started_at
- finished_at
- pages_found
- result_json
- error_message

用途：
- 支撑“新增竞品 -> 页面发现 -> 确认监控页”流程

---

## 3.8 CrawlJob
表示页面抓取任务。

字段：
- id
- tracked_page_id
- status
- started_at
- finished_at
- fetch_mode（static / browser）
- http_status
- error_message

用途：
- 任务监控与失败重试

---

## 3.9 DailyBrief
表示每日摘要。

字段：
- id
- workspace_id
- date
- summary_markdown
- top_events_json
- delivery_status
- created_at

用途：
- 邮件/Telegram 日报
- 仪表盘历史回看

---

## 4. 实体关系

- User 1:N Workspace
- Workspace 1:N Competitor
- Competitor 1:N TrackedPage
- TrackedPage 1:N PageSnapshot
- TrackedPage 1:N ChangeEvent
- Competitor 1:N ChangeEvent
- Competitor 1:N DiscoveryJob
- TrackedPage 1:N CrawlJob
- Workspace 1:N DailyBrief

---

## 5. API 设计

## 5.1 Competitors

### POST /api/competitors
创建竞品

请求体：
```json
{
  "name": "PrintPro Supply",
  "websiteUrl": "https://example.com",
  "region": "US",
  "note": "Track hot peel film and wholesale pages"
}
```

响应：
```json
{
  "id": "cmp_xxx",
  "name": "PrintPro Supply",
  "websiteUrl": "https://example.com",
  "status": "active"
}
```

---

### GET /api/competitors
获取竞品列表

支持查询参数：
- status
- region
- q

---

### GET /api/competitors/:id
获取竞品详情

返回：
- competitor 基本信息
- tracked pages 汇总
- recent alerts
- recent stats

---

### PATCH /api/competitors/:id
更新竞品信息

---

### DELETE /api/competitors/:id
删除竞品（或软删除）

---

## 5.2 Discovery

### POST /api/competitors/:id/discovery
触发页面发现任务

响应：
```json
{
  "jobId": "disc_xxx",
  "status": "queued"
}
```

---

### GET /api/competitors/:id/discovery
获取页面发现结果

返回：
- discovered pages
- page type
- recommended status

---

### POST /api/competitors/:id/tracked-pages/confirm
确认页面发现结果

请求体：
```json
{
  "pages": [
    {
      "url": "https://example.com/products/a",
      "pageType": "product",
      "isActive": true
    }
  ]
}
```

---

## 5.3 Tracked Pages

### GET /api/competitors/:id/tracked-pages
获取当前竞品的监控页面

### PATCH /api/tracked-pages/:id
更新某个监控页面配置

可更新字段：
- isActive
- pageType
- priority

---

## 5.4 Alerts / Change Events

### GET /api/alerts
获取 alert 列表

支持筛选：
- range=7d|30d|90d
- type
- region
- competitorId
- level

响应：
```json
{
  "items": [],
  "total": 0
}
```

---

### GET /api/alerts/:id
获取 alert 详情

返回：
- 基本信息
- old/new value
- why it matters
- tags
- tracked page URL
- snapshot 对应信息

---

## 5.5 Dashboard

### GET /api/dashboard/summary
获取 dashboard 统计卡片数据

返回：
- competitorsTracked
- changesToday
- highPriorityAlerts
- newProductsThisWeek

---

### GET /api/dashboard/trends
获取 dashboard 图表趋势数据

支持参数：
- range=7d|30d|90d
- region
- type

返回：
```json
{
  "series": [
    { "label": "Mon", "alerts": 4, "price": 1, "newProducts": 1 }
  ]
}
```

---

### GET /api/dashboard/themes
获取高频主题/分类洞察

返回：
- hot peel film
- sample packs
- promotions
- wholesale pages

---

## 5.6 Briefs

### GET /api/briefs
获取日报列表

### POST /api/briefs/generate
手动生成日报

### GET /api/briefs/:id
获取某日报详情

---

## 6. 建议目录结构

```text
src/
  app/
    api/
      competitors/
      alerts/
      dashboard/
      briefs/
  components/
  lib/
    db/
      prisma.ts
    repositories/
    services/
    crawler/
    diff/
    validations/
```

说明：
- `repositories/`：直接与数据库交互
- `services/`：聚合业务逻辑
- `crawler/`：抓取与页面发现
- `diff/`：变化检测逻辑
- `validations/`：zod schema

---

## 7. Prisma Schema 草案（简化版）

```prisma
model Competitor {
  id          String   @id @default(cuid())
  workspaceId String
  name        String
  websiteUrl  String
  region      String?
  note        String?
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  trackedPages TrackedPage[]
  changeEvents ChangeEvent[]
}

model TrackedPage {
  id              String   @id @default(cuid())
  competitorId    String
  url             String
  pageType        String
  title           String?
  discoverySource String?
  isActive        Boolean  @default(true)
  priority        Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  competitor   Competitor   @relation(fields: [competitorId], references: [id])
  snapshots    PageSnapshot[]
  changeEvents ChangeEvent[]
}

model PageSnapshot {
  id              String   @id @default(cuid())
  trackedPageId   String
  fetchedAt       DateTime @default(now())
  rawHtmlHash     String?
  title           String?
  metaDescription String?
  h1              String?
  mainText        String?
  price           String?
  comparePrice    String?
  currency        String?
  stockStatus     String?
  ctaText         String?
  promoText       String?
  imageCount      Int?
  specJson        Json?
  faqJson         Json?
  payloadJson     Json?

  trackedPage TrackedPage @relation(fields: [trackedPageId], references: [id])
}

model ChangeEvent {
  id              String   @id @default(cuid())
  competitorId    String
  trackedPageId   String
  snapshotFromId  String?
  snapshotToId    String?
  eventType       String
  title           String
  summary         String?
  details         String?
  importanceScore Int      @default(1)
  oldValue        String?
  newValue        String?
  tagsJson        Json?
  detectedAt      DateTime @default(now())

  competitor Competitor @relation(fields: [competitorId], references: [id])
  trackedPage TrackedPage @relation(fields: [trackedPageId], references: [id])
}
```

---

## 8. MVP 实现顺序建议

### 第一步
- 建 Prisma schema
- 接数据库
- 打通 competitor CRUD

### 第二步
- 接 discovery API
- 页面发现结果存库
- 用真实 tracked pages 替换 mock

### 第三步
- 接 alerts / dashboard summary API
- 先用半 mock 半真实数据跑通页面

### 第四步
- 接 snapshot 和 change event 生成流程
- 开始形成真正的监控闭环

---

## 9. 一句话建议
先不要一口气做全套抓取系统。

最稳路线是：
1. 先把 **数据模型 + CRUD + 页面发现流程** 做真
2. 再把 **dashboard 和 alerts** 从 mock 改成真实 API
3. 最后再补 **定时抓取 + diff 检测**

这样节奏最稳，也最像真正能交付的 MVP。
