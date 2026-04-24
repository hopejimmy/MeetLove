# Landing Page Improvements Design

**Date:** 2026-04-24  
**Scope:** `src/components/OnboardingForm.tsx` (hero step only)  
**Goal:** Fix two P0 conversion leaks (no above-fold CTA, no social proof) and add a high-impact AI scenario carousel to demonstrate product value.

---

## Problem Summary

The current landing page has four conversion blockers identified in PM review:

1. **P0 — No above-fold CTA.** The only action buttons are at the very bottom. Users who don't scroll see no way to start.
2. **P0 — No social proof.** Zero testimonials, ratings, or user counts. First-time visitors have no reason to trust the product.
3. **P1 — No product preview.** Users don't know what they'll get after completing the quiz. "Show don't tell" is missing entirely.
4. **P2 — Broken secondary CTA routing.** "I already know my MBTI" jumps to `/login` instead of the existing MBTI selector (`step="select"`).
5. **P2 — Weak copy in several sections.** Abstract metaphors obscure the concrete value; one typo in CTA area.

---

## Approach: Targeted Hero + Carousel Insertion (Method B)

Keep the existing page structure. Make three focused changes:
1. Rebuild the hero section to include social proof and CTA buttons.
2. Insert a swipeable AI scenario carousel between the pain-point cards and the solution section.
3. Rewrite weak copy across hero, solution section, step guide, and CTA area.

---

## Section 1 — Hero Redesign

### Layout (top to bottom)

| Element | Detail |
|---|---|
| Animated orbs | Unchanged |
| Brand label | `· RELATE 同频 ·` — unchanged |
| H1 headline | Unchanged — keep "为什么最亲密的人，总是产生最深的精神内耗？" |
| Sub-text | **Rewritten** (see copy below) |
| Social proof bar | **New** — pill-shaped, inline |
| Primary CTA button | **New** — coral, full width, links to `step="length_select"` |
| Secondary CTA button | **New** — ghost, full width, links to `step="select"` (not `/login`) |

### Revised Sub-text

> 其实，你们并没有错。  
> 只是你们的沟通方式天生不同。  
> Relate 分析双方性格，告诉你**用什么方式说、说什么话**，TA 才听得进去。

### Social Proof Bar

Pill shape, centered, between sub-text and CTA:

```
2,800+ 人已找到频率  ·  ⭐ 4.9 分
```

Placeholder numbers — replace with real data when available.

### CTA Buttons

- Primary: `免费开始测试 →` → `setStep("length_select")`
- Secondary: `我已知道我的 MBTI 型` → `setStep("select")`

---

## Section 2 — AI Scenario Carousel

### Placement

Insert **after** the three pain-point cards, **before** the "Relate 如何帮你扭转局面？" solution section.

### Section header

```
—— 真实场景，实时生成 ——
```

### Carousel behaviour

- 4 slides, swipe left/right (touch + click arrows)
- Left/right arrow buttons + dot indicators
- No auto-play (user controls pace)
- Implemented with React `useState` (currentIndex) + CSS `transform: translateX`. No external library needed.
- Orb colors use existing CSS variables: `var(--rs-coral)`, `var(--rs-mint)`, `var(--rs-lilac)`, `var(--rs-cobalt)`

### 4 Scenarios

Each card contains: scenario tag + title + sub-description + persona row (User MBTI × Contact MBTI) + AI advice bubble + source note.

| # | Tag | Title | Sub | User | Contact | AI Advice |
|---|---|---|---|---|---|---|
| 1 | 💔 吵架冷战 | 冷战3天，不知道怎么开口 | 想缓和气氛，但怕一开口又吵起来 | INFJ | ESTP | "我知道你现在可能还需要空间。我不是来继续争的——只是想让你知道，我在乎我们，也在乎你的感受。等你准备好，我想好好聊聊。" |
| 2 | 👨‍👩‍👧 孩子教育 | 孩子不肯尝试新东西，一说就叛逆 | 想让孩子放下手机、尝试新活动，说什么都没用 | ESTJ | INFP | "我不是要强迫你，我只是有点担心你最近的状态。你愿意跟我说说，现在什么事让你最有意思吗？" |
| 3 | 🌪️ 父母控制 | 父母说"为你好"，句句是控制 | 爱他们，但每次通话后都精神内耗半天 | INFP | ESTJ | "妈，我知道你说这些是因为在乎我。但这件事我需要按自己的节奏来决定，这样我才能对结果负责。我会认真考虑你的意见的。" |
| 4 | 💼 职场压力 | 老板说"你好好想想"，彻夜未眠 | 不知道他什么意思，不知道自己哪里出了问题 | INFJ | ENTJ | "您好，关于昨天的反馈，我想确认一下我的理解是否正确。您希望我在哪个方向上做调整？这样我能更有针对性地改进。" |

### Card anatomy

```
┌─────────────────────────────────────┐
│ [tag 场景 N/4]                       │
│ 标题（大字）                          │
│ 子说明（小字灰色）                    │
├─────────────────────────────────────┤
│ [用户 orb + MBTI]  ×  [对方 orb + MBTI] │
├─────────────────────────────────────┤
│ 🤖 AI 破冰建议                        │
│ "……建议话术……"（引用气泡）              │
│                  基于 X×Y 模型生成 ✦  │
└─────────────────────────────────────┘
```

---

## Section 3 — Copy Rewrites

### Solution section titles

| Current | New |
|---|---|
| 诊断你们的「相性错位点」 | 找出你们吵架的根本原因 |
| （others unchanged） | — |

### Step guide titles

| Step | Current | New |
|---|---|---|
| 1 | 确立自身频段 | 确立自身频段（不变） |
| 2 | 组建亲友星系 | 添加你在意的人 |
| 3 | 查阅灵魂说明书 | 查看 TA 的相处说明书 |
| 4 | AI 战术指导 | 遇到冲突？让 AI 给你出招 |

### CTA section

| Element | Current | New |
|---|---|---|
| Heading | 不要再在黑暗中乱撞 | 2 分钟，找到你们问题的根源 |
| Sub-text | 现在就免费进行一次 8 题快速**测写** | 免费完成 8 题测试，立刻获得你的专属沟通建议 |
| Primary button | 开始频率测试 → | 免费开始测试 → |

---

## Files Changed

| File | Change |
|---|---|
| `src/components/OnboardingForm.tsx` | Hero section rewrite + carousel insertion + copy updates |

No new files, no API changes, no schema changes.

---

## Out of Scope

- PRO paywall timing (separate task)
- English (`EN`) copy updates (separate task)
- Dashboard screenshot / real user data for social proof
