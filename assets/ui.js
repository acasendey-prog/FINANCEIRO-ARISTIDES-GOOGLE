/* ============================================================================
   ui.js — interface, roteamento e telas
   ========================================================================== */
(function (global) {
  'use strict';
  var E = global.Engine, C = global.Charts, S = global.Store;
  var db;                       // atalho para Store.db
  var st = { mes: null, ano: null, busca: '', filtroCat: '', filtroTipo: '', relClasse: 'despesa' };

  /* ------------------------------------------------------------- tema (claro/escuro/auto) */
  var THEME_KEY = 'fin.theme.v1';
  function getTema() {
    return localStorage.getItem(THEME_KEY) || 'auto';
  }
  function aplicarTema(t) {
    t = t || getTema();
    var html = document.documentElement;
    if (t === 'light') {
      html.setAttribute('data-theme', 'light');
    } else if (t === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, t);
    atualizarBotoesTema();
  }
  function seletorTemaHTML() {
    var t = getTema();
    return '<div class="theme-toggle" id="theme-toggle" title="Aparência: Claro, Escuro ou Automático">' +
      '<button data-t="light" class="' + (t === 'light' ? 'on' : '') + '">☼ Claro</button>' +
      '<button data-t="dark" class="' + (t === 'dark' ? 'on' : '') + '">☾ Escuro</button>' +
      '<button data-t="auto" class="' + (t === 'auto' ? 'on' : '') + '">⚙ Auto</button>' +
      '</div>';
  }
  function atualizarBotoesTema() {
    var t = getTema();
    $$('.theme-toggle button').forEach(function (btn) {
      if (btn.dataset.t === t) btn.classList.add('on');
      else btn.classList.remove('on');
    });
  }
  function ligarSeletoresTema() {
    $$('.theme-toggle button').forEach(function (btn) {
      btn.onclick = function (e) {
        e.preventDefault();
        var nv = btn.dataset.t;
        aplicarTema(nv);
        toast('Tema alterado para ' + (nv === 'light' ? 'Claro' : nv === 'dark' ? 'Escuro' : 'Automático'));
      };
    });
  }

  /* ------------------------------------------------------------- utilitários */
  function h(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ------------------------------------------------------------- logomarcas Financeiro Servidor MG (Opções 3D Metálicas & Vetoriais) */
  var LOGO_KEY = 'fin.logo.opcao.v1';

  var OPCOES_LOGOMARCA = [
    {
      id: 'opcao1',
      categoria: '3D Full HD Metálico',
      nome: 'Triângulo Mineiro 3D Rubi & Ouro Nobre',
      sub: 'Acabamento Metálico Polido · Símbolo Oficial de Minas Gerais',
      conceito: 'Triângulo equilátero escarlate tridimensional com chanfro metálico acetinado, reflexos dourados e acabamento de alta definição Full HD, evocando a tradição, soberania e solidez financeira dos servidores de Minas Gerais.',
      cores: ['#dc2626', '#b91c1c', '#f59e0b', '#7f1d1d'],
      render: function (s, u) {
        return '<img src="assets/images/logo_mg_metal_1.jpg" width="' + s + '" height="' + s + '" style="border-radius:12px;object-fit:cover;display:block;box-shadow:0 3px 10px rgba(185,28,28,0.3)" alt="Triângulo Mineiro 3D Rubi">';
      }
    },
    {
      id: 'opcao2',
      categoria: '3D Full HD Metálico',
      nome: 'Prisma Tridimensional Platina & Ametista Real',
      sub: 'Aço Escovado, Titânio e Geometria Esculpida 3D',
      conceito: 'Escultura geométrica do triângulo mineiro em titânio e platina com faces reflexivas e centro em rubi e ametista, combinando nobreza, modernidade e alta tecnologia patrimonial.',
      cores: ['#b91c1c', '#7c3aed', '#94a3b8', '#1e1b4b'],
      render: function (s, u) {
        return '<img src="assets/images/logo_mg_metal_2.jpg" width="' + s + '" height="' + s + '" style="border-radius:12px;object-fit:cover;display:block;box-shadow:0 3px 10px rgba(124,58,237,0.3)" alt="Prisma Platina e Ametista">';
      }
    },
    {
      id: 'opcao3',
      categoria: '3D Full HD Metálico',
      nome: 'Brasão Heráldico Metálico Minas Gerais',
      sub: 'Escudo Escarlate 3D em Aço & Borda em Ouro Acetinado',
      conceito: 'Composição de brasão institucional com o triângulo vermelho de Minas Gerais esculpido em relevo metálico 3D sobre placa de aço escovado com microdetalhes luminosos.',
      cores: ['#ef4444', '#b91c1c', '#d97706', '#0f172a'],
      render: function (s, u) {
        return '<img src="assets/images/logo_mg_metal_3.jpg" width="' + s + '" height="' + s + '" style="border-radius:12px;object-fit:cover;display:block;box-shadow:0 3px 10px rgba(220,38,38,0.3)" alt="Brasão Heráldico MG">';
      }
    },
    {
      id: 'opcao4',
      categoria: '3D Full HD Metálico',
      nome: 'Diamante C-Shield Metálico Minas',
      sub: 'Cristal Lapidado 3D & Liga Metálica de Alta Fidelidade',
      conceito: 'Fusão de diamante facetado tridimensional com o triângulo vermelho mineiro e acabamento em liga metálica nobre, ideal para dashboards e segurança de dados.',
      cores: ['#dc2626', '#475569', '#f8fafc', '#991b1b'],
      render: function (s, u) {
        return '<img src="assets/images/logo_mg_metal_4.jpg" width="' + s + '" height="' + s + '" style="border-radius:12px;object-fit:cover;display:block;box-shadow:0 3px 10px rgba(220,38,38,0.3)" alt="Diamante C-Shield MG">';
      }
    },
    {
      id: 'opcao5',
      categoria: 'Vetor SVG Dinâmico',
      nome: 'Bandeira Mineira 3D Minimalista (SVG)',
      sub: 'Triângulo Vermelho Oficial · Libertas Quæ Sera Tamen',
      conceito: 'Triângulo equilátero estilizado com gradiente de profundidade escarlate e borda metálica luminosa em SVG vetorial de ultra performance.',
      cores: ['#ef4444', '#b91c1c', '#7f1d1d', '#ffffff'],
      render: function (s, u) {
        return '<svg viewBox="0 0 48 48" width="' + s + '" height="' + s + '" role="img" aria-label="Bandeira Mineira 3D">' +
          '<defs>' +
          '<linearGradient id="' + u + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#0f172a"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + u + 'red" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#ef4444"/><stop offset="50%" stop-color="#dc2626"/><stop offset="100%" stop-color="#991b1b"/>' +
          '</linearGradient>' +
          '<filter id="' + u + 'sh" x="-20%" y="-20%" width="140%" height="140%">' +
          '<feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#dc2626" flood-opacity="0.4"/>' +
          '</filter>' +
          '</defs>' +
          '<rect width="48" height="48" rx="13" fill="url(#' + u + ')" stroke="rgba(239,68,68,0.35)" stroke-width="1.2"/>' +
          '<polygon points="24,9 41,38 7,38" fill="url(#' + u + 'red)" filter="url(#' + u + 'sh)"/>' +
          '<polygon points="24,14 36,35 12,35" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>' +
          '<circle cx="24" cy="26" r="2.2" fill="#ffffff" opacity=".9"/>' +
          '</svg>';
      }
    },
    {
      id: 'opcao6',
      categoria: 'Vetor SVG Dinâmico',
      nome: 'Monograma Escarlate & Ouro MG (SVG)',
      sub: 'Escudo Institucional Servidor Público Estadual',
      conceito: 'Escudo e monograma heráldico fundindo o triângulo vermelho de Minas Gerais com linhas nobres em ouro e carmesim.',
      cores: ['#b91c1c', '#d97706', '#18181b', '#fef3c7'],
      render: function (s, u) {
        return '<svg viewBox="0 0 48 48" width="' + s + '" height="' + s + '" role="img" aria-label="Monograma MG Ouro">' +
          '<defs>' +
          '<linearGradient id="' + u + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#450a0a"/>' +
          '</linearGradient>' +
          '</defs>' +
          '<rect width="48" height="48" rx="13" fill="url(#' + u + ')"/>' +
          '<polygon points="24,10 40,37 8,37" fill="#ffffff" opacity=".95"/>' +
          '<polygon points="24,16 35,34 13,34" fill="#b91c1c"/>' +
          '<path d="M24 20 L28 28 L20 28 Z" fill="#fbbf24"/>' +
          '</svg>';
      }
    }
  ];

  function getLogoOpcao() {
    return localStorage.getItem(LOGO_KEY) || 'opcao1';
  }

  function setLogoOpcao(opcaoId) {
    localStorage.setItem(LOGO_KEY, opcaoId);
  }

  /** Retorna o visual da logomarca Financeiro Servidor MG */
  function logoSVG(tam, opcaoId) {
    var s = tam || 40;
    var opId = opcaoId || getLogoOpcao();
    var op = OPCOES_LOGOMARCA.find(function (o) { return o.id === opId; }) || OPCOES_LOGOMARCA[0];
    var u = 'lg' + op.id + '_' + Math.random().toString(36).slice(2, 7);
    return op.render(s, u);
  }

  /** Abre o Modal Interativo de Seleção das Logomarcas 3D Metálicas e Vetoriais */
  function abrirModalLogomarcas() {
    var ativa = getLogoOpcao();

    var cardsHTML = OPCOES_LOGOMARCA.map(function (op, idx) {
      var isAtiva = op.id === ativa;
      var preview = logoSVG(76, op.id);

      var coresHTML = op.cores.map(function (c) {
        return '<span style="display:inline-block;width:16px;height:16px;border-radius:99px;background:' + c + ';border:1.5px solid rgba(255,255,255,0.8);box-shadow:0 1px 3px rgba(0,0,0,0.15)" title="' + c + '"></span>';
      }).join('');

      var tagCat = op.categoria === '3D Full HD Metálico'
        ? '<span style="font-size:10px;font-weight:700;color:#dc2626;background:rgba(220,38,38,0.12);padding:2px 7px;border-radius:5px">3D FULL HD METÁLICO</span>'
        : '<span style="font-size:10px;font-weight:700;color:#0284c7;background:rgba(2,132,199,0.12);padding:2px 7px;border-radius:5px">VETOR SVG</span>';

      return '<div class="card" data-logo-card="' + op.id + '" style="margin-bottom:14px;padding:16px;border-radius:var(--r);border:2px solid ' + (isAtiva ? 'var(--brand)' : 'var(--stroke)') + ';background:' + (isAtiva ? 'var(--brand-dim)' : 'var(--surface-1)') + ';cursor:pointer;transition:all .18s;display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
        '<div style="flex:none;filter:drop-shadow(0 4px 10px rgba(220,38,38,0.25))">' + preview + '</div>' +
        '<div style="flex:1;min-width:240px">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">' +
        '<span style="font-size:11px;font-weight:800;color:var(--ink-2);background:var(--surface-3);padding:2px 8px;border-radius:6px;letter-spacing:.05em">OPÇÃO ' + (idx + 1) + '</span>' +
        tagCat +
        '<b style="font-size:15px;color:var(--ink)">' + h(op.nome) + '</b>' +
        (isAtiva ? '<span style="font-size:11px;font-weight:700;color:#16a34a;background:rgba(22,163,74,0.12);padding:2px 8px;border-radius:6px">✓ ATIVA NO SISTEMA</span>' : '') +
        '</div>' +
        '<div style="font-size:12.5px;font-weight:600;color:var(--ink-2);margin-bottom:6px">' + h(op.sub) + '</div>' +
        '<div style="font-size:12px;color:var(--ink-3);line-height:1.45;margin-bottom:10px">' + h(op.conceito) + '</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
        '<span style="font-size:11px;font-weight:600;color:var(--ink-3)">Cores:</span>' +
        '<div style="display:flex;gap:4px">' + coresHTML + '</div>' +
        '</div>' +
        '</div>' +
        '<div style="flex:none">' +
        '<button class="btn ' + (isAtiva ? 'pri' : '') + '" data-set-logo="' + op.id + '" style="font-weight:600;padding:8px 16px">' +
        (isAtiva ? '✓ Selecionada' : 'Escolher esta Logomarca') +
        '</button>' +
        '</div>' +
        '</div>';
    }).join('');

    var corpo = '' +
      '<div style="background:var(--surface-2);border-radius:var(--r);padding:14px;border:1px solid var(--stroke-soft);margin-bottom:16px;font-size:13px;line-height:1.5">' +
      '<b style="color:var(--brand)">🔺 Identidade Visual Financeiro Servidor MG (Acabamento 3D Metálico Full HD)</b><br>' +
      'Escolha a logomarca que melhor representa seu controle financeiro com o icônico <b>triângulo vermelho da bandeira mineira</b> e acabamentos em metal nobre polido, chanfros facetados e alta resolução.' +
      '</div>' +
      '<div>' + cardsHTML + '</div>';

    modal('🔺 Escolher Logomarca — Financeiro Servidor MG', corpo, null, null);

    // Liga os botões e cartões para troca instantânea
    setTimeout(function () {
      $$('[data-logo-card], [data-set-logo]').forEach(function (el) {
        el.onclick = function (e) {
          e.stopPropagation();
          var id = el.dataset.logoCard || el.dataset.setLogo;
          if (id) {
            setLogoOpcao(id);
            toast('Logomarca alterada para ' + (OPCOES_LOGOMARCA.find(function (o) { return o.id === id; }) || {}).nome);
            var ovl = $('.ovl');
            if (ovl) ovl.remove();
            render();
          }
        };
      });
    }, 40);
  }
  global.abrirModalLogomarcas = abrirModalLogomarcas;

  function toast(msg, tipo) {
    var box = $('#toasts'), t = document.createElement('div');
    t.className = 'toast ' + (tipo || 'ok'); t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transform = 'translateY(6px)'; t.style.transition = '.25s'; }, 2600);
    setTimeout(function () { t.remove(); }, 3000);
  }
  global.toast = toast;

  function modal(titulo, corpo, onOk, textoOk) {
    var ovl = document.createElement('div'); ovl.className = 'ovl';
    ovl.innerHTML = '<div class="modal"><h2>' + h(titulo) + '</h2><div class="mbody">' + corpo +
      '</div><div class="acts"><button class="btn" data-x>Cancelar</button>' +
      (onOk ? '<button class="btn pri" data-ok>' + h(textoOk || 'Salvar') + '</button>' : '') + '</div></div>';
    document.body.appendChild(ovl);
    var fechar = function () { ovl.remove(); };
    ovl.addEventListener('click', function (e) { if (e.target === ovl) fechar(); });
    $('[data-x]', ovl).onclick = fechar;
    var ok = $('[data-ok]', ovl);
    if (ok) ok.onclick = function () { if (onOk(ovl) !== false) fechar(); };
    ovl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fechar();
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && ok) ok.click();
    });
    var f = ovl.querySelector('input,select,textarea'); if (f) setTimeout(function () { f.focus(); f.select && f.select(); }, 40);
    return ovl;
  }
  global.modal = modal;

  function confirmar(txt, fn) {
    modal('Confirmar', '<p style="font-size:14px;line-height:1.6">' + h(txt) + '</p>', function () { fn(); }, 'Confirmar');
  }

  function opts(lista, sel) {
    return lista.map(function (o) {
      var v = typeof o === 'string' ? o : o.v, l = typeof o === 'string' ? o : o.l;
      return '<option value="' + h(v) + '"' + (v === sel ? ' selected' : '') + '>' + h(l) + '</option>';
    }).join('');
  }
  function selMeses(sel) {
    var cur = db || S.db;
    if (!cur) return '';
    return opts(E.meses(cur).map(function (m) { return { v: m, l: E.mesLabel(m) }; }), sel);
  }
  function selCats(sel, classe) {
    var cur = db || S.db;
    if (!cur || !cur.categorias) return '';
    var g = '';
    if (!classe || classe === 'receita') g += '<optgroup label="Receitas">' + opts(cur.categorias.receita || [], sel) + '</optgroup>';
    if (!classe || classe === 'despesa') g += '<optgroup label="Despesas">' + opts(cur.categorias.despesa || [], sel) + '</optgroup>';
    return g;
  }
  function selContas(sel) {
    var cur = db || S.db;
    var contas = cur ? E.contas(cur) : ['Conta Salário Itaú', 'Banco'];
    if (sel && contas.indexOf(sel) < 0) contas = [sel].concat(contas);
    return opts(contas.map(function (c) { return { v: c, l: c }; }), sel || contas[0] || 'Banco');
  }
  function num(v) { return '<span class="num ' + (v < 0 ? 'neg' : v > 0 ? 'pos' : 'mut') + '">' + E.brl(v) + '</span>'; }
  function numRaw(v) { return '<span class="num">' + E.brl(v) + '</span>'; }
  function tagStatus(s) {
    return s === 'realizado' ? '<span class="tag real">✅ Realizado</span>'
      : s === 'base' ? '<span class="tag">🔎 Base</span>'
        : '<span class="tag proj">📆 Projeção</span>';
  }
  function parseVal(s) {
    if (typeof s === 'number') return s;
    s = String(s || '').trim().replace(/[R$\s]/g, '');
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    var v = parseFloat(s);
    return isNaN(v) ? 0 : v;
  }
  function kpi(tit, val, sub, acc) {
    return '<div class="kpi ' + (acc || '') + '"><div class="lb">' + h(tit) + '</div>' +
      '<div class="vl">' + val + '</div>' +
      (sub ? '<div class="ft">' + h(sub) + '</div>' : '') + '</div>';
  }

  /* ------------------------------------------------------------------ rotas */
  var ROTAS = [
    { g: 'Operação' },
    { id: 'painel', t: 'Painel', ic: '◆', f: viewPainel },
    { id: 'lancamentos', t: 'Lançamentos', ic: '≡', f: viewLancamentos },
    { id: 'recorrentes', t: 'Fixos & Recorrentes', ic: '↻', f: viewRecorrentes },
    { g: 'Servidor MG' },
    { id: 'proventos', t: 'Proventos MG', ic: '🔺', f: viewProventosMG },
    { g: 'Crédito' },
    { id: 'cartoes', t: 'Cartões', ic: '▤', f: viewCartoes },
    { id: 'parcelamentos', t: 'Parcelamentos', ic: '▥', f: viewParcelamentos },
    { id: 'metas', t: 'Metas & Consignados', ic: '◎', f: viewMetas },
    { g: 'Análise' },
    { id: 'fluxo', t: 'Fluxo de Caixa', ic: '∿', f: viewFluxo },
    { id: 'relatorios', t: 'Relatórios', ic: '▦', f: viewRelatorios },
    { id: 'auditoria', t: 'Auditoria', ic: '⚑', f: viewAuditoria },
    { g: 'Sistema' },
    { id: 'categorias', t: 'Categorias', ic: '☰', f: viewCategorias },
    { id: 'dados', t: 'Dados & Backup', ic: '⛁', f: viewDados }
  ];

  function rotaAtual() {
    var id = (location.hash || '#painel').slice(1).split('?')[0];
    for (var i = 0; i < ROTAS.length; i++) if (ROTAS[i].id === id) return ROTAS[i];
    return ROTAS[1];
  }

  function sidebar() {
    var atual = rotaAtual().id;
    var logoAtiva = OPCOES_LOGOMARCA.find(function (o) { return o.id === getLogoOpcao(); }) || OPCOES_LOGOMARCA[0];
    return '<aside class="side" id="side">' +
      '<div class="brand" id="brand-header" title="Logomarca Financeiro Servidor MG (Clique para escolher a logo 3D metálica)" style="cursor:pointer;user-select:none">' +
      '<div class="mark">' + logoSVG(40) + '</div>' +
      '<div style="min-width:0;flex:1">' +
      '<b>Financeiro Servidor MG</b><span>Estado de Minas Gerais</span>' +
      '</div>' +
      '<span style="font-size:11px;opacity:0.85;padding:3px 7px;border-radius:6px;background:var(--brand-dim);color:var(--brand);font-weight:700;margin-left:auto;flex:none" title="Trocar logomarca">🎨 3D</span>' +
      '</div>' +
      '<nav class="nav">' + ROTAS.map(function (r) {
        if (r.g) return '<div class="grp">' + h(r.g) + '</div>';
        return '<a href="#' + r.id + '" class="' + (r.id === atual ? 'on' : '') + '"><span class="ic">' + r.ic + '</span>' + h(r.t) + '</a>';
      }).join('') + '</nav>' +
      '<div class="side-foot">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:6px">' +
      '<div><span class="dot" id="savedot"></span><span id="savetxt">salvo</span></div>' +
      '<div style="display:flex;gap:4px">' +
      '<button class="btn sm" id="btn-trocar-logo-side" style="padding:2px 8px;font-size:11px;background:transparent;border-color:var(--stroke)" title="Ver opções de logo">🎨 Logo</button>' +
      '<button class="btn sm" id="btn-bloquear-side" style="padding:2px 8px;font-size:11px;background:transparent;border-color:var(--stroke)" title="Bloquear tela">🔒</button>' +
      '</div>' +
      '</div>' +
      '<span id="syncline" style="display:block"></span>' +
      '<span style="opacity:.7;display:block;margin-top:5px">Mês de referência: <b>' + E.mesLabel(db.meta.mesRef) + '</b></span>' +
      '</div>' +
      '</aside>';
  }

  function topo(titulo, sub, acoes) {
    return '<header class="topbar">' +
      '<button class="btn burger" id="burger">☰</button>' +
      '<div><h1>' + h(titulo) + '</h1>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div>' +
      '<div class="spacer"></div>' +
      seletorTemaHTML() +
      (acoes ? '<div style="margin-left:8px;display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap">' + acoes + '</div>' : '') +
      '</header>';
  }

  function render() {
    db = S.db;
    if (!st.mes || E.meses(db).indexOf(st.mes) < 0) st.mes = db.meta.mesRef;
    if (!st.ano) st.ano = db.meta.mesRef.slice(0, 4);
    var r = rotaAtual();
    var app = $('#app');
    app.innerHTML = '<div class="shell">' + sidebar() + '<main class="main" id="main"></main></div>';
    r.f($('#main'));
    atualizaSyncLine();
    ligarSeletoresTema();

    var b = $('#burger'); if (b) b.onclick = function () { $('#side').classList.toggle('open'); };
    $$('.nav a').forEach(function (a) { a.onclick = function () { $('#side').classList.remove('open'); }; });

    var bh = $('#brand-header');
    if (bh) bh.onclick = function () { abrirModalLogomarcas(); };

    var btl = $('#btn-trocar-logo-side');
    if (btl) btl.onclick = function (e) { e.stopPropagation(); abrirModalLogomarcas(); };

    var bLock = $('#btn-bloquear-side');
    if (bLock) bLock.onclick = function (e) {
      e.stopPropagation();
      telaDestravar();
    };

    atualizaSaveDot();
  }
  function atualizaSaveDot() {
    var d = $('#savedot'), t = $('#savetxt');
    if (!d) return;
    if (S.dirty) { d.classList.add('busy'); t.textContent = 'gravando…'; }
    else { d.classList.remove('busy'); t.textContent = S.lastSave ? 'salvo ' + S.lastSave.toLocaleTimeString('pt-BR').slice(0, 5) : 'salvo'; }
  }
  function rotuloSync() {
    if (global.FirebaseCloud && global.FirebaseCloud.user) {
      var fs = global.FirebaseCloud.status;
      var email = global.FirebaseCloud.user.email || 'online';
      if (fs === 'sincronizando') return '<span style="color:#b45309">☁︎ Firestore salvando…</span>';
      if (fs === 'erro') return '<span style="color:#dc2626">☁︎ Erro na nuvem</span>';
      if (fs === 'sincronizado') return '<span style="color:#16a34a">☁︎ Nuvem ativa (' + h(email.split('@')[0]) + ')</span>';
      return '<span style="color:#16a34a">☁︎ Nuvem conectada</span>';
    }
    var s = Sync.estado;
    if (s === 'sem-servidor') return '<span style="opacity:.65">☁︎ Nuvem pronta — faça login em Dados</span>';
    if (s === 'enviando') return '<span style="color:#b45309">☁︎ enviando…</span>';
    if (s === 'offline') return '<span style="color:#dc2626">☁︎ offline — grava ao voltar</span>';
    if (s === 'conflito') return '<span style="color:#dc2626">☁︎ conflito — abra Dados</span>';
    if (s === 'sincronizado') return '<span style="color:#16a34a">☁︎ na nuvem' + (Sync.rev ? ' · v' + Sync.rev : '') + '</span>';
    return '<span style="opacity:.65">☁︎ Nuvem pronta</span>';
  }
  function atualizaSyncLine() {
    var el = $('#syncline'); if (el) el.innerHTML = rotuloSync();
    var p = $('#sync-painel'); if (p) { p.innerHTML = blocoSync(); ligarBotoesSync(); }
  }
  document.addEventListener('fin:sync', atualizaSyncLine);
  document.addEventListener('fin:firebase_status', atualizaSyncLine);
  window.addEventListener('online', function () {
    if (S.db) {
      Sync.reconectar(S.db);
      if (global.FirebaseCloud && typeof global.FirebaseCloud.salvarNaNuvem === 'function') {
        global.FirebaseCloud.salvarNaNuvem(S.db);
      }
    }
  });
  document.addEventListener('fin:saved', atualizaSaveDot);
  document.addEventListener('fin:saveerror', function () { toast('Falha ao gravar local. Verifique a nuvem!', 'err'); });

  /* ======================================================== TELA · PAINEL === */
  function viewPainel(root) {
    var casc = E.cascata(db);
    var ano = st.ano;
    var doAno = casc.filter(function (c) { return c.mes.slice(0, 4) === ano; });
    var rec = doAno.reduce(function (a, c) { return a + c.entradas; }, 0);
    var des = doAno.reduce(function (a, c) { return a + c.saidas; }, 0);
    var fim = doAno.length ? doAno[doAno.length - 1].saldoFinal : 0;
    var atualIdx = casc.findIndex(function (c) { return c.mes === db.meta.mesRef; });
    var atual = casc[atualIdx] || casc[0];
    var anos = Array.from(new Set(E.meses(db).map(function (m) { return m.slice(0, 4); })));
    var av = E.diagnostico(db);
    var crit = av.filter(function (a) { return a.n === 'crit'; }).length;

    var listaCarts = E.cartoes(db);
    var porCartao = listaCarts.map(function (c) {
      return { nome: c, total: doAno.reduce(function (a, x) { return a + E.faturaPaga(db, x.mes, c); }, 0) };
    });
    var cartTotal = porCartao.reduce(function (a, c) { return a + c.total; }, 0);
    var cartSub = porCartao.map(function (c) { return c.nome + ' ' + E.brlCurto(c.total); }).join(' · ');

    root.innerHTML = topo('Painel ' + ano,
      'Posição consolidada · mês de referência <b>' + E.mesLabel(db.meta.mesRef) + '</b>',
      '<div class="seg" id="segano">' + anos.map(function (a) { return '<button data-a="' + a + '" class="' + (a === ano ? 'on' : '') + '">' + a + '</button>'; }).join('') + '</div>' +
      '<button class="btn pri" id="novo">+ Lançamento</button>') +

      avisoBackup() +
      (crit ? '<div class="alert crit" style="margin-bottom:14px"><span class="ic">⚑</span><div><b>' + crit + ' ponto(s) crítico(s)</b> detectado(s) pela auditoria automática. <a href="#auditoria">Ver detalhes →</a></div></div>' : '') +

      '<div class="grid g-kpi" style="margin-bottom:14px">' +
      kpi('Receita do ano', E.brl(rec), 'Entradas de ' + ano, 'acc-in') +
      kpi('Despesa do ano', E.brl(des), 'Saídas de ' + ano, 'acc-out') +
      kpi('Resultado', E.brl(rec - des), (rec - des >= 0 ? 'superávit' : 'déficit') + ' no período', rec - des >= 0 ? 'acc-in' : 'acc-out') +
      kpi('Saldo em 31/12/' + ano, E.brl(fim), 'Posição projetada', 'acc-br') +
      kpi('Saldo hoje', E.brl(atual ? atual.saldoFinal : 0), 'Fim de ' + E.mesLabel(db.meta.mesRef), 'acc-br') +
      kpi('Faturas de cartão', E.brl(cartTotal), cartSub || 'nenhum cartão cadastrado', 'acc-am') +
      '</div>' +

      '<div class="grid g-2" style="margin-bottom:14px">' +
      '<div class="card"><h3>Fluxo mensal ' + ano + '</h3>' +
      C.legenda([{ nome: 'Entradas', cor: 'var(--entrada)' }, { nome: 'Saídas', cor: 'var(--saida)' }]) +
      '<div id="ch-fluxo"></div></div>' +
      '<div class="card"><h3>Evolução do saldo</h3>' +
      '<div class="hint" style="margin:0 0 8px">Saldo final acumulado em todos os meses cadastrados.</div>' +
      '<div id="ch-saldo"></div></div>' +
      '</div>' +

      '<div class="grid g-2">' +
      '<div class="card"><h3>Maiores despesas de ' + ano + '</h3><div id="ch-desp"></div></div>' +
      '<div class="card"><h3>Receitas de ' + ano + ' por categoria</h3><div id="ch-rec"></div></div>' +
      '</div>';

    $('#novo').onclick = function () { formLancamento(null); };
    $$('#segano button').forEach(function (b) { b.onclick = function () { st.ano = b.dataset.a; render(); }; });
    ligarBotaoBackup();

    C.barras($('#ch-fluxo'), {
      labels: doAno.map(function (c) { return E.mesLabel(c.mes); }),
      titulos: doAno.map(function (c) { return E.mesLabelLongo(c.mes); }),
      series: [
        { nome: 'Entradas', cor: 'var(--entrada)', dados: doAno.map(function (c) { return c.entradas; }) },
        { nome: 'Saídas', cor: 'var(--saida)', dados: doAno.map(function (c) { return c.saidas; }) }
      ], altura: 250
    });
    C.linha($('#ch-saldo'), {
      labels: casc.map(function (c) { return E.mesLabel(c.mes); }),
      titulos: casc.map(function (c) { return E.mesLabelLongo(c.mes); }),
      series: [{ nome: 'Saldo final', cor: 'var(--brand-hi)', dados: casc.map(function (c) { return c.saldoFinal; }) }],
      area: true, altura: 250
    });
    var de = ano + '-01', ate = ano + '-12';
    var dd = E.porCategoriaPeriodo(db, 'despesa', de, ate);
    C.ranking($('#ch-desp'), { itens: dd, cor: 'var(--saida)', nome: 'Despesa', total: des, max: 10 });
    var rr = E.porCategoriaPeriodo(db, 'receita', de, ate);
    C.ranking($('#ch-rec'), { itens: rr, cor: 'var(--entrada)', nome: 'Receita', total: rec, max: 10 });
  }
  /* ---------------------------------------------- lembrete de backup */
  function diasDesdeBackup() {
    if (!db.meta.ultimoBackup) return null;
    return Math.floor((Date.now() - new Date(db.meta.ultimoBackup).getTime()) / 86400000);
  }
  function avisoBackup() {
    var d = diasDesdeBackup();
    if (d !== null && d < 7) return '';
    var txt = d === null
      ? '<b>Você ainda não baixou nenhum backup.</b> Os dados vivem neste navegador — limpar o histórico ou trocar de aparelho apaga tudo. Baixe o backup e guarde em local seguro.'
      : '<b>Último backup há ' + d + ' dias.</b> Baixe uma cópia nova para não perder os lançamentos recentes.';
    return '<div class="alert" style="margin-bottom:14px"><span class="ic">⛁</span><div style="flex:1">' + txt +
      '</div><button class="btn sm" id="bk-agora" style="align-self:center">↓ Baixar agora</button></div>';
  }
  function ligarBotaoBackup() {
    var b = $('#bk-agora');
    if (b) b.onclick = function () { fazerBackup(); };
  }
  function fazerBackup() {
    baixar(S.exportar(), 'backup-financeiro-' + E.hoje() + '.json', 'application/json');
    db.meta.ultimoBackup = new Date().toISOString();
    S.touch('Backup baixado');
    toast('Backup gerado — guarde o arquivo fora do computador');
  }

  function kpi(lb, vl, ft, cls) {
    return '<div class="card kpi ' + cls + '"><div class="lb">' + h(lb) + '</div><div class="vl">' + h(vl) + '</div><div class="ft">' + h(ft) + '</div></div>';
  }

  /* =================================================== TELA · LANÇAMENTOS === */
  function viewLancamentos(root) {
    var m = st.mes;
    var casc = E.cascata(db);
    var info = casc.filter(function (c) { return c.mes === m; })[0] || {};
    var lst = E.doMes(db, m);

    if (st.busca) lst = lst.filter(function (l) { return (l.desc + ' ' + l.cat).toLowerCase().indexOf(st.busca.toLowerCase()) >= 0; });
    if (st.filtroCat) lst = lst.filter(function (l) { return l.cat === st.filtroCat; });
    if (st.filtroConta) lst = lst.filter(function (l) { return (l.conta || 'Conta Salário Itaú') === st.filtroConta; });
    if (st.filtroTipo) lst = lst.filter(function (l) { return st.filtroTipo === 'E' ? l.valor > 0 : l.valor < 0; });

    var saldo = info.saldoInicial || 0;
    var linhas = lst.map(function (l) {
      saldo = E.r2(saldo + l.valor);
      var tagProv = (l.provSync || l.provId)
        ? ' <span class="tag ok" style="font-size:10.5px;padding:1px 6px;cursor:pointer" onclick="location.hash=\'#proventos\'" title="Salário líquido vinculado automaticamente ao módulo Proventos MG (SEPLAG)">🔺 Proventos</span>'
        : '';
      return '<tr data-id="' + l.id + '">' +
        '<td class="c num" style="width:52px">' + h(E.dataLabel(l.data)) + '</td>' +
        '<td>' + h(l.desc) + (l.rec ? ' <span class="tag" title="gerado por lançamento recorrente">↻</span>' : '') + tagProv + '</td>' +
        '<td><span class="tag">' + h(l.cat || '—') + '</span></td>' +
        '<td class="r">' + (l.valor > 0 ? '<span class="num pos">' + E.brl(l.valor) + '</span>' : '') + '</td>' +
        '<td class="r">' + (l.valor < 0 ? '<span class="num neg">' + E.brl(-l.valor) + '</span>' : '') + '</td>' +
        '<td class="r num" style="color:var(--ink-2)">' + E.brl(saldo) + '</td>' +
        '<td class="c actions" style="width:74px"><button class="iconbtn" data-ed>✎</button><button class="iconbtn del" data-dl>✕</button></td></tr>';
    }).join('');

    root.innerHTML = topo('Lançamentos · ' + E.mesLabelLongo(m),
      tagStatus(E.statusMes(db, m)) + ' &nbsp; ' + lst.length + ' lançamento(s)',
      '<div class="monthbar"><button class="btn sm" id="prev">‹</button>' +
      '<select id="selmes">' + selMeses(m) + '</select>' +
      '<button class="btn sm" id="next">›</button></div>' +
      '<button class="btn" id="btn-import-ofx" style="font-weight:600;background:var(--bg-card);border:1px solid var(--stroke)">📂 Importar Extrato (OFX / CSV)</button>' +
      '<button class="btn pri" id="novo">+ Lançamento</button>') +

      '<div class="grid g-kpi" style="margin-bottom:14px">' +
      kpi('Saldo inicial', E.brl(info.saldoInicial), 'Vem do mês anterior', 'acc-br') +
      kpi('Entradas', E.brl(info.entradas), 'No mês', 'acc-in') +
      kpi('Saídas', E.brl(info.saidas), 'No mês', 'acc-out') +
      kpi('Resultado', E.brl(info.resultado), info.resultado >= 0 ? 'superávit' : 'déficit', info.resultado >= 0 ? 'acc-in' : 'acc-out') +
      kpi('Saldo final', E.brl(info.saldoFinal), 'Entra no próximo mês', 'acc-br') +
      '</div>' +

      '<div class="card">' +
      '<div class="inline" style="margin-bottom:12px;flex-wrap:wrap;gap:8px">' +
      '<div class="fld" style="flex:2;min-width:160px"><label>Buscar</label><input id="busca" placeholder="descrição ou categoria" value="' + h(st.busca) + '"></div>' +
      '<div class="fld" style="min-width:150px"><label>Categoria</label><select id="fcat"><option value="">todas</option>' + selCats(st.filtroCat) + '</select></div>' +
      '<div class="fld" style="min-width:150px"><label>Conta</label><select id="fconta"><option value="">todas as contas</option>' + selContas(st.filtroConta) + '</select></div>' +
      '<div class="fld" style="min-width:110px"><label>Tipo</label><select id="ftipo">' + opts([{ v: '', l: 'todos' }, { v: 'E', l: 'entradas' }, { v: 'S', l: 'saídas' }], st.filtroTipo) + '</select></div>' +
      '<button class="btn" id="limpar" style="align-self:flex-end">Limpar</button>' +
      '<div class="spacer"></div>' +
      '<button class="btn" id="csv" style="align-self:flex-end">↓ CSV do mês</button>' +
      '</div>' +
      '<div class="tw"><table><thead><tr><th class="c">Dia</th><th>Descrição</th><th>Categoria</th>' +
      '<th class="r">Entrada</th><th class="r">Saída</th><th class="r">Saldo</th><th></th></tr></thead>' +
      '<tbody>' + (linhas || '<tr><td colspan="7" class="empty">Nenhum lançamento neste mês. Clique em <b>+ Lançamento</b>.</td></tr>') + '</tbody>' +
      '<tfoot><tr><td colspan="3">Total do mês</td>' +
      '<td class="r"><span class="num pos">' + E.brl(info.entradas) + '</span></td>' +
      '<td class="r"><span class="num neg">' + E.brl(info.saidas) + '</span></td>' +
      '<td class="r num">' + E.brl(info.saldoFinal) + '</td><td></td></tr></tfoot></table></div>' +
      '</div>';

    $('#selmes').onchange = function () { st.mes = this.value; render(); };
    $('#prev').onclick = function () { var i = E.meses(db).indexOf(st.mes); if (i > 0) { st.mes = E.meses(db)[i - 1]; render(); } };
    $('#next').onclick = function () { var ms = E.meses(db), i = ms.indexOf(st.mes); if (i < ms.length - 1) { st.mes = ms[i + 1]; render(); } };
    $('#novo').onclick = function () { formLancamento(null); };
    var btnOfx = $('#btn-import-ofx');
    if (btnOfx) btnOfx.onclick = function () { abrirModalImportarOFX_CSV(db, st); };
    $('#busca').oninput = function () { st.busca = this.value; var v = this.value; render(); var b = $('#busca'); b.focus(); b.setSelectionRange(v.length, v.length); };
    $('#fcat').onchange = function () { st.filtroCat = this.value; render(); };
    var elFConta = $('#fconta');
    if (elFConta) elFConta.onchange = function () { st.filtroConta = this.value; render(); };
    $('#ftipo').onchange = function () { st.filtroTipo = this.value; render(); };
    $('#limpar').onclick = function () { st.busca = ''; st.filtroCat = ''; st.filtroConta = ''; st.filtroTipo = ''; render(); };
    $('#csv').onclick = function () { exportarCSV(lst, 'lancamentos-' + m + '.csv'); };

    $$('[data-ed]').forEach(function (b) {
      b.onclick = function () { formLancamento(b.closest('tr').dataset.id); };
    });
    $$('[data-dl]').forEach(function (b) {
      b.onclick = function () {
        var id = b.closest('tr').dataset.id;
        var l = db.lancamentos.filter(function (x) { return x.id === id; })[0];
        confirmar('Excluir "' + l.desc + '" (' + E.brl(l.valor) + ')?', function () {
          db.lancamentos = db.lancamentos.filter(function (x) { return x.id !== id; });
          S.touch('Excluiu lançamento: ' + l.desc);
          toast('Lançamento excluído');
        });
      };
    });
  }

  function formLancamento(id) {
    var l = id ? db.lancamentos.filter(function (x) { return x.id === id; })[0] : null;
    var hoje = l ? l.data : (st.mes === E.mesDeHoje() ? E.hoje() : st.mes + '-01');
    var tipo = l ? (l.valor > 0 ? 'E' : 'S') : 'S';
    var isProv = l && (l.provSync || l.provId);
    var avisoProv = isProv
      ? '<div class="alert info" style="margin-bottom:12px"><span class="ic">🔺</span><div style="font-size:12px;line-height:1.4">Este valor de <b>Salário Líquido (' + E.brl(l.valor) + ')</b> é vinculado e sincronizado automaticamente com o módulo <b>Proventos MG (SEPLAG)</b> na Conta Salário Itaú. Qualquer alteração nas rubricas do contracheque atualiza este lançamento em tempo real.</div></div>'
      : '';
    var corpo =
      avisoProv +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld"><label>Data</label><input type="date" id="f-data" value="' + h(hoje) + '"></div>' +
      '<div class="fld"><label>Tipo</label><select id="f-tipo">' + opts([{ v: 'S', l: 'Saída (−)' }, { v: 'E', l: 'Entrada (+)' }], tipo) + '</select></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Descrição</label><input id="f-desc" value="' + h(l ? l.desc : '') + '" placeholder="ex.: Supermercado, Salário, Aluguel"></div>' +
      '<div class="fld"><label>Categoria</label><select id="f-cat">' + selCats(l ? l.cat : '') + '</select></div>' +
      '<div class="fld"><label>Valor (R$)</label><input id="f-val" inputmode="decimal" value="' + (l ? Math.abs(l.valor).toFixed(2).replace('.', ',') : '') + '" placeholder="0,00"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Conta Bancária / Origem</label><select id="f-conta">' + selContas(l ? l.conta : '') + '</select></div>' +
      '</div>' +
      '<div class="hint" style="margin-top:12px">A categoria define em qual relatório o valor entra. Pagamentos de fatura devem usar ' +
      E.cadastroCartoes(db).map(function (c) { return '<b>' + h(c.cat) + '</b>'; }).join(' ou ') + '.</div>';

    var ovl = modal(id ? 'Editar lançamento' : 'Novo lançamento', corpo, function (o) {
      var data = $('#f-data', o).value, desc = $('#f-desc', o).value.trim();
      var cat = $('#f-cat', o).value, v = parseVal($('#f-val', o).value);
      var t = $('#f-tipo', o).value;
      if (!data || !desc || !v) { toast('Preencha data, descrição e valor.', 'err'); return false; }
      var valor = t === 'E' ? Math.abs(v) : -Math.abs(v);
      if (l) {
        l.data = data; l.desc = desc; l.cat = cat; l.valor = E.r2(valor); l.conta = $('#f-conta', o).value;
        S.touch('Editou lançamento: ' + desc);
        toast('Lançamento atualizado');
      } else {
        db.lancamentos.push({ id: S.novoId('l'), data: data, desc: desc, cat: cat, valor: E.r2(valor), conta: $('#f-conta', o).value });
        S.touch('Novo lançamento: ' + desc + ' ' + E.brl(valor));
        toast('Lançamento registrado');
        st.mes = data.slice(0, 7);
      }
    }, id ? 'Salvar' : 'Lançar');

    /* alterna o grupo de categorias conforme o tipo */
    var sync = function () {
      var t = $('#f-tipo', ovl).value, sel = $('#f-cat', ovl);
      var cur = sel.value;
      sel.innerHTML = selCats(cur, t === 'E' ? 'receita' : 'despesa');
      if (!sel.value) sel.selectedIndex = 0;
    };
    $('#f-tipo', ovl).onchange = sync;
    if (!l) sync();
  }

  /* =================================================== IMPORTADOR OFX / CSV / PDF === */
  function abrirModalImportarOFX_CSV(db, st) {
    var contas = ['Conta Itaú', 'Nubank', 'Carteira / Dinheiro', 'Investimentos'];
    var categorias = E.todasCategorias(db);

    function sugerirCategoria(desc, valor) {
      var d = (desc || '').toLowerCase();
      if (valor > 0) {
        if (/sal[aá]rio|seplag|provento|folha|estado|vencimento/i.test(d)) return 'Salário';
        if (/rendimento|dividendo|jcp|cdi|selic|invest/i.test(d)) return 'Investimentos';
        if (/restitui|reembolso|estorno/i.test(d)) return 'Outras Receitas';
        return 'Outras Receitas';
      }
      if (/uber|99app|posto|combust|gasolina|etanol|estaciona|pedagio|sem parar|conectcar|ipva/i.test(d)) return 'Transporte';
      if (/ifood|rappi|mercado|supermerc|carrefour|pao de acucar|bh|epa|super|padaria|restaurante|lanchonete|acai|hamburguer|pizza|mcdonald/i.test(d)) return 'Alimentação';
      if (/farmacia|drogaria|drogasil|raia|pacheco|araujo|medico|hospital|laborat|exame|consulta|dentista|odonto|psicolog|unimed|ipsemg/i.test(d)) return 'Saúde';
      if (/netflix|spotify|amazon|prime|disney|hbo|max|cinema|ingresso|show|steam|playstation|jogos|bar|cerveja/i.test(d)) return 'Lazer';
      if (/cemig|copasa|enel|sabesp|energia|luz|agua|aluguel|condominio|iptu|gas|vivo|claro|tim|oi|internet|fibra/i.test(d)) return 'Moradia';
      if (/escola|colegio|faculdade|curso|udemy|livro|papelaria/i.test(d)) return 'Educação';
      if (/vestuario|roupa|calcado|zara|renner|riachuelo|centauro|decathlon/i.test(d)) return 'Vestuário';
      if (/itau|santander|bradesco|bb|empr|consign|financiamento|parcela/i.test(d)) return 'Consignados & Empréstimos';
      return categorias[0] || 'Geral';
    }

    var modalCorpo =
      '<div style="display:flex;flex-direction:column;gap:12px">' +
      '<div class="alert info" style="margin:0"><span class="ic">📂</span><div style="font-size:12px;line-height:1.4">Selecione o arquivo de extrato bancário (<b>.OFX</b>, <b>.CSV</b> ou <b>.PDF</b>) do seu banco (Itaú, Nubank, Banco do Brasil, Inter, Caixa, Bradesco, etc.) ou cole o texto. Os lançamentos serão lidos e categorizados automaticamente.</div></div>' +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld"><label>Conta Bancária de Destino</label><select id="imp-conta">' + opts(contas.map(function(c){ return {v: c, l: c}; }), 'Conta Itaú') + '</select></div>' +
      '<div class="fld"><label>Arquivo de Extrato (.OFX, .CSV ou .PDF)</label><input type="file" id="imp-file" accept=".ofx,.csv,.pdf,.txt" style="padding:5px"></div>' +
      '</div>' +
      '<div class="fld"><label>Ou cole o conteúdo do extrato/arquivo aqui:</label>' +
      '<textarea id="imp-txt" rows="4" placeholder="Cole o conteúdo do arquivo .OFX, linhas CSV ou texto do extrato em PDF aqui..." style="font-family:monospace;font-size:11.5px"></textarea>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center">' +
      '<button class="btn sm" id="btn-processar-arquivo">⚡ Processar Extrato</button>' +
      '<span id="imp-status" style="font-size:12px;color:var(--ink-2)"></span>' +
      '</div>' +
      '<div id="imp-resultado-wrap" style="display:none;margin-top:6px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<div style="font-weight:700;font-size:12.5px" id="imp-total-lidos">Lançamentos Encontrados</div>' +
      '<div style="display:flex;gap:6px">' +
      '<button class="btn sm" id="imp-sel-todos" style="padding:2px 8px;font-size:11px">Marcar Todos</button>' +
      '<button class="btn sm" id="imp-desel-todos" style="padding:2px 8px;font-size:11px">Desmarcar Todos</button>' +
      '</div>' +
      '</div>' +
      '<div class="tw" style="max-height:260px;overflow-y:auto;border:1px solid var(--stroke);border-radius:var(--r-sm)">' +
      '<table style="font-size:12px"><thead><tr><th style="width:36px;text-align:center">#</th><th style="width:75px">Data</th><th>Descrição</th><th style="width:140px">Categoria</th><th class="r" style="width:90px">Valor</th></tr></thead>' +
      '<tbody id="imp-grid-body"></tbody></table>' +
      '</div>' +
      '</div>' +
      '</div>';

    var itensLidos = [];

    var ovl = modal('Importar Extrato Bancário (OFX / CSV / PDF)', modalCorpo, function (o) {
      var marcados = [];
      var contaDestino = $('#imp-conta', o).value;
      $$('#imp-grid-body tr', o).forEach(function (tr, idx) {
        var chk = $('input[type="checkbox"]', tr);
        if (chk && chk.checked && itensLidos[idx]) {
          var selCat = $('select', tr);
          var catEscolhida = selCat ? selCat.value : itensLidos[idx].cat;
          marcados.push({
            id: S.novoId('l'),
            data: itensLidos[idx].data,
            desc: itensLidos[idx].desc,
            valor: itensLidos[idx].valor,
            cat: catEscolhida,
            conta: contaDestino
          });
        }
      });

      if (!marcados.length) {
        toast('Selecione ao menos um lançamento para importar.', 'err');
        return false;
      }

      marcados.forEach(function (novo) {
        db.lancamentos.push(novo);
      });

      S.touch('Importou ' + marcados.length + ' lançamento(s) via extrato');
      toast(marcados.length + ' lançamento(s) importado(s) com sucesso!');
      if (marcados[0] && marcados[0].data) st.mes = marcados[0].data.slice(0, 7);
      render();
    }, 'Importar Lançamentos Selecionados');

    function processarTexto(texto) {
      if (!texto || !texto.trim()) { toast('O arquivo ou texto está vazio.', 'err'); return; }
      itensLidos = [];

      // 1. Parser OFX
      if (texto.indexOf('<OFX>') >= 0 || texto.indexOf('<STMTTRN>') >= 0) {
        var blocos = texto.split(/<STMTTRN>/i);
        for (var i = 1; i < blocos.length; i++) {
          var b = blocos[i].split(/<\/STMTTRN>/i)[0];
          var mData = b.match(/<DTPOSTED>(\d{4})(\d{2})(\d{2})/i);
          var mVal = b.match(/<TRNAMT>([+-]?\d+(?:\.\d+)?)/i);
          var mMemo = b.match(/<MEMO>([^<\r\n]+)/i);
          var mName = b.match(/<NAME>([^<\r\n]+)/i);

          if (mData && mVal) {
            var dataIso = mData[1] + '-' + mData[2] + '-' + mData[3];
            var valNum = parseFloat(mVal[1]);
            var desc = (mMemo ? mMemo[1] : (mName ? mName[1] : 'Lançamento Bancário')).trim();
            itensLidos.push({
              data: dataIso,
              desc: desc,
              valor: E.r2(valNum),
              cat: sugerirCategoria(desc, valNum)
            });
          }
        }
      }
      // 2. Parser CSV e Linhas de Extrato Bancário / PDF
      else {
        var linhas = texto.split('\n');
        var anoPadrao = (new Date()).getFullYear();
        linhas.forEach(function (linha) {
          var l = linha.trim();
          if (!l || l.length < 5) return;

          // Se for formato delimitado por ; ou ,
          if (l.indexOf(';') >= 0 || (l.indexOf(',') >= 0 && l.split(',').length >= 3)) {
            var partes = l.indexOf(';') >= 0 ? l.split(';') : l.split(',');
            if (partes.length >= 3) {
              var pData = partes[0].trim().replace(/['"]/g, '');
              var pDesc = partes[1].trim().replace(/['"]/g, '');
              var pVal = partes[2].trim().replace(/['"]/g, '').replace('R$', '').trim();

              var dataIso = '';
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(pData)) {
                var dp = pData.split('/');
                dataIso = dp[2] + '-' + dp[1] + '-' + dp[0];
              } else if (/^\d{4}-\d{2}-\d{2}$/.test(pData)) {
                dataIso = pData;
              }

              var valNum = parseFloat(pVal.replace(/\./g, '').replace(',', '.'));
              if (isNaN(valNum)) valNum = parseFloat(pVal);

              if (dataIso && !isNaN(valNum) && valNum !== 0) {
                itensLidos.push({
                  data: dataIso,
                  desc: pDesc || 'Lançamento Bancário',
                  valor: E.r2(valNum),
                  cat: sugerirCategoria(pDesc, valNum)
                });
                return;
              }
            }
          }

          // Parser inteligente para linhas livres de PDF/Texto de extrato (ex: "15/08/2026 PIX PAGTO MERCADO -145,50" ou "12/08 TED ENTRADA 1.500,00 C")
          var matchExtrato = l.match(/^(\d{2}\/\d{2}(?:\/\d{2,4})?)\s+(.*?)\s+([+-]?(?:R\$\s*)?\d{1,3}(?:\.\d{3})*,\d{2}|[+-]?\d+\.\d{2})(?:\s*([DC]))?$/i);
          if (matchExtrato) {
            var rawData = matchExtrato[1];
            var rawDesc = matchExtrato[2].trim();
            var rawValorStr = matchExtrato[3].replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
            var indicadorDC = matchExtrato[4];

            var dataParts = rawData.split('/');
            var anoExt = dataParts.length === 3 ? (dataParts[2].length === 2 ? '20' + dataParts[2] : dataParts[2]) : String(anoPadrao);
            var mesExt = dataParts[1].padStart(2, '0');
            var diaExt = dataParts[0].padStart(2, '0');
            var dataIso = anoExt + '-' + mesExt + '-' + diaExt;

            var valNum = parseFloat(rawValorStr);
            if (indicadorDC && indicadorDC.toUpperCase() === 'D' && valNum > 0) valNum = -valNum;
            else if (indicadorDC && indicadorDC.toUpperCase() === 'C' && valNum < 0) valNum = Math.abs(valNum);

            if (!isNaN(valNum) && valNum !== 0 && rawDesc) {
              itensLidos.push({
                data: dataIso,
                desc: rawDesc,
                valor: E.r2(valNum),
                cat: sugerirCategoria(rawDesc, valNum)
              });
            }
          }
        });
      }

      var wrap = $('#imp-resultado-wrap', ovl);
      var tbody = $('#imp-grid-body', ovl);
      var totalTxt = $('#imp-total-lidos', ovl);
      var status = $('#imp-status', ovl);

      if (!itensLidos.length) {
        status.innerHTML = '<span style="color:#dc2626">Nenhum lançamento identificado. Verifique o arquivo ou texto.</span>';
        if (wrap) wrap.style.display = 'none';
        return;
      }

      status.innerHTML = '<span style="color:#16a34a">✓ ' + itensLidos.length + ' lançamentos identificados</span>';
      if (totalTxt) totalTxt.textContent = itensLidos.length + ' Lançamentos Identificados';
      if (wrap) wrap.style.display = 'block';

      tbody.innerHTML = itensLidos.map(function (item, idx) {
        var isDupl = db.lancamentos.some(function (existente) {
          return existente.data === item.data && Math.abs(existente.valor - item.valor) < 0.01 && existente.desc.toLowerCase() === item.desc.toLowerCase();
        });
        return '<tr style="' + (isDupl ? 'background:rgba(234,179,8,0.08)' : '') + '">' +
          '<td style="text-align:center"><input type="checkbox" ' + (isDupl ? '' : 'checked') + ' data-idx="' + idx + '"></td>' +
          '<td class="num">' + h(E.dataLabel(item.data)) + '</td>' +
          '<td>' + h(item.desc) + (isDupl ? ' <span class="tag am" style="font-size:10px" title="Já existe lançamento idêntico no banco">Duplicado?</span>' : '') + '</td>' +
          '<td><select style="font-size:11px;padding:2px 4px;width:100%">' + selCats(item.cat, item.valor > 0 ? 'receita' : 'despesa') + '</select></td>' +
          '<td class="r num ' + (item.valor > 0 ? 'pos' : 'neg') + '">' + E.brl(item.valor) + '</td>' +
          '</tr>';
      }).join('');
    }

    var inpFile = $('#imp-file', ovl);
    if (inpFile) {
      inpFile.onchange = function (e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;

        var status = $('#imp-status', ovl);
        if (status) status.innerHTML = '<span>Lendo arquivo ' + h(file.name) + '...</span>';

        // Suporte a PDF via pdf.js
        if (/\.pdf$/i.test(file.name) || file.type === 'application/pdf') {
          var reader = new FileReader();
          reader.onload = function (evt) {
            var typedarray = new Uint8Array(evt.target.result);
            if (typeof pdfjsLib !== 'undefined') {
              pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
                var maxPages = pdf.numPages;
                var countPromises = [];
                for (var j = 1; j <= maxPages; j++) {
                  countPromises.push(pdf.getPage(j).then(function (page) {
                    return page.getTextContent().then(function (textContent) {
                      return textContent.items.map(function (item) { return item.str; }).join(' ');
                    });
                  }));
                }
                Promise.all(countPromises).then(function (texts) {
                  var textoCompleto = texts.join('\n');
                  $('#imp-txt', ovl).value = textoCompleto;
                  processarTexto(textoCompleto);
                });
              }).catch(function (err) {
                console.error('Erro ao ler PDF:', err);
                toast('Erro ao processar PDF. Tente copiar e colar o texto.', 'err');
              });
            } else {
              toast('Leitor de PDF carregando... Tente colar o texto.', 'err');
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          var reader = new FileReader();
          reader.onload = function (evt) {
            var content = evt.target.result;
            $('#imp-txt', ovl).value = content;
            processarTexto(content);
          };
          reader.readAsText(file, 'ISO-8859-1');
        }
      };
    }

    var btnProc = $('#btn-processar-arquivo', ovl);
    if (btnProc) {
      btnProc.onclick = function () {
        var txt = $('#imp-txt', ovl).value;
        processarTexto(txt);
      };
    }

    var btnSel = $('#imp-sel-todos', ovl);
    if (btnSel) btnSel.onclick = function () { $$('#imp-grid-body input[type="checkbox"]', ovl).forEach(function(c){ c.checked = true; }); };
    var btnDesel = $('#imp-desel-todos', ovl);
    if (btnDesel) btnDesel.onclick = function () { $$('#imp-grid-body input[type="checkbox"]', ovl).forEach(function(c){ c.checked = false; }); };
  }

  /* ==================================================== TELA · RECORRENTES == */
  function viewRecorrentes(root) {
    var rs = db.recorrentes || [];
    root.innerHTML = topo('Fixos & Recorrentes',
      'Cadastre uma vez; o sistema replica o lançamento em todos os meses futuros automaticamente.',
      '<button class="btn" id="aplicar">↻ Gerar agora</button><button class="btn pri" id="novo">+ Recorrente</button>') +
      '<div class="alert info" style="margin-bottom:14px"><span class="ic">ⓘ</span><div>Os recorrentes só criam lançamentos <b>depois</b> do mês de referência (' + E.mesLabel(db.meta.mesRef) + '), para nunca sobrescrever o que já foi realizado. Ao mudar o mês de referência, os meses seguintes são repovoados sozinhos.</div></div>' +
      '<div class="card"><div class="tw"><table><thead><tr><th>Descrição</th><th>Categoria</th><th class="r">Valor</th>' +
      '<th class="c">Dia</th><th class="c">Início</th><th class="c">Fim</th><th class="c">Ativo</th><th></th></tr></thead><tbody>' +
      (rs.length ? rs.map(function (r) {
        return '<tr data-id="' + r.id + '"><td>' + h(r.desc) + '</td><td><span class="tag">' + h(r.cat) + '</span></td>' +
          '<td class="r">' + num(r.valor) + '</td><td class="c num">' + r.dia + '</td>' +
          '<td class="c num">' + E.mesLabel(r.inicio) + '</td><td class="c num">' + (r.fim ? E.mesLabel(r.fim) : '∞') + '</td>' +
          '<td class="c">' + (r.ativo ? '<span class="tag ok">ativo</span>' : '<span class="tag">pausado</span>') + '</td>' +
          '<td class="c actions" style="width:74px"><button class="iconbtn" data-ed>✎</button><button class="iconbtn del" data-dl>✕</button></td></tr>';
      }).join('') : '<tr><td colspan="8" class="empty">Nenhum recorrente. Cadastre aluguel, plano de saúde, internet, pensão…</td></tr>') +
      '</tbody></table></div></div>';

    $('#novo').onclick = function () { formRecorrente(null); };
    $('#aplicar').onclick = function () {
      var n = E.aplicarRecorrentes(db);
      S.touch('Gerou ' + n + ' lançamento(s) recorrente(s)');
      toast(n ? n + ' lançamento(s) gerado(s)' : 'Nada a gerar — já está tudo em dia');
    };
    $$('[data-ed]').forEach(function (b) { b.onclick = function () { formRecorrente(b.closest('tr').dataset.id); }; });
    $$('[data-dl]').forEach(function (b) {
      b.onclick = function () {
        var id = b.closest('tr').dataset.id;
        confirmar('Excluir este recorrente? Os lançamentos futuros que ele gerou também serão removidos.', function () {
          db.recorrentes = db.recorrentes.filter(function (x) { return x.id !== id; });
          db.lancamentos = db.lancamentos.filter(function (l) { return !(l.rec === id && l.data.slice(0, 7) > db.meta.mesRef); });
          S.touch('Excluiu recorrente');
          toast('Recorrente removido');
        });
      };
    });
  }
  function formRecorrente(id) {
    var r = id ? db.recorrentes.filter(function (x) { return x.id === id; })[0] : null;
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld" style="grid-column:1/-1"><label>Descrição</label><input id="r-desc" value="' + h(r ? r.desc : '') + '" placeholder="ex.: Aluguel"></div>' +
      '<div class="fld"><label>Tipo</label><select id="r-tipo">' + opts([{ v: 'S', l: 'Saída (−)' }, { v: 'E', l: 'Entrada (+)' }], r && r.valor > 0 ? 'E' : 'S') + '</select></div>' +
      '<div class="fld"><label>Valor (R$)</label><input id="r-val" inputmode="decimal" value="' + (r ? Math.abs(r.valor).toFixed(2).replace('.', ',') : '') + '"></div>' +
      '<div class="fld"><label>Categoria</label><select id="r-cat">' + selCats(r ? r.cat : '') + '</select></div>' +
      '<div class="fld"><label>Dia do mês</label><input type="number" id="r-dia" min="1" max="31" value="' + (r ? r.dia : 10) + '"></div>' +
      '<div class="fld"><label>Início</label><select id="r-ini">' + selMeses(r ? r.inicio : E.addMes(db.meta.mesRef, 1)) + '</select></div>' +
      '<div class="fld"><label>Fim (opcional)</label><select id="r-fim"><option value="">sem fim</option>' + selMeses(r ? r.fim : '') + '</select></div>' +
      '<div class="fld" style="grid-column:1/-1"><label><input type="checkbox" id="r-ativo" style="width:auto;margin-right:8px"' + (!r || r.ativo ? ' checked' : '') + '> Ativo</label></div>' +
      '</div>';
    modal(id ? 'Editar recorrente' : 'Novo recorrente', corpo, function (o) {
      var desc = $('#r-desc', o).value.trim(), v = parseVal($('#r-val', o).value);
      if (!desc || !v) { toast('Preencha descrição e valor.', 'err'); return false; }
      var obj = {
        id: r ? r.id : S.novoId('rc'), desc: desc, cat: $('#r-cat', o).value,
        valor: E.r2($('#r-tipo', o).value === 'E' ? Math.abs(v) : -Math.abs(v)),
        dia: +$('#r-dia', o).value || 1, inicio: $('#r-ini', o).value, fim: $('#r-fim', o).value || null,
        ativo: $('#r-ativo', o).checked
      };
      if (r) { Object.keys(obj).forEach(function (k) { r[k] = obj[k]; }); }
      else db.recorrentes.push(obj);
      var n = E.aplicarRecorrentes(db);
      S.touch('Recorrente salvo: ' + desc);
      toast('Recorrente salvo · ' + n + ' lançamento(s) gerado(s)');
    });
  }

  /* ======================================================= TELA · CARTÕES === */
  function formCartao(idOuNome) {
    var c = idOuNome ? E.cadastroCartoes(db).filter(function (x) { return x.id === idOuNome || x.nome === idOuNome; })[0] : null;
    var corPadrao = c ? (c.cor || '#ea580c') : '#7c3aed';
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld" style="grid-column:1/-1"><label>Nome do Cartão</label><input id="c-nome" value="' + h(c ? c.nome : '') + '" placeholder="ex.: Itaú Click, Nubank Ultravioleta, Santander, Inter"></div>' +
      '<div class="fld"><label>Categoria da Fatura</label><input id="c-cat" value="' + h(c ? c.cat : '') + '" placeholder="ex.: CC Nubank, Cartão"></div>' +
      '<div class="fld"><label>Limite de Crédito (R$)</label><input id="c-lim" inputmode="decimal" value="' + (c && c.limite ? c.limite.toFixed(2).replace('.', ',') : '5000,00') + '" placeholder="0,00"></div>' +
      '<div class="fld"><label>Dia do Fechamento</label><input type="number" id="c-fech" min="1" max="31" value="' + (c ? (c.diaFechamento || 25) : 25) + '"></div>' +
      '<div class="fld"><label>Dia do Vencimento</label><input type="number" id="c-venc" min="1" max="31" value="' + (c ? (c.diaVencimento || 5) : 5) + '"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Cor do Cartão</label><div class="inline" style="gap:10px">' +
      '<input type="color" id="c-cor" value="' + corPadrao + '" style="height:36px;width:52px;padding:2px;cursor:pointer;border-radius:4px;border:1px solid var(--stroke)">' +
      '<span style="font-size:12px;color:var(--ink-3)">Cor para identificação nas faturas e gráficos</span>' +
      '</div></div>' +
      '</div>' +
      '<div class="hint" style="margin-top:10px">Ao alterar o nome do cartão, os parcelamentos e lançamentos vinculados são sincronizados automaticamente.</div>';

    modal(c ? 'Editar Cartão de Crédito' : 'Novo Cartão de Crédito', corpo, function (o) {
      var nome = $('#c-nome', o).value.trim();
      var cat = $('#c-cat', o).value.trim() || ('CC ' + nome);
      var lim = parseVal($('#c-lim', o).value) || 0;
      var fech = Math.min(31, Math.max(1, +$('#c-fech', o).value || 25));
      var venc = Math.min(31, Math.max(1, +$('#c-venc', o).value || 5));
      var cor = $('#c-cor', o).value || '#7c3aed';

      if (!nome) { toast('Informe o nome do cartão.', 'err'); return false; }

      if (!db.categorias) db.categorias = { receita: [], despesa: [] };
      if (!db.categorias.despesa) db.categorias.despesa = [];
      if (db.categorias.despesa.indexOf(cat) < 0) {
        db.categorias.despesa.push(cat);
        db.categorias.despesa.sort(function (a, b) { return a.localeCompare(b, 'pt-BR'); });
      }

      if (!db.cartoes) db.cartoes = [];

      if (c) {
        var antigoNome = c.nome;
        var antigaCat = c.cat;
        c.nome = nome;
        c.cat = cat;
        c.limite = lim;
        c.diaFechamento = fech;
        c.diaVencimento = venc;
        c.cor = cor;

        if (antigoNome !== nome) {
          db.parcelamentos.forEach(function (p) {
            if (p.cartao === antigoNome) p.cartao = nome;
          });
          db.lancamentos.forEach(function (l) {
            if (l.cat === antigaCat) l.cat = cat;
          });
        }
        S.touch('Atualizou cartão: ' + nome);
        toast('Cartão atualizado com sucesso!');
      } else {
        if (db.cartoes.some(function (x) { return x.nome.toLowerCase() === nome.toLowerCase(); })) {
          toast('Já existe um cartão com este nome.', 'err');
          return false;
        }
        var novoId = 'c_' + (db.cartoes.length + 1) + '_' + Math.random().toString(36).slice(2, 6);
        db.cartoes.push({
          id: novoId,
          nome: nome,
          cat: cat,
          limite: lim,
          diaFechamento: fech,
          diaVencimento: venc,
          cor: cor
        });
        S.touch('Cadastrou novo cartão: ' + nome);
        toast('Cartão cadastrado com sucesso!');
      }
      render();
    });
  }

  function excluirCartao(idOuNome) {
    var c = E.cadastroCartoes(db).filter(function (x) { return x.id === idOuNome || x.nome === idOuNome; })[0];
    if (!c) return;
    if (E.cartoes(db).length <= 1) {
      toast('É necessário manter pelo menos um cartão cadastrado.', 'err');
      return;
    }
    var parcs = db.parcelamentos.filter(function (p) { return p.cartao === c.nome; });
    var msg = 'Excluir o cartão "' + c.nome + '"?';
    if (parcs.length) {
      msg += ' Atenção: Existem ' + parcs.length + ' compra(s) parcelada(s) vinculada(s) a este cartão.';
    }
    confirmar(msg, function () {
      db.cartoes = (db.cartoes || []).filter(function (x) { return x.id !== c.id && x.nome !== c.nome; });
      S.touch('Excluiu cartão: ' + c.nome);
      toast('Cartão excluído');
      render();
    });
  }

  function viewCartoes(root) {
    var ms = E.meses(db), carts = E.cartoes(db);
    var cadCartoes = E.cadastroCartoes(db);
    var PAL = ['#ea580c', '#0284c7', '#7c3aed', '#059669', '#d97706', '#db2777', '#4b5563'];
    var cores = {};
    carts.forEach(function (c, i) {
      var cad = E.cartaoPorNome(db, c);
      cores[c] = (cad && cad.cor) ? cad.cor : PAL[i % PAL.length];
    });

    var rows = ms.map(function (m) {
      var cells = carts.map(function (c) {
        var x = E.cartaoMes(db, m, c);
        return '<td class="r num">' + (x.parcelado ? E.brl(x.parcelado) : '—') + '</td>' +
          '<td class="r num ' + (x.aVista < 0 ? 'neg' : '') + '">' + (x.fatura ? E.brl(x.aVista) : '—') + '</td>' +
          '<td class="r num"><b>' + (x.fatura ? E.brl(x.fatura) : '—') + '</b></td>';
      }).join('');
      var tot = carts.reduce(function (a, c) { return a + E.faturaPaga(db, m, c); }, 0);
      return '<tr><td class="num">' + E.mesLabel(m) + '</td>' + cells + '<td class="r num"><b>' + (tot ? E.brl(tot) : '—') + '</b></td></tr>';
    }).join('');

    var totLinha = carts.map(function (c) {
      var p = 0, v = 0, f = 0;
      ms.forEach(function (m) {
        var x = E.cartaoMes(db, m, c);
        if (!x.fatura) return;
        p += x.parcelado; v += x.aVista; f += x.fatura;
      });
      return '<td class="r num">' + E.brl(p) + '</td><td class="r num">' + E.brl(v) + '</td><td class="r num">' + E.brl(f) + '</td>';
    }).join('');
    var totGeral = ms.reduce(function (a, m) { return a + carts.reduce(function (b, c) { return b + E.faturaPaga(db, m, c); }, 0); }, 0);

    root.innerHTML = topo('Cartões de crédito',
      'Gerenciamento completo de faturas, limites e parcelamentos. Todos os cartões são 100% editáveis.',
      '<div class="monthbar"><select id="selmes">' + selMeses(st.mes) + '</select></div>' +
      '<button class="btn" id="novocartao" style="font-weight:600">+ Novo Cartão</button>' +
      '<button class="btn pri" id="novafatura">+ Lançar Fatura</button>') +

      '<div class="grid g-2" style="margin-bottom:14px">' +
      carts.map(function (c, i) {
        var x = E.cartaoMes(db, st.mes, c);
        var cad = E.cartaoPorNome(db, c) || { nome: c, cat: E.catDoCartao(db, c), limite: 5000, diaFechamento: 25, diaVencimento: 5 };
        var cat = cad.cat || E.catDoCartao(db, c);
        var abertos = db.parcelamentos.filter(function (p) { return p.cartao === c && E.statusParcelamento(db, p).status !== 'quitado'; });
        var falta = abertos.reduce(function (a, p) { return a + E.statusParcelamento(db, p).falta; }, 0);
        var comprometido = x.fatura || (x.parcelado + (x.aVista > 0 ? x.aVista : 0));
        var limite = cad.limite || 0;
        var disponivel = Math.max(0, limite - (falta > 0 ? falta : comprometido));
        var pctUso = limite > 0 ? Math.min(100, Math.round(((falta > 0 ? falta : comprometido) / limite) * 100)) : 0;

        var alerta = x.fatura === 0 && x.parcelado > 0
          ? '<div class="alert" style="margin-top:12px"><span class="ic">⚠</span><div>Há <b>' + E.brl(x.parcelado) + '</b> em parcelas neste mês, mas nenhuma fatura lançada na categoria <b>' + h(cat) + '</b>. Use <b>+ Lançar Fatura</b>.</div></div>'
          : (x.aVista < -0.005
            ? '<div class="alert" style="margin-top:12px"><span class="ic">⚠</span><div>A fatura lançada é <b>menor</b> que o parcelado do mês — confira o valor da fatura ou o cadastro das parcelas.</div></div>'
            : '');

        return '<div class="card" style="border-top:3px solid ' + cores[c] + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<div style="display:flex;align-items:center;gap:8px">' +
          '<h3 style="margin:0">' + h(c) + '</h3>' +
          '<span class="tag" style="background:' + cores[c] + '18;color:' + cores[c] + ';font-weight:600;font-size:11px">Fech. dia ' + (cad.diaFechamento || 25) + ' · Venc. dia ' + (cad.diaVencimento || 5) + '</span>' +
          '</div>' +
          '<div class="actions">' +
          '<button class="iconbtn" data-ed-cart="' + h(c) + '" title="Editar limite e configurações deste cartão">✎</button>' +
          '<button class="iconbtn del" data-dl-cart="' + h(c) + '" title="Excluir cartão">✕</button>' +
          '</div>' +
          '</div>' +

          (limite > 0 ? (
            '<div style="background:var(--bg-elevated);padding:10px 12px;border-radius:var(--r);margin-bottom:12px;border:1px solid var(--stroke)">' +
            '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">' +
            '<span>Limite: <b>' + E.brl(limite) + '</b></span>' +
            '<span style="color:var(--ink-2)">Comprometido total: <b>' + E.brl(falta > 0 ? falta : comprometido) + ' (' + pctUso + '%)</b></span>' +
            '<span>Disponível: <b style="color:var(--pos)">' + E.brl(disponivel) + '</b></span>' +
            '</div>' +
            '<div style="background:var(--stroke);height:6px;border-radius:3px;overflow:hidden">' +
            '<div style="background:' + (pctUso > 85 ? 'var(--neg)' : cores[c]) + ';width:' + pctUso + '%;height:100%"></div>' +
            '</div>' +
            '</div>'
          ) : '') +

          '<div style="display:flex;gap:22px;flex-wrap:wrap">' +
          '<div><div class="lb" style="font-size:11px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.07em">Fatura ' + E.mesLabel(st.mes) + '</div><div class="num" style="font-size:22px;font-weight:600">' + E.brl(x.fatura) + '</div></div>' +
          '<div><div class="lb" style="font-size:11px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.07em">Parcelado no Mês</div><div class="num" style="font-size:18px;color:' + cores[c] + '">' + E.brl(x.parcelado) + '</div></div>' +
          '<div><div class="lb" style="font-size:11px;color:var(--ink-3);text-transform:uppercase;letter-spacing:.07em">À vista + encargos</div><div class="num ' + (x.aVista < 0 ? 'neg' : '') + '" style="font-size:18px">' + E.brl(x.aVista) + '</div></div>' +
          '</div>' +
          '<div class="hint" style="margin-top:8px">Categoria: <b>' + h(cat) + '</b> · ' + abertos.length + ' compra(s) parcelada(s) · saldo devedor futuro: <b>' + E.brl(falta) + '</b></div>' +
          alerta +
          '</div>';
      }).join('') + '</div>' +

      '<div class="alert info" style="margin-bottom:14px"><span class="ic">ⓘ</span><div>' +
      '<b>De onde vem cada número:</b> <b>Parcelado</b> é a soma das parcelas que caem no mês, vinda do ' +
      '<b>cadastro de parcelamentos</b>. ' +
      '<b>Fatura</b> é o que você efetivamente pagou: os lançamentos do mês na categoria do cartão. ' +
      '<b>À vista</b> é a diferença (<b>fatura − parcelado</b>), correspondente a compras pontuais, encargos ou anuidade. ' +
      'Você pode adicionar quantos cartões desejar pelo botão <b>+ Novo Cartão</b> ou editar limites clicando em <b>✎</b>.</div></div>' +

      '<div class="card" style="margin-bottom:14px"><h3>Composição da fatura mês a mês</h3>' +
      C.legenda(carts.map(function (c) { return { nome: c, cor: cores[c] || 'var(--s1)' }; })) +
      '<div id="ch-cart"></div></div>' +

      '<div class="card"><h3>Evolução detalhada</h3><div class="tw"><table><thead><tr><th rowspan="2" style="vertical-align:bottom">Mês</th>' +
      carts.map(function (c) { return '<th colspan="3" class="c">' + h(c) + '</th>'; }).join('') +
      '<th rowspan="2" class="r" style="vertical-align:bottom">Total</th></tr><tr>' +
      carts.map(function () { return '<th class="r">Parcelado</th><th class="r">À vista</th><th class="r">Fatura</th>'; }).join('') +
      '</tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr><td>TOTAL</td>' + totLinha + '<td class="r num">' + E.brl(totGeral) + '</td></tr></tfoot></table></div></div>';

    C.empilhado($('#ch-cart'), {
      labels: ms.map(function (m) { return E.mesLabel(m); }),
      titulos: ms.map(function (m) { return E.mesLabelLongo(m); }),
      series: carts.map(function (c) {
        return { nome: c, cor: cores[c] || 'var(--s1)', dados: ms.map(function (m) { return E.faturaPaga(db, m, c); }) };
      }), altura: 240
    });

    $('#novocartao').onclick = function () { formCartao(null); };
    $('#novafatura').onclick = function () { formFatura(); };
    $('#selmes').onchange = function () { st.mes = this.value; render(); };

    $$('[data-ed-cart]').forEach(function (b) {
      b.onclick = function () { formCartao(b.dataset.edCart); };
    });
    $$('[data-dl-cart]').forEach(function (b) {
      b.onclick = function () { excluirCartao(b.dataset.dlCart); };
    });
  }

  /* ================================================ TELA · PARCELAMENTOS === */
  function viewParcelamentos(root) {
    var ms = E.meses(db);
    var carts = E.cartoes(db);
    var cartFiltro = st.filtroCartao || '';
    var lst = db.parcelamentos.filter(function (p) {
      return !cartFiltro || p.cartao === cartFiltro;
    }).map(function (p) {
      var s = E.statusParcelamento(db, p);
      return { p: p, s: s };
    }).sort(function (a, b) {
      var o = { 'andamento': 0, 'a-iniciar': 1, 'quitado': 2 };
      return o[a.s.status] - o[b.s.status] || (a.p.mes1 < b.p.mes1 ? -1 : 1);
    });
    var falta = lst.reduce(function (a, x) { return a + x.s.falta; }, 0);
    var emAberto = lst.filter(function (x) { return x.s.status !== 'quitado'; }).length;
    var noMes = E.totalParcelado(db, st.mes, cartFiltro || undefined);

    var parcsDoMes = E.parcelasDoMes(db, st.mes).filter(function (x) {
      return !cartFiltro || x.cartao === cartFiltro;
    });

    root.innerHTML = topo('Parcelamentos',
      'Cadastre a compra uma vez — as parcelas aparecem sozinhas em todos os meses, numeradas.',
      '<div class="monthbar"><select id="selmes">' + selMeses(st.mes) + '</select></div>' +
      '<select id="selcart" style="font-weight:600;padding:6px 10px;border-radius:var(--r);border:1px solid var(--stroke);background:var(--bg-card);color:var(--ink-1)"><option value="">Todos os cartões (' + carts.length + ')</option>' +
      opts(carts.map(function (c) { return { v: c, l: 'Cartão ' + c }; }), cartFiltro) + '</select>' +
      '<button class="btn pri" id="novo">+ Parcelamento</button>') +

      '<div class="grid g-kpi" style="margin-bottom:14px">' +
      kpi('Compromissos em aberto', String(emAberto), 'de ' + lst.length + ' cadastrados', 'acc-am') +
      kpi('Falta pagar', E.brl(falta), 'Somando todas as parcelas futuras', 'acc-out') +
      kpi('Parcelas em ' + E.mesLabel(st.mes), E.brl(noMes), parcsDoMes.length + ' parcela(s)', 'acc-br') +
      '</div>' +

      '<div class="card" style="margin-bottom:14px"><h3>Carga de parcelas por mês</h3><div id="ch-par"></div></div>' +

      '<div class="card"><h3>Compromissos ' + (cartFiltro ? '· Cartão ' + h(cartFiltro) : '') + '</h3><div class="tw"><table><thead><tr>' +
      '<th>Cartão</th><th>Fornecedor</th><th class="c">1ª parcela</th><th class="c">Parcelas</th>' +
      '<th class="r">Valor</th><th class="r">Total</th><th class="c">Pagas</th><th class="r">Falta</th><th class="c">Situação</th><th></th></tr></thead><tbody>' +
      lst.map(function (x) {
        var p = x.p, s = x.s;
        return '<tr data-id="' + p.id + '">' +
          '<td><span class="tag" style="background:var(--bg-elevated);border:1px solid var(--stroke)">' + h(p.cartao) + '</span></td>' +
          '<td>' + h(p.fornecedor) + '</td>' +
          '<td class="c num">' + E.mesLabel(p.mes1) + '</td>' +
          '<td class="c num">' + p.n + 'x</td>' +
          '<td class="r num">' + E.brl(p.valor) + '</td>' +
          '<td class="r num">' + E.brl(s.total) + '</td>' +
          '<td class="c num">' + s.pagas + '/' + p.n + '</td>' +
          '<td class="r num">' + (s.falta ? E.brl(s.falta) : '—') + '</td>' +
          '<td class="c">' + (s.status === 'quitado' ? '<span class="tag ok">✅ Quitado</span>' :
            s.status === 'a-iniciar' ? '<span class="tag soon">📆 A iniciar</span>' : '<span class="tag run">● Em andamento</span>') + '</td>' +
          '<td class="c actions" style="width:74px"><button class="iconbtn" data-ed>✎</button><button class="iconbtn del" data-dl>✕</button></td></tr>';
      }).join('') + '</tbody></table></div></div>' +

      '<div class="card" style="margin-top:14px"><h3>Parcelas de ' + E.mesLabelLongo(st.mes) + '</h3>' +
      '<div class="tw"><table><thead><tr><th>Cartão</th><th>Fornecedor</th><th class="c">Parcela</th><th class="r">Valor</th></tr></thead><tbody>' +
      (parcsDoMes.map(function (x) {
        return '<tr><td><span class="tag">' + h(x.cartao) + '</span></td><td>' + h(x.fornecedor) + '</td>' +
          '<td class="c num">' + x.parcela + ' de ' + x.de + '</td><td class="r num">' + E.brl(x.valor) + '</td></tr>';
      }).join('') || '<tr><td colspan="4" class="empty">Nenhuma parcela neste mês.</td></tr>') +
      '</tbody><tfoot><tr><td colspan="3">Total</td><td class="r num">' + E.brl(noMes) + '</td></tr></tfoot></table></div></div>';

    $('#selmes').onchange = function () { st.mes = this.value; render(); };
    $('#selcart').onchange = function () { st.filtroCartao = this.value; render(); };
    $('#novo').onclick = function () { formParcelamento(null); };
    $$('[data-ed]').forEach(function (b) { b.onclick = function () { formParcelamento(b.closest('tr').dataset.id); }; });
    $$('[data-dl]').forEach(function (b) {
      b.onclick = function () {
        var id = b.closest('tr').dataset.id;
        var p = db.parcelamentos.filter(function (x) { return x.id === id; })[0];
        confirmar('Excluir o parcelamento "' + p.fornecedor + '"? As parcelas somem de todos os meses.', function () {
          db.parcelamentos = db.parcelamentos.filter(function (x) { return x.id !== id; });
          S.touch('Excluiu parcelamento: ' + p.fornecedor);
          toast('Parcelamento excluído');
        });
      };
    });

    var PAL = ['#ea580c', '#0284c7', '#7c3aed', '#059669', '#d97706'];
    var seriesGrafico = (cartFiltro ? [cartFiltro] : carts).map(function (c, i) {
      var cad = E.cartaoPorNome(db, c);
      var cor = (cad && cad.cor) ? cad.cor : PAL[i % PAL.length];
      return { nome: c, cor: cor, dados: ms.map(function (m) { return E.totalParcelado(db, m, c); }) };
    });

    C.barras($('#ch-par'), {
      labels: ms.map(function (m) { return E.mesLabel(m); }),
      titulos: ms.map(function (m) { return E.mesLabelLongo(m); }),
      series: seriesGrafico,
      altura: 220
    });
  }

  function formParcelamento(id) {
    var p = id ? db.parcelamentos.filter(function (x) { return x.id === id; })[0] : null;
    var carts = E.cartoes(db);
    var cartPadrao = p ? p.cartao : (st.filtroCartao || carts[0] || 'Itaú');
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld"><label>Cartão</label><select id="p-cart">' + opts(carts, cartPadrao) + '</select></div>' +
      '<div class="fld"><label>Mês da 1ª parcela</label><select id="p-mes">' + selMeses(p ? p.mes1 : st.mes) + '</select></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Fornecedor / descrição</label><input id="p-forn" value="' + h(p ? p.fornecedor : '') + '" placeholder="ex.: Loja XYZ, Passagens Aéreas"></div>' +
      '<div class="fld"><label>Nº de parcelas</label><input type="number" id="p-n" min="1" max="120" value="' + (p ? p.n : 12) + '"></div>' +
      '<div class="fld"><label>Valor da parcela (R$)</label><input id="p-val" inputmode="decimal" value="' + (p ? p.valor.toFixed(2).replace('.', ',') : '') + '" placeholder="0,00"></div>' +
      '</div><div class="hint" id="p-prev" style="margin-top:12px"></div>';
    var ovl = modal(id ? 'Editar parcelamento' : 'Novo parcelamento', corpo, function (o) {
      var forn = $('#p-forn', o).value.trim(), n = +$('#p-n', o).value, v = parseVal($('#p-val', o).value);
      if (!forn || !n || !v) { toast('Preencha fornecedor, parcelas e valor.', 'err'); return false; }
      var obj = { id: p ? p.id : S.novoId('p'), cartao: $('#p-cart', o).value, fornecedor: forn, mes1: $('#p-mes', o).value, n: n, valor: E.r2(v) };
      if (p) Object.keys(obj).forEach(function (k) { p[k] = obj[k]; });
      else db.parcelamentos.push(obj);
      S.touch('Parcelamento salvo: ' + forn);
      toast('Parcelamento salvo');
    });
    var prev = function () {
      var n = +$('#p-n', ovl).value || 0, v = parseVal($('#p-val', ovl).value), m1 = $('#p-mes', ovl).value;
      $('#p-prev', ovl).innerHTML = n && v ? 'Total do compromisso: <b>' + E.brl(n * v) + '</b> · última parcela em <b>' + E.mesLabel(E.addMes(m1, n - 1)) + '</b>' : '';
    };
    ['#p-n', '#p-val', '#p-mes'].forEach(function (s) { $(s, ovl).oninput = prev; $(s, ovl).onchange = prev; });
    prev();
  }

  function formFatura() {
    var carts = E.cartoes(db);
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld"><label>Cartão</label><select id="f-cart">' + opts(carts, carts[0]) + '</select></div>' +
      '<div class="fld"><label>Mês de fechamento</label><select id="f-mes">' + selMeses(st.mes) + '</select></div>' +
      '<div class="fld"><label>Dia do pagamento</label><input type="number" id="f-dia" min="1" max="31" value="' + E.diasNoMes(st.mes) + '"></div>' +
      '<div class="fld"><label>Valor da fatura (R$)</label><input id="f-val" inputmode="decimal" placeholder="0,00"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Conta de Débito / Pagamento</label><select id="f-fatura-conta">' + selContas('') + '</select></div>' +
      '<div class="hint" style="grid-column:1/-1" id="f-prev"></div></div>';
    var ovl = modal('Lançar fatura de cartão', corpo, function (o) {
      var cart = $('#f-cart', o).value, mes = $('#f-mes', o).value, val = parseVal($('#f-val', o).value);
      var conta = $('#f-fatura-conta', o).value || 'Conta Salário Itaú';
      if (!val || val <= 0) { toast('Informe um valor maior que zero.', 'err'); return false; }
      var cat = E.catDoCartao(db, cart);
      if (db.categorias.despesa.indexOf(cat) < 0) db.categorias.despesa.push(cat);
      var dia = Math.min(Math.max(1, +$('#f-dia', o).value || E.diasNoMes(mes)), E.diasNoMes(mes));
      var data = mes + '-' + String(dia).padStart(2, '0');
      var desc = 'Fatura ' + cart + ' — ' + E.mesLabel(mes);
      db.lancamentos.push({ id: S.novoId('l'), data: data, desc: desc, valor: -val, cat: cat, conta: conta, rec: false });
      S.touch('Lançamento fatura: ' + desc);
      toast('Fatura lançada'); render();
    });
    var prev = function () {
      var cart = $('#f-cart', ovl).value, mes = $('#f-mes', ovl).value, val = parseVal($('#f-val', ovl).value);
      var par = E.totalParcelado(db, mes, cart), jaPago = E.faturaPaga(db, mes, cart);
      var txt = 'Categoria: <b>' + h(E.catDoCartao(db, cart)) + '</b> · parcelas cadastradas em ' + E.mesLabel(mes) + ': <b>' + E.brl(par) + '</b>';
      if (jaPago) txt += '<br><span style="color:#b45309">Já existe ' + E.brl(jaPago) + ' lançado neste mês — este valor será somado.</span>';
      if (val > 0) txt += '<br>À vista + encargos resultante: <b>' + E.brl(E.r2(jaPago + val - par)) + '</b>';
      $('#f-prev', ovl).innerHTML = txt;
      $('#f-dia', ovl).max = E.diasNoMes(mes);
    };
    ['#f-cart', '#f-mes', '#f-val'].forEach(function (s) { $(s, ovl).oninput = prev; $(s, ovl).onchange = prev; });
    prev();
  }

  /* ========================================================= TELA · FLUXO === */
  function viewFluxo(root) {
    var casc = E.cascata(db);
    var de = st.fluxoDe || db.meta.primeiroMes, ate = st.fluxoAte || db.meta.ultimoMes;
    var jan = casc.filter(function (c) { return c.mes >= de && c.mes <= ate; });

    root.innerHTML = topo('Fluxo de caixa',
      'O saldo final de um mês é o saldo inicial do seguinte — recalculado a cada lançamento.',
      '<div class="inline">' +
      '<div class="fld"><label>De</label><select id="f-de">' + selMeses(de) + '</select></div>' +
      '<div class="fld"><label>Até</label><select id="f-ate">' + selMeses(ate) + '</select></div>' +
      '</div><button class="btn" id="csv">↓ CSV</button>') +

      '<div class="card" style="margin-bottom:14px"><h3>Entradas, saídas e saldo — ' + E.mesLabel(de) + ' a ' + E.mesLabel(ate) + '</h3>' +
      C.legenda([{ nome: 'Entradas', cor: 'var(--entrada)' }, { nome: 'Saídas', cor: 'var(--saida)' }]) +
      '<div id="ch-b"></div>' +
      '<div style="height:14px"></div>' +
      C.legenda([{ nome: 'Saldo final', cor: 'var(--brand-hi)' }]) +
      '<div id="ch-l"></div></div>' +

      '<div class="card"><h3>Tabela mensal</h3><div class="tw"><table><thead><tr>' +
      '<th>Mês</th><th class="c">Status</th><th class="r">Saldo inicial</th><th class="r">Entradas</th>' +
      '<th class="r">Saídas</th><th class="r">Resultado</th><th class="r">Saldo final</th></tr></thead><tbody>' +
      jan.map(function (c) {
        return '<tr><td class="num">' + E.mesLabel(c.mes) + '</td><td class="c">' + tagStatus(c.status) + '</td>' +
          '<td class="r num">' + E.brl(c.saldoInicial) + '</td>' +
          '<td class="r"><span class="num pos">' + (c.entradas ? E.brl(c.entradas) : '—') + '</span></td>' +
          '<td class="r"><span class="num neg">' + (c.saidas ? E.brl(c.saidas) : '—') + '</span></td>' +
          '<td class="r">' + num(c.resultado) + '</td>' +
          '<td class="r num" style="font-weight:600' + (c.saldoFinal < 0 ? ';color:var(--saida)' : '') + '">' + E.brl(c.saldoFinal) + '</td></tr>';
      }).join('') + '</tbody><tfoot><tr><td colspan="3">TOTAL</td>' +
      '<td class="r num">' + E.brl(jan.reduce(function (a, c) { return a + c.entradas; }, 0)) + '</td>' +
      '<td class="r num">' + E.brl(jan.reduce(function (a, c) { return a + c.saidas; }, 0)) + '</td>' +
      '<td class="r num">' + E.brl(jan.reduce(function (a, c) { return a + c.resultado; }, 0)) + '</td>' +
      '<td class="r num">' + E.brl(jan.length ? jan[jan.length - 1].saldoFinal : 0) + '</td></tr></tfoot></table></div></div>';

    $('#f-de').onchange = function () { st.fluxoDe = this.value; render(); };
    $('#f-ate').onchange = function () { st.fluxoAte = this.value; render(); };
    $('#csv').onclick = function () {
      var linhas = [['Mes', 'Status', 'SaldoInicial', 'Entradas', 'Saidas', 'Resultado', 'SaldoFinal']];
      jan.forEach(function (c) { linhas.push([c.mes, c.status, c.saldoInicial, c.entradas, c.saidas, c.resultado, c.saldoFinal]); });
      baixarCSV(linhas, 'fluxo-de-caixa.csv');
    };

    C.barras($('#ch-b'), {
      labels: jan.map(function (c) { return E.mesLabel(c.mes); }),
      titulos: jan.map(function (c) { return E.mesLabelLongo(c.mes); }),
      series: [
        { nome: 'Entradas', cor: 'var(--entrada)', dados: jan.map(function (c) { return c.entradas; }) },
        { nome: 'Saídas', cor: 'var(--saida)', dados: jan.map(function (c) { return c.saidas; }) }
      ], altura: 230
    });
    C.linha($('#ch-l'), {
      labels: jan.map(function (c) { return E.mesLabel(c.mes); }),
      titulos: jan.map(function (c) { return E.mesLabelLongo(c.mes); }),
      series: [{ nome: 'Saldo final', cor: 'var(--brand-hi)', dados: jan.map(function (c) { return c.saldoFinal; }) }],
      area: true, altura: 200
    });
  }

  /* ==================================================== TELA · RELATÓRIOS === */
  function viewRelatorios(root) {
    var de = st.relDe || (db.meta.mesRef.slice(0, 4) + '-01');
    var ate = st.relAte || (db.meta.mesRef.slice(0, 4) + '-12');
    var meses = E.meses(db).filter(function (m) { return m >= de && m <= ate; });
    var classe = st.relClasse;
    var linhas = E.consolidado(db, classe, meses).filter(function (l) { return l.total > 0; });
    var total = linhas.reduce(function (a, l) { return a + l.total; }, 0);
    var cor = classe === 'receita' ? 'var(--entrada)' : 'var(--saida)';

    root.innerHTML = topo('Relatórios por categoria',
      'Soma automática de todos os lançamentos do período — consolidado de despesas e receitas.',
      '<div class="seg" id="segcl"><button data-c="despesa" class="' + (classe === 'despesa' ? 'on' : '') + '">Despesas</button>' +
      '<button data-c="receita" class="' + (classe === 'receita' ? 'on' : '') + '">Receitas</button></div>' +
      '<div class="inline"><div class="fld"><label>De</label><select id="r-de">' + selMeses(de) + '</select></div>' +
      '<div class="fld"><label>Até</label><select id="r-ate">' + selMeses(ate) + '</select></div></div>' +
      '<button class="btn" id="csv">↓ CSV</button>') +

      '<div class="grid g-2" style="margin-bottom:14px">' +
      '<div class="card"><h3>Ranking do período</h3><div id="ch-rk"></div></div>' +
      '<div class="card"><h3>Total mês a mês</h3>' + C.legenda([{ nome: classe === 'receita' ? 'Receitas' : 'Despesas', cor: cor }]) + '<div id="ch-mm"></div></div>' +
      '</div>' +

      '<div class="card"><h3>' + (classe === 'receita' ? 'Receitas' : 'Despesas') + ' · ' + E.mesLabel(de) + ' a ' + E.mesLabel(ate) + '</h3>' +
      '<div class="tw"><table><thead><tr><th style="min-width:180px">Categoria</th>' +
      meses.map(function (m) { return '<th class="r">' + E.mesLabel(m) + '</th>'; }).join('') +
      '<th class="r">Total</th><th class="r">Média</th><th class="r">%</th></tr></thead><tbody>' +
      (linhas.length ? linhas.map(function (l) {
        return '<tr><td>' + (l.orfa ? '<span class="tag run">⚑ ' + h(l.cat) + '</span>' : h(l.cat)) + '</td>' +
          l.valores.map(function (v) { return '<td class="r num" style="' + (v ? '' : 'color:var(--ink-3)') + '">' + (v ? E.brl(v) : '—') + '</td>'; }).join('') +
          '<td class="r num"><b>' + E.brl(l.total) + '</b></td>' +
          '<td class="r num" style="color:var(--ink-2)">' + E.brl(l.total / meses.length) + '</td>' +
          '<td class="r num" style="color:var(--ink-2)">' + (total ? (l.total / total * 100).toFixed(1).replace('.', ',') : '0') + '%</td></tr>';
      }).join('') : '<tr><td colspan="' + (meses.length + 4) + '" class="empty">Sem dados no período.</td></tr>') +
      '</tbody><tfoot><tr><td>TOTAL</td>' +
      meses.map(function (m, i) {
        var s = linhas.reduce(function (a, l) { return a + l.valores[i]; }, 0);
        return '<td class="r num">' + (s ? E.brl(s) : '—') + '</td>';
      }).join('') +
      '<td class="r num">' + E.brl(total) + '</td><td class="r num">' + E.brl(total / meses.length) + '</td><td class="r">100%</td></tr></tfoot></table></div></div>';

    $$('#segcl button').forEach(function (b) { b.onclick = function () { st.relClasse = b.dataset.c; render(); }; });
    $('#r-de').onchange = function () { st.relDe = this.value; render(); };
    $('#r-ate').onchange = function () { st.relAte = this.value; render(); };
    $('#csv').onclick = function () {
      var out = [['Categoria'].concat(meses).concat(['Total'])];
      linhas.forEach(function (l) { out.push([l.cat].concat(l.valores).concat([l.total])); });
      baixarCSV(out, 'relatorio-' + classe + '.csv');
    };

    C.ranking($('#ch-rk'), { itens: linhas.map(function (l) { return { cat: l.cat, valor: l.total }; }), cor: cor, total: total, max: 12 });
    C.barras($('#ch-mm'), {
      labels: meses.map(function (m) { return E.mesLabel(m); }),
      titulos: meses.map(function (m) { return E.mesLabelLongo(m); }),
      series: [{
        nome: classe === 'receita' ? 'Receitas' : 'Despesas', cor: cor,
        dados: meses.map(function (m, i) { return E.r2(linhas.reduce(function (a, l) { return a + l.valores[i]; }, 0)); })
      }], altura: 240
    });
  }

  /* ========================================================= TELA · METAS === */
  function viewMetas(root) {
    var mRef = db.meta.mesRef;
    var serieEp = E.saldoDevedorPorEmprestimo(db);
    var K = E.carteiraConsignado(db, mRef);
    var nAmort = db.emprestimos.reduce(function (a, ep) { return a + (ep.amortizacoes || []).length; }, 0);
    var totParcAbat = db.emprestimos.reduce(function (a, ep) {
      return a + (ep.amortizacoes || []).reduce(function (b, z) { return b + (z.parcelas || []).length; }, 0);
    }, 0);
    var PALEP = ['var(--s1)', 'var(--s4)', 'var(--s3)', 'var(--s7)', 'var(--s6)', 'var(--s2)'];
    var legenda = serieEp.linhas.map(function (l, i) { return { nome: l.cod, cor: PALEP[i % PALEP.length] }; })
      .concat([{ nome: 'Total da carteira', cor: 'var(--s5)' }]);

    root.innerHTML = topo('Metas & consignados',
      'Saldo devedor calculado como o banco calcula: cada parcela em aberto descontada pela taxa do contrato até o dia do vencimento.',
      '<button class="btn" id="nmeta">+ Meta</button><button class="btn" id="nemp">+ Contrato</button>' +
      '<button class="btn pri" id="nova-amort2">+ Amortização</button>') +

      '<div class="card" style="margin-bottom:14px"><h3>Metas de poupança</h3>' +
      (db.metas.length ? '<div class="grid g-3">' + db.metas.map(function (mt, i) {
        var x = E.meta(db, mt);
        return '<div style="padding:14px;border:1px solid var(--stroke);border-radius:12px;background:var(--surface-1)" data-i="' + i + '">' +
          '<div style="display:flex;justify-content:space-between;align-items:start;gap:8px">' +
          '<b style="font-size:14.5px">' + h(mt.nome) + '</b>' +
          '<span><button class="iconbtn" data-emed>✎</button><button class="iconbtn del" data-emdl>✕</button></span></div>' +
          '<div class="num" style="font-size:20px;margin:8px 0 2px">' + E.brl(mt.guardado) + '</div>' +
          '<div style="font-size:12px;color:var(--ink-3);margin-bottom:9px">de ' + E.brl(mt.alvo) + ' até ' + E.mesLabel(mt.prazo) + '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + (x.pct * 100).toFixed(1) + '%"></div></div>' +
          '<div style="display:flex;justify-content:space-between;font-size:12px;margin-top:8px;color:var(--ink-2)">' +
          '<span>' + E.pct(x.pct) + ' concluído</span>' +
          '<span>' + (x.semAlvo ? '<span class="tag am">defina o valor alvo</span>' : x.concluida ? '<span class="tag ok">meta atingida</span>' : x.vencida ? '<span class="tag run">prazo vencido</span>' : x.mesesRestantes + ' meses · ' + E.brl(x.aporte) + '/mês') + '</span></div>' +
          '</div>';
      }).join('') + '</div>' : '<div class="empty">Nenhuma meta cadastrada.</div>') + '</div>' +

      '<div class="grid g-kpi" style="margin-bottom:14px">' +
      kpi('Saldo devedor hoje', E.brl(K.quitar), K.ativos + ' contrato(s) ativo(s) · ' + E.brl(K.parcelaMes) + '/mês em folha', 'acc-out') +
      kpi('A pagar nominal', E.brl(K.nominal), K.abertas + ' parcela(s) em aberto', 'acc-am') +
      kpi('Economia se quitar hoje', E.brl(K.nominal - K.quitar), 'Juros futuros que deixam de correr', 'acc-in') +
      kpi('Amortizado até aqui', E.brl(K.amortizado), nAmort + ' amortização(ões) · ' + totParcAbat + ' parcela(s) abatida(s)', 'acc-in') +
      '</div>' +

      /* ---------------- demonstrativo ---------------- */
      '<div class="card" style="margin-bottom:14px"><h3>Demonstrativo de créditos consignados ' +
      '<span class="tag">' + E.mesLabel(mRef) + '</span></h3>' +
      '<div class="tw"><table class="tight"><thead><tr>' +
      '<th>Cód.</th><th>Descrição</th><th class="r">Original</th><th class="c">Parc.</th>' +
      '<th class="r">Parcela</th><th class="r">Total</th>' +
      '<th class="r">Taxa<br>a.m.</th><th class="r">Taxa<br>a.a.</th><th class="c">Pagas</th>' +
      '<th class="r">Nominal</th><th class="r">Quitar hoje</th><th class="r">Economia</th>' +
      '<th class="r">Saldo devedor</th><th></th></tr></thead><tbody>' +
      (db.emprestimos.length ? db.emprestimos.map(function (ep, i) {
        var x = E.emprestimo(db, ep, mRef);
        return '<tr data-i="' + i + '"' + (x.quitado ? ' style="opacity:.55"' : '') + '>' +
          '<td class="num"><b>' + h(ep.cod) + '</b></td>' +
          '<td class="desc"><b>' + h(ep.desc) + '</b>' +
          (ep.contrato ? '<br><span style="color:var(--ink-3);font-size:11px;font-family:var(--mono)">' + h(ep.contrato) + '</span>' : '') + '</td>' +
          '<td class="r num">' + E.brl(ep.principal) + '</td>' +
          '<td class="c num">' + ep.n + '</td>' +
          '<td class="r num">' + E.brl(ep.parcela) + '</td>' +
          '<td class="r num">' + E.brl(x.totalContrato) + '</td>' +
          '<td class="r num" title="' + (x.oficial ? 'taxa nominal do contrato (extrato do banco)' : 'taxa deduzida das parcelas (TIR)') + '">' +
          (x.taxaMes * 100).toFixed(2).replace('.', ',') + '%' + (x.oficial ? '' : ' <span style="color:var(--warn)">*</span>') + '</td>' +
          '<td class="r num" title="taxa efetiva anual — juros sobre juros dos 12 meses">' + (x.taxaAno * 100).toFixed(2).replace('.', ',') + '%</td>' +
          '<td class="c num">' + x.pagas + '/' + ep.n +
          (x.antecipadas ? '<br><span class="tag am" title="parcelas quitadas por amortização extra">' + x.antecipadas + ' ant.</span>' : '') + '</td>' +
          '<td class="r num">' + E.brl(x.nominalRestante) + '</td>' +
          '<td class="r num"><b>' + E.brl(x.quitarHoje) + '</b></td>' +
          '<td class="r"><span class="num pos">' + E.brl(x.economia) + '</span></td>' +
          '<td class="r num"><b>' + E.brl(x.saldoDevedor) + '</b></td>' +
          '<td class="c actions" style="width:66px"><button class="iconbtn" data-eped>✎</button><button class="iconbtn del" data-epdl>✕</button></td></tr>';
      }).join('') +
        '<tr style="border-top:2px solid var(--stroke-hard)">' +
        '<td colspan="2"><b>TOTAL DA CARTEIRA</b></td>' +
        '<td class="r num"><b>' + E.brl(K.original) + '</b></td>' +
        '<td class="c num"><b>' + K.parcelasTotais + '</b></td>' +
        '<td class="r num"><b>' + E.brl(K.parcelaMes) + '</b></td>' +
        '<td class="r num"><b>' + E.brl(K.totalContrato) + '</b></td>' +
        '<td colspan="2"></td>' +
        '<td class="c num"><b>' + K.pagas + '/' + K.parcelasTotais + '</b></td>' +
        '<td class="r num"><b>' + E.brl(K.nominal) + '</b></td>' +
        '<td class="r num"><b>' + E.brl(K.quitar) + '</b></td>' +
        '<td class="r num pos"><b>' + E.brl(K.nominal - K.quitar) + '</b></td>' +
        '<td class="r num"><b>' + E.brl(K.saldo) + '</b></td><td></td></tr>'
        : '<tr><td colspan="14" class="empty">Nenhum contrato cadastrado.</td></tr>') +
      '</tbody></table></div>' +

      '<div class="alert info" style="margin-top:12px"><span class="ic">ⓘ</span><div>' +
      '<b>Como ler cada coluna.</b><br>' +
      '<b>Original</b> — o dinheiro que efetivamente caiu na conta. O IOF entra no valor financiado, não aqui.<br>' +
      '<b>Total</b> — parcela × prazo: tudo o que o contrato custa se seguir até o fim.<br>' +
      '<b>Taxa a.m.</b> — a taxa mensal do contrato (a mesma do extrato do banco). ' +
      '<b>Taxa a.a.</b> — a taxa <i>efetiva</i> anual, ou seja (1 + a.m.)¹² − 1: é maior que 12 × a taxa mensal porque os juros incidem sobre juros.<br>' +
      '<b>Pagas</b> — parcelas já liquidadas; o selo <span class="tag am">ant.</span> mostra quantas dessas saíram por amortização extra, e não pelo desconto em folha.<br>' +
      '<b>Nominal</b> — <u>soma bruta das parcelas que ainda faltam</u> (valor da parcela × parcelas em aberto). É valor de face: carrega dentro de si os juros de todos os meses futuros, juros que <i>ainda não correram</i>. Serve para responder "quanto ainda vai sair do meu bolso até o fim", e <b>nunca</b> é o preço para quitar.<br>' +
      '<b>Quitar hoje</b> — o preço real da liquidação antecipada na data de hoje: cada parcela em aberto trazida a valor presente pela taxa do contrato até o dia em que venceria. É exatamente a conta que o banco faz no Documento Descritivo de Crédito.<br>' +
      '<b>Economia</b> — Nominal − Quitar hoje: os juros que deixam de correr se o contrato for liquidado agora.<br>' +
      '<b>Saldo devedor</b> — o mesmo valor presente, mas medido no mês de referência do sistema (' + E.mesLabel(mRef) + '). ' +
      'Coincide com "Quitar hoje" quando o mês de referência é o mês corrente; nos meses passados mostra o que a dívida era naquela data. ' +
      'É essa a série desenhada no gráfico de evolução.' +
      (db.emprestimos.some(function (ep) { return !(ep.taxaMes > 0); })
        ? '<br><span style="color:var(--warn)">*</span> taxa deduzida das próprias parcelas (TIR) — cadastre a taxa oficial do extrato para bater centavo a centavo.' : '') +
      '</div></div></div>' +

      /* ---------------- resumo por contrato ---------------- */
      (db.emprestimos.length ? '<div class="card" style="margin-bottom:14px"><h3>Resumo e evolução de cada contrato</h3>' +
        '<div class="grid g-2">' + db.emprestimos.map(function (ep, i) {
          var x = E.emprestimo(db, ep, mRef);
          var amorts = (ep.amortizacoes || []).slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; });
          var nParc = amorts.reduce(function (a, z) { return a + (z.parcelas || []).length; }, 0);
          var linha = function (rot, val, dica) {
            return '<tr><td style="color:var(--ink-3)"' + (dica ? ' title="' + h(dica) + '"' : '') + '>' + rot + '</td>' +
              '<td class="r num">' + val + '</td></tr>';
          };
          return '<div style="padding:15px;border:1px solid var(--stroke);border-radius:12px;background:var(--surface-1)">' +
            '<div style="display:flex;justify-content:space-between;gap:8px;align-items:start">' +
            '<div><b style="font-size:15px">' + h(ep.cod) + '</b> ' +
            '<span style="color:var(--ink-3);font-size:12px">' + h(ep.desc) + '</span>' +
            (ep.contrato ? '<div style="color:var(--ink-3);font-size:11px;font-family:var(--mono)">contrato ' + h(ep.contrato) + '</div>' : '') + '</div>' +
            (x.quitado ? '<span class="tag ok">quitado</span>' : '<span class="tag run">em curso</span>') + '</div>' +
            '<div class="num" style="font-size:24px;margin-top:10px">' + E.brl(x.saldoDevedor) + '</div>' +
            '<div style="font-size:11.5px;color:var(--ink-3);margin-bottom:9px">saldo devedor em ' + E.mesLabel(mRef) + ' · quitar hoje ' + E.brl(x.quitarHoje) + '</div>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + (x.pctPago * 100).toFixed(1) + '%"></div></div>' +
            '<div style="font-size:11.5px;color:var(--ink-2);margin-top:7px">' + E.pct(x.pctPago) + ' do contrato liquidado — ' +
            x.pagas + ' de ' + ep.n + ' parcelas</div>' +
            '<table class="tight" style="margin-top:12px;font-size:12px"><tbody>' +
            linha('Valor recebido', E.brl(ep.principal)) +
            linha('IOF financiado', E.brl(x.iof), 'diferença entre o valor financiado e o que caiu na conta') +
            linha('Valor financiado', E.brl(x.financiado), 'base sobre a qual a taxa incide') +
            linha('Parcela / prazo', E.brl(ep.parcela) + ' × ' + ep.n) +
            linha('1ª parcela', E.dataLabel(E.vencimento(ep, 1)) + '/' + ep.mes1.slice(2, 4)) +
            linha('Fim original', E.mesLabel(x.ultima)) +
            linha('Taxa', (x.taxaMes * 100).toFixed(2).replace('.', ',') + '% a.m. · ' + (x.taxaAno * 100).toFixed(2).replace('.', ',') + '% a.a.') +
            linha('Custo total do crédito', E.brl(x.custoTotal), 'total pago menos o valor recebido') +
            '<tr><td colspan="2" style="padding-top:8px"></td></tr>' +
            linha('Pagas pelo calendário', String(x.pagasCalendario)) +
            linha('Antecipadas por amortização', String(x.antecipadas)) +
            linha('Em aberto', x.restantes + (x.restantes ? ' <span style="color:var(--ink-3)">(nº ' + x.primeiraAberta + '–' + x.ultimaAberta + ')</span>' : '')) +
            linha('Próximo vencimento', x.proximoVenc ? E.dataLabel(x.proximoVenc) + '/' + x.proximoVenc.slice(2, 4) : '—') +
            linha('Nominal a pagar', E.brl(x.nominalRestante)) +
            linha('Economia se quitar', '<span class="pos">' + E.brl(x.economia) + '</span>') +
            linha('Amortizado (desembolso)', E.brl(x.amortizado) + ' <span style="color:var(--ink-3)">· ' + amorts.length + ' evento(s), ' + nParc + ' parc.</span>') +
            '</tbody></table></div>';
        }).join('') + '</div></div>' : '') +

      /* ---------------- amortizações ---------------- */
      '<div class="card" style="margin-bottom:14px"><h3>Amortizações registradas <span class="tag">' + nAmort + '</span></h3>' +
      '<div class="inline" style="margin-bottom:12px"><button class="btn pri" id="nova-amort">+ Registrar amortização</button>' +
      '<div class="spacer"></div><div class="hint" style="margin:0">Toda amortização abate as <b>últimas</b> parcelas do contrato, de trás para a frente, e entra como saída no fluxo de caixa do mês.</div></div>' +
      '<div id="lista-amort"></div></div>' +

      /* ---------------- gráfico ---------------- */
      '<div class="card"><h3>Evolução do saldo devedor</h3>' +
      '<div class="hint" style="margin:0 0 8px">Uma linha por contrato e a linha grossa do total da carteira. ' +
      'Cada ponto é o saldo devedor daquele mês — valor presente das parcelas ainda em aberto. As amortizações aparecem como degraus.</div>' +
      C.legenda(legenda) + '<div id="ch-dv"></div></div>';

    $('#nmeta').onclick = function () { formMeta(-1); };
    $('#nemp').onclick = function () { formEmprestimo(-1); };
    $('#nova-amort2').onclick = function () { formAmortizacao(-1, -1); };
    $$('[data-emed]').forEach(function (b) { b.onclick = function () { formMeta(+b.closest('[data-i]').dataset.i); }; });
    $$('[data-emdl]').forEach(function (b) {
      b.onclick = function () {
        var i = +b.closest('[data-i]').dataset.i;
        confirmar('Excluir a meta "' + db.metas[i].nome + '"?', function () { db.metas.splice(i, 1); S.touch('Excluiu meta'); toast('Meta excluída'); });
      };
    });
    $$('[data-eped]').forEach(function (b) { b.onclick = function () { formEmprestimo(+b.closest('tr').dataset.i); }; });
    $$('[data-epdl]').forEach(function (b) {
      b.onclick = function () {
        var i = +b.closest('tr').dataset.i;
        confirmar('Excluir o contrato "' + db.emprestimos[i].desc + '"?', function () { db.emprestimos.splice(i, 1); S.touch('Excluiu empréstimo'); toast('Contrato excluído'); });
      };
    });

    /* ---------- lista completa de amortizações ---------- */
    var amortListaEl = $('#lista-amort');
    var linhasAmort = [];
    db.emprestimos.forEach(function (ep, i) {
      (ep.amortizacoes || []).forEach(function (a, ai) { linhasAmort.push({ ep: ep, ei: i, ai: ai, a: a }); });
    });
    linhasAmort.sort(function (x, y) { return x.a.data < y.a.data ? 1 : x.a.data > y.a.data ? -1 : 0; });
    if (linhasAmort.length) {
      amortListaEl.innerHTML = '<div class="tw"><table><thead><tr>' +
        '<th class="c">Data</th><th>Contrato</th><th class="r">Valor pago</th>' +
        '<th class="c">Qtd.</th><th>Parcelas abatidas</th><th class="r">Nominal abatido</th><th>Observação</th><th></th></tr></thead><tbody>' +
        linhasAmort.map(function (r) {
          var ps = (r.a.parcelas || []).slice().sort(function (p, q) { return p - q; });
          return '<tr data-i="' + r.ei + '" data-ai="' + r.ai + '">' +
            '<td class="c num">' + E.dataLabel(r.a.data) + '/' + r.a.data.slice(2, 4) + '</td>' +
            '<td><b>' + h(r.ep.cod) + '</b> <span style="color:var(--ink-3)">' + h(r.ep.desc) + '</span></td>' +
            '<td class="r num">' + E.brl(r.a.valor) + '</td>' +
            '<td class="c num">' + ps.length + '</td>' +
            '<td class="num" style="font-size:12px">' + (ps.length ? faixaParcelas(ps) : '<span style="color:var(--ink-3)">—</span>') + '</td>' +
            '<td class="r num">' + E.brl(ps.length * r.ep.parcela) + '</td>' +
            '<td style="color:var(--ink-2);font-size:12.5px">' + h(r.a.descricao || '—') + '</td>' +
            '<td class="c actions" style="width:74px"><button class="iconbtn" data-aed>✎</button><button class="iconbtn del" data-adl>✕</button></td></tr>';
        }).join('') +
        '<tr style="border-top:2px solid var(--stroke-hard)"><td colspan="2"><b>TOTAL</b></td>' +
        '<td class="r num"><b>' + E.brl(K.amortizado) + '</b></td>' +
        '<td class="c num"><b>' + totParcAbat + '</b></td><td colspan="4"></td></tr>' +
        '</tbody></table></div>';
      $$('[data-aed]', amortListaEl).forEach(function (b) { b.onclick = function () { var tr = b.closest('tr'); formAmortizacao(+tr.dataset.i, +tr.dataset.ai); }; });
      $$('[data-adl]', amortListaEl).forEach(function (b) {
        b.onclick = function () {
          var tr = b.closest('tr'), ei = +tr.dataset.i, ai = +tr.dataset.ai, a = db.emprestimos[ei].amortizacoes[ai];
          confirmar('Remover a amortização de ' + E.brl(a.valor) + ' em ' + E.dataLabel(a.data) + '? O lançamento correspondente também sai do fluxo de caixa.', function () {
            if (a.lancId) db.lancamentos = db.lancamentos.filter(function (l) { return l.id !== a.lancId; });
            db.emprestimos[ei].amortizacoes.splice(ai, 1);
            S.touch('Removeu amortização'); toast('Amortização removida'); render();
          });
        };
      });
    } else {
      amortListaEl.innerHTML = '<div class="empty">Nenhuma amortização registrada.</div>';
    }
    $('#nova-amort').onclick = function () { formAmortizacao(-1, -1); };

    /* ---------- gráfico: uma linha por contrato + total ---------- */
    C.linha($('#ch-dv'), {
      labels: serieEp.meses.map(function (m) { return E.mesLabel(m); }),
      titulos: serieEp.meses.map(function (m) { return E.mesLabelLongo(m); }),
      series: serieEp.linhas.map(function (l, i) {
        return { nome: l.cod, cor: PALEP[i % PALEP.length], dados: l.dados, espessura: 1.9, rotular: true };
      }).concat([{ nome: 'Total', cor: 'var(--s5)', dados: serieEp.total, espessura: 3.2, rotular: true }]),
      rotulos: true, altura: 330, zeroFim: true
    });
  }
  /** "14–21, 30, 40–72" a partir de uma lista de números */
  function faixaParcelas(ps) {
    var out = [], ini = ps[0], ant = ps[0];
    for (var i = 1; i <= ps.length; i++) {
      if (i < ps.length && ps[i] === ant + 1) { ant = ps[i]; continue; }
      out.push(ini === ant ? String(ini) : ini + '–' + ant);
      ini = ant = ps[i];
    }
    return out.join(', ');
  }
  function formMeta(i) {
    var m = i >= 0 ? db.metas[i] : null;
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld" style="grid-column:1/-1"><label>Nome da meta</label><input id="m-n" value="' + h(m ? m.nome : '') + '" placeholder="ex.: Reserva de emergência"></div>' +
      '<div class="fld"><label>Valor alvo (R$)</label><input id="m-a" inputmode="decimal" value="' + (m ? m.alvo.toFixed(2).replace('.', ',') : '') + '"></div>' +
      '<div class="fld"><label>Já guardado (R$)</label><input id="m-g" inputmode="decimal" value="' + (m ? m.guardado.toFixed(2).replace('.', ',') : '0,00') + '"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Prazo</label><select id="m-p">' + selMeses(m ? m.prazo : E.addMes(db.meta.mesRef, 12)) + '</select></div></div>';
    modal(i >= 0 ? 'Editar meta' : 'Nova meta', corpo, function (o) {
      var n = $('#m-n', o).value.trim(); if (!n) { toast('Informe o nome.', 'err'); return false; }
      var obj = { nome: n, alvo: parseVal($('#m-a', o).value), guardado: parseVal($('#m-g', o).value), prazo: $('#m-p', o).value };
      if (m) Object.keys(obj).forEach(function (k) { m[k] = obj[k]; }); else db.metas.push(obj);
      S.touch('Meta salva: ' + n); toast('Meta salva');
    });
  }
  function formEmprestimo(i) {
    var e = i >= 0 ? db.emprestimos[i] : null;
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld"><label>Código</label><input id="e-c" value="' + h(e ? e.cod : 'EP ' + (db.emprestimos.length + 1)) + '"></div>' +
      '<div class="fld"><label>Nº do contrato</label><input id="e-ct" value="' + h(e ? (e.contrato || '') : '') + '" placeholder="ex.: 3078321878"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Descrição</label><input id="e-d" value="' + h(e ? e.desc : '') + '" placeholder="ex.: Consignado Itaú"></div>' +
      '<div class="fld"><label>Valor recebido na conta (R$)</label><input id="e-p" inputmode="decimal" value="' + (e ? e.principal.toFixed(2).replace('.', ',') : '') + '"></div>' +
      '<div class="fld"><label>Valor financiado c/ IOF (R$)</label><input id="e-f" inputmode="decimal" value="' + (e && e.financiado ? e.financiado.toFixed(2).replace('.', ',') : '') + '" placeholder="deixe vazio se for igual"></div>' +
      '<div class="fld"><label>Nº de parcelas</label><input type="number" id="e-n" min="1" max="480" value="' + (e ? e.n : 36) + '"></div>' +
      '<div class="fld"><label>Valor da parcela (R$)</label><input id="e-v" inputmode="decimal" value="' + (e ? e.parcela.toFixed(2).replace('.', ',') : '') + '"></div>' +
      '<div class="fld"><label>Mês da 1ª parcela</label><select id="e-m">' + selMeses(e ? e.mes1 : db.meta.mesRef) + '</select></div>' +
      '<div class="fld"><label>Dia do desconto em folha</label><input type="number" id="e-dv" min="1" max="28" value="' + (e ? (e.diaVenc || 7) : 7) + '"></div>' +
      '<div class="fld"><label>Taxa mensal do contrato (%)</label><input id="e-t" inputmode="decimal" value="' + (e && e.taxaMes ? (e.taxaMes * 100).toFixed(2).replace('.', ',') : '') + '" placeholder="ex.: 1,47 — do extrato"></div>' +
      '<div class="fld"><label>Mês em que o crédito caiu</label><select id="e-mc">' + selMeses(e ? E.mesCredito(e) : E.addMes(db.meta.mesRef, -1)) + '</select></div>' +
      '<div class="hint" style="grid-column:1/-1">A <b>taxa mensal</b> é a "taxa de juros mensal nominal" do Documento Descritivo de Crédito. ' +
      'Com ela preenchida, o saldo devedor e o valor de quitação batem centavo a centavo com o extrato do banco. ' +
      'Se ficar em branco, o sistema deduz a taxa das próprias parcelas e o número fica aproximado.</div>' +
      '</div><div class="hint" id="e-prev" style="margin-top:12px"></div>';
    var ovl = modal(i >= 0 ? 'Editar contrato' : 'Novo contrato de consignado', corpo, function (o) {
      var d = $('#e-d', o).value.trim(); if (!d) { toast('Informe a descrição.', 'err'); return false; }
      var pr = parseVal($('#e-p', o).value), fi = parseVal($('#e-f', o).value);
      var tx = parseVal($('#e-t', o).value);
      var obj = {
        cod: $('#e-c', o).value, contrato: $('#e-ct', o).value.trim(), desc: d,
        principal: pr, financiado: fi > 0 ? fi : pr,
        n: +$('#e-n', o).value, parcela: parseVal($('#e-v', o).value),
        mes1: $('#e-m', o).value, diaVenc: Math.min(28, Math.max(1, +$('#e-dv', o).value || 7)),
        taxaMes: tx > 0 ? E.r2(tx * 10000) / 1000000 : 0,
        mesCredito: $('#e-mc', o).value
      };
      if (e) { Object.keys(obj).forEach(function (k) { e[k] = obj[k]; }); if (!e.amortizacoes) e.amortizacoes = []; }
      else { obj.amortizacoes = []; db.emprestimos.push(obj); }
      S.touch('Contrato salvo: ' + d); toast('Contrato salvo'); render();
    });
    var prev = function () {
      var pr = parseVal($('#e-p', ovl).value), fi = parseVal($('#e-f', ovl).value) || pr;
      var pmt = parseVal($('#e-v', ovl).value), n = +$('#e-n', ovl).value, tx = parseVal($('#e-t', ovl).value);
      if (!(pmt && n)) { $('#e-prev', ovl).innerHTML = ''; return; }
      var i2 = tx > 0 ? tx / 100 : E.taxaImplicita(fi, pmt, n);
      $('#e-prev', ovl).innerHTML =
        'Taxa usada: <b>' + (i2 * 100).toFixed(2).replace('.', ',') + '% a.m.</b> · ' +
        (((Math.pow(1 + i2, 12) - 1) * 100).toFixed(2).replace('.', ',')) + '% a.a. efetiva · ' +
        ((i2 * 12 * 100).toFixed(2).replace('.', ',')) + '% a.a. nominal' +
        (tx > 0 ? ' <span class="tag ok">oficial</span>' : ' <span class="tag am">deduzida (TIR)</span>') +
        '<br>Total do contrato <b>' + E.brl(pmt * n) + '</b> · custo do crédito <b>' + E.brl(pmt * n - pr) + '</b>' +
        (fi > pr ? ' · IOF financiado ' + E.brl(fi - pr) : '');
    };
    ['#e-p', '#e-f', '#e-v', '#e-n', '#e-t'].forEach(function (s) { $(s, ovl).oninput = prev; });
    prev();
  }
  function formAmortizacao(ei, ai) {
    if (!db.emprestimos.length) { toast('Cadastre um empréstimo primeiro.', 'err'); return; }
    var epIni = ei >= 0 ? ei : 0;
    var a = (ei >= 0 && ai >= 0) ? db.emprestimos[ei].amortizacoes[ai] : null;
    var sel = {};                                  // parcelas marcadas nesta amortização
    if (a) (a.parcelas || []).forEach(function (p) { sel[p] = 1; });

    var corpo =
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld" style="grid-column:1/-1"><label>Contrato</label><select id="a-ep"' + (a ? ' disabled' : '') + '>' +
      opts(db.emprestimos.map(function (e, i) { return { v: String(i), l: e.cod + ' — ' + e.desc }; }), String(epIni)) +
      '</select></div>' +
      '<div class="fld"><label>Data do pagamento</label><input type="date" id="a-d" value="' + (a ? a.data : E.hoje()) + '"></div>' +
      '<div class="fld"><label>Quantas parcelas abater</label><input type="number" id="a-q" min="0" step="1" value="' + (a ? (a.parcelas || []).length : 0) + '"></div>' +
      '</div>' +
      '<div class="hint" style="margin:12px 0 6px">A amortização quita as <b>últimas</b> parcelas do contrato, de trás para a frente. ' +
      'Escolha a quantidade acima ou clique numa parcela abaixo — tudo dela até o fim do contrato entra no abatimento.</div>' +
      '<div id="a-grade" class="parc-grid"></div>' +
      '<div id="a-resumo" class="hint" style="margin-top:10px"></div>' +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px;margin-top:12px">' +
      '<div class="fld"><label>Valor efetivamente pago (R$)</label><input id="a-v" inputmode="decimal" value="' + (a ? a.valor.toFixed(2).replace('.', ',') : '') + '"></div>' +
      '<div class="fld"><label>Observação</label><input id="a-desc" value="' + h(a ? (a.descricao || '') : 'Amortização extra') + '"></div>' +
      '</div>' +
      '<div class="hint" style="margin-top:8px">O valor sugerido é o valor presente das parcelas escolhidas. ' +
      'Se o banco cobrou outro número, digite o valor do comprovante — ele é o que entra no fluxo de caixa.</div>';

    var ovl = modal(a ? 'Editar amortização' : 'Registrar amortização', corpo, function (o) {
      var eix = +$('#a-ep', o).value;
      var ep2 = db.emprestimos[eix];
      var data = $('#a-d', o).value, val = parseVal($('#a-v', o).value), desc = $('#a-desc', o).value.trim();
      var parcelas = Object.keys(sel).map(Number).sort(function (x, y) { return x - y; });
      if (!data) { toast('Informe a data do pagamento.', 'err'); return false; }
      if (!val || val <= 0) { toast('Informe o valor pago.', 'err'); return false; }
      if (!parcelas.length) { toast('Selecione quantas parcelas foram abatidas.', 'err'); return false; }

      if (!ep2.amortizacoes) ep2.amortizacoes = [];
      // o campo legado deixa de valer assim que existe amortização detalhada
      if (ep2.antecipadas) ep2.antecipadas = 0;

      var cat = 'Amortização ' + ep2.cod;
      if (db.categorias.despesa.indexOf(cat) < 0) db.categorias.despesa.push(cat);
      var rotulo = 'Amortização ' + ep2.cod + (parcelas.length ? ' (parcelas ' + faixaParcelas(parcelas) + ')' : '');

      if (a) {
        a.data = data; a.valor = E.r2(val); a.descricao = desc; a.parcelas = parcelas;
        var lan = db.lancamentos.filter(function (l) { return l.id === a.lancId; })[0];
        if (lan) { lan.data = data; lan.valor = -E.r2(val); lan.desc = rotulo; lan.cat = cat; }
        else {
          var nid = S.novoId('l');
          db.lancamentos.push({ id: nid, data: data, desc: rotulo, valor: -E.r2(val), cat: cat, conta: 'Banco', rec: false });
          a.lancId = nid;
        }
      } else {
        var id2 = S.novoId('l');
        db.lancamentos.push({ id: id2, data: data, desc: rotulo, valor: -E.r2(val), cat: cat, conta: 'Banco', rec: false });
        ep2.amortizacoes.push({ data: data, valor: E.r2(val), descricao: desc, parcelas: parcelas, lancId: id2 });
      }
      S.touch('Amortização ' + ep2.cod); toast('Amortização registrada no fluxo de caixa'); render();
    }, 'Salvar');

    /* ---- estado e redesenho da grade de parcelas ---- */
    function epAtual() { return db.emprestimos[+$('#a-ep', ovl).value]; }
    function mesRefAmort() {
      var d = $('#a-d', ovl).value;
      return d ? d.slice(0, 7) : db.meta.mesRef;
    }
    /** parcelas disponíveis para abater: em aberto no mês da amortização (as desta edição voltam a contar) */
    function disponiveis() {
      var ep2 = epAtual(), m = mesRefAmort();
      var k = E.parcelasCalendario(ep2, m);
      var outras = {};
      (ep2.amortizacoes || []).forEach(function (z) {
        if (a && z === a) return;
        if (z.data.slice(0, 7) > m) return;
        (z.parcelas || []).forEach(function (p) { outras[p] = 1; });
      });
      var out = [];
      for (var j = ep2.n; j >= 1; j--) {
        out.push({ n: j, mes: E.addMes(ep2.mes1, j - 1), estado: j <= k ? 'calendario' : (outras[j] ? 'outra' : 'livre') });
      }
      return out;
    }
    function aplicarQtd(q) {
      var livres = disponiveis().filter(function (p) { return p.estado === 'livre'; }); // já em ordem decrescente
      sel = {};
      livres.slice(0, Math.max(0, q)).forEach(function (p) { sel[p.n] = 1; });
      desenhar();
    }
    function desenhar() {
      var ep2 = epAtual(), m = mesRefAmort();
      var lst = disponiveis();
      var dataAm = $('#a-d', ovl).value || E.hoje();
      $('#a-grade', ovl).innerHTML = lst.map(function (p) {
        var cls = p.estado === 'calendario' ? 'pc pago' : p.estado === 'outra' ? 'pc ant' : (sel[p.n] ? 'pc on' : 'pc');
        var tit = p.estado === 'calendario' ? 'parcela já paga pelo calendário ('
          : p.estado === 'outra' ? 'já antecipada em outra amortização (' : 'vence em (';
        return '<button type="button" class="' + cls + '" data-p="' + p.n + '" title="' + tit + E.mesLabel(p.mes) + ')">' +
          p.n + '<i>' + E.mesLabel(p.mes) + '</i></button>';
      }).join('');
      $$('.pc', ovl).forEach(function (b) {
        b.onclick = function () {
          var n = +b.dataset.p, livres = lst.filter(function (p) { return p.estado === 'livre'; });
          if (livres.every(function (p) { return p.n !== n; })) return;
          var alvo = livres.filter(function (p) { return p.n >= n; });
          var jaTodas = alvo.every(function (p) { return sel[p.n]; }) && Object.keys(sel).length === alvo.length;
          sel = {};
          if (!jaTodas) alvo.forEach(function (p) { sel[p.n] = 1; });
          $('#a-q', ovl).value = Object.keys(sel).length;
          desenhar();
        };
      });

      var ps = Object.keys(sel).map(Number).sort(function (x, y) { return x - y; });
      var nominal = E.r2(ps.length * ep2.parcela);
      var pv = E.vpParcelas(ep2, ps, dataAm);
      var abertasDepois = lst.filter(function (p) { return p.estado === 'livre' && !sel[p.n]; }).length;
      var restaPV = E.vpParcelas(ep2, lst.filter(function (p) { return p.estado === 'livre' && !sel[p.n]; })
        .map(function (p) { return p.n; }), dataAm);
      $('#a-resumo', ovl).innerHTML = ps.length
        ? '<b>' + ps.length + ' parcela(s) abatida(s)</b> — nº ' + faixaParcelas(ps) +
        '<br>Nominal ' + E.brl(nominal) + ' · valor presente em ' + E.dataLabel(dataAm) + ' <b>' + E.brl(pv) + '</b> · desconto ' + E.brl(nominal - pv) +
        '<br>Depois desta amortização restam <b>' + abertasDepois + '</b> parcela(s) em aberto e o saldo devedor do contrato cai para <b>' + E.brl(restaPV) + '</b>.'
        : '<span style="color:var(--ink-3)">Nenhuma parcela selecionada — informe a quantidade ou clique numa parcela abaixo.</span>';
      var campo = $('#a-v', ovl);
      if (!campo.dataset.tocado && ps.length) campo.value = pv.toFixed(2).replace('.', ',');
    }

    $('#a-q', ovl).oninput = function () { aplicarQtd(+this.value || 0); };
    $('#a-ep', ovl).onchange = function () { sel = {}; $('#a-q', ovl).value = 0; desenhar(); };
    $('#a-d', ovl).onchange = desenhar;
    $('#a-v', ovl).oninput = function () { this.dataset.tocado = '1'; };
    if (a) $('#a-v', ovl).dataset.tocado = '1';
    desenhar();
  }

  /* ===================================================== TELA · AUDITORIA === */
  function viewAuditoria(root) {
    var av = E.diagnostico(db);
    var g = { crit: [], warn: [], info: [] };
    av.forEach(function (a) { g[a.n].push(a); });
    var casc = E.cascata(db);
    var confSoma = E.r2(casc.reduce(function (a, c) { return a + c.resultado; }, 0) + db.meta.saldoInicial);
    var confFinal = casc.length ? casc[casc.length - 1].saldoFinal : 0;

    function bloco(t, arr, cls, icone) {
      return '<div class="card" style="margin-bottom:14px"><h3>' + icone + ' ' + t + ' <span class="tag">' + arr.length + '</span></h3>' +
        (arr.length ? '<div class="tw"><table><tbody>' + arr.map(function (a) {
          return '<tr><td style="width:38%"><b>' + h(a.t) + '</b></td><td style="color:var(--ink-2)">' + h(a.d) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<div class="empty">Nada a corrigir aqui. ✓</div>') + '</div>';
    }

    root.innerHTML = topo('Auditoria automática',
      'Roda a cada carregamento sobre a base inteira — ' + db.lancamentos.length + ' lançamentos, ' + E.meses(db).length + ' meses.') +

      '<div class="grid g-kpi" style="margin-bottom:14px">' +
      kpi('Conferência da cascata', E.brl(E.r2(confSoma - confFinal)), 'Deve ser R$ 0,00', Math.abs(confSoma - confFinal) < 0.005 ? 'acc-in' : 'acc-out') +
      kpi('Críticos', String(g.crit.length), 'exigem correção', g.crit.length ? 'acc-out' : 'acc-in') +
      kpi('Atenção', String(g.warn.length), 'vale conferir', 'acc-am') +
      kpi('Observações', String(g.info.length), 'informativos', 'acc-br') +
      '</div>' +

      bloco('Críticos', g.crit, 'crit', '⚑') +
      bloco('Atenção', g.warn, 'warn', '⚠') +
      bloco('Observações', g.info, 'info', 'ⓘ') +

      '<div class="card"><h3>Últimas operações</h3><div class="tw"><table><thead><tr><th style="width:150px">Quando</th><th>Operação</th></tr></thead><tbody>' +
      (S.historico().slice(0, 40).map(function (x) {
        return '<tr><td class="num" style="color:var(--ink-3)">' + new Date(x.t).toLocaleString('pt-BR') + '</td><td>' + h(x.d) + '</td></tr>';
      }).join('') || '<tr><td colspan="2" class="empty">Sem operações registradas ainda.</td></tr>') +
      '</tbody></table></div></div>';
  }

  /* ================================================= TELA · PROVENTOS MG === */
  function viewProventosMG(root) {
    if (global.ProventosMG && typeof global.ProventosMG.view === 'function') {
      global.ProventosMG.view(root, db, { topo: topo, kpi: kpi, h: h, brl: E.brl });
    } else {
      root.innerHTML = '<div class="card"><p>Módulo de proventos de Minas Gerais carregando ou indisponível.</p></div>';
    }
  }

  /* ==================================================== TELA · CATEGORIAS === */
  function formConta(idOuNome) {
    var c = idOuNome ? E.cadastroContas(db).filter(function (x) { return x.id === idOuNome || x.nome === idOuNome; })[0] : null;
    var corpo = '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld" style="grid-column:1/-1"><label>Nome / Identificação da Conta</label><input id="ct-nome" value="' + h(c ? c.nome : '') + '" placeholder="ex.: Conta Salário Itaú, Banco do Brasil, Nubank"></div>' +
      '<div class="fld"><label>Instituição / Banco</label><input id="ct-banco" value="' + h(c ? (c.banco || c.nome) : '') + '" placeholder="ex.: Itaú, BB, Caixa, Inter"></div>' +
      '<div class="fld"><label>Tipo de Conta</label><select id="ct-tipo">' +
      opts([
        { v: 'salario', l: 'Conta Salário' },
        { v: 'corrente', l: 'Conta Corrente' },
        { v: 'poupanca', l: 'Poupança' },
        { v: 'carteira', l: 'Carteira / Digital' },
        { v: 'investimento', l: 'Investimentos' },
        { v: 'dinheiro', l: 'Dinheiro Físico' }
      ], c ? (c.tipo || 'corrente') : 'corrente') +
      '</select></div>' +
      '<div class="fld"><label>Saldo Inicial (R$)</label><input id="ct-saldo" inputmode="decimal" value="' + (c && c.saldoInicial ? c.saldoInicial.toFixed(2).replace('.', ',') : '0,00') + '" placeholder="0,00"></div>' +
      '<div class="fld"><label>Cor de Destaque</label><div class="inline" style="gap:10px">' +
      '<input type="color" id="ct-cor" value="' + (c ? (c.cor || '#0284c7') : '#0284c7') + '" style="height:36px;width:52px;padding:2px;cursor:pointer;border-radius:4px;border:1px solid var(--stroke)">' +
      '<span style="font-size:12px;color:var(--ink-3)">Cor para identificação nos relatórios</span>' +
      '</div></div>' +
      '</div>';

    modal(c ? 'Editar Conta Bancária' : 'Nova Conta Bancária', corpo, function (o) {
      var nome = $('#ct-nome', o).value.trim();
      var banco = $('#ct-banco', o).value.trim() || nome;
      var tipo = $('#ct-tipo', o).value;
      var saldo = parseVal($('#ct-saldo', o).value) || 0;
      var cor = $('#ct-cor', o).value || '#0284c7';

      if (!nome) { toast('Informe o nome da conta.', 'err'); return false; }
      if (!db.contas) db.contas = [];

      if (c) {
        var antigoNome = c.nome;
        c.nome = nome;
        c.banco = banco;
        c.tipo = tipo;
        c.saldoInicial = saldo;
        c.cor = cor;
        if (antigoNome !== nome) {
          db.lancamentos.forEach(function (l) {
            if (l.conta === antigoNome) l.conta = nome;
          });
        }
        S.touch('Atualizou conta bancária: ' + nome);
        toast('Conta atualizada com sucesso!');
      } else {
        if (db.contas.some(function (x) { return x.nome.toLowerCase() === nome.toLowerCase(); })) {
          toast('Já existe uma conta com este nome.', 'err');
          return false;
        }
        var novoId = 'ct_' + (db.contas.length + 1) + '_' + Math.random().toString(36).slice(2, 6);
        db.contas.push({
          id: novoId,
          nome: nome,
          banco: banco,
          tipo: tipo,
          saldoInicial: saldo,
          cor: cor
        });
        S.touch('Cadastrou conta bancária: ' + nome);
        toast('Conta cadastrada com sucesso!');
      }
      render();
    });
  }

  function excluirConta(idOuNome) {
    var c = E.cadastroContas(db).filter(function (x) { return x.id === idOuNome || x.nome === idOuNome; })[0];
    if (!c) return;
    if (E.contas(db).length <= 1) {
      toast('É necessário manter pelo menos uma conta cadastrada.', 'err');
      return;
    }
    var totalLanc = db.lancamentos.filter(function (l) { return l.conta === c.nome; }).length;
    var msg = 'Excluir a conta "' + c.nome + '"?';
    if (totalLanc) msg += ' Existem ' + totalLanc + ' lançamento(s) associados a esta conta.';
    confirmar(msg, function () {
      db.contas = (db.contas || []).filter(function (x) { return x.id !== c.id && x.nome !== c.nome; });
      S.touch('Excluiu conta: ' + c.nome);
      toast('Conta excluída');
      render();
    });
  }

  function viewCategorias(root) {
    var contas = E.cadastroContas(db);
    var cartoes = E.cadastroCartoes(db);

    function lista(classe) {
      var arr = db.categorias[classe];
      var uso = {};
      db.lancamentos.forEach(function (l) { uso[l.cat] = (uso[l.cat] || 0) + 1; });
      return '<div class="card"><h3>' + (classe === 'receita' ? 'Receitas' : 'Despesas') + ' <span class="tag">' + arr.length + '</span></h3>' +
        '<div class="inline" style="margin-bottom:12px"><div class="fld" style="flex:1"><input placeholder="nova categoria de ' + classe + '" data-add="' + classe + '"></div>' +
        '<button class="btn" data-addbtn="' + classe + '">+ Adicionar</button></div>' +
        '<div class="tw" style="max-height:420px"><table><tbody>' + arr.map(function (c, i) {
          return '<tr><td>' + h(c) + '</td><td class="r num" style="color:var(--ink-3);width:80px">' + (uso[c] || 0) + ' lanç.</td>' +
            '<td class="c actions" style="width:74px"><button class="iconbtn" data-rn="' + classe + '|' + i + '">✎</button>' +
            '<button class="iconbtn del" data-rm="' + classe + '|' + i + '">✕</button></td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }

    var blocoContas = '<div class="card"><h3>Contas Bancárias & Carteiras <span class="tag">' + contas.length + '</span></h3>' +
      '<p style="font-size:12.5px;color:var(--ink-3);margin-bottom:12px">Cadastre suas contas correntes, poupanças e contas salário para vincular aos lançamentos.</p>' +
      '<button class="btn sm pri" id="add-conta-btn" style="margin-bottom:12px">+ Nova Conta Bancária</button>' +
      '<div class="tw"><table><thead><tr><th>Conta / Banco</th><th>Tipo</th><th class="r">Saldo Inicial</th><th></th></tr></thead><tbody>' +
      contas.map(function (c) {
        var tipoLabel = { salario: 'Conta Salário', corrente: 'Conta Corrente', poupanca: 'Poupança', carteira: 'Digital', investimento: 'Investimentos', dinheiro: 'Dinheiro' }[c.tipo] || c.tipo;
        return '<tr>' +
          '<td><span class="tag" style="border-left:4px solid ' + (c.cor || '#0284c7') + ';font-weight:600">' + h(c.nome) + '</span> ' + (c.banco && c.banco !== c.nome ? '<span style="font-size:11px;color:var(--ink-3)">(' + h(c.banco) + ')</span>' : '') + '</td>' +
          '<td><span class="tag">' + h(tipoLabel) + '</span></td>' +
          '<td class="r num">' + E.brl(c.saldoInicial || 0) + '</td>' +
          '<td class="c actions" style="width:74px"><button class="iconbtn" data-ed-ct="' + h(c.id || c.nome) + '">✎</button>' +
          '<button class="iconbtn del" data-dl-ct="' + h(c.id || c.nome) + '">✕</button></td></tr>';
      }).join('') + '</tbody></table></div></div>';

    var blocoCartoes = '<div class="card"><h3>Cartões de Crédito <span class="tag">' + cartoes.length + '</span></h3>' +
      '<p style="font-size:12.5px;color:var(--ink-3);margin-bottom:12px">Cadastre seus cartões de crédito com limites, fechamento e vencimento.</p>' +
      '<button class="btn sm pri" id="add-cart-btn" style="margin-bottom:12px">+ Novo Cartão de Crédito</button>' +
      '<div class="tw"><table><thead><tr><th>Cartão</th><th>Fech. / Venc.</th><th class="r">Limite</th><th></th></tr></thead><tbody>' +
      cartoes.map(function (c) {
        return '<tr>' +
          '<td><span class="tag" style="border-left:4px solid ' + (c.cor || '#ea580c') + ';font-weight:600">' + h(c.nome) + '</span></td>' +
          '<td><span style="font-size:12px">Dia ' + (c.diaFechamento || 25) + ' / Dia ' + (c.diaVencimento || 5) + '</span></td>' +
          '<td class="r num">' + E.brl(c.limite || 0) + '</td>' +
          '<td class="c actions" style="width:74px"><button class="iconbtn" data-ed-cc="' + h(c.id || c.nome) + '">✎</button>' +
          '<button class="iconbtn del" data-dl-cc="' + h(c.id || c.nome) + '">✕</button></td></tr>';
      }).join('') + '</tbody></table></div></div>';

    root.innerHTML = topo('Contas, Cartões & Categorias',
      'Configurações estruturais do seu sistema financeiro. Todos os cadastros são 100% personalizáveis e editáveis.') +
      '<div class="grid g-2" style="margin-bottom:14px">' + blocoContas + blocoCartoes + '</div>' +
      '<div class="grid g-2">' + lista('receita') + lista('despesa') + '</div>';

    $('#add-conta-btn').onclick = function () { formConta(null); };
    $('#add-cart-btn').onclick = function () { formCartao(null); };

    $$('[data-ed-ct]').forEach(function (b) {
      b.onclick = function () { formConta(b.dataset.edCt); };
    });
    $$('[data-dl-ct]').forEach(function (b) {
      b.onclick = function () { excluirConta(b.dataset.dlCt); };
    });
    $$('[data-ed-cc]').forEach(function (b) {
      b.onclick = function () { formCartao(b.dataset.edCc); };
    });
    $$('[data-dl-cc]').forEach(function (b) {
      b.onclick = function () { excluirCartao(b.dataset.dlCc); };
    });

    $$('[data-addbtn]').forEach(function (b) {
      b.onclick = function () {
        var cl = b.dataset.addbtn, inp = $('[data-add="' + cl + '"]');
        var v = inp.value.trim(); if (!v) return;
        if (E.todasCategorias(db).indexOf(v) >= 0) { toast('Essa categoria já existe.', 'err'); return; }
        db.categorias[cl].push(v);
        db.categorias[cl].sort(function (a, b2) { return a.localeCompare(b2, 'pt-BR'); });
        S.touch('Nova categoria: ' + v); toast('Categoria adicionada'); render();
      };
    });
    $$('[data-add]').forEach(function (i) { i.onkeydown = function (e) { if (e.key === 'Enter') $('[data-addbtn="' + i.dataset.add + '"]').click(); }; });
    $$('[data-rn]').forEach(function (b) {
      b.onclick = function () {
        var p = b.dataset.rn.split('|'), cl = p[0], i = +p[1], antigo = db.categorias[cl][i];
        modal('Renomear categoria', '<div class="fld"><label>Nome</label><input id="c-n" value="' + h(antigo) + '"></div>' +
          '<div class="hint" style="margin-top:10px">Todos os lançamentos com esta categoria serão atualizados.</div>', function (o) {
            var novo = $('#c-n', o).value.trim(); if (!novo || novo === antigo) return;
            db.categorias[cl][i] = novo;
            db.lancamentos.forEach(function (l) { if (l.cat === antigo) l.cat = novo; });
            (db.recorrentes || []).forEach(function (r) { if (r.cat === antigo) r.cat = novo; });
            S.touch('Renomeou categoria ' + antigo + ' → ' + novo); toast('Categoria renomeada'); render();
          });
      };
    });
    $$('[data-rm]').forEach(function (b) {
      b.onclick = function () {
        var p = b.dataset.rm.split('|'), cl = p[0], i = +p[1], c = db.categorias[cl][i];
        var n = db.lancamentos.filter(function (l) { return l.cat === c; }).length;
        confirmar(n ? 'A categoria "' + c + '" tem ' + n + ' lançamento(s). Eles ficarão sem categoria. Continuar?' : 'Excluir a categoria "' + c + '"?', function () {
          db.categorias[cl].splice(i, 1);
          S.touch('Excluiu categoria: ' + c); toast('Categoria excluída'); render();
        });
      };
    });
  }

  /* ========================================================= TELA · DADOS === */
  function viewDados(root) {
    var tamanho = 0;
    try { tamanho = new Blob([JSON.stringify(db)]).size; } catch (e) { }
    root.innerHTML = topo('Dados & backup',
      'O sistema grava sozinho no navegador (IndexedDB + localStorage) a cada alteração.') +

      '<div class="grid g-2" style="margin-bottom:14px">' +
      '<div class="card"><h3>Configuração do Sistema</h3>' +
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld"><label>Mês de referência</label><select id="d-ref">' + selMeses(db.meta.mesRef) + '</select></div>' +
      '<div class="fld"><label>Saldo inicial (R$)</label><input id="d-si" inputmode="decimal" value="' + db.meta.saldoInicial.toFixed(2).replace('.', ',') + '"></div>' +
      '<div class="fld"><label>Primeiro mês</label><input id="d-pm" type="month" value="' + db.meta.primeiroMes + '"></div>' +
      '<div class="fld"><label>Último mês</label><input id="d-um" type="month" value="' + db.meta.ultimoMes + '"></div>' +
      '</div>' +
      '<div class="fld" style="margin-top:10px"><label>Tema do Sistema (Aparência)</label>' +
      '<div style="margin-top:4px">' + seletorTemaHTML() + '</div></div>' +
      '<div class="hint">O mês de referência separa o <b>realizado</b> da <b>projeção</b> e controla parcelas pagas, metas e consignados. O tema pode ser Claro, Escuro ou Automático (seguindo seu celular/computador).</div>' +
      '<div style="margin-top:14px"><button class="btn pri" id="d-salvar">Salvar configuração</button></div></div>' +

      '<div class="card"><h3>Situação da base</h3>' +
      '<table><tbody>' +
      linhaInfo('Lançamentos', db.lancamentos.length) +
      linhaInfo('Parcelamentos', db.parcelamentos.length) +
      linhaInfo('Recorrentes', (db.recorrentes || []).length) +
      linhaInfo('Categorias', E.todasCategorias(db).length) +
      linhaInfo('Meses cobertos', E.meses(db).length) +
      linhaInfo('Tamanho da base', (tamanho / 1024).toFixed(1).replace('.', ',') + ' KB') +
      '<tr><td style="color:var(--ink-3)">Espaço no navegador</td><td class="r num" id="d-quota">…</td></tr>' +
      '<tr><td style="color:var(--ink-3)">Armazenamento persistente</td><td class="r" id="d-persist">…</td></tr>' +
      '<tr><td style="color:var(--ink-3)">Último backup</td><td class="r num">' +
      (db.meta.ultimoBackup
        ? new Date(db.meta.ultimoBackup).toLocaleDateString('pt-BR') + ' (' + diasDesdeBackup() + 'd)'
        : '<span style="color:#b45309">nunca</span>') + '</td></tr>' +
      '</tbody></table>' +
      '<div class="alert info" style="margin-top:14px"><span class="ic">ⓘ</span><div>Os dados ficam <b>neste navegador</b>. Faça um backup em JSON com frequência — é o arquivo que leva tudo para outro computador ou celular.</div></div>' +
      '</div></div>' +

      '<div class="card"><h3>Backup e restauração</h3>' +
      '<div class="inline">' +
      '<button class="btn pri" id="d-exp">↓ Baixar backup (JSON)</button>' +
      '<button class="btn" id="d-imp">↑ Restaurar backup</button>' +
      '<button class="btn" id="d-csv">↓ Exportar tudo em CSV</button>' +
      '<div class="spacer"></div>' +
      (S.temSementeAberta() ? '<button class="btn" id="d-seed">Voltar à planilha original</button>' : '') +
      '<button class="btn dgr" id="d-zap">Apagar tudo</button>' +
      '<input type="file" id="d-file" accept=".json,application/json" style="display:none">' +
      '</div>' +
      '<div class="hint">O backup JSON é o arquivo que leva tudo para outro computador ou celular. “Apagar tudo” limpa este navegador.</div>' +
      '</div>' +

      '<div class="card" style="margin-top:14px"><h3>Identidade Visual & Logomarca Financeiro Servidor MG (3D Metálica)</h3>' +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-top:10px">' +
      '<div style="width:64px;height:64px;flex:none;filter:drop-shadow(0 4px 12px rgba(124,58,237,.35))">' + logoSVG(64) + '</div>' +
      '<div style="flex:1;min-width:240px">' +
      '<div style="font-weight:700;font-size:15px;color:var(--ink)">Financeiro Servidor MG</div>' +
      '<div style="font-size:12.5px;color:var(--brand);font-weight:600;margin-top:2px">' + h((OPCOES_LOGOMARCA.find(function (o) { return o.id === getLogoOpcao(); }) || {}).nome || 'Logomarca Ativa') + ' <span style="font-size:11px;opacity:0.8">(' + h((OPCOES_LOGOMARCA.find(function (o) { return o.id === getLogoOpcao(); }) || {}).categoria || '') + ')</span></div>' +
      '<div style="font-size:12px;color:var(--ink-3);margin-top:4px">' + h((OPCOES_LOGOMARCA.find(function (o) { return o.id === getLogoOpcao(); }) || {}).sub || '') + '</div>' +
      '</div>' +
      '<button class="btn pri" id="d-trocar-logo">🔺 Escolher Logomarca 3D Metálica</button>' +
      '</div>' +
      '</div>' +

      '<div class="card" style="margin-top:14px" id="sync-painel">' + blocoSync() + '</div>' +

      '<div class="card" style="margin-top:14px" id="bio-painel">' + blocoBiometriaHTML() + '</div>' +

      '<div class="card" style="margin-top:14px"><h3>Proteção por senha</h3>' +
      '<p style="font-size:13.5px;color:var(--ink-2);max-width:70ch">O arquivo publicado na internet (<code>data/seed.enc.js</code>) guarda seus dados <b>criptografados</b> em AES‑256‑GCM, com a chave derivada da sua senha por PBKDF2 (250 mil iterações). Sem a senha, quem baixar o arquivo vê apenas texto embaralhado.</p>' +
      '<div class="inline" style="margin-top:14px">' +
      '<button class="btn pri" id="d-senha">🔑 Gerar pacote com nova senha</button>' +
      '<button class="btn" id="d-lock">🔒 Bloquear este navegador</button>' +
      '</div>' +
      '<div class="hint">“Gerar pacote” baixa um <code>seed.enc.js</code> novo, com a base atual e a senha que você escolher — substitua o arquivo no repositório para atualizar o site. “Bloquear” apaga a cópia local: na próxima abertura o sistema pedirá a senha de novo (use em computador compartilhado).</div>' +
      '</div>';

    $('#d-salvar').onclick = function () {
      db.meta.mesRef = $('#d-ref').value;
      db.meta.saldoInicial = parseVal($('#d-si').value);
      db.meta.primeiroMes = $('#d-pm').value;
      db.meta.ultimoMes = $('#d-um').value;
      E.aplicarRecorrentes(db);
      S.touch('Configuração alterada'); toast('Configuração salva');
    };
    var btnTl = $('#d-trocar-logo');
    if (btnTl) btnTl.onclick = function () { abrirModalLogomarcas(); };
    $('#d-exp').onclick = function () { fazerBackup(); };
    S.quota().then(function (q) {
      var el = $('#d-quota'); if (!el) return;
      el.textContent = q && q.quota
        ? (q.usage / 1048576).toFixed(1).replace('.', ',') + ' MB usados de ' + (q.quota / 1073741824).toFixed(1).replace('.', ',') + ' GB'
        : 'não informado';
    });
    (function () {
      var el = $('#d-persist'); if (!el) return;
      var p = S.persistente;
      el.innerHTML = p === true ? '<span class="tag ok">sim — protegido contra limpeza automática</span>'
        : p === false ? '<span class="tag run">não concedido pelo navegador</span>'
          : '<span class="tag">não suportado</span>';
    })();
    ligarBotoesSync();
    ligarBotoesBiometria();
    $('#d-imp').onclick = function () { $('#d-file').click(); };
    $('#d-file').onchange = function () {
      var f = this.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try { S.importar(fr.result); toast('Backup restaurado'); }
        catch (e) { toast('Arquivo inválido: ' + e.message, 'err'); }
      };
      fr.readAsText(f);
    };
    $('#d-csv').onclick = function () {
      var out = [['Data', 'Descricao', 'Categoria', 'Entrada', 'Saida', 'Conta']];
      db.lancamentos.slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; }).forEach(function (l) {
        out.push([l.data, l.desc, l.cat, l.valor > 0 ? l.valor : '', l.valor < 0 ? -l.valor : '', l.conta || '']);
      });
      baixarCSV(out, 'lancamentos-completo.csv');
    };
    if ($('#d-seed')) $('#d-seed').onclick = function () {
      confirmar('Isso descarta as alterações feitas aqui e volta aos dados da planilha. Continuar?', function () {
        S.restaurarSemente(); toast('Base restaurada');
      });
    };
    $('#d-lock').onclick = function () {
      confirmar('Apagar a cópia local? O site voltará a pedir a senha. Seus dados continuam no arquivo publicado e no seu backup JSON.', function () {
        S.apagarTudo().then(function () { location.reload(); });
      });
    };
    $('#d-senha').onclick = function () {
      if (!global.Cripto || !Cripto.disponivel()) { toast('Criptografia indisponível neste contexto. Abra o site pelo endereço https.', 'err'); return; }
      modal('Gerar pacote protegido',
        '<div class="fld"><label>Nova senha</label><input type="password" id="s1" autocomplete="new-password"></div>' +
        '<div class="fld" style="margin-top:12px"><label>Repita a senha</label><input type="password" id="s2" autocomplete="new-password"></div>' +
        '<div class="hint" style="margin-top:12px">Guarde bem: <b>não há recuperação</b>. Sem a senha, o pacote não abre — nem por mim, nem por ninguém.</div>',
        function (o) {
          var a = $('#s1', o).value, b = $('#s2', o).value;
          if (!a || a.length < 8) { toast('Use pelo menos 8 caracteres.', 'err'); return false; }
          if (a !== b) { toast('As senhas não conferem.', 'err'); return false; }
          Cripto.fechar(db, a).then(function (pac) {
            baixar('window.__SEED_ENC__=' + JSON.stringify(pac) + ';\n', 'seed.enc.js', 'application/javascript');
            toast('Pacote gerado — substitua data/seed.enc.js no repositório');
            S.log('Gerou novo pacote protegido');
          });
        }, 'Gerar');
    };
    $('#d-zap').onclick = function () {
      confirmar('Apagar TODOS os dados deste navegador? Faça um backup antes.', function () {
        S.apagarTudo().then(function () { location.reload(); });
      });
    };
  }
  function linhaInfo(l, v) {
    return '<tr><td style="color:var(--ink-3)">' + h(l) + '</td><td class="r num">' + h(v) + '</td></tr>';
  }

  /* ------------------------------------------------------ painel da nuvem */
  function blocoSync() {
    var fb = global.FirebaseCloud;
    var user = fb ? fb.user : null;
    var cab = '<h3>☁︎ Nuvem Google & Sincronização Online (Firestore)</h3>';

    var htmlUser = '';
    if (user) {
      var nomeOuEmail = user.email || (user.isAnonymous ? 'Sessão Anônima na Nuvem' : user.uid);
      htmlUser = '<div class="alert info"><span class="ic">✓</span><div><b>Conectado à Nuvem do Google:</b> ' + h(nomeOuEmail) +
        '<br><span style="opacity:.85">Seus lançamentos estão gravados online no Google Firestore e sincronizam automaticamente em tempo real em todos os seus aparelhos.</span></div></div>' +
        '<div class="inline" style="margin-top:12px">' +
        '<button class="btn pri" id="fb-salvar">☁︎ Forçar envio para a Nuvem</button>' +
        '<button class="btn" id="fb-puxar">↓ Puxar dados da Nuvem</button>' +
        '<button class="btn dgr" id="fb-logout">Desconectar da conta</button>' +
        '</div>';
    } else {
      htmlUser = '<div class="alert"><span class="ic">☁︎</span><div><b>Modo 100% Online disponível:</b> Conecte-se com sua conta Google ou crie um login para que seus dados fiquem salvos na nuvem do Google Firestore, sem depender da sua máquina ou navegador local.</div></div>' +
        '<div class="inline" style="margin-top:12px">' +
        '<button class="btn pri" id="fb-google">G Entrar com Conta Google</button>' +
        '<button class="btn" id="fb-anon">⚡ Entrar como Anônimo Online</button>' +
        '<button class="btn" id="fb-email-modal">✉ Entrar com E-mail e Senha</button>' +
        '</div>';
    }

    return cab + htmlUser +
      '<div class="hint" style="margin-top:12px">Os dados na nuvem utilizam o banco de dados oficial do Google (Firebase Firestore). Você pode acessar de qualquer celular, tablet ou computador instantaneamente.</div>';
  }

  function ligarBotoesSync() {
    var fb = global.FirebaseCloud;
    if (!fb) return;

    var btnGoogle = $('#fb-google');
    if (btnGoogle) {
      btnGoogle.onclick = function () {
        btnGoogle.disabled = true;
        btnGoogle.textContent = 'Conectando ao Google…';
        fb.loginGoogle().then(function () {
          toast('Conectado à nuvem Google!');
          render();
        }).catch(function (e) {
          btnGoogle.disabled = false;
          btnGoogle.textContent = 'G Entrar com Conta Google';
          toast('Falha no login Google: ' + (e.message || 'Erro'), 'err');
        });
      };
    }

    var btnAnon = $('#fb-anon');
    if (btnAnon) {
      btnAnon.onclick = function () {
        btnAnon.disabled = true;
        btnAnon.textContent = 'Iniciando sessão na nuvem…';
        fb.loginAnonimo().then(function () {
          toast('Sessão na nuvem iniciada!');
          render();
        }).catch(function (e) {
          btnAnon.disabled = false;
          btnAnon.textContent = '⚡ Entrar como Anônimo Online';
          toast('Erro ao entrar: ' + e.message, 'err');
        });
      };
    }

    var btnEmail = $('#fb-email-modal');
    if (btnEmail) {
      btnEmail.onclick = function () {
        var corpo = '<div class="fld"><label>E-mail</label><input type="email" id="em-email" placeholder="seu@email.com"></div>' +
          '<div class="fld" style="margin-top:10px"><label>Senha</label><input type="password" id="em-pass" placeholder="••••••••"></div>' +
          '<div style="margin-top:10px;font-size:12.5px;color:var(--ink-3)"><label style="display:inline-flex;align-items:center;gap:6px;cursor:pointer"><input type="checkbox" id="em-create"> Criar nova conta com estes dados</label></div>' +
          '<div id="em-err" style="color:var(--saida);font-size:12px;margin-top:8px;display:none"></div>';

        modal('Entrar na Nuvem com E-mail', corpo, function () {
          var em = $('#em-email').value.trim();
          var ps = $('#em-pass').value;
          var cr = $('#em-create').checked;
          if (!em || !ps) { toast('Preencha e-mail e senha', 'err'); return false; }
          fb.loginEmail(em, ps, cr).then(function () {
            toast(cr ? 'Conta criada e conectada na nuvem!' : 'Conectado à nuvem!');
            render();
          }).catch(function (e) {
            toast('Erro: ' + e.message, 'err');
          });
        }, 'Entrar na Nuvem');
      };
    }

    var btnSalvar = $('#fb-salvar');
    if (btnSalvar) {
      btnSalvar.onclick = function () {
        btnSalvar.disabled = true;
        btnSalvar.textContent = 'Gravando na nuvem…';
        fb.salvarNaNuvem(db).then(function (ok) {
          btnSalvar.disabled = false;
          btnSalvar.textContent = '☁︎ Forçar envio para a Nuvem';
          toast(ok ? 'Dados salvos no Google Firestore!' : 'Erro ao gravar na nuvem', ok ? 'ok' : 'err');
        });
      };
    }

    var btnPuxar = $('#fb-puxar');
    if (btnPuxar) {
      btnPuxar.onclick = function () {
        btnPuxar.disabled = true;
        btnPuxar.textContent = 'Buscando da nuvem…';
        fb.puxarDaNuvem().then(function (remoto) {
          btnPuxar.disabled = false;
          btnPuxar.textContent = '↓ Puxar dados da Nuvem';
          if (remoto) {
            S.adotar(remoto, 'nuvem');
            db = S.db;
            render();
            toast('Base atualizada a partir do Google Firestore!');
          } else {
            toast('Nenhum dado encontrado na nuvem para este usuário.', 'err');
          }
        });
      };
    }

    var btnLogout = $('#fb-logout');
    if (btnLogout) {
      btnLogout.onclick = function () {
        confirmar('Deseja desconectar da conta na nuvem?', function () {
          fb.logout().then(function () {
            toast('Desconectado da conta.');
            render();
          });
        });
      };
    }
  }

  /* -------------------------------------------------- painel de biometria */
  function blocoBiometriaHTML() {
    var bio = global.Biometria;
    var suportada = bio && bio.suportada();
    var ativa = bio && bio.estaAtiva();
    var autoPrompt = bio && bio.temAutoPrompt();

    var cab = '<h3>👆 Autenticação Biométrica (Touch ID / Face ID / Digital)</h3>';

    if (!suportada) {
      return cab +
        '<div class="alert"><span class="ic">ⓘ</span><div><b>Biometria nativa não suportada:</b> Este navegador não possui a API WebAuthn habilitada neste contexto. Para usar biometria no celular ou Mac, instale como aplicativo PWA ou abra em conexão segura HTTPS.</div></div>';
    }

    if (ativa) {
      return cab +
        '<div class="alert info"><span class="ic">✓</span><div><b>Biometria Ativa neste Aparelho:</b> Você pode desbloquear o aplicativo instantaneamente com seu sensor biométrico (Touch ID no Mac / Face ID ou Impressão Digital no celular).</div></div>' +
        '<div style="margin:14px 0 10px;display:flex;align-items:center;gap:10px">' +
        '<label style="display:flex;align-items:center;gap:8px;font-size:13.5px;cursor:pointer">' +
        '<input type="checkbox" id="bio-autoprompt" ' + (autoPrompt ? 'checked' : '') + ' style="width:17px;height:17px;accent-color:var(--brand)"> ' +
        'Solicitar biometria automaticamente ao abrir o app' +
        '</label>' +
        '</div>' +
        '<div class="inline" style="margin-top:12px">' +
        '<button class="btn pri" id="btn-bio-testar">⚙️ Testar Sensor Biométrico</button>' +
        '<button class="btn" id="btn-bio-recadastrar">🔄 Reconfigurar Biometria</button>' +
        '<button class="btn dgr" id="btn-bio-desativar">✕ Desativar Biometria neste Aparelho</button>' +
        '</div>' +
        '<div class="hint" style="margin-top:12px">Sua chave biométrica fica armazenada localmente com criptografia de hardware neste dispositivo e não é enviada para servidores externos.</div>';
    }

    return cab +
      '<div class="alert"><span class="ic">👆</span><div><b>Desbloqueio por Biometria Disponível:</b> Cadastre a biometria deste celular ou computador para entrar no sistema com 1 toque, sem precisar digitar a senha mestre toda vez.</div></div>' +
      '<div class="inline" style="margin-top:12px">' +
      '<button class="btn pri" id="btn-bio-cadastrar" style="background:linear-gradient(135deg,#0284c7,#7c3aed);color:#fff;border:none;box-shadow:0 4px 12px rgba(124,58,237,.25)">👆 Ativar Biometria neste Aparelho</button>' +
      '</div>' +
      '<div class="hint" style="margin-top:12px">Compatível com Touch ID (Mac/iPhone), Face ID (iPhone/iPad) e Leitor de Impressão Digital (Android).</div>';
  }

  function ligarBotoesBiometria() {
    var bio = global.Biometria;
    if (!bio) return;

    var btnCadastrar = $('#btn-bio-cadastrar');
    if (btnCadastrar) btnCadastrar.onclick = function () { abrirModalCadastrarBiometria(); };

    var btnRecadastrar = $('#btn-bio-recadastrar');
    if (btnRecadastrar) btnRecadastrar.onclick = function () { abrirModalCadastrarBiometria(); };

    var btnTestar = $('#btn-bio-testar');
    if (btnTestar) {
      btnTestar.onclick = function () {
        btnTestar.disabled = true;
        btnTestar.textContent = 'Toque no sensor…';
        bio.autenticar().then(function () {
          btnTestar.disabled = false;
          btnTestar.textContent = '⚙️ Testar Sensor Biométrico';
          toast('✓ Biometria validada com sucesso!', 'ok');
        }).catch(function (e) {
          btnTestar.disabled = false;
          btnTestar.textContent = '⚙️ Testar Sensor Biométrico';
          toast('Falha no teste biométrico: ' + (e.message || 'Cancelado'), 'err');
        });
      };
    }

    var btnDesativar = $('#btn-bio-desativar');
    if (btnDesativar) {
      btnDesativar.onclick = function () {
        confirmar('Deseja desativar a biometria neste aparelho? Será necessário digitar a senha mestre para entrar.', function () {
          bio.desativar().then(function () {
            toast('Biometria desativada deste aparelho.');
            render();
          });
        });
      };
    }

    var chkAuto = $('#bio-autoprompt');
    if (chkAuto) {
      chkAuto.onchange = function () {
        bio.setAutoPrompt(chkAuto.checked);
        toast(chkAuto.checked ? 'Abertura automática com biometria ativada' : 'Abertura automática desativada');
      };
    }
  }

  function abrirModalCadastrarBiometria(senhaInicial) {
    var bio = global.Biometria;
    if (!bio || !bio.suportada()) {
      toast('Biometria não suportada neste dispositivo.', 'err');
      return;
    }

    var userEmail = (global.FirebaseCloud && global.FirebaseCloud.user && global.FirebaseCloud.user.email) || 'acasendey@gmail.com';

    var corpo = '' +
      '<div style="font-size:13.5px;color:var(--ink-2);line-height:1.5;margin-bottom:14px">' +
      'Vincule a autenticação biométrica (Face ID, Touch ID ou Impressão Digital) deste aparelho para desbloquear o sistema sem digitar a senha.' +
      '</div>' +
      '<div class="fld">' +
      '<label style="font-weight:700">Confirme sua Senha Mestre do Sistema</label>' +
      '<input type="password" id="bio-modal-senha" placeholder="••••••••" value="' + h(senhaInicial || '') + '">' +
      '</div>' +
      '<div id="bio-modal-erro" style="color:#dc2626;font-size:12.5px;margin-top:8px;display:none"></div>' +
      '<div style="font-size:12px;color:var(--ink-3);margin-top:12px;background:var(--surface-2);padding:10px;border-radius:var(--r)">' +
      '💡 <b>Dica:</b> Ao clicar no botão abaixo, o seu celular ou computador exibirá a tela nativa para você tocar no sensor biométrico ou olhar para a câmera.' +
      '</div>';

    modal('Cadastrar Biometria (Touch ID / Face ID / Digital)', corpo, function (ovl) {
      var senha = $('#bio-modal-senha', ovl).value;
      var errEl = $('#bio-modal-erro', ovl);
      if (!senha) {
        if (errEl) { errEl.textContent = 'Digite a senha mestre para vincular.'; errEl.style.display = 'block'; }
        return false;
      }

      toast('Toque no sensor biométrico…');
      bio.cadastrar(senha, userEmail).then(function () {
        toast('✓ Biometria cadastrada com sucesso!');
        var ovlEl = $('.ovl');
        if (ovlEl) ovlEl.remove();
        render();
      }).catch(function (e) {
        if (errEl) {
          errEl.textContent = 'Erro no sensor: ' + (e.message || 'Cancelado');
          errEl.style.display = 'block';
        } else {
          toast('Erro: ' + (e.message || 'Falhou'), 'err');
        }
      });

      return false; // mantém aberto enquanto o sensor opera
    }, '👆 Prosseguir com Sensor');
  }

  /* ------------------------------------------------------------- exportação */
  function baixar(txt, nome, mime) {
    var b = new Blob([txt], { type: (mime || 'text/plain') + ';charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = nome;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function baixarCSV(linhas, nome) {
    var csv = '﻿' + linhas.map(function (r) {
      return r.map(function (c) {
        var s = String(c === null || c === undefined ? '' : c);
        if (typeof c === 'number') s = c.toFixed(2).replace('.', ',');
        return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(';');
    }).join('\r\n');
    baixar(csv, nome, 'text/csv');
  }
  function exportarCSV(lst, nome) {
    var out = [['Data', 'Descricao', 'Categoria', 'Entrada', 'Saida']];
    lst.forEach(function (l) { out.push([l.data, l.desc, l.cat, l.valor > 0 ? l.valor : '', l.valor < 0 ? -l.valor : '']); });
    baixarCSV(out, nome);
    toast('CSV gerado');
  }

  /* ------------------------------------------------------------------ boot */
  /* --------------------------------------------------- tela de desbloqueio */
  function telaDestravar() {
    var semCripto = !global.Cripto || !Cripto.disponivel();
    var bio = global.Biometria;
    var bioAtiva = bio && bio.estaAtiva();
    var bioSuportada = bio && bio.suportada();
    var fb = global.FirebaseCloud;

    var blocoBioLogin = '';
    if (bioAtiva) {
      blocoBioLogin = '' +
        '<div style="background:linear-gradient(135deg, rgba(2,132,199,0.08), rgba(124,58,237,0.12));border:1.5px solid var(--brand);border-radius:var(--r);padding:16px;margin-bottom:18px;text-align:center">' +
        '<div style="width:48px;height:48px;margin:0 auto 8px;display:grid;place-items:center;background:var(--surface-1);border-radius:99px;box-shadow:0 3px 12px rgba(124,58,237,0.2);font-size:22px;border:1px solid var(--stroke)">' +
        '👆' +
        '</div>' +
        '<b style="font-size:14.5px;color:var(--ink);display:block">Acesso por Biometria</b>' +
        '<div style="font-size:12px;color:var(--ink-2);margin:4px 0 12px">Touch ID, Face ID ou Leitor de Impressão Digital</div>' +
        '<button class="btn pri" id="u-bio" style="width:100%;justify-content:center;font-weight:700;font-size:14px;padding:10px 16px;background:linear-gradient(135deg,#0284c7,#7c3aed);color:#fff;border:none;box-shadow:0 4px 14px rgba(124,58,237,0.3)">' +
        '👆 Desbloquear com Biometria' +
        '</button>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px"><div style="flex:1;height:1px;background:var(--stroke-soft)"></div><span style="font-size:11px;color:var(--ink-3);text-transform:uppercase;font-weight:700">ou use sua senha mestre</span><div style="flex:1;height:1px;background:var(--stroke-soft)"></div></div>';
    }

    document.getElementById('app').innerHTML =
      '<div style="min-height:100vh;display:grid;place-items:center;padding:22px">' +
      '<div class="card" style="width:min(440px,100%);padding:28px">' +
      '<div style="display:flex;gap:14px;align-items:center;margin-bottom:18px">' +
      '<div style="width:44px;height:44px;flex:none;filter:drop-shadow(0 4px 10px rgba(124,58,237,.35))">' + logoSVG(44) + '</div>' +
      '<div><b style="font-size:15.5px;color:var(--ink)">Financeiro Servidor MG</b><div style="font-size:11.5px;color:#dc2626;letter-spacing:.08em;text-transform:uppercase;font-weight:700">Estado de Minas Gerais · Acesso Seguro</div></div></div>' +
      (semCripto
        ? '<div class="alert crit"><span class="ic">⚠</span><div>Este navegador não permite descriptografar em <b>file://</b>. Abra pelo endereço https do app.</div></div>'
        : blocoBioLogin +
        '<p style="font-size:13.5px;color:var(--ink-2);margin-bottom:14px">Informe sua senha mestre para carregar sua base e sincronizar online com o Google Firestore.</p>' +
        '<div class="fld"><label>Senha Mestre do Sistema</label><input type="password" id="u-senha" autocomplete="current-password" placeholder="••••••••"></div>' +
        '<div id="u-erro" style="color:#dc2626;font-size:12.5px;margin-top:9px;display:none"></div>' +
        '<button class="btn pri" id="u-ok" style="width:100%;justify-content:center;margin-top:16px">Entrar no Sistema</button>') +
      '<div style="text-align:center;margin-top:16px;padding-top:16px;border-top:1px solid var(--stroke-soft);display:flex;flex-direction:column;gap:8px">' +
      (bioSuportada && !bioAtiva ? '<button class="btn" id="u-ativar-bio" style="width:100%;justify-content:center;font-weight:600;color:var(--brand);border-color:var(--brand)">👆 Ativar Biometria (Touch ID / Digital)</button>' : '') +
      '<button class="btn" id="u-google" style="width:100%;justify-content:center;font-weight:600">G Conectar com Conta Google (Online)</button>' +
      '<button class="btn" id="u-imp" style="width:100%;justify-content:center">Carregar backup JSON</button>' +
      '<input type="file" id="u-file" accept=".json,application/json" style="display:none">' +
      '</div></div></div>';

    var erro = function (m) { var e = $('#u-erro'); if (e) { e.textContent = m; e.style.display = 'block'; } else toast(m, 'err'); };

    var btnAtivarBio = $('#u-ativar-bio');
    if (btnAtivarBio) {
      btnAtivarBio.onclick = function () {
        abrirModalCadastrarBiometria();
      };
    }

    var btnG = $('#u-google');
    if (btnG) {
      btnG.onclick = function () {
        if (!global.FirebaseCloud) { erro('Firebase ainda carregando… aguarde 1 segundo.'); return; }
        btnG.disabled = true;
        btnG.textContent = 'Conectando ao Google…';
        global.FirebaseCloud.loginGoogle().then(function () {
          toast('Conectado à nuvem Google!');
        }).catch(function (e) {
          btnG.disabled = false;
          btnG.textContent = 'G Conectar com Conta Google (Online)';
          erro('Erro login Google: ' + (e.message || 'Falhou'));
        });
      };
    }

    if (!semCripto) {
      var tentar = function (senhaDireta) {
        var s = (typeof senhaDireta === 'string' && senhaDireta) ? senhaDireta : $('#u-senha').value;
        if (!s) return erro('Digite a senha.');
        if ($('#u-senha')) $('#u-senha').value = s;
        $('#u-ok').disabled = true; $('#u-ok').textContent = 'Abrindo…';

        /* 1) deriva chave e credencial · 2) tenta o servidor/nuvem · 3) cai na base do arquivo */
        Promise.all([Cripto.derivarChaveSync(s), Cripto.tokenAuth(s)])
          .then(function (r) { return S.guardarCredenciais(r[0], r[1]); })
          .then(function () {
            if (global.FirebaseCloud && global.FirebaseCloud.user) {
              return global.FirebaseCloud.puxarDaNuvem().then(function (remoto) {
                if (remoto) return { db: remoto };
                return Sync.puxar();
              });
            }
            return Sync.puxar();
          })
          .then(function (remoto) {
            if (remoto && remoto.db) {
              S.adotar(remoto.db, 'servidor');
              return { origem: 'servidor' };
            }
            return Cripto.abrir(global.__SEED_ENC__, s).then(function (obj) {
              S.adotar(obj, 'semente');
              if (Sync.disponivel) Sync.empurrar(S.db, true);
              if (global.FirebaseCloud && global.FirebaseCloud.user) {
                global.FirebaseCloud.salvarNaNuvem(S.db);
              }
              return { origem: 'arquivo' };
            });
          })
          .then(function (r) {
            db = S.db;
            continuarBoot();
            if (r.origem === 'servidor') toast('Dados sincronizados da nuvem');
            if (bioSuportada && !bioAtiva) {
              setTimeout(function () {
                toast('💡 Dica: Você pode ativar o login por Biometria em Dados & Backup!');
              }, 1200);
            }
          })
          .catch(function (e) {
            S.limparCredenciais();
            $('#u-ok').disabled = false; $('#u-ok').textContent = 'Entrar no Sistema';
            erro(e.message || 'Não foi possível abrir.');
            if ($('#u-senha')) $('#u-senha').select();
          });
      };
      $('#u-ok').onclick = function () { tentar(); };
      $('#u-senha').onkeydown = function (e) { if (e.key === 'Enter') tentar(); };

      var btnBio = $('#u-bio');
      if (btnBio) {
        var acaoBio = function () {
          btnBio.disabled = true;
          btnBio.textContent = 'Toque no sensor biométrico…';
          bio.autenticar().then(function (senhaRecuperada) {
            btnBio.disabled = false;
            btnBio.textContent = '✓ Biometria Aceita!';
            tentar(senhaRecuperada);
          }).catch(function (e) {
            btnBio.disabled = false;
            btnBio.textContent = '👆 Desbloquear com Biometria';
            erro('Biometria: ' + (e.message || 'Autenticação cancelada.'));
          });
        };
        btnBio.onclick = acaoBio;

        // Se auto-prompt estiver ligado, aciona automaticamente
        if (bio.temAutoPrompt()) {
          setTimeout(function () {
            if ($('#u-bio') && !$('#u-ok').disabled) {
              acaoBio();
            }
          }, 350);
        }
      }

      if (!bioAtiva) {
        $('#u-senha').focus();
      }
    }
    $('#u-imp').onclick = function () { $('#u-file').click(); };
    $('#u-file').onchange = function () {
      var f = this.files[0]; if (!f) return;
      var fr = new FileReader();
      fr.onload = function () {
        try {
          var o = JSON.parse(fr.result);
          S.adotar(o && o.db ? o.db : o, 'backup');
          db = S.db; continuarBoot();
        } catch (e) { erro('Arquivo inválido.'); }
      };
      fr.readAsText(f);
    };
  }

  function continuarBoot() {
    db = S.db;
    var hojeMes = E.mesDeHoje();
    if (hojeMes > db.meta.mesRef && hojeMes <= db.meta.ultimoMes && db.meta.autoRef !== false) {
      db.meta.mesRef = hojeMes;
      S.log('Mês de referência avançado automaticamente para ' + hojeMes);
    }
    E.aplicarRecorrentes(db);
    S.on(render);
    window.addEventListener('hashchange', render);
    render();
    S.persist(false);
  }

  function boot() {
    aplicarTema();
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (getTema() === 'auto') aplicarTema('auto');
      });
    }
    S.init().then(function (base) {
      if (!base) return telaDestravar();
      continuarBoot();
      /* aparelho já conhecido: puxa o que outros aparelhos gravaram */
      if (S.chave && S.token) {
        Sync.puxar().then(function (remoto) {
          if (!remoto || !remoto.db) return;
          var localQtd = db.lancamentos.length, remotoQtd = remoto.db.lancamentos.length;
          var localMod = db.meta.modificadoEm || '', remotoMod = remoto.db.meta.modificadoEm || '';
          if (remotoMod > localMod) {
            S.adotar(remoto.db, 'servidor');
            db = S.db; render();
            toast('Atualizado com o servidor (' + remotoQtd + ' lançamentos)');
          } else if (localMod > remotoMod) {
            Sync.empurrar(db);
          }
        });
      }
    }).catch(function (e) {
      console.error(e);
      document.getElementById('app').innerHTML =
        '<div style="padding:40px;max-width:640px;margin:0 auto"><h1>Não foi possível carregar</h1><p style="color:#bab0cc;margin-top:12px">' + h(e.message) + '</p></div>';
    });
  }

  global.irParaMesLancamentos = function (m) {
    if (m) st.mes = m;
    location.hash = '#lancamentos';
  };
  global.st = st;
  global.App = { render: render, toast: toast, boot: boot };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(window);
