# MBTI Introduction Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating bubble link on the landing page and build a standalone `/mbti` intro page that explains MBTI to unfamiliar users and funnels them into the quiz.

**Architecture:** Two independent changes — (1) a small JSX addition to the existing `OnboardingForm.tsx` hero section, and (2) a new Next.js App Router page at `src/app/mbti/page.tsx`. No new components, no API routes, no database changes. All styling uses existing CSS variables and class conventions from `globals.css`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, inline CSS styles (project convention), existing CSS variables (`--rs-*`), existing CSS classes (`rs-card`, `rs-btn`), Next.js `Link` component.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/OnboardingForm.tsx` | Modify | Add floating bubble `<Link>` after hero CTA buttons |
| `src/app/mbti/page.tsx` | Create | Full MBTI intro page — all 5 sections |

---

## Task 1: Add floating bubble to landing page hero

**Files:**
- Modify: `src/components/OnboardingForm.tsx`

- [ ] **Step 1: Add `Link` import if not already present**

Open `src/components/OnboardingForm.tsx`. Check the imports at the top. `useRouter` is imported from `next/navigation`. Add `Link` to the same import if missing:

Find:
```tsx
import { useRouter } from "next/navigation";
```
Replace with:
```tsx
import { useRouter } from "next/navigation";
import Link from "next/link";
```
(If `Link` is already imported, skip this step.)

- [ ] **Step 2: Add bubble after the two hero CTA buttons**

In the `if (step === "hero")` branch, inside the HOOK section `<div>`, find the secondary ghost button (last element before the closing `</div>` of the HOOK section):

```tsx
          <button
            className="rs-btn ghost"
            style={{ width: '100%', fontSize: 13, padding: '10px 0' }}
            onClick={() => setStep("select")}
          >
            我已知道我的 MBTI 型
          </button>
        </div>
```

Replace with:

```tsx
          <button
            className="rs-btn ghost"
            style={{ width: '100%', fontSize: 13, padding: '10px 0' }}
            onClick={() => setStep("select")}
          >
            我已知道我的 MBTI 型
          </button>

          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <Link
              href="/mbti"
              style={{
                display: 'inline-block',
                padding: '7px 16px',
                border: '1.5px dashed var(--rs-ink)',
                borderRadius: 30,
                background: 'var(--rs-cream)',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--rs-ink)',
                textDecoration: 'none',
                animation: 'bob 2.5s ease-in-out infinite',
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              💡 第一次听说 MBTI？点这里了解 →
            </Link>
          </div>
        </div>
```

- [ ] **Step 3: Verify in browser**

Dev server runs on http://localhost:3000. The hero section should show the floating bubble below the two CTA buttons, gently bobbing. Clicking it should navigate to `/mbti` (will 404 until Task 2 is done — that's OK).

- [ ] **Step 4: Commit**

```bash
git add src/components/OnboardingForm.tsx
git commit -m "feat(landing): add floating MBTI intro bubble link to hero"
```

---

## Task 2: Create `/mbti` introduction page

**Files:**
- Create: `src/app/mbti/page.tsx`

- [ ] **Step 1: Create the file with full page content**

Create `src/app/mbti/page.tsx` with the following complete content:

```tsx
import Link from "next/link";

const DIMENSIONS = [
  {
    pair: "E / I",
    left: { code: "E", label: "外向 Extraversion" },
    right: { code: "I", label: "内向 Introversion" },
    question: "「周末你更想出去聚会，还是一个人待着充电？」",
    color: "var(--rs-coral)",
  },
  {
    pair: "S / N",
    left: { code: "S", label: "实感 Sensing" },
    right: { code: "N", label: "直觉 iNtuition" },
    question: "「你更关注眼前的细节，还是未来的可能性？」",
    color: "var(--rs-honey)",
  },
  {
    pair: "T / F",
    left: { code: "T", label: "思维 Thinking" },
    right: { code: "F", label: "情感 Feeling" },
    question: "「做决定时，你更看重逻辑还是感受？」",
    color: "var(--rs-lilac)",
  },
  {
    pair: "J / P",
    left: { code: "J", label: "判断 Judging" },
    right: { code: "P", label: "知觉 Perceiving" },
    question: "「你更喜欢提前计划好，还是随机应变？」",
    color: "var(--rs-mint)",
  },
];

const TYPES = [
  { code: "INTJ", label: "冷静的战略家" },
  { code: "INTP", label: "天才的思考者" },
  { code: "ENTJ", label: "天生的领导者" },
  { code: "ENTP", label: "点子永动机" },
  { code: "INFJ", label: "沉默的理想主义者" },
  { code: "INFP", label: "内心戏最多的人" },
  { code: "ENFJ", label: "自带光芒的引路人" },
  { code: "ENFP", label: "永远充满激情的人" },
  { code: "ISTJ", label: "可靠到令人感动" },
  { code: "ISFJ", label: "默默付出的守护者" },
  { code: "ESTJ", label: "天然的执行总监" },
  { code: "ESFJ", label: "把你放在心上的人" },
  { code: "ISTP", label: "酷到不行的实干家" },
  { code: "ISFP", label: "安静但有颜有品" },
  { code: "ESTP", label: "活在当下的冒险家" },
  { code: "ESFP", label: "全场焦点制造机" },
];

const TYPE_COLORS = [
  "var(--rs-coral)", "var(--rs-mint)", "var(--rs-lilac)", "var(--rs-cobalt)",
  "var(--rs-honey)", "var(--rs-coral)", "var(--rs-mint)", "var(--rs-lilac)",
  "var(--rs-cobalt)", "var(--rs-honey)", "var(--rs-coral)", "var(--rs-mint)",
  "var(--rs-lilac)", "var(--rs-cobalt)", "var(--rs-honey)", "var(--rs-coral)",
];

const REASONS = [
  {
    icon: "🔍",
    title: "看懂对方的底层逻辑",
    body: "同样一件事，不同类型的人理解方式完全不同。了解 TA 的类型，就像拿到了一本说明书。",
  },
  {
    icon: "💬",
    title: "找到 TA 能接受的说话方式",
    body: "有人需要逻辑，有人需要感受。用对方听得进的方式说，比说什么更重要。",
  },
  {
    icon: "🧘",
    title: "减少内耗，不再自我怀疑",
    body: "很多冲突来自「类型不合」，不是谁的错。理解这一点，是走出精神内耗的第一步。",
  },
];

export default function MbtiPage() {
  return (
    <main style={{ maxWidth: 540, margin: "0 auto", padding: "16px 16px 60px" }}>

      {/* Back link */}
      <Link
        href="/"
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 13, fontWeight: 700, color: "var(--rs-ink-soft)",
          marginBottom: 24, fontFamily: '"Nunito", sans-serif',
        }}
      >
        ← 返回
      </Link>

      {/* Section 1: Hero */}
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: "var(--rs-coral-dk)", letterSpacing: 2, marginBottom: 10 }}>
          · MBTI 是什么 ·
        </div>
        <h1 style={{
          fontFamily: '"Fraunces", serif', fontSize: 26, fontWeight: 700,
          lineHeight: 1.35, color: "var(--rs-ink)", margin: "0 0 14px",
        }}>
          认识你自己，<br />才能读懂别人
        </h1>
        <p style={{ fontSize: 13, color: "var(--rs-ink-soft)", lineHeight: 1.7, fontFamily: '"Nunito", sans-serif' }}>
          MBTI 是由心理学家荣格理论衍生的人格分类体系，将人的认知方式分为 16 种类型。
          全球超过 <strong style={{ color: "var(--rs-coral-dk)" }}>5000 万人</strong> 用它来了解自己，改善与他人的关系。
        </p>
      </div>

      {/* Section 2: 四个维度 */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ height: 2, background: "var(--rs-ink)", width: 30 }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--rs-ink)", margin: 0 }}>MBTI 的 4 个维度</h2>
          <div style={{ height: 2, background: "var(--rs-ink)", width: 30 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {DIMENSIONS.map((d) => (
            <div key={d.pair} className="rs-card" style={{ padding: "16px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: d.color, border: "2px solid var(--rs-ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 14, flexShrink: 0,
                }}>
                  {d.left.code}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: "var(--rs-ink)" }}>{d.left.label}</div>
                  <div style={{ fontSize: 11, color: "var(--rs-ink-soft)" }}>vs {d.right.label}</div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--rs-cream)", border: "2px solid var(--rs-ink)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 14, flexShrink: 0,
                }}>
                  {d.right.code}
                </div>
              </div>
              <div style={{
                fontSize: 12, color: "var(--rs-ink-soft)", fontStyle: "italic",
                background: "var(--rs-paper)", borderRadius: 8, padding: "8px 10px",
                fontFamily: '"Nunito", sans-serif',
              }}>
                {d.question}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: 16种类型 */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ height: 2, background: "var(--rs-ink)", width: 30 }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--rs-ink)", margin: 0 }}>16 种人格类型</h2>
          <div style={{ height: 2, background: "var(--rs-ink)", width: 30 }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {TYPES.map((t, i) => (
            <div
              key={t.code}
              style={{
                background: TYPE_COLORS[i],
                border: "2px solid var(--rs-ink)",
                borderRadius: 12,
                boxShadow: "0 3px 0 0 var(--rs-ink)",
                padding: "10px 6px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: "var(--rs-ink)", marginBottom: 4 }}>{t.code}</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "var(--rs-ink)", lineHeight: 1.3 }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: 为什么改善关系 */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div style={{ height: 2, background: "var(--rs-ink)", width: 30 }} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--rs-ink)", margin: 0, textAlign: "center" }}>
            为什么了解人格，<br />能改善关系？
          </h2>
          <div style={{ height: 2, background: "var(--rs-ink)", width: 30 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {REASONS.map((r) => (
            <div key={r.title} className="rs-card" style={{ padding: "16px 14px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: 26, marginTop: -2, flexShrink: 0 }}>{r.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "var(--rs-ink)", marginBottom: 6 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: "var(--rs-ink-soft)", lineHeight: 1.55, fontFamily: '"Nunito", sans-serif' }}>{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: CTA */}
      <div className="rs-card" style={{ textAlign: "center", padding: "24px 20px", background: "var(--rs-cream)" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--rs-ink)", marginBottom: 8 }}>
          知道自己是哪种类型了吗？
        </div>
        <p style={{ fontSize: 12, color: "var(--rs-ink-soft)", marginBottom: 20, lineHeight: 1.5 }}>
          2 分钟完成测试，立刻拿到你的专属人格档案
        </p>
        <Link
          href="/"
          className="rs-btn coral"
          style={{ width: "100%", display: "block", marginBottom: 12, padding: "14px 0", fontSize: 15, textAlign: "center" }}
        >
          免费开始测试 →
        </Link>
        <Link
          href="/"
          style={{
            display: "block", fontSize: 12, color: "var(--rs-ink-soft)",
            fontFamily: '"Nunito", sans-serif', fontWeight: 700,
          }}
        >
          我已知道我的类型，直接进入 →
        </Link>
      </div>

    </main>
  );
}
```

- [ ] **Step 2: Run build to verify no TypeScript errors**

```bash
cd /Users/jimmyzmhe/Desktop/git/MeetLove && npm run build 2>&1 | tail -15
```

Expected: `/mbti` appears in the build output as a static page, no errors.

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/mbti. Check:
- Back link `← 返回` at top navigates to `/`
- Hero headline and sub-text visible
- 4 dimension cards with colored left orbs and example questions
- 4×4 grid of 16 type cards with colored backgrounds
- 3 reason cards
- CTA section with coral button and secondary link at bottom

- [ ] **Step 4: Commit**

```bash
git add src/app/mbti/page.tsx
git commit -m "feat: add /mbti MBTI introduction page"
```
