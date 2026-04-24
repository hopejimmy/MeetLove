export type MbtiAxis = 'EI' | 'SN' | 'TF' | 'JP';

export interface QuestionDef {
  id: number;
  axis: MbtiAxis;
  text: string;
  optA: { label: string; val: string; weight: number };
  optB: { label: string; val: string; weight: number };
}

// 64道精心编排的共振题库数组
export const QUESTION_BANK: QuestionDef[] = [
  // --- E/I 轴 (16道) ---
  { id: 1, axis: 'EI', text: '在一个陌生的派对上，TA通常会...', optA: { label: '主动结识新朋友', val: 'E', weight: 1.1 }, optB: { label: '跟熟悉的朋友待在角落', val: 'I', weight: 1.0 } },
  { id: 2, axis: 'EI', text: '经过了一周疲惫的工作，TA周末的恢复方式是...', optA: { label: '和朋友出去大吃一顿', val: 'E', weight: 1.0 }, optB: { label: '在家安静地看剧睡觉', val: 'I', weight: 1.0 } },
  { id: 3, axis: 'EI', text: '在群体讨论中，TA习惯的沟通方式是...', optA: { label: '一边说话一边思考', val: 'E', weight: 1.0 }, optB: { label: '想清楚了再发言', val: 'I', weight: 1.0 } },
  { id: 4, axis: 'EI', text: '对于新认识的人，TA往往...', optA: { label: '毫无保留地展现自己', val: 'E', weight: 1.0 }, optB: { label: '慢热，一点点打开心扉', val: 'I', weight: 1.0 } },
  { id: 5, axis: 'EI', text: '如果突然有一天的假期，TA更倾向于...', optA: { label: '立刻邀约别人出去玩', val: 'E', weight: 1.0 }, optB: { label: '享受一个人独处的时光', val: 'I', weight: 1.0 } },
  { id: 6, axis: 'EI', text: '遇到开心的事情，TA的第一反应是...', optA: { label: '立刻发朋友圈或分享给周围人', val: 'E', weight: 1.0 }, optB: { label: '在心里默默品味这份喜悦', val: 'I', weight: 1.0 } },
  { id: 7, axis: 'EI', text: 'TA的手机信息通常...', optA: { label: '响了就想立刻秒回', val: 'E', weight: 1.0 }, optB: { label: '经常意念回复或拖延', val: 'I', weight: 1.0 } },
  { id: 8, axis: 'EI', text: '在团队协作中，TA更喜欢...', optA: { label: '充当协调者和发言人', val: 'E', weight: 1.0 }, optB: { label: '静静做完自己的那部分', val: 'I', weight: 1.0 } },
  { id: 9, axis: 'EI', text: 'TA的朋友圈子特点是...', optA: { label: '遍布各行各业的泛泛之交', val: 'E', weight: 1.0 }, optB: { label: '核心的几个生死之交', val: 'I', weight: 1.0 } },
  { id: 10, axis: 'EI', text: '面对尴尬的沉默，TA通常...', optA: { label: '觉得难受，会主动找话题', val: 'E', weight: 1.0 }, optB: { label: '觉得很自然，闭目养神', val: 'I', weight: 1.0 } },
  { id: 11, axis: 'EI', text: '别人眼里的TA通常是...', optA: { label: '一个充满活力和热情的人', val: 'E', weight: 1.0 }, optB: { label: '一个深沉内敛的人', val: 'I', weight: 1.0 } },
  { id: 12, axis: 'EI', text: 'TA发泄情绪的方式多半是...', optA: { label: '找人倾诉大哭一场', val: 'E', weight: 1.0 }, optB: { label: '自己躲起来消化', val: 'I', weight: 1.0 } },
  { id: 13, axis: 'EI', text: '在人群拥挤的长途旅行中，TA觉得...', optA: { label: '充满新鲜感，喜欢和邻座聊天', val: 'E', weight: 1.0 }, optB: { label: '戴上降噪耳机，与世隔绝', val: 'I', weight: 1.0 } },
  { id: 14, axis: 'EI', text: '对TA而言，"发呆"意味着...', optA: { label: '极度无聊，需要找点事做', val: 'E', weight: 1.0 }, optB: { label: '补充能量的绝佳时刻', val: 'I', weight: 1.0 } },
  { id: 15, axis: 'EI', text: '在公司团建上，TA一般在哪个位置...', optA: { label: '舞台中央，活跃气氛', val: 'E', weight: 1.0 }, optB: { label: '边缘，安静地吃瓜', val: 'I', weight: 1.0 } },
  { id: 16, axis: 'EI', text: '如果有陌生人突然搭讪，TA的反应是...', optA: { label: '非常乐意交流', val: 'E', weight: 1.0 }, optB: { label: '保持警惕，礼貌敷衍', val: 'I', weight: 1.0 } },

  // --- S/N 轴 (16道) ---
  { id: 17, axis: 'SN', text: 'TA评价一部电影的标准通常是...', optA: { label: '剧情是否合理、特效是否逼真', val: 'S', weight: 1.1 }, optB: { label: '隐喻是否深刻、脑洞是否够大', val: 'N', weight: 1.0 } },
  { id: 18, axis: 'SN', text: '面对一个新项目，TA最先关注的是...', optA: { label: '现有的资源和具体的执行步骤', val: 'S', weight: 1.0 }, optB: { label: '长远的愿景和宏大的战略目标', val: 'N', weight: 1.0 } },
  { id: 19, axis: 'SN', text: 'TA平时聊天的话题多半围绕...', optA: { label: '生活琐事、八卦、吃了什么', val: 'S', weight: 1.0 }, optB: { label: '未来规划、哲学、行业趋势', val: 'N', weight: 1.0 } },
  { id: 20, axis: 'SN', text: '在熟悉一条新路线时，TA倾向于...', optA: { label: '记住具体的街边标志（如麦当劳）', val: 'S', weight: 1.0 }, optB: { label: '记住整体的东南西北方位', val: 'N', weight: 1.0 } },
  { id: 21, axis: 'SN', text: '对TA来说，"现实"意味着...', optA: { label: '脚踏实地，眼见为实最为重要', val: 'S', weight: 1.0 }, optB: { label: '一个可以被超越和想象的起点', val: 'N', weight: 1.0 } },
  { id: 22, axis: 'SN', text: '在面对复杂问题时，TA习惯...', optA: { label: '依靠过去的经验来解决', val: 'S', weight: 1.0 }, optB: { label: '尝试一套从未用过的全新理论', val: 'N', weight: 1.0 } },
  { id: 23, axis: 'SN', text: 'TA买东西更看重...', optA: { label: '实用性、性价比、耐用度', val: 'S', weight: 1.0 }, optB: { label: '设计理念、新奇感、独特性', val: 'N', weight: 1.0 } },
  { id: 24, axis: 'SN', text: '如果要求TA描绘一片树林，TA的描述更像...', optA: { label: '清晰的树叶边缘、土壤的颜色', val: 'S', weight: 1.0 }, optB: { label: '森林散发的神秘感或生命隐喻', val: 'N', weight: 1.0 } },
  { id: 25, axis: 'SN', text: '回忆过去时，TA更容易想起...', optA: { label: '具体的对话内容和清晰的服饰', val: 'S', weight: 1.0 }, optB: { label: '当时的整体氛围和自己的感受', val: 'N', weight: 1.0 } },
  { id: 26, axis: 'SN', text: '听讲座或上课时，TA最反感...', optA: { label: '一直讲空泛的理论不给实际案例', val: 'S', weight: 1.0 }, optB: { label: '一直做简单重复的流水账操练', val: 'N', weight: 1.0 } },
  { id: 27, axis: 'SN', text: '在阅读一本小说时，TA喜欢...', optA: { label: '紧凑精彩的情节发展', val: 'S', weight: 1.0 }, optB: { label: '大量描写潜台词的心理铺陈', val: 'N', weight: 1.0 } },
  { id: 28, axis: 'SN', text: '在讨论一个未来的创意时，TA经常...', optA: { label: '泼冷水："这不现实，根本做不到"', val: 'S', weight: 1.0 }, optB: { label: '越聊越嗨："对，而且我们还能..."', val: 'N', weight: 1.0 } },
  { id: 29, axis: 'SN', text: '如果玩拼图，TA更习惯...', optA: { label: '一块块比对缺口边缘去拼凑', val: 'S', weight: 1.0 }, optB: { label: '先看着全图，按宏观颜色去归类', val: 'N', weight: 1.0 } },
  { id: 30, axis: 'SN', text: '向别人解释一个概念时，TA习惯...', optA: { label: '直接拿手边的实物打生动的比方', val: 'S', weight: 1.0 }, optB: { label: '抽象出这个事物背后的运转规律', val: 'N', weight: 1.0 } },
  { id: 31, axis: 'SN', text: 'TA评价某人是一个天才，如果那人...', optA: { label: '能在高压下熟练解决极高难度问题', val: 'S', weight: 1.0 }, optB: { label: '能跨维跳跃想出一个颠覆常理的点子', val: 'N', weight: 1.0 } },
  { id: 32, axis: 'SN', text: '在制定旅游计划时，TA最在意...', optA: { label: '有没有吃好住好，行程是否扎实', val: 'S', weight: 1.0 }, optB: { label: '去了有没有洗涤灵魂或产生感悟', val: 'N', weight: 1.0 } },

  // --- T/F 轴 (16道) ---
  { id: 33, axis: 'TF', text: '朋友失恋来找TA哭诉，TA通常会...', optA: { label: '帮忙分析分手原因，指明错在哪', val: 'T', weight: 1.1 }, optB: { label: '只管陪着骂渣男/渣女，提供情绪价值', val: 'F', weight: 1.0 } },
  { id: 34, axis: 'TF', text: '决定是否录用一个面试者时，TA看重...', optA: { label: '硬性的技术指标和业务能力', val: 'T', weight: 1.0 }, optB: { label: '人际交往时的融洽感和团队亲和力', val: 'F', weight: 1.0 } },
  { id: 35, axis: 'TF', text: '在辩论或争执中，TA觉得最重要的是...', optA: { label: '赢得长短，证明谁的逻辑是对的', val: 'T', weight: 1.0 }, optB: { label: '不伤和气，理解对方为什么这么想', val: 'F', weight: 1.0 } },
  { id: 36, axis: 'TF', text: '遇到不公正的事情时，TA内心倾向于...', optA: { label: '愤怒于制度的失准和不合理', val: 'T', weight: 1.0 }, optB: { label: '深切同情受害者的可怜处境', val: 'F', weight: 1.0 } },
  { id: 37, axis: 'TF', text: 'TA觉得一句好的表扬应该是...', optA: { label: '"你的方案数据推导非常严密"', val: 'T', weight: 1.0 }, optB: { label: '"你的努力让我觉得特别感动"', val: 'F', weight: 1.0 } },
  { id: 38, axis: 'TF', text: '在工作中，TA被评价为...', optA: { label: '雷厉风行、冷酷无情的老板', val: 'T', weight: 1.0 }, optB: { label: '很在乎大家感受、温和的同事', val: 'F', weight: 1.0 } },
  { id: 39, axis: 'TF', text: '如果你向TA请教一个难题，TA往往...', optA: { label: '给你一套系统的方法论原理', val: 'T', weight: 1.0 }, optB: { label: '一直用语言一直鼓励你能做好', val: 'F', weight: 1.0 } },
  { id: 40, axis: 'TF', text: '别人指责TA冷血，TA通常觉得...', optA: { label: '是你们太感情用事了', val: 'T', weight: 1.0 }, optB: { label: '内心非常受伤，试图解释', val: 'F', weight: 1.0 } },
  { id: 41, axis: 'TF', text: '看催泪电影时，TA的反应多半是...', optA: { label: '觉得剧情逻辑狗血，内心毫无波澜', val: 'T', weight: 1.0 }, optB: { label: '代入角色立刻跟着哭得稀里哗啦', val: 'F', weight: 1.0 } },
  { id: 42, axis: 'TF', text: '对于规则，TA的态度通常是...', optA: { label: '规则就是规则，不能因为人情随便改', val: 'T', weight: 1.0 }, optB: { label: '规则是死的，特殊情况应该特殊判断', val: 'F', weight: 1.0 } },
  { id: 43, axis: 'TF', text: 'TA评价一个人是否成熟的标准在于...', optA: { label: '是否能抛开情绪做出最理智的选择', val: 'T', weight: 1.0 }, optB: { label: '是否能敏锐地察觉和包容他人的柔弱', val: 'F', weight: 1.0 } },
  { id: 44, axis: 'TF', text: '如果别人犯了错，TA通常...', optA: { label: '直言不讳地指出来，不怕得罪人', val: 'T', weight: 1.0 }, optB: { label: '顾及对方面子，采用委婉迂回的说法', val: 'F', weight: 1.0 } },
  { id: 45, axis: 'TF', text: 'TA面对压力的解决机制是...', optA: { label: '列出问题清单，挨个剖析击破', val: 'T', weight: 1.0 }, optB: { label: '需要爱人和朋友的肯定来化解焦虑', val: 'F', weight: 1.0 } },
  { id: 46, axis: 'TF', text: '谈论“真理”这类宏观概念时，TA认为...', optA: { label: '真理只有唯一确定的客观准绳', val: 'T', weight: 1.0 }, optB: { label: '真理在不伤害善意的前提下才算真理', val: 'F', weight: 1.0 } },
  { id: 47, axis: 'TF', text: 'TA觉得自己最大的长处是...', optA: { label: '极度清醒的大脑', val: 'T', weight: 1.0 }, optB: { label: '极其共情的心灵', val: 'F', weight: 1.0 } },
  { id: 48, axis: 'TF', text: '送礼物时，TA更在意的是...', optA: { label: '礼物的实用价值和市场价值是否过硬', val: 'T', weight: 1.0 }, optB: { label: '礼物附带的手写卡片是否传递了心意', val: 'F', weight: 1.0 } },

  // --- J/P 轴 (16道) ---
  { id: 49, axis: 'JP', text: 'TA出去旅游之前的筹备通常是...', optA: { label: '写好Excel，机票酒店精确到小时', val: 'J', weight: 1.1 }, optB: { label: '买张票就去了，走到哪算哪', val: 'P', weight: 1.0 } },
  { id: 50, axis: 'JP', text: '看到桌子上有点乱，TA的下意识是...', optA: { label: '立刻动手收拾得整整齐齐', val: 'J', weight: 1.0 }, optB: { label: '挺好，有一种乱中有序的美感', val: 'P', weight: 1.0 } },
  { id: 51, axis: 'JP', text: '执行工作任务时，TA通常...', optA: { label: '按部就班提前完成，绝不压线', val: 'J', weight: 1.0 }, optB: { label: '不到最后一晚的DDL绝不动手', val: 'P', weight: 1.0 } },
  { id: 52, axis: 'JP', text: '对于“改变原定计划”，TA的态度是...', optA: { label: '感到烦躁，觉得被打乱了阵脚', val: 'J', weight: 1.0 }, optB: { label: '觉得无所谓，甚至隐隐期待新变数', val: 'P', weight: 1.0 } },
  { id: 53, axis: 'JP', text: '点外卖时，TA通常倾向于...', optA: { label: '吃固定的几家老店，不想冒险', val: 'J', weight: 1.0 }, optB: { label: '永远在尝试没吃过的新店或者新口味', val: 'P', weight: 1.0 } },
  { id: 54, axis: 'JP', text: '如果别人约TA本周末见面，TA通常回答...', optA: { label: '"好，暂定周六下午两点咖啡馆见"', val: 'J', weight: 1.0 }, optB: { label: '"好啊，那就看到时候周末的心情吧"', val: 'P', weight: 1.0 } },
  { id: 55, axis: 'JP', text: 'TA的邮箱或手机通知栏通常...', optA: { label: '红点全清，看完一封删一封', val: 'J', weight: 1.0 }, optB: { label: '堆积了999+也毫不在意', val: 'P', weight: 1.0 } },
  { id: 56, axis: 'JP', text: 'TA觉得自己是以下哪种人？', optA: { label: '一个目标导向型的掌控者', val: 'J', weight: 1.0 }, optB: { label: '一个过程导向型的体验派', val: 'P', weight: 1.0 } },
  { id: 57, axis: 'JP', text: '在看悬疑剧时，TA总是...', optA: { label: '急着拉进度条想马上知道确切的大结局', val: 'J', weight: 1.0 }, optB: { label: '享受剧情反转的过程，不急于知道结果', val: 'P', weight: 1.0 } },
  { id: 58, axis: 'JP', text: '关于金钱观，TA通常是...', optA: { label: '每个月有清晰的定额储蓄和报表规划', val: 'J', weight: 1.0 }, optB: { label: '随缘储蓄，千金散尽还复来', val: 'P', weight: 1.0 } },
  { id: 59, axis: 'JP', text: '为了减肥，TA会怎么做？', optA: { label: '坚决执行“周一三五跳绳半小时”死规定', val: 'J', weight: 1.0 }, optB: { label: '想到哪做到哪，今天少吃点明天多走点', val: 'P', weight: 1.0 } },
  { id: 60, axis: 'JP', text: '一件事情如果做到80%，TA会...', optA: { label: '一板一眼把它收尾敲死', val: 'J', weight: 1.0 }, optB: { label: '觉得已经没意思了，马上转去开新坑', val: 'P', weight: 1.0 } },
  { id: 61, axis: 'JP', text: '如果遇到意料之外的挑战...', optA: { label: 'TA的第一反应是快速建立规范来管理它', val: 'J', weight: 1.0 }, optB: { label: 'TA的第一反应是即兴发挥它的灵活度', val: 'P', weight: 1.0 } },
  { id: 62, axis: 'JP', text: 'TA比较不能忍受的人是...', optA: { label: '毫无纪律观念、永远迟到的人', val: 'J', weight: 1.0 }, optB: { label: '规矩太多、控制欲强到处查岗的人', val: 'P', weight: 1.0 } },
  { id: 63, axis: 'JP', text: '当必须做一个可能影响半生的决定时...', optA: { label: '尽早拍板，讨厌悬而不决的焦虑状态', val: 'J', weight: 1.0 }, optB: { label: '尽力拖延，收集更多信息直到最后一刻', val: 'P', weight: 1.0 } },
  { id: 64, axis: 'JP', text: 'TA的人生信条最接近...', optA: { label: '凡事预则立，不预则废', val: 'J', weight: 1.0 }, optB: { label: '车到山前必有路，船到桥头自然直', val: 'P', weight: 1.0 } }
];

// 生成特定长度的题库 (8题、16题、32题、64题)。保证均匀覆盖四大维度。
export const generateQuiz = (length: 8 | 16 | 32 | 64): QuestionDef[] => {
  const perAxis = length / 4;
  const quiz: QuestionDef[] = [];
  
  const axes: MbtiAxis[] = ['EI', 'SN', 'TF', 'JP'];
  axes.forEach(ax => {
    const questionsOfAxis = QUESTION_BANK.filter(q => q.axis === ax).slice(0, perAxis); // 按顺序取以保重点
    quiz.push(...questionsOfAxis);
  });
  
  // 对于应用层，最好不要让用户连续做同一个轴的题目，所以稍微做个均匀打乱，比如 E, S, T, J, E, S, T, J
  const interleaved: QuestionDef[] = [];
  for (let i = 0; i < perAxis; i++) {
    for (let j = 0; j < 4; j++) {
      interleaved.push(quiz[j * perAxis + i]);
    }
  }
  
  return interleaved;
}

// 防平局算法 (Tie-breaker Algorithm)
export const calculateMbtiScore = (answers: string[]): string => {
  // 每个指标记录对应的权重分
  const scores: Record<string, number> = {
    'E': 0, 'I': 0,
    'S': 0, 'N': 0,
    'T': 0, 'F': 0,
    'J': 0, 'P': 0
  };

  answers.forEach((val) => {
    const q = QUESTION_BANK.find(q => q.optA.val === val || q.optB.val === val);
    if (q) {
      const weight = q.optA.val === val ? q.optA.weight : q.optB.weight;
      scores[val] += weight;
    }
  });

  const eOrI = scores['E'] > scores['I'] ? 'E' : 'I';
  const sOrN = scores['S'] > scores['N'] ? 'S' : 'N';
  const tOrF = scores['T'] > scores['F'] ? 'T' : 'F';
  const jOrP = scores['J'] > scores['P'] ? 'J' : 'P';

  return eOrI + sOrN + tOrF + jOrP;
}
