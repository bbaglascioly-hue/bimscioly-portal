import { useState, useEffect, useRef } from "react";

const uid = () => Math.random().toString(36).slice(2,9);

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_USERS = [
  { id:"admin",   password:"admin123",  role:"admin",  name:"Dr. Evelyn Park",  email:"epark@school.edu",    grade:null, school:null,           active:true },
  { id:"coach1",  password:"coach123",  role:"coach",  name:"Coach Rivera",     email:"crivera@lhs.edu",     grade:null, school:"Lincoln High",  active:true },
  { id:"coach2",  password:"coach456",  role:"coach",  name:"Coach Pham",       email:"cpham@oakridge.edu",  grade:null, school:"Oakridge Prep", active:true },
  { id:"member1", password:"pass123",   role:"member", name:"Alex Chen",        email:"achen@school.edu",    grade:11,   school:null,            active:true },
  { id:"member2", password:"pass456",   role:"member", name:"Jordan Kim",       email:"jkim@school.edu",     grade:10,   school:null,            active:true },
  { id:"member3", password:"pass789",   role:"member", name:"Riley Wang",       email:"rwang@school.edu",    grade:12,   school:null,            active:true },
];

const SEED_INVITATIONALS = [
  {
    id:"inv-1", name:"Westfield Fall Invitational", date:"2024-10-19",
    location:"Westfield High School", division:"Division C", status:"closed",
    registrationDeadline:"2024-10-05", maxTeams:30, description:"Our annual fall invitational open to all Division C teams in the region.",
    teamNumberPrefix:"C",
    events:[
      { id:"e1", name:"Anatomy & Physiology", category:"Life Science",     room:"204",      capacity:15,
        supervisorRoles:[
          {id:"r1",label:"Head Supervisor",      assignedName:"Dr. Malik",  assignedEmail:"dmalik@x.com",   status:"confirmed"},
          {id:"r2",label:"Proctor",              assignedName:"",           assignedEmail:"",               status:"open"},
        ]},
      { id:"e2", name:"Astronomy",            category:"Earth & Space",    room:"118",      capacity:15,
        supervisorRoles:[{id:"r3",label:"Head Supervisor",assignedName:"",assignedEmail:"",status:"open"}]},
      { id:"e3", name:"Bridge",               category:"Engineering",      room:"Gym A",    capacity:20,
        supervisorRoles:[
          {id:"r4",label:"Head Supervisor",      assignedName:"Ms. Torres", assignedEmail:"mtorres@x.com",  status:"confirmed"},
          {id:"r5",label:"Proctor",              assignedName:"",           assignedEmail:"",               status:"open"},
          {id:"r6",label:"Score Runner",         assignedName:"",           assignedEmail:"",               status:"open"},
        ]},
      { id:"e4", name:"Chemistry Lab",        category:"Physical Science", room:"Lab 1",    capacity:12,
        supervisorRoles:[
          {id:"r7",label:"Head Supervisor",      assignedName:"",assignedEmail:"",status:"open"},
          {id:"r8",label:"Lab Safety Monitor",   assignedName:"",assignedEmail:"",status:"open"},
        ]},
      { id:"e5", name:"Codebusters",          category:"Technology",       room:"Comp Lab", capacity:18,
        supervisorRoles:[{id:"r9",label:"Head Supervisor",assignedName:"",assignedEmail:"",status:"open"}]},
    ],
    buildSlots:[
      {id:"b1",time:"9:00–10:00 AM",  event:"Bridge",  location:"Gym A",    capacity:3, volunteers:["Coach Rivera"]},
      {id:"b2",time:"10:00–11:00 AM", event:"Tower",   location:"Gym B",    capacity:3, volunteers:[]},
      {id:"b3",time:"1:00–2:00 PM",   event:"Flight",  location:"Cafeteria",capacity:4, volunteers:["Coach Pham"]},
    ],
    volunteers:[
      {name:"Emma Johnson",email:"ej@x.com",  pref:"Proctoring"},
      {name:"Noah Smith",  email:"ns@y.com",  pref:"Setup"},
    ],
    appeals:[
      {id:"a1",type:"Inquiry",event:"Astronomy",subject:"Room change request",   status:"Resolved",date:"Oct 3", school:"Lincoln High", body:"Can we move to a larger room?"},
      {id:"a2",type:"Appeal", event:"Bridge",   subject:"Scoring discrepancy",   status:"Pending", date:"Oct 19",school:"Oakridge Prep",body:"Our team believes the bridge weight was recorded incorrectly."},
    ],
    proposedSupervisors:[
      {id:"ps1",name:"Dr. Malik",   email:"dmalik@x.com",  event:"Anatomy & Physiology",roleId:"r1",roleLabel:"Head Supervisor",school:"Lincoln High",  status:"confirmed"},
      {id:"ps2",name:"Ms. Torres",  email:"mtorres@x.com", event:"Bridge",              roleId:"r4",roleLabel:"Head Supervisor",school:"Lincoln High",  status:"confirmed"},
      {id:"ps3",name:"Mr. Kim",     email:"mkim@x.com",    event:"Chemistry Lab",       roleId:"r7",roleLabel:"Head Supervisor",school:"Oakridge Prep", status:"pending"},
    ],
    registeredSchools:[
      { school:"Lincoln High",  coach:"Coach Rivera", teamCount:2, confirmed:true,
        teams:[
          {id:"lh-t1",teamNumber:"C01",teamSuffix:"Alpha",students:[
            {id:"s1",firstName:"Maya",  lastName:"Torres",  grade:11},
            {id:"s2",firstName:"Ethan", lastName:"Brooks",  grade:11},
            {id:"s3",firstName:"Sofia", lastName:"Nguyen",  grade:12},
            {id:"s4",firstName:"Liam",  lastName:"Carter",  grade:10},
          ]},
          {id:"lh-t2",teamNumber:"C02",teamSuffix:"Beta",students:[
            {id:"s5",firstName:"Ava",   lastName:"Mitchell",grade:11},
            {id:"s6",firstName:"Noah",  lastName:"Patel",   grade:12},
          ]},
        ]},
      { school:"Oakridge Prep", coach:"Coach Pham",   teamCount:1, confirmed:true,
        teams:[
          {id:"op-t1",teamNumber:"",teamSuffix:"",students:[
            {id:"s7",firstName:"Zoe",   lastName:"Kim",  grade:10},
            {id:"s8",firstName:"Lucas", lastName:"Chen", grade:11},
          ]},
        ]},
      { school:"Maplewood MS",  coach:"Coach Davis",  teamCount:1, confirmed:false, teams:[] },
    ],
  },
  {
    id:"inv-2", name:"Westfield Spring Classic", date:"2025-03-22",
    location:"Westfield High School", division:"Division B", status:"open",
    registrationDeadline:"2025-03-08", maxTeams:24, description:"Division B spring invitational for middle school teams.",
    teamNumberPrefix:"C",
    events:[
      {id:"e1",name:"Anatomy & Physiology",category:"Life Science",  room:"204",  capacity:15, supervisorRoles:[{id:"ra1",label:"Head Supervisor",assignedName:"",assignedEmail:"",status:"open"}]},
      {id:"e2",name:"Disease Detectives",  category:"Life Science",  room:"206",  capacity:15, supervisorRoles:[{id:"ra2",label:"Head Supervisor",assignedName:"",assignedEmail:"",status:"open"}]},
      {id:"e3",name:"Boomilever",          category:"Engineering",   room:"Gym A",capacity:20, supervisorRoles:[{id:"ra3",label:"Head Supervisor",assignedName:"",assignedEmail:"",status:"open"}]},
      {id:"e4",name:"Rocks & Minerals",    category:"Earth Science", room:"Lab 2",capacity:15, supervisorRoles:[{id:"ra4",label:"Head Supervisor",assignedName:"",assignedEmail:"",status:"open"}]},
    ],
    buildSlots:[
      {id:"b1",time:"9:00–10:00 AM",   event:"Boomilever",location:"Gym A",capacity:3,volunteers:[]},
      {id:"b2",time:"11:00 AM–12:00 PM",event:"Tower",    location:"Gym B", capacity:3,volunteers:[]},
    ],
    volunteers:[], appeals:[], proposedSupervisors:[], registeredSchools:[],
  },
];

const SEED_CONFIG = {
  teamName:"Westfield Science Olympiad", school:"Westfield High School",
  division:"Division C", season:"2024–2025", accentColor:"#00c2a8", motto:"Explore. Discover. Excel.",
};

const SEED_LEADERSHIP = [
  {id:"l1",name:"Dr. Evelyn Park",  role:"Head Coach",    email:"epark@school.edu",  phone:"555-0101",bio:"PhD in Biology. 12 years coaching Science Olympiad."},
  {id:"l2",name:"Mr. James Okafor", role:"Asst. Coach",   email:"jokafor@school.edu",phone:"555-0102",bio:"Chemistry teacher and events coordinator."},
  {id:"l3",name:"Priya Nair",       role:"Team Captain",  email:"pnair@school.edu",  phone:"555-0103",bio:"Senior, specializing in life sciences events."},
  {id:"l4",name:"Marcus Lee",       role:"Vice Captain",  email:"mlee@school.edu",   phone:"555-0104",bio:"Junior, strong in engineering and build events."},
];

const SEED_TOURNAMENTS = [
  { id:"t1", name:"Regional Invitational",   date:"2025-02-08", location:"Central High School",    status:"upcoming",
    schedule:[
      {id:"s1",type:"general",time:"07:30",activity:"Arrival & Check-in",   room:"Main Entrance"},
      {id:"s2",type:"general",time:"08:00",activity:"Opening Ceremony",      room:"Auditorium"},
      {id:"s3",type:"event",  time:"09:00",activity:"Anatomy & Physiology",  room:"Rm 204"},
      {id:"s4",type:"event",  time:"10:30",activity:"Astronomy",             room:"Rm 118"},
      {id:"s5",type:"lunch",  time:"12:00",activity:"Lunch Break",           room:"Cafeteria"},
      {id:"s6",type:"event",  time:"13:00",activity:"Bridge Build",          room:"Gym"},
      {id:"s7",type:"general",time:"15:00",activity:"Awards Ceremony",       room:"Auditorium"},
    ]},
  { id:"t2", name:"State Qualifier",         date:"2025-03-15", location:"State University Campus", status:"upcoming", schedule:[] },
  { id:"t3", name:"State Championship",      date:"2025-04-26", location:"State Fairgrounds",       status:"future",   schedule:[] },
];

const SEED_EVENT_POOL = [
  {id:"ep1",  name:"Anatomy & Physiology",   cat:"Life Science"},
  {id:"ep2",  name:"Astronomy",              cat:"Earth & Space"},
  {id:"ep3",  name:"Boomilever",             cat:"Engineering"},
  {id:"ep4",  name:"Bridge",                 cat:"Engineering"},
  {id:"ep5",  name:"Chemistry Lab",          cat:"Physical Science"},
  {id:"ep6",  name:"Codebusters",            cat:"Technology"},
  {id:"ep7",  name:"Disease Detectives",     cat:"Life Science"},
  {id:"ep8",  name:"Dynamic Planet",         cat:"Earth & Space"},
  {id:"ep9",  name:"Experimental Design",    cat:"Physical Science"},
  {id:"ep10", name:"Forensics",              cat:"Life Science"},
  {id:"ep11", name:"Geologic Mapping",       cat:"Earth Science"},
  {id:"ep12", name:"Molecule Models",        cat:"Physical Science"},
  {id:"ep13", name:"Rocks & Minerals",       cat:"Earth Science"},
  {id:"ep14", name:"Tower",                  cat:"Engineering"},
  {id:"ep15", name:"Wind Power",             cat:"Engineering"},
  {id:"ep16", name:"Write It Do It",         cat:"General"},
];

const SEED_EVENT_CATS = ["Life Science","Earth & Space","Physical Science","Engineering","Technology","Earth Science","Chemistry","General"];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtDate = d => d ? new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—";
const initials = (name="") => name.split(" ").map(p=>p[0]).join("").toUpperCase().slice(0,2);
const fmt12 = t => {
  if(!t) return "";
  const [h,m]=t.split(":").map(Number);
  return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`;
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:"#070f1a", card:"#0d1e36", border:"rgba(255,255,255,0.07)",
  txt:"#e2e8f0", sub:"#94a3b8", muted:"#475569",
  accent:"#00c2a8", danger:"#ef4444",
};

// ─── BASE COMPONENTS ──────────────────────────────────────────────────────────
const Card = ({children,style,onClick}) => (
  <div onClick={onClick} style={{
    background:C.card, border:`1px solid ${C.border}`, borderRadius:14,
    padding:18, ...style,
  }}>{children}</div>
);

const Btn = ({children,onClick,variant="primary",small=false,style={}}) => {
  const v = {
    primary: {bg:`${C.accent}18`,border:C.accent,color:C.accent},
    ghost:   {bg:"rgba(255,255,255,0.04)",border:C.border,color:C.sub},
    danger:  {bg:"rgba(239,68,68,0.1)",border:"rgba(239,68,68,0.4)",color:"#ef4444"},
    success: {bg:"rgba(16,185,129,0.1)",border:"rgba(16,185,129,0.4)",color:"#10b981"},
    warn:    {bg:"rgba(245,158,11,0.1)",border:"rgba(245,158,11,0.4)",color:"#f59e0b"},
  }[variant]||{};
  return (
    <button onClick={onClick} style={{
      background:v.bg, border:`1px solid ${v.border}`, color:v.color,
      borderRadius:9, padding:small?"5px 12px":"9px 18px",
      fontSize:small?11:13, fontWeight:700, cursor:"pointer",
      fontFamily:"inherit", whiteSpace:"nowrap", ...style,
    }}>{children}</button>
  );
};

const Pill = ({label,active,onClick}) => (
  <button onClick={onClick} style={{
    padding:"7px 16px", borderRadius:20, fontFamily:"inherit", cursor:"pointer",
    border:`1px solid ${active?"rgba(0,194,168,0.5)":C.border}`,
    background:active?"rgba(0,194,168,0.1)":"transparent",
    color:active?C.accent:C.muted, fontWeight:700, fontSize:12,
  }}>{label}</button>
);

const Badge = ({label,color="#64748b"}) => (
  <span style={{
    background:`${color}20`, border:`1px solid ${color}50`,
    color:color, borderRadius:20, padding:"2px 9px",
    fontSize:10, fontWeight:700, whiteSpace:"nowrap",
  }}>{label}</span>
);

const AV = ({name="",size=36,color}) => (
  <div style={{
    width:size, height:size, borderRadius:"50%", flexShrink:0,
    background:color||`hsl(${(name.charCodeAt(0)||65)*5%360},50%,35%)`,
    display:"flex", alignItems:"center", justifyContent:"center",
    color:"#fff", fontSize:size*0.38, fontWeight:800,
  }}>{initials(name)}</div>
);

const Inp = ({label,value,onChange,onBlur,type="text",placeholder="",required=false}) => (
  <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,letterSpacing:0.6,textTransform:"uppercase"}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} onBlur={onBlur?e=>onBlur(e.target.value):undefined} placeholder={placeholder} required={required}
      style={{width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 13px",color:C.txt,fontSize:13,outline:"none",fontFamily:"inherit",marginBottom:0,boxSizing:"border-box"}}/>
  </div>
);

const TA = ({label,value,onChange,onBlur,rows=4,placeholder=""}) => (
  <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,letterSpacing:0.6,textTransform:"uppercase"}}>{label}</label>}
    <textarea value={value} onChange={e=>onChange(e.target.value)} onBlur={onBlur?e=>onBlur(e.target.value):undefined} rows={rows} placeholder={placeholder}
      style={{width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 13px",color:C.txt,fontSize:13,outline:"none",fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
  </div>
);

const Sel = ({label,value,onChange,options=[]}) => (
  <div style={{marginBottom:14}}>
    {label&&<label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,letterSpacing:0.6,textTransform:"uppercase"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",background:"#0d1e36",border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 13px",color:C.txt,fontSize:13,outline:"none",fontFamily:"inherit",appearance:"none"}}>
      {options.map(o=>typeof o==="string"?<option key={o} value={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Modal = ({title,children,onClose,wide=false}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:28,width:"100%",maxWidth:wide?640:480,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{color:C.txt,fontWeight:800,margin:0,fontSize:16}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:8,width:30,height:30,color:C.sub,cursor:"pointer",fontSize:16}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Toast = ({msg,onDone}) => {
  useEffect(()=>{const t=setTimeout(onDone,2200);return()=>clearTimeout(t);},[]);
  return (
    <div style={{position:"fixed",bottom:24,right:24,background:`${C.accent}18`,border:`1px solid ${C.accent}`,color:C.accent,borderRadius:12,padding:"10px 18px",fontWeight:700,fontSize:13,zIndex:2000}}>
      ✓ {msg}
    </div>
  );
};

const SH = ({title,sub,action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
    <div>
      <h2 style={{color:C.txt,fontWeight:800,margin:0,fontSize:20}}>{title}</h2>
      {sub&&<p style={{color:C.muted,fontSize:13,margin:"4px 0 0"}}>{sub}</p>}
    </div>
    {action}
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const Login = ({onLogin,config,users,setUsers}) => {
  const [view,setView]   = useState("login"); // "login" | "register" | "forgot"
  const [id,setId]       = useState("");
  const [pw,setPw]       = useState("");
  const [err,setErr]     = useState("");
  const [info,setInfo]   = useState("");

  // Register form state
  const [reg,setReg] = useState({name:"",id:"",email:"",password:"",confirm:"",role:"member",school:"",grade:""});
  const sr=(k,v)=>setReg(p=>({...p,[k]:v}));

  // Forgot password form state
  const [forgotId,setForgotId]   = useState("");
  const [oldPw,setOldPw]         = useState("");
  const [newPw,setNewPw]         = useState("");
  const [confirmPw,setConfirmPw] = useState("");

  const clearAll=()=>{setErr("");setInfo("");};
  const switchTo=v=>{clearAll();setView(v);};

  const submitLogin=()=>{
    const u=users.find(x=>x.id===id&&x.password===pw&&x.active);
    if(u) onLogin(u); else setErr("Invalid username or password.");
  };

  const submitRegister=()=>{
    if(!reg.name.trim()||!reg.id.trim()||!reg.password) return setErr("Name, username, and password are required.");
    if(reg.password!==reg.confirm) return setErr("Passwords do not match.");
    if(reg.password.length<6) return setErr("Password must be at least 6 characters.");
    if(users.find(u=>u.id===reg.id)) return setErr("That username is already taken.");
    const newUser={id:reg.id.trim(),password:reg.password,role:reg.role,name:reg.name.trim(),email:reg.email.trim(),grade:Number(reg.grade)||null,school:reg.school.trim()||null,active:true};
    setUsers(p=>[...p,newUser]);
    setInfo("Account created! You can now sign in.");
    switchTo("login");
    setId(newUser.id);
  };

  const submitForgot=()=>{
    if(!forgotId.trim()) return setErr("Please enter your username.");
    const u=users.find(x=>x.id===forgotId.trim());
    if(!u) return setErr("No account found with that username.");
    if(!oldPw) return setErr("Please enter your current password.");
    if(u.password!==oldPw) return setErr("Current password is incorrect.");
    if(!newPw) return setErr("Please enter a new password.");
    if(newPw.length<6) return setErr("Password must be at least 6 characters.");
    if(newPw!==confirmPw) return setErr("Passwords do not match.");
    if(newPw===oldPw) return setErr("New password must be different from your current password.");
    setUsers(p=>p.map(x=>x.id===u.id?{...x,password:newPw}:x));
    setInfo("Password updated! You can now sign in.");
    switchTo("login");
    setId(u.id);
  };

  const header=(
    <div style={{textAlign:"center",marginBottom:28}}>
      <div style={{width:64,height:64,borderRadius:18,background:`${C.accent}18`,border:`1px solid ${C.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px"}}>🏆</div>
      <h1 style={{color:C.txt,fontWeight:900,fontSize:22,margin:0}}>{config.teamName}</h1>
      <p style={{color:C.muted,fontSize:12,marginTop:5}}>{config.motto}</p>
    </div>
  );

  const inputStyle={width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 13px",color:C.txt,fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box",marginBottom:0};
  const labelStyle={display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,letterSpacing:0.6,textTransform:"uppercase"};
  const field=(label,val,onChange,type="text",placeholder="")=>(
    <div style={{marginBottom:14}}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={val} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputStyle}/>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}}>
        {header}

        {/* ── Sign In ── */}
        {view==="login"&&(
          <Card>
            <h3 style={{color:C.txt,fontWeight:800,margin:"0 0 18px",fontSize:15}}>Sign In</h3>
            {field("Username",id,setId,"text","your username")}
            {field("Password",pw,setPw,"password","••••••••")}
            {err&&<div style={{color:C.danger,fontSize:12,marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)"}}>{err}</div>}
            {info&&<div style={{color:"#10b981",fontSize:12,marginBottom:12,padding:"8px 12px",background:"rgba(16,185,129,0.08)",borderRadius:8,border:"1px solid rgba(16,185,129,0.2)"}}>✓ {info}</div>}
            <Btn onClick={submitLogin} style={{width:"100%",padding:"11px",marginBottom:14}}>Sign In</Btn>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <button onClick={()=>switchTo("forgot")} style={{background:"none",border:"none",color:C.accent,fontSize:12,cursor:"pointer",fontFamily:"inherit",padding:0}}>Forgot password?</button>
              <button onClick={()=>switchTo("register")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",padding:0}}>Create an account →</button>
            </div>
          </Card>
        )}

        {/* ── Register ── */}
        {view==="register"&&(
          <Card>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <button onClick={()=>switchTo("login")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,padding:0,lineHeight:1}}>←</button>
              <h3 style={{color:C.txt,fontWeight:800,margin:0,fontSize:15}}>Create Account</h3>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
              <div style={{gridColumn:"1/-1"}}>{field("Full Name",reg.name,v=>sr("name",v),"text","e.g. Alex Chen")}</div>
              {field("Username",reg.id,v=>sr("id",v),"text","choose a username")}
              {field("Email",reg.email,v=>sr("email",v),"email","you@school.edu")}
              {field("Password",reg.password,v=>sr("password",v),"password","min. 6 characters")}
              {field("Confirm Password",reg.confirm,v=>sr("confirm",v),"password","repeat password")}
              <div style={{gridColumn:"1/-1",marginBottom:14}}>
                <label style={labelStyle}>Role</label>
                <div style={{display:"flex",gap:8}}>
                  {["member","coach"].map(r=>(
                    <button key={r} onClick={()=>sr("role",r)} style={{flex:1,padding:"8px",borderRadius:9,border:`1px solid ${reg.role===r?"rgba(0,194,168,0.6)":C.border}`,background:reg.role===r?"rgba(0,194,168,0.1)":"transparent",color:reg.role===r?C.accent:C.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>{r}</button>
                  ))}
                </div>
              </div>
              {reg.role==="coach"&&<div style={{gridColumn:"1/-1"}}>{field("School / Team",reg.school,v=>sr("school",v),"text","Lincoln High School")}</div>}
              {reg.role==="member"&&field("Grade",reg.grade,v=>sr("grade",v),"number","e.g. 11")}
            </div>
            {err&&<div style={{color:C.danger,fontSize:12,marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)"}}>{err}</div>}
            <Btn onClick={submitRegister} style={{width:"100%",padding:"11px",marginBottom:10}}>Create Account</Btn>
            <div style={{textAlign:"center"}}>
              <button onClick={()=>switchTo("login")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Already have an account? Sign in</button>
            </div>
          </Card>
        )}

        {/* ── Forgot Password ── */}
        {view==="forgot"&&(
          <Card>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <button onClick={()=>switchTo("login")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18,padding:0,lineHeight:1}}>←</button>
              <h3 style={{color:C.txt,fontWeight:800,margin:0,fontSize:15}}>Reset Password</h3>
            </div>
            <p style={{color:C.muted,fontSize:12,marginBottom:18,lineHeight:1.6}}>Verify your identity with your current password, then choose a new one.</p>
            {field("Username",forgotId,setForgotId,"text","your username")}
            {field("Current Password",oldPw,setOldPw,"password","your existing password")}
            <div style={{height:1,background:C.border,margin:"4px 0 16px"}}/>
            {field("New Password",newPw,setNewPw,"password","min. 6 characters")}
            {field("Confirm New Password",confirmPw,setConfirmPw,"password","repeat new password")}
            {err&&<div style={{color:C.danger,fontSize:12,marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)"}}>{err}</div>}
            <Btn onClick={submitForgot} style={{width:"100%",padding:"11px",marginBottom:10}}>Reset Password</Btn>
            <div style={{textAlign:"center"}}>
              <button onClick={()=>switchTo("login")} style={{background:"none",border:"none",color:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Back to sign in</button>
            </div>
          </Card>
        )}

        <p style={{textAlign:"center",color:C.muted,fontSize:11,marginTop:18}}>
          {view==="login"?"Demo: admin / admin123 · coach1 / coach123 · member1 / pass123":"New accounts start as inactive until an admin activates them."}
        </p>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({user,config,invitationals,users,tournaments=[]}) => {
  const upcoming=invitationals.filter(i=>["open","active"].includes(i.status));
  const members=users.filter(u=>u.role==="member"&&u.active);
  const nextT=tournaments.find(t=>t.status==="upcoming");
  return (
    <div>
      <SH title={`Welcome, ${user.name.split(" ")[0]}!`} sub={`${config.teamName} · ${config.season}`}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,marginBottom:24}}>
        {[
          {label:"Active Members",  value:members.length,                      icon:"👥"},
          {label:"Open Invitationals",value:upcoming.length,                   icon:"🏟"},
          {label:"Next Tournament", value:nextT?fmtDate(nextT.date):"—",       icon:"📅"},
          {label:"Division",        value:config.division,                     icon:"🏅"},
        ].map(s=>(
          <Card key={s.label} style={{textAlign:"center",padding:20}}>
            <div style={{fontSize:28,marginBottom:8}}>{s.icon}</div>
            <div style={{color:C.accent,fontWeight:800,fontSize:18,marginBottom:4}}>{s.value}</div>
            <div style={{color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:0.8}}>{s.label}</div>
          </Card>
        ))}
      </div>
      {upcoming.length>0&&(
        <div>
          <h3 style={{color:C.sub,fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Open Invitationals</h3>
          <div style={{display:"grid",gap:10}}>
            {upcoming.map(i=>(
              <Card key={i.id} style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:12,background:`${C.accent}18`,border:`1px solid ${C.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎪</div>
                <div style={{flex:1}}>
                  <div style={{color:C.txt,fontWeight:700,fontSize:14}}>{i.name}</div>
                  <div style={{color:C.muted,fontSize:12}}>{fmtDate(i.date)} · {i.location} · {i.division}</div>
                </div>
                <Badge label={i.status}/>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── USER MANAGEMENT ──────────────────────────────────────────────────────────
const UserManagement = ({users,setUsers}) => {
  const blank={id:"",password:"",role:"member",name:"",email:"",grade:"",school:"",active:true};
  const [modal,setModal]=useState(null); // "add" | "edit" | "reset"
  const [form,setForm]=useState(blank);
  const [resetTarget,setResetTarget]=useState(null); // user object being reset
  const [resetPw,setResetPw]=useState("");
  const [resetConfirm,setResetConfirm]=useState("");
  const [resetErr,setResetErr]=useState("");
  const [toast,setToast]=useState("");
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));

  const save=()=>{
    if(!form.name||!form.id)return;
    if(modal==="add") setUsers(p=>[...p,{...form,grade:Number(form.grade)||null}]);
    else setUsers(p=>p.map(u=>u.id===form.id?{...form,grade:Number(form.grade)||null}:u));
    setModal(null); setToast(modal==="add"?"User added!":"User updated!");
  };

  const openReset=u=>{setResetTarget(u);setResetPw("");setResetConfirm("");setResetErr("");setModal("reset");};
  const submitReset=()=>{
    if(!resetPw) return setResetErr("Please enter a new password.");
    if(resetPw.length<6) return setResetErr("Password must be at least 6 characters.");
    if(resetPw!==resetConfirm) return setResetErr("Passwords do not match.");
    setUsers(p=>p.map(u=>u.id===resetTarget.id?{...u,password:resetPw}:u));
    setModal(null); setToast(`Password reset for ${resetTarget.name}.`);
  };

  return (
    <div>
      <SH title="User Management" sub="Manage team members, coaches, and admins" action={<Btn onClick={()=>{setForm({...blank,id:"u"+uid()});setModal("add");}}>+ Add User</Btn>}/>
      <div style={{display:"grid",gap:8}}>
        {users.map(u=>(
          <Card key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:14,opacity:u.active?1:0.5}}>
            <AV name={u.name} size={40}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:2}}>
                <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{u.name}</span>
                <Badge label={u.role} color={u.role==="admin"?"#8b5cf6":u.role==="coach"?"#3b82f6":"#10b981"}/>
                {!u.active&&<Badge label="Inactive" color="#64748b"/>}
              </div>
              <div style={{color:C.muted,fontSize:11}}>{u.email}{u.school&&` · ${u.school}`}{u.grade&&` · Grade ${u.grade}`}</div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <Btn small variant="ghost" onClick={()=>{setForm({...u,grade:u.grade||""});setModal("edit");}}>Edit</Btn>
              <Btn small variant="warn" onClick={()=>openReset(u)}>Reset PW</Btn>
              <Btn small variant={u.active?"danger":"success"} onClick={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,active:!x.active}:x))}>{u.active?"Deactivate":"Activate"}</Btn>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit modal */}
      {(modal==="add"||modal==="edit")&&(
        <Modal title={modal==="add"?"Add User":"Edit User"} onClose={()=>setModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <div style={{gridColumn:"1/-1"}}><Inp label="Full Name" value={form.name} onChange={v=>sf("name",v)} required/></div>
            <Inp label="Username / ID" value={form.id} onChange={v=>sf("id",v)} required/>
            <Inp label="Password" value={form.password} onChange={v=>sf("password",v)} type="password"/>
            <Inp label="Email" value={form.email} onChange={v=>sf("email",v)} type="email"/>
            <Sel label="Role" value={form.role} onChange={v=>sf("role",v)} options={["admin","coach","member"]}/>
            <Inp label="Grade (members)" value={form.grade} onChange={v=>sf("grade",v)} type="number"/>
            <div style={{gridColumn:"1/-1"}}><Inp label="School (coaches)" value={form.school} onChange={v=>sf("school",v)}/></div>
          </div>
          <div style={{display:"flex",gap:8}}><Btn onClick={save}>{modal==="add"?"Add":"Save"}</Btn><Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn></div>
        </Modal>
      )}

      {/* Reset Password modal */}
      {modal==="reset"&&resetTarget&&(
        <Modal title="Reset Password" onClose={()=>setModal(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,marginBottom:20}}>
            <AV name={resetTarget.name} size={40}/>
            <div>
              <div style={{color:C.txt,fontWeight:700,fontSize:14}}>{resetTarget.name}</div>
              <div style={{color:C.muted,fontSize:12}}>@{resetTarget.id} · <span style={{textTransform:"capitalize"}}>{resetTarget.role}</span></div>
            </div>
          </div>
          <p style={{color:C.muted,fontSize:12,marginBottom:18,lineHeight:1.6}}>
            As an admin you can set this user's password directly. They will need to use the new password to sign in.
          </p>
          <Inp label="New Password" value={resetPw} onChange={setResetPw} type="password" placeholder="min. 6 characters"/>
          <Inp label="Confirm New Password" value={resetConfirm} onChange={setResetConfirm} type="password" placeholder="repeat new password"/>
          {resetErr&&<div style={{color:C.danger,fontSize:12,marginBottom:12,padding:"8px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)"}}>{resetErr}</div>}
          <div style={{display:"flex",gap:8}}>
            <Btn variant="warn" onClick={submitReset}>Set New Password</Btn>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── TEAM CONFIG ──────────────────────────────────────────────────────────────
const TeamConfig = ({config,setConfig,eventPool,setEventPool,eventCats,setEventCats}) => {
  const [form,setForm]=useState({...config}); const [toast,setToast]=useState(""); const [newEvt,setNewEvt]=useState({name:"",cat:"Life Science"}); const [newCat,setNewCat]=useState("");
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const save=()=>{setConfig(form);setToast("Settings saved!");};
  return (
    <div>
      <SH title="Team Configuration" sub="Manage team details, event pool, and categories"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,alignItems:"start"}}>
        <Card>
          <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 14px",fontSize:14}}>Team Details</h4>
          <Inp label="Team Name"   value={form.teamName}   onChange={v=>sf("teamName",v)}/>
          <Inp label="School"      value={form.school}     onChange={v=>sf("school",v)}/>
          <Inp label="Division"    value={form.division}   onChange={v=>sf("division",v)}/>
          <Inp label="Season"      value={form.season}     onChange={v=>sf("season",v)}/>
          <Inp label="Motto"       value={form.motto}      onChange={v=>sf("motto",v)}/>
          <Btn onClick={save}>Save Settings</Btn>
        </Card>
        <div>
          <Card style={{marginBottom:16}}>
            <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 12px",fontSize:14}}>Event Categories ({eventCats.length})</h4>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
              {eventCats.map(c=>(
                <span key={c} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:20,padding:"3px 10px",fontSize:11,color:C.sub}}>
                  {c}
                  <button onClick={()=>setEventCats(p=>p.filter(x=>x!==c))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:0,lineHeight:1}}>×</button>
                </span>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <input value={newCat} onChange={e=>setNewCat(e.target.value)} placeholder="New category…" style={{flex:1,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 10px",color:C.txt,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
              <Btn small onClick={()=>{if(newCat.trim()){setEventCats(p=>[...p,newCat.trim()]);setNewCat("");}}}>Add</Btn>
            </div>
          </Card>
          <Card>
            <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 12px",fontSize:14}}>Event Pool ({eventPool.length})</h4>
            <div style={{maxHeight:200,overflowY:"auto",marginBottom:12}}>
              {eventPool.map(e=>(
                <div key={e.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                  <span style={{flex:1,color:C.txt,fontSize:12}}>{e.name}</span>
                  <Badge label={e.cat} color="#8b5cf6"/>
                  <button onClick={()=>setEventPool(p=>p.filter(x=>x.id!==e.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13}}>×</button>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 160px",gap:"0 8px"}}>
              <Inp label="Event Name" value={newEvt.name} onChange={v=>setNewEvt(p=>({...p,name:v}))}/>
              <Sel label="Category" value={newEvt.cat} onChange={v=>setNewEvt(p=>({...p,cat:v}))} options={eventCats}/>
            </div>
            <Btn small onClick={()=>{if(newEvt.name.trim()){setEventPool(p=>[...p,{id:"ep"+uid(),...newEvt}]);setNewEvt({name:"",cat:"Life Science"});}}}>Add Event</Btn>
          </Card>
        </div>
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── LEADERSHIP ───────────────────────────────────────────────────────────────
const Leadership = ({leadership}) => (
  <div>
    <SH title="Team Leadership" sub="Coaches and captains you can reach out to"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(265px,1fr))",gap:14}}>
      {leadership.map((l,i)=>(
        <Card key={l.id||i}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <AV name={l.name} size={46}/>
            <div><div style={{color:C.txt,fontWeight:700,fontSize:14}}>{l.name}</div><Badge label={l.role}/></div>
          </div>
          <p style={{color:C.muted,fontSize:12,margin:"0 0 12px",lineHeight:1.6}}>{l.bio}</p>
          <a href={`mailto:${l.email}`} style={{color:C.accent,fontSize:12,textDecoration:"none",display:"block",marginBottom:4}}>✉️ {l.email}</a>
          <span style={{color:C.muted,fontSize:12}}>📞 {l.phone}</span>
        </Card>
      ))}
      {leadership.length===0&&<div style={{color:C.muted,fontSize:13}}>No leadership members added yet.</div>}
    </div>
  </div>
);

const ManageLeadership = ({leadership,setLeadership}) => {
  const blank={id:"",name:"",role:"",email:"",phone:"",bio:""};
  const [modal,setModal]=useState(null); const [target,setTarget]=useState(null); const [form,setForm]=useState(blank); const [toast,setToast]=useState("");
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const ROLE_OPTS=["Head Coach","Asst. Coach","Coach","Team Captain","Vice Captain","Event Lead","Secretary","Treasurer","Member"];
  const save=()=>{
    if(!form.name||!form.role)return;
    if(modal==="add") setLeadership(p=>[...p,{...form,id:"l"+uid()}]);
    else setLeadership(p=>p.map(l=>l.id===target.id?{...form}:l));
    setModal(null); setToast(modal==="add"?"Member added!":"Member updated!");
  };
  const remove=id=>{if(!confirm("Remove this member?"))return;setLeadership(p=>p.filter(l=>l.id!==id));setToast("Removed.");};
  const move=(id,dir)=>setLeadership(p=>{const i=p.findIndex(l=>l.id===id);if(i+dir<0||i+dir>=p.length)return p;const a=[...p];[a[i],a[i+dir]]=[a[i+dir],a[i]];return a;});
  return (
    <div>
      <SH title="Manage Leadership" sub="Edit the leadership directory" action={<Btn onClick={()=>{setForm({...blank,id:"l"+uid()});setModal("add");}}>+ Add Member</Btn>}/>
      <div style={{display:"grid",gap:10}}>
        {leadership.map((l,i)=>(
          <Card key={l.id} style={{display:"flex",alignItems:"center",gap:12,padding:14}}>
            <AV name={l.name} size={40}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:2}}><span style={{color:C.txt,fontWeight:700,fontSize:13}}>{l.name}</span><Badge label={l.role}/></div>
              <div style={{color:C.muted,fontSize:11}}>{l.email&&<span>✉️ {l.email}</span>}{l.phone&&<span style={{marginLeft:10}}>📞 {l.phone}</span>}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:3,marginRight:4}}>
              <button onClick={()=>move(l.id,-1)} disabled={i===0} style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:5,width:24,height:24,color:C.sub,cursor:i===0?"not-allowed":"pointer",opacity:i===0?0.3:1,fontSize:12}}>▲</button>
              <button onClick={()=>move(l.id,1)} disabled={i===leadership.length-1} style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:5,width:24,height:24,color:C.sub,cursor:i===leadership.length-1?"not-allowed":"pointer",opacity:i===leadership.length-1?0.3:1,fontSize:12}}>▼</button>
            </div>
            <div style={{display:"flex",gap:7}}>
              <Btn small variant="ghost" onClick={()=>{setForm({...l});setTarget(l);setModal("edit");}}>Edit</Btn>
              <Btn small variant="danger" onClick={()=>remove(l.id)}>✕</Btn>
            </div>
          </Card>
        ))}
        {leadership.length===0&&<Card style={{textAlign:"center",padding:40,color:C.muted}}>No members yet.</Card>}
      </div>
      {modal&&(
        <Modal title={modal==="add"?"Add Member":"Edit Member"} onClose={()=>setModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <div style={{gridColumn:"1/-1"}}><Inp label="Full Name" value={form.name} onChange={v=>sf("name",v)} required/></div>
            <div style={{gridColumn:"1/-1"}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,letterSpacing:0.6,textTransform:"uppercase"}}>Role *</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                {ROLE_OPTS.map(r=>(
                  <button key={r} onClick={()=>sf("role",r)} style={{padding:"5px 12px",borderRadius:16,border:`1px solid ${form.role===r?C.accent:C.border}`,background:form.role===r?`${C.accent}18`:"transparent",color:form.role===r?C.accent:C.muted,fontWeight:600,fontSize:11,cursor:"pointer"}}>{r}</button>
                ))}
              </div>
              {!ROLE_OPTS.includes(form.role)&&<Inp label="Custom Role" value={form.role} onChange={v=>sf("role",v)}/>}
            </div>
            <Inp label="Email" value={form.email} onChange={v=>sf("email",v)} type="email"/>
            <Inp label="Phone" value={form.phone} onChange={v=>sf("phone",v)}/>
            <div style={{gridColumn:"1/-1"}}><Inp label="Bio" value={form.bio} onChange={v=>sf("bio",v)}/></div>
          </div>
          <div style={{display:"flex",gap:8}}><Btn onClick={save}>{modal==="add"?"Add":"Save"}</Btn><Btn variant="ghost" onClick={()=>setModal(null)}>Cancel</Btn></div>
        </Modal>
      )}
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── TOURNAMENTS (Member view) ────────────────────────────────────────────────
const TYPE_META = {
  event:   {color:"#3b82f6", icon:"🏆", label:"Event"},
  lunch:   {color:"#f59e0b", icon:"🍽️", label:"Lunch"},
  general: {color:"#64748b", icon:"📌", label:"General"},
};

const Tournaments = ({tournaments=[]}) => {
  const [sel,setSel]=useState(null);
  const sorted=t=>[...t.schedule].sort((a,b)=>a.time.localeCompare(b.time));
  return (
    <div>
      <SH title="Tournaments" sub="Season schedule and event-day itineraries"/>
      <div style={{display:"grid",gap:12}}>
        {tournaments.map(t=>(
          <Card key={t.id} onClick={()=>setSel(sel===t.id?null:t.id)} style={{cursor:"pointer",borderLeft:`3px solid ${t.status==="upcoming"?C.accent:t.status==="future"?"#8b5cf6":"#334155"}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,marginBottom:4}}><span style={{color:C.txt,fontWeight:700,fontSize:14}}>{t.name}</span><Badge label={t.status}/></div>
                <div style={{color:C.muted,fontSize:12}}>📅 {fmtDate(t.date)} · 📍 {t.location}</div>
              </div>
              <span style={{color:C.muted,fontSize:13}}>{sel===t.id?"▲":"▼"}</span>
            </div>
            {sel===t.id&&(
              <div style={{marginTop:16,borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                {t.schedule.length===0
                  ?<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"16px 0"}}>Schedule not yet published.</div>
                  :<div style={{display:"grid",gap:6}}>
                    {sorted(t).map((s,i)=>{
                      const meta=TYPE_META[s.type]||TYPE_META.general;
                      return (
                        <div key={s.id||i} style={{display:"grid",gridTemplateColumns:"80px 22px 1fr auto",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:s.type==="lunch"?"rgba(245,158,11,0.07)":s.type==="event"?"rgba(59,130,246,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${s.type==="lunch"?"rgba(245,158,11,0.2)":s.type==="event"?"rgba(59,130,246,0.18)":"rgba(255,255,255,0.05)"}`}}>
                          <span style={{color:meta.color,fontWeight:800,fontSize:12}}>{fmt12(s.time)}</span>
                          <span style={{fontSize:14}}>{meta.icon}</span>
                          <div>
                            <div style={{color:C.txt,fontWeight:600,fontSize:13}}>{s.activity}</div>
                            {s.type!=="lunch"&&<div style={{color:C.muted,fontSize:11,marginTop:1}}>📍 {s.room||"Room TBD"}</div>}
                          </div>
                          <Badge label={meta.label} color={meta.color}/>
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            )}
          </Card>
        ))}
        {tournaments.length===0&&<Card style={{textAlign:"center",padding:48,color:C.muted}}>No tournaments scheduled yet.</Card>}
      </div>
    </div>
  );
};

// ─── MANAGE TOURNAMENTS (Admin) ───────────────────────────────────────────────
const ManageTournaments = ({tournaments,setTournaments,eventPool}) => {
  const [selId,setSelId]=useState(null); const [toast,setToast]=useState(""); const [showAddT,setShowAddT]=useState(false);
  const [tForm,setTForm]=useState({name:"",date:"",location:"",status:"upcoming"});
  const tf=(k,v)=>setTForm(p=>({...p,[k]:v}));
  const [schedForm,setSchedForm]=useState({type:"event",time:"",activity:"",room:""});
  const sf=(k,v)=>setSchedForm(p=>({...p,[k]:v}));

  const addT=()=>{if(!tForm.name)return;setTournaments(p=>[...p,{...tForm,id:"t"+uid(),schedule:[]}]);setTForm({name:"",date:"",location:"",status:"upcoming"});setShowAddT(false);setToast("Tournament added!");};
  const removeT=id=>{if(!confirm("Remove this tournament?"))return;setTournaments(p=>p.filter(t=>t.id!==id));setSelId(null);};
  const addSlot=()=>{
    if(!schedForm.time||!schedForm.activity)return;
    setTournaments(p=>p.map(t=>t.id===selId?{...t,schedule:[...t.schedule,{...schedForm,id:"ss"+uid()}]}:t));
    setSchedForm({type:"event",time:"",activity:"",room:""}); setToast("Slot added!");
  };
  const removeSlot=(tid,sid)=>setTournaments(p=>p.map(t=>t.id===tid?{...t,schedule:t.schedule.filter(s=>s.id!==sid)}:t));
  const sel=tournaments.find(t=>t.id===selId);

  return (
    <div>
      <SH title="Tournaments" sub="Manage tournament schedule and event-day itineraries" action={<Btn onClick={()=>setShowAddT(p=>!p)}>+ Add Tournament</Btn>}/>
      {showAddT&&(
        <Card style={{marginBottom:16,borderColor:"rgba(0,194,168,0.3)",padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <div style={{gridColumn:"1/-1"}}><Inp label="Name" value={tForm.name} onChange={v=>tf("name",v)}/></div>
            <Inp label="Date" value={tForm.date} onChange={v=>tf("date",v)} type="date"/>
            <Sel label="Status" value={tForm.status} onChange={v=>tf("status",v)} options={["upcoming","future","past"]}/>
            <div style={{gridColumn:"1/-1"}}><Inp label="Location" value={tForm.location} onChange={v=>tf("location",v)}/></div>
          </div>
          <div style={{display:"flex",gap:8}}><Btn small onClick={addT}>Add</Btn><Btn small variant="ghost" onClick={()=>setShowAddT(false)}>Cancel</Btn></div>
        </Card>
      )}
      <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:18,alignItems:"start"}}>
        <div style={{display:"grid",gap:8}}>
          {tournaments.map(t=>(
            <div key={t.id} onClick={()=>setSelId(t.id)} style={{padding:"12px 14px",borderRadius:11,cursor:"pointer",border:`1px solid ${selId===t.id?"rgba(0,194,168,0.5)":C.border}`,background:selId===t.id?"rgba(0,194,168,0.07)":"rgba(255,255,255,0.02)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{t.name}</span>
                <button onClick={e=>{e.stopPropagation();removeT(t.id);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13}}>×</button>
              </div>
              <div style={{color:C.muted,fontSize:11,marginTop:3}}>{fmtDate(t.date)} · {t.schedule.length} sessions</div>
            </div>
          ))}
        </div>
        {sel?(
          <Card>
            <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 14px",fontSize:14}}>{sel.name} — Schedule</h4>
            <div style={{display:"grid",gridTemplateColumns:"80px 140px 1fr 120px auto",gap:"0 10px",alignItems:"end",marginBottom:14}}>
              <Inp label="Time" value={schedForm.time} onChange={v=>sf("time",v)} type="time"/>
              <Sel label="Type" value={schedForm.type} onChange={v=>sf("type",v)} options={["event","lunch","general"]}/>
              <Inp label="Activity" value={schedForm.activity} onChange={v=>sf("activity",v)} placeholder="e.g. Anatomy & Physiology"/>
              <Inp label="Room" value={schedForm.room} onChange={v=>sf("room",v)} placeholder="Rm 204"/>
              <div style={{paddingBottom:14}}><Btn small onClick={addSlot}>Add</Btn></div>
            </div>
            <div style={{display:"grid",gap:6}}>
              {[...sel.schedule].sort((a,b)=>a.time.localeCompare(b.time)).map(s=>(
                <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 13px",borderRadius:9,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`}}>
                  <span style={{color:C.accent,fontWeight:700,fontSize:12,width:70}}>{fmt12(s.time)}</span>
                  <Badge label={s.type} color={(TYPE_META[s.type]||TYPE_META.general).color}/>
                  <span style={{flex:1,color:C.txt,fontSize:13}}>{s.activity}</span>
                  {s.room&&<span style={{color:C.muted,fontSize:11}}>📍 {s.room}</span>}
                  <button onClick={()=>removeSlot(sel.id,s.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13}}>×</button>
                </div>
              ))}
              {sel.schedule.length===0&&<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:24}}>No sessions yet. Add one above.</div>}
            </div>
          </Card>
        ):<Card style={{textAlign:"center",padding:48,color:C.muted}}>Select a tournament to manage its schedule.</Card>}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── MANAGE EVENTS (admin team events, not invitational events) ───────────────
const ManageEvents = ({users,eventPool,eventCats}) => {
  const activeMembers=users.filter(u=>u.role==="member"&&u.active);
  const [evs,setEvs]=useState([
    {id:1,name:"Anatomy & Physiology",category:"Life Science",   members:["Alex Chen","Jordan Kim"]},
    {id:2,name:"Astronomy",           category:"Earth & Space",  members:["Jordan Kim","Riley Wang"]},
    {id:3,name:"Chemistry Lab",       category:"Physical Science",members:["Alex Chen","Riley Wang"]},
  ]);
  const [showAdd,setShowAdd]=useState(false); const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({name:"",category:"Life Science",members:[]});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const toggleMember=name=>setForm(p=>({...p,members:p.members.includes(name)?p.members.filter(m=>m!==name):[...p.members,name]}));
  const save=()=>{
    if(!form.name)return;
    if(editId) setEvs(p=>p.map(e=>e.id===editId?{...e,...form}:e));
    else setEvs(p=>[...p,{id:uid(),...form}]);
    setShowAdd(false);setEditId(null);setForm({name:"",category:"Life Science",members:[]});
  };
  return (
    <div>
      <SH title="Manage Events" sub="Assign members to competition events" action={<Btn onClick={()=>{setForm({name:"",category:"Life Science",members:[]});setEditId(null);setShowAdd(true);}}>+ Add Event</Btn>}/>
      {showAdd&&(
        <Card style={{marginBottom:16,borderColor:"rgba(0,194,168,0.3)",padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <Sel label="Event" value={form.name} onChange={v=>{sf("name",v);const ep=eventPool.find(e=>e.name===v);if(ep)sf("category",ep.cat);}} options={[{value:"",label:"Select event..."},...eventPool.map(e=>({value:e.name,label:e.name}))]}/>
            <Sel label="Category" value={form.category} onChange={v=>sf("category",v)} options={eventCats}/>
          </div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,letterSpacing:0.6,textTransform:"uppercase"}}>Assign Members</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {activeMembers.map(m=>(
              <button key={m.id} onClick={()=>toggleMember(m.name)} style={{padding:"5px 12px",borderRadius:16,border:`1px solid ${form.members.includes(m.name)?C.accent:C.border}`,background:form.members.includes(m.name)?`${C.accent}18`:"transparent",color:form.members.includes(m.name)?C.accent:C.muted,fontWeight:600,fontSize:11,cursor:"pointer"}}>{m.name}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}><Btn small onClick={save}>{editId?"Save":"Add"}</Btn><Btn small variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Card>
      )}
      <div style={{display:"grid",gap:10}}>
        {evs.map(ev=>(
          <Card key={ev.id} style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{flex:1}}>
              <div style={{color:C.txt,fontWeight:700,fontSize:13,marginBottom:3}}>{ev.name}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ev.members.map(m=><Badge key={m} label={m} color="#3b82f6"/>)}</div>
            </div>
            <Badge label={ev.category} color="#8b5cf6"/>
            <div style={{display:"flex",gap:7}}>
              <Btn small variant="ghost" onClick={()=>{setForm({name:ev.name,category:ev.category,members:[...ev.members]});setEditId(ev.id);setShowAdd(true);}}>Edit</Btn>
              <Btn small variant="danger" onClick={()=>setEvs(p=>p.filter(e=>e.id!==ev.id))}>✕</Btn>
            </div>
          </Card>
        ))}
        {evs.length===0&&<Card style={{textAlign:"center",padding:40,color:C.muted}}>No events added yet.</Card>}
      </div>
    </div>
  );
};

// ─── MEMBER PAGES ─────────────────────────────────────────────────────────────
const MyEvents = () => {
  const evs=[{id:1,name:"Anatomy & Physiology",category:"Life Science",partners:["Jordan Kim"]},{id:2,name:"Chemistry Lab",category:"Physical Science",partners:["Riley Wang"]}];
  return (
    <div>
      <SH title="My Events" sub="Your assigned events this season"/>
      <div style={{display:"grid",gap:12}}>
        {evs.map(ev=>(
          <Card key={ev.id} style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#00c2a8,#3b82f6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏅</div>
            <div style={{flex:1}}><div style={{color:C.txt,fontWeight:700,fontSize:14}}>{ev.name}</div><div style={{color:C.muted,fontSize:12}}>Partners: {ev.partners.join(", ")}</div></div>
            <Badge label={ev.category} color="#8b5cf6"/>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Availability = ({tournaments=[]}) => {
  const [av,setAv]=useState({}); const [saved,setSaved]=useState(false);
  const slots=["Morning (7AM–12PM)","Afternoon (12PM–5PM)","Evening (5PM–9PM)"];
  return (
    <div>
      <SH title="Availability" sub="Let coaches know when you can make it to tournaments"/>
      <div style={{display:"grid",gap:14}}>
        {tournaments.map(t=>(
          <Card key={t.id}>
            <div style={{color:C.txt,fontWeight:700,marginBottom:10}}>{t.name}<span style={{color:C.muted,fontWeight:400,fontSize:12}}> — {fmtDate(t.date)}</span></div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {slots.map(s=>{const on=av[`${t.id}-${s}`];return(
                <button key={s} onClick={()=>{setAv(p=>({...p,[`${t.id}-${s}`]:!p[`${t.id}-${s}`]}));setSaved(false);}} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${on?C.accent:C.border}`,background:on?`${C.accent}18`:"transparent",color:on?C.accent:C.muted,fontWeight:600,fontSize:12,cursor:"pointer"}}>{on?"✓ ":""}{s}</button>
              );})}
            </div>
          </Card>
        ))}
      </div>
      <div style={{marginTop:16}}><Btn onClick={()=>setSaved(true)}>{saved?"✓ Availability Saved!":"Save Availability"}</Btn></div>
    </div>
  );
};

// ─── INVITATIONAL LIST (Admin) ────────────────────────────────────────────────
const InvList = ({invitationals,setInvitationals,onSelect}) => {
  const [modal,setModal]=useState(false); const [toast,setToast]=useState("");
  const [form,setForm]=useState({name:"",date:"",location:"",division:"Division C",status:"draft",registrationDeadline:"",maxTeams:24,description:""});
  const set=(k,v)=>setForm(p=>({...p,[k]:v}));
  const create=()=>{
    if(!form.name)return;
    setInvitationals(p=>[...p,{...form,id:"inv-"+uid(),maxTeams:Number(form.maxTeams),teamNumberPrefix:"C",events:[],buildSlots:[],volunteers:[],appeals:[],proposedSupervisors:[],registeredSchools:[]}]);
    setModal(false); setToast("Invitational created!");
  };
  return (
    <div>
      <SH title="Invitationals" sub="Manage invitational tournaments hosted by your team" action={<Btn onClick={()=>setModal(true)}>+ Create Invitational</Btn>}/>
      <div style={{display:"grid",gap:14}}>
        {invitationals.map(i=>(
          <Card key={i.id} onClick={()=>onSelect(i.id)} style={{cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:50,height:50,borderRadius:14,background:`${C.accent}18`,border:`1px solid ${C.accent}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🎪</div>
              <div style={{flex:1}}>
                <div style={{color:C.txt,fontWeight:800,fontSize:15,marginBottom:4}}>{i.name}</div>
                <div style={{color:C.muted,fontSize:12}}>{fmtDate(i.date)} · {i.location} · {i.division}</div>
                <div style={{display:"flex",gap:10,marginTop:6,fontSize:11,color:C.muted}}>
                  <span>{i.events.length} events</span>
                  <span>{i.registeredSchools.length}/{i.maxTeams} schools</span>
                  <span>{(i.proposedSupervisors||[]).filter(p=>p.status==="pending").length} pending nominations</span>
                </div>
              </div>
              <Badge label={i.status}/>
            </div>
          </Card>
        ))}
        {invitationals.length===0&&<Card style={{textAlign:"center",padding:48,color:C.muted}}>No invitationals yet.</Card>}
      </div>
      {modal&&(
        <Modal title="Create Invitational" onClose={()=>setModal(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <div style={{gridColumn:"1/-1"}}><Inp label="Name" value={form.name} onChange={v=>set("name",v)} required/></div>
            <Inp label="Date" value={form.date} onChange={v=>set("date",v)} type="date"/>
            <Inp label="Reg. Deadline" value={form.registrationDeadline} onChange={v=>set("registrationDeadline",v)} type="date"/>
            <div style={{gridColumn:"1/-1"}}><Inp label="Location" value={form.location} onChange={v=>set("location",v)}/></div>
            <Inp label="Max Teams" value={form.maxTeams} onChange={v=>set("maxTeams",v)} type="number"/>
            <Sel label="Division" value={form.division} onChange={v=>set("division",v)} options={["Division A","Division B","Division C","Division B & C"]}/>
            <Sel label="Initial Status" value={form.status} onChange={v=>set("status",v)} options={[{value:"draft",label:"Draft"},{value:"open",label:"Open"}]}/>
          </div>
          <TA label="Description" value={form.description} onChange={v=>set("description",v)} rows={3}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={create}>Create</Btn><Btn variant="ghost" onClick={()=>setModal(false)}>Cancel</Btn></div>
        </Modal>
      )}
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── INVITATIONAL DETAIL (Admin) ──────────────────────────────────────────────
const InvDetail = ({inv,setInvitationals,onBack,eventPool,eventCats}) => {
  const [tab,setTab]=useState("settings"); const [toast,setToast]=useState("");
  const upd=fn=>{setInvitationals(prev=>prev.map(i=>i.id===inv.id?fn(i):i));};
  const updSave=fn=>{upd(fn);setToast("Saved!");};

  const pendingS=(inv.proposedSupervisors||[]).filter(p=>p.status==="pending").length;
  const pendingA=inv.appeals.filter(a=>a.status==="Pending").length;
  const activityBadge=pendingS+pendingA>0?` (${pendingS+pendingA} pending)`:"";

  const tabs=[
    {id:"settings",  label:"Settings"},
    {id:"events",    label:`Events (${inv.events.length})`},
    {id:"schools",   label:`Schools (${inv.registeredSchools.length})`},
    {id:"activity",  label:`Activity${activityBadge}`},
    {id:"volunteers",label:`Volunteers (${inv.volunteers.length})`},
  ];

  const [info,setInfo]=useState({...inv});
  const si=(k,v)=>setInfo(p=>({...p,[k]:v}));
  const saveField=(k,v)=>{updSave(i=>({...i,[k]:v}));};

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:6}}>
        <Btn small variant="ghost" onClick={onBack}>← All Invitationals</Btn>
        <input value={info.name} onChange={e=>si("name",e.target.value)} onBlur={e=>saveField("name",e.target.value)}
          style={{flex:1,background:"transparent",border:"none",color:C.txt,fontSize:20,fontWeight:900,outline:"none",fontFamily:"inherit"}}/>
        <select value={info.status} onChange={e=>{si("status",e.target.value);saveField("status",e.target.value);}}
          style={{background:"#0d1e36",border:`1px solid ${C.border}`,borderRadius:9,padding:"5px 12px",color:C.accent,fontSize:12,fontWeight:700,fontFamily:"inherit"}}>
          {["draft","open","active","closed"].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{color:C.muted,fontSize:12,marginBottom:18,paddingLeft:2}}>{fmtDate(inv.date)} · {inv.location}</div>
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {tabs.map(t=><Pill key={t.id} label={t.label} active={tab===t.id} onClick={()=>setTab(t.id)}/>)}
      </div>

      {tab==="settings"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 260px",gap:18,alignItems:"start"}}>
          <Card>
            <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 14px",fontSize:14}}>Invitational Settings</h4>
            <p style={{color:C.muted,fontSize:11,margin:"0 0 14px"}}>Fields auto-save on blur.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
              <div style={{gridColumn:"1/-1"}}><Inp label="Name" value={info.name} onChange={v=>si("name",v)} onBlur={v=>saveField("name",v)}/></div>
              <Inp label="Date" value={info.date} onChange={v=>si("date",v)} onBlur={v=>saveField("date",v)} type="date"/>
              <Inp label="Reg. Deadline" value={info.registrationDeadline} onChange={v=>si("registrationDeadline",v)} onBlur={v=>saveField("registrationDeadline",v)} type="date"/>
              <div style={{gridColumn:"1/-1"}}><Inp label="Location" value={info.location} onChange={v=>si("location",v)} onBlur={v=>saveField("location",v)}/></div>
              <Inp label="Max Teams" value={info.maxTeams} onChange={v=>si("maxTeams",v)} onBlur={v=>saveField("maxTeams",Number(v))} type="number"/>
              <Sel label="Division" value={info.division} onChange={v=>{si("division",v);saveField("division",v);}} options={["Division A","Division B","Division C","Division B & C"]}/>
              <Sel label="Status" value={info.status} onChange={v=>{si("status",v);saveField("status",v);}} options={[{value:"draft",label:"Draft"},{value:"open",label:"Open Registration"},{value:"active",label:"Active / Day-Of"},{value:"closed",label:"Closed"}]}/>
            </div>
            <TA label="Description" value={info.description} onChange={v=>si("description",v)} onBlur={v=>saveField("description",v)} rows={3}/>
            <Btn onClick={()=>updSave(i=>({...i,...info}))}>Save All Changes</Btn>
          </Card>
          <Card>
            <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 12px",fontSize:13}}>Quick Stats</h4>
            {[
              {label:"Schools",  value:inv.registeredSchools.length},
              {label:"Events",   value:inv.events.length},
              {label:"Build Slots",value:inv.buildSlots.length},
              {label:"Volunteers",value:inv.volunteers.length},
            ].map(s=>(
              <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{color:C.muted,fontSize:12}}>{s.label}</span>
                <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{s.value}</span>
              </div>
            ))}
            {pendingS>0&&<div style={{marginTop:10}}><Badge label={`${pendingS} supervisor nominations pending`} color="#f59e0b"/></div>}
            {pendingA>0&&<div style={{marginTop:6}}><Badge label={`${pendingA} appeals pending`} color="#f59e0b"/></div>}
          </Card>
        </div>
      )}
      {tab==="events"&&    <InvEventsTab    inv={inv} upd={updSave} eventPool={eventPool} eventCats={eventCats}/>}
      {tab==="schools"&&   <InvSchoolsTab   inv={inv} upd={updSave}/>}
      {tab==="activity"&&  <InvActivityTab  inv={inv} upd={updSave}/>}
      {tab==="volunteers"&&<InvVolTab       inv={inv} upd={updSave}/>}

      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── PRESET SUPERVISOR ROLES ──────────────────────────────────────────────────
const PRESET_ROLES = ["Head Supervisor","Proctor","Lab Safety Monitor","Score Runner","Grader","Timekeeper","Room Coordinator","Assistant Supervisor"];

// ─── ADMIN EVENT ROLE MANAGER (inside Events tab) ────────────────────────────
const AdminEventRoleManager = ({inv,upd}) => {
  const [expandedEv,setExpandedEv]=useState(null);
  const [customRole,setCustomRole]=useState("");
  const roles=ev=>ev.supervisorRoles||[];
  const filledCount=ev=>roles(ev).filter(r=>r.assignedName).length;

  const addRole=(evId,label)=>{
    if(!label.trim())return;
    const nr={id:"r"+uid(),label:label.trim(),assignedName:"",assignedEmail:"",status:"open"};
    upd(i=>({...i,events:i.events.map(ev=>ev.id===evId?{...ev,supervisorRoles:[...(ev.supervisorRoles||[]),nr]}:ev)}));
    setCustomRole("");
  };
  const removeRole=(evId,roleId)=>upd(i=>({...i,events:i.events.map(ev=>ev.id===evId?{...ev,supervisorRoles:(ev.supervisorRoles||[]).filter(r=>r.id!==roleId)}:ev)}));
  const updateRole=(evId,roleId,field,val)=>upd(i=>({...i,events:i.events.map(ev=>ev.id!==evId?ev:{...ev,supervisorRoles:(ev.supervisorRoles||[]).map(r=>{if(r.id!==roleId)return r;const u={...r,[field]:val};u.status=u.assignedName?"confirmed":"open";return u;})})}));
  const removeEvent=evId=>upd(i=>({...i,events:i.events.filter(ev=>ev.id!==evId)}));

  return (
    <div style={{display:"grid",gap:10}}>
      {inv.events.map(ev=>{
        const evRoles=roles(ev); const filled=filledCount(ev); const isOpen=expandedEv===ev.id;
        const allFilled=evRoles.length>0&&filled===evRoles.length;
        return (
          <Card key={ev.id} style={{padding:0,overflow:"hidden",borderColor:allFilled?"rgba(16,185,129,0.3)":evRoles.some(r=>!r.assignedName)&&evRoles.length>0?"rgba(245,158,11,0.2)":C.border}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer",background:isOpen?"rgba(255,255,255,0.02)":"transparent"}} onClick={()=>setExpandedEv(isOpen?null:ev.id)}>
              <div style={{flex:1}}>
                <div style={{color:C.txt,fontWeight:700,fontSize:13,marginBottom:2}}>{ev.name}</div>
                <div style={{color:C.muted,fontSize:11}}>{ev.category} · Room {ev.room} · Cap. {ev.capacity}</div>
              </div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {evRoles.length===0?<Badge label="No roles defined" color="#64748b"/>:<Badge label={`${filled}/${evRoles.length} filled`} color={allFilled?"#10b981":filled>0?"#3b82f6":"#f59e0b"}/>}
                <Btn small variant="danger" onClick={e=>{e.stopPropagation();removeEvent(ev.id);}}>✕</Btn>
                <span style={{color:C.muted,fontSize:12}}>{isOpen?"▲":"▼"}</span>
              </div>
            </div>
            {isOpen&&(
              <div style={{borderTop:`1px solid ${C.border}`,background:"rgba(0,0,0,0.12)",padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1.3,textTransform:"uppercase",marginBottom:10}}>Supervisor Roles ({evRoles.length})</div>
                {evRoles.length===0&&<div style={{color:C.muted,fontSize:12,marginBottom:12}}>No roles defined yet. Add a role below.</div>}
                <div style={{display:"grid",gap:8,marginBottom:16}}>
                  {evRoles.map(r=>(
                    <div key={r.id} style={{display:"grid",gridTemplateColumns:"180px 1fr 1fr auto",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:9,background:r.assignedName?"rgba(16,185,129,0.06)":"rgba(255,255,255,0.03)",border:`1px solid ${r.assignedName?"rgba(16,185,129,0.2)":C.border}`}}>
                      <span style={{background:r.assignedName?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.06)",color:r.assignedName?"#10b981":C.sub,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:700}}>{r.label}</span>
                      <div>
                        <label style={{display:"block",fontSize:9,fontWeight:700,color:C.muted,marginBottom:3,letterSpacing:0.5,textTransform:"uppercase"}}>Name</label>
                        <input value={r.assignedName} onChange={e=>updateRole(ev.id,r.id,"assignedName",e.target.value)} placeholder="Person's name…" style={{width:"100%",background:"#1a2e47",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",color:"#f1f5f9",fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:9,fontWeight:700,color:C.muted,marginBottom:3,letterSpacing:0.5,textTransform:"uppercase"}}>Email</label>
                        <input value={r.assignedEmail} onChange={e=>updateRole(ev.id,r.id,"assignedEmail",e.target.value)} placeholder="email@school.edu" style={{width:"100%",background:"#1a2e47",border:`1px solid ${C.border}`,borderRadius:7,padding:"6px 10px",color:"#f1f5f9",fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {r.assignedName?<Badge label="✓ Filled" color="#10b981"/>:<Badge label="Open" color="#f59e0b"/>}
                        <button onClick={()=>removeRole(ev.id,r.id)} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:6,width:26,height:26,color:"#ef4444",cursor:"pointer",fontSize:13,fontWeight:700}}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:14}}>
                  <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1.3,textTransform:"uppercase",marginBottom:10}}>Add Supervisor Role</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                    {PRESET_ROLES.filter(pr=>!evRoles.find(r=>r.label===pr)).map(pr=>(
                      <button key={pr} onClick={()=>addRole(ev.id,pr)} style={{padding:"5px 12px",borderRadius:16,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.04)",color:C.sub,fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+ {pr}</button>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input value={customRole} onChange={e=>setCustomRole(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&customRole.trim()){addRole(ev.id,customRole);setCustomRole("");}}} placeholder="Custom role name…" style={{flex:1,background:"#1a2e47",border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 12px",color:"#f1f5f9",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                    <Btn small onClick={()=>{if(customRole.trim())addRole(ev.id,customRole);}}>+ Add Custom</Btn>
                  </div>
                </div>
              </div>
            )}
          </Card>
        );
      })}
      {inv.events.length===0&&<div style={{color:C.muted,fontSize:13}}>No events added yet.</div>}
    </div>
  );
};

const InvEventsTab = ({inv,upd,eventPool,eventCats}) => {
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",category:"Life Science",room:"",capacity:15,supervisorRoles:[]});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const add=()=>{if(!form.name)return;upd(i=>({...i,events:[...i.events,{...form,id:"e"+uid(),capacity:Number(form.capacity)}]}));setForm({name:"",category:"Life Science",room:"",capacity:15,supervisorRoles:[]});setShowAdd(false);};
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <span style={{color:C.sub,fontSize:13}}>{inv.events.length} events configured</span>
        <Btn small onClick={()=>setShowAdd(p=>!p)}>+ Add Event</Btn>
      </div>
      {showAdd&&(
        <Card style={{marginBottom:14,borderColor:"rgba(0,194,168,0.3)",padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <Sel label="Event Name" value={form.name} onChange={v=>{sf("name",v);const ep=eventPool.find(e=>e.name===v);if(ep)sf("category",ep.cat);}} options={[{value:"",label:"Select event..."},...eventPool.map(e=>({value:e.name,label:e.name}))]}/>
            <Sel label="Category" value={form.category} onChange={v=>sf("category",v)} options={eventCats}/>
            <Inp label="Room" value={form.room} onChange={v=>sf("room",v)} placeholder="Rm 204"/>
            <Inp label="Capacity" value={form.capacity} onChange={v=>sf("capacity",v)} type="number"/>
            <div style={{gridColumn:"1/-1",color:C.muted,fontSize:12,padding:"4px 0"}}>Supervisor roles can be added after saving the event.</div>
          </div>
          <div style={{display:"flex",gap:8}}><Btn small onClick={add}>Add</Btn><Btn small variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Card>
      )}
      <AdminEventRoleManager inv={inv} upd={upd}/>
    </div>
  );
};

// ─── INV SCHOOLS TAB ─────────────────────────────────────────────────────────
const InvSchoolsTab = ({inv,upd}) => {
  const [form,setForm]=useState({school:"",coach:"",teamCount:1});
  const [expandedSchool,setExpandedSchool]=useState(null);
  const [expandedTeam,setExpandedTeam]=useState(null);
  const [toast,setToast]=useState("");
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const add=()=>{if(!form.school)return;upd(i=>({...i,registeredSchools:[...i.registeredSchools,{...form,teamCount:Number(form.teamCount),confirmed:false,teams:[]}]}));setForm({school:"",coach:"",teamCount:1});};
  const toggleConfirm=si=>upd(i=>({...i,registeredSchools:i.registeredSchools.map((x,j)=>j===si?{...x,confirmed:!x.confirmed}:x)}));
  const removeSchool=si=>upd(i=>({...i,registeredSchools:i.registeredSchools.filter((_,j)=>j!==si)}));
  const prefix=inv.teamNumberPrefix||"C";

  const assignTeamNumber=(si,ti,num)=>{
    upd(i=>({...i,registeredSchools:i.registeredSchools.map((s,j)=>{if(j!==si)return s;return{...s,teams:s.teams.map((t,k)=>k===ti?{...t,teamNumber:num}:t)};})}));
    setToast("Team number assigned!");
  };

  const allNums=inv.registeredSchools.flatMap(s=>(s.teams||[]).map(t=>t.teamNumber).filter(Boolean));

  return (
    <div>
      <Card style={{marginBottom:14,padding:18}}>
        <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 12px",fontSize:13}}>Add School Registration</h4>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",gap:"0 12px"}}>
          <Inp label="School Name" value={form.school} onChange={v=>sf("school",v)} placeholder="Lincoln High"/>
          <Inp label="Coach Name" value={form.coach} onChange={v=>sf("coach",v)} placeholder="Coach Smith"/>
          <Inp label="Teams" value={form.teamCount} onChange={v=>sf("teamCount",v)} type="number"/>
        </div>
        <Btn small onClick={add}>Register School</Btn>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{color:C.muted,fontSize:12}}>{inv.registeredSchools.length} registered · {inv.registeredSchools.filter(s=>s.confirmed).length} confirmed · {inv.maxTeams} max</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{color:C.muted,fontSize:11}}>Team # prefix:</span>
          <input value={prefix} onChange={e=>upd(i=>({...i,teamNumberPrefix:e.target.value}))} style={{width:50,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 8px",color:C.txt,fontSize:12,textAlign:"center",fontFamily:"inherit",outline:"none"}}/>
        </div>
      </div>
      <div style={{display:"grid",gap:10}}>
        {inv.registeredSchools.map((s,si)=>(
          <Card key={si} style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:"pointer"}} onClick={()=>setExpandedSchool(expandedSchool===si?null:si)}>
              <AV name={s.school} size={38}/>
              <div style={{flex:1}}>
                <div style={{color:C.txt,fontWeight:700,fontSize:13}}>{s.school}</div>
                <div style={{color:C.muted,fontSize:11}}>Coach: {s.coach} · {s.teamCount} team{s.teamCount>1?"s":""} · {(s.teams||[]).length} rosters submitted</div>
              </div>
              <Btn small variant={s.confirmed?"success":"warn"} onClick={e=>{e.stopPropagation();toggleConfirm(si);}}>{s.confirmed?"✓ Confirmed":"Confirm"}</Btn>
              <Btn small variant="danger" onClick={e=>{e.stopPropagation();removeSchool(si);}}>✕</Btn>
              <span style={{color:C.muted,fontSize:12}}>{expandedSchool===si?"▲":"▼"}</span>
            </div>
            {expandedSchool===si&&(
              <div style={{borderTop:`1px solid ${C.border}`,padding:"14px 16px"}}>
                <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1.3,textTransform:"uppercase",marginBottom:10}}>Teams & Roster</div>
                {(s.teams||[]).map((team,ti)=>(
                  <div key={team.id||ti} style={{marginBottom:10,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"rgba(255,255,255,0.02)",cursor:"pointer"}} onClick={()=>setExpandedTeam(expandedTeam===`${si}-${ti}`?null:`${si}-${ti}`)}>
                      <div style={{width:40,height:40,borderRadius:10,background:team.teamNumber?"linear-gradient(135deg,#00c2a8,#3b82f6)":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:13}}>
                        {team.teamNumber||"#?"}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{color:C.txt,fontWeight:700,fontSize:12}}>{s.school}{team.teamSuffix?" – "+team.teamSuffix:""}</div>
                        <div style={{color:C.muted,fontSize:11}}>{(team.students||[]).length} students</div>
                      </div>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {team.teamNumber?<Badge label={team.teamNumber} color="#00c2a8"/>:<Badge label="No # assigned" color="#f59e0b"/>}
                        <span style={{color:C.muted,fontSize:11}}>{expandedTeam===`${si}-${ti}`?"▲":"▼"}</span>
                      </div>
                    </div>
                    {expandedTeam===`${si}-${ti}`&&(
                      <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                          <span style={{color:C.muted,fontSize:12}}>Assign team number:</span>
                          <input defaultValue={team.teamNumber} onBlur={e=>assignTeamNumber(si,ti,e.target.value)} placeholder={`${prefix}01`} style={{width:80,background:"rgba(255,255,255,0.05)",border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 8px",color:C.txt,fontSize:12,fontFamily:"inherit",outline:"none"}}/>
                          {allNums.filter(n=>n===team.teamNumber).length>1&&<Badge label="Duplicate!" color="#ef4444"/>}
                        </div>
                        <div style={{display:"grid",gap:5}}>
                          {(team.students||[]).map(st=>(
                            <div key={st.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:7,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`}}>
                              <AV name={`${st.firstName} ${st.lastName}`} size={28}/>
                              <span style={{flex:1,color:C.txt,fontSize:12}}>{st.firstName} {st.lastName}</span>
                              <Badge label={`Gr. ${st.grade}`} color="#64748b"/>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {(s.teams||[]).length===0&&<div style={{color:C.muted,fontSize:12,fontStyle:"italic"}}>No team rosters submitted yet.</div>}
              </div>
            )}
          </Card>
        ))}
        {inv.registeredSchools.length===0&&<div style={{color:C.muted,fontSize:13}}>No schools registered yet.</div>}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

const InvVolTab = ({inv,upd}) => {
  const [form,setForm]=useState({name:"",email:"",pref:"Proctoring"});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const add=()=>{if(!form.name)return;upd(i=>({...i,volunteers:[...i.volunteers,{...form}]}));setForm({name:"",email:"",pref:"Proctoring"});};
  return (
    <div>
      <Card style={{marginBottom:14,padding:18}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 150px",gap:"0 12px"}}>
          <Inp label="Name" value={form.name} onChange={v=>sf("name",v)}/>
          <Inp label="Email" value={form.email} onChange={v=>sf("email",v)} type="email"/>
          <Sel label="Preference" value={form.pref} onChange={v=>sf("pref",v)} options={["Proctoring","Setup","Grading","Escorting","Other"]}/>
        </div>
        <Btn small onClick={add}>Add Volunteer</Btn>
      </Card>
      <div style={{display:"grid",gap:8}}>
        {inv.volunteers.map((v,i)=>(
          <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:14}}>
            <AV name={v.name} size={36}/>
            <div style={{flex:1}}><div style={{color:C.txt,fontWeight:600,fontSize:13}}>{v.name}</div><div style={{color:C.muted,fontSize:11}}>{v.email}</div></div>
            <Badge label={v.pref} color="#3b82f6"/>
            <Btn small variant="danger" onClick={()=>upd(i2=>({...i2,volunteers:i2.volunteers.filter((_,j)=>j!==i)}))}>✕</Btn>
          </Card>
        ))}
        {inv.volunteers.length===0&&<Card style={{textAlign:"center",padding:32,color:C.muted}}>No volunteers added yet.</Card>}
      </div>
    </div>
  );
};

// ─── SUPERVISOR ROLE CONFIGURATION + NOMINATIONS (Activity tab sub-panel) ────
const AdminSupervisorRoleSection = ({inv, upd, proposedSupervisors, pendingSupervs, confirmSupervisor, rejectSupervisor, removeSupervisor}) => {
  const [rolePanel,setRolePanel]             = useState("configure");
  const [newRoleEvent,setNewRoleEvent]       = useState("");
  const [customRoleLabel,setCustomRoleLabel] = useState("");

  const allRoles    = inv.events.flatMap(ev=>(ev.supervisorRoles||[]).map(r=>({...r,evName:ev.name,evId:ev.id})));
  const totalRoles  = allRoles.length;
  const filledRoles = allRoles.filter(r=>r.assignedName).length;
  const openRoles   = totalRoles - filledRoles;

  const addRoleToEvent = label => {
    if(!newRoleEvent||!label.trim()) return;
    const nr={id:"r"+uid(),label:label.trim(),assignedName:"",assignedEmail:"",status:"open"};
    upd(i=>({...i,events:i.events.map(ev=>ev.name===newRoleEvent?{...ev,supervisorRoles:[...(ev.supervisorRoles||[]),nr]}:ev)}));
    setCustomRoleLabel("");
  };
  const removeRoleFromEvent=(evId,roleId)=>upd(i=>({...i,events:i.events.map(ev=>ev.id===evId?{...ev,supervisorRoles:(ev.supervisorRoles||[]).filter(r=>r.id!==roleId)}:ev)}));

  const eventRoleOptions=[{value:"",label:"Select event..."},...inv.events.map(e=>({value:e.name,label:e.name}))];
  const selectedEvRoles=newRoleEvent?(inv.events.find(e=>e.name===newRoleEvent)?.supervisorRoles||[]):[];
  const availablePresets=PRESET_ROLES.filter(p=>!selectedEvRoles.find(r=>r.label===p));

  const panelTabs=[
    {id:"configure",   label:"⚙️ Configure Roles"},
    {id:"nominations", label:"📥 Nominations"+(pendingSupervs>0?" ("+pendingSupervs+")":"")},
  ];

  return (
    <div>
      {/* Panel tab switcher + stats */}
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        {panelTabs.map(pt=>(
          <button key={pt.id} onClick={()=>setRolePanel(pt.id)} style={{
            padding:"7px 16px",borderRadius:16,fontFamily:"inherit",cursor:"pointer",fontWeight:700,fontSize:12,
            border:`1px solid ${rolePanel===pt.id?"rgba(0,194,168,0.5)":C.border}`,
            background:rolePanel===pt.id?"rgba(0,194,168,0.09)":"transparent",
            color:rolePanel===pt.id?C.accent:C.muted,
          }}>{pt.label}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Badge label={`${totalRoles} roles`} color="#64748b"/>
          <Badge label={`${filledRoles} filled`} color="#10b981"/>
          {openRoles>0&&<Badge label={`${openRoles} open`} color="#f59e0b"/>}
        </div>
      </div>

      {/* ── Configure Roles panel ── */}
      {rolePanel==="configure"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:18,alignItems:"start"}}>
          {/* Left: event list with role rows */}
          <div>
            <p style={{color:C.muted,fontSize:12,margin:"0 0 14px",lineHeight:1.6}}>
              Define supervisor roles per event. Coaches can <strong style={{color:C.sub}}>only nominate someone for a role you create here</strong>. Events with no roles show as "nominations blocked."
            </p>
            {inv.events.length===0&&<Card style={{textAlign:"center",padding:36,color:C.muted}}>No events configured yet — add events in the Events tab first.</Card>}
            <div style={{display:"grid",gap:10}}>
              {inv.events.map(ev=>{
                const evRoles=ev.supervisorRoles||[];
                const filled=evRoles.filter(r=>r.assignedName).length;
                return (
                  <Card key={ev.id} style={{padding:0,overflow:"hidden",borderColor:evRoles.length===0?"rgba(239,68,68,0.25)":filled===evRoles.length?"rgba(16,185,129,0.3)":C.border}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:evRoles.length===0?"rgba(239,68,68,0.04)":"rgba(255,255,255,0.02)"}}>
                      <div style={{flex:1}}>
                        <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{ev.name}</span>
                        {ev.room&&<span style={{color:C.muted,fontSize:11,marginLeft:8}}>· {ev.room}</span>}
                      </div>
                      {evRoles.length===0
                        ?<Badge label="No roles — nominations blocked" color="#ef4444"/>
                        :<Badge label={`${filled}/${evRoles.length} filled`} color={filled===evRoles.length?"#10b981":evRoles.some(r=>!r.assignedName)?"#f59e0b":"#3b82f6"}/>
                      }
                      <button onClick={()=>setNewRoleEvent(ev.name)}
                        style={{padding:"4px 12px",borderRadius:8,border:`1px solid ${C.accent}`,background:"rgba(0,194,168,0.1)",color:C.accent,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                        + Add Role
                      </button>
                    </div>
                    {evRoles.map(r=>(
                      <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 16px",borderTop:`1px solid ${C.border}`,background:r.assignedName?"rgba(16,185,129,0.04)":"transparent"}}>
                        <span style={{padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:700,background:r.assignedName?"rgba(16,185,129,0.12)":"rgba(255,255,255,0.06)",color:r.assignedName?"#10b981":C.sub,minWidth:160,display:"inline-block",textAlign:"center"}}>{r.label}</span>
                        <div style={{flex:1,fontSize:12}}>
                          {r.assignedName
                            ?<><span style={{color:C.txt,fontWeight:700}}>{r.assignedName}</span>{r.assignedEmail&&<span style={{color:C.muted,marginLeft:6}}>{r.assignedEmail}</span>}</>
                            :<span style={{color:C.muted,fontStyle:"italic"}}>Open — awaiting nomination</span>
                          }
                        </div>
                        {r.assignedName?<Badge label="✓ Filled" color="#10b981"/>:<Badge label="Open" color="#f59e0b"/>}
                        <button onClick={()=>removeRoleFromEvent(ev.id,r.id)}
                          style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,width:26,height:26,color:"#ef4444",cursor:"pointer",fontSize:14,fontWeight:700,lineHeight:"26px",textAlign:"center"}}>✕</button>
                      </div>
                    ))}
                    {evRoles.length===0&&(
                      <div style={{padding:"9px 16px",borderTop:`1px solid ${C.border}`,color:"#ef4444",fontSize:11,fontStyle:"italic"}}>
                        No roles yet — coaches cannot nominate anyone until you add a role.
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Right: sticky add-role form */}
          <div style={{position:"sticky",top:20}}>
            <Card style={{padding:18,borderColor:"rgba(0,194,168,0.25)"}}>
              <h4 style={{color:C.txt,fontWeight:800,margin:"0 0 4px",fontSize:14}}>Add a Supervisor Role</h4>
              <p style={{color:C.muted,fontSize:11,margin:"0 0 16px",lineHeight:1.7}}>
                Select an event, then choose or type a role name. Coaches will see exactly these roles when submitting nominations.
              </p>
              <Sel label="Event" value={newRoleEvent} onChange={v=>{setNewRoleEvent(v);setCustomRoleLabel("");}} options={eventRoleOptions}/>
              {newRoleEvent&&(
                <>
                  <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:8,letterSpacing:0.6,textTransform:"uppercase"}}>Role / Position Label</label>
                  {availablePresets.length>0&&(
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
                      {availablePresets.map(p=>(
                        <button key={p} onClick={()=>addRoleToEvent(p)}
                          style={{padding:"5px 12px",borderRadius:16,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.04)",color:C.sub,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                          + {p}
                        </button>
                      ))}
                    </div>
                  )}
                  {availablePresets.length===0&&<p style={{color:C.muted,fontSize:11,marginBottom:10,fontStyle:"italic"}}>All preset roles added. Use custom below.</p>}
                  <div style={{display:"flex",gap:8}}>
                    <input value={customRoleLabel} onChange={e=>setCustomRoleLabel(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&customRoleLabel.trim())addRoleToEvent(customRoleLabel);}}
                      placeholder="e.g. Anatomy & Physiology ES..."
                      style={{flex:1,background:"#1a2e47",border:`1px solid ${C.accent}`,borderRadius:8,padding:"8px 12px",color:"#f1f5f9",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
                    <Btn small onClick={()=>{if(customRoleLabel.trim())addRoleToEvent(customRoleLabel);}}>Add</Btn>
                  </div>
                  {selectedEvRoles.length>0&&(
                    <div style={{marginTop:16,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                      <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Roles for {newRoleEvent}</div>
                      <div style={{display:"grid",gap:5}}>
                        {selectedEvRoles.map(r=>(
                          <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",borderRadius:7,background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`}}>
                            <span style={{flex:1,color:C.sub,fontSize:12,fontWeight:600}}>{r.label}</span>
                            {r.assignedName?<Badge label="Filled" color="#10b981"/>:<Badge label="Open" color="#f59e0b"/>}
                            <button onClick={()=>removeRoleFromEvent(inv.events.find(e=>e.name===newRoleEvent)?.id,r.id)}
                              style={{background:"transparent",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14,fontWeight:700,padding:"0 2px"}}>✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedEvRoles.length===0&&<p style={{color:C.muted,fontSize:11,marginTop:14,fontStyle:"italic",textAlign:"center"}}>No roles yet for this event.</p>}
                </>
              )}
              {!newRoleEvent&&<p style={{color:C.muted,fontSize:12,textAlign:"center",fontStyle:"italic",padding:"10px 0"}}>Select an event above to start adding roles.</p>}
            </Card>
          </div>
        </div>
      )}

      {/* ── Nominations panel ── */}
      {rolePanel==="nominations"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{color:C.muted,fontSize:13,margin:0}}>Nominations submitted by coaches. Confirm to assign them to the role.</p>
            <div style={{display:"flex",gap:8}}>
              <Badge label={`${pendingSupervs} pending`} color="#f59e0b"/>
              <Badge label={`${proposedSupervisors.filter(p=>p.status==="confirmed").length} confirmed`} color="#10b981"/>
            </div>
          </div>
          {proposedSupervisors.length===0&&<Card style={{textAlign:"center",padding:36,color:C.muted}}>No nominations yet. Coaches can submit nominations once roles are configured.</Card>}
          {["pending","confirmed","rejected"].map(st=>{
            const group=proposedSupervisors.filter(p=>p.status===st);
            if(!group.length) return null;
            const stC={pending:"#f59e0b",confirmed:"#10b981",rejected:"#ef4444"};
            return (
              <div key={st} style={{marginBottom:20}}>
                <div style={{fontSize:10,fontWeight:800,color:stC[st],letterSpacing:1.3,textTransform:"uppercase",marginBottom:8}}>{st} ({group.length})</div>
                <div style={{display:"grid",gap:8}}>
                  {group.map(ps=>(
                    <Card key={ps.id} style={{display:"flex",alignItems:"center",gap:14,padding:14,borderColor:st==="pending"?"rgba(245,158,11,0.25)":st==="confirmed"?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.15)"}}>
                      <AV name={ps.name} size={40}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:3}}>
                          <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{ps.name}</span>
                          <Badge label={ps.event} color="#8b5cf6"/>
                          {ps.roleLabel&&<Badge label={ps.roleLabel} color="#3b82f6"/>}
                          {ps.school&&<span style={{color:C.muted,fontSize:11}}>from {ps.school}</span>}
                        </div>
                        <div style={{color:C.muted,fontSize:11}}>✉️ {ps.email}</div>
                        {st==="confirmed"&&<div style={{color:"#10b981",fontSize:11,marginTop:2}}>✓ Assigned as {ps.roleLabel||"supervisor"} for {ps.event}</div>}
                      </div>
                      <div style={{display:"flex",gap:7}}>
                        {st==="pending"&&<><Btn small variant="success" onClick={()=>confirmSupervisor(ps.id)}>✓ Confirm</Btn><Btn small variant="danger" onClick={()=>rejectSupervisor(ps.id)}>✕ Reject</Btn></>}
                        {st!=="pending"&&<Btn small variant="danger" onClick={()=>removeSupervisor(ps.id)}>Remove</Btn>}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── UNIFIED ACTIVITY TAB (Admin) ─────────────────────────────────────────────
const InvActivityTab = ({inv,upd}) => {
  const [section,setSection]=useState("supervisors");
  const [buildForm,setBuildForm]=useState({time:"",event:"",location:"",capacity:3});
  const bf=(k,v)=>setBuildForm(p=>({...p,[k]:v}));

  const proposedSupervisors=inv.proposedSupervisors||[];
  const pendingAppeals=inv.appeals.filter(a=>a.status==="Pending").length;
  const pendingSupervs=proposedSupervisors.filter(p=>p.status==="pending").length;
  const pendingBuild=inv.buildSlots.filter(s=>s.volunteers.length<s.capacity).length;

  const confirmSupervisor=id=>{
    upd(i=>{
      const ps=(i.proposedSupervisors||[]).find(p=>p.id===id);
      return {...i,
        proposedSupervisors:(i.proposedSupervisors||[]).map(p=>p.id===id?{...p,status:"confirmed"}:p),
        events:i.events.map(ev=>{
          if(!ps||ev.name!==ps.event) return ev;
          return {...ev,supervisorRoles:(ev.supervisorRoles||[]).map(r=>r.id===ps.roleId?{...r,assignedName:ps.name,assignedEmail:ps.email,status:"confirmed"}:r)};
        }),
      };
    });
  };
  const rejectSupervisor=id=>upd(i=>({...i,proposedSupervisors:(i.proposedSupervisors||[]).map(p=>p.id===id?{...p,status:"rejected"}:p)}));
  const removeSupervisor=id=>upd(i=>({...i,proposedSupervisors:(i.proposedSupervisors||[]).filter(p=>p.id!==id)}));
  const addBuildSlot=()=>{if(!buildForm.time||!buildForm.event)return;upd(i=>({...i,buildSlots:[...i.buildSlots,{...buildForm,id:"b"+uid(),capacity:Number(buildForm.capacity),volunteers:[]}]}));setBuildForm({time:"",event:"",location:"",capacity:3});};
  const removeBuildSlot=id=>upd(i=>({...i,buildSlots:i.buildSlots.filter(s=>s.id!==id)}));
  const resolveAppeal=id=>upd(i=>({...i,appeals:i.appeals.map(a=>a.id===id?{...a,status:"Resolved"}:a)}));
  const removeAppeal=id=>upd(i=>({...i,appeals:i.appeals.filter(a=>a.id!==id)}));
  const eventOptions=[{value:"",label:"Select event..."},...inv.events.map(e=>({value:e.name,label:e.name})),{value:"Other",label:"Other"}];

  const secs=[
    {id:"supervisors",label:`👤 Supervisor Nominations${pendingSupervs>0?" ("+pendingSupervs+")":""}`},
    {id:"build",      label:`🔧 Build Slots (${inv.buildSlots.length})`},
    {id:"appeals",    label:`📋 Appeals & Inquiries${pendingAppeals>0?" ("+pendingAppeals+")":""}`},
  ];

  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap"}}>
        {secs.map(s=>(
          <button key={s.id} onClick={()=>setSection(s.id)} style={{
            padding:"8px 18px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:12,
            border:`1px solid ${section===s.id?"rgba(0,194,168,0.6)":C.border}`,
            background:section===s.id?"rgba(0,194,168,0.1)":"transparent",
            color:section===s.id?C.accent:C.muted,
          }}>{s.label}</button>
        ))}
      </div>

      {section==="supervisors"&&(
        <AdminSupervisorRoleSection
          inv={inv} upd={upd}
          proposedSupervisors={proposedSupervisors}
          pendingSupervs={pendingSupervs}
          confirmSupervisor={confirmSupervisor}
          rejectSupervisor={rejectSupervisor}
          removeSupervisor={removeSupervisor}
        />
      )}

      {section==="build"&&(
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:18,alignItems:"start"}}>
            <div>
              <div style={{color:C.muted,fontSize:12,marginBottom:12}}>{inv.buildSlots.length} slots · {pendingBuild} still have open spots</div>
              <div style={{display:"grid",gap:10}}>
                {inv.buildSlots.map(s=>(
                  <Card key={s.id} style={{padding:14}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                      <div style={{flex:1}}>
                        <div style={{color:C.txt,fontWeight:700,fontSize:14,marginBottom:4}}>{s.event}</div>
                        <div style={{color:C.muted,fontSize:12,marginBottom:10}}>⏰ {s.time} · 📍 {s.location} · {s.volunteers.length}/{s.capacity} filled</div>
                        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                          {s.volunteers.map((v,i)=><Badge key={i} label={v} color="#3b82f6"/>)}
                          {Array.from({length:s.capacity-s.volunteers.length}).map((_,i)=><span key={i} style={{color:"#334155",fontSize:11,border:"1px dashed #2a3a4a",borderRadius:20,padding:"2px 10px"}}>Open</span>)}
                        </div>
                      </div>
                      <Btn small variant="danger" onClick={()=>removeBuildSlot(s.id)}>✕</Btn>
                    </div>
                  </Card>
                ))}
                {inv.buildSlots.length===0&&<Card style={{textAlign:"center",padding:32,color:C.muted}}>No build slots yet.</Card>}
              </div>
            </div>
            <Card style={{padding:18,borderColor:"rgba(0,194,168,0.2)"}}>
              <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 14px",fontSize:13}}>+ Add Build Slot</h4>
              <Inp label="Time Slot" value={buildForm.time} onChange={v=>bf("time",v)} placeholder="9:00–10:00 AM"/>
              <Sel label="Event" value={buildForm.event} onChange={v=>bf("event",v)} options={eventOptions}/>
              <Inp label="Location" value={buildForm.location} onChange={v=>bf("location",v)} placeholder="Gym A"/>
              <Inp label="Capacity" value={buildForm.capacity} onChange={v=>bf("capacity",v)} type="number"/>
              <Btn onClick={addBuildSlot}>Add Slot</Btn>
            </Card>
          </div>
        </div>
      )}

      {section==="appeals"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <p style={{color:C.muted,fontSize:13,margin:0}}>All appeals and inquiries filed by coaches.</p>
            <div style={{display:"flex",gap:8}}>
              <Badge label={`${pendingAppeals} pending`} color="#f59e0b"/>
              <Badge label={`${inv.appeals.filter(a=>a.status==="Resolved").length} resolved`} color="#10b981"/>
            </div>
          </div>
          <div style={{display:"grid",gap:10}}>
            {inv.appeals.map(a=>(
              <Card key={a.id} style={{padding:16,borderColor:a.status==="Pending"?"rgba(245,158,11,0.2)":"rgba(16,185,129,0.15)"}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                    <Badge label={a.type} color={a.type==="Appeal"?"#f59e0b":"#3b82f6"}/>
                    {a.event&&<Badge label={a.event} color="#8b5cf6"/>}
                    {a.school&&<span style={{color:C.muted,fontSize:11}}>from {a.school}</span>}
                    <span style={{color:"#2a3a4a",fontSize:11}}>· {a.date}</span>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0,alignItems:"center"}}>
                    <Badge label={a.status}/>
                    {a.status==="Pending"&&<Btn small variant="success" onClick={()=>resolveAppeal(a.id)}>Resolve</Btn>}
                    <Btn small variant="danger" onClick={()=>removeAppeal(a.id)}>✕</Btn>
                  </div>
                </div>
                <div style={{color:C.txt,fontWeight:600,fontSize:13,marginBottom:4}}>{a.subject}</div>
                {a.body&&<div style={{color:C.muted,fontSize:12,lineHeight:1.6}}>{a.body}</div>}
              </Card>
            ))}
            {inv.appeals.length===0&&<Card style={{textAlign:"center",padding:36,color:C.muted}}>No appeals or inquiries filed yet.</Card>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── COACH BUILD TAB ──────────────────────────────────────────────────────────
const InvBuildTab = ({inv,upd,isAdmin,coachName}) => {
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({time:"",event:"",location:"",capacity:3});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const me=coachName||"Admin";

  const addSlot=()=>{if(!form.time||!form.event)return;upd(i=>({...i,buildSlots:[...i.buildSlots,{...form,id:"b"+uid(),capacity:Number(form.capacity),volunteers:[]}]}));setForm({time:"",event:"",location:"",capacity:3});setShowAdd(false);};
  const toggle=bid=>upd(i=>({...i,buildSlots:i.buildSlots.map(s=>{
    if(s.id!==bid)return s;
    if(s.volunteers.includes(me))return{...s,volunteers:s.volunteers.filter(v=>v!==me)};
    if(s.volunteers.length>=s.capacity)return s;
    return{...s,volunteers:[...s.volunteers,me]};
  })}));
  const eventOptions=[{value:"",label:"Select event..."},...inv.events.map(e=>({value:e.name,label:e.name}))];

  return (
    <div>
      {isAdmin&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn small onClick={()=>setShowAdd(p=>!p)}>+ Add Slot</Btn></div>}
      {isAdmin&&showAdd&&(
        <Card style={{marginBottom:14,borderColor:"rgba(0,194,168,0.3)",padding:18}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 80px",gap:"0 12px"}}>
            <Inp label="Time" value={form.time} onChange={v=>sf("time",v)} placeholder="9:00–10:00 AM"/>
            <Sel label="Event" value={form.event} onChange={v=>sf("event",v)} options={eventOptions}/>
            <Inp label="Location" value={form.location} onChange={v=>sf("location",v)} placeholder="Gym A"/>
            <Inp label="Cap." value={form.capacity} onChange={v=>sf("capacity",v)} type="number"/>
          </div>
          <div style={{display:"flex",gap:8}}><Btn small onClick={addSlot}>Add</Btn><Btn small variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Card>
      )}
      <div style={{display:"grid",gap:10}}>
        {inv.buildSlots.map(s=>{
          const isMine=s.volunteers.includes(me);
          const full=s.volunteers.length>=s.capacity;
          return (
            <Card key={s.id} style={{borderColor:isMine?"rgba(0,194,168,0.3)":C.border}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{flex:1}}>
                  <div style={{color:C.txt,fontWeight:700,fontSize:14,marginBottom:4}}>{s.event}</div>
                  <div style={{color:C.muted,fontSize:12,marginBottom:10}}>⏰ {s.time} · 📍 {s.location}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {s.volunteers.map((v,i)=><Badge key={i} label={v} color={v===me?"#00c2a8":"#3b82f6"}/>)}
                    {Array.from({length:s.capacity-s.volunteers.length}).map((_,i)=><span key={i} style={{color:"#334155",fontSize:11,border:"1px dashed #2a3a4a",borderRadius:20,padding:"2px 10px"}}>Open</span>)}
                  </div>
                </div>
                <div style={{display:"flex",gap:7}}>
                  {!isAdmin&&<Btn small variant={isMine?"danger":full?"ghost":"primary"} onClick={()=>toggle(s.id)} style={{opacity:full&&!isMine?0.4:1}}>{isMine?"Leave":"Sign Up"}</Btn>}
                  {isAdmin&&<Btn small variant="danger" onClick={()=>upd(i=>({...i,buildSlots:i.buildSlots.filter(b=>b.id!==s.id)}))}>✕</Btn>}
                </div>
              </div>
            </Card>
          );
        })}
        {inv.buildSlots.length===0&&<Card style={{textAlign:"center",padding:32,color:C.muted}}>No build slots yet.</Card>}
      </div>
    </div>
  );
};

// ─── APPEALS TAB (shared coach/admin) ─────────────────────────────────────────
const InvAppealsTab = ({inv,upd,isAdmin}) => {
  const [form,setForm]=useState({type:"Inquiry",event:"",subject:"",body:"",school:""});
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=()=>{if(!form.subject||!form.body)return;upd(i=>({...i,appeals:[...i.appeals,{...form,id:"a"+uid(),status:"Pending",date:"Today"}]}));setForm({type:"Inquiry",event:"",subject:"",body:"",school:""}); };
  const eventOptions=[{value:"",label:"(General)"},...inv.events.map(e=>({value:e.name,label:e.name}))];
  return (
    <div>
      {!isAdmin&&(
        <Card style={{marginBottom:14,borderColor:"rgba(0,194,168,0.2)",padding:18}}>
          <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 12px",fontSize:14}}>Submit an Appeal or Inquiry</h4>
          <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:"0 12px"}}>
            <Sel label="Type" value={form.type} onChange={v=>sf("type",v)} options={["Inquiry","Appeal"]}/>
            <Sel label="Related Event" value={form.event} onChange={v=>sf("event",v)} options={eventOptions}/>
          </div>
          <Inp label="Subject" value={form.subject} onChange={v=>sf("subject",v)} placeholder="Brief subject…"/>
          <TA label="Details" value={form.body} onChange={v=>sf("body",v)} rows={4} placeholder="Describe your inquiry or appeal…"/>
          <Btn onClick={submit}>Submit</Btn>
        </Card>
      )}
      <div style={{display:"grid",gap:10}}>
        {inv.appeals.map(a=>(
          <Card key={a.id} style={{padding:16,borderColor:a.status==="Pending"?"rgba(245,158,11,0.2)":"rgba(16,185,129,0.15)"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:8}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                <Badge label={a.type} color={a.type==="Appeal"?"#f59e0b":"#3b82f6"}/>
                {a.event&&<Badge label={a.event} color="#8b5cf6"/>}
                {a.school&&<span style={{color:C.muted,fontSize:11}}>from {a.school}</span>}
              </div>
              <div style={{display:"flex",gap:6}}>
                <Badge label={a.status}/>
                {isAdmin&&a.status==="Pending"&&<Btn small variant="success" onClick={()=>upd(i=>({...i,appeals:i.appeals.map(x=>x.id===a.id?{...x,status:"Resolved"}:x)}))}>Resolve</Btn>}
                {isAdmin&&<Btn small variant="danger" onClick={()=>upd(i=>({...i,appeals:i.appeals.filter(x=>x.id!==a.id)}))}>✕</Btn>}
              </div>
            </div>
            <div style={{color:C.txt,fontWeight:600,fontSize:13,marginBottom:4}}>{a.subject}</div>
            {a.body&&<div style={{color:C.muted,fontSize:12,lineHeight:1.6}}>{a.body}</div>}
          </Card>
        ))}
        {inv.appeals.length===0&&<Card style={{textAlign:"center",padding:36,color:C.muted}}>No appeals or inquiries yet.</Card>}
      </div>
    </div>
  );
};

// ─── COACH ROSTER TAB ─────────────────────────────────────────────────────────
const CoachRosterTab = ({inv,upd,coachSchool}) => {
  const myReg=inv.registeredSchools.find(s=>s.school===coachSchool);
  const myIdx=inv.registeredSchools.findIndex(s=>s.school===coachSchool);
  const [expandedTeam,setExpandedTeam]=useState(null);
  const [toast,setToast]=useState("");
  const [studentForm,setStudentForm]=useState({firstName:"",lastName:"",grade:""});
  const [addingToTeam,setAddingToTeam]=useState(null);
  const [editStudent,setEditStudent]=useState(null);
  const [editingSuffix,setEditingSuffix]=useState(null);
  const [suffixDraft,setSuffixDraft]=useState("");
  const sf=(k,v)=>setStudentForm(p=>({...p,[k]:v}));

  if(!myReg) return <Card style={{textAlign:"center",padding:40,color:C.muted}}>Register your school first in the Registration tab before managing rosters.</Card>;

  const teams=myReg.teams||[];
  const updSchool=fn=>upd(i=>({...i,registeredSchools:i.registeredSchools.map((s,j)=>j===myIdx?fn(s):s)}));

  const addTeam=()=>{updSchool(s=>({...s,teams:[...(s.teams||[]),{id:"t"+uid(),teamNumber:"",teamSuffix:"",students:[]}]}));setToast("New team created!");};
  const removeTeam=ti=>{if(!confirm("Remove this team?"))return;updSchool(s=>({...s,teams:(s.teams||[]).filter((_,k)=>k!==ti)}));setExpandedTeam(null);setToast("Team removed.");};
  const getTeamName=team=>`${coachSchool}${team.teamSuffix?" – "+team.teamSuffix:""}`;
  const updateTeamSuffix=(ti,val)=>updSchool(s=>({...s,teams:(s.teams||[]).map((t,k)=>k===ti?{...t,teamSuffix:val}:t)}));

  const addStudent=ti=>{
    if(!studentForm.firstName||!studentForm.lastName)return;
    updSchool(s=>({...s,teams:(s.teams||[]).map((t,k)=>k===ti?{...t,students:[...(t.students||[]),{id:"st"+uid(),...studentForm,grade:Number(studentForm.grade)||""}]}:t)}));
    setStudentForm({firstName:"",lastName:"",grade:""});setAddingToTeam(null);setToast("Student added!");
  };
  const removeStudent=(ti,sid)=>updSchool(s=>({...s,teams:(s.teams||[]).map((t,k)=>k===ti?{...t,students:(t.students||[]).filter(st=>st.id!==sid)}:t)}));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><h4 style={{color:C.txt,fontWeight:700,margin:0,fontSize:14}}>Team Rosters</h4><div style={{color:C.muted,fontSize:12,marginTop:2}}>{teams.length} teams · {teams.reduce((s,t)=>s+(t.students||[]).length,0)} students total</div></div>
        <Btn small onClick={addTeam}>+ Add Team</Btn>
      </div>
      {teams.length===0&&<Card style={{textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:10}}>👥</div><div style={{color:C.txt,fontWeight:700,fontSize:14,marginBottom:6}}>No teams yet</div><Btn onClick={addTeam}>+ Create First Team</Btn></Card>}
      <div style={{display:"grid",gap:12}}>
        {teams.map((team,ti)=>{
          const isExp=expandedTeam===ti;
          const studentCount=(team.students||[]).length;
          return (
            <Card key={team.id||ti} style={{padding:0,overflow:"hidden",borderColor:team.teamNumber?"rgba(0,194,168,0.3)":C.border}}>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",cursor:"pointer",background:team.teamNumber?"rgba(0,194,168,0.05)":"transparent"}} onClick={()=>setExpandedTeam(isExp?null:ti)}>
                <div style={{width:52,height:52,borderRadius:12,flexShrink:0,background:team.teamNumber?"linear-gradient(135deg,#00c2a8,#3b82f6)":"rgba(255,255,255,0.05)",border:`2px solid ${team.teamNumber?"transparent":C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  {team.teamNumber?<span style={{color:"#fff",fontWeight:900,fontSize:14}}>{team.teamNumber}</span>:<><span style={{fontSize:18}}>👥</span><span style={{color:C.muted,fontSize:9}}>No #</span></>}
                </div>
                <div style={{flex:1}}>
                  {editingSuffix===ti?(
                    <div style={{display:"flex",alignItems:"center",gap:6}} onClick={e=>e.stopPropagation()}>
                      <span style={{color:C.muted,fontSize:12,whiteSpace:"nowrap",flexShrink:0}}>{coachSchool}</span>
                      <input autoFocus value={suffixDraft} onChange={e=>setSuffixDraft(e.target.value)}
                        onKeyDown={e=>{if(e.key==="Enter"){updateTeamSuffix(ti,suffixDraft);setEditingSuffix(null);setToast("Saved!");}if(e.key==="Escape")setEditingSuffix(null);}}
                        placeholder="e.g. Alpha, Beta…"
                        style={{flex:1,background:"rgba(255,255,255,0.08)",border:`1px solid ${C.accent}`,borderRadius:7,padding:"4px 10px",color:C.txt,fontSize:13,fontWeight:700,outline:"none",fontFamily:"inherit",minWidth:0}}/>
                      <Btn small onClick={e=>{e.stopPropagation();updateTeamSuffix(ti,suffixDraft);setEditingSuffix(null);setToast("Saved!");}}>Save</Btn>
                      <Btn small variant="ghost" onClick={e=>{e.stopPropagation();setEditingSuffix(null);}}>✕</Btn>
                    </div>
                  ):(
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{color:C.txt,fontWeight:800,fontSize:14}}>{getTeamName(team)}</span>
                      {team.teamNumber&&<span style={{color:C.accent,fontWeight:700,fontSize:13}}>· {team.teamNumber}</span>}
                      <button onClick={e=>{e.stopPropagation();setSuffixDraft(team.teamSuffix||"");setEditingSuffix(ti);}} style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 8px",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>✏️ rename</button>
                    </div>
                  )}
                  <div style={{color:C.muted,fontSize:12,marginTop:3}}>{studentCount} student{studentCount!==1?"s":""}</div>
                </div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}>
                  <Btn small onClick={e=>{e.stopPropagation();setStudentForm({firstName:"",lastName:"",grade:""});setAddingToTeam(ti);setExpandedTeam(ti);}}>+ Add Student</Btn>
                  <Btn small variant="danger" onClick={e=>{e.stopPropagation();removeTeam(ti);}}>Remove Team</Btn>
                  <span style={{color:C.muted,fontSize:12}}>{isExp?"▲":"▼"}</span>
                </div>
              </div>
              {isExp&&(
                <div style={{borderTop:`1px solid ${C.border}`,padding:"14px 16px"}}>
                  {addingToTeam===ti&&(
                    <Card style={{marginBottom:12,borderColor:"rgba(0,194,168,0.3)",padding:14}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 80px",gap:"0 10px"}}>
                        <Inp label="First Name" value={studentForm.firstName} onChange={v=>sf("firstName",v)}/>
                        <Inp label="Last Name"  value={studentForm.lastName}  onChange={v=>sf("lastName",v)}/>
                        <Inp label="Grade"      value={studentForm.grade}     onChange={v=>sf("grade",v)} type="number"/>
                      </div>
                      <div style={{display:"flex",gap:8}}><Btn small onClick={()=>addStudent(ti)}>Add Student</Btn><Btn small variant="ghost" onClick={()=>setAddingToTeam(null)}>Cancel</Btn></div>
                    </Card>
                  )}
                  {(team.students||[]).map(st=>(
                    <div key={st.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                      <AV name={`${st.firstName} ${st.lastName}`} size={30}/>
                      <span style={{flex:1,color:C.txt,fontSize:13}}>{st.firstName} {st.lastName}</span>
                      <Badge label={`Gr. ${st.grade}`} color="#64748b"/>
                      <Btn small variant="danger" onClick={()=>removeStudent(ti,st.id)}>✕</Btn>
                    </div>
                  ))}
                  {(team.students||[]).length===0&&!addingToTeam&&<div style={{color:C.muted,fontSize:12,textAlign:"center",padding:"12px 0"}}>No students yet. Click "+ Add Student" above.</div>}
                </div>
              )}
            </Card>
          );
        })}
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── COACH SUPERVISORS TAB ────────────────────────────────────────────────────
const CoachSupervisorsTab = ({inv,upd,coachSchool}) => {
  const [form,setForm]=useState({name:"",email:"",event:"",roleId:"",roleLabel:""});
  const [toast,setToast]=useState("");
  const sf=(k,v)=>setForm(p=>({...p,[k]:v}));

  const myNominations=(inv.proposedSupervisors||[]).filter(p=>p.school===coachSchool);
  const openSlots=inv.events.flatMap(ev=>(ev.supervisorRoles||[]).filter(r=>r.status==="open"&&!r.assignedName).map(r=>({evId:ev.id,evName:ev.name,roleId:r.id,roleLabel:r.label})));
  const selectedEvent=form.event?inv.events.find(e=>e.name===form.event):null;
  const rolesForEvent=selectedEvent?(selectedEvent.supervisorRoles||[]).filter(r=>r.status==="open"&&!r.assignedName):[];

  const submit=()=>{
    if(!form.name.trim()||!form.email.trim()||!form.event||!form.roleId) return;
    upd(i=>({...i,proposedSupervisors:[...(i.proposedSupervisors||[]),{id:"ps"+uid(),...form,school:coachSchool,status:"pending"}]}));
    setForm({name:"",email:"",event:"",roleId:"",roleLabel:""});
    setToast("Nomination submitted!");
  };
  const withdraw=id=>{upd(i=>({...i,proposedSupervisors:(i.proposedSupervisors||[]).filter(p=>p.id!==id)}));setToast("Nomination withdrawn.");};

  const eventOptions=[{value:"",label:"Select event..."},...inv.events.map(e=>({value:e.name,label:e.name}))];
  const stC={pending:"#f59e0b",confirmed:"#10b981",rejected:"#ef4444"};

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:18,alignItems:"start"}}>
        {/* Nomination form */}
        <Card style={{padding:18,borderColor:"rgba(0,194,168,0.2)"}}>
          <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 6px",fontSize:14}}>Nominate a Supervisor</h4>
          <p style={{color:C.muted,fontSize:12,margin:"0 0 14px",lineHeight:1.6}}>Nominate someone for an open supervisor role. The admin will review and confirm.</p>
          {openSlots.length===0&&inv.events.length>0&&<div style={{padding:"10px 12px",background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:8,color:"#10b981",fontSize:12,marginBottom:14}}>✓ All supervisor roles are currently filled.</div>}
          {inv.events.length===0&&<div style={{padding:"10px 12px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:8,color:"#f59e0b",fontSize:12,marginBottom:14}}>⚠️ No events published yet.</div>}
          <Sel label="Event" value={form.event} onChange={v=>{sf("event",v);sf("roleId","");sf("roleLabel","");}} options={eventOptions}/>
          {form.event&&(
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:C.muted,marginBottom:5,letterSpacing:0.6,textTransform:"uppercase"}}>Role / Position</label>
              {rolesForEvent.length===0
                ?<div style={{padding:"9px 13px",background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:9,color:"#10b981",fontSize:12}}>All roles filled for this event.</div>
                :<div style={{display:"grid",gap:6}}>
                  {rolesForEvent.map(r=>(
                    <button key={r.id} onClick={()=>{sf("roleId",r.id);sf("roleLabel",r.label);}}
                      style={{padding:"9px 14px",borderRadius:9,textAlign:"left",fontFamily:"inherit",cursor:"pointer",border:`1px solid ${form.roleId===r.id?"rgba(0,194,168,0.6)":C.border}`,background:form.roleId===r.id?"rgba(0,194,168,0.1)":"rgba(255,255,255,0.03)",color:form.roleId===r.id?C.accent:C.sub,fontWeight:form.roleId===r.id?700:400,fontSize:13}}>{r.label}</button>
                  ))}
                </div>
              }
            </div>
          )}
          <Inp label="Nominee Full Name" value={form.name}  onChange={v=>sf("name",v)}  placeholder="e.g. Dr. Sarah Kim"/>
          <Inp label="Nominee Email"     value={form.email} onChange={v=>sf("email",v)} placeholder="email@school.edu" type="email"/>
          <Btn onClick={submit} style={{opacity:(!form.roleId||!form.name||!form.email)?0.5:1}}>Submit Nomination</Btn>
        </Card>

        {/* Right panel: nominations + event overview */}
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h4 style={{color:C.txt,fontWeight:700,margin:0,fontSize:13}}>Your Nominations ({myNominations.length})</h4>
            {myNominations.filter(p=>p.status==="confirmed").length>0&&<Badge label={`${myNominations.filter(p=>p.status==="confirmed").length} approved ✓`} color="#10b981"/>}
          </div>
          {/* Confirmed banner */}
          {myNominations.filter(p=>p.status==="confirmed").length>0&&(
            <div style={{marginBottom:16,padding:"14px 16px",borderRadius:12,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.3)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:18}}>✅</span><span style={{color:"#10b981",fontWeight:800,fontSize:13}}>Approved Nominations</span></div>
              <div style={{display:"grid",gap:8}}>
                {myNominations.filter(p=>p.status==="confirmed").map(p=>(
                  <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:9,background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.2)"}}>
                    <AV name={p.name} size={36}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:2}}>
                        <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{p.name}</span>
                        <Badge label={p.event} color="#8b5cf6"/>
                        {p.roleLabel&&<Badge label={p.roleLabel} color="#3b82f6"/>}
                      </div>
                      <div style={{color:C.muted,fontSize:11}}>✉️ {p.email}</div>
                    </div>
                    <div style={{textAlign:"right"}}><Badge label="✓ Confirmed" color="#10b981"/><div style={{color:"#10b981",fontSize:10,marginTop:4,fontWeight:600}}>{p.roleLabel||"Assigned"}</div></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Event overview by role */}
          {inv.events.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1.3,textTransform:"uppercase",marginBottom:8}}>Event Supervisor Roles</div>
              <div style={{display:"grid",gap:10}}>
                {inv.events.map(ev=>{
                  const evRoles=ev.supervisorRoles||[];
                  const hasMyConfirmed=myNominations.some(p=>p.event===ev.name&&p.status==="confirmed");
                  return (
                    <div key={ev.id} style={{borderRadius:10,overflow:"hidden",border:`1px solid ${hasMyConfirmed?"rgba(16,185,129,0.3)":C.border}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",background:hasMyConfirmed?"rgba(16,185,129,0.06)":"rgba(255,255,255,0.02)"}}>
                        <span style={{color:C.txt,fontWeight:700,fontSize:13,flex:1}}>{ev.name}</span>
                        {ev.room&&<span style={{color:C.muted,fontSize:11}}>📍 {ev.room}</span>}
                        <Badge label={`${evRoles.filter(r=>r.assignedName).length}/${evRoles.length} filled`} color={evRoles.length>0&&evRoles.every(r=>r.assignedName)?"#10b981":evRoles.some(r=>r.assignedName)?"#3b82f6":"#f59e0b"}/>
                      </div>
                      {evRoles.map(r=>{
                        const myConf=myNominations.find(p=>p.event===ev.name&&p.roleId===r.id&&p.status==="confirmed");
                        const myPend=myNominations.find(p=>p.event===ev.name&&p.roleId===r.id&&p.status==="pending");
                        return (
                          <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",borderTop:`1px solid ${C.border}`,background:myConf?"rgba(16,185,129,0.05)":"transparent"}}>
                            <span style={{background:"rgba(255,255,255,0.06)",color:C.sub,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600,whiteSpace:"nowrap",minWidth:130,textAlign:"center"}}>{r.label}</span>
                            <div style={{flex:1}}>
                              {myConf?<span style={{color:"#10b981",fontWeight:700,fontSize:12}}>✓ {myConf.name} <span style={{fontWeight:400,fontSize:11}}>(your nomination)</span></span>
                              :myPend?<span style={{color:"#f59e0b",fontSize:12}}>⏳ {myPend.name} — pending review</span>
                              :r.assignedName?<span style={{color:C.sub,fontSize:12}}>{r.assignedName}</span>
                              :<span style={{color:C.muted,fontSize:12,fontStyle:"italic"}}>Open — no one assigned</span>}
                            </div>
                            {myConf?<Badge label="✓ Confirmed" color="#10b981"/>:myPend?<Badge label="Pending" color="#f59e0b"/>:r.assignedName?<Badge label="Assigned" color="#64748b"/>:<Badge label="Open" color="#f59e0b"/>}
                          </div>
                        );
                      })}
                      {evRoles.length===0&&<div style={{padding:"8px 14px",borderTop:`1px solid ${C.border}`,color:C.muted,fontSize:12,fontStyle:"italic"}}>No roles defined for this event yet.</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Pending & rejected */}
          {myNominations.filter(p=>p.status!=="confirmed").length>0&&(
            <div>
              <div style={{fontSize:10,fontWeight:800,color:C.muted,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>Other Nominations</div>
              <div style={{display:"grid",gap:8}}>
                {myNominations.filter(p=>p.status!=="confirmed").map(p=>(
                  <Card key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:14,borderColor:p.status==="pending"?"rgba(245,158,11,0.25)":"rgba(239,68,68,0.15)"}}>
                    <AV name={p.name} size={38}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
                        <span style={{color:C.txt,fontWeight:700,fontSize:13}}>{p.name}</span>
                        <Badge label={p.event} color="#8b5cf6"/>
                        {p.roleLabel&&<Badge label={p.roleLabel} color="#3b82f6"/>}
                      </div>
                      <div style={{color:C.muted,fontSize:11}}>✉️ {p.email}</div>
                      {p.status==="rejected"&&<div style={{color:"#ef4444",fontSize:11,marginTop:2}}>✕ Not accepted this time</div>}
                    </div>
                    <Badge label={p.status} color={stC[p.status]}/>
                    {p.status==="pending"&&<Btn small variant="ghost" onClick={()=>withdraw(p.id)}>Withdraw</Btn>}
                  </Card>
                ))}
              </div>
            </div>
          )}
          {myNominations.length===0&&<Card style={{textAlign:"center",padding:36,color:C.muted}}>No nominations submitted yet. Use the form to nominate someone.</Card>}
        </div>
      </div>
      {toast&&<Toast msg={toast} onDone={()=>setToast("")}/>}
    </div>
  );
};

// ─── COACH PORTAL ─────────────────────────────────────────────────────────────
const CoachPortal = ({user,invitationals,setInvitationals}) => {
  const [selId,setSelId]=useState(null); const [tab,setTab]=useState("register");
  const open=invitationals.filter(i=>["open","active"].includes(i.status));
  const inv=invitationals.find(i=>i.id===selId);
  const doUpd=fn=>setInvitationals(prev=>prev.map(i=>i.id===selId?fn(i):i));

  if(!inv) return (
    <div>
      <SH title="Invitational Portal" sub="Access invitationals your team is participating in"/>
      {open.length===0&&<Card style={{textAlign:"center",padding:48,color:C.muted}}>No invitationals are currently open.</Card>}
      <div style={{display:"grid",gap:14}}>
        {open.map(i=>(
          <Card key={i.id} onClick={()=>{setSelId(i.id);setTab("register");}} style={{cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:12,background:`${C.accent}18`,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🎪</div>
              <div style={{flex:1}}>
                <div style={{color:C.txt,fontWeight:800,fontSize:14}}>{i.name}</div>
                <div style={{color:C.muted,fontSize:12}}>{fmtDate(i.date)} · {i.location} · {i.division}</div>
                <div style={{color:C.muted,fontSize:11,marginTop:1}}>Reg. deadline: {fmtDate(i.registrationDeadline)} · {i.registeredSchools.length}/{i.maxTeams} teams</div>
              </div>
              <Badge label={i.status}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const myReg=inv.registeredSchools.find(s=>s.school===user.school);
  const myTeams=myReg?.teams||[];
  const pendingNoms=(inv.proposedSupervisors||[]).filter(p=>p.school===user.school&&p.status==="pending").length;
  const tabs=[
    {id:"register",    label:"Registration"},
    {id:"roster",      label:`Team Roster (${myTeams.length})`},
    {id:"supervisors", label:`Supervisors${pendingNoms>0?" ("+pendingNoms+")":""}`},
    {id:"build",       label:"Build Slots"},
    {id:"appeals",     label:`Appeals (${inv.appeals.length})`},
  ];

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18}}>
        <Btn small variant="ghost" onClick={()=>setSelId(null)}>← All Invitationals</Btn>
        <div style={{flex:1}}><h1 style={{color:C.txt,fontSize:19,fontWeight:800,margin:0}}>{inv.name}</h1><div style={{color:C.muted,fontSize:12,marginTop:2}}>{fmtDate(inv.date)} · {inv.location} · {inv.division}</div></div>
        <Badge label={inv.status}/>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {tabs.map(t=><Pill key={t.id} label={t.label} active={tab===t.id} onClick={()=>setTab(t.id)}/>)}
      </div>

      {tab==="register"&&(
        <div>
          <Card style={{marginBottom:14}}>
            <h4 style={{color:C.txt,fontWeight:700,margin:"0 0 8px",fontSize:14}}>{inv.name}</h4>
            <p style={{color:C.muted,fontSize:13,margin:"0 0 12px",lineHeight:1.6}}>{inv.description}</p>
            <div style={{display:"flex",gap:16,fontSize:12,color:C.muted,marginBottom:14}}>
              <span>📅 {fmtDate(inv.date)}</span><span>📍 {inv.location}</span><span>🏫 Max {inv.maxTeams} teams</span><span>⏰ Deadline: {fmtDate(inv.registrationDeadline)}</span>
            </div>
            {!myReg
              ?<Btn onClick={()=>doUpd(i=>({...i,registeredSchools:[...i.registeredSchools,{school:user.school||"Your School",coach:user.name,teamCount:1,confirmed:false,teams:[]}]}))}>Register {user.school||"Your School"}</Btn>
              :<div style={{display:"flex",gap:10,alignItems:"center"}}><Badge label={myReg.confirmed?"✓ Confirmed":"Pending Confirmation"} color={myReg.confirmed?"#10b981":"#f59e0b"}/><span style={{color:C.muted,fontSize:12}}>You're registered</span></div>
            }
          </Card>
          <h4 style={{color:C.sub,fontSize:11,fontWeight:700,marginBottom:10,letterSpacing:0.6}}>REGISTERED SCHOOLS ({inv.registeredSchools.length})</h4>
          <div style={{display:"grid",gap:8}}>
            {inv.registeredSchools.map((s,i)=>(
              <Card key={i} style={{display:"flex",alignItems:"center",gap:12,padding:14}}>
                <AV name={s.school} size={34}/>
                <div style={{flex:1}}><div style={{color:C.txt,fontWeight:600,fontSize:13}}>{s.school}</div><div style={{color:C.muted,fontSize:11}}>{s.coach} · {s.teamCount} team{s.teamCount>1?"s":""}</div></div>
                <Badge label={s.confirmed?"Confirmed":"Pending"} color={s.confirmed?"#10b981":"#f59e0b"}/>
              </Card>
            ))}
          </div>
        </div>
      )}
      {tab==="roster"&&      <CoachRosterTab      inv={inv} upd={doUpd} coachSchool={user.school}/>}
      {tab==="supervisors"&& <CoachSupervisorsTab  inv={inv} upd={doUpd} coachSchool={user.school}/>}
      {tab==="build"&&        <InvBuildTab          inv={inv} upd={doUpd} isAdmin={false} coachName={user.name}/>}
      {tab==="appeals"&&      <InvAppealsTab        inv={inv} upd={doUpd} isAdmin={false}/>}
    </div>
  );
};

// ─── SIDEBAR NAV ──────────────────────────────────────────────────────────────
const NAV_ADMIN = [
  {id:"dashboard",        icon:"📊", label:"Dashboard"},
  {id:"invitationals",    icon:"🎪", label:"Invitationals"},
  {id:"tournaments",      icon:"🏆", label:"Tournaments"},
  {id:"manage-events",    icon:"📋", label:"Team Events"},
  {id:"users",            icon:"👥", label:"Users"},
  {id:"manage-leadership",icon:"⭐", label:"Leadership"},
  {id:"team-config",      icon:"⚙️", label:"Settings"},
];
const NAV_COACH = [
  {id:"dashboard",  icon:"📊", label:"Dashboard"},
  {id:"inv-select", icon:"🎪", label:"Invitationals"},
  {id:"tournaments",icon:"🏆", label:"Tournaments"},
];
const NAV_MEMBER = [
  {id:"dashboard",   icon:"📊", label:"Dashboard"},
  {id:"events",      icon:"📋", label:"My Events"},
  {id:"tournaments", icon:"🏆", label:"Tournaments"},
  {id:"leadership",  icon:"⭐", label:"Leadership"},
  {id:"availability",icon:"📅", label:"Availability"},
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [users,setUsers]               = useState(SEED_USERS);
  const [config,setConfig]             = useState(SEED_CONFIG);
  const [invitationals,setInvitationals]= useState(SEED_INVITATIONALS);
  const [leadership,setLeadership]     = useState(SEED_LEADERSHIP);
  const [tournaments,setTournaments]   = useState(SEED_TOURNAMENTS);
  const [eventPool,setEventPool]       = useState(SEED_EVENT_POOL);
  const [eventCats,setEventCats]       = useState(SEED_EVENT_CATS);
  const [user,setUser]                 = useState(null);
  const [active,setActive]             = useState("dashboard");
  const [invDetailId,setInvDetailId]   = useState(null);

  const switchPage = id => { setActive(id); setInvDetailId(null); };

  const renderContent = () => {
    if(user.role==="admin"){
      if(active==="invitationals"){
        if(invDetailId){
          const inv=invitationals.find(i=>i.id===invDetailId);
          if(!inv){setInvDetailId(null);return null;}
          return <InvDetail inv={inv} setInvitationals={setInvitationals} onBack={()=>setInvDetailId(null)} eventPool={eventPool} eventCats={eventCats}/>;
        }
        return <InvList invitationals={invitationals} setInvitationals={setInvitationals} onSelect={id=>setInvDetailId(id)}/>;
      }
      switch(active){
        case "dashboard":          return <Dashboard user={user} config={config} invitationals={invitationals} users={users} tournaments={tournaments}/>;
        case "team-config":        return <TeamConfig config={config} setConfig={setConfig} eventPool={eventPool} setEventPool={setEventPool} eventCats={eventCats} setEventCats={setEventCats}/>;
        case "users":              return <UserManagement users={users} setUsers={setUsers}/>;
        case "manage-events":      return <ManageEvents users={users} eventPool={eventPool} eventCats={eventCats}/>;
        case "manage-leadership":  return <ManageLeadership leadership={leadership} setLeadership={setLeadership}/>;
        case "tournaments":        return <ManageTournaments tournaments={tournaments} setTournaments={setTournaments} eventPool={eventPool}/>;
        default:                   return <Dashboard user={user} config={config} invitationals={invitationals} users={users} tournaments={tournaments}/>;
      }
    }
    if(user.role==="coach"){
      switch(active){
        case "dashboard":  return <Dashboard user={user} config={config} invitationals={invitationals} users={users} tournaments={tournaments}/>;
        case "inv-select": return <CoachPortal user={user} invitationals={invitationals} setInvitationals={setInvitationals}/>;
        case "tournaments":return <Tournaments tournaments={tournaments}/>;
        default:           return <Dashboard user={user} config={config} invitationals={invitationals} users={users} tournaments={tournaments}/>;
      }
    }
    switch(active){
      case "dashboard":    return <Dashboard user={user} config={config} invitationals={invitationals} users={users} tournaments={tournaments}/>;
      case "events":       return <MyEvents/>;
      case "leadership":   return <Leadership leadership={leadership}/>;
      case "tournaments":  return <Tournaments tournaments={tournaments}/>;
      case "availability": return <Availability tournaments={tournaments}/>;
      default:             return <Dashboard user={user} config={config} invitationals={invitationals} users={users} tournaments={tournaments}/>;
    }
  };

  if(!user) return <Login onLogin={u=>{setUser(u);setActive("dashboard");setInvDetailId(null);}} config={config} users={users} setUsers={setUsers}/>;

  const nav = user.role==="admin"?NAV_ADMIN:user.role==="coach"?NAV_COACH:NAV_MEMBER;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.txt}; font-family: 'Sora', sans-serif; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        input, select, textarea, button { font-family: 'Sora', sans-serif; }
        a { color: inherit; }
      `}</style>
      <div style={{display:"flex",minHeight:"100vh"}}>
        {/* Sidebar */}
        <div style={{width:220,background:"#050d18",borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:100}}>
          <div style={{padding:"22px 18px 16px"}}>
            <div style={{color:C.accent,fontWeight:900,fontSize:16,letterSpacing:-0.3}}>{config.teamName}</div>
            <div style={{color:C.muted,fontSize:11,marginTop:3}}>{config.season} · {config.division}</div>
          </div>
          <nav style={{flex:1,padding:"4px 10px",overflowY:"auto"}}>
            {nav.map(n=>(
              <button key={n.id} onClick={()=>switchPage(n.id)} style={{
                width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",
                borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",marginBottom:2,fontFamily:"inherit",
                background:active===n.id?"rgba(0,194,168,0.12)":"transparent",
                color:active===n.id?C.accent:C.muted,fontWeight:active===n.id?700:500,fontSize:13,
              }}>
                <span style={{fontSize:16,width:20,textAlign:"center"}}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>
          <div style={{padding:"14px 18px",borderTop:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <AV name={user.name} size={32}/>
              <div>
                <div style={{color:C.txt,fontWeight:700,fontSize:12}}>{user.name}</div>
                <div style={{color:C.muted,fontSize:10,textTransform:"capitalize"}}>{user.role}</div>
              </div>
            </div>
            <button onClick={()=>{setUser(null);setActive("dashboard");setInvDetailId(null);}} style={{width:"100%",padding:"7px",borderRadius:8,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.04)",color:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
          </div>
        </div>
        {/* Main content */}
        <div style={{marginLeft:220,flex:1,padding:"32px 36px",maxWidth:"100%",overflowX:"hidden"}}>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
