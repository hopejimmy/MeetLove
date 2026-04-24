# Handoff: Relate — Resonance 视觉重设计

## Overview
这份交接包描述如何把 Relate（同频）app 从当前的「玻璃拟态 + 紫色星系」风格迁移到新的 **Resonance** 设计语言——一套保留"玩具感 + 活泼节奏"但完全原创的视觉系统（以 Nintendo Odyssey UI 为灵感启发，但无任何 IP 痕迹）。

目标 app：`/MeetLove`（Next.js + Prisma + Tailwind 已存在）

## About the Design Files
本包中的 HTML 文件是**设计参考**，不是直接复制的生产代码。它们在 HTML+React+inline styles 里用 iframe prototype 的形式展示最终视觉。

你的任务是**在 MeetLove 这个 Next.js 代码库的现有环境里重新实现这些设计**，使用它已有的：
- Next.js App Router + React Server Components 约定
- CSS Modules（目前项目的写法）
- 同一套 i18n `useLang` hook
- 同一套 Prisma schema（不改数据模型）

## Fidelity
**High-fidelity**：所有颜色、字体、间距、阴影都是精确值，应当 pixel-perfect 还原。7 个屏幕每个都在 design ref 里。

## Screens / Views

### 1. Hero / Landing (`src/app/page.tsx`)
- **Purpose**：未登录用户的首页，引导做 MBTI quiz 或直接选择已知的 MBTI
- **Layout**：垂直居中，navbar 顶部，主卡片居中，卡片上方有 3 个浮动装饰图形（左右两个 Orb + 中间 Star）
- **Components**：
  - Navbar：奶油底 `#FFF8EC` + 黑描边下边线 2.5px + logo（RsLogo 26px）+ "Relate" 文字（Fraunces italic 19px 600）+ EN 语言切换按钮（蜂蜜黄胶囊）
  - 主卡片：`.rs-card`，内含 "· RELATE ·" eyebrow（珊瑚 10px letter-spacing 3）、H1（Fraunces italic 26px）、描述（Nunito 12px #5A4A3E）、两个按钮（主珊瑚 + ghost）
  - 装饰：`<RsOrb>` coral + mint 52px，`<RsStar>` 38px，都带 `bob` 动画

### 2. Quiz (`src/app/quiz/page.tsx` — 新建)
- Progress：左侧 "问题 2/4" + 右侧 4 个小 pill 进度条（填充蜂蜜黄，空白奶油）
- 题干卡片：维度标签（珊瑚 11px letter-spacing 1） + Fraunces italic 17px 问题
- 两个答案卡片：左侧 34px 圆形字母 A/B（A=蜂蜜黄、B=丁香紫），右侧 Nunito 12px 选项文字

### 3. MBTI Select (`src/components/MbtiSelector.tsx`)
- 标题 Fraunces italic 20px "选择你的频率"
- 4×4 网格，16 个类型按钮，轮流用 5 个色板色（珊瑚/薄荷/雾蓝/蜂蜜/丁香），2px 描边 + 3px 硬阴影，10px 圆角
- 底部 "不知道？做一次测试" 链接

### 4. Login (`src/app/login/page.tsx`)
- 顶部居中 60px RsLogo
- 卡片内：H2 "欢迎回来" + 邮箱 + 称呼输入框 + "继续" 主按钮
- 输入框：2px 黑描边 + 10px 圆角 + 白底

### 5. Dashboard (`src/app/dashboard/page.tsx`)
- 用户卡：`<RsOrb color="lilac"/>` 44px + "你的频率" label + "ENFP · 魔术师" Fraunces italic 21px 600 珊瑚色 + `<RsMedal>` + 12
- 亲友列表：2 列网格，每卡含 40px Orb + 姓名 + 关系 + MBTI chip
- 底部 "＋ 添加一个在意的人" 薄荷主按钮

### 6. Add Relative (`src/app/dashboard/add-relative/page.tsx`)
- 返回按钮 + 卡片（"新的连接" + 称呼输入 + 6 个关系选项 3 列网格 + 下一步/取消按钮）

### 7. Relative Detail (`src/app/dashboard/relatives/[id]/page.tsx`)
- 头部卡：52px Orb + "老公的频道" + INTP chip + 相性 chip
- 4 个困境场景按钮 2 列网格（珊瑚/雾蓝/薄荷/蜂蜜）
- 输入框 + 发送按钮
- AI 建议卡：`#FFF1D9` 底 + 2.5px 黑虚线描边 + "✦ 今日灵感" eyebrow

## Interactions & Behavior
- **按钮按下**：`transform: translateY(2px); box-shadow: 0 1px 0 0 #2A1F1A`（硬阴影变短）
- **Orb bob 动画**：`@keyframes bob { 0%,100% { translateY(0) } 50% { translateY(-6px) } }`，2~2.4s ease-in-out infinite，装饰用不同 delay 做错落
- **响应式**：320px 是 mobile 基准；≥768px 时 dashboard 亲友网格升到 3~4 列，按钮不再全宽

## State Management
保持现有 Prisma schema 不变。只改 UI 层。

## Design Tokens

### Colors
```css
--rs-ink:       #2A1F1A;   /* 褪色黑（描边+文字） */
--rs-ink-soft:  #5A4A3E;   /* 二级文字 */
--rs-cream:     #FFF8EC;   /* 卡片底 */
--rs-paper:     #F5EEDC;   /* 页面底 */

--rs-coral:     #F27A5A;   /* 主 CTA */
--rs-coral-dk:  #C7482A;   /* 珊瑚强调 */
--rs-honey:     #F2C14E;   /* 蜂蜜黄 */
--rs-mint:      #6ECFB0;   /* 薄荷（成功/次 CTA） */
--rs-lilac:     #B49BE8;   /* 丁香紫 */
--rs-cobalt:    #4A7AC9;   /* 雾蓝 */
--rs-blush:     #F4B8B8;   /* 腮红粉 */
```

### Typography
- Display：**Fraunces** ital 500/600（标题、品牌点缀）
- UI：**Nunito** 400/700/800/900
- Google Fonts 导入：`https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400..600;1,400..600&family=Nunito:wght@400;700;800;900&display=swap`

### Spacing & Radii
- Card padding：18~22px（内容） / 12~14px（紧凑）
- Card radius：18px（主卡）/ 10~12px（按钮、输入）
- Gap：6~10px（密集）/ 12~14px（段落）

### Shadows
- 按钮：`0 3px 0 0 #2A1F1A`
- 卡片：`0 5px 0 0 #2A1F1A`
- 没有任何 blur 阴影——这套语言只用硬偏移黑阴影

### Borders
统一 2.5px（卡片）/ 2px（小元件），颜色一律 `#2A1F1A`

## Graphic Primitives（原创 SVG，替代任何 IP 图形）
所有图形定义在 `components/dir-resonance.jsx` 中：
- `RsOrb`：共振气泡——圆主体 + 外圈虚线波纹 + 两点眼睛 + 微笑，色板 6 种
- `RsMedal`：六角星徽章——外六边形 + 内白圆 + 中心字母
- `RsStar`：5 角星——无眼睛无嘴，作为装饰点缀
- `RsLogo`：同心双圈 + Fraunces italic "R"
- `RsPetal`：花瓣形装饰

## Files
本 handoff 包含：
- `Relate Resonance.html` — 7 屏完整 design canvas（主参考）
- `components/dir-resonance.jsx` — 所有 React 组件源码
- `styles/resonance-tokens.css` — CSS 变量 + 按钮/卡片/背景类
- `design-canvas.jsx` — 展示用的 canvas 容器（不用实现到 app 里）

## 实现建议步骤
1. 把 `resonance-tokens.css` 的 CSS 变量移到 `src/app/globals.css` 的 `:root`，覆盖现有的紫色 tokens
2. 把现有 `glass-card` class 重写成 `rs-card` 样式
3. 把 `Outfit` 字体换成 Fraunces + Nunito 组合
4. 按每屏的 Components 清单改造对应 `.tsx` 文件，保持现有的 props/hooks/路由不变
5. SVG 图形以独立 component 落地在 `src/components/icons/`
