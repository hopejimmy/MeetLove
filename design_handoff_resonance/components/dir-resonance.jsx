// Resonance — B方向去马里奥化
// 所有图形用抽象共振/波纹/花瓣替代 mushroom/coin/star
// 字体：Fraunces (展示) + Nunito (UI)
// 色板：珊瑚 + 蜂蜜 + 薄荷 + 丁香 + 雾蓝

const RS_W = 320, RS_H = 580;

// ──────── 抽象图形库（替换 Mario icons） ────────

// 共振气泡 —— 替换 Mushroom。圆形主体 + 双层波纹 + 两点眼睛
const RsOrb = ({ size = 54, color = 'coral' }) => {
  const palette = {
    coral:  { fill: '#F27A5A', dk: '#C7482A', ring: 'rgba(242,122,90,.3)' },
    mint:   { fill: '#6ECFB0', dk: '#2E8F74', ring: 'rgba(110,207,176,.3)' },
    honey:  { fill: '#F2C14E', dk: '#B08418', ring: 'rgba(242,193,78,.3)' },
    lilac:  { fill: '#B49BE8', dk: '#7255B8', ring: 'rgba(180,155,232,.3)' },
    cobalt: { fill: '#4A7AC9', dk: '#1F4890', ring: 'rgba(74,122,201,.3)' },
    blush:  { fill: '#F4B8B8', dk: '#C77070', ring: 'rgba(244,184,184,.3)' },
  }[color] || { fill: '#F27A5A', dk: '#C7482A' };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }}>
      {/* outer ripple */}
      <circle cx="32" cy="32" r="30" fill="none" stroke={palette.dk} strokeWidth="1.5" opacity=".35" strokeDasharray="2 3"/>
      {/* main orb */}
      <circle cx="32" cy="32" r="22" fill={palette.fill} stroke="#2A1F1A" strokeWidth="2.5"/>
      {/* highlight */}
      <ellipse cx="24" cy="24" rx="7" ry="5" fill="rgba(255,255,255,.55)"/>
      {/* tiny eyes */}
      <circle cx="27" cy="34" r="2" fill="#2A1F1A"/>
      <circle cx="37" cy="34" r="2" fill="#2A1F1A"/>
      {/* soft smile */}
      <path d="M27 40 Q32 43 37 40" fill="none" stroke="#2A1F1A" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
};

// 能量徽章 —— 替换 Coin。六角星徽章，中心写字母
const RsMedal = ({ size = 36, label = '♡' }) => (
  <svg viewBox="0 0 40 40" width={size} height={size} style={{ display: 'block' }}>
    <path d="M20 3 L25 7 L31 7 L33 13 L37 17 L33 22 L33 28 L28 31 L25 36 L20 34 L15 36 L12 31 L7 28 L7 22 L3 17 L7 13 L9 7 L15 7 Z"
      fill="#F2C14E" stroke="#2A1F1A" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="20" cy="20" r="9" fill="#FFF8EC" stroke="#2A1F1A" strokeWidth="1.5"/>
    <text x="20" y="25" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="12" fill="#C7482A">{label}</text>
  </svg>
);

// 星点 —— 替换 Star。抽象五角星，无眼睛无嘴
const RsStar = ({ size = 32, color = '#F2C14E' }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} style={{ display: 'block' }}>
    <path d="M16 2 L20 12 L30 12 L22 18 L25 28 L16 22 L7 28 L10 18 L2 12 L12 12 Z"
      fill={color} stroke="#2A1F1A" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="11" cy="10" r="1.4" fill="rgba(255,255,255,.7)"/>
  </svg>
);

// Logo —— 同心双圈，去掉红黄对比
const RsLogo = ({ size = 56 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} style={{ display: 'block' }}>
    <circle cx="32" cy="32" r="28" fill="#F27A5A" stroke="#2A1F1A" strokeWidth="3"/>
    <circle cx="32" cy="32" r="20" fill="#FFF8EC" stroke="#2A1F1A" strokeWidth="2"/>
    <text x="32" y="42" textAnchor="middle" fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="600" fontSize="26" fill="#C7482A">R</text>
  </svg>
);

// 花瓣装饰
const RsPetal = ({ size = 24, color = '#B49BE8' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} style={{ display: 'block' }}>
    <path d="M12 2 Q18 8 12 22 Q6 8 12 2 Z" fill={color} stroke="#2A1F1A" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// ──────── Layout ────────

const RsNavbar = ({ logged = false }) => (
  <div style={{
    background: '#FFF8EC', borderBottom: '2.5px solid #2A1F1A',
    padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <RsLogo size={26} />
      <span style={{ fontFamily: '"Fraunces",serif', fontStyle: 'italic', fontWeight: 600, fontSize: 19, letterSpacing: -0.4 }}>Relate</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button style={{
        fontFamily: 'Nunito,sans-serif', fontWeight: 800, fontSize: 10,
        padding: '3px 9px', border: '2px solid #2A1F1A', borderRadius: 999,
        background: '#F2C14E', cursor: 'pointer', color: '#2A1F1A',
      }}>EN</button>
      {logged && <span style={{ fontSize: 11, fontWeight: 700, color: '#5A4A3E' }}>登出</span>}
    </div>
  </div>
);

const RsShell = ({ children, style }) => (
  <div className="dir-resonance rs-bg" style={{ width: RS_W, height: RS_H, overflow: 'hidden', position: 'relative', ...style }}>
    {children}
  </div>
);

// ──────── Screens ────────

// Hero
const RsHero = () => (
  <RsShell>
    <RsNavbar />
    <div style={{ padding: '20px 20px', position: 'relative', zIndex: 2 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, position:'relative' }}>
        <div style={{ animation: 'bob 2.2s ease-in-out infinite' }}><RsOrb size={52} color="coral" /></div>
        <div style={{ animation: 'bob 2s ease-in-out infinite .3s', marginTop: 12 }}><RsStar size={38} color="#F2C14E"/></div>
        <div style={{ animation: 'bob 2.4s ease-in-out infinite .6s' }}><RsOrb size={52} color="mint" /></div>
      </div>
      <div className="rs-card" style={{ textAlign: 'center', padding: '22px 18px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#C7482A', letterSpacing: 3, marginBottom: 6 }}>· RELATE ·</div>
        <h1 style={{ fontFamily:'Fraunces,serif', fontSize: 26, fontWeight: 500, fontStyle:'italic', margin: '2px 0 10px', lineHeight: 1.15, letterSpacing: -0.3 }}>找到和你<br/><em>同频的灵魂</em></h1>
        <p style={{ fontSize: 12, color: '#5A4A3E', lineHeight: 1.6, margin: '6px 0 18px', fontFamily:'Nunito,sans-serif' }}>
          基于 MBTI 与非暴力沟通的<br/>私人关系解码器
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="rs-btn">开始频率测试 →</button>
          <button className="rs-btn ghost">我已知道我的 MBTI</button>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 70, right: 14, animation: 'bob 1.8s ease-in-out infinite' }}><RsMedal size={26} /></div>
      <div style={{ position: 'absolute', top: 140, left: 10, animation: 'bob 1.5s ease-in-out infinite .4s' }}><RsPetal size={20} color="#B49BE8"/></div>
    </div>
  </RsShell>
);

// Quiz
const RsQuiz = () => (
  <RsShell>
    <RsNavbar />
    <div style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontFamily:'Nunito', fontWeight: 900, fontSize: 12, color: '#2A1F1A' }}>问题 2 / 4</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1,1,0,0].map((f,i)=>(
            <div key={i} style={{ width: 24, height: 7, borderRadius: 4, background: f?'#F2C14E':'#FFF8EC', border:'2px solid #2A1F1A' }}/>
          ))}
        </div>
      </div>
      <div className="rs-card" style={{ padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#C7482A', marginBottom: 6, letterSpacing:1 }}>S / N</div>
        <div style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize: 17, fontWeight: 500, lineHeight: 1.35 }}>
          你在看一部悬疑电影时，更倾向于注意：
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          {k:'A', bg:'#F2C14E', c:'#2A1F1A', t:'角色的微表情和实际的线索细节'},
          {k:'B', bg:'#B49BE8', c:'#fff', t:'隐藏的暗号和导演深层的隐喻'},
        ].map(o=>(
          <button key={o.k} className="rs-card" style={{ padding: 13, textAlign: 'left', cursor: 'pointer', fontFamily: 'Nunito,sans-serif' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: o.bg, color:o.c, border: '2.5px solid #2A1F1A', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 15 }}>{o.k}</div>
              <div style={{ fontSize: 12, lineHeight: 1.4 }}>{o.t}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </RsShell>
);

// MBTI Select
const RsSelect = () => {
  const types = ["INTJ","INTP","ENTJ","ENTP","INFJ","INFP","ENFJ","ENFP","ISTJ","ISFJ","ESTJ","ESFJ","ISTP","ISFP","ESTP","ESFP"];
  const colors = ['#F27A5A', '#6ECFB0', '#4A7AC9', '#F2C14E', '#B49BE8'];
  return (
    <RsShell>
      <RsNavbar />
      <div style={{ padding: '16px 18px' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize: 20, fontWeight: 600, margin: '0 0 4px' }}>选择你的频率</h2>
        <p style={{ fontSize: 12, color: '#5A4A3E', margin: '0 0 14px', fontFamily:'Nunito' }}>点击卡片开启你的共振档案</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 7 }}>
          {types.map((t, i) => (
            <button key={t} style={{
              fontFamily:'Nunito', fontWeight: 900, fontSize: 10,
              padding: '11px 0', color: i%5===3 ? '#2A1F1A' : '#fff',
              background: colors[i % colors.length],
              border: '2px solid #2A1F1A', borderRadius: 10,
              boxShadow: '0 3px 0 0 #2A1F1A', cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:18,fontSize:11,fontFamily:'Nunito',color:'#5A4A3E'}}>不知道？<u>做一次测试</u></div>
      </div>
    </RsShell>
  );
};

// Login
const RsLogin = () => (
  <RsShell>
    <RsNavbar />
    <div style={{ padding: '26px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <RsLogo size={60} />
      </div>
      <div className="rs-card" style={{ padding: 20 }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize: 19, fontWeight: 600, textAlign: 'center', margin: '0 0 4px' }}>欢迎回来</h2>
        <p style={{ fontSize: 12, color: '#5A4A3E', textAlign: 'center', margin: '0 0 16px', fontFamily:'Nunito' }}>
          输入邮箱极速找回档案
        </p>
        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 4, fontFamily:'Nunito' }}>邮箱</div>
        <input readOnly value="hello@relate.app" style={{
          width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 13,
          border: '2px solid #2A1F1A', borderRadius: 10, marginBottom: 10,
          fontFamily: 'Nunito,sans-serif', outline: 'none', background:'#fff',
        }}/>
        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 4, fontFamily:'Nunito' }}>称呼 <span style={{ opacity: .5 }}>(选填)</span></div>
        <input readOnly value="Mari" style={{
          width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 13,
          border: '2px solid #2A1F1A', borderRadius: 10, marginBottom: 18,
          fontFamily: 'Nunito,sans-serif', outline: 'none', background:'#fff',
        }}/>
        <button className="rs-btn" style={{ width: '100%' }}>继续 →</button>
      </div>
    </div>
  </RsShell>
);

// Dashboard
const RsDashboard = () => {
  const rels = [
    { name: '妈妈', rel: '父母', mbti: 'ESFJ', color: 'coral' },
    { name: '老公', rel: '伴侣', mbti: 'INTP', color: 'mint' },
    { name: '老板', rel: '同事', mbti: 'ENTJ', color: 'cobalt' },
    { name: '闺蜜', rel: '朋友', mbti: 'ENFP', color: 'honey' },
  ];
  return (
    <RsShell>
      <RsNavbar logged />
      <div style={{ padding: '14px 16px 20px', height: 'calc(100% - 50px)', overflowY: 'auto' }}>
        {/* 用户卡 */}
        <div className="rs-card" style={{ padding: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <RsOrb size={44} color="lilac"/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: '#5A4A3E', fontWeight: 700, fontFamily:'Nunito', letterSpacing:1 }}>你的频率</div>
            <div style={{ fontFamily:'Fraunces,serif', fontSize: 21, fontStyle:'italic', fontWeight: 600, color: '#C7482A', letterSpacing: 0.3 }}>ENFP · 魔术师</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <RsMedal size={22} label="♡"/>
            <span style={{ fontWeight: 900, fontSize:13, fontFamily:'Nunito' }}>12</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <h3 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize: 15, fontWeight: 600, margin: 0 }}>你在意的人 ({rels.length})</h3>
          <span style={{ fontSize: 10, color: '#5A4A3E', fontWeight: 700, fontFamily:'Nunito' }}>按相性排序</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {rels.map(r => (
            <div key={r.name} className="rs-card" style={{ padding: 11, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <RsOrb size={40} color={r.color} />
              </div>
              <div style={{ fontFamily:'Nunito', fontSize: 13, fontWeight: 900, textAlign: 'center' }}>{r.name}</div>
              <div style={{ fontSize: 10, color: '#5A4A3E', textAlign: 'center', marginBottom: 6, fontFamily:'Nunito' }}>{r.rel}</div>
              <div className="rs-chip" style={{ display:'block', textAlign: 'center', padding: '2px 0', background: '#F2C14E' }}>{r.mbti}</div>
            </div>
          ))}
        </div>

        <button className="rs-btn mint" style={{ width: '100%', marginTop: 12 }}>＋ 添加一个在意的人</button>
      </div>
    </RsShell>
  );
};

// Add Relative
const RsAddRelative = () => (
  <RsShell>
    <RsNavbar logged />
    <div style={{ padding: '14px 18px' }}>
      <button style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 800, color: '#2A1F1A', cursor: 'pointer', marginBottom: 8, padding: 0, fontFamily:'Nunito' }}>← 返回</button>
      <div className="rs-card" style={{ padding: 18 }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize: 19, fontWeight: 600, margin: '0 0 4px' }}>新的连接</h2>
        <p style={{ fontSize: 12, color: '#5A4A3E', margin: '0 0 16px', fontFamily:'Nunito' }}>为 TA 建立一份共振档案</p>
        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 4, fontFamily:'Nunito' }}>怎么称呼 TA？</div>
        <input readOnly value="老公" style={{
          width: '100%', boxSizing: 'border-box', padding: '10px 12px', fontSize: 13,
          border: '2px solid #2A1F1A', borderRadius: 10, marginBottom: 12, fontFamily: 'Nunito', outline: 'none', background:'#fff',
        }}/>
        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 6, fontFamily:'Nunito' }}>你们是什么关系？</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 14 }}>
          {['伴侣','父母','孩子','朋友','同事','其他'].map((r,i) => (
            <button key={r} style={{
              fontFamily:'Nunito', fontSize: 11, fontWeight: 800,
              padding: '8px 0', borderRadius: 8,
              border: '2px solid #2A1F1A',
              background: i === 0 ? '#F27A5A' : '#FFF8EC',
              color: i === 0 ? '#fff' : '#2A1F1A',
              boxShadow: '0 2px 0 0 #2A1F1A', cursor: 'pointer',
            }}>{r}</button>
          ))}
        </div>
        <button className="rs-btn" style={{ width: '100%', marginBottom: 8 }}>下一步 →</button>
        <button className="rs-btn ghost" style={{ width: '100%' }}>取消</button>
      </div>
    </div>
  </RsShell>
);

// Detail
const RsDetail = () => (
  <RsShell>
    <RsNavbar logged />
    <div style={{ padding: '12px 16px 18px', height: 'calc(100% - 50px)', overflowY: 'auto' }}>
      <button style={{ background: 'none', border: 'none', fontSize: 11, fontWeight: 800, color: '#2A1F1A', cursor: 'pointer', marginBottom: 8, padding: 0, fontFamily:'Nunito' }}>← 返回</button>
      <div className="rs-card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <RsOrb size={52} color="mint" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontSize: 17, fontWeight: 600 }}>老公的频道</div>
          <div style={{ fontSize: 10, color: '#5A4A3E', marginBottom: 6, fontFamily:'Nunito' }}>伴侣 · Partner</div>
          <span className="rs-chip">INTP</span>
          <span className="rs-chip" style={{ marginLeft:4, background:'#6ECFB0' }}>相性 82%</span>
        </div>
      </div>

      <div style={{ fontFamily:'Nunito', fontSize: 12, fontWeight: 900, marginBottom: 8, color:'#5A4A3E', letterSpacing:1 }}>选择一个困境场景</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {[
          { txt: '如何开口哄TA开心', c: '#F27A5A', light:false },
          { txt: '刚吵架如何破冰', c: '#4A7AC9', light:false },
          { txt: '怎么表达真实需求', c: '#6ECFB0', light:false },
          { txt: '策划浪漫约会', c: '#F2C14E', light:true },
        ].map((s,i) => (
          <button key={i} style={{
            fontFamily:'Nunito', fontSize: 11, fontWeight: 800, textAlign: 'left',
            padding: '10px 12px', borderRadius: 12,
            border: '2px solid #2A1F1A', background: s.c, color: s.light ? '#2A1F1A' : '#fff',
            boxShadow: '0 3px 0 0 #2A1F1A', cursor: 'pointer', lineHeight: 1.35,
          }}>{s.txt}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <input readOnly placeholder="输入你的具体困境..." style={{
          flex: 1, padding: '9px 12px', fontSize: 12,
          border: '2px solid #2A1F1A', borderRadius: 10, fontFamily: 'Nunito', outline: 'none', background:'#fff',
        }}/>
        <button className="rs-btn honey" style={{ padding: '6px 14px', fontSize:12 }}>发送</button>
      </div>

      <div className="rs-card" style={{ padding: 13, background: '#FFF1D9', border: '2.5px dashed #2A1F1A', boxShadow:'0 3px 0 0 #2A1F1A' }}>
        <div style={{ fontSize: 9, fontWeight: 800, color: '#C7482A', marginBottom: 4, letterSpacing:2, fontFamily:'Nunito' }}>✦ 今日灵感</div>
        <div style={{ fontFamily:'Nunito', fontSize: 11, lineHeight: 1.55, color: '#2A1F1A' }}>
          作为 INTP，TA 讨厌情绪化的对峙。先让 TA 的逻辑大脑上线：用「我看到…我感受…」的具体结构，而不是上来指责。
        </div>
      </div>
    </div>
  </RsShell>
);

Object.assign(window, { RsHero, RsQuiz, RsSelect, RsLogin, RsDashboard, RsAddRelative, RsDetail, RS_W, RS_H, RsOrb, RsMedal, RsStar, RsLogo, RsPetal });
