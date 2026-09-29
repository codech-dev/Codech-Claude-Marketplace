/* OTSO AI Hub — product scenes for the Codech vignette engine (work/_shared/ov.js).
   Six scenes: Document Inventory (search, summary, assist) and Team Chat (chat, send, ai).
   Demo content only (fictional people, clients and documents in the style of the approved prototype). */
(() => {
  const { ic, note, pdf } = OV.h;
  const V = {};


  V.search = {
    cls:'v-search', hold:2600,
    html:`<div class="ov-win"><div class="pad">
      <div class="ov-h1">Search</div><p class="ov-sub">Keyword + semantic search across every drive you can access.</p>
      <div class="sbox">${ic('search')}<span class="q"></span><span class="ov-caret gone"></span><span class="sem">${ic('spark')}Semantic</span></div>
      <div class="ov-lbl res-l fx">2 results</div>
      <div class="res r1 fx">${ic('file', 'ic')}<div><b>KYC – Acme Capital Pte Ltd.pdf</b><p>…one identification document (<mark>director's passport</mark>, Tan W.K.) <mark>expires 14 March 2027</mark>.</p><small>Client Onboarding · KYC Documents</small></div><span class="match">92% match</span></div>
      <div class="res r2 fx">${ic('file', 'ic')}<div><b>Compliance Review – Weekly Notes</b><p>Acme Capital KYC <mark>passport copy expires in March</mark>. Meridian agreement countersigned.</p><small>Client Onboarding · edited 4h ago</small></div><span class="match">78% match</span></div>
    </div></div>${note('Found by meaning, not keywords')}`,
    async run(T) {
      T.cur(true, 470, 360); await T.wait(300);
      await T.click('.sbox', { fx:.35 }); T.add('.sbox', 'focus'); T.show('.ov-caret');
      await T.type('.q', 'passport expiring soon', 17);
      await T.wait(250); T.add('.sem', 'on'); await T.wait(350);
      T.in('.res-l'); await T.wait(120); T.in('.r1'); await T.wait(220); T.in('.r2');
      await T.move('.r1 mark', { fx:.6, dur:900 });
      await T.wait(300); T.in('.v-search .ov-note', true); T.cur(false);
    }
  };

  V.summary = {
    cls:'v-summary', hold:2600,
    html:`<div class="ov-win"><div class="pad">
      <div class="drop">${ic('upload')}<span>Drop files and folders here <small>· PDF, Word, Excel, scans</small></span><span class="ov-btn sel" style="margin-left:6px">Select files</span></div>
      <div class="up gone">${pdf()}<div class="t"><b>KYC – Acme Capital Pte Ltd.pdf</b><small>2.2 KB · Client Onboarding / KYC Documents</small><div class="bar"><i></i></div></div><span class="st">Uploading…</span></div>
      <div class="ai fx">${ic('spark', 'ov-spin')}<span>AI is reading this document…</span></div>
      <div class="ov-sec fx s1"><div class="ov-lbl">AI summary</div><div class="shim"><i></i><i></i><i></i></div><p class="sum gone"></p></div>
      <div class="ov-sec fx s2"><div class="ov-lbl">Tags</div><div class="tags"><span class="ov-tag pop">KYC</span><span class="ov-tag pop">corporate client</span><span class="ov-tag pop">due diligence</span></div></div>
      <div class="ov-sec fx s3"><div class="ov-lbl">Key facts</div><div class="kf">
        <div class="pop"><span>Client</span><b>Acme Capital Pte Ltd</b></div><div class="pop"><span>Entity</span><b>Private limited (SG)</b></div>
        <div class="pop"><span>UBO</span><b>Tan W.K. (82%)</b></div><div class="pop warn"><span>Passport expiry</span><b>14 Mar 2027</b></div></div></div>
    </div></div>${note('Summary, tags and key facts on every upload')}`,
    async run(T) {
      T.cur(true, 480, 380); await T.wait(300);
      await T.click('.drop .sel'); await T.wait(150);
      T.hide('.drop'); T.show('.up'); await T.wait(60); T.q('.bar i').style.width = '100%'; T.cur(false);
      await T.wait(1350); T.q('.up .st').innerHTML = ic('check') + 'Uploaded'; T.add('.up .st', 'ok');
      T.in('.ai'); await T.wait(200); T.in('.s1'); await T.wait(1500);
      T.hide('.shim'); T.show('.sum');
      await T.type('.sum', 'Complete KYC pack for Acme Capital Pte Ltd: certificate of incorporation, director and UBO identification, proof of address and source-of-funds declaration. One director\'s passport expires 14 March 2027.', 140);
      T.in('.s2'); await T.wait(150); await T.stagger('.tags .ov-tag', 110);
      T.in('.s3'); await T.wait(150); await T.stagger('.kf > div', 130);
      T.q('.ai').innerHTML = ic('check') + '<span>Analysed by AI</span>'; T.add('.ai', 'done');
      await T.wait(300); T.in('.v-summary .ov-note', true);
    }
  };

  V.assist = {
    cls:'v-assist', hold:2800,
    html:`<div class="ov-win">
      <div class="hd"><span class="tile">${ic('spark')}</span><div><b>OTSO Assistant</b><small>Private · sees only your documents</small></div></div>
      <div class="body">
        <div class="me m1 gone fx">Find our AML policy and tell me what it covers.</div>
        <div class="bot b1 gone fx"><span class="tile">${ic('spark')}</span><div>
          <div class="srch">${ic('search', 'ov-spin')}Searching your documents</div>
          <div class="ans gone fx">The <b>AML &amp; CFT Policy 2026</b> covers:<ul><li class="fx">Firm-wide anti-money-laundering and CFT rules</li><li class="fx">Customer due-diligence tiers and ongoing monitoring</li><li class="fx">Escalation to the MLRO, reviewed annually</li></ul>
            <div class="ref fx"><div class="ov-chip">${pdf()}<div class="t"><b>AML &amp; CFT Policy 2026.pdf</b><small>Compliance &amp; Risk · referenced</small></div></div></div></div>
        </div></div>
        <div class="me m2 gone fx">Create a folder for this year's AML review.</div>
        <div class="bot b2 gone fx"><span class="tile">${ic('spark')}</span><div class="prop">
          <div class="k">Proposed change · waiting for you</div>
          <div class="ov-row">${ic('folderp')}<div><b>New folder: AML Review 2026</b><small>in Compliance &amp; Risk</small></div></div>
          <div class="acts"><span class="ov-btn">Cancel</span><span class="ov-btn pri conf">${ic('check')}Confirm</span></div>
          <div class="okrow gone">${ic('check')}Folder created</div>
        </div></div>
      </div>
      <div class="ft"><div class="comp"><span class="ph">Ask or instruct the assistant…</span><span class="txt gone"></span><span class="send">${ic('send')}</span></div>
        <div class="lock">${ic('lock')}Changes always ask for your confirmation first.</div></div>
    </div>${note('Nothing changes until you confirm')}`,
    async ask(T, text, bubble) {
      await T.click('.comp', { fx:.3 }); T.add('.comp', 'focus'); T.hide('.comp .ph'); T.show('.comp .txt');
      await T.type('.comp .txt', text, 26); T.add('.send', 'on'); await T.wait(150);
      await T.click('.send'); T.q('.comp .txt').textContent = ''; T.hide('.comp .txt'); T.show('.comp .ph'); T.rm('.send', 'on');
      T.reveal(bubble);
    },
    async run(T) {
      T.cur(true, 470, 400); await T.wait(250);
      await this.ask(T, 'Find our AML policy and tell me what it covers.', '.m1');
      await T.wait(350); T.reveal('.b1'); await T.wait(1100);
      T.q('.b1 .srch').innerHTML = ic('check') + 'Searched your documents';
      T.reveal('.ans'); await T.wait(150); await T.stagger('.ans li', 280, 'in'); T.in('.ref'); await T.wait(1400);
      await this.ask(T, 'Create a folder for this year\'s AML review.', '.m2');
      await T.wait(500); T.reveal('.b2'); await T.wait(900);
      await T.click('.conf'); T.hide('.prop .acts'); T.show('.okrow'); T.add('.prop', 'done');
      await T.wait(250); T.in('.v-assist .ov-note', true); T.cur(false);
    }
  };

  const side = (active = 'deals-desk') => `<div class="cs-side">
    <div class="t">Team chat ${ic('plus')}</div><div class="srch">${ic('search')}Search messages</div>
    <div class="ov-lbl">Channels</div>
    <div class="cs-item${active === 'deals-desk' ? ' act' : ''}">${ic('lock')}deals-desk</div>
    <div class="cs-item">${ic('lock')}compliance<em>4</em></div>
    <div class="cs-item">${ic('hash')}research</div>
    <div class="cs-item">${ic('hash')}general<em>3</em></div>
    <div class="ov-lbl" style="margin-top:10px">Direct messages</div>
    <div class="cs-item"><span class="ov-av on">SJ</span>Siti Jamil<em>1</em></div>
    <div class="cs-item"><span class="ov-av away">RT</span>Raj Thevar</div></div>`;
  const head = `<div class="cs-hd"><div><div class="h">${ic('lock')}deals-desk <span class="ov-badge priv">Private</span></div><small>Live mandates and settlement chasing · 9 members</small></div>
    <div class="avs"><span class="ov-av">RT</span><span class="ov-av">SJ</span><span class="ov-av">WL</span><span class="ov-av more">+6</span></div></div>`;
  const agreement = `<div class="ov-chip c1">${pdf()}<div class="t"><b>Acme Capital – Brokerage Agreement.pdf</b><small>Brokerage Ops · v3 · 1.4 MB</small></div><span class="ov-badge conf">Confidential</span></div>`;

  V.chat = {
    cls:'v-chat', hold:2800,
    html:`<div class="ov-win">${side()}<div class="cs-main">${head}
      <div class="cs-msgs">
        <div class="cs-m m1 gone fx"><span class="ov-av">RT</span><div><div class="ov-who">Raj T.<time>09:14</time></div><p>Acme want the revised mandate signed by Friday. Settlement clause on p.4 is the open item.</p>${agreement}</div></div>
        <div class="cs-typing gone"><span class="ov-dots"><b></b><b></b><b></b></span>Wei Liang is typing…</div>
        <div class="cs-m m2 gone fx"><span class="ov-av">WL</span><div><div class="ov-who">Wei Liang<time>09:21</time></div><p>Compliance flagged the same clause last quarter. Pulling the precedent.</p><span class="reac pop">👍 2</span></div></div>
        <div class="cs-m m3 gone fx"><span class="ov-av">SJ</span><div><div class="ov-who">Siti J.<time>09:34</time></div><p>Precedent is in the compliance drive, this one.</p>
          <div class="ov-chip locked c2"><span class="lk">${ic('lock')}</span><div class="t"><b>Clause Precedent Register.xlsx</b><small>You don't have access · ask Siti J.</small></div><span class="ov-badge rest">Restricted</span></div></div></div>
      </div>
      <div class="cs-comp"><div class="line">Message #deals-desk · @ to mention, @ai to ask the assistant</div><div class="tools"><span>${ic('upload')}Send file/folder</span>${ic('clip')}${ic('at')}${ic('mic')}<span class="ov-btn pri">Send</span></div></div>
    </div></div>
    <div class="tip pop">Sending a file never grants access. Each person still needs their own permission.</div>
    ${note('The file stays the real document')}`,
    async run(T) {
      await T.wait(300); T.reveal('.m1'); await T.wait(1500);
      T.show('.cs-typing'); await T.wait(1100); T.hide('.cs-typing');
      T.reveal('.m2'); await T.wait(400); T.in('.reac'); await T.wait(1100);
      T.reveal('.m3'); await T.wait(900);
      T.cur(true, 560, 400); await T.move('.c2', { fx:.45, fy:.5 });
      const r = T.rect('.c2'); const tip = T.q('.tip'); tip.style.left = (r.x + 30) + 'px'; tip.style.top = (r.y - 62) + 'px'; T.in('.tip', true);
      await T.wait(1600); T.rm('.tip', 'in');
      await T.move('.c1', { fx:.4 }); T.add('.c1', 'ring'); await T.wait(300);
      T.in('.v-chat .ov-note', true); T.cur(false);
    }
  };

  V.send = {
    cls:'v-send', hold:2600,
    html:`<div class="back"><i style="width:40%"></i><i></i><i style="width:80%"></i><i style="width:60%"></i><i></i><i style="width:70%"></i></div>
    <div class="ov-win">
      <div class="hd">${ic('plane')}<div><b>Send file/folder</b><small>to <strong>#deals-desk</strong></small></div>${ic('x', 'x')}</div>
      <div class="bd">
        <div class="list">
          <div class="ov-row r1"><span class="cb">${ic('check')}</span>${ic('doc', 'dc')}<div class="t"><b>Deals desk – weekly notes</b><small>Brokerage Ops · edited 2 Sep</small></div><span class="ov-badge int">Internal</span></div>
          <div class="grp">FOLDERS</div>
          <div class="ov-row r2"><span class="cb">${ic('check')}</span>${ic('folder', 'fo')}<div class="t"><b>Client Agreements</b><small>Brokerage Ops · 12 files</small></div><span class="ov-badge conf">Confidential</span></div>
          <div class="ov-row r3"><span class="cb">${ic('check')}</span>${ic('folder', 'fo')}<div class="t"><b>Mandates 2026</b><small>Brokerage Ops · 8 files</small></div><span class="ov-badge int">Internal</span></div>
        </div>
        <div class="cour"><div><div class="cbox">
          <div class="h">${ic('warn')}4 of 9 people here can't open one of these items.</div>
          <p>They'll see the name, but the contents stay closed. Sending does not grant access.</p>
          <div class="ppl"><span class="ov-av">NK</span><span class="ov-av">TW</span><span class="ov-av">LC</span><span class="ov-av">FR</span><span>Nadia, Tom, Lily, Faiz</span></div>
          <div class="acts"><span class="give">${ic('useradd')}<span>Give all 4 Viewer access</span></span><span class="ind">Choose individually</span></div>
        </div></div></div>
      </div>
      <div class="ft"><span class="cn">Cancel</span><span class="ov-btn pri go">${ic('plane')}<span class="gl">Send to #deals-desk</span></span></div>
    </div>
    <div class="sent pop"><div class="cs-m"><span class="ov-av">WL</span><div><div class="ov-who">Wei Liang<time>just now</time></div><p>Here's the notes and the agreements folder.</p>
      <div class="chips"><div class="ov-chip"><span class="ov-pdf doc"><span></span></span><div class="t"><b>Deals desk – weekly notes</b><small>Brokerage Ops</small></div><span class="ov-badge int">Internal</span></div>
      <div class="ov-chip"><span class="lk" style="background:#eff6ff;color:#1d4ed8">${ic('folder')}</span><div class="t"><b>Client Agreements</b><small>Folder · 12 files</small></div><span class="ov-badge conf">Confidential</span></div></div></div></div></div>
    ${note('Access is only ever granted on purpose')}`,
    async run(T) {
      T.cur(true, 520, 400); await T.wait(300);
      await T.click('.r1 .cb'); T.add('.r1', 'sel'); await T.wait(250);
      await T.click('.r2 .cb'); T.add('.r2', 'sel'); T.q('.gl').textContent = 'Send 2 items to #deals-desk'; T.add('.go', 'on');
      await T.wait(250); T.add('.cour', 'in'); await T.wait(1500);
      await T.click('.give'); T.add('.give', 'ok'); T.q('.give span').textContent = '4 people get Viewer access'; T.hide('.ind');
      await T.wait(700); await T.click('.go'); await T.wait(200);
      T.add('.ov-win', 'out'); T.cur(false); await T.wait(350); T.in('.sent', true);
      await T.wait(500); T.in('.v-send .ov-note', true);
    }
  };

  V.ai = {
    cls:'v-ai', hold:2800,
    html:`<div class="ov-win"><div class="cs-main">${head}
      <div class="cs-msgs">
        <div class="cs-m"><span class="ov-av">RT</span><div><div class="ov-who">Raj T.<time>09:14</time></div><p>Settlement clause on p.4 is the open item.</p>${agreement}</div></div>
        <div class="cs-m"><span class="ov-av">SJ</span><div><div class="ov-who">Siti J.<time>09:34</time></div><p>Compliance reviewed something similar in Q2. Can't remember the outcome.</p></div></div>
        <div class="cs-m m1 gone fx"><span class="ov-av">WL</span><div><div class="ov-who">Wei Liang<time>09:47</time></div><p><span class="tok" style="color:#1d4ed8;font-weight:700">@ai</span> what did compliance flag on this clause last quarter?</p></div></div>
        <div class="cs-m m2 gone fx"><span class="ov-av ai">${ic('spark')}</span><div><div class="ov-who">Assistant<span class="aib">For Wei Liang</span><time>09:47</time></div>
          <p class="wait"><span class="ov-dots"><b></b><b></b><b></b></span></p>
          <div class="done gone"><p class="a"></p><div class="srcs fx"><div class="ov-chip">${pdf('doc')}<div class="t"><b>Compliance Review – Weekly Notes</b></div><span class="ov-badge int">Internal</span></div></div>
          <div class="note2 fx">${ic('shield')}Read-only · answered from documents everyone here can open</div></div></div></div>
      </div>
      <div class="menu fx">
        <div class="mi hl"><span class="ai-t">${ic('spark')}</span><div><b>AI Assistant</b><small>Replies are posted to the whole channel</small></div><span class="k">@AI</span></div>
        <div class="mi"><span class="ov-av on">SJ</span><div><b>Siti Jamil</b><small>Member</small></div></div>
        <div class="mi"><span class="ov-av away">RT</span><div><b>Raj Thevar</b><small>Member</small></div></div>
      </div>
      <div class="cs-comp"><div class="line"><span class="ph">Message #deals-desk · @ to mention, @ai to ask the assistant</span><span class="tok gone">@ai</span><span class="txt"></span></div><div class="tools"><span>${ic('upload')}Send file/folder</span>${ic('clip')}${ic('at')}${ic('mic')}<span class="ov-btn pri snd">Send</span></div></div>
    </div></div>${note('Ask the assistant inside any channel')}`,
    async run(T) {
      T.cur(true, 520, 330); await T.wait(300);
      await T.click('.cs-comp', { fx:.25, fy:.3 }); T.add('.cs-comp', 'focus'); T.hide('.ph');
      await T.type('.cs-comp .txt', '@', 10); await T.wait(200); T.in('.menu'); await T.wait(700);
      await T.click('.mi.hl'); T.rm('.menu', 'in'); T.q('.cs-comp .txt').textContent = ''; T.show('.cs-comp .tok');
      await T.type('.cs-comp .txt', ' what did compliance flag on this clause last quarter?', 30);
      await T.wait(200); await T.click('.snd');
      T.hide('.cs-comp .tok'); T.q('.cs-comp .txt').textContent = ''; T.show('.ph'); T.rm('.cs-comp', 'focus'); T.cur(false);
      T.reveal('.m1'); await T.wait(600); T.reveal('.m2'); await T.wait(1300);
      T.hide('.m2 .wait'); T.show('.m2 .done');
      await T.type('.m2 .a', 'In Q2, compliance flagged that the payment window in clause 4.2 ran past the settlement policy. The agreed fix was to cap it at T+2.', 120);
      T.in('.srcs'); await T.wait(250); T.in('.note2'); await T.wait(300);
      T.in('.v-ai .ov-note', true);
    }
  };

  /* ---------- Drives: home → Brokerage Ops (shared drives with classified files) ---------- */
  OV.icon('home', '<path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z"/>');
  OV.icon('bank', '<path d="M3 10h18M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18M12 3l9 5H3z"/>');
  OV.icon('chart', '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 15 3.5-4 3 2.5L17 9"/>');
  OV.icon('scale', '<path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>');
  OV.icon('wallet', '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h2M3 10h18"/>');
  OV.icon('star', '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z"/>', true);
  OV.icon('img', '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m21 16-5-5-9 9"/>');
  const nav = (active) => `<div class="dv-side">
    <div class="dv-new">${ic('plus')}New</div>
    <div class="dv-it${active === 'home' ? ' act' : ''} n-home">${ic('home')}Home</div>
    <div class="dv-it">${ic('folder')}My Drive</div>
    <div class="ov-lbl">Shared drives</div>
    <div class="dv-it n-ops">${ic('bank')}Brokerage Ops</div>
    <div class="dv-it">${ic('bank')}Compliance</div>
    <div class="dv-it">${ic('bank')}Finance</div>
  </div>`;
  const dcard = (cls, tint, icon, badge, name, meta, files) => `<div class="dv-card ${cls}"><div class="top"><span class="tile ${tint}">${ic(icon)}</span><span class="ov-badge priv">${badge}</span></div>
    <b>${name}</b><small>${meta}</small><div class="ft">${ic('doc')}${files}</div></div>`;
  const fcard = (cls, kind, badge, bcls, name, when, extra = '') => `<div class="dv-file ${cls} fx"><div class="pv ${kind}"><span class="ov-badge ${bcls}">${badge}</span>${extra}<span class="ft-ic">${kind === 'img' ? ic('img') : `<i>${kind.toUpperCase()}</i>`}</span></div>
    <div class="nm"><b>${name}</b><small>Brokerage Ops · ${when}</small></div></div>`;

  V.drives = {
    cls:'v-drives', hold:2600,
    html:`<div class="ov-win">${nav('home')}<div class="dv-main">
      <div class="dv-home">
        <div class="ov-h1">Home</div><p class="ov-sub">Your latest activity across every drive</p>
        <div class="ov-lbl" style="margin:22px 0 10px">Your drives</div>
        <div class="dv-grid">
          ${dcard('pop c-my', 'amber', 'folder', 'Personal', 'My Drive', 'Only you', '15 files')}
          ${dcard('pop c-ops', 'blue', 'chart', 'Team', 'Brokerage Ops', '9 members', '128 files')}
          ${dcard('pop c-cr', 'rose', 'scale', 'Team', 'Compliance', '12 members', '96 files')}
        </div>
      </div>
      <div class="dv-drive gone">
        <div class="crumb">Shared drives › <b>Brokerage Ops</b></div>
        <div class="dh"><span class="tile blue">${ic('chart')}</span><div><div class="ov-h1" style="font-size:19px">Brokerage Ops</div><p class="ov-sub" style="margin-top:2px">Shared drive · 128 documents · 9 members</p></div></div>
        <div class="ov-lbl" style="margin:12px 0 6px">Folders</div>
        <div class="dv-folders">
          <div class="dv-fold fx">${ic('folder')}<div><b>Client Agreements</b><small>42 items</small></div></div>
          <div class="dv-fold fx">${ic('folder')}<div><b>Account Opening</b><small>18 items</small></div></div>
        </div>
        <div class="ov-lbl" style="margin:12px 0 6px">Files</div>
        <div class="dv-files">
          ${fcard('f1', 'pdf', 'Confidential', 'conf', 'Acme – Brokerage Agreement', '2h ago', `<span class="st">${ic('star')}</span>`)}
          ${fcard('f3', 'img', 'Confidential', 'conf', 'Signed mandate (scan)', '3 days ago', '<span class="ocr">OCR</span>')}
        </div>
      </div>
    </div></div>${note('Every file carries its classification')}`,
    async run(T) {
      await T.wait(250); await T.stagger('.dv-grid .dv-card', 120);
      T.cur(true, 520, 390); await T.wait(500);
      await T.move('.c-ops', { fx:.5, fy:.45 }); T.add('.c-ops', 'hov'); await T.wait(350);
      await T.click('.c-ops', { fx:.5, fy:.45 });
      T.hide('.dv-home'); T.rm('.n-home', 'act'); T.add('.n-ops', 'act'); T.reveal('.dv-drive');
      await T.wait(250); await T.stagger('.dv-fold', 110); await T.stagger('.dv-file', 140);
      await T.wait(600); await T.move('.f3 .ocr', { dur:800 }); await T.wait(700);
      await T.move('.f1', { fx:.5, fy:.35 }); T.add('.f1', 'hov'); await T.wait(500);
      T.in('.v-drives .ov-note'); T.cur(false);
    }
  };

  /* ---------- AI Actions: one-click actions on the open document ---------- */
  OV.icon('list', '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>');
  OV.icon('keyf', '<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>');
  OV.icon('msg', '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>');
  OV.icon('cmp', '<rect x="3" y="4" width="7" height="16" rx="1.5"/><rect x="14" y="4" width="7" height="16" rx="1.5"/>');
  OV.icon('file-in', '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m10 13 2 2 3-4"/>');
  OV.icon('eye', '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>');
  OV.icon('chev', '<path d="m6 15 6-6 6 6"/>');
  const act = (cls, icon, name, desc) => `<div class="ac-it ${cls}">${ic(icon)}<div><b>${name}</b><small>${desc}</small></div></div>`;

  V.actions = {
    cls:'v-actions', hold:2800,
    html:`<div class="ov-win">
      <div class="ac-doc">
        <div class="crumb">Client Agreements</div>
        <div class="ttl">${pdf()}<div><b>Acme Capital – Brokerage Agreement.pdf</b><small>PDF · v3 · 1.4 MB</small></div></div>
        <div class="page"><div class="ph-h"></div><i></i><i style="width:84%"></i><i style="width:92%"></i><i style="width:70%"></i><i></i><i style="width:88%"></i><i style="width:60%"></i><i style="width:80%"></i></div>
      </div>
      <div class="ac-panel">
        <div class="hd"><span class="tile">${ic('spark')}</span><div><b>OTSO Assistant</b><small>Private · sees only your documents</small></div></div>
        <div class="body">
          <div class="ctx">${ic('doc')}You are viewing <b>Acme Capital – Brokerage Agreement</b></div>
          <div class="hi">Ask me in your own words, or pick an action for this document.</div>
          <div class="me gone fx">${ic('keyf')}Key facts</div>
          <div class="kf-card gone fx"><div class="k">${ic('check')}Key facts · from this document</div>
            <div class="rw pop"><span>Parties</span><b>OTSO Markets · Acme Capital</b></div>
            <div class="rw pop"><span>Account type</span><b>Corporate margin</b></div>
            <div class="rw pop warn"><span>Expires</span><b>28 Feb 2027</b></div>
            <div class="rw pop"><span>Commission</span><b>Revisable, 30 days' notice</b></div>
            <div class="src fx">${ic('doc')}Sources: p.2, p.4</div></div>
        </div>
        <div class="menu fx"><div class="mh">With this document</div>
          ${act('a1', 'list', 'Summarise', 'A short plain-language summary')}
          ${act('a2', 'keyf', 'Key facts', 'Names, dates, amounts and references')}
          ${act('a3', 'msg', 'Comments', 'What is still unresolved in the thread')}
          ${act('a4', 'cmp', 'Compare', 'Set it beside another and explain what differs')}
          ${act('a5', 'file-in', 'Where to file', 'Suggests a folder from what it contains')}
          ${act('a6', 'eye', 'Who viewed', 'Everyone who opened or downloaded it')}
        </div>
        <div class="ft"><span class="acts-btn">${ic('list')}Actions ${ic('chev', 'cv')}</span>
          <div class="comp">Ask or instruct the assistant…<span class="send">${ic('send')}</span></div>
          <div class="lock">${ic('lock')}Changes always ask for your confirmation first.</div></div>
      </div>
    </div>${note('One click: summaries, key facts, comparisons')}`,
    async run(T) {
      T.cur(true, 300, 380); await T.wait(400);
      await T.click('.acts-btn'); T.add('.acts-btn', 'on'); T.in('.menu'); await T.wait(500);
      for (const a of ['.a1', '.a3', '.a4', '.a5', '.a2']) { await T.move(a, { fx:.3, dur:420 }); T.qa('.ac-it').forEach(e => e.classList.remove('hl')); T.add(a, 'hl'); await T.wait(a === '.a2' ? 350 : 260); }
      await T.click('.a2', { fx:.3 }); T.rm('.menu', 'in'); T.rm('.acts-btn', 'on');
      T.hide('.hi'); T.reveal('.me'); await T.wait(700);
      T.reveal('.kf-card'); await T.wait(200); await T.stagger('.kf-card .rw', 160); T.in('.src');
      await T.wait(300); T.cur(false); T.in('.v-actions .ov-note');
    }
  };

  for (const [name, scene] of Object.entries(V)) OV.define('otso-ai-hub', name, scene);
})();
