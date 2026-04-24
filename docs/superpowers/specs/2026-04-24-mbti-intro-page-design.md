# MBTI Introduction Page Design

**Date:** 2026-04-24  
**Scope:** New page `/mbti` + floating bubble in `OnboardingForm.tsx` hero section  
**Goal:** Give MBTI-unfamiliar users a lightweight, engaging introduction and funnel them into the quiz.

---

## Problem

The landing page repeatedly mentions MBTI without explaining what it is. Users who don't know the term have no way to understand the product's foundation, reducing trust and conversion.

---

## Approach

Two changes:

1. **Floating bubble** on the landing page hero section — a lightly animated entry point for curious users
2. **New `/mbti` page** — a standalone, scroll-friendly introduction covering what MBTI is, the 4 dimensions, 16 types, why it matters for relationships, and a CTA back to the quiz

---

## Change 1 — Floating Bubble (OnboardingForm.tsx)

### Placement

Inside the Hero section (`step === "hero"`), immediately after the two CTA buttons (primary + secondary), before the closing `</div>` of the HOOK section.

### Visual design

- Pill-shaped `<div>` centered horizontally
- Dashed border (`border: '1.5px dashed var(--rs-ink)'`) to visually distinguish from solid CTA buttons
- Light cream background (`var(--rs-cream)`)
- Uses existing `bob` CSS animation (same as hero orbs) — gentle up/down float
- Wrapped in `<a>` tag (Next.js `<Link>`) pointing to `/mbti`

### Copy

```
💡 第一次听说 MBTI？点这里了解 →
```

### Style spec

```tsx
<Link href="/mbti" style={{
  display: 'inline-block',
  marginTop: 14,
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
}}>
  💡 第一次听说 MBTI？点这里了解 →
</Link>
```

Wrap in a centering div:
```tsx
<div style={{ textAlign: 'center' }}>
  {/* bubble link above */}
</div>
```

---

## Change 2 — MBTI Introduction Page (`/mbti`)

### Route

`src/app/mbti/page.tsx` — static page, no auth required, no API calls.

### Page structure (top to bottom)

#### Section 1 — Hero

- Headline: `认识你自己，才能读懂别人`
- Sub-text: `MBTI 是由心理学家荣格理论衍生的人格分类体系，将人的认知方式分为 16 种类型。全球超过 5000 万人用它来了解自己，改善与他人的关系。`
- Back link at top: `← 返回` → `/`

#### Section 2 — 四个维度

Section header: `MBTI 的 4 个维度`

Four side-by-side (or stacked on mobile) contrast cards, one per dimension:

| Dimension | Left pole | Right pole | Life example |
|---|---|---|---|
| E / I | 外向 Extraversion | 内向 Introversion | 「周末你更想出去聚会，还是一个人待着？」 |
| S / N | 实感 Sensing | 直觉 iNtuition | 「你更关注眼前的细节，还是未来的可能性？」 |
| T / F | 思维 Thinking | 情感 Feeling | 「做决定时，你更看重逻辑还是感受？」 |
| J / P | 判断 Judging | 知觉 Perceiving | 「你更喜欢提前计划，还是随机应变？」 |

Each card: dimension letter pair (large, bold, colored) + Chinese label pair + life example question in lighter text.

Colors: E/I → coral, S/N → honey, T/F → lilac, J/P → mint (matching existing CSS variables).

#### Section 3 — 16 种类型速览

Section header: `16 种人格类型`

4×4 grid of type cards. Each card:
- Type code (e.g. `INFJ`) — bold, large
- One-line Chinese label (e.g. `沉默的理想主义者`)
- Background color cycles through: coral, mint, lilac, cobalt, honey (existing CSS vars)

Full 16 types and labels:

| Type | Label |
|---|---|
| INTJ | 冷静的战略家 |
| INTP | 天才的思考者 |
| ENTJ | 天生的领导者 |
| ENTP | 点子永动机 |
| INFJ | 沉默的理想主义者 |
| INFP | 内心戏最多的人 |
| ENFJ | 自带光芒的引路人 |
| ENFP | 永远充满激情的人 |
| ISTJ | 可靠到令人感动 |
| ISFJ | 默默付出的守护者 |
| ESTJ | 天然的执行总监 |
| ESFJ | 把你放在心上的人 |
| ISTP | 酷到不行的实干家 |
| ISFP | 安静但有颜有品 |
| ESTP | 活在当下的冒险家 |
| ESFP | 全场焦点制造机 |

#### Section 4 — 为什么 MBTI 能改善关系

Section header: `为什么了解人格，能改善关系？`

3 cards (horizontal on desktop, stacked on mobile):

1. **🔍 看懂对方的底层逻辑** — 同样一件事，不同类型的人理解方式完全不同。了解 TA 的类型，就像拿到了一本说明书。
2. **💬 找到 TA 能接受的说话方式** — 有人需要逻辑，有人需要感受。用对方听得进的方式说，比说什么更重要。
3. **🧘 减少内耗，不再自我怀疑** — 很多冲突来自「类型不合」，不是谁的错。理解这一点，是走出精神内耗的第一步。

#### Section 5 — CTA

- Heading: `知道自己是哪种类型了吗？`
- Sub-text: `2 分钟完成测试，立刻拿到你的专属人格档案`
- Primary button: `免费开始测试 →` → links to `/`
- Secondary button (small text link): `我已知道我的类型，直接进入 →` → links to `/`

---

## Files Changed

| File | Change |
|---|---|
| `src/components/OnboardingForm.tsx` | Add floating bubble link after hero CTA buttons |
| `src/app/mbti/page.tsx` | New file — full MBTI intro page |

No new API routes, no database changes, no new dependencies.

---

## Out of Scope

- English (`/en`) version of the MBTI page
- Individual type detail pages
- Animated transitions between sections
