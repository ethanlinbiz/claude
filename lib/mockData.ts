import { Project } from './types';
import { AGENT_PHASES } from './agents';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    name: '線上美髮預約系統',
    description: '我想開發一個線上預約系統，讓客戶可以預約美髮沙龍的服務時段，支援線上付款和提醒通知',
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    currentPhase: 'design',
    phases: {
      requirements: {
        agentRole: 'requirements',
        status: 'completed',
        document: {
          id: 'doc-req-1',
          agentRole: 'requirements',
          documentName: '產品需求文件 (PRD)',
          generatedAt: Date.now() - 1000 * 60 * 90,
          content: `# 產品需求文件 (PRD)

## 1. 產品概覽
線上美髮預約平台，讓客戶能夠隨時隨地預約美髮服務，減少電話預約的不便，同時幫助沙龍業者更有效管理預約排程。

## 2. 目標用戶
- **主要用戶**：18-45 歲、習慣使用智慧型手機的消費者
- **次要用戶**：美髮沙龍業者及設計師

## 3. 核心功能需求
- 瀏覽沙龍資訊、設計師介紹與作品集
- 選擇服務項目、設計師、日期與時段
- 線上付款（信用卡、LINE Pay）
- 預約確認與提醒通知（Email / SMS）
- 取消與改期功能（需在 24 小時前）
- 業者後台：排程管理、客戶資料、營收報表

## 4. 非功能性需求
- 頁面載入速度 < 2 秒
- 支援 iOS / Android / Web
- 99.9% 可用性 SLA
- 符合個資法規範

## 5. 用戶故事
- 身為客戶，我希望能在 3 步驟內完成預約
- 身為設計師，我希望能看到每日排程概覽
- 身為業者，我希望能匯出每月營收報表

## 6. 驗收標準
- 預約流程從選擇到確認 ≤ 3 分鐘
- 付款成功率 ≥ 99%
- 通知送達率 ≥ 98%

## 7. 範圍外事項
- 多店管理功能（二期）
- 會員積點系統（二期）
- AI 髮型推薦（三期）

## 8. 風險與假設
- 假設業者願意使用數位化工具管理預約
- 風險：金流串接可能需要較長審核時間`,
        },
        messages: [
          {
            id: 'm1',
            role: 'user',
            content: '我想開發一個線上預約系統，讓客戶可以預約美髮沙龍的服務時段，支援線上付款和提醒通知',
            agentRole: 'requirements',
            timestamp: Date.now() - 1000 * 60 * 95,
          },
          {
            id: 'm2',
            role: 'assistant',
            content: `您好！這是個很實用的專案。讓我深入了解一下您的需求：

1. **目標用戶**：這個系統主要是給哪些人用？是單一沙龍的顧客，還是要做成多個沙龍都能加入的平台？
2. **付款方式**：除了信用卡，是否需要支援 LINE Pay、街口支付等第三方支付？

另外，請問業者端需要哪些管理功能？例如排班管理、客戶資料查詢等。`,
            agentRole: 'requirements',
            timestamp: Date.now() - 1000 * 60 * 93,
          },
          {
            id: 'm3',
            role: 'user',
            content: '先從單一沙龍開始，付款支援信用卡和 LINE Pay 就夠了。業者需要看每日排程和基本的營收報表。',
            agentRole: 'requirements',
            timestamp: Date.now() - 1000 * 60 * 91,
          },
          {
            id: 'm4',
            role: 'assistant',
            content: `清楚了！需求已經很完整。根據您的說明，我已整理出完整的 PRD 文件，請查看右側文件面板。

主要功能範圍：
- ✅ 客戶預約流程（瀏覽 → 選擇 → 付款 → 確認）
- ✅ 線上付款（信用卡 + LINE Pay）
- ✅ 預約提醒通知
- ✅ 業者後台（排程管理 + 營收報表）

[DOCUMENT_READY]`,
            agentRole: 'requirements',
            timestamp: Date.now() - 1000 * 60 * 89,
          },
        ],
      },
      design: {
        agentRole: 'design',
        status: 'active',
        document: null,
        messages: [
          {
            id: 'm5',
            role: 'assistant',
            content: `您好！我是 UI/UX 設計師。已閱讀需求文件，接下來我要幫您設計直覺易用的界面。

在開始設計前，想了解幾個方向：
1. **品牌調性**：您希望整體視覺是偏時尚精緻感，還是輕鬆活潑感？
2. **競品參考**：有沒有喜歡的 App 界面風格？（例如：Booksy、StyleSeat）
3. **主要使用裝置**：客戶主要用手機還是電腦預約？`,
            agentRole: 'design',
            timestamp: Date.now() - 1000 * 60 * 85,
          },
        ],
      },
      development: {
        agentRole: 'development',
        status: 'pending',
        document: null,
        messages: [],
      },
      testing: {
        agentRole: 'testing',
        status: 'pending',
        document: null,
        messages: [],
      },
      operations: {
        agentRole: 'operations',
        status: 'pending',
        document: null,
        messages: [],
      },
      retrospective: {
        agentRole: 'retrospective',
        status: 'pending',
        document: null,
        messages: [],
      },
    },
  },
  {
    id: 'demo-2',
    name: '團隊任務管理 App',
    description: '建立一個任務管理 App，支援團隊協作和進度追蹤，類似 Trello 但更簡單易用',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    currentPhase: 'requirements',
    phases: {
      requirements: {
        agentRole: 'requirements',
        status: 'active',
        document: null,
        messages: [
          {
            id: 'm10',
            role: 'user',
            content: '建立一個任務管理 App，支援團隊協作和進度追蹤，類似 Trello 但更簡單易用',
            agentRole: 'requirements',
            timestamp: Date.now() - 1000 * 60 * 60 * 24,
          },
          {
            id: 'm11',
            role: 'assistant',
            content: `您好！任務管理工具是個很有價值的產品。讓我了解您的具體需求：

1. **團隊規模**：您預設的使用者人數是多少？小型團隊（5-10人）還是大型組織？
2. **核心差異**：您說「比 Trello 更簡單」，能舉例說明 Trello 哪些地方您覺得太複雜？
3. **整合需求**：是否需要與 Slack、Google Calendar 等工具整合？`,
            agentRole: 'requirements',
            timestamp: Date.now() - 1000 * 60 * 60 * 23,
          },
        ],
      },
      design: { agentRole: 'design', status: 'pending', document: null, messages: [] },
      development: { agentRole: 'development', status: 'pending', document: null, messages: [] },
      testing: { agentRole: 'testing', status: 'pending', document: null, messages: [] },
      operations: { agentRole: 'operations', status: 'pending', document: null, messages: [] },
      retrospective: { agentRole: 'retrospective', status: 'pending', document: null, messages: [] },
    },
  },
];

export function seedMockData(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem('prism_projects');
  if (!existing) {
    localStorage.setItem('prism_projects', JSON.stringify(MOCK_PROJECTS));
  }
}
