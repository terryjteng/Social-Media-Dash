import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// PLATFORM CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { id: "instagram",   label: "Instagram",   color: "#E1306C", icon: "📸" },
  { id: "tiktok",      label: "TikTok",      color: "#010101", icon: "🎵" },
  { id: "youtube",     label: "YouTube",     color: "#FF0000", icon: "▶️" },
  { id: "twitter",     label: "X / Twitter", color: "#1DA1F2", icon: "𝕏" },
  { id: "linkedin",    label: "LinkedIn",    color: "#0A66C2", icon: "💼" },
  { id: "gofundme",    label: "GoFundMe",    color: "#02A95C", icon: "💚", manual: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY = {
  instagram: { followers: 48200, growth: 3.2,  impressions: 312000, engagement: 4.8, reach: 198000, clicks: 8400 },
  tiktok:    { followers: 91400, growth: 11.7, impressions: 820000, engagement: 9.1, reach: 640000, clicks: 22100 },
  youtube:   { followers: 23800, growth: 1.4,  impressions: 190000, engagement: 6.3, reach: 145000, clicks: 5700 },
  twitter:   { followers: 15600, growth: -0.8, impressions: 98000,  engagement: 2.1, reach: 72000,  clicks: 1900 },
  linkedin:  { followers: 8900,  growth: 5.1,  impressions: 54000,  engagement: 5.4, reach: 41000,  clicks: 3100 },
  gofundme:  { followers: 2340,  growth: 18.4, impressions: 31000,  engagement: 12.6,reach: 28000,  clicks: 14200 },
};
const WEEKLY = [
  { day:"Mon", instagram:4200, tiktok:9800,  youtube:2100, twitter:1200, linkedin:900,  gofundme:3400 },
  { day:"Tue", instagram:5100, tiktok:11200, youtube:1900, twitter:900,  linkedin:1100, gofundme:4100 },
  { day:"Wed", instagram:3800, tiktok:8900,  youtube:2400, twitter:1400, linkedin:800,  gofundme:2900 },
  { day:"Thu", instagram:6200, tiktok:14000, youtube:2800, twitter:1100, linkedin:1400, gofundme:5200 },
  { day:"Fri", instagram:7100, tiktok:16500, youtube:3200, twitter:1600, linkedin:1200, gofundme:6800 },
  { day:"Sat", instagram:8900, tiktok:21000, youtube:4100, twitter:2100, linkedin:600,  gofundme:9100 },
  { day:"Sun", instagram:7400, tiktok:18200, youtube:3600, twitter:1800, linkedin:500,  gofundme:7800 },
];
const SENTIMENT = [
  { name:"Positive", value:61, color:"#22c55e" },
  { name:"Neutral",  value:28, color:"#94a3b8" },
  { name:"Negative", value:11, color:"#f87171" },
];
const COMMENTS_DATA = [
  { id:1, platform:"tiktok",    user:"@techfanatic99",  text:"Literally the product I've been waiting for 😭", sentiment:"positive", time:"2h", likes:342 },
  { id:2, platform:"instagram", user:"@minimalist.mai", text:"When does it ship to Europe?", sentiment:"neutral",  time:"3h", likes:89  },
  { id:3, platform:"gofundme",  user:"BackerMike",      text:"Backed at Founder tier. Will there be add-ons?", sentiment:"positive", time:"4h", likes:14  },
  { id:4, platform:"youtube",   user:"@gadgetguru",     text:"Audio dips around 3:20, might want to fix that.", sentiment:"neutral",  time:"5h", likes:27  },
  { id:5, platform:"twitter",   user:"@skepticSam",     text:"Show me real benchmarks before I believe this.", sentiment:"negative", time:"6h", likes:11  },
  { id:6, platform:"linkedin",  user:"Jennifer K.",     text:"Impressive team. Following this closely.", sentiment:"positive", time:"8h", likes:44  },
];
const MSGS_DATA = [
  { id:1, from:"Sarah", time:"9:14 AM",  text:"TikTok reel is ready for review 🎬", unread:true },
  { id:2, from:"You",   time:"9:22 AM",  text:"On it — will check before noon." },
  { id:3, from:"Sarah", time:"9:24 AM",  text:"Should we push LinkedIn to next week?" },
  { id:4, from:"You",   time:"9:31 AM",  text:"Good call. Move it to April 30th." },
  { id:5, from:"Sarah", time:"10:02 AM", text:"Done! GoFundMe update #7 ready for review 🚀", unread:true },
];
const TASKS_DATA = [
  { id:1, text:"Review TikTok script",          assignee:"You",   due:"Today",  priority:"high", done:false },
  { id:2, text:"Approve content calendar",      assignee:"Sarah", due:"Today",  priority:"high", done:false },
  { id:3, text:"Export GoFundMe donor report",  assignee:"You",   due:"Apr 25", priority:"med",  done:false },
  { id:4, text:"Write LinkedIn article draft",  assignee:"Sarah", due:"Apr 25", priority:"med",  done:true  },
  { id:5, text:"Respond to YouTube comments",   assignee:"Sarah", due:"Apr 26", priority:"low",  done:false },
];
const DEFAULT_GFM = { title:"Help Us Launch", url:"", goal:100000, raised:73400, donors:892, daysLeft:12, latestUpdate:"We've hit 73% of our goal — thank you to every backer!" };

// ─────────────────────────────────────────────────────────────────────────────
// CMS SEED DATA
// ─────────────────────────────────────────────────────────────────────────────
const CMS_SEED = [
  { id:1,  title:"Product Reveal — Hero Reel",        type:"Video",    status:"posted",     platforms:["tiktok","instagram","youtube"], assignee:"Sarah", due:"Apr 18", notes:"Hit 200K views on TikTok",          tags:["launch","hero"] },
  { id:2,  title:"Founder Story — Why We Built This", type:"Video",    status:"posted",     platforms:["youtube","linkedin"],           assignee:"Sarah", due:"Apr 20", notes:"Strong LinkedIn engagement",        tags:["founder","story"] },
  { id:3,  title:"Behind the Scenes — Studio Tour",   type:"Video",    status:"editing",    platforms:["tiktok","instagram"],           assignee:"Sarah", due:"Apr 25", notes:"Cut needs music + colour grade",    tags:["bts","studio"] },
  { id:4,  title:"Backer Milestone #7 Update",        type:"Article",  status:"needs_post", platforms:["gofundme","linkedin"],          assignee:"You",   due:"Apr 24", notes:"Approved — ready to publish",       tags:["crowdfunding","milestone"] },
  { id:5,  title:"Product Feature Deep Dive",         type:"Carousel", status:"needs_post", platforms:["instagram","linkedin"],         assignee:"Sarah", due:"Apr 24", notes:"Design done, caption finalised",    tags:["product","feature"] },
  { id:6,  title:"Community Q&A Thread",              type:"Thread",   status:"needs_post", platforms:["twitter"],                      assignee:"You",   due:"Apr 25", notes:"Draft approved by team",            tags:["community","engagement"] },
  { id:7,  title:"Unboxing Walkthrough Tutorial",     type:"Video",    status:"editing",    platforms:["youtube","tiktok"],             assignee:"Sarah", due:"Apr 26", notes:"Waiting on intro voiceover",        tags:["tutorial","product"] },
  { id:8,  title:"Team Spotlight — Meet Sarah",       type:"Article",  status:"needs_record",platforms:["linkedin","instagram"],        assignee:"You",   due:"Apr 28", notes:"Script approved, filming TBD",      tags:["team","culture"] },
  { id:9,  title:"April Crowdfunding Recap",          type:"Video",    status:"needs_record",platforms:["youtube","gofundme"],          assignee:"Sarah", due:"Apr 30", notes:"Outline ready, needs filming",      tags:["crowdfunding","recap"] },
  { id:10, title:"Product vs Competitor Analysis",   type:"Carousel", status:"needs_record",platforms:["instagram","twitter"],         assignee:"You",   due:"May 2",  notes:"Research done, design not started", tags:["product","comparison"] },
  { id:11, title:"GoFundMe Thank You Video",         type:"Video",    status:"needs_record",platforms:["gofundme","youtube","instagram"],assignee:"Sarah",due:"May 3",  notes:"Script in progress",                tags:["crowdfunding","gratitude"] },
  { id:12, title:"May Content Calendar Teaser",      type:"Story",    status:"needs_record",platforms:["instagram","tiktok"],          assignee:"Sarah", due:"Apr 30", notes:"Not started",                       tags:["teaser","calendar"] },
];

const CMS_STATUSES = [
  { id:"needs_record", label:"Needs Recording", color:"#f97316", bg:"#fff7ed", border:"#fed7aa", icon:"🎬" },
  { id:"editing",      label:"In Editing",      color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe", icon:"✂️" },
  { id:"needs_post",   label:"Ready to Post",   color:"#0ea5e9", bg:"#f0f9ff", border:"#bae6fd", icon:"📤" },
  { id:"posted",       label:"Posted",          color:"#22c55e", bg:"#f0fdf4", border:"#bbf7d0", icon:"✅" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function fmt(n) { return n>=1e6?(n/1e6).toFixed(1)+"M":n>=1000?(n/1000).toFixed(1)+"K":n; }
function getPl(id) { return PLATFORMS.find(p=>p.id===id); }
function getSt(id) { return CMS_STATUSES.find(s=>s.id===id); }

function PlatBadge({ id }) {
  const p = getPl(id);
  return <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border" style={{ background: p?.color+"14", borderColor: p?.color+"30", color: p?.color }}>{p?.icon} {p?.label}</span>;
}

function StatusPill({ status }) {
  const s = getSt(status);
  return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: s?.bg, borderColor: s?.border, color: s?.color }}>{s?.icon} {s?.label}</span>;
}

function ScBadge({ status }) {
  const m = { scheduled:"bg-emerald-50 text-emerald-700 border-emerald-200", draft:"bg-amber-50 text-amber-700 border-amber-200", review:"bg-blue-50 text-blue-700 border-blue-200" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${m[status]}`}>{status[0].toUpperCase()+status.slice(1)}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// AI CONTENT AGENT
// ─────────────────────────────────────────────────────────────────────────────
const AGENT_SYSTEM = `You are Orbit AI, a specialist social media strategist and content agent for a product studio running an active crowdfunding campaign on GoFundMe.

The studio is across Instagram, TikTok, YouTube, X/Twitter, LinkedIn, and GoFundMe. Their existing content covers: product reveals, founder stories, behind-the-scenes studio footage, backer milestone updates, tutorials/unboxings, team spotlights, and community Q&As.

Their goals: drive awareness of the product, grow GoFundMe backers, build community trust, and grow social following.

When the user asks for suggestions, you should:
1. Reference what's already working (high-engagement content types)
2. Identify trending formats relevant to their niche (product/tech/crowdfunding)
3. Suggest specific, actionable content ideas with: title, format, platforms, why it'll work, and a brief caption/hook
4. Prioritise content that crosses over between social traction AND crowdfunding conversion
5. Keep suggestions creative, specific, and ready to brief to a content creator

Format your suggestions clearly. When listing ideas use this structure:
**[Title]** | [Platform(s)] | [Format]
Hook: ...
Why it works: ...
Caption: ...

Be conversational but sharp. You're a strategic partner, not a generic chatbot.`;

function AIAgent({ cmsItems }) {
  const [messages, setMessages] = useState([
    { role:"assistant", content:"Hey! I'm Orbit AI 👋 I'm here to help you plan content that drives both social traction and GoFundMe conversions.\n\nTell me what you need — I can suggest new ideas based on trending formats, analyse what's working in your existing library, or help you plan your next campaign push. What are we focusing on?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat"); // chat | suggestions
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, loading]);

  const existingContent = cmsItems.map(i=>`"${i.title}" (${i.type}, ${i.status}, platforms: ${i.platforms.join(",")})`).join("\n");

  async function send(overrideMsg) {
    const text = overrideMsg || input.trim();
    if (!text) return;
    setInput("");
    const newMessages = [...messages, { role:"user", content:text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: AGENT_SYSTEM + `\n\nExisting content library:\n${existingContent}`,
          messages: newMessages,
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b=>b.type==="text")?.text || "Sorry, something went wrong.";
      setMessages(m=>[...m,{ role:"assistant", content:reply }]);
    } catch(e) {
      setMessages(m=>[...m,{ role:"assistant", content:"Connection error — please try again." }]);
    }
    setLoading(false);
  }

  const QUICK_PROMPTS = [
    "Suggest 3 TikTok ideas that could go viral this week",
    "What content would drive the most GoFundMe conversions right now?",
    "We're at 73% funded — what should we post to push to 100%?",
    "What trending formats should we adapt for our product niche?",
    "Analyse our existing content and tell me what we should do more of",
    "Give me a 7-day content sprint plan across all platforms",
  ];

  function renderMessage(msg) {
    const lines = msg.content.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.includes("**")) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return <p key={i} className="mb-1">{parts.map((part,j)=>part.startsWith("**")?<strong key={j} className="font-semibold text-slate-800">{part.replace(/\*\*/g,"")}</strong>:<span key={j}>{part}</span>)}</p>;
      }
      if (line.startsWith("Hook:") || line.startsWith("Why it works:") || line.startsWith("Caption:")) {
        const [label,...rest] = line.split(":");
        return <p key={i} className="mb-1"><span className="font-semibold text-slate-600">{label}:</span>{rest.join(":")}</p>;
      }
      if (line.match(/^\d+\./)) return <p key={i} className="mb-1 pl-2">{line}</p>;
      if (line === "") return <div key={i} className="h-2"/>;
      return <p key={i} className="mb-0.5">{line}</p>;
    });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🤖</div>
        <div className="flex-1">
          <p className="text-white font-bold text-base">Orbit AI — Content Strategy Agent</p>
          <p className="text-slate-300 text-xs mt-0.5">Powered by Claude · Analyses your library + live trends · Suggests platform-specific content</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          <span className="text-emerald-300 text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Quick prompts */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Quick Prompts</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p,i)=>(
            <button key={i} onClick={()=>send(p)} disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-800 hover:text-slate-800 transition-all disabled:opacity-40">
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-[420px] overflow-y-auto p-5 space-y-4">
          {messages.map((msg,i)=>(
            <div key={i} className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}>
              {msg.role==="assistant" && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">🤖</div>
              )}
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role==="user" ? "bg-slate-800 text-white rounded-br-sm" : "bg-slate-50 border border-slate-100 text-slate-700 rounded-bl-sm"}`}>
                {msg.role==="assistant" ? renderMessage(msg) : msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-sm mr-2 flex-shrink-0">🤖</div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:"0ms"}}/>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:"150ms"}}/>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay:"300ms"}}/>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div className="border-t border-slate-100 p-3 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&send()}
            placeholder="Ask for content ideas, trend analysis, campaign strategy…"
            disabled={loading}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-slate-400 disabled:opacity-50"/>
          <button onClick={()=>send()} disabled={loading||!input.trim()}
            className="px-5 py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-40">
            Send
          </button>
        </div>
      </div>

      {/* CMS Context panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">🧠 Agent Context — Your Content Library</p>
        <p className="text-xs text-slate-500 leading-relaxed">The agent has access to your full CMS ({cmsItems.length} pieces) including status, platforms, and tags. It uses this alongside trending format knowledge to give you personalised, non-generic suggestions.</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {["product launch","crowdfunding","founder story","bts","tutorial","community","team","milestone"].map(t=>(
            <span key={t} className="text-xs text-slate-500 bg-white border border-slate-200 rounded-full px-2 py-0.5">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CMS
// ─────────────────────────────────────────────────────────────────────────────
function CMS() {
  const [items, setItems] = useState(CMS_SEED);
  const [view, setView] = useState("board"); // board | list
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title:"", type:"Video", status:"needs_record", platforms:[], assignee:"", due:"", notes:"", tags:"" });

  const filtered = items.filter(item=>{
    const matchStatus = filter==="all" || item.status===filter;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.tags.join(" ").includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  function addItem() {
    if (!newItem.title) return;
    setItems(prev=>[...prev,{ ...newItem, id:Date.now(), tags: typeof newItem.tags==="string" ? newItem.tags.split(",").map(t=>t.trim()).filter(Boolean) : newItem.tags }]);
    setNewItem({ title:"", type:"Video", status:"needs_record", platforms:[], assignee:"", due:"", notes:"", tags:"" });
    setShowAdd(false);
  }

  function updateStatus(id, status) {
    setItems(prev=>prev.map(i=>i.id===id?{...i,status}:i));
  }

  function deleteItem(id) {
    setItems(prev=>prev.filter(i=>i.id!==id));
  }

  function togglePlatform(platId) {
    setNewItem(prev=>({
      ...prev,
      platforms: prev.platforms.includes(platId) ? prev.platforms.filter(p=>p!==platId) : [...prev.platforms, platId]
    }));
  }

  const counts = CMS_STATUSES.reduce((acc,s)=>({ ...acc, [s.id]: items.filter(i=>i.status===s.id).length }), {});

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CMS_STATUSES.map(s=>(
          <button key={s.id} onClick={()=>setFilter(filter===s.id?"all":s.id)}
            className={`rounded-xl p-4 border text-left transition-all ${filter===s.id?"ring-2 ring-offset-1":"hover:shadow-sm"}`}
            style={{ background:s.bg, borderColor:filter===s.id?s.color:s.border }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{s.icon}</span>
              <span className="text-2xl font-bold" style={{color:s.color}}>{counts[s.id]}</span>
            </div>
            <p className="text-xs font-semibold" style={{color:s.color}}>{s.label}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search content…"
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-slate-400 w-48"/>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button onClick={()=>setView("board")} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view==="board"?"bg-white shadow-sm text-slate-800":"text-slate-500"}`}>Board</button>
          <button onClick={()=>setView("list")}  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view==="list" ?"bg-white shadow-sm text-slate-800":"text-slate-500"}`}>List</button>
        </div>
        <button onClick={()=>setShowAdd(!showAdd)} className="ml-auto px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors">+ Add Content</button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <p className="text-sm font-semibold text-slate-700">New Content Piece</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 font-medium block mb-1">Title *</label>
              <input value={newItem.title} onChange={e=>setNewItem(p=>({...p,title:e.target.value}))} placeholder="Content title"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Type</label>
              <select value={newItem.type} onChange={e=>setNewItem(p=>({...p,type:e.target.value}))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                {["Video","Article","Carousel","Story","Thread","Reel","Update","Podcast"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Status</label>
              <select value={newItem.status} onChange={e=>setNewItem(p=>({...p,status:e.target.value}))} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400">
                {CMS_STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Assignee</label>
              <input value={newItem.assignee} onChange={e=>setNewItem(p=>({...p,assignee:e.target.value}))} placeholder="You / Sarah"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/>
            </div>
            <div>
              <label className="text-xs text-slate-500 font-medium block mb-1">Due Date</label>
              <input type="date" value={newItem.due} onChange={e=>setNewItem(p=>({...p,due:e.target.value}))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 font-medium block mb-2">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map(p=>(
                  <button key={p.id} onClick={()=>togglePlatform(p.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${newItem.platforms.includes(p.id)?"text-white border-transparent":"bg-white text-slate-600 border-slate-200"}`}
                    style={newItem.platforms.includes(p.id)?{background:p.color}:{}}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 font-medium block mb-1">Notes</label>
              <textarea value={newItem.notes} onChange={e=>setNewItem(p=>({...p,notes:e.target.value}))} rows={2} placeholder="Any production notes…"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400 resize-none"/>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-slate-500 font-medium block mb-1">Tags (comma separated)</label>
              <input value={typeof newItem.tags==="string"?newItem.tags:newItem.tags.join(", ")} onChange={e=>setNewItem(p=>({...p,tags:e.target.value}))} placeholder="launch, product, trending"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={addItem} className="px-4 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition-colors">Add to CMS</button>
            <button onClick={()=>setShowAdd(false)} className="px-4 py-1.5 text-slate-500 text-xs font-medium rounded-lg hover:text-slate-700 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* BOARD VIEW */}
      {view==="board" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {CMS_STATUSES.map(col=>{
            const colItems = filtered.filter(i=>i.status===col.id);
            return (
              <div key={col.id} className="rounded-xl border p-3 space-y-2 min-h-[200px]" style={{background:col.bg, borderColor:col.border}}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span>{col.icon}</span>
                    <span className="text-xs font-bold" style={{color:col.color}}>{col.label}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{background:col.color}}>{colItems.length}</span>
                </div>
                {colItems.map(item=>(
                  <div key={item.id} className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm hover:shadow-md transition-shadow cursor-default">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold text-slate-800 leading-tight flex-1">{item.title}</p>
                      <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded flex-shrink-0">{item.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.platforms.map(pid=>{
                        const pl=getPl(pid);
                        return <span key={pid} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{background:pl?.color+"18",color:pl?.color}}>{pl?.icon} {pl?.label}</span>;
                      })}
                    </div>
                    {item.notes && <p className="text-[11px] text-slate-400 mb-2 leading-tight">{item.notes}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{item.assignee} · {item.due}</span>
                      <select value={item.status} onChange={e=>updateStatus(item.id,e.target.value)}
                        className="text-[10px] border border-slate-200 rounded px-1 py-0.5 outline-none cursor-pointer bg-white" style={{color:col.color}}>
                        {CMS_STATUSES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {colItems.length===0 && <p className="text-xs text-center py-6 opacity-40" style={{color:col.color}}>No items</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view==="list" && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3 hidden lg:table-cell">Platforms</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3 hidden lg:table-cell">Assignee</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3 hidden md:table-cell">Due</th>
                <th className="text-left text-xs font-semibold text-slate-500 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item,i)=>(
                <tr key={item.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i%2===0?"bg-white":"bg-slate-50/30"}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-800 text-xs">{item.title}</p>
                      {item.notes && <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px]">{item.notes}</p>}
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{item.type}</span>
                  </td>
                  <td className="px-3 py-3">
                    <select value={item.status} onChange={e=>updateStatus(item.id,e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer bg-white font-medium"
                      style={{color:getSt(item.status)?.color}}>
                      {CMS_STATUSES.map(s=><option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {item.platforms.map(pid=>{
                        const pl=getPl(pid);
                        return <span key={pid} className="text-[10px] px-1 rounded" style={{background:pl?.color+"14",color:pl?.color}}>{pl?.icon}</span>;
                      })}
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell text-xs text-slate-500">{item.assignee}</td>
                  <td className="px-3 py-3 hidden md:table-cell text-xs text-slate-500">{item.due}</td>
                  <td className="px-3 py-3">
                    <button onClick={()=>deleteItem(item.id)} className="text-xs text-slate-300 hover:text-rose-400 transition-colors">✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0 && <div className="text-center py-12 text-slate-400 text-sm">No content matches your filter.</div>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────
function Analytics({ conns, gfm }) {
  const [active, setActive] = useState("tiktok");
  const data = DUMMY[active];
  const plat = getPl(active);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map(p=>(
          <button key={p.id} onClick={()=>setActive(p.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${active===p.id?"text-white border-transparent shadow-sm":"bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}
            style={active===p.id?{background:p.color}:{}}>
            {p.icon} {p.label}{conns[p.id]&&<span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>}
          </button>
        ))}
      </div>
      {!conns[active]&&<div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 flex items-center gap-3"><span className="text-xl">{plat?.icon}</span><p className="text-sm text-slate-500">Showing <strong>demo data</strong> for {plat?.label}. Connect in <strong>Connect</strong> tab for live stats.</p></div>}
      {active==="gofundme"?(
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">{gfm.title}</p>
            <div className="flex justify-between text-xs text-slate-500 mb-1"><span>${fmt(gfm.raised)} raised</span><span>Goal: ${fmt(gfm.goal)}</span></div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-1"><div className="h-full rounded-full bg-emerald-400" style={{width:`${Math.min((gfm.raised/gfm.goal)*100,100)}%`}}/></div>
            <p className="text-xs text-emerald-600 font-semibold">{Math.round((gfm.raised/gfm.goal)*100)}% funded · {fmt(gfm.donors)} donors · {gfm.daysLeft} days left</p>
          </div>
        </div>
      ):(
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[{l:"Followers",v:fmt(data.followers)},{l:"Growth",v:`${data.growth>0?"+":""}${data.growth}%`,c:data.growth>=0?"text-emerald-600":"text-rose-500"},{l:"Impressions",v:fmt(data.impressions)},{l:"Eng. Rate",v:`${data.engagement}%`},{l:"Reach",v:fmt(data.reach)},{l:"Clicks",v:fmt(data.clicks)}].map(k=>(
              <div key={k.l} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{k.l}</p>
                <p className={`text-xl font-bold text-slate-800 ${k.c||""}`}>{k.v}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <p className="text-sm font-semibold text-slate-700 mb-4">Weekly Impressions — All Platforms</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={WEEKLY}>
                <defs>{PLATFORMS.map(p=><linearGradient key={p.id} id={`g${p.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={p.color} stopOpacity={0.15}/><stop offset="95%" stopColor={p.color} stopOpacity={0}/></linearGradient>)}</defs>
                <XAxis dataKey="day" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={fmt}/>
                <Tooltip formatter={(v,n)=>[fmt(v),getPl(n)?.label||n]} contentStyle={{borderRadius:10,border:"1px solid #e2e8f0",fontSize:12}}/>
                {PLATFORMS.map(p=><Area key={p.id} type="monotone" dataKey={p.id} stroke={p.color} fill={`url(#g${p.id})`} strokeWidth={active===p.id?2.5:1} strokeOpacity={active===p.id?1:0.3} dot={false}/>)}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULER
// ─────────────────────────────────────────────────────────────────────────────
const SCHED_SEED = [
  { id:1, title:"Product launch teaser reel",    platform:"tiktok",    date:"Apr 24", time:"10:00 AM", status:"scheduled", type:"Video" },
  { id:2, title:"Behind-the-scenes carousel",    platform:"instagram", date:"Apr 24", time:"12:30 PM", status:"scheduled", type:"Carousel" },
  { id:3, title:"Campaign milestone update",     platform:"gofundme",  date:"Apr 24", time:"2:00 PM",  status:"scheduled", type:"Update" },
  { id:4, title:"Q&A thread: ask us anything",  platform:"twitter",   date:"Apr 25", time:"9:00 AM",  status:"draft",     type:"Thread" },
  { id:5, title:"Team spotlight — meet Sarah",  platform:"linkedin",  date:"Apr 25", time:"11:00 AM", status:"draft",     type:"Article" },
  { id:6, title:"Unboxing walkthrough tutorial",platform:"youtube",   date:"Apr 26", time:"3:00 PM",  status:"review",    type:"Video" },
];
function Scheduler() {
  const [posts, setPosts] = useState(SCHED_SEED);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [np, setNp] = useState({title:"",platform:"instagram",date:"",time:"",type:"Post"});
  const filtered = filter==="all"?posts:posts.filter(p=>p.status===filter);
  function add(){if(!np.title||!np.date||!np.time)return;setPosts(p=>[...p,{...np,id:Date.now(),status:"draft"}]);setNp({title:"",platform:"instagram",date:"",time:"",type:"Post"});setShowForm(false);}
  return(
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">{["all","scheduled","review","draft"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter===f?"bg-white shadow-sm text-slate-800":"text-slate-500 hover:text-slate-700"}`}>{f[0].toUpperCase()+f.slice(1)}</button>)}</div>
        <button onClick={()=>setShowForm(!showForm)} className="ml-auto px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors">+ Schedule Post</button>
      </div>
      {showForm&&<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3"><p className="text-sm font-semibold text-slate-700">New Post</p><input value={np.title} onChange={e=>setNp(p=>({...p,title:e.target.value}))} placeholder="Post title" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><select value={np.platform} onChange={e=>setNp(p=>({...p,platform:e.target.value}))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">{PLATFORMS.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><select value={np.type} onChange={e=>setNp(p=>({...p,type:e.target.value}))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">{["Post","Video","Story","Reel","Thread","Article","Carousel","Update"].map(t=><option key={t}>{t}</option>)}</select><input type="date" value={np.date} onChange={e=>setNp(p=>({...p,date:e.target.value}))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"/><input type="time" value={np.time} onChange={e=>setNp(p=>({...p,time:e.target.value}))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"/></div><div className="flex gap-2"><button onClick={add} className="px-4 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg">Add</button><button onClick={()=>setShowForm(false)} className="px-4 py-1.5 text-slate-500 text-xs font-medium rounded-lg">Cancel</button></div></div>}
      <div className="space-y-2">{filtered.map(post=>{const pl=getPl(post.platform);return(<div key={post.id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-4 hover:border-slate-200 transition-colors"><div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{background:pl?.color+"18"}}>{pl?.icon}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{post.title}</p><p className="text-xs text-slate-400">{pl?.label} · {post.type}</p></div><div className="text-right flex-shrink-0"><p className="text-xs font-medium text-slate-700">{post.date}</p><p className="text-xs text-slate-400">{post.time}</p></div><ScBadge status={post.status}/></div>);})}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────
function Projects() {
  const [tasks, setTasks] = useState(TASKS_DATA);
  const [nt, setNt] = useState("");
  const pc={high:"bg-rose-100 text-rose-600",med:"bg-amber-100 text-amber-600",low:"bg-slate-100 text-slate-500"};
  return(
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">{[{l:"Total",v:tasks.length,i:"📋"},{l:"Done",v:tasks.filter(t=>t.done).length,i:"✅"},{l:"Remaining",v:tasks.filter(t=>!t.done).length,i:"⏳"}].map(s=><div key={s.l} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 text-center"><p className="text-2xl mb-1">{s.i}</p><p className="text-xl font-bold text-slate-800">{s.v}</p><p className="text-xs text-slate-400">{s.l}</p></div>)}</div>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5"><p className="text-sm font-semibold text-slate-700 mb-4">Task Board</p><div className="flex gap-2 mb-4"><input value={nt} onChange={e=>setNt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&nt.trim()&&(setTasks(p=>[...p,{id:Date.now(),text:nt,assignee:"You",due:"TBD",priority:"med",done:false}]),setNt(""))} placeholder="Add a task…" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/></div>
      <div className="space-y-2">{tasks.map(t=><div key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${t.done?"bg-slate-50 border-slate-100 opacity-60":"bg-white border-slate-100 hover:border-slate-200"}`}><input type="checkbox" checked={t.done} onChange={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,done:!x.done}:x))} className="w-4 h-4 accent-slate-700 cursor-pointer flex-shrink-0"/><p className={`text-sm flex-1 ${t.done?"line-through text-slate-400":"text-slate-700"}`}>{t.text}</p><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pc[t.priority]}`}>{t.priority}</span><span className="text-xs text-slate-400">{t.assignee}</span><span className="text-xs text-slate-400">{t.due}</span></div>)}</div></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMS
// ─────────────────────────────────────────────────────────────────────────────
function Comms() {
  const [msgs,setMsgs]=useState(MSGS_DATA);const[inp,setInp]=useState("");
  const send=()=>{if(!inp.trim())return;setMsgs(p=>[...p,{id:Date.now(),from:"You",time:"Now",text:inp}]);setInp("");};
  return(
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-3 flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-600">S</div><div><p className="text-sm font-semibold text-slate-800">Sarah — Social Media Manager</p><p className="text-xs text-emerald-500 font-medium">● Online</p></div></div>
        <div className="p-5 space-y-3 h-72 overflow-y-auto">{msgs.map(m=><div key={m.id} className={`flex ${m.from==="You"?"justify-end":"justify-start"}`}><div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.from==="You"?"bg-slate-800 text-white rounded-br-sm":"bg-slate-100 text-slate-800 rounded-bl-sm"}`}>{m.text}<p className="text-xs mt-1 opacity-40">{m.time}</p></div></div>)}</div>
        <div className="border-t border-slate-100 p-3 flex gap-2"><input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Message Sarah…" className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-slate-400"/><button onClick={send} className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700 transition-colors">Send</button></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY
// ─────────────────────────────────────────────────────────────────────────────
function Community() {
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?COMMENTS_DATA:COMMENTS_DATA.filter(c=>c.sentiment===filter);
  const ss={positive:"bg-emerald-50 text-emerald-700 border-emerald-100",neutral:"bg-slate-50 text-slate-500 border-slate-200",negative:"bg-rose-50 text-rose-600 border-rose-100"};
  return(
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-slate-700 mb-4">Sentiment Breakdown</p>
        <div className="flex items-center gap-8 flex-wrap">
          <ResponsiveContainer width={140} height={140}><PieChart><Pie data={SENTIMENT} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>{SENTIMENT.map((s,i)=><Cell key={i} fill={s.color}/>)}</Pie><Tooltip formatter={v=>`${v}%`} contentStyle={{borderRadius:10,fontSize:12}}/></PieChart></ResponsiveContainer>
          <div className="space-y-2">{SENTIMENT.map(s=><div key={s.name} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{background:s.color}}/><span className="text-sm text-slate-600">{s.name}</span><span className="ml-6 text-sm font-bold text-slate-800">{s.value}%</span></div>)}</div>
        </div>
      </div>
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">{["all","positive","neutral","negative"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${filter===f?"bg-white shadow-sm text-slate-800":"text-slate-500"}`}>{f[0].toUpperCase()+f.slice(1)}</button>)}</div>
      <div className="space-y-2">{filtered.map(c=>{const pl=getPl(c.platform);return(<div key={c.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex gap-3 hover:border-slate-200 transition-colors"><div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{background:pl?.color+"18"}}>{pl?.icon}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1 flex-wrap"><p className="text-xs font-semibold text-slate-700">{c.user}</p><span className="text-xs text-slate-300">·</span><p className="text-xs text-slate-400">{pl?.label}</p><span className="text-xs text-slate-300">·</span><p className="text-xs text-slate-400">{c.time} ago</p><span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full border ${ss[c.sentiment]}`}>{c.sentiment}</span></div><p className="text-sm text-slate-600">{c.text}</p><div className="flex gap-3 mt-2"><span className="text-xs text-slate-400">♥ {c.likes}</span><button className="text-xs text-slate-400 hover:text-slate-700">Reply</button><button className="text-xs text-slate-400 hover:text-slate-700">Flag</button></div></div></div>);})}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONNECT
// ─────────────────────────────────────────────────────────────────────────────
function Connect({ conns, onConnect, onDisconnect, gfm, onGfm }) {
  const [editGfm,setEditGfm]=useState(false);const[gfForm,setGfForm]=useState(gfm);
  return(
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3"><span className="text-xl flex-shrink-0">⚠️</span><div><p className="text-sm font-semibold text-amber-800">Backend required for live OAuth</p><p className="text-xs text-amber-700 mt-0.5">Set up the Node.js server from the backend guide, add your keys to <code className="bg-amber-100 px-1 rounded">.env</code>, then these buttons trigger real OAuth. Connections here are simulated for demo.</p></div></div>
      {PLATFORMS.map(p=>{const conn=conns[p.id];return(
        <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background:p.color+"18"}}>{p.icon}</div>
            <div className="flex-1"><div className="flex items-center gap-2 flex-wrap"><p className="text-sm font-semibold text-slate-800">{p.label}</p>{p.note&&<span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">{p.note}</span>}</div>{conn?<p className="text-xs text-emerald-600 font-medium mt-0.5">✓ Connected{conn.handle?` as ${conn.handle}`:""}</p>:<p className="text-xs text-slate-400 mt-0.5">{p.manual?"Manual data entry":"OAuth integration"}</p>}</div>
            {p.manual?<button onClick={()=>setEditGfm(!editGfm)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">{editGfm?"Cancel":"Edit Data"}</button>:conn?<button onClick={()=>onDisconnect(p.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50">Disconnect</button>:<button onClick={()=>onConnect(p)} className="px-3 py-1.5 text-xs font-medium rounded-lg text-white hover:opacity-90" style={{background:p.color}}>Connect →</button>}
          </div>
          {p.manual&&editGfm&&(
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">{[{k:"title",l:"Title",t:"text"},{k:"url",l:"URL",t:"url"},{k:"goal",l:"Goal ($)",t:"number"},{k:"raised",l:"Raised ($)",t:"number"},{k:"donors",l:"Donors",t:"number"},{k:"daysLeft",l:"Days Left",t:"number"}].map(f=><div key={f.k}><label className="text-xs text-slate-500 font-medium block mb-1">{f.l}</label><input type={f.t} value={gfForm[f.k]||""} onChange={e=>setGfForm(x=>({...x,[f.k]:f.t==="number"?Number(e.target.value):e.target.value}))} className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-slate-400"/></div>)}</div>
              <textarea rows={2} value={gfForm.latestUpdate||""} onChange={e=>setGfForm(x=>({...x,latestUpdate:e.target.value}))} placeholder="Latest update…" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none resize-none"/>
              <button onClick={()=>{onGfm(gfForm);setEditGfm(false);}} className="px-4 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-700">Save</button>
            </div>
          )}
        </div>
      );})}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  { id:"analytics", label:"Analytics", icon:"📈" },
  { id:"cms",        label:"CMS",       icon:"🗂️" },
  { id:"agent",      label:"AI Agent",  icon:"🤖" },
  { id:"scheduler",  label:"Scheduler", icon:"🗓️" },
  { id:"projects",   label:"Projects",  icon:"📋" },
  { id:"comms",      label:"Comms",     icon:"💬" },
  { id:"community",  label:"Community", icon:"🌐" },
  { id:"connect",    label:"Connect",   icon:"🔗" },
];

const DEFAULT_GFM_DATA = { title:"Help Us Launch", url:"", goal:100000, raised:73400, donors:892, daysLeft:12, latestUpdate:"We've hit 73% of our goal — thank you to every backer!" };

export default function App() {
  const [tab, setTab] = useState("analytics");
  const [conns, setConns] = useState({});
  const [gfm, setGfm] = useState(DEFAULT_GFM_DATA);
  const [cmsItems, setCmsItems] = useState(CMS_SEED);
  const connCount = Object.keys(conns).length;

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily:"'DM Sans','Helvetica Neue',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}`}</style>

      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center text-white text-xs font-bold">◈</div>
            <span className="font-bold text-slate-800 text-sm">Orbit</span>
            <span className="text-slate-300 text-xs ml-1 hidden md:block">Social Command</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 ml-3">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${connCount>0?"bg-emerald-50 text-emerald-700 border-emerald-200":"bg-slate-50 text-slate-500 border-slate-200"}`}>
              {connCount>0?`${connCount} connected`:"No accounts connected"}
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">💚 ${fmt(gfm.raised)} raised</span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full border bg-slate-50 text-slate-600 border-slate-200">🗂️ {cmsItems.length} content pieces</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600">S</div>
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">Y</div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 flex gap-0 overflow-x-auto">
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${tab===n.id?"border-slate-800 text-slate-800":"border-transparent text-slate-400 hover:text-slate-600"}`}>
              {n.icon} {n.label}
              {n.id==="connect"&&connCount>0&&<span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">{connCount}</span>}
              {n.id==="agent"&&<span className="text-[9px] font-bold px-1 py-0.5 rounded bg-violet-100 text-violet-600 border border-violet-200">AI</span>}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-6">
        {tab==="analytics"  && <Analytics conns={conns} gfm={gfm}/>}
        {tab==="cms"        && <CMS/>}
        {tab==="agent"      && <AIAgent cmsItems={cmsItems}/>}
        {tab==="scheduler"  && <Scheduler/>}
        {tab==="projects"   && <Projects/>}
        {tab==="comms"      && <Comms/>}
        {tab==="community"  && <Community/>}
        {tab==="connect"    && <Connect conns={conns} onConnect={p=>setConns(c=>({...c,[p.id]:{handle:`@your_${p.id}`}}))} onDisconnect={id=>setConns(c=>{const n={...c};delete n[id];return n;})} gfm={gfm} onGfm={setGfm}/>}
      </main>
    </div>
  );
}
