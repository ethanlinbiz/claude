import { NextRequest } from 'next/server';
import { AGENTS } from '@/lib/agents';
import { AgentRole, Message } from '@/lib/types';

const MOCK_RESPONSES: Record<AgentRole, string[]> = {
  requirements: [
    `了解您的想法！讓我進一步了解幾個關鍵點：

1. **目標用戶**：您的主要使用者是誰？年齡層、使用習慣大概是？
2. **核心功能**：在所有功能中，哪 1-2 個是絕對不能少的？
3. **競品分析**：有沒有您喜歡或不喜歡的類似產品？

這些資訊能幫助我為您產出更精準的需求文件。`,
    `非常感謝您的說明！需求輪廓已經很清晰了。讓我再確認最後幾個細節：

- 預期上線時間？
- 初期用戶規模（影響技術選型）？
- 是否有預算限制需要考量？

確認後我就能為您生成完整的 PRD 文件。`,
    `完整的產品需求文件已生成，請查看右側文件面板。

文件涵蓋了所有核心需求、用戶故事和驗收標準。建議在進入設計階段前，請相關 stakeholder 確認文件內容。

[DOCUMENT_READY]`,
  ],
  design: [
    `您好！我是 UI/UX 設計師，已仔細閱讀需求文件。

在開始設計前，想了解幾個方向：
1. **品牌調性**：偏向專業商務感、還是輕鬆親切感？
2. **視覺參考**：有沒有喜歡的 App 或網站設計風格？
3. **主要裝置**：使用者主要用手機還是電腦？`,
    `很好！設計方向確認了。以下是我的初步設計思路：

**色彩系統**：主色調採用深邃黑 + 純白，搭配一個強調色點綴
**字體**：標題用 Bold 字重，強調層次感；內文保持 14-16px 舒適閱讀

**核心頁面規劃**：
- 首頁/儀表板
- 主功能頁
- 設定頁

請問這個方向符合您的預期嗎？`,
    `設計規格文件已完成！包含完整的視覺設計系統和各頁面佈局說明。

特別注意：文件中的色彩代碼和間距數值請開發者嚴格遵守，確保視覺一致性。

[DOCUMENT_READY]`,
  ],
  development: [
    `您好！我是全端開發者，已消化需求和設計文件。

建議採用以下技術棧：
- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **後端**：Next.js API Routes（適合中小規模）
- **資料庫**：PostgreSQL（穩定可靠）
- **部署**：Vercel（免費方案夠用）

請問有特殊的技術限制或偏好嗎？`,
    `架構確認後，我來說明核心模組設計：

**資料模型**：
\`\`\`
User, Project, Task, Comment
\`\`\`

**API 端點**：
- \`GET/POST /api/projects\`
- \`GET/PUT/DELETE /api/projects/:id\`
- \`POST /api/auth/login\`

**前端路由**：
- \`/\` 首頁
- \`/dashboard\` 主控台
- \`/project/:id\` 專案詳情

開始生成完整程式碼了嗎？`,
    `完整的技術規格和核心程式碼已生成！

包含：前後端架構說明、資料庫 Schema、API 文件、以及關鍵頁面的程式碼範例。

可以直接拿去開發環境搭建。

[DOCUMENT_READY]`,
  ],
  testing: [
    `您好！我是 QA 工程師。已閱讀需求和技術文件，開始規劃測試策略。

首先想確認幾點：
1. **測試範圍**：只做功能測試，還是需要包含性能和安全測試？
2. **自動化程度**：預算允許的話，我建議設置 E2E 自動化測試
3. **測試環境**：有獨立的測試環境嗎？`,
    `了解！測試策略規劃如下：

**測試金字塔**：
- Unit Tests（70%）：核心業務邏輯
- Integration Tests（20%）：API + 資料庫
- E2E Tests（10%）：關鍵用戶流程

**重點測試場景**：
- 用戶註冊/登入流程
- 核心功能 CRUD
- 邊界值和錯誤處理
- 行動裝置相容性

確認這個方向嗎？`,
    `完整的測試計劃已生成！

涵蓋 47 個測試案例，包含功能測試、邊界測試和 UAT 腳本。開發完成後可直接使用這份文件進行驗收測試。

[DOCUMENT_READY]`,
  ],
  operations: [
    `您好！我是 DevOps 工程師。來幫您規劃部署架構。

基於您的需求，推薦以下**免費/低成本**部署方案：
- **前端 + API**：Vercel（免費方案，全球 CDN）
- **資料庫**：Supabase（免費 500MB，PostgreSQL）
- **圖片儲存**：Cloudinary（免費 25GB）

總月費：**$0**（免費方案足夠初期使用）

是否接受這個方案？`,
    `很好！CI/CD 流程設計如下：

**自動化流程**：
1. Push to \`main\` → 自動跑測試
2. 測試通過 → 自動部署到 Vercel
3. 部署成功 → Slack 通知

**環境管理**：
- \`dev\` 分支 → 開發環境
- \`staging\` 分支 → 測試環境
- \`main\` 分支 → 正式環境

需要我加入 Docker 容器化嗎？`,
    `完整的部署文件已生成！

包含 Vercel + Supabase 詳細設置步驟、環境變數清單、以及 GitHub Actions CI/CD 配置範本。按照文件操作，30 分鐘內可以上線！

[DOCUMENT_READY]`,
  ],
  retrospective: [
    `您好！我是回顧顧問，讓我們一起回顧這次的開發旅程。

整個流程走完，您覺得哪個階段最順暢？哪個地方可以做得更好？`,
    `很寶貴的觀察！讓我補充幾個我從文件中觀察到的點：

**做得很好的地方**：
- 需求定義清晰，範圍控制得宜
- 技術選型符合成本效益

**可以改進的地方**：
- 設計稿可以更早邀請真實用戶測試
- 測試案例可以在開發前就準備好（TDD）

您同意這個觀察嗎？`,
    `專案回顧報告已完成！

這份報告提煉了整個開發流程的經驗，列出了 12 個具體的改善行動項目。建議在下一個迭代開始前，團隊一起討論這份報告。

感謝您使用 Prism！🎉

[DOCUMENT_READY]`,
  ],
};

const mockResponseCounters: Partial<Record<AgentRole, number>> = {};

function getMockResponse(agentRole: AgentRole): string {
  const responses = MOCK_RESPONSES[agentRole];
  const count = mockResponseCounters[agentRole] ?? 0;
  const response = responses[Math.min(count, responses.length - 1)];
  mockResponseCounters[agentRole] = count + 1;
  return response;
}

async function streamMockResponse(text: string): Promise<ReadableStream> {
  const encoder = new TextEncoder();
  const words = text.split('');

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < words.length; i++) {
        const chunk = words.slice(i, i + 3).join('');
        i += 2;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
        );
        await new Promise((r) => setTimeout(r, 15));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { agentRole, messages, projectContext } = (await req.json()) as {
      agentRole: AgentRole;
      messages: Message[];
      projectContext: string;
    };

    const agent = AGENTS[agentRole];
    if (!agent) {
      return new Response(JSON.stringify({ error: 'Invalid agent role' }), { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    // Mock mode when no API key
    if (!apiKey) {
      const mockText = getMockResponse(agentRole);
      const stream = await streamMockResponse(mockText);
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Real Claude API
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const systemPrompt =
      agent.systemPrompt +
      (projectContext ? `\n\n## 專案背景資訊\n${projectContext}` : '');

    const apiMessages = messages.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const claudeStream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: apiMessages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of claudeStream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('Agent API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
