/* ============================================================================
   proventos-mg.js — Módulo Dedicado de Proventos do Estado de Minas Gerais
   Servidor Público: Aristides Casendey de Abreu (MASP 1191021-3)
   Secretaria de Estado de Justiça e Segurança Pública (SEPLAG - MG)
   Demonstrativos de Pagamento + Folha de 13º Salário + Dashboards Mensais e Anuais
   ========================================================================== */
(function (global) {
  'use strict';

  var ProventosMG = {};

  // Estado interno da sessão de proventos
  var stProv = {
    aba: 'contracheque', // 'contracheque' | 'dash-mes' | 'dash-ano' | 'tabela'
    idRef: '2026-08',
    ano: '2026',
    dashTipoGraf: 'barras', // 'barras' | 'linha'
    dashPeriodo: 'ano' // '6m' | 'ano' | 'tudo'
  };

  // Base inicial com os contracheques mensais de Dez/2025 a Ago/2026 (Sem o 13º de 2025, conforme solicitado)
  var BASE_INICIAL = [
    {
      id: '2025-12',
      mes: '2025-12',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE3 - F) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2024.31, tipo: 'adicional' },
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '8.48', parc: '-', valor: 485.05, tipo: 'hora_extra' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '49', parc: '-', valor: 429.83, tipo: 'noturno' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 550.00, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 379.98, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 6747.69, tipo: 'vencimento' }
      ],
      descontos: [
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1311.89, tipo: 'previdencia' },
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1498.89, tipo: 'irrf' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 71.28, tipo: 'sindicato' },
        { desc: 'Rep.aj.cust/aliment.', ref: 'Atrasado', espec: '1', parc: '-', valor: 550.00, tipo: 'estorno' }
      ]
    },
    {
      id: '2026-01',
      mes: '2026-01',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE3 - F) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '8.55', parc: '-', valor: 489.06, tipo: 'hora_extra' },
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2024.31, tipo: 'adicional' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '56', parc: '-', valor: 491.23, tipo: 'noturno' },
        { desc: 'Abono Aqu.vestimenta', ref: 'Normal', espec: '0', parc: '-', valor: 2133.05, tipo: 'abono' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '11', parc: '-', valor: 550.00, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 379.98, tipo: 'gratificacao' },
        { desc: 'Grat.1/3 F.regulamen', ref: 'Normal', espec: '0', parc: '-', valor: 3377.42, tipo: 'ferias' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 6747.69, tipo: 'vencimento' }
      ],
      descontos: [
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1313.08, tipo: 'previdencia' },
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1516.55, tipo: 'irrf' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 71.28, tipo: 'sindicato' }
      ]
    },
    {
      id: '2026-02',
      mes: '2026-02',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE3 - F) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2024.31, tipo: 'adicional' },
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '13.45', parc: '-', valor: 769.34, tipo: 'hora_extra' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '28', parc: '-', valor: 245.62, tipo: 'noturno' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 550.00, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 379.98, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 6747.69, tipo: 'vencimento' }
      ],
      descontos: [
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1318.62, tipo: 'previdencia' },
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1524.56, tipo: 'irrf' },
        { desc: 'Rep.aj.cust/aliment.', ref: 'Atrasado', espec: '1', parc: '-', valor: 550.00, tipo: 'estorno' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 71.28, tipo: 'sindicato' }
      ]
    },
    {
      id: '2026-03',
      mes: '2026-03',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE3 - F) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2024.31, tipo: 'adicional' },
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '10.55', parc: '-', valor: 603.46, tipo: 'hora_extra' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '49', parc: '-', valor: 429.83, tipo: 'noturno' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 547.64, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 379.98, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 6747.69, tipo: 'vencimento' }
      ],
      descontos: [
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1321.56, tipo: 'previdencia' },
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1528.79, tipo: 'irrf' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 71.28, tipo: 'sindicato' }
      ]
    },
    {
      id: '2026-04',
      mes: '2026-04',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '0.22', parc: '-', valor: 13.27, tipo: 'hora_extra' },
        { desc: 'Adic Not Divisor 200', ref: 'Atrasado', espec: '0', parc: '-', valor: 26.53, tipo: 'retroativo' },
        { desc: 'Serv.extraor.atra-dj', ref: 'Atrasado', espec: '0', parc: '-', valor: 26.41, tipo: 'retroativo' },
        { desc: 'Abono Vestimenta-atr', ref: 'Atrasado', espec: '0', parc: '-', valor: 115.18, tipo: 'retroativo' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento' },
        { desc: 'Grat.1/3 Ferias Reg.', ref: 'Atrasado', espec: '0', parc: '-', valor: 182.39, tipo: 'retroativo' },
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '44', parc: '-', valor: 407.06, tipo: 'noturno' },
        { desc: 'Grat.opcao Venc. Atr', ref: 'Atrasado', espec: '0', parc: '-', valor: 20.52, tipo: 'retroativo' },
        { desc: 'Adicional Desempenho', ref: 'Atrasado', espec: '0', parc: '-', valor: 109.31, tipo: 'retroativo' },
        { desc: 'Abono Aqu.vestimenta', ref: 'Normal', espec: '0', parc: '-', valor: 2248.23, tipo: 'abono' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 547.64, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Venc.basico - Atraso', ref: 'Atrasado', espec: '0', parc: '-', valor: 364.38, tipo: 'retroativo' }
      ],
      descontos: [
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1630.89, tipo: 'irrf' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 71.28, tipo: 'sindicato' },
        { desc: 'Cont Prev Atrasado', ref: 'Atrasado', espec: '0', parc: '-', valor: 84.26, tipo: 'previdencia' },
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1300.20, tipo: 'previdencia' },
        { desc: 'Rep.aj.custo/aliment', ref: 'Atrasado', espec: '-', parc: '1', valor: 275.00, tipo: 'estorno' }
      ]
    },
    {
      id: '2026-05',
      mes: '2026-05',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Adic Not Divisor 200', ref: 'Atrasado', espec: '0', parc: '-', valor: 13.26, tipo: 'retroativo' },
        { desc: 'Serv.extraor.atra-dj', ref: 'Atrasado', espec: '0', parc: '-', valor: 41.54, tipo: 'retroativo' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento' },
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '47', parc: '-', valor: 434.82, tipo: 'noturno' },
        { desc: 'Grat.opcao Venc. Atr', ref: 'Atrasado', espec: '0', parc: '-', valor: 20.52, tipo: 'retroativo' },
        { desc: 'Adicional Desempenho', ref: 'Atrasado', espec: '0', parc: '-', valor: 109.31, tipo: 'retroativo' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 549.12, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Venc.basico - Atraso', ref: 'Atrasado', espec: '0', parc: '-', valor: 364.38, tipo: 'retroativo' }
      ],
      descontos: [
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1634.67, tipo: 'irrf' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 75.17, tipo: 'sindicato' },
        { desc: 'Cont Prev Atrasado', ref: 'Atrasado', espec: '0', parc: '-', valor: 84.56, tipo: 'previdencia' },
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1302.51, tipo: 'previdencia' }
      ]
    },
    {
      id: '2026-06',
      mes: '2026-06',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Adic Not Divisor 200', ref: 'Atrasado', espec: '0', parc: '-', valor: 23.21, tipo: 'retroativo' },
        { desc: 'Serv.extraor.atra-dj', ref: 'Atrasado', espec: '0', parc: '-', valor: 32.58, tipo: 'retroativo' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento' },
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '56', parc: '-', valor: 518.08, tipo: 'noturno' },
        { desc: 'Grat.opcao Venc. Atr', ref: 'Atrasado', espec: '0', parc: '-', valor: 20.52, tipo: 'retroativo' },
        { desc: 'Adicional Desempenho', ref: 'Atrasado', espec: '0', parc: '-', valor: 109.31, tipo: 'retroativo' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 549.12, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Venc.basico - Atraso', ref: 'Atrasado', espec: '0', parc: '-', valor: 364.38, tipo: 'retroativo' }
      ],
      descontos: [
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1654.13, tipo: 'irrf' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 75.17, tipo: 'sindicato' },
        { desc: 'Cont Prev Atrasado', ref: 'Atrasado', espec: '0', parc: '-', valor: 84.71, tipo: 'previdencia' },
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1315.84, tipo: 'previdencia' },
        { desc: 'Banco Itau - Empr. i', ref: 'Normal', espec: '0', parc: '1 de 36', valor: 148.75, tipo: 'consignado' }
      ]
    },
    {
      id: '2026-07',
      mes: '2026-07',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '13.27', parc: '-', valor: 800.51, tipo: 'hora_extra' },
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '49', parc: '-', valor: 453.32, tipo: 'noturno' },
        { desc: 'Abono Aqu.vestimenta', ref: 'Normal', espec: '0', parc: '-', valor: 2248.23, tipo: 'abono' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 547.36, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento' }
      ],
      descontos: [
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1361.03, tipo: 'previdencia' },
        { desc: 'Banco Itau - Empr.ii', ref: 'Normal', espec: '0', parc: '1 de 120', valor: 76.56, tipo: 'consignado' },
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1716.08, tipo: 'irrf' },
        { desc: 'Banco Itau - Empr. i', ref: 'Normal', espec: '0', parc: '2 de 36', valor: 148.75, tipo: 'consignado' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 75.17, tipo: 'sindicato' }
      ]
    },
    {
      id: '2026-08',
      mes: '2026-08',
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: [
        { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional' },
        { desc: 'Servico Extraord dj', ref: 'Normal', espec: '16', parc: '-', valor: 965.20, tipo: 'hora_extra' },
        { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '56', parc: '-', valor: 518.08, tipo: 'noturno' },
        { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 547.36, tipo: 'alimentacao' },
        { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao' },
        { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
        { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento' }
      ],
      descontos: [
        { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1387.38, tipo: 'previdencia' },
        { desc: 'Banco Itau - Empr.ii', ref: 'Normal', espec: '0', parc: '2 de 120', valor: 76.56, tipo: 'consignado' },
        { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1771.93, tipo: 'irrf' },
        { desc: 'Banco Itau - Empr. i', ref: 'Normal', espec: '0', parc: '3 de 36', valor: 148.75, tipo: 'consignado' },
        { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 75.17, tipo: 'sindicato' }
      ]
    }
  ];

  function r2(v) { return Math.round((v || 0) * 100) / 100; }
  function h(str) { return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function brl(v) { return global.Engine ? global.Engine.brl(v) : 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  ProventosMG.totaisMes = function (cc) {
    if (!cc) return { vantagens: 0, descontos: 0, liquido: 0, previdencia: 0, irrf: 0, consignados: 0, alimentacao: 0, extrasNoturnos: 0, baseCalculo: 0 };
    var totV = 0, totD = 0, prev = 0, ir = 0, cons = 0, alim = 0, extNot = 0, baseCalc = 0;
    (cc.vantagens || []).forEach(function (v) {
      var val = Number(v.valor) || 0;
      totV += val;
      if (v.tipo === 'alimentacao') alim += val;
      if (v.tipo === 'hora_extra' || v.tipo === 'noturno') extNot += val;
      if (v.tipo === 'vencimento' || v.tipo === 'adicional' || v.tipo === 'gratificacao' || v.tipo === 'decimo_terceiro') baseCalc += val;
    });
    (cc.descontos || []).forEach(function (d) {
      var val = Number(d.valor) || 0;
      totD += val;
      if (d.tipo === 'previdencia') prev += val;
      if (d.tipo === 'irrf') ir += val;
      if (d.tipo === 'consignado') cons += val;
    });
    return {
      vantagens: r2(totV),
      descontos: r2(totD),
      liquido: r2(totV - totD),
      previdencia: r2(prev),
      irrf: r2(ir),
      consignados: r2(cons),
      alimentacao: r2(alim),
      extrasNoturnos: r2(extNot),
      baseCalculo: r2(baseCalc)
    };
  };

  function diffMeses(de, para) {
    var y1 = +de.slice(0, 4), m1 = +de.slice(5, 7);
    var y2 = +para.slice(0, 4), m2 = +para.slice(5, 7);
    return (y2 - y1) * 12 + (m2 - m1);
  }

  function addMesSimple(m, k) {
    var y = +m.slice(0, 4), mo = +m.slice(5, 7) - 1 + k;
    y += Math.floor(mo / 12); mo = ((mo % 12) + 12) % 12;
    return y + '-' + String(mo + 1).padStart(2, '0');
  }

  ProventosMG.gerarMesProjetado = function (mesAlvo) {
    var mesNum = +mesAlvo.slice(5, 7);
    var offsetFromAug26 = diffMeses('2026-08', mesAlvo);

    var parcEmpr1 = 3 + offsetFromAug26;
    var parcEmpr2 = 2 + offsetFromAug26;

    // Vantagens base regulares (sem fardamento ou 13º automáticos)
    var vantagens = [
      { desc: 'Vencimento Basico', ref: 'Normal', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento' },
      { desc: 'Adicional Desempenho', ref: 'Normal', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional' },
      { desc: 'Grat. Opcao Vencimen', ref: 'Normal', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao' },
      { desc: 'Aj.custo/aliment.fix', ref: 'Normal', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao' },
      { desc: 'Aj.cust/aliment.vari', ref: 'Normal', espec: '22', parc: '-', valor: 547.36, tipo: 'alimentacao' },
      { desc: 'Adic Not Div 200 -dj', ref: 'Normal', espec: '56', parc: '-', valor: 518.08, tipo: 'noturno' },
      { desc: 'Servico Extraord dj', ref: 'Normal', espec: '16', parc: '-', valor: 965.20, tipo: 'hora_extra' }
    ];

    // O 13º Salário e o Auxílio Fardamento (Vestimenta) são lançados manualmente à parte conforme a necessidade
    var descontos = [
      { desc: 'Contrib.prev.art. 28', ref: 'Normal', espec: '0', parc: '-', valor: 1387.38, tipo: 'previdencia' },
      { desc: 'Imp. Renda Ret.fonte', ref: 'Normal', espec: '0', parc: '-', valor: 1771.93, tipo: 'irrf' },
      { desc: 'Sindpublicos Mens.', ref: 'Normal', espec: '0', parc: '-', valor: 75.17, tipo: 'sindicato' }
    ];

    if (parcEmpr1 <= 36) {
      descontos.push({
        desc: 'Banco Itau - Empr. i',
        ref: 'Normal',
        espec: '0',
        parc: parcEmpr1 + ' de 36',
        valor: 148.75,
        tipo: 'consignado'
      });
    }

    if (parcEmpr2 <= 120) {
      descontos.push({
        desc: 'Banco Itau - Empr.ii',
        ref: 'Normal',
        espec: '0',
        parc: parcEmpr2 + ' de 120',
        valor: 76.56,
        tipo: 'consignado'
      });
    }

    return {
      id: mesAlvo,
      mes: mesAlvo,
      tipoFolha: 'mensal',
      titulo: 'Folha Mensal',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica',
      banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
      vantagens: vantagens,
      descontos: descontos
    };
  };

  ProventosMG.garantirDados = function (db, ateMes) {
    if (!db) return [];
    if (!db.proventosMG || !Array.isArray(db.proventosMG) || db.proventosMG.length === 0) {
      db.proventosMG = JSON.parse(JSON.stringify(BASE_INICIAL));
    }

    // Normaliza itens que não possuam id ou tipoFolha
    db.proventosMG.forEach(function (c) {
      if (!c.id) c.id = c.mes + (c.tipoFolha === '13o' ? '-13' : '');
      if (!c.tipoFolha) c.tipoFolha = c.mes.indexOf('-13') >= 0 ? '13o' : 'mensal';
      if (!c.titulo) c.titulo = c.tipoFolha === '13o' ? '13º Salário' : 'Folha Mensal';
    });

    var limite = ateMes || '2027-12';
    var mesesExistentes = db.proventosMG.filter(function (c) { return c.tipoFolha === 'mensal'; }).map(function (c) { return c.mes; });

    var cur = '2026-09';
    while (cur <= limite) {
      if (mesesExistentes.indexOf(cur) < 0) {
        var proj = ProventosMG.gerarMesProjetado(cur);
        db.proventosMG.push(proj);
        mesesExistentes.push(cur);
      }
      cur = global.Engine ? global.Engine.addMes(cur, 1) : addMesSimple(cur, 1);
    }

    // Ordenação: por competência/ano e tipo de folha
    db.proventosMG.sort(function (a, b) {
      var kA = (a.mes || a.id) + (a.tipoFolha === '13o' ? 'B' : 'A');
      var kB = (b.mes || b.id) + (b.tipoFolha === '13o' ? 'B' : 'A');
      return kA < kB ? -1 : kA > kB ? 1 : 0;
    });

    // Sincroniza lançamentos de salário com o extrato bancário (Conta Itaú)
    ProventosMG.sincronizarLancamentos(db);

    return db.proventosMG;
  };

  ProventosMG.getMesPagamento = function (c) {
    if (!c) return '2026-09';
    var is13 = c.tipoFolha === '13o' || (c.mes && c.mes.indexOf('-13') >= 0);
    if (is13) {
      var ano13 = c.anoExercicio || (c.mes ? c.mes.slice(0, 4) : '2026');
      return ano13 + '-12';
    }
    var ym = c.mes ? c.mes.slice(0, 7) : '2026-08';
    return (global.Engine && typeof global.Engine.addMes === 'function')
      ? global.Engine.addMes(ym, 1)
      : addMesSimple(ym, 1);
  };

  ProventosMG.getDataPagamento = function (c) {
    if (!c) return '2026-09-05';
    if (c.dataPagamento) return c.dataPagamento;
    var is13 = c.tipoFolha === '13o' || (c.mes && c.mes.indexOf('-13') >= 0);
    if (is13) {
      var ano13 = c.anoExercicio || (c.mes ? c.mes.slice(0, 4) : '2026');
      return ano13 + '-12-15';
    }
    var mesPgto = ProventosMG.getMesPagamento(c);
    return mesPgto + '-05';
  };

  /**
   * Sincroniza os valores líquidos calculados de cada demonstrativo de Proventos MG
   * com os lançamentos de receita de "Salário" (e 13º Salário) no extrato da Conta Salário Itaú.
   * Regra oficial SEPLAG MG: a competência de determinado mês (ex.: Agosto) é creditada
   * no 5º dia útil do mês subsequente (ex.: Setembro, dia 05).
   */
  ProventosMG.sincronizarLancamentos = function (db) {
    if (!db || !Array.isArray(db.proventosMG) || !Array.isArray(db.lancamentos)) return 0;

    // Garante que as categorias "Salário" e "13º Salário" existam em receitas
    if (!db.categorias) db.categorias = { receita: [], despesa: [] };
    if (!Array.isArray(db.categorias.receita)) db.categorias.receita = [];
    if (db.categorias.receita.indexOf('Salário') < 0) db.categorias.receita.push('Salário');
    if (db.categorias.receita.indexOf('13º Salário') < 0) db.categorias.receita.push('13º Salário');

    var lista = db.proventosMG;
    var idsValidos = {};
    var count = 0;

    var nomesMesAbrev = {
      '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Abr', '05': 'Mai', '06': 'Jun',
      '07': 'Jul', '08': 'Ago', '09': 'Set', '10': 'Out', '11': 'Nov', '12': 'Dez'
    };

    lista.forEach(function (c) {
      if (!c) return;
      var cId = c.id || c.mes;
      idsValidos[cId] = true;
      var mesComp = c.mes ? c.mes.slice(0, 7) : '';
      if (!mesComp || mesComp.length < 7) return;

      var tot = ProventosMG.totaisMes(c);
      var liq = tot.liquido || 0;
      var is13 = c.tipoFolha === '13o' || (c.mes && c.mes.indexOf('-13') >= 0);
      var catAlvo = is13 ? '13º Salário' : 'Salário';

      var mesPgto = ProventosMG.getMesPagamento(c);
      var dataPgto = ProventosMG.getDataPagamento(c);

      var mC = mesComp.slice(5, 7);
      var aC = mesComp.slice(0, 4);
      var refLabel = (nomesMesAbrev[mC] || mC) + '/' + aC;

      var descAlvo = is13
        ? ('13º Salário SEPLAG — ' + (c.subtitulo13 || (c.titulo && c.titulo !== '13º Salário' ? c.titulo : 'Folha 13º/' + (c.anoExercicio || c.mes.slice(0, 4)))))
        : ('Salário SEPLAG (Ref. ' + refLabel + ')');

      // Procura se já existe um lançamento vinculado a este demonstrativo
      var lancExistente = db.lancamentos.find(function (l) {
        if (l.provId && l.provId === cId) return true;
        return false;
      });

      // Se não encontrou por provId, busca por categoria/descrição no mês de pagamento ou competência
      if (!lancExistente) {
        lancExistente = db.lancamentos.find(function (l) {
          if (l.provId) return false;
          var lMes = l.data ? l.data.slice(0, 7) : '';
          if (lMes === mesPgto || lMes === mesComp) {
            if (is13) {
              return l.cat === '13º Salário' || /13.*sal[aá]rio|d[eé]cimo.*terc/i.test(l.desc);
            } else {
              return (l.cat === 'Salário' || /sal[aá]rio|proventos|seplag/i.test(l.desc)) && !/13.*sal[aá]rio|d[eé]cimo/i.test(l.desc);
            }
          }
          return false;
        });
      }

      if (lancExistente) {
        var alterou = false;
        if (Math.abs((lancExistente.valor || 0) - liq) > 0.001) {
          lancExistente.valor = r2(liq);
          alterou = true;
        }
        if (lancExistente.data !== dataPgto) {
          lancExistente.data = dataPgto;
          alterou = true;
        }
        if (lancExistente.desc !== descAlvo && (!lancExistente.desc || /sal[aá]rio.*seplag|sal[aá]rio/i.test(lancExistente.desc))) {
          lancExistente.desc = descAlvo;
          alterou = true;
        }
        if (lancExistente.cat !== catAlvo && (!lancExistente.cat || lancExistente.cat === 'Salário' || lancExistente.cat === '13º Salário')) {
          lancExistente.cat = catAlvo;
          alterou = true;
        }
        if (!lancExistente.conta || lancExistente.conta === 'Banco' || lancExistente.conta === 'Itaú' || lancExistente.conta === 'Conta Itaú') {
          lancExistente.conta = 'Conta Salário Itaú';
        }
        lancExistente.provId = cId;
        lancExistente.provSync = true;
        if (alterou) count++;
      } else {
        // Cria novo lançamento automático para o mês de pagamento oficial (mês subsequente)
        var novoId = (global.Store && typeof global.Store.novoId === 'function')
          ? global.Store.novoId('sal')
          : 'sal_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

        db.lancamentos.push({
          id: novoId,
          data: dataPgto,
          desc: descAlvo,
          cat: catAlvo,
          valor: r2(liq),
          conta: 'Conta Salário Itaú',
          provId: cId,
          provSync: true
        });
        count++;
      }
    });

    // Remove lançamentos automáticos cujos proventos foram excluídos
    db.lancamentos = db.lancamentos.filter(function (l) {
      if (l.provSync && l.provId && !idsValidos[l.provId]) {
        return false;
      }
      return true;
    });

    // Ordena lançamentos cronologicamente por data
    db.lancamentos.sort(function (a, b) {
      var dA = a.data || '', dB = b.data || '';
      return dA < dB ? -1 : dA > dB ? 1 : 0;
    });

    return count;
  };

  ProventosMG.getLabelDemonstrativo = function (cc) {
    if (!cc) return '';
    if (cc.tipoFolha === '13o' || (cc.mes && cc.mes.indexOf('-13') >= 0)) {
      var ano = cc.anoExercicio || (cc.mes ? cc.mes.slice(0, 4) : '2026');
      var subt = cc.subtitulo13 || (cc.titulo && cc.titulo !== '13º Salário' ? cc.titulo : 'Folha de 13º Salário');
      return '13º Salário/' + ano + ' · ' + subt;
    }
    var mesNome = global.Engine ? global.Engine.mesLabelLongo(cc.mes) : cc.mes;
    return mesNome;
  };

  ProventosMG.resumoAnual = function (db, ano) {
    var lista = ProventosMG.garantirDados(db);
    var anoStr = String(ano);
    var filtrados = lista.filter(function (c) {
      var cAno = c.anoExercicio || (c.mes ? c.mes.slice(0, 4) : '');
      return cAno === anoStr;
    });

    var totBruto = 0, totDesc = 0, totLiq = 0, totPrev = 0, totIR = 0, totCons = 0, totAlim = 0, totHoras = 0;
    var qtdMensais = 0, qtd13 = 0;

    filtrados.forEach(function (c) {
      var t = ProventosMG.totaisMes(c);
      totBruto += t.vantagens;
      totDesc += t.descontos;
      totLiq += t.liquido;
      totPrev += t.previdencia;
      totIR += t.irrf;
      totCons += t.consignados;
      totAlim += t.alimentacao;
      totHoras += t.extrasNoturnos;
      if (c.tipoFolha === '13o') qtd13++; else qtdMensais++;
    });

    var divisorMedia = qtdMensais || filtrados.length || 1;
    return {
      ano: ano,
      meses: filtrados,
      totalBruto: r2(totBruto),
      totalDescontos: r2(totDesc),
      totalLiquido: r2(totLiq),
      totalPrevidencia: r2(totPrev),
      totalIRRF: r2(totIR),
      totalConsignados: r2(totCons),
      totalAlimentacao: r2(totAlim),
      totalHorasENoturno: r2(totHoras),
      mediaLiquida: r2(totLiq / divisorMedia),
      mediaBruta: r2(totBruto / divisorMedia),
      qtdMensais: qtdMensais,
      qtd13: qtd13
    };
  };

  /* ==========================================================================
     RENDERIZADOR DA TELA PRINCIPAL DE PROVENTOS MG
     ========================================================================== */
  ProventosMG.view = function (root, db, AppUtils) {
    var lista = ProventosMG.garantirDados(db);
    var idsDisponiveis = lista.map(function (c) { return c.id || c.mes; });
    var anosDisponiveis = Array.from(new Set(lista.map(function (c) { return c.anoExercicio || (c.mes ? c.mes.slice(0, 4) : '2026'); }))).sort();

    if (idsDisponiveis.indexOf(stProv.idRef) < 0) {
      stProv.idRef = idsDisponiveis[idsDisponiveis.length - 1] || '2026-08';
    }
    if (anosDisponiveis.indexOf(stProv.ano) < 0) {
      stProv.ano = stProv.idRef.slice(0, 4);
    }

    var ccAtual = lista.find(function (c) { return (c.id || c.mes) === stProv.idRef; }) || lista[0];
    var tot = ProventosMG.totaisMes(ccAtual);
    var resumoAno = ProventosMG.resumoAnual(db, stProv.ano);

    // Controles de abas superiores
    var topoAcoes =
      '<div class="inline" style="gap:6px;flex-wrap:wrap">' +
      '<button class="btn ' + (stProv.aba === 'contracheque' ? 'pri' : '') + '" id="tab-cc">📄 Demonstrativo</button>' +
      '<button class="btn ' + (stProv.aba === 'dash-mes' ? 'pri' : '') + '" id="tab-dmes">📊 Dash Mensal</button>' +
      '<button class="btn ' + (stProv.aba === 'dash-ano' ? 'pri' : '') + '" id="tab-dano">📈 Dash Anual</button>' +
      '<button class="btn ' + (stProv.aba === 'tabela' ? 'pri' : '') + '" id="tab-tab">▦ Tabela Consolidada</button>' +
      '</div>';

    var seletorMesHTML =
      '<div class="inline" style="gap:8px;margin-top:4px">' +
      '<label style="font-size:12px;font-weight:600;color:var(--ink-3)">COMPETÊNCIA / DEMONSTRATIVO:</label>' +
      '<select id="prov-sel-mes" style="font-weight:600;padding:6px 12px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
      lista.map(function (c) {
        var id = c.id || c.mes;
        var label = ProventosMG.getLabelDemonstrativo(c);
        return '<option value="' + id + '"' + (id === stProv.idRef ? ' selected' : '') + '>' + label + '</option>';
      }).join('') +
      '</select>' +
      '</div>';

    var html =
      (AppUtils && AppUtils.topo
        ? AppUtils.topo('🔺 Proventos Estado de Minas Gerais', 'Servidor Público Estadual · Demonstrativos por Rubricas, Folha de 13º & Dashboards SEPLAG', topoAcoes)
        : '<header class="topbar"><h1>🔺 Proventos Estado de Minas Gerais</h1><div class="spacer"></div>' + topoAcoes + '</header>') +
      '<div style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      seletorMesHTML +
      '<div class="inline" style="gap:8px;flex-wrap:wrap">' +
      '<button class="btn" id="btn-import-cc-seplag" style="background:#b91c1c;color:#fff;font-weight:600" title="Importar contracheque em PDF ou copiar texto do Portal do Servidor MG">🔺 Importar Contracheque (PDF / Texto)</button>' +
      '<button class="btn pri" id="btn-add-13">+ Lançar 13º Salário</button>' +
      '<button class="btn" id="btn-add-fardamento" style="background:#0284c7;color:#fff;font-weight:600">+ Lançar Fardamento</button>' +
      '<button class="btn" id="btn-add-rubrica">+ Lançar Rubrica</button>' +
      '<button class="btn" id="btn-sync-extrato" title="Sincronizar valores líquidos de todos os demonstrativos com as linhas de Salário no Extrato">↻ Sincronizar com Extrato</button>' +
      '<button class="btn" id="btn-imprimir-cc">🖨 Imprimir Demonstrativo</button>' +
      (ccAtual && ccAtual.tipoFolha === '13o' ? '<button class="btn del" id="btn-del-cc13">✕ Excluir este 13º</button>' : '') +
      '</div>' +
      '</div>';

    // Roteador de sub-abas
    if (stProv.aba === 'contracheque') {
      html += renderAbaContracheque(ccAtual, tot, db);
    } else if (stProv.aba === 'dash-mes') {
      html += renderAbaDashMes(ccAtual, tot, lista);
    } else if (stProv.aba === 'dash-ano') {
      html += renderAbaDashAno(db, resumoAno, anosDisponiveis);
    } else if (stProv.aba === 'tabela') {
      html += renderAbaTabelaConsolidada(lista);
    }

    root.innerHTML = html;

    // Execução dos gráficos se estiver nas abas de dashboard
    if (stProv.aba === 'dash-mes') {
      renderGraficosDashMes(ccAtual, tot, lista);
    } else if (stProv.aba === 'dash-ano') {
      renderGraficosDashAno(resumoAno);
    }

    // Eventos de clique nas abas e botões
    ligarEventos(root, db, ccAtual, lista);
  };

  /* --------------------------------------------------------------------------
     ABA 1: DEMONSTRATIVO DE PAGAMENTO (Espelho SEPLAG/MG fiel ao documento)
     -------------------------------------------------------------------------- */
  function renderAbaContracheque(cc, tot, db) {
    var is13 = cc.tipoFolha === '13o' || (cc.mes && cc.mes.indexOf('-13') >= 0);
    var anoDoc = cc.anoExercicio || (cc.mes ? cc.mes.slice(0, 4) : '2026');
    var tituloDoc = is13
      ? 'DEMONSTRATIVO DE PAGAMENTO - DECIMO TERCEIRO SALARIO/' + anoDoc
      : 'DEMONSTRATIVO DE PAGAMENTO — ' + (global.Engine ? global.Engine.mesLabelLongo(cc.mes).toUpperCase() : cc.mes);

    var rowsVantagens = (cc.vantagens || []).map(function (v, idx) {
      return '<tr>' +
        '<td class="c num" style="color:var(--ink-3)">1</td>' +
        '<td><span class="tag ' + (v.ref === 'Atrasado' ? 'warn' : 'real') + '" style="font-size:11px">' + h(v.ref) + '</span></td>' +
        '<td><b>' + h(v.desc) + '</b></td>' +
        '<td class="c num">' + h(v.espec || '0') + '</td>' +
        '<td class="c num">' + h(v.parc || '-') + '</td>' +
        '<td class="r num" style="color:var(--entrada);font-weight:600">' + brl(v.valor) + '</td>' +
        '<td class="c actions" style="width:70px">' +
        '<button class="iconbtn" data-edit-rub="v|' + idx + '" title="Editar">✎</button>' +
        '<button class="iconbtn del" data-del-rub="v|' + idx + '" title="Excluir">✕</button>' +
        '</td>' +
        '</tr>';
    }).join('') || '<tr><td colspan="7" class="empty">Nenhuma vantagem lançada.</td></tr>';

    var rowsDescontos = (cc.descontos || []).map(function (d, idx) {
      return '<tr>' +
        '<td class="c num" style="color:var(--ink-3)">1</td>' +
        '<td><span class="tag ' + (d.ref === 'Atrasado' ? 'warn' : 'real') + '" style="font-size:11px">' + h(d.ref) + '</span></td>' +
        '<td><b>' + h(d.desc) + '</b></td>' +
        '<td class="c num">' + h(d.espec || '0') + '</td>' +
        '<td class="c num">' + h(d.parc || '-') + '</td>' +
        '<td class="r num" style="color:var(--saida);font-weight:600">' + brl(d.valor) + '</td>' +
        '<td class="c actions" style="width:70px">' +
        '<button class="iconbtn" data-edit-rub="d|' + idx + '" title="Editar">✎</button>' +
        '<button class="iconbtn del" data-del-rub="d|' + idx + '" title="Excluir">✕</button>' +
        '</td>' +
        '</tr>';
    }).join('') || '<tr><td colspan="7" class="empty">Nenhum desconto lançado.</td></tr>';

    return '' +
      // Cartão Principal - Espelho do Demonstrativo SEPLAG MG
      '<div class="card" id="area-contracheque" style="padding:24px;border:1px solid var(--stroke-hard);box-shadow:var(--shadow-md);margin-bottom:20px">' +

      // Cabeçalho do Estado
      '<div style="text-align:center;border-bottom:2px solid var(--stroke);padding-bottom:14px;margin-bottom:18px">' +
      '<div style="font-size:11px;letter-spacing:.08em;font-weight:700;color:var(--ink-3);text-transform:uppercase">Governo do Estado de Minas Gerais</div>' +
      '<div style="font-size:12px;font-weight:700;color:var(--ink-2);margin-top:2px">SECRETARIA DE ESTADO DE PLANEJAMENTO E GESTÃO — SEPLAG</div>' +
      '<div style="font-size:11px;color:var(--ink-3);margin-top:1px">CNPJ: 05.461.142/0001-70</div>' +
      '<div style="font-size:15px;font-weight:800;color:var(--brand);margin-top:8px;letter-spacing:.03em">' + h(tituloDoc) + '</div>' +
      (is13 && cc.subtitulo13 ? '<div style="font-size:12px;color:var(--ink-2);margin-top:3px;font-weight:600">' + h(cc.subtitulo13) + '</div>' : '') +
      '</div>' +

      // Dados Cadastrais em Grid Dinâmicos do Servidor
      (function () {
        var baseDb = db || (global.Store && global.Store.db) || {};
        var srv = baseDb.servidor || {
          nome: 'Aristides Casendey de Abreu',
          masp: '1191021-3',
          cpf: '041.102.096-09',
          pisPasep: '128.4253.434-6',
          cargo: cc.cargo || 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
          situacao: cc.situacao || 'Efetivo (apos Lei 64/2002)',
          orgao: cc.orgao || 'Secretaria de Justica e Seguranca Publica (SEJUSP)',
          bancoRecebimento: cc.banco || 'Banco Itaú · Ag 4980 · CC 23287-2'
        };
        return '<div style="background:var(--surface-2);border-radius:var(--r);padding:14px;border:1px solid var(--stroke-soft);margin-bottom:20px">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:6px">' +
          '<div style="font-size:11px;font-weight:700;color:var(--ink-3);text-transform:uppercase">Dados Cadastrais & Funcionais do Servidor</div>' +
          '<button class="btn sm" id="btn-edit-servidor" style="padding:2px 10px;font-size:11.5px;font-weight:600">✎ Editar Dados do Servidor</button>' +
          '</div>' +
          '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;font-size:12.5px">' +
          '<div><span style="color:var(--ink-3)">Nome:</span> <b>' + h(srv.nome) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">MASP:</span> <b>' + h(srv.masp) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">CPF:</span> <b>' + h(srv.cpf) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">Pis/Pasep:</span> <b>' + h(srv.pisPasep) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">Cargo:</span> <b>' + h(srv.cargo || cc.cargo) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">Situação:</span> <b>' + h(srv.situacao || cc.situacao) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">Órgão:</span> <b>' + h(srv.orgao || cc.orgao) + '</b></div>' +
          '<div><span style="color:var(--ink-3)">Banco de Recebimento:</span> <b>' + h(srv.bancoRecebimento || cc.banco) + '</b></div>' +
          '</div>' +
          '</div>';
      })() +

      // Vantagens
      '<div style="margin-bottom:22px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px">' +
      '<h3 style="margin:0;color:var(--entrada);display:flex;align-items:center;gap:6px"><span>▲</span> Vantagens</h3>' +
      '<div class="inline" style="gap:10px">' +
      '<button class="btn sm" id="btn-add-vantagem" style="padding:4px 10px;font-size:12px;font-weight:600;background:rgba(16,185,129,0.12);color:var(--entrada);border-color:rgba(16,185,129,0.3)">+ Nova Vantagem</button>' +
      '<div style="font-size:13px;font-weight:700;color:var(--entrada)">Total Vantagens: ' + brl(tot.vantagens) + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="tw"><table>' +
      '<thead><tr><th style="width:40px">Adm</th><th style="width:80px">Ref.</th><th>Descrição</th><th style="width:90px" class="c">Espec.</th><th style="width:90px" class="c">Parcela</th><th style="width:130px" class="r">Vantagens (R$)</th><th style="width:70px" class="c">Ações</th></tr></thead>' +
      '<tbody>' + rowsVantagens + '</tbody>' +
      '<tfoot><tr style="background:var(--surface-3);font-weight:700"><td colspan="5" class="r">TOTAL:</td><td class="r num" style="color:var(--entrada);font-size:14px">' + brl(tot.vantagens) + '</td><td></td></tr></tfoot>' +
      '</table></div>' +
      '</div>' +

      // Descontos
      '<div style="margin-bottom:22px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;gap:8px">' +
      '<h3 style="margin:0;color:var(--saida);display:flex;align-items:center;gap:6px"><span>▼</span> Descontos</h3>' +
      '<div class="inline" style="gap:10px">' +
      '<button class="btn sm" id="btn-add-desconto" style="padding:4px 10px;font-size:12px;font-weight:600;background:rgba(239,68,68,0.12);color:var(--saida);border-color:rgba(239,68,68,0.3)">+ Novo Desconto</button>' +
      '<div style="font-size:13px;font-weight:700;color:var(--saida)">Total Descontos: ' + brl(tot.descontos) + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="tw"><table>' +
      '<thead><tr><th style="width:40px">Adm</th><th style="width:80px">Ref.</th><th>Descrição</th><th style="width:90px" class="c">Espec.</th><th style="width:90px" class="c">Parcela</th><th style="width:130px" class="r">Descontos (R$)</th><th style="width:70px" class="c">Ações</th></tr></thead>' +
      '<tbody>' + rowsDescontos + '</tbody>' +
      '<tfoot><tr style="background:var(--surface-3);font-weight:700"><td colspan="5" class="r">TOTAL:</td><td class="r num" style="color:var(--saida);font-size:14px">' + brl(tot.descontos) + '</td><td></td></tr></tfoot>' +
      '</table></div>' +
      '</div>' +

      // Caixa de Destaque - VALOR A RECEBER (Vinculado ao Lançamento de Salário no Extrato do Mês de Pagamento)
      (function () {
        var mesPgto = ProventosMG.getMesPagamento(cc);
        var dataPgto = ProventosMG.getDataPagamento(cc);
        var dPgtoLabel = dataPgto.slice(8, 10) + '/' + dataPgto.slice(5, 7) + '/' + dataPgto.slice(0, 4);
        var mesPgtoNome = global.Engine ? global.Engine.mesLabel(mesPgto) : mesPgto;
        return '<div style="background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%);color:#ffffff;border-radius:var(--r);padding:18px 24px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 6px 18px -4px rgba(2,132,199,.4);flex-wrap:wrap;gap:14px">' +
          '<div style="max-width:500px">' +
          '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<div style="font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;opacity:.9;font-weight:700">Valor a Receber (Conta Salário Itaú)</div>' +
          '<span style="background:rgba(255,255,255,0.22);font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;display:inline-flex;align-items:center;gap:4px">🔺 Lançamento Automático Vinculado</span>' +
          '</div>' +
          '<div style="font-size:13.5px;opacity:.95;margin-top:3px">Competência: <b>' + h(ProventosMG.getLabelDemonstrativo(cc)) + '</b></div>' +
          '<div style="font-size:12px;opacity:.88;margin-top:4px;line-height:1.4">Creditado em <b>' + dPgtoLabel + '</b> (mês subsequente à competência) e lançado automaticamente como <b>Salário</b> no extrato de <b>' + mesPgtoNome + '</b>.</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
          '<div style="font-size:26px;font-weight:800;letter-spacing:-.02em">' + brl(tot.liquido) + '</div>' +
          '<div style="font-size:11.5px;opacity:.85">Total Vantagens ' + brl(tot.vantagens) + ' (−) Total Descontos ' + brl(tot.descontos) + '</div>' +
          '<button class="btn sm" id="btn-ir-extrato-mes" data-mes="' + h(mesPgto) + '" style="margin-top:6px;padding:4px 12px;font-size:11.5px;background:#ffffff;color:#0284c7;font-weight:700;border:none;border-radius:var(--r-sm);cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.15)">Ver no Extrato de ' + (global.Engine ? global.Engine.mesNomeCurto(mesPgto) : mesPgto) + ' →</button>' +
          '</div>' +
          '</div>';
      })() +

      '</div>';
  }

  /* --------------------------------------------------------------------------
     ABA 2: DASHBOARD MENSAL AVANÇADO & EVOLUTIVO
     -------------------------------------------------------------------------- */
  function renderAbaDashMes(cc, tot, lista) {
    var percDesc = tot.vantagens > 0 ? ((tot.descontos / tot.vantagens) * 100).toFixed(1) : '0';
    var percLiq = tot.vantagens > 0 ? ((tot.liquido / tot.vantagens) * 100).toFixed(1) : '0';
    var percPrev = tot.vantagens > 0 ? ((tot.previdencia / tot.vantagens) * 100).toFixed(1) : '0';
    var percIR = tot.vantagens > 0 ? ((tot.irrf / tot.vantagens) * 100).toFixed(1) : '0';
    var percCons = tot.vantagens > 0 ? ((tot.consignados / tot.vantagens) * 100).toFixed(1) : '0';
    var percOutros = tot.vantagens > 0 ? (((tot.descontos - tot.previdencia - tot.irrf - tot.consignados) / tot.vantagens) * 100).toFixed(1) : '0';

    var aliqPrevEfetiva = tot.baseCalculo > 0 ? ((tot.previdencia / tot.baseCalculo) * 100).toFixed(1) : '14.0';
    var baseIR = Math.max(1, (tot.baseCalculo || tot.vantagens) - tot.previdencia);
    var aliqIREfetiva = tot.irrf > 0 ? ((tot.irrf / baseIR) * 100).toFixed(1) : '0.0';
    var percMargemConsig = tot.vantagens > 0 ? ((tot.consignados / (tot.vantagens - tot.alimentacao)) * 100).toFixed(1) : '0';

    // Navegação anterior / próximo mês
    var listaMensal = lista.filter(function (c) { return c.tipoFolha === 'mensal'; });
    var idxAtual = listaMensal.findIndex(function (c) { return (c.id || c.mes) === (cc.id || cc.mes); });
    var ccAnterior = idxAtual > 0 ? listaMensal[idxAtual - 1] : null;
    var ccProximo = idxAtual >= 0 && idxAtual < listaMensal.length - 1 ? listaMensal[idxAtual + 1] : null;

    // Variação MoM (Month over Month)
    var htmlMoM = '';
    if (ccAnterior) {
      var totAnt = ProventosMG.totaisMes(ccAnterior);
      var deltaBruto = tot.vantagens - totAnt.vantagens;
      var deltaDesc = tot.descontos - totAnt.descontos;
      var deltaLiq = tot.liquido - totAnt.liquido;

      var pBruto = totAnt.vantagens > 0 ? ((deltaBruto / totAnt.vantagens) * 100).toFixed(1) : '0';
      var pDesc = totAnt.descontos > 0 ? ((deltaDesc / totAnt.descontos) * 100).toFixed(1) : '0';
      var pLiq = totAnt.liquido > 0 ? ((deltaLiq / totAnt.liquido) * 100).toFixed(1) : '0';

      var badgeBruto = deltaBruto > 0.01
        ? '<span style="color:#10b981;font-weight:700">▲ +' + brl(deltaBruto) + ' (+' + pBruto + '%)</span>'
        : deltaBruto < -0.01
        ? '<span style="color:#ef4444;font-weight:700">▼ −' + brl(Math.abs(deltaBruto)) + ' (' + pBruto + '%)</span>'
        : '<span style="color:var(--ink-3)">● Estável (R$ 0,00)</span>';

      var badgeDesc = deltaDesc > 0.01
        ? '<span style="color:#ef4444;font-weight:700">▲ +' + brl(deltaDesc) + ' (+' + pDesc + '%)</span>'
        : deltaDesc < -0.01
        ? '<span style="color:#10b981;font-weight:700">▼ −' + brl(Math.abs(deltaDesc)) + ' (' + pDesc + '%)</span>'
        : '<span style="color:var(--ink-3)">● Estável (R$ 0,00)</span>';

      var badgeLiq = deltaLiq > 0.01
        ? '<span style="color:#0284c7;font-weight:700">▲ +' + brl(deltaLiq) + ' (+' + pLiq + '%)</span>'
        : deltaLiq < -0.01
        ? '<span style="color:#ef4444;font-weight:700">▼ −' + brl(Math.abs(deltaLiq)) + ' (' + pLiq + '%)</span>'
        : '<span style="color:var(--ink-3)">● Estável (R$ 0,00)</span>';

      var nomeMesAnt = global.Engine ? global.Engine.mesLabel(ccAnterior.mes) : ccAnterior.mes;

      htmlMoM =
        '<div class="card" style="margin-bottom:20px;padding:16px 20px;background:var(--surface-2);border:1px solid var(--stroke-soft)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">' +
        '<div style="font-size:13px;font-weight:700;color:var(--ink)">Comparativo com o Mês Anterior (' + h(nomeMesAnt) + ')</div>' +
        '<div style="font-size:11.5px;color:var(--ink-3)">Análise de variações de rendimentos e retenções</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;font-size:12.5px">' +
        '<div style="background:var(--surface-1);padding:12px 14px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
        '<div style="color:var(--ink-3);font-size:11px;text-transform:uppercase;font-weight:600">Variação Salário Bruto</div>' +
        '<div style="margin-top:4px;font-size:14px">' + badgeBruto + '</div>' +
        '</div>' +
        '<div style="background:var(--surface-1);padding:12px 14px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
        '<div style="color:var(--ink-3);font-size:11px;text-transform:uppercase;font-weight:600">Variação Descontos</div>' +
        '<div style="margin-top:4px;font-size:14px">' + badgeDesc + '</div>' +
        '</div>' +
        '<div style="background:var(--surface-1);padding:12px 14px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
        '<div style="color:var(--ink-3);font-size:11px;text-transform:uppercase;font-weight:600">Variação Salário Líquido</div>' +
        '<div style="margin-top:4px;font-size:14px">' + badgeLiq + '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    }

    // Lista rica de Vantagens (sem truncar textos, com barras de proporção claras)
    var rowsVantagensVisual = (cc.vantagens || []).map(function (v) {
      var val = Number(v.valor) || 0;
      var pct = tot.vantagens > 0 ? ((val / tot.vantagens) * 100).toFixed(1) : '0';
      var tagCor = '#0284c7', tagBg = 'rgba(2,132,199,0.12)', tagNome = 'Vencimento';
      if (v.tipo === 'adicional') { tagCor = '#7c3aed'; tagBg = 'rgba(124,58,237,0.12)'; tagNome = 'Adicional 30%'; }
      else if (v.tipo === 'alimentacao') { tagCor = '#059669'; tagBg = 'rgba(5,150,105,0.12)'; tagNome = 'Benefício Isento'; }
      else if (v.tipo === 'hora_extra') { tagCor = '#d97706'; tagBg = 'rgba(217,119,6,0.12)'; tagNome = 'Hora Extra'; }
      else if (v.tipo === 'noturno') { tagCor = '#0284c7'; tagBg = 'rgba(2,132,199,0.12)'; tagNome = 'Adic. Noturno'; }
      else if (v.tipo === 'abono') { tagCor = '#ea580c'; tagBg = 'rgba(234,88,12,0.12)'; tagNome = 'Abono Vestimenta'; }
      else if (v.tipo === 'gratificacao') { tagCor = '#4f46e5'; tagBg = 'rgba(79,70,229,0.12)'; tagNome = 'Gratificação'; }

      var infoEspec = v.espec && v.espec !== '0' && v.espec !== '-' ? ' · Espec: ' + v.espec : '';

      return '' +
        '<div style="padding:10px 12px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--stroke-soft);margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
        '<div>' +
        '<div style="font-weight:700;color:var(--ink);font-size:13px">' + h(v.desc) + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;font-size:11px;color:var(--ink-3)">' +
        '<span style="display:inline-block;padding:1px 6px;border-radius:4px;font-weight:600;background:' + tagBg + ';color:' + tagCor + '">' + tagNome + '</span>' +
        '<span>Ref: ' + h(v.ref || 'Normal') + infoEspec + '</span>' +
        '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
        '<div style="font-weight:800;color:#0284c7;font-size:13.5px">' + brl(val) + '</div>' +
        '<div style="font-size:11px;color:var(--ink-3);margin-top:1px">' + pct + '% do bruto</div>' +
        '</div>' +
        '</div>' +
        '<div style="background:var(--surface-3);border-radius:4px;height:6px;overflow:hidden;margin-top:8px">' +
        '<div style="background:linear-gradient(90deg,#0284c7,#38bdf8);height:100%;width:' + pct + '%;border-radius:4px"></div>' +
        '</div>' +
        '</div>';
    }).join('') || '<div class="empty">Nenhuma vantagem lançada.</div>';

    // Lista rica de Descontos
    var rowsDescontosVisual = (cc.descontos || []).map(function (d) {
      var val = Number(d.valor) || 0;
      var pctDesc = tot.descontos > 0 ? ((val / tot.descontos) * 100).toFixed(1) : '0';
      var pctBruto = tot.vantagens > 0 ? ((val / tot.vantagens) * 100).toFixed(1) : '0';

      var tagCor = '#dc2626', tagBg = 'rgba(220,38,38,0.12)', tagNome = 'Desconto';
      if (d.tipo === 'previdencia') { tagCor = '#d97706'; tagBg = 'rgba(217,119,6,0.12)'; tagNome = 'Previdência IPSEMG'; }
      else if (d.tipo === 'irrf') { tagCor = '#dc2626'; tagBg = 'rgba(220,38,38,0.12)'; tagNome = 'Imposto de Renda'; }
      else if (d.tipo === 'consignado') { tagCor = '#b45309'; tagBg = 'rgba(180,83,9,0.12)'; tagNome = 'Consignado Itaú'; }
      else if (d.tipo === 'sindicato') { tagCor = '#475569'; tagBg = 'rgba(71,85,105,0.12)'; tagNome = 'Sindical'; }
      else if (d.tipo === 'estorno') { tagCor = '#e11d48'; tagBg = 'rgba(225,29,72,0.12)'; tagNome = 'Reposição/Estorno'; }

      var infoParc = d.parc && d.parc !== '-' ? ' · ' + d.parc : '';

      return '' +
        '<div style="padding:10px 12px;border-radius:var(--r-sm);background:var(--surface-2);border:1px solid var(--stroke-soft);margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">' +
        '<div>' +
        '<div style="font-weight:700;color:var(--ink);font-size:13px">' + h(d.desc) + '</div>' +
        '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;font-size:11px;color:var(--ink-3)">' +
        '<span style="display:inline-block;padding:1px 6px;border-radius:4px;font-weight:600;background:' + tagBg + ';color:' + tagCor + '">' + tagNome + '</span>' +
        (infoParc ? '<span style="font-weight:600;color:var(--ink-2)">' + h(infoParc) + '</span>' : '') +
        '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
        '<div style="font-weight:800;color:#dc2626;font-size:13.5px">' + brl(val) + '</div>' +
        '<div style="font-size:11px;color:var(--ink-3);margin-top:1px">' + pctDesc + '% dos descontos (' + pctBruto + '% do bruto)</div>' +
        '</div>' +
        '</div>' +
        '<div style="background:var(--surface-3);border-radius:4px;height:6px;overflow:hidden;margin-top:8px">' +
        '<div style="background:linear-gradient(90deg,#dc2626,#f87171);height:100%;width:' + pctDesc + '%;border-radius:4px"></div>' +
        '</div>' +
        '</div>';
    }).join('') || '<div class="empty">Nenhum desconto lançado.</div>';

    return '' +
      // Barra Superior de Navegação Rápida entre meses
      '<div style="background:var(--surface-1);border:1px solid var(--stroke);border-radius:var(--r);padding:12px 18px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
      '<div style="display:flex;align-items:center;gap:8px">' +
      (ccAnterior
        ? '<button class="btn" data-nav-mes="' + (ccAnterior.id || ccAnterior.mes) + '" title="Ir para o mês anterior" style="padding:5px 10px;font-size:12px">◀ ' + (global.Engine ? global.Engine.mesLabel(ccAnterior.mes) : ccAnterior.mes) + '</button>'
        : '<button class="btn" disabled style="padding:5px 10px;font-size:12px;opacity:0.4">◀ Início</button>') +
      '<div style="display:flex;align-items:center;gap:6px">' +
      '<span style="font-size:16px">📅</span>' +
      '<span style="font-size:14px;font-weight:800;color:var(--ink)">Competência: ' + h(ProventosMG.getLabelDemonstrativo(cc)) + '</span>' +
      '</div>' +
      (ccProximo
        ? '<button class="btn" data-nav-mes="' + (ccProximo.id || ccProximo.mes) + '" title="Ir para o próximo mês" style="padding:5px 10px;font-size:12px">' + (global.Engine ? global.Engine.mesLabel(ccProximo.mes) : ccProximo.mes) + ' ▶</button>'
        : '<button class="btn" disabled style="padding:5px 10px;font-size:12px;opacity:0.4">Fim ▶</button>') +
      '</div>' +
      '<div style="font-size:12px;color:var(--ink-3)">' +
      'Agente de Segurança Socioeducativo · MASP 1191021-3' +
      '</div>' +
      '</div>' +

      // Linha 1: KPIs Principais Mensais
      '<div class="grid g-kpi" style="margin-bottom:16px">' +
      '<div class="kpi acc-in"><div class="lb">Rendimento Bruto Total</div><div class="vl" style="color:var(--entrada)">' + brl(tot.vantagens) + '</div><div class="ft">100% dos proventos apurados</div></div>' +
      '<div class="kpi acc-out"><div class="lb">Total de Descontos</div><div class="vl" style="color:var(--saida)">' + brl(tot.descontos) + '</div><div class="ft">' + percDesc + '% retido em folha</div></div>' +
      '<div class="kpi acc-in"><div class="lb">Salário Líquido na Conta</div><div class="vl" style="color:#0284c7;font-weight:800">' + brl(tot.liquido) + '</div><div class="ft">' + percLiq + '% creditado no Itaú</div></div>' +
      '<div class="kpi acc-am"><div class="lb">Consignados em Folha</div><div class="vl" style="color:#d97706">' + brl(tot.consignados) + '</div><div class="ft">' + percCons + '% do salário bruto</div></div>' +
      '</div>' +

      // Linha 2: Painel de Decomposição Visual do Salário (Destino de Cada Real)
      '<div class="card" style="margin-bottom:20px;padding:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px">' +
      '<div>' +
      '<h3 style="margin:0;font-size:15px;color:var(--ink)">Decomposição do Salário Bruto (Destino de Cada Real)</h3>' +
      '<div style="font-size:12px;color:var(--ink-3);margin-top:2px">Distribuição proporcional do rendimento bruto entre recebimento líquido e retenções</div>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:700;color:var(--ink-2)">Base Bruta: ' + brl(tot.vantagens) + '</div>' +
      '</div>' +

      // Barra Segmentada Horizontal Multicor
      '<div style="display:flex;height:28px;border-radius:6px;overflow:hidden;background:var(--surface-3);border:1px solid var(--stroke-soft);margin-bottom:14px;box-shadow:inset 0 1px 2px rgba(0,0,0,.08)">' +
      '<div title="Líquido a Receber: ' + brl(tot.liquido) + ' (' + percLiq + '%)" style="width:' + percLiq + '%;background:#0284c7;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;overflow:hidden;white-space:nowrap;padding:0 4px">' +
      (Number(percLiq) > 18 ? 'Líquido ' + percLiq + '%' : '') +
      '</div>' +
      '<div title="Previdência IPSEMG: ' + brl(tot.previdencia) + ' (' + percPrev + '%)" style="width:' + percPrev + '%;background:#ea580c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;overflow:hidden;white-space:nowrap;padding:0 4px">' +
      (Number(percPrev) > 8 ? 'IPSEMG ' + percPrev + '%' : '') +
      '</div>' +
      '<div title="Imposto de Renda (IRRF): ' + brl(tot.irrf) + ' (' + percIR + '%)" style="width:' + percIR + '%;background:#dc2626;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;overflow:hidden;white-space:nowrap;padding:0 4px">' +
      (Number(percIR) > 8 ? 'IRRF ' + percIR + '%' : '') +
      '</div>' +
      '<div title="Consignados Itaú: ' + brl(tot.consignados) + ' (' + percCons + '%)" style="width:' + percCons + '%;background:#d97706;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;overflow:hidden;white-space:nowrap;padding:0 4px">' +
      (Number(percCons) > 4 ? 'Empr.' : '') +
      '</div>' +
      (Number(percOutros) > 0 ? '<div title="Outros Descontos: ' + percOutros + '%" style="width:' + percOutros + '%;background:#64748b;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;overflow:hidden;white-space:nowrap"></div>' : '') +
      '</div>' +

      // Legenda e Indicadores Especiais de Folha
      '<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;padding-top:10px;border-top:1px solid var(--stroke-soft)">' +
      '<div style="font-size:12px"><span style="display:inline-block;width:10px;height:10px;background:#0284c7;border-radius:2px;margin-right:6px"></span><b>Líquido Itaú:</b> ' + brl(tot.liquido) + ' (' + percLiq + '%)</div>' +
      '<div style="font-size:12px"><span style="display:inline-block;width:10px;height:10px;background:#ea580c;border-radius:2px;margin-right:6px"></span><b>Previdência IPSEMG:</b> ' + brl(tot.previdencia) + ' (' + aliqPrevEfetiva + '% ef.)</div>' +
      '<div style="font-size:12px"><span style="display:inline-block;width:10px;height:10px;background:#dc2626;border-radius:2px;margin-right:6px"></span><b>IRRF Retido:</b> ' + brl(tot.irrf) + ' (' + aliqIREfetiva + '% ef.)</div>' +
      '<div style="font-size:12px"><span style="display:inline-block;width:10px;height:10px;background:#d97706;border-radius:2px;margin-right:6px"></span><b>Consignados:</b> ' + brl(tot.consignados) + ' (' + percMargemConsig + '% margem)</div>' +
      '</div>' +
      '</div>' +

      // Comparativo MoM (Mês Anterior)
      htmlMoM +

      // Grid com Detalhamento de Vantagens e Descontos
      '<div class="grid g-2" style="margin-bottom:20px">' +
      '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="margin:0;color:var(--entrada)">▲ Vantagens Detalhadas</h3>' +
      '<div style="font-weight:700;color:var(--entrada)">' + brl(tot.vantagens) + '</div>' +
      '</div>' +
      rowsVantagensVisual +
      '</div>' +

      '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="margin:0;color:var(--saida)">▼ Descontos Detalhados</h3>' +
      '<div style="font-weight:700;color:var(--saida)">' + brl(tot.descontos) + '</div>' +
      '</div>' +
      rowsDescontosVisual +
      '</div>' +
      '</div>' +

      // Gráfico Histórico Evolutivo Aprimorado
      '<div class="card" style="padding:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px">' +
      '<div>' +
      '<h3 style="margin:0;font-size:15px">Evolução Mensal dos Proventos (Bruto vs Líquido vs Descontos)</h3>' +
      '<div style="font-size:12px;color:var(--ink-3);margin-top:2px">Acompanhe a trajetória salarial e clique em qualquer mês para abrir o respectivo demonstrativo</div>' +
      '</div>' +

      // Seletores de Tipo e Período do Gráfico
      '<div class="inline" style="gap:10px">' +
      '<div class="inline" style="gap:4px;background:var(--surface-2);padding:3px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
      '<button class="btn ' + (stProv.dashTipoGraf === 'barras' ? 'pri' : '') + '" data-graf-tipo="barras" style="padding:4px 10px;font-size:11.5px">▦ Barras</button>' +
      '<button class="btn ' + (stProv.dashTipoGraf === 'linha' ? 'pri' : '') + '" data-graf-tipo="linha" style="padding:4px 10px;font-size:11.5px">📈 Linhas</button>' +
      '</div>' +
      '<div class="inline" style="gap:4px;background:var(--surface-2);padding:3px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
      '<button class="btn ' + (stProv.dashPeriodo === '6m' ? 'pri' : '') + '" data-graf-periodo="6m" style="padding:4px 8px;font-size:11.5px">6 Meses</button>' +
      '<button class="btn ' + (stProv.dashPeriodo === 'ano' ? 'pri' : '') + '" data-graf-periodo="ano" style="padding:4px 8px;font-size:11.5px">Ano ' + (cc.mes ? cc.mes.slice(0, 4) : '2026') + '</button>' +
      '<button class="btn ' + (stProv.dashPeriodo === 'tudo' ? 'pri' : '') + '" data-graf-periodo="tudo" style="padding:4px 8px;font-size:11.5px">Todos</button>' +
      '</div>' +
      '</div>' +
      '</div>' +

      // Legenda explicativa do gráfico
      '<div style="display:flex;gap:16px;font-size:12px;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--stroke-soft);flex-wrap:wrap">' +
      '<span><i style="display:inline-block;width:12px;height:12px;background:#10b981;border-radius:2px;margin-right:5px;vertical-align:-1px"></i> <b>Salário Bruto</b> (Vantagens)</span>' +
      '<span><i style="display:inline-block;width:12px;height:12px;background:#ef4444;border-radius:2px;margin-right:5px;vertical-align:-1px"></i> <b>Total Descontos</b> (Retenções)</span>' +
      '<span><i style="display:inline-block;width:12px;height:12px;background:#0284c7;border-radius:2px;margin-right:5px;vertical-align:-1px"></i> <b>Salário Líquido</b> (Disponível Itaú)</span>' +
      '<div class="spacer"></div>' +
      '<span style="color:#0284c7;font-weight:600">★ Mês atualmente selecionado em destaque</span>' +
      '</div>' +

      '<div id="chart-hist-mensal" style="min-height:300px;width:100%"></div>' +
      '</div>';
  }

  function renderGraficosDashMes(cc, tot, lista) {
    var hostH = document.getElementById('chart-hist-mensal');
    if (hostH) {
      renderGraficoEvolucaoMensal(hostH, lista, cc.id || cc.mes, stProv.dashTipoGraf || 'barras', stProv.dashPeriodo || 'ano');
    }
  }

  /* --------------------------------------------------------------------------
     RENDERIZADOR SVG DEDICADO DE ALTA NITIDEZ PARA A EVOLUÇÃO MENSAL
     -------------------------------------------------------------------------- */
  function renderGraficoEvolucaoMensal(host, lista, mesAtualId, tipoGraf, periodo) {
    if (!host) return;
    host.innerHTML = '';

    var listaMensal = lista.filter(function (c) { return c.tipoFolha === 'mensal'; });
    var dados = listaMensal;

    if (periodo === '6m') {
      var idx = listaMensal.findIndex(function (c) { return (c.id || c.mes) === mesAtualId; });
      if (idx >= 0) {
        var start = Math.max(0, idx - 2);
        var end = Math.min(listaMensal.length, start + 6);
        if (end - start < 6 && start > 0) start = Math.max(0, end - 6);
        dados = listaMensal.slice(start, end);
      } else {
        dados = listaMensal.slice(Math.max(0, listaMensal.length - 6));
      }
    } else if (periodo === 'ano') {
      var anoSel = mesAtualId ? mesAtualId.slice(0, 4) : '2026';
      dados = listaMensal.filter(function (c) { return c.mes && c.mes.slice(0, 4) === anoSel; });
      if (dados.length === 0) dados = listaMensal.slice(Math.max(0, listaMensal.length - 12));
    }

    if (!dados || dados.length === 0) {
      host.innerHTML = '<div class="empty" style="padding:40px;text-align:center">Nenhum dado para o período selecionado.</div>';
      return;
    }

    var w = host.clientWidth || 700;
    var h = 300;
    var pad = { t: 26, r: 24, b: 38, l: 68 };
    var iw = Math.max(100, w - pad.l - pad.r);
    var ih = Math.max(100, h - pad.t - pad.b);

    var itensMes = dados.map(function (c) {
      var t = ProventosMG.totaisMes(c);
      var mesNome = global.Engine ? global.Engine.mesLabel(c.mes) : c.mes;
      var isAtual = (c.id || c.mes) === mesAtualId;
      return {
        id: c.id || c.mes,
        mes: c.mes,
        label: mesNome,
        bruto: t.vantagens,
        descontos: t.descontos,
        liquido: t.liquido,
        previdencia: t.previdencia,
        irrf: t.irrf,
        consignados: t.consignados,
        isAtual: isAtual
      };
    });

    var maxVal = Math.max.apply(null, itensMes.map(function (d) { return Math.max(d.bruto, d.liquido, d.descontos); }));
    maxVal = Math.ceil((maxVal * 1.15) / 1000) * 1000;
    if (maxVal < 6000) maxVal = 14000;

    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', String(h));
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.style.overflow = 'visible';

    // Grid Y
    var steps = 4;
    for (var i = 0; i <= steps; i++) {
      var val = (maxVal / steps) * i;
      var y = pad.t + ih - (val / maxVal) * ih;

      var line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', String(pad.l));
      line.setAttribute('x2', String(w - pad.r));
      line.setAttribute('y1', String(y));
      line.setAttribute('y2', String(y));
      line.setAttribute('stroke', 'var(--chart-grid)');
      line.setAttribute('stroke-dasharray', i === 0 ? 'none' : '3 3');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);

      var txt = document.createElementNS(NS, 'text');
      txt.setAttribute('x', String(pad.l - 8));
      txt.setAttribute('y', String(y + 4));
      txt.setAttribute('text-anchor', 'end');
      txt.setAttribute('fill', 'var(--ink-3)');
      txt.setAttribute('font-size', '11px');
      txt.setAttribute('font-family', 'var(--sans)');
      txt.textContent = 'R$ ' + (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val);
      svg.appendChild(txt);
    }

    var n = itensMes.length;
    var colW = iw / n;

    if (tipoGraf === 'barras') {
      var bWidth = Math.max(5, Math.min(22, (colW - 14) / 3));

      itensMes.forEach(function (it, idx) {
        var cx = pad.l + colW * idx + colW / 2;
        var startX = cx - (bWidth * 3 + 4) / 2;

        // Fundo e borda destacados para o mês selecionado
        if (it.isAtual) {
          var bgRect = document.createElementNS(NS, 'rect');
          bgRect.setAttribute('x', String(pad.l + colW * idx + 2));
          bgRect.setAttribute('y', String(pad.t - 8));
          bgRect.setAttribute('width', String(colW - 4));
          bgRect.setAttribute('height', String(ih + 14));
          bgRect.setAttribute('rx', '6');
          bgRect.setAttribute('fill', 'rgba(2,132,199,0.09)');
          bgRect.setAttribute('stroke', 'rgba(2,132,199,0.35)');
          bgRect.setAttribute('stroke-width', '1.5');
          svg.appendChild(bgRect);

          var selBadge = document.createElementNS(NS, 'text');
          selBadge.setAttribute('x', String(cx));
          selBadge.setAttribute('y', String(pad.t - 12));
          selBadge.setAttribute('text-anchor', 'middle');
          selBadge.setAttribute('fill', '#0284c7');
          selBadge.setAttribute('font-size', '9.5px');
          selBadge.setAttribute('font-weight', '800');
          selBadge.textContent = '★ SELECIONADO';
          svg.appendChild(selBadge);
        }

        // 3 Barras Lado a Lado: Bruto, Descontos, Líquido
        var seriesBars = [
          { val: it.bruto, cor: '#10b981', nome: 'Salário Bruto', x: startX },
          { val: it.descontos, cor: '#ef4444', nome: 'Descontos', x: startX + bWidth + 2 },
          { val: it.liquido, cor: '#0284c7', nome: 'Salário Líquido', x: startX + (bWidth + 2) * 2 }
        ];

        seriesBars.forEach(function (sb) {
          var barH = Math.max(3, (sb.val / maxVal) * ih);
          var barY = pad.t + ih - barH;

          var r = document.createElementNS(NS, 'rect');
          r.setAttribute('x', String(sb.x));
          r.setAttribute('y', String(barY));
          r.setAttribute('width', String(bWidth));
          r.setAttribute('height', String(barH));
          r.setAttribute('rx', '3');
          r.setAttribute('fill', sb.cor);
          r.setAttribute('opacity', it.isAtual ? '1' : '0.82');
          r.style.cursor = 'pointer';

          r.addEventListener('mousemove', function (ev) {
            r.setAttribute('opacity', '1');
            mostrarTooltipCustom(ev, it);
          });
          r.addEventListener('mouseleave', function () {
            r.setAttribute('opacity', it.isAtual ? '1' : '0.82');
            esconderTooltipCustom();
          });
          r.addEventListener('click', function () {
            stProv.idRef = it.id;
            global.App && global.App.render();
          });

          svg.appendChild(r);
        });

        // Label do Eixo X
        var txtX = document.createElementNS(NS, 'text');
        txtX.setAttribute('x', String(cx));
        txtX.setAttribute('y', String(h - 12));
        txtX.setAttribute('text-anchor', 'middle');
        txtX.setAttribute('fill', it.isAtual ? 'var(--ink)' : 'var(--ink-3)');
        txtX.setAttribute('font-size', '11.5px');
        txtX.setAttribute('font-weight', it.isAtual ? '800' : '500');
        txtX.style.cursor = 'pointer';
        txtX.textContent = it.label;
        txtX.addEventListener('click', function () {
          stProv.idRef = it.id;
          global.App && global.App.render();
        });
        svg.appendChild(txtX);
      });
    } else {
      // Modo Linha de Tendência
      var getX = function (i) { return pad.l + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw); };
      var getY = function (v) { return pad.t + ih - (v / maxVal) * ih; };

      // Área sombreada do Líquido
      var pathArea = 'M ' + getX(0) + ' ' + getY(itensMes[0].liquido);
      for (var j = 1; j < n; j++) {
        pathArea += ' L ' + getX(j) + ' ' + getY(itensMes[j].liquido);
      }
      pathArea += ' L ' + getX(n - 1) + ' ' + (pad.t + ih) + ' L ' + getX(0) + ' ' + (pad.t + ih) + ' Z';

      var pArea = document.createElementNS(NS, 'path');
      pArea.setAttribute('d', pathArea);
      pArea.setAttribute('fill', 'rgba(2,132,199,0.12)');
      svg.appendChild(pArea);

      // Linhas das Séries
      var sLines = [
        { key: 'bruto', cor: '#10b981', w: '2.5', dash: '' },
        { key: 'descontos', cor: '#ef4444', w: '2', dash: '4 4' },
        { key: 'liquido', cor: '#0284c7', w: '3', dash: '' }
      ];

      sLines.forEach(function (sl) {
        var d = 'M ' + getX(0) + ' ' + getY(itensMes[0][sl.key]);
        for (var k = 1; k < n; k++) {
          d += ' L ' + getX(k) + ' ' + getY(itensMes[k][sl.key]);
        }
        var path = document.createElementNS(NS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', sl.cor);
        path.setAttribute('stroke-width', sl.w);
        if (sl.dash) path.setAttribute('stroke-dasharray', sl.dash);
        path.setAttribute('stroke-linejoin', 'round');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
      });

      // Pontos e Zonas Interativas
      itensMes.forEach(function (it, idx) {
        var px = getX(idx);

        if (it.isAtual) {
          var vl = document.createElementNS(NS, 'line');
          vl.setAttribute('x1', String(px));
          vl.setAttribute('x2', String(px));
          vl.setAttribute('y1', String(pad.t));
          vl.setAttribute('y2', String(pad.t + ih));
          vl.setAttribute('stroke', '#0284c7');
          vl.setAttribute('stroke-width', '1.5');
          vl.setAttribute('stroke-dasharray', '2 2');
          svg.appendChild(vl);

          var sBadge = document.createElementNS(NS, 'text');
          sBadge.setAttribute('x', String(px));
          sBadge.setAttribute('y', String(pad.t - 10));
          sBadge.setAttribute('text-anchor', 'middle');
          sBadge.setAttribute('fill', '#0284c7');
          sBadge.setAttribute('font-size', '9.5px');
          sBadge.setAttribute('font-weight', '800');
          sBadge.textContent = '★ SELECIONADO';
          svg.appendChild(sBadge);
        }

        var circ = document.createElementNS(NS, 'circle');
        circ.setAttribute('cx', String(px));
        circ.setAttribute('cy', String(getY(it.liquido)));
        circ.setAttribute('r', it.isAtual ? '6' : '4');
        circ.setAttribute('fill', '#0284c7');
        circ.setAttribute('stroke', '#ffffff');
        circ.setAttribute('stroke-width', '2');
        circ.style.cursor = 'pointer';

        var hitZone = document.createElementNS(NS, 'rect');
        hitZone.setAttribute('x', String(px - colW / 2));
        hitZone.setAttribute('y', String(pad.t));
        hitZone.setAttribute('width', String(colW));
        hitZone.setAttribute('height', String(ih));
        hitZone.setAttribute('fill', 'transparent');
        hitZone.style.cursor = 'pointer';

        hitZone.addEventListener('mousemove', function (ev) {
          circ.setAttribute('r', '7');
          mostrarTooltipCustom(ev, it);
        });
        hitZone.addEventListener('mouseleave', function () {
          circ.setAttribute('r', it.isAtual ? '6' : '4');
          esconderTooltipCustom();
        });
        hitZone.addEventListener('click', function () {
          stProv.idRef = it.id;
          global.App && global.App.render();
        });

        svg.appendChild(circ);
        svg.appendChild(hitZone);

        // Label do Eixo X
        var txtX = document.createElementNS(NS, 'text');
        txtX.setAttribute('x', String(px));
        txtX.setAttribute('y', String(h - 12));
        txtX.setAttribute('text-anchor', 'middle');
        txtX.setAttribute('fill', it.isAtual ? 'var(--ink)' : 'var(--ink-3)');
        txtX.setAttribute('font-size', '11.5px');
        txtX.setAttribute('font-weight', it.isAtual ? '800' : '500');
        txtX.textContent = it.label;
        svg.appendChild(txtX);
      });
    }

    host.appendChild(svg);
  }

  /* Tooltip Flutuante dos Gráficos */
  var tipEl = null;
  function mostrarTooltipCustom(ev, it) {
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'tip';
      tipEl.style.position = 'fixed';
      tipEl.style.pointerEvents = 'none';
      tipEl.style.zIndex = '9999';
      document.body.appendChild(tipEl);
    }
    var percDesc = it.bruto > 0 ? ((it.descontos / it.bruto) * 100).toFixed(1) : '0';
    var percLiq = it.bruto > 0 ? ((it.liquido / it.bruto) * 100).toFixed(1) : '0';

    var html = '<div style="font-weight:700;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.15);padding-bottom:4px;margin-bottom:6px">' +
      it.label + (it.isAtual ? ' <span style="background:#0284c7;color:#fff;padding:1px 5px;border-radius:4px;font-size:10px">Mês Selecionado</span>' : '') +
      '</div>' +
      '<div class="row"><span><i style="background:#10b981"></i> Salário Bruto</span><span class="num">' + brl(it.bruto) + '</span></div>' +
      '<div class="row"><span><i style="background:#ef4444"></i> Total Descontos (' + percDesc + '%)</span><span class="num">' + brl(it.descontos) + '</span></div>' +
      '<div class="row" style="font-weight:700;border-top:1px solid rgba(255,255,255,0.15);padding-top:4px;margin-top:4px"><span><i style="background:#0284c7"></i> Salário Líquido (' + percLiq + '%)</span><span class="num" style="color:#38bdf8">' + brl(it.liquido) + '</span></div>' +
      '<div class="row" style="font-size:11px;color:var(--ink-3);margin-top:2px"><span>IPSEMG: ' + brl(it.previdencia) + ' · IRRF: ' + brl(it.irrf) + ' · Consig: ' + brl(it.consignados) + '</span></div>' +
      '<div style="font-size:10.5px;color:#94a3b8;margin-top:6px;font-style:italic">Clique para abrir este demonstrativo</div>';

    tipEl.innerHTML = html;
    tipEl.style.opacity = '1';
    var r = tipEl.getBoundingClientRect();
    var x = ev.clientX + 14, y = ev.clientY - r.height - 12;
    if (x + r.width > window.innerWidth - 8) x = ev.clientX - r.width - 14;
    if (y < 8) y = ev.clientY + 18;
    tipEl.style.left = x + 'px';
    tipEl.style.top = y + 'px';
  }

  function esconderTooltipCustom() {
    if (tipEl) tipEl.style.opacity = '0';
  }

  /* --------------------------------------------------------------------------
     ABA 3: DASHBOARD ANUAL & COMPARATIVO
     -------------------------------------------------------------------------- */
  function renderAbaDashAno(db, resumoAno, anosDisponiveis) {
    var seletorAnoHTML =
      '<div class="inline" style="gap:8px;margin-bottom:16px">' +
      '<label style="font-size:12px;font-weight:600;color:var(--ink-3)">SELECIONAR ANO EXERCÍCIO:</label>' +
      '<select id="prov-sel-ano" style="font-weight:600;padding:5px 12px;border-radius:var(--r-sm);border:1px solid var(--stroke)">' +
      anosDisponiveis.map(function (a) {
        return '<option value="' + a + '"' + (a === stProv.ano ? ' selected' : '') + '>Exercício ' + a + '</option>';
      }).join('') +
      '</select>' +
      '</div>';

    var rowsAno = (resumoAno.meses || []).map(function (c) {
      var t = ProventosMG.totaisMes(c);
      var nomeDoc = ProventosMG.getLabelDemonstrativo(c);
      var tagTipo = c.tipoFolha === '13o' ? '<span class="tag warn">13º Salário</span>' : '<span class="tag real">Mensal</span>';
      return '<tr>' +
        '<td><b>' + h(nomeDoc) + '</b></td>' +
        '<td>' + tagTipo + '</td>' +
        '<td class="r num" style="color:var(--entrada);font-weight:600">' + brl(t.vantagens) + '</td>' +
        '<td class="r num" style="color:var(--saida)">' + brl(t.descontos) + '</td>' +
        '<td class="r num" style="color:#0284c7;font-weight:700">' + brl(t.liquido) + '</td>' +
        '<td class="r num" style="color:var(--ink-3)">' + brl(t.previdencia) + '</td>' +
        '<td class="r num" style="color:var(--ink-3)">' + brl(t.irrf) + '</td>' +
        '<td class="r num" style="color:#d97706">' + brl(t.consignados) + '</td>' +
        '</tr>';
    }).join('') || '<tr><td colspan="8" class="empty">Nenhum dado para este ano.</td></tr>';

    return '' +
      seletorAnoHTML +

      // KPIs Anuais
      '<div class="grid g-kpi" style="margin-bottom:16px">' +
      '<div class="kpi acc-in"><div class="lb">Total Bruto Acumulado (' + h(stProv.ano) + ')</div><div class="vl">' + brl(resumoAno.totalBruto) + '</div><div class="ft">Média mensal ' + brl(resumoAno.mediaBruta) + '</div></div>' +
      '<div class="kpi acc-out"><div class="lb">Total Descontos Acumulado</div><div class="vl">' + brl(resumoAno.totalDescontos) + '</div><div class="ft">Retenções totais no exercício</div></div>' +
      '<div class="kpi acc-in"><div class="lb">Total Líquido Recebido</div><div class="vl">' + brl(resumoAno.totalLiquido) + '</div><div class="ft">Média mensal ' + brl(resumoAno.mediaLiquida) + '</div></div>' +
      '<div class="kpi acc-am"><div class="lb">Total Consignados Pagos</div><div class="vl">' + brl(resumoAno.totalConsignados) + '</div><div class="ft">Amortizações em folha</div></div>' +
      '</div>' +

      // Segunda Linha Anual: Declaração IRPF & Previdência
      '<div class="grid g-kpi" style="margin-bottom:20px">' +
      '<div class="kpi acc-am"><div class="lb">Previdência Acumulada (IPSEMG)</div><div class="vl">' + brl(resumoAno.totalPrevidencia) + '</div><div class="ft">Dedução anual para IRPF</div></div>' +
      '<div class="kpi acc-out"><div class="lb">IRRF Acumulado Retido</div><div class="vl">' + brl(resumoAno.totalIRRF) + '</div><div class="ft">Imposto de Renda Retido na Fonte</div></div>' +
      '<div class="kpi acc-in"><div class="lb">Auxílio Alimentação Anual</div><div class="vl">' + brl(resumoAno.totalAlimentacao) + '</div><div class="ft">Rendimento isento/indenizatório</div></div>' +
      '<div class="kpi acc-br"><div class="lb">Total Extras + Noturno</div><div class="vl">' + brl(resumoAno.totalHorasENoturno) + '</div><div class="ft">Rendimento variável no ano</div></div>' +
      '</div>' +

      // Gráficos do Ano
      '<div class="card" style="margin-bottom:20px"><h3>Comparativo Mensal do Exercício ' + h(stProv.ano) + '</h3><div id="chart-ano-barras" style="min-height:280px"></div></div>' +

      // Tabela Anual Consolidada
      '<div class="card">' +
      '<h3>Tabela Detalhada dos Demonstrativos de ' + h(stProv.ano) + '</h3>' +
      '<div class="tw"><table>' +
      '<thead><tr><th>Competência / Demonstrativo</th><th>Tipo</th><th class="r">Bruto</th><th class="r">Descontos</th><th class="r">Líquido</th><th class="r">Previdência</th><th class="r">IRRF</th><th class="r">Consignados</th></tr></thead>' +
      '<tbody>' + rowsAno + '</tbody>' +
      '<tfoot><tr style="background:var(--surface-3);font-weight:700">' +
      '<td colspan="2">TOTAL ACUMULADO ' + h(stProv.ano) + ':</td>' +
      '<td class="r num" style="color:var(--entrada)">' + brl(resumoAno.totalBruto) + '</td>' +
      '<td class="r num" style="color:var(--saida)">' + brl(resumoAno.totalDescontos) + '</td>' +
      '<td class="r num" style="color:#0284c7;font-size:14px">' + brl(resumoAno.totalLiquido) + '</td>' +
      '<td class="r num">' + brl(resumoAno.totalPrevidencia) + '</td>' +
      '<td class="r num">' + brl(resumoAno.totalIRRF) + '</td>' +
      '<td class="r num" style="color:#d97706">' + brl(resumoAno.totalConsignados) + '</td>' +
      '</tr></tfoot>' +
      '</table></div>' +
      '</div>';
  }

  function renderGraficosDashAno(resumoAno) {
    var hostB = document.getElementById('chart-ano-barras');
    if (hostB && global.Charts && resumoAno.meses && resumoAno.meses.length) {
      var labels = resumoAno.meses.map(function (c) {
        return c.tipoFolha === '13o' ? '13º Sal.' : (global.Engine ? global.Engine.mesLabel(c.mes) : c.mes);
      });
      var dadosLiq = resumoAno.meses.map(function (c) { return ProventosMG.totaisMes(c).liquido; });
      var dadosDesc = resumoAno.meses.map(function (c) { return ProventosMG.totaisMes(c).descontos; });

      global.Charts.barras(hostB, {
        labels: labels,
        series: [
          { nome: 'Salário Líquido', dados: dadosLiq, cor: '#0284c7' },
          { nome: 'Total Descontos', dados: dadosDesc, cor: '#dc2626' }
        ]
      });
    }
  }

  /* --------------------------------------------------------------------------
     ABA 4: TABELA CONSOLIDADA DE TODOS OS DEMONSTRATIVOS
     -------------------------------------------------------------------------- */
  function renderAbaTabelaConsolidada(lista) {
    var rows = lista.map(function (c) {
      var t = ProventosMG.totaisMes(c);
      var nomeDoc = ProventosMG.getLabelDemonstrativo(c);
      var tagTipo = c.tipoFolha === '13o' ? '<span class="tag warn">13º Salário</span>' : '<span class="tag real">Mensal</span>';
      var id = c.id || c.mes;

      return '<tr>' +
        '<td><b>' + h(nomeDoc) + '</b></td>' +
        '<td>' + tagTipo + '</td>' +
        '<td class="r num" style="color:var(--entrada);font-weight:600">' + brl(t.vantagens) + '</td>' +
        '<td class="r num" style="color:var(--saida)">' + brl(t.descontos) + '</td>' +
        '<td class="r num" style="color:#0284c7;font-weight:700">' + brl(t.liquido) + '</td>' +
        '<td class="r num">' + brl(t.previdencia) + '</td>' +
        '<td class="r num">' + brl(t.irrf) + '</td>' +
        '<td class="r num" style="color:#d97706">' + brl(t.consignados) + '</td>' +
        '<td class="c actions">' +
        '<button class="btn" style="padding:3px 8px;font-size:11.5px" data-ver-cc="' + id + '">Ver Demonstrativo</button>' +
        '</td>' +
        '</tr>';
    }).join('');

    return '' +
      '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="margin:0">Histórico Completo de Demonstrativos de Pagamento</h3>' +
      '<div style="font-size:12px;color:var(--ink-3)">Total de ' + lista.length + ' demonstrativos cadastrados</div>' +
      '</div>' +
      '<div class="tw"><table>' +
      '<thead><tr><th>Competência / Demonstrativo</th><th>Tipo</th><th class="r">Total Bruto</th><th class="r">Total Descontos</th><th class="r">Líquido a Receber</th><th class="r">Previdência</th><th class="r">IRRF</th><th class="r">Consignados</th><th class="c">Ação</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div>' +
      '</div>';
  }

  /* --------------------------------------------------------------------------
     EXTRATOR INTELIGENTE E RIGOROSO DE DEMONSTRATIVO SEPLAG MG (PDF OU TEXTO)
     -------------------------------------------------------------------------- */
  ProventosMG.parseContrachequeSEPLAG = function (rawText) {
    if (!rawText || typeof rawText !== 'string') return null;
    var text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 1. Extração do Mês / Ano da Competência
    var mesDetectado = null;
    var mesesNomes = {
      'janeiro': '01', 'fevereiro': '02', 'marco': '03', 'março': '03', 'abril': '04',
      'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08', 'setembro': '09',
      'outubro': '10', 'novembro': '11', 'dezembro': '12'
    };
    var mMesAno = text.match(/(?:DEMONSTRATIVO DE PAGAMENTO\s*[-–—]\s*)?([A-Za-zçÇãÃéÉ]+)\s*[\/\-]\s*(\d{4})/i);
    if (mMesAno) {
      var nomeMes = mMesAno[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      var ano = mMesAno[2];
      if (/decimo|13/i.test(nomeMes)) mesDetectado = ano + '-13';
      else if (mesesNomes[nomeMes]) mesDetectado = ano + '-' + mesesNomes[nomeMes];
    }
    if (!mesDetectado) {
      var mNum = text.match(/(\d{4})[-/](0[1-9]|1[0-2])/) || text.match(/(0[1-9]|1[0-2])[-/](\d{4})/);
      if (mNum) {
        if (mNum[1].length === 4) mesDetectado = mNum[1] + '-' + mNum[2];
        else mesDetectado = mNum[2] + '-' + mNum[1];
      }
    }

    // 2. Extração dos Dados Cadastrais do Servidor
    var servidor = {};
    var mNome = text.match(/Nome:\s*([A-Za-zÀ-ÿ\s]+?)(?=\s+MASP:|\s+CPF:|\s+Pis|\n|$)/i);
    if (mNome && mNome[1].trim()) servidor.nome = mNome[1].trim();

    var mMasp = text.match(/MASP:\s*([0-9.\-]+)/i);
    if (mMasp) servidor.masp = mMasp[1].trim();

    var mCpf = text.match(/CPF:\s*([0-9.\-]+)/i);
    if (mCpf) servidor.cpf = mCpf[1].trim();

    var mPis = text.match(/Pis\/Pasep:\s*([0-9.\-]+)/i);
    if (mPis) servidor.pisPasep = mPis[1].trim();

    var mBanco = text.match(/Banco:\s*([A-Za-zÀ-ÿ0-9\s]+?)(?=\s+Ag[eê]ncia:|\n|$)/i);
    var mAg = text.match(/Ag[eê]ncia:\s*([0-9\-]+)/i);
    var mCc = text.match(/Conta:\s*([0-9\-]+)/i);
    if (mBanco || mAg || mCc) {
      servidor.bancoRecebimento = (mBanco ? mBanco[1].trim() : 'Banco Itaú') +
        (mAg ? ' · Ag ' + mAg[1].trim() : '') +
        (mCc ? ' · CC ' + mCc[1].trim() : '');
    }

    var mCargo = text.match(/Cargo Admissão Nome do Cargo.*?Situação Funcional Órgão\/Entidade\s*(.+?)(?=Vantagens e Descontos|Vantagens\s+Admissão|\n\s*Vantagens|$)/is);
    if (mCargo) {
      var rawCargo = mCargo[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      if (/Efetivo/i.test(rawCargo)) servidor.situacao = 'Efetivo (apos Lei 64/2002)';
      if (/Secretaria de Justica/i.test(rawCargo) || /SEJUSP/i.test(rawCargo)) servidor.orgao = 'Secretaria de Justica e Seguranca Publica';
      if (/AGSE|Agente de Seguran/i.test(rawCargo)) servidor.cargo = 'Agente de Seguranca Socioeducativo (AGSE) / Dad-1 (DAD-1)';
    }

    // 3. Separação dos Blocos de Vantagens e Descontos
    var idxVant = text.search(/Vantagens\s+(?:Admiss[aã]o|Refer[eê]ncia|Descri[cç][aã]o|1\s+Normal)/i);
    if (idxVant < 0) idxVant = text.search(/\bVantagens\b/i);

    var idxDesc = text.search(/Descontos\s+(?:Admiss[aã]o|Refer[eê]ncia|Descri[cç][aã]o|1\s+Normal)/i);
    if (idxDesc < 0) idxDesc = text.search(/\bDescontos\b/i);

    var bVant = idxVant >= 0 ? text.substring(idxVant, idxDesc >= 0 ? idxDesc : undefined) : text;
    var bDesc = idxDesc >= 0 ? text.substring(idxDesc) : '';

    function extrairRubricas(bloco, tipoPadrao) {
      var limpo = bloco
        .replace(/^(?:Vantagens|Descontos)\s+e\s+Descontos/gi, ' ')
        .replace(/(?:Vantagens|Descontos)\s+Admiss[aã]o\s+Refer[eê]ncia\s+Descri[cç][aã]o\s+Especifica[cç][aã]o\s+Parcela\s+(?:Vantagens|Descontos)\s*\(R\$\)/gi, ' ')
        .replace(/Total:\s*R?\$?\s*[\d.,]+/gi, ' ')
        .replace(/Valor a receber.*?$/is, ' ')
        .replace(/Ocorr[eê]ncias.*?$/is, ' ')
        .replace(/Para comprovar.*?$/is, ' ')
        .trim();

      // Expressão para extrair cada linha da tabela: Adm | Ref | Descrição | Espec | Parcela | Valor
      var re = /(?:^|\s+)(\d{1,2})\s+(Normal|Atrasado|Complementar|13[ºo]\s*Sal[aá]rio|F[eé]rias)\s+(.+?)\s+([0-9]+(?:\.[0-9]+)?|-)\s+([-\d/]+)\s+([0-9]{1,3}(?:\.[0-9]{3})*,[0-9]{2}|[0-9]+,[0-9]{2})(?=\s+\d{1,2}\s+(?:Normal|Atrasado|Complementar|13[ºo]|F[eé]rias)|$)/gi;

      var res = [];
      var match;
      while ((match = re.exec(limpo)) !== null) {
        var adm = match[1] || '1';
        var ref = match[2] || 'Normal';
        var desc = match[3].trim().replace(/^(?:Vantagens|Descontos)\s*/i, '').trim();
        var espec = match[4] || '0';
        var parc = match[5] || '-';
        var valStr = match[6].replace(/\./g, '').replace(',', '.');
        var valor = r2(parseFloat(valStr));

        if (!desc || isNaN(valor) || valor <= 0) continue;

        var tipo = 'outro';
        if (/vencimento|subs[ií]dio|b[aá]sico/i.test(desc)) tipo = 'vencimento';
        else if (/desempenho|ade\b/i.test(desc)) tipo = 'adicional';
        else if (/extraord|hora extra/i.test(desc)) tipo = 'hora_extra';
        else if (/noturno/i.test(desc)) tipo = 'noturno';
        else if (/aliment|refei[cç]/i.test(desc)) tipo = 'alimentacao';
        else if (/vestimenta|fardamento|abono/i.test(desc)) tipo = 'abono';
        else if (/grat|opcao/i.test(desc)) tipo = 'gratificacao';
        else if (/f[eé]rias|ter[cç]o/i.test(desc)) tipo = 'ferias';
        else if (/previd|rpps|ipsemg|art\.\s*28/i.test(desc)) tipo = 'previdencia';
        else if (/irrf|renda/i.test(desc)) tipo = 'irrf';
        else if (/sindic/i.test(desc)) tipo = 'sindicato';
        else if (/empr|consign|itau|banco/i.test(desc)) tipo = 'consignado';
        else if (/rep\.|estorno|devol/i.test(desc)) tipo = 'estorno';

        res.push({
          adm: adm,
          ref: ref,
          desc: desc,
          espec: espec,
          parc: parc,
          valor: valor,
          tipo: tipo
        });
      }

      // Fallback para linhas manuais simples se regex de tabela não encontrou nada
      if (res.length === 0 && tipoPadrao) {
        var linhas = limpo.split('\n');
        linhas.forEach(function (ln) {
          var l = ln.trim();
          if (!l || l.length < 4) return;
          if (/Total:|Valor a receber|Ocorr[eê]ncias|Para comprovar/i.test(l)) return;
          var matchVal = l.match(/(\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2})/g);
          if (!matchVal) return;
          var sVal = matchVal[matchVal.length - 1].replace(/\./g, '').replace(',', '.');
          var v = r2(parseFloat(sVal));
          if (isNaN(v) || v <= 0) return;
          var dLimpa = l.replace(matchVal[matchVal.length - 1], '').replace(/^\d+\s*[-–]?\s*/, '').trim();
          if (!dLimpa) return;
          res.push({
            adm: '1',
            ref: 'Normal',
            desc: dLimpa,
            espec: '0',
            parc: '-',
            valor: v,
            tipo: 'outro'
          });
        });
      }

      return res;
    }

    var vantagens = extrairRubricas(bVant, 'vantagem');
    var descontos = extrairRubricas(bDesc, 'desconto');

    var totV = r2(vantagens.reduce(function (a, b) { return a + (b.valor || 0); }, 0));
    var totD = r2(descontos.reduce(function (a, b) { return a + (b.valor || 0); }, 0));
    var totLiq = r2(totV - totD);

    return {
      mes: mesDetectado,
      servidor: servidor,
      vantagens: vantagens,
      descontos: descontos,
      totais: {
        vantagens: totV,
        descontos: totD,
        liquido: totLiq
      }
    };
  };

  /* --------------------------------------------------------------------------
     MODAL INTELIGENTE DE IMPORTAÇÃO DE CONTRACHEQUE SEPLAG (PDF OU TEXTO)
     -------------------------------------------------------------------------- */
  function abrirModalImportarContracheque(db, ccAtual, lista) {
    var modalHTML =
      '<div style="display:flex;flex-direction:column;gap:12px">' +
      '<div class="alert info" style="margin:0"><span class="ic">🔺</span><div style="font-size:12px;line-height:1.4"><b>Importação SEPLAG MG:</b> Selecione o <b>arquivo PDF</b> do contracheque baixado no <i>Portal do Servidor MG</i> ou cole o texto completo do documento. O sistema extrai estritamente as colunas oficiais <b>(Adm, Ref., Descrição, Espec., Parcela, Valor)</b> e sincroniza o líquido no extrato.</div></div>' +
      '<div class="fld"><label>Competência de Destino</label><select id="imp-mes">' +
      lista.map(function (c) {
        var id = c.id || c.mes;
        return '<option value="' + id + '"' + (id === (ccAtual ? (ccAtual.id || ccAtual.mes) : '2026-08') ? ' selected' : '') + '>' + ProventosMG.getLabelDemonstrativo(c) + '</option>';
      }).join('') +
      '</select></div>' +
      '<div style="border:2px dashed var(--stroke);border-radius:var(--r-sm);padding:14px;text-align:center;background:var(--bg-2)">' +
      '<div style="font-size:13px;font-weight:700;color:var(--ink-1);margin-bottom:4px">📄 Carregar Arquivo PDF ou TXT do Contracheque</div>' +
      '<div style="font-size:11.5px;color:var(--ink-3);margin-bottom:10px">Selecione o arquivo .pdf baixado do Portal do Servidor MG</div>' +
      '<input type="file" id="imp-cc-file" accept=".pdf,.txt,.csv" style="display:none">' +
      '<button type="button" class="btn" id="btn-imp-cc-browse" style="padding:6px 16px;background:var(--surface-1);border-color:var(--stroke);font-weight:600">📁 Escolher arquivo PDF / TXT</button>' +
      '<span id="imp-cc-file-name" style="margin-left:10px;font-size:12px;font-weight:600;color:var(--ink-2)"></span>' +
      '</div>' +
      '<div class="fld"><label>Ou cole o texto completo do demonstrativo aqui</label>' +
      '<textarea id="imp-texto" rows="5" placeholder="Cole aqui o texto do demonstrativo de pagamento copiado do Portal do Servidor MG..." style="font-family:monospace;font-size:11.5px;line-height:1.4"></textarea>' +
      '</div>' +
      '<div id="imp-preview" style="font-size:12px;background:var(--surface-2);padding:12px;border-radius:var(--r-sm);border:1px solid var(--stroke);display:none;max-height:280px;overflow-y:auto"></div>' +
      '</div>';

    var ovl = (global.modal ? global.modal : alert)('🔺 Importar Contracheque SEPLAG MG (PDF ou Texto)', modalHTML, function (o) {
      var mesAlvo = document.querySelector('#imp-mes').value;
      var txt = document.querySelector('#imp-texto').value;
      if (!txt || !txt.trim()) {
        global.toast && global.toast('Selecione um arquivo PDF ou cole o texto do contracheque', 'err');
        return false;
      }

      var parsed = ProventosMG.parseContrachequeSEPLAG(txt);
      if (!parsed || (parsed.vantagens.length === 0 && parsed.descontos.length === 0)) {
        global.toast && global.toast('Nenhuma rubrica válida encontrada no texto.', 'err');
        return false;
      }

      if (parsed.mes) mesAlvo = parsed.mes;

      var cc = lista.find(function (c) { return (c.id || c.mes) === mesAlvo; });
      if (!cc) {
        // Cria nova competência se não existia na lista
        cc = {
          id: mesAlvo,
          mes: mesAlvo,
          tipoFolha: mesAlvo.indexOf('-13') >= 0 ? '13o' : 'mensal',
          titulo: mesAlvo.indexOf('-13') >= 0 ? '13º Salário' : 'Folha Mensal',
          vantagens: parsed.vantagens,
          descontos: parsed.descontos
        };
        db.proventosMG.push(cc);
      } else {
        cc.vantagens = parsed.vantagens;
        cc.descontos = parsed.descontos;
      }

      // Atualiza dados cadastrais do servidor se detectados
      if (parsed.servidor && Object.keys(parsed.servidor).length > 0) {
        if (!db.servidor) db.servidor = {};
        Object.keys(parsed.servidor).forEach(function (k) {
          if (parsed.servidor[k]) db.servidor[k] = parsed.servidor[k];
        });
      }

      stProv.idRef = mesAlvo;
      if (mesAlvo && mesAlvo.length >= 4) stProv.ano = mesAlvo.slice(0, 4);

      ProventosMG.sincronizarLancamentos(db);
      if (global.Store) global.Store.touch('Importou contracheque SEPLAG (' + mesAlvo + ')');
      global.toast && global.toast('Contracheque de ' + ProventosMG.getLabelDemonstrativo(cc) + ' importado com sucesso!');
      global.App && global.App.render();
    }, 'Processar e Salvar no Demonstrativo');

    // Função interna para renderizar preview em tempo real
    function atualizarPreview(texto) {
      var prevEl = document.querySelector('#imp-preview');
      var selMes = document.querySelector('#imp-mes');
      if (!prevEl || !texto || !texto.trim()) {
        if (prevEl) prevEl.style.display = 'none';
        return;
      }

      var parsed = ProventosMG.parseContrachequeSEPLAG(texto);
      if (!parsed || (parsed.vantagens.length === 0 && parsed.descontos.length === 0)) {
        prevEl.style.display = 'block';
        prevEl.innerHTML = '<div style="color:var(--saida);font-weight:600">Aguardando dados... Cole o texto do contracheque ou carrege o PDF.</div>';
        return;
      }

      if (parsed.mes && selMes) {
        var optExiste = Array.from(selMes.options).some(function (opt) { return opt.value === parsed.mes; });
        if (!optExiste) {
          var opt = document.createElement('option');
          opt.value = parsed.mes;
          opt.textContent = parsed.mes + ' (Detectado automaticamente)';
          opt.selected = true;
          selMes.appendChild(opt);
        } else {
          selMes.value = parsed.mes;
        }
      }

      var srvInfo = parsed.servidor && parsed.servidor.nome
        ? '<div style="font-size:11.5px;color:var(--ink-2);margin-bottom:6px">👤 <b>' + h(parsed.servidor.nome) + '</b> ' + (parsed.servidor.masp ? '(MASP: ' + h(parsed.servidor.masp) + ')' : '') + '</div>'
        : '';

      var rowsV = parsed.vantagens.map(function (v) {
        return '<tr><td class="c">' + h(v.adm) + '</td><td>' + h(v.ref) + '</td><td><b>' + h(v.desc) + '</b></td><td class="c">' + h(v.espec) + '</td><td class="c">' + h(v.parc) + '</td><td class="r" style="color:var(--entrada);font-weight:600">' + brl(v.valor) + '</td></tr>';
      }).join('');

      var rowsD = parsed.descontos.map(function (d) {
        return '<tr><td class="c">' + h(d.adm) + '</td><td>' + h(d.ref) + '</td><td><b>' + h(d.desc) + '</b></td><td class="c">' + h(d.espec) + '</td><td class="c">' + h(d.parc) + '</td><td class="r" style="color:var(--saida);font-weight:600">' + brl(d.valor) + '</td></tr>';
      }).join('');

      prevEl.style.display = 'block';
      prevEl.innerHTML = '' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid var(--stroke);padding-bottom:6px">' +
        '<div><b style="color:var(--brand)">✓ ' + (parsed.mes ? 'Competência: ' + parsed.mes : 'Dados Identificados') + '</b></div>' +
        '<div style="font-size:11px;color:var(--ink-3)">' + parsed.vantagens.length + ' vantagens · ' + parsed.descontos.length + ' descontos</div>' +
        '</div>' +
        srvInfo +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;text-align:center">' +
        '<div style="background:rgba(16,185,129,0.08);padding:6px;border-radius:4px"><div style="font-size:10px;color:var(--ink-3)">BRUTO</div><div style="font-weight:700;color:var(--entrada)">' + brl(parsed.totais.vantagens) + '</div></div>' +
        '<div style="background:rgba(239,68,68,0.08);padding:6px;border-radius:4px"><div style="font-size:10px;color:var(--ink-3)">DESCONTOS</div><div style="font-weight:700;color:var(--saida)">' + brl(parsed.totais.descontos) + '</div></div>' +
        '<div style="background:rgba(2,132,199,0.08);padding:6px;border-radius:4px"><div style="font-size:10px;color:var(--ink-3)">LÍQUIDO</div><div style="font-weight:800;color:#0284c7">' + brl(parsed.totais.liquido) + '</div></div>' +
        '</div>' +
        '<div style="font-size:11px;font-weight:700;margin-bottom:4px;color:var(--ink-2)">Tabela Extraída (Demonstrativo SEPLAG):</div>' +
        '<div class="tw" style="max-height:160px;overflow-y:auto"><table>' +
        '<thead><tr><th>Adm</th><th>Ref.</th><th>Descrição</th><th class="c">Espec.</th><th class="c">Parcela</th><th class="r">Valor (R$)</th></tr></thead>' +
        '<tbody>' + rowsV + rowsD + '</tbody>' +
        '</table></div>';
    }

    // Lógica do botão de carregar arquivo PDF / TXT e input do textarea
    setTimeout(function () {
      var fileInput = document.querySelector('#imp-cc-file');
      var browseBtn = document.querySelector('#btn-imp-cc-browse');
      var nameSpan = document.querySelector('#imp-cc-file-name');
      var txtArea = document.querySelector('#imp-texto');

      if (txtArea) {
        txtArea.addEventListener('input', function () {
          atualizarPreview(txtArea.value);
        });
      }

      if (browseBtn && fileInput) {
        browseBtn.onclick = function () { fileInput.click(); };
        fileInput.onchange = function () {
          var f = fileInput.files && fileInput.files[0];
          if (!f) return;
          nameSpan.textContent = f.name + ' (' + (f.size / 1024).toFixed(1) + ' KB)';
          
          if (/\.pdf$/i.test(f.name)) {
            global.toast && global.toast('Lendo arquivo PDF do contracheque...', 'info');
            var reader = new FileReader();
            reader.onload = function (e) {
              var typedArray = new Uint8Array(e.target.result);
              if (window.pdfjsLib) {
                window.pdfjsLib.getDocument({ data: typedArray }).promise.then(function (pdf) {
                  var maxPages = Math.min(pdf.numPages, 10);
                  var pagePromises = [];
                  for (var p = 1; p <= maxPages; p++) {
                    pagePromises.push(pdf.getPage(p).then(function (page) {
                      return page.getTextContent().then(function (textContent) {
                        return textContent.items.map(function (item) { return item.str; }).join(' ');
                      });
                    }));
                  }
                  Promise.all(pagePromises).then(function (pagesText) {
                    var fullText = pagesText.join('\n');
                    txtArea.value = fullText;
                    atualizarPreview(fullText);
                    global.toast && global.toast('PDF lido com sucesso! Verifique o preview e clique em Salvar.', 'ok');
                  }).catch(function (err) {
                    fallbackPdf(typedArray, txtArea);
                  });
                }).catch(function (err) {
                  fallbackPdf(typedArray, txtArea);
                });
              } else {
                fallbackPdf(typedArray, txtArea);
              }
            };
            reader.readAsArrayBuffer(f);
          } else {
            var reader = new FileReader();
            reader.onload = function (e) {
              txtArea.value = e.target.result;
              atualizarPreview(e.target.result);
              global.toast && global.toast('Texto carregado! Verifique o preview.', 'ok');
            };
            reader.readAsText(f);
          }
        };
      }
    }, 50);
  }

  function fallbackPdf(typedArray, txtArea) {
    var str = '';
    for (var i = 0; i < typedArray.length; i++) {
      var c = typedArray[i];
      if ((c >= 32 && c <= 126) || c === 10 || c === 13) str += String.fromCharCode(c);
    }
    txtArea.value = str;
    global.toast && global.toast('Conteúdo do PDF extraído!', 'ok');
  }

  /* --------------------------------------------------------------------------
     MODAL DE EDIÇÃO DOS DADOS CADASTRAIS DO SERVIDOR PÚBLICO
     -------------------------------------------------------------------------- */
  function abrirModalEditarServidor(db) {
    var srv = db.servidor || {
      nome: 'Aristides Casendey de Abreu',
      masp: '1191021-3',
      cpf: '041.102.096-09',
      pisPasep: '128.4253.434-6',
      cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
      situacao: 'Efetivo (apos Lei 64/2002)',
      orgao: 'Secretaria de Justica e Seguranca Publica (SEJUSP)',
      bancoRecebimento: 'Banco Itaú · Ag 4980 · CC 23287-2'
    };

    var modalHTML =
      '<div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="fld" style="grid-column:1/-1"><label>Nome Completo do Servidor</label><input id="srv-nome" value="' + h(srv.nome || '') + '" placeholder="ex.: Maria Silva Santos"></div>' +
      '<div class="fld"><label>MASP</label><input id="srv-masp" value="' + h(srv.masp || '') + '" placeholder="ex.: 1234567-8"></div>' +
      '<div class="fld"><label>CPF</label><input id="srv-cpf" value="' + h(srv.cpf || '') + '" placeholder="000.000.000-00"></div>' +
      '<div class="fld"><label>PIS / PASEP</label><input id="srv-pispasep" value="' + h(srv.pisPasep || '') + '" placeholder="000.00000.00-0"></div>' +
      '<div class="fld"><label>Situação Funcional</label><input id="srv-situacao" value="' + h(srv.situacao || 'Efetivo') + '" placeholder="ex.: Efetivo (após Lei 64/2002)"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Cargo / Nível / Função</label><input id="srv-cargo" value="' + h(srv.cargo || '') + '" placeholder="ex.: Professor de Educação Básica (PEB1A) / Especialista"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Órgão / Secretaria de Lotação</label><input id="srv-orgao" value="' + h(srv.orgao || '') + '" placeholder="ex.: Secretaria de Estado de Educação (SEE-MG)"></div>' +
      '<div class="fld" style="grid-column:1/-1"><label>Banco / Agência / Conta de Recebimento</label><input id="srv-banco" value="' + h(srv.bancoRecebimento || '') + '" placeholder="ex.: Banco Itaú · Ag 4980 · CC 23287-2"></div>' +
      '</div>';

    var fnModal = global.modal || alert;
    fnModal('🔺 Editar Dados do Servidor Público (MG)', modalHTML, function (o) {
      var nome = document.querySelector('#srv-nome').value.trim();
      var masp = document.querySelector('#srv-masp').value.trim();
      if (!nome) {
        global.toast && global.toast('Informe o nome do servidor.', 'err');
        return false;
      }
      db.servidor = {
        nome: nome,
        masp: masp,
        cpf: document.querySelector('#srv-cpf').value.trim(),
        pisPasep: document.querySelector('#srv-pispasep').value.trim(),
        cargo: document.querySelector('#srv-cargo').value.trim(),
        situacao: document.querySelector('#srv-situacao').value.trim(),
        orgao: document.querySelector('#srv-orgao').value.trim(),
        bancoRecebimento: document.querySelector('#srv-banco').value.trim()
      };

      if (global.Store) global.Store.touch('Atualizou dados do servidor: ' + nome);
      if (global.toast) global.toast('Dados do servidor atualizados com sucesso!');
      if (global.App && global.App.render) global.App.render();
    });
  }

  /* --------------------------------------------------------------------------
     LIGAÇÃO DE EVENTOS & MODAIS (Adicionar / Editar / Lançamento Manual de 13º)
     -------------------------------------------------------------------------- */
  function ligarEventos(root, db, ccAtual, lista) {
    // Botão Editar Dados do Servidor
    var btnEditServ = root.querySelector('#btn-edit-servidor');
    if (btnEditServ) {
      btnEditServ.onclick = function () {
        abrirModalEditarServidor(db);
      };
    }
    // Abas
    var tCC = root.querySelector('#tab-cc');
    var tDM = root.querySelector('#tab-dmes');
    var tDA = root.querySelector('#tab-dano');
    var tTB = root.querySelector('#tab-tab');

    if (tCC) tCC.onclick = function () { stProv.aba = 'contracheque'; global.App && global.App.render(); };
    if (tDM) tDM.onclick = function () { stProv.aba = 'dash-mes'; global.App && global.App.render(); };
    if (tDA) tDA.onclick = function () { stProv.aba = 'dash-ano'; global.App && global.App.render(); };
    if (tTB) tTB.onclick = function () { stProv.aba = 'tabela'; global.App && global.App.render(); };

    // Botão Importar Contracheque SEPLAG
    var btnImpSEPLAG = root.querySelector('#btn-import-cc-seplag');
    if (btnImpSEPLAG) {
      btnImpSEPLAG.onclick = function () {
        abrirModalImportarContracheque(db, ccAtual, lista);
      };
    }

    // Seletor de Competência
    var selMes = root.querySelector('#prov-sel-mes');
    if (selMes) {
      selMes.onchange = function () {
        stProv.idRef = this.value;
        global.App && global.App.render();
      };
    }

    // Seletor de Ano
    var selAno = root.querySelector('#prov-sel-ano');
    if (selAno) {
      selAno.onchange = function () {
        stProv.ano = this.value;
        global.App && global.App.render();
      };
    }

    // Botões de Navegação Rápida entre meses no Dashboard Mensal
    root.querySelectorAll('[data-nav-mes]').forEach(function (btn) {
      btn.onclick = function () {
        stProv.idRef = btn.dataset.navMes;
        global.App && global.App.render();
      };
    });

    // Seletores de Tipo de Gráfico (Barras / Linha)
    root.querySelectorAll('[data-graf-tipo]').forEach(function (btn) {
      btn.onclick = function () {
        stProv.dashTipoGraf = btn.dataset.grafTipo;
        global.App && global.App.render();
      };
    });

    // Seletores de Período do Gráfico (6m / ano / tudo)
    root.querySelectorAll('[data-graf-periodo]').forEach(function (btn) {
      btn.onclick = function () {
        stProv.dashPeriodo = btn.dataset.grafPeriodo;
        global.App && global.App.render();
      };
    });

    // Botão Ver Contracheque na tabela
    root.querySelectorAll('[data-ver-cc]').forEach(function (btn) {
      btn.onclick = function () {
        stProv.idRef = btn.dataset.verCc;
        stProv.aba = 'contracheque';
        global.App && global.App.render();
      };
    });

    // Botão Ir para Extrato do Mês
    var btnExt = root.querySelector('#btn-ir-extrato-mes');
    if (btnExt) {
      btnExt.onclick = function () {
        var mesAlvo = btnExt.dataset.mes;
        if (global.irParaMesLancamentos) {
          global.irParaMesLancamentos(mesAlvo);
        } else {
          location.hash = '#lancamentos';
        }
      };
    }

    // Botão Sincronizar com Extrato
    var btnSync = root.querySelector('#btn-sync-extrato');
    if (btnSync) {
      btnSync.onclick = function () {
        var n = ProventosMG.sincronizarLancamentos(db);
        if (global.Store) global.Store.touch('Sincronização de proventos com lançamentos');
        global.toast && global.toast('Lançamentos de Salário sincronizados com a Conta Itaú!');
        global.App && global.App.render();
      };
    }

    // Botão Imprimir Demonstrativo
    var btnImp = root.querySelector('#btn-imprimir-cc');
    if (btnImp) {
      btnImp.onclick = function () {
        window.print();
      };
    }

    // Botão Lançar 13º Salário Manual
    var btnAdd13 = root.querySelector('#btn-add-13');
    if (btnAdd13) {
      btnAdd13.onclick = function () {
        abrirModalLancamento13(db);
      };
    }

    // Botão Lançar Auxílio Fardamento Manual
    var btnAddFard = root.querySelector('#btn-add-fardamento');
    if (btnAddFard) {
      btnAddFard.onclick = function () {
        abrirModalLancamentoFardamento(db, ccAtual, lista);
      };
    }

    // Botão Adicionar Rubrica Geral
    var btnAdd = root.querySelector('#btn-add-rubrica');
    if (btnAdd) {
      btnAdd.onclick = function () {
        abrirModalRubrica(db, ccAtual, 'v', null, null);
      };
    }

    // Botão Nova Vantagem (direto na seção)
    var btnAddV = root.querySelector('#btn-add-vantagem');
    if (btnAddV) {
      btnAddV.onclick = function () {
        abrirModalRubrica(db, ccAtual, 'v', null, null);
      };
    }

    // Botão Novo Desconto (direto na seção)
    var btnAddD = root.querySelector('#btn-add-desconto');
    if (btnAddD) {
      btnAddD.onclick = function () {
        abrirModalRubrica(db, ccAtual, 'd', null, null);
      };
    }

    // Botão Excluir Contracheque de 13º
    var btnDel13 = root.querySelector('#btn-del-cc13');
    if (btnDel13 && ccAtual) {
      btnDel13.onclick = function () {
        if (confirm('Deseja excluir este demonstrativo de 13º Salário?')) {
          var idx = db.proventosMG.findIndex(function (c) { return (c.id || c.mes) === ccAtual.id; });
          if (idx >= 0) {
            db.proventosMG.splice(idx, 1);
            ProventosMG.sincronizarLancamentos(db);
            if (global.Store) global.Store.touch('Exclusão de demonstrativo de 13º Salário');
            stProv.idRef = '2026-08';
            global.toast && global.toast('Demonstrativo de 13º excluído com sucesso');
            global.App && global.App.render();
          }
        }
      };
    }

    // Botões de Editar Rubrica
    root.querySelectorAll('[data-edit-rub]').forEach(function (btn) {
      btn.onclick = function () {
        var parts = btn.dataset.editRub.split('|');
        var tipo = parts[0]; // 'v' ou 'd'
        var idx = +parts[1];
        var item = tipo === 'v' ? ccAtual.vantagens[idx] : ccAtual.descontos[idx];
        abrirModalRubrica(db, ccAtual, tipo, idx, item);
      };
    });

    // Botões de Excluir Rubrica
    root.querySelectorAll('[data-del-rub]').forEach(function (btn) {
      btn.onclick = function () {
        var parts = btn.dataset.delRub.split('|');
        var tipo = parts[0];
        var idx = +parts[1];
        var item = tipo === 'v' ? ccAtual.vantagens[idx] : ccAtual.descontos[idx];
        if (confirm('Excluir a rubrica "' + item.desc + '" deste demonstrativo?')) {
          if (tipo === 'v') ccAtual.vantagens.splice(idx, 1);
          else ccAtual.descontos.splice(idx, 1);
          ProventosMG.sincronizarLancamentos(db);
          if (global.Store) global.Store.touch('Exclusão de rubrica: ' + item.desc);
          global.toast && global.toast('Rubrica excluída e extrato sincronizado!');
          global.App && global.App.render();
        }
      };
    });
  }

  /* --------------------------------------------------------------------------
     MODAL: LANÇAMENTO MANUAL DE CONTRACHEQUE DE 13º SALÁRIO
     Estrutura oficial parametrizada conforme SEPLAG / Contracheque de 13º Salário
     -------------------------------------------------------------------------- */
  function abrirModalLancamento13(db) {
    var anos = ['2026', '2027', '2028', '2025'];
    var meses = [
      { val: '12', lb: 'Dezembro' },
      { val: '11', lb: 'Novembro' },
      { val: '06', lb: 'Junho' },
      { val: '07', lb: 'Julho' },
      { val: '08', lb: 'Agosto' },
      { val: '09', lb: 'Setembro' },
      { val: '10', lb: 'Outubro' },
      { val: '01', lb: 'Janeiro' }
    ];

    var corpo = '' +
      '<div style="background:var(--surface-2);border-radius:var(--r);padding:12px;border:1px solid var(--stroke-soft);margin-bottom:14px;font-size:12.5px;line-height:1.5">' +
      '<b>Demonstrativo de 13º Salário (SEPLAG - MG)</b><br>' +
      'O 13º salário é emitido em contracheque à parte a cada ano e pode ocorrer em meses ou parcelas distintas. Preencha os valores oficiais ou calculados abaixo.' +
      '</div>' +

      '<div class="grid g-3" style="margin-bottom:12px">' +
      '<div class="fld"><label>Exercício / Ano</label>' +
      '<select id="mod13-ano">' +
      anos.map(function (a) { return '<option value="' + a + '"' + (a === '2026' ? ' selected' : '') + '>' + a + '</option>'; }).join('') +
      '</select></div>' +

      '<div class="fld"><label>Mês de Emissão / Pagamento</label>' +
      '<select id="mod13-mes">' +
      meses.map(function (m) { return '<option value="' + m.val + '">' + m.lb + '</option>'; }).join('') +
      '</select></div>' +

      '<div class="fld"><label>Modalidade da Folha</label>' +
      '<select id="mod13-modalidade">' +
      '<option value="integral">Parcela Única (Integral)</option>' +
      '<option value="parc1">1ª Parcela (Adiantamento 50%)</option>' +
      '<option value="parc2">2ª Parcela (Saldo / Quitação)</option>' +
      '</select></div>' +
      '</div>' +

      '<div style="border-top:1px solid var(--stroke);padding-top:12px;margin-top:12px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--entrada);margin-bottom:8px">Vantagens do 13º</div>' +
      '<div class="grid g-2" style="margin-bottom:12px">' +
      '<div class="fld"><label>Descrição Rubrica</label>' +
      '<input type="text" id="mod13-vdesc" value="Decimo Terc. Salario">' +
      '</div>' +
      '<div class="fld"><label>Valor do 13º Salário (R$)</label>' +
      '<input type="text" id="mod13-vvalor" placeholder="Ex: 9651,96" style="font-weight:700;color:var(--entrada)">' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div style="border-top:1px solid var(--stroke);padding-top:12px;margin-top:12px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--saida);margin-bottom:8px">Descontos Oficiais do 13º</div>' +
      '<div class="grid g-2" style="margin-bottom:12px">' +
      '<div class="fld"><label>Previdência (Cont.prev.13º Salar.)</label>' +
      '<input type="text" id="mod13-dprev" placeholder="Ex: 1387,38">' +
      '</div>' +
      '<div class="fld"><label>Imposto de Renda (I.renda Ret.f.13.sal)</label>' +
      '<input type="text" id="mod13-dir" placeholder="Ex: 1520,00">' +
      '</div>' +
      '</div>' +
      '</div>' +

      '<div style="background:var(--surface-3);border-radius:var(--r-sm);padding:10px;font-size:11.5px;color:var(--ink-2)">' +
      '💡 <i>Dica:</i> Parcela, Admissão e Especificação 0 serão atribuídas automaticamente seguindo os padrões oficiais da SEPLAG/MG.' +
      '</div>';

    if (global.modal) {
      global.modal('Lançar Contracheque de 13º Salário', corpo, function (ovl) {
        var ano = ovl.querySelector('#mod13-ano').value;
        var mesVal = ovl.querySelector('#mod13-mes').value;
        var modalidade = ovl.querySelector('#mod13-modalidade').value;

        var vDesc = ovl.querySelector('#mod13-vdesc').value.trim() || 'Decimo Terc. Salario';
        var vValStr = ovl.querySelector('#mod13-vvalor').value.trim().replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        var vValor = parseFloat(vValStr) || 0;

        var dPrevStr = ovl.querySelector('#mod13-dprev').value.trim().replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        var dPrev = parseFloat(dPrevStr) || 0;

        var dIRStr = ovl.querySelector('#mod13-dir').value.trim().replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        var dIR = parseFloat(dIRStr) || 0;

        if (vValor <= 0) {
          global.toast && global.toast('Informe o valor do 13º Salário', 'err');
          return false;
        }

        var subtitulo = modalidade === 'parc1'
          ? '1ª Parcela (Adiantamento)'
          : modalidade === 'parc2'
          ? '2ª Parcela (Saldo / Quitação)'
          : 'Parcela Única';

        var idDoc = ano + '-13' + (modalidade === 'parc1' ? '-1' : modalidade === 'parc2' ? '-2' : '');

        var vantagens = [
          { desc: vDesc, ref: 'Normal', espec: '0', parc: '-', valor: r2(vValor), tipo: 'decimo_terceiro' }
        ];

        var descontos = [];
        if (dPrev > 0) {
          descontos.push({ desc: 'Cont.prev.13º Salar.', ref: 'Normal', espec: '0', parc: '-', valor: r2(dPrev), tipo: 'previdencia' });
        }
        if (dIR > 0) {
          descontos.push({ desc: 'I.renda Ret.f.13.sal', ref: 'Normal', espec: '0', parc: '-', valor: r2(dIR), tipo: 'irrf' });
        }

        var novoCC = {
          id: idDoc,
          mes: ano + '-' + mesVal,
          anoExercicio: ano,
          tipoFolha: '13o',
          titulo: '13º Salário (' + subtitulo + ')',
          subtitulo13: subtitulo + ' (Pago em ' + mesVal + '/' + ano + ')',
          cargo: 'Agente de Seguranca Socioeducativo (AGSE4 - A) / Dad-1 (DAD-1)',
          situacao: 'Efetivo (apos Lei 64/2002)',
          orgao: 'Secretaria de Justica e Seguranca Publica',
          banco: 'Banco Itau | Ag: 4980 | CC: 23287-2',
          vantagens: vantagens,
          descontos: descontos
        };

        // Se já existir um registro com esse ID, substitui; caso contrário, insere
        var idxExist = db.proventosMG.findIndex(function (c) { return (c.id || c.mes) === idDoc; });
        if (idxExist >= 0) {
          db.proventosMG[idxExist] = novoCC;
        } else {
          db.proventosMG.push(novoCC);
        }

        stProv.idRef = idDoc;
        stProv.ano = ano;
        stProv.aba = 'contracheque';

        ProventosMG.sincronizarLancamentos(db);
        if (global.Store) global.Store.touch('Lançou contracheque de 13º Salário para ' + ano);
        global.toast && global.toast('Contracheque de 13º gravado e extrato sincronizado!');
        global.App && global.App.render();
      }, 'Salvar Demonstrativo de 13º');
    }
  }

  /* --------------------------------------------------------------------------
     MODAL: LANÇAMENTO MANUAL DE AUXÍLIO FARDAMENTO (ABONO VESTIMENTA)
     Permite lançar manualmente na competência desejada com valor oficial ou zerado
     -------------------------------------------------------------------------- */
  function abrirModalLancamentoFardamento(db, ccAtual, lista) {
    var mesesMensais = (lista || []).filter(function (c) { return c.tipoFolha === 'mensal'; });
    var idAtual = ccAtual ? (ccAtual.id || ccAtual.mes) : (mesesMensais[0] ? mesesMensais[0].id : '2026-08');

    var corpo = '' +
      '<div style="background:var(--surface-2);border-radius:var(--r);padding:12px;border:1px solid var(--stroke-soft);margin-bottom:14px;font-size:12.5px;line-height:1.5">' +
      '<b>Lançamento de Auxílio Fardamento (Abono Aquisição de Vestimenta)</b><br>' +
      'O auxílio fardamento dos servidores da Segurança Pública de MG é lançado de forma manual na competência em que o pagamento ocorrer. Você pode editar os valores a qualquer momento.' +
      '</div>' +

      '<div class="fld" style="margin-bottom:12px"><label>Competência / Mês de Pagamento</label>' +
      '<select id="modfard-mes" style="font-weight:600">' +
      mesesMensais.map(function (c) {
        var id = c.id || c.mes;
        var lb = ProventosMG.getLabelDemonstrativo(c);
        return '<option value="' + id + '"' + (id === idAtual ? ' selected' : '') + '>' + lb + '</option>';
      }).join('') +
      '</select></div>' +

      '<div class="grid g-2" style="margin-bottom:12px">' +
      '<div class="fld"><label>Descrição da Rubrica</label>' +
      '<input type="text" id="modfard-desc" value="Abono Aqu.vestimenta">' +
      '</div>' +
      '<div class="fld"><label>Valor do Benefício (R$)</label>' +
      '<input type="text" id="modfard-valor" value="2.248,23" placeholder="0,00" style="font-weight:700;color:var(--entrada)">' +
      '</div>' +
      '</div>' +

      '<div class="grid g-2" style="margin-bottom:12px">' +
      '<div class="fld"><label>Referência</label>' +
      '<select id="modfard-ref">' +
      '<option value="Normal" selected>Normal</option>' +
      '<option value="Atrasado">Atrasado / Retroativo</option>' +
      '</select></div>' +
      '<div class="fld"><label>Especificação</label>' +
      '<input type="text" id="modfard-espec" value="0">' +
      '</div>' +
      '</div>' +

      '<div style="background:var(--surface-3);border-radius:var(--r-sm);padding:10px;font-size:11.5px;color:var(--ink-2)">' +
      '💡 <i>Dica:</i> O valor padrão do Abono de Vestimenta é <b>R$ 2.248,23</b> (ou R$ 2.133,05 em tabelas anteriores). Caso o benefício não seja pago neste mês, informe <b>0,00</b>.' +
      '</div>';

    if (global.modal) {
      global.modal('Lançar Auxílio Fardamento (Vestimenta)', corpo, function (ovl) {
        var mesId = ovl.querySelector('#modfard-mes').value;
        var desc = ovl.querySelector('#modfard-desc').value.trim() || 'Abono Aqu.vestimenta';
        var ref = ovl.querySelector('#modfard-ref').value;
        var espec = ovl.querySelector('#modfard-espec').value.trim() || '0';
        var valStr = ovl.querySelector('#modfard-valor').value.trim().replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        var valor = parseFloat(valStr) || 0;

        if (isNaN(valor) || valor < 0) {
          global.toast && global.toast('Informe um valor válido maior ou igual a zero', 'err');
          return false;
        }

        var ccAlvo = db.proventosMG.find(function (c) { return (c.id || c.mes) === mesId; });
        if (!ccAlvo) {
          global.toast && global.toast('Competência não encontrada', 'err');
          return false;
        }

        ccAlvo.vantagens = ccAlvo.vantagens || [];
        var idxExist = ccAlvo.vantagens.findIndex(function (v) {
          return v.tipo === 'abono' || v.desc.toLowerCase().indexOf('vestimenta') >= 0;
        });

        var novaRub = {
          desc: desc,
          ref: ref,
          espec: espec,
          parc: '-',
          valor: r2(valor),
          tipo: 'abono'
        };

        if (idxExist >= 0) {
          ccAlvo.vantagens[idxExist] = novaRub;
        } else {
          ccAlvo.vantagens.push(novaRub);
        }

        stProv.idRef = mesId;
        stProv.aba = 'contracheque';

        ProventosMG.sincronizarLancamentos(db);
        if (global.Store) global.Store.touch('Lançou Auxílio Fardamento para ' + mesId);
        global.toast && global.toast('Auxílio Fardamento gravado e extrato sincronizado!');
        global.App && global.App.render();
      }, 'Salvar Auxílio Fardamento');
    }
  }

  /* --------------------------------------------------------------------------
     PRESETS DE RUBRICAS OFICIAIS SEPLAG / MG (Para preenchimento ágil e novos benefícios)
     -------------------------------------------------------------------------- */
  var MODELOS_RUBRICAS = [
    {
      grupo: '✍️ Preenchimento Manual / Personalizado',
      itens: [
        { rotulo: '➕ Vantagem Personalizada (Preenchimento Manual Livre)', tipoLanc: 'v', desc: '', espec: '0', parc: '-', valor: 0.00, tipo: 'outros', ref: 'Normal' },
        { rotulo: '➖ Desconto Personalizado (Preenchimento Manual Livre)', tipoLanc: 'd', desc: '', espec: '0', parc: '-', valor: 0.00, tipo: 'outros', ref: 'Normal' }
      ]
    },
    {
      grupo: 'Vantagens — Alimentação, Indenizações & Abonos',
      itens: [
        { rotulo: 'Ajuda de Custo Alimentação Fixa (R$ 1.100,00)', tipoLanc: 'v', desc: 'Aj.custo/aliment.fix', espec: '22', parc: '-', valor: 1100.00, tipo: 'alimentacao', ref: 'Normal' },
        { rotulo: 'Ajuda de Custo Alimentação Fixa — ZERADA (R$ 0,00)', tipoLanc: 'v', desc: 'Aj.custo/aliment.fix', espec: '0', parc: '-', valor: 0.00, tipo: 'alimentacao', ref: 'Normal' },
        { rotulo: 'Ajuda de Custo Alimentação Variável (R$ 547,36)', tipoLanc: 'v', desc: 'Aj.cust/aliment.vari', espec: '22', parc: '-', valor: 547.36, tipo: 'alimentacao', ref: 'Normal' },
        { rotulo: 'Ajuda de Custo Alimentação Variável — ZERADA (R$ 0,00)', tipoLanc: 'v', desc: 'Aj.cust/aliment.vari', espec: '0', parc: '-', valor: 0.00, tipo: 'alimentacao', ref: 'Normal' },
        { rotulo: 'Auxílio Fardamento / Abono Vestimenta (R$ 2.248,23)', tipoLanc: 'v', desc: 'Abono Aqu.vestimenta', espec: '0', parc: '-', valor: 2248.23, tipo: 'abono', ref: 'Normal' },
        { rotulo: 'Auxílio Fardamento — Parcela Anterior (R$ 2.133,05)', tipoLanc: 'v', desc: 'Abono Aqu.vestimenta', espec: '0', parc: '-', valor: 2133.05, tipo: 'abono', ref: 'Normal' },
        { rotulo: 'Abono Vestimenta — Atrasado / Diferença (R$ 115,18)', tipoLanc: 'v', desc: 'Abono Vestimenta-atr', espec: '0', parc: '-', valor: 115.18, tipo: 'retroativo', ref: 'Atrasado' },
        { rotulo: 'Auxílio Creche / Pré-Escolar', tipoLanc: 'v', desc: 'Auxilio Pre-Escolar', espec: '0', parc: '-', valor: 0.00, tipo: 'outros', ref: 'Normal' },
        { rotulo: 'Auxílio Transporte / Deslocamento', tipoLanc: 'v', desc: 'Auxilio Transporte', espec: '0', parc: '-', valor: 0.00, tipo: 'outros', ref: 'Normal' },
        { rotulo: 'Diárias de Viagem / Deslocamento a Serviço', tipoLanc: 'v', desc: 'Diarias de Viagem', espec: '0', parc: '-', valor: 0.00, tipo: 'outros', ref: 'Normal' }
      ]
    },
    {
      grupo: 'Vantagens — Remuneração Básica, Adicionais & Horas',
      itens: [
        { rotulo: 'Vencimento Básico AGSE (R$ 7.116,51)', tipoLanc: 'v', desc: 'Vencimento Basico', espec: '0', parc: '-', valor: 7116.51, tipo: 'vencimento', ref: 'Normal' },
        { rotulo: 'Adicional de Desempenho - ADE 30% (R$ 2.134,95)', tipoLanc: 'v', desc: 'Adicional Desempenho', espec: '30', parc: '-', valor: 2134.95, tipo: 'adicional', ref: 'Normal' },
        { rotulo: 'Adicional de Desempenho - ADE 20% (R$ 1.423,30)', tipoLanc: 'v', desc: 'Adicional Desempenho', espec: '20', parc: '-', valor: 1423.30, tipo: 'adicional', ref: 'Normal' },
        { rotulo: 'Adicional de Desempenho - ADE 10% (R$ 711,65)', tipoLanc: 'v', desc: 'Adicional Desempenho', espec: '10', parc: '-', valor: 711.65, tipo: 'adicional', ref: 'Normal' },
        { rotulo: 'Adicional Noturno Divisor 200 (R$ 518,08)', tipoLanc: 'v', desc: 'Adic Not Div 200 -dj', espec: '56', parc: '-', valor: 518.08, tipo: 'noturno', ref: 'Normal' },
        { rotulo: 'Adicional Noturno Divisor 200 — Plantão Variável', tipoLanc: 'v', desc: 'Adic Not Div 200 -dj', espec: '0', parc: '-', valor: 0.00, tipo: 'noturno', ref: 'Normal' },
        { rotulo: 'Serviço Extraordinário / Hora Extra (R$ 965,20)', tipoLanc: 'v', desc: 'Servico Extraord dj', espec: '16', parc: '-', valor: 965.20, tipo: 'hora_extra', ref: 'Normal' },
        { rotulo: 'Serviço Extraordinário / Hora Extra Livre', tipoLanc: 'v', desc: 'Servico Extraord dj', espec: '0', parc: '-', valor: 0.00, tipo: 'hora_extra', ref: 'Normal' },
        { rotulo: 'Gratificação de Opção de Vencimento DAD-1 (R$ 400,50)', tipoLanc: 'v', desc: 'Grat. Opcao Vencimen', espec: '0', parc: '-', valor: 400.50, tipo: 'gratificacao', ref: 'Normal' },
        { rotulo: 'Gratificação de Função / Cargo em Comissão Livre', tipoLanc: 'v', desc: 'Gratificacao Funcao', espec: '0', parc: '-', valor: 0.00, tipo: 'gratificacao', ref: 'Normal' },
        { rotulo: 'Gratificação 1/3 Férias Regulamentares (R$ 3.377,42)', tipoLanc: 'v', desc: 'Grat.1/3 F.regulamen', espec: '0', parc: '-', valor: 3377.42, tipo: 'ferias', ref: 'Normal' },
        { rotulo: 'Gratificação 1/3 Férias Prêmio / Indenizadas', tipoLanc: 'v', desc: 'Grat.1/3 F.premio', espec: '0', parc: '-', valor: 0.00, tipo: 'ferias', ref: 'Normal' },
        { rotulo: '13º Salário Integral (Decimo Terc. Salario)', tipoLanc: 'v', desc: 'Decimo Terc. Salario', espec: '0', parc: '-', valor: 9651.96, tipo: 'decimo_terceiro', ref: 'Normal' },
        { rotulo: '13º Salário — Adiantamento / 1ª Parcela', tipoLanc: 'v', desc: 'Adiantamento 13.sal', espec: '0', parc: '-', valor: 0.00, tipo: 'decimo_terceiro', ref: 'Normal' },
        { rotulo: 'Vencimento Básico — Atraso / Retroativo', tipoLanc: 'v', desc: 'Venc.basico - Atraso', espec: '0', parc: '-', valor: 0.00, tipo: 'retroativo', ref: 'Atrasado' },
        { rotulo: 'Adicional Local de Trabalho / Periculosidade', tipoLanc: 'v', desc: 'Adic.local Trabalho', espec: '0', parc: '-', valor: 0.00, tipo: 'adicional', ref: 'Normal' }
      ]
    },
    {
      grupo: 'Descontos — Previdenciários, Fiscais & Sindicais',
      itens: [
        { rotulo: 'Contribuição Previdenciária IPSEMG Art. 28 (R$ 1.387,38)', tipoLanc: 'd', desc: 'Contrib.prev.art. 28', espec: '0', parc: '-', valor: 1387.38, tipo: 'previdencia', ref: 'Normal' },
        { rotulo: 'Contribuição Previdenciária IPSEMG (Valor Variável)', tipoLanc: 'd', desc: 'Contrib.prev.art. 28', espec: '0', parc: '-', valor: 0.00, tipo: 'previdencia', ref: 'Normal' },
        { rotulo: 'Imposto de Renda Retido na Fonte IRRF (R$ 1.771,93)', tipoLanc: 'd', desc: 'Imp. Renda Ret.fonte', espec: '0', parc: '-', valor: 1771.93, tipo: 'irrf', ref: 'Normal' },
        { rotulo: 'Imposto de Renda Retido na Fonte IRRF (Valor Variável)', tipoLanc: 'd', desc: 'Imp. Renda Ret.fonte', espec: '0', parc: '-', valor: 0.00, tipo: 'irrf', ref: 'Normal' },
        { rotulo: 'Mensalidade Sindical Sindpúblicos (R$ 75,17)', tipoLanc: 'd', desc: 'Sindpublicos Mens.', espec: '0', parc: '-', valor: 75.17, tipo: 'sindicato', ref: 'Normal' },
        { rotulo: 'Mensalidade Sindical / Associação Livre', tipoLanc: 'd', desc: 'Mensalidade Associativa', espec: '0', parc: '-', valor: 0.00, tipo: 'sindicato', ref: 'Normal' },
        { rotulo: 'Assistência Médica IPSEMG — Saúde / Dependentes', tipoLanc: 'd', desc: 'Ipsemg Assist. Med.', espec: '0', parc: '-', valor: 0.00, tipo: 'previdencia', ref: 'Normal' },
        { rotulo: 'Contribuição Previdenciária Atrasada (R$ 84,71)', tipoLanc: 'd', desc: 'Cont Prev Atrasado', espec: '0', parc: '-', valor: 84.71, tipo: 'previdencia', ref: 'Atrasado' },
        { rotulo: 'Previdência 13º Salário (Cont.prev.13º Salar.)', tipoLanc: 'd', desc: 'Cont.prev.13º Salar.', espec: '0', parc: '-', valor: 1387.38, tipo: 'previdencia', ref: 'Normal' },
        { rotulo: 'Imposto de Renda 13º Salário (I.renda Ret.f.13.sal)', tipoLanc: 'd', desc: 'I.renda Ret.f.13.sal', espec: '0', parc: '-', valor: 1520.00, tipo: 'irrf', ref: 'Normal' }
      ]
    },
    {
      grupo: 'Descontos — Consignados em Folha, Empréstimos & Outros',
      itens: [
        { rotulo: 'Banco Itaú — Empréstimo Consignado I (R$ 148,75)', tipoLanc: 'd', desc: 'Banco Itau - Empr. i', espec: '0', parc: '1 de 36', valor: 148.75, tipo: 'consignado', ref: 'Normal' },
        { rotulo: 'Banco Itaú — Empréstimo Consignado II (R$ 76,56)', tipoLanc: 'd', desc: 'Banco Itau - Empr.ii', espec: '0', parc: '1 de 120', valor: 76.56, tipo: 'consignado', ref: 'Normal' },
        { rotulo: 'Empréstimo Consignado Caixa / BB / Outro Banco', tipoLanc: 'd', desc: 'Emprestimo Consignado', espec: '0', parc: '1 de 60', valor: 0.00, tipo: 'consignado', ref: 'Normal' },
        { rotulo: 'Cartão de Crédito Consignado (RMC / RCC)', tipoLanc: 'd', desc: 'Cartao Credito Consig', espec: '0', parc: '-', valor: 0.00, tipo: 'consignado', ref: 'Normal' },
        { rotulo: 'Reposição / Estorno de Alimentação (R$ 550,00)', tipoLanc: 'd', desc: 'Rep.aj.cust/aliment.', espec: '1', parc: '-', valor: 550.00, tipo: 'estorno', ref: 'Atrasado' },
        { rotulo: 'Reposição ao Erário / Falta ou Estorno de Pagamento', tipoLanc: 'd', desc: 'Reposicao ao Erario', espec: '0', parc: '-', valor: 0.00, tipo: 'estorno', ref: 'Atrasado' },
        { rotulo: 'Pensão Alimentícia Judicial Fixa ou %', tipoLanc: 'd', desc: 'Pensao Alimenticia Judicial', espec: '0', parc: '-', valor: 0.00, tipo: 'consignado', ref: 'Normal' },
        { rotulo: 'Seguro de Vida / Pecúlio em Folha', tipoLanc: 'd', desc: 'Seguro Vida / Peculio', espec: '0', parc: '-', valor: 0.00, tipo: 'outros', ref: 'Normal' }
      ]
    }
  ];

  /* --------------------------------------------------------------------------
     MODAL: ADICIONAR / EDITAR RUBRICA NO DEMONSTRATIVO ATUAL
     Suporta valores iguais a zero (ex: meses sem auxílio alimentação), modelos rápidos e rubricas livres
     -------------------------------------------------------------------------- */
  function abrirModalRubrica(db, cc, tipoOriginal, idxOriginal, itemOriginal) {
    var editando = itemOriginal !== undefined && itemOriginal !== null;
    var tipoSel = tipoOriginal || (itemOriginal ? tipoOriginal : 'v');

    var opcoesPresets = '<option value="">-- Selecionar modelo rápido de rubrica (opcional) --</option>' +
      MODELOS_RUBRICAS.map(function (grp, gIdx) {
        var opts = grp.itens.map(function (it, iIdx) {
          return '<option value="' + gIdx + '_' + iIdx + '">' + h(it.rotulo) + '</option>';
        }).join('');
        return '<optgroup label="' + h(grp.grupo) + '">' + opts + '</optgroup>';
      }).join('');

    var corpo = '' +
      '<div style="background:var(--surface-2);border-radius:var(--r);padding:12px;border:1px solid var(--stroke-soft);margin-bottom:14px;font-size:12.5px;line-height:1.5">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<div><b>Lançamento de Vantagens e Descontos</b><div style="font-size:11.5px;color:var(--ink-3)">Preencha manualmente todos os campos ou escolha um modelo sugerido.</div></div>' +
      '<button type="button" class="btn sm" id="btn-limpar-campos-rub" style="font-size:11.5px;padding:3px 8px">✍️ Limpar / Manual</button>' +
      '</div>' +
      '</div>' +

      '<div class="fld" style="margin-bottom:12px">' +
      '<label style="color:var(--brand);font-weight:700">Modelos Sugeridos de Rubricas SEPLAG / MG (Opcional)</label>' +
      '<select id="rub-preset" style="border-color:var(--brand);background:var(--surface-2)">' +
      opcoesPresets +
      '</select>' +
      '</div>' +

      '<div class="grid g-2" style="margin-bottom:12px">' +
      '<div class="fld"><label>Tipo de Lançamento</label>' +
      '<select id="rub-tipo-lanc">' +
      '<option value="v"' + (tipoSel === 'v' ? ' selected' : '') + '>Vantagem (Crédito / Rendimento)</option>' +
      '<option value="d"' + (tipoSel === 'd' ? ' selected' : '') + '>Desconto (Débito / Retenção)</option>' +
      '</select></div>' +
      '<div class="fld"><label>Referência</label>' +
      '<select id="rub-ref">' +
      '<option value="Normal"' + (itemOriginal && itemOriginal.ref === 'Normal' ? ' selected' : '') + '>Normal</option>' +
      '<option value="Atrasado"' + (itemOriginal && itemOriginal.ref === 'Atrasado' ? ' selected' : '') + '>Atrasado / Retroativo</option>' +
      '</select></div>' +
      '</div>' +

      '<div class="fld" style="margin-bottom:12px"><label>Descrição da Rubrica</label>' +
      '<input type="text" id="rub-desc" value="' + h(itemOriginal ? itemOriginal.desc : '') + '" placeholder="Ex: Aj.custo/aliment.fix, Adicional Desempenho, Vencimento Basico">' +
      '</div>' +

      '<div class="grid g-3" style="margin-bottom:12px">' +
      '<div class="fld"><label>Valor (R$) <span style="font-size:11px;color:var(--ink-3)">(Aceita 0,00)</span></label>' +
      '<input type="text" id="rub-valor" value="' + (itemOriginal ? String(itemOriginal.valor).replace('.', ',') : '') + '" placeholder="0,00" style="font-weight:700">' +
      '</div>' +
      '<div class="fld"><label>Especificação / Dias / Horas</label>' +
      '<input type="text" id="rub-espec" value="' + h(itemOriginal ? itemOriginal.espec : '0') + '" placeholder="Ex: 22, 30, 56, 0">' +
      '</div>' +
      '<div class="fld"><label>Parcela (opcional)</label>' +
      '<input type="text" id="rub-parc" value="' + h(itemOriginal ? itemOriginal.parc : '-') + '" placeholder="Ex: 1 de 36">' +
      '</div>' +
      '</div>' +

      '<div class="fld"><label>Classificação Interna da Rubrica</label>' +
      '<select id="rub-classif">' +
      '<option value="alimentacao"' + (itemOriginal && itemOriginal.tipo === 'alimentacao' ? ' selected' : '') + '>Ajuda de Custo Alimentação (Fixa / Variável)</option>' +
      '<option value="abono"' + (itemOriginal && itemOriginal.tipo === 'abono' ? ' selected' : '') + '>Abono de Vestimenta / Fardamento</option>' +
      '<option value="vencimento"' + (itemOriginal && itemOriginal.tipo === 'vencimento' ? ' selected' : '') + '>Vencimento Básico</option>' +
      '<option value="adicional"' + (itemOriginal && itemOriginal.tipo === 'adicional' ? ' selected' : '') + '>Adicional de Desempenho (ADE)</option>' +
      '<option value="decimo_terceiro"' + (itemOriginal && itemOriginal.tipo === 'decimo_terceiro' ? ' selected' : '') + '>13º Salário (Decimo Terc. Salario)</option>' +
      '<option value="hora_extra"' + (itemOriginal && itemOriginal.tipo === 'hora_extra' ? ' selected' : '') + '>Serviço Extraordinário (Hora Extra)</option>' +
      '<option value="noturno"' + (itemOriginal && itemOriginal.tipo === 'noturno' ? ' selected' : '') + '>Adicional Noturno (Divisor 200)</option>' +
      '<option value="gratificacao"' + (itemOriginal && itemOriginal.tipo === 'gratificacao' ? ' selected' : '') + '>Gratificação de Opção / Cargo</option>' +
      '<option value="ferias"' + (itemOriginal && itemOriginal.tipo === 'ferias' ? ' selected' : '') + '>Férias Regulamentares (1/3)</option>' +
      '<option value="retroativo"' + (itemOriginal && itemOriginal.tipo === 'retroativo' ? ' selected' : '') + '>Atrasados / Acertos Retroativos</option>' +
      '<option value="previdencia"' + (itemOriginal && itemOriginal.tipo === 'previdencia' ? ' selected' : '') + '>Previdência (IPSEMG / Art. 28 / 13º)</option>' +
      '<option value="irrf"' + (itemOriginal && itemOriginal.tipo === 'irrf' ? ' selected' : '') + '>Imposto de Renda Retido na Fonte (IRRF / 13º)</option>' +
      '<option value="consignado"' + (itemOriginal && itemOriginal.tipo === 'consignado' ? ' selected' : '') + '>Empréstimo Consignado em Folha</option>' +
      '<option value="sindicato"' + (itemOriginal && itemOriginal.tipo === 'sindicato' ? ' selected' : '') + '>Mensalidade Sindical</option>' +
      '<option value="estorno"' + (itemOriginal && itemOriginal.tipo === 'estorno' ? ' selected' : '') + '>Reposição / Estorno</option>' +
      '<option value="outros"' + (itemOriginal && itemOriginal.tipo === 'outros' ? ' selected' : '') + '>Outros Vencimentos / Retenções</option>' +
      '</select></div>' +

      '<div style="background:var(--surface-3);border-radius:var(--r-sm);padding:10px;font-size:11.5px;color:var(--ink-2);margin-top:12px">' +
      '💡 <i>Dica:</i> Em meses onde não houver pagamento de ajuda de custo ou qualquer outro benefício, informe <b>0,00</b> no valor para manter a rubrica registrada como zerada.' +
      '</div>';

    if (global.modal) {
      global.modal(editando ? 'Editar Rubrica do Demonstrativo' : 'Nova Rubrica no Demonstrativo', corpo, function (ovl) {
        var tipoLanc = ovl.querySelector('#rub-tipo-lanc').value;
        var ref = ovl.querySelector('#rub-ref').value;
        var desc = ovl.querySelector('#rub-desc').value.trim();
        var valStr = ovl.querySelector('#rub-valor').value.trim().replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
        var valor = parseFloat(valStr) || 0;
        var espec = ovl.querySelector('#rub-espec').value.trim() || '0';
        var parc = ovl.querySelector('#rub-parc').value.trim() || '-';
        var classif = ovl.querySelector('#rub-classif').value;

        if (!desc) { global.toast && global.toast('Informe a descrição da rubrica', 'err'); return false; }
        if (isNaN(valor) || valor < 0) {
          global.toast && global.toast('Informe um valor válido maior ou igual a zero (0,00)', 'err');
          return false;
        }

        var novaRub = {
          desc: desc,
          ref: ref,
          espec: espec,
          parc: parc,
          valor: r2(valor),
          tipo: classif
        };

        if (editando) {
          if (tipoOriginal === 'v') cc.vantagens.splice(idxOriginal, 1);
          else cc.descontos.splice(idxOriginal, 1);
        }

        if (tipoLanc === 'v') {
          cc.vantagens = cc.vantagens || [];
          cc.vantagens.push(novaRub);
        } else {
          cc.descontos = cc.descontos || [];
          cc.descontos.push(novaRub);
        }

        ProventosMG.sincronizarLancamentos(db);
        if (global.Store) global.Store.touch('Atualizou rubrica de proventos MG: ' + desc);
        global.toast && global.toast(editando ? 'Rubrica atualizada e extrato sincronizado!' : 'Rubrica adicionada e extrato sincronizado!');
        global.App && global.App.render();
      }, editando ? 'Salvar Alterações' : 'Adicionar Rubrica');

      // Configura preenchimento dinâmico ao selecionar um modelo rápido
      setTimeout(function () {
        var btnLimpar = document.querySelector('#btn-limpar-campos-rub');
        if (btnLimpar) {
          btnLimpar.onclick = function () {
            var fDesc = document.querySelector('#rub-desc');
            var fVal = document.querySelector('#rub-valor');
            var fEspec = document.querySelector('#rub-espec');
            var fParc = document.querySelector('#rub-parc');
            var selPreset = document.querySelector('#rub-preset');
            if (selPreset) selPreset.value = '';
            if (fDesc) { fDesc.value = ''; fDesc.focus(); }
            if (fVal) fVal.value = '';
            if (fEspec) fEspec.value = '0';
            if (fParc) fParc.value = '-';
          };
        }

        var selPreset = document.querySelector('#rub-preset');
        if (selPreset) {
          selPreset.onchange = function () {
            var val = selPreset.value;
            if (!val) return;
            var parts = val.split('_');
            var g = +parts[0], i = +parts[1];
            var m = MODELOS_RUBRICAS[g] && MODELOS_RUBRICAS[g].itens[i];
            if (m) {
              var fTipo = document.querySelector('#rub-tipo-lanc');
              var fRef = document.querySelector('#rub-ref');
              var fDesc = document.querySelector('#rub-desc');
              var fVal = document.querySelector('#rub-valor');
              var fEspec = document.querySelector('#rub-espec');
              var fParc = document.querySelector('#rub-parc');
              var fClass = document.querySelector('#rub-classif');

              if (fTipo) fTipo.value = m.tipoLanc;
              if (fRef) fRef.value = m.ref || 'Normal';
              if (fDesc) fDesc.value = m.desc;
              if (fVal) fVal.value = String(m.valor).replace('.', ',');
              if (fEspec) fEspec.value = m.espec || '0';
              if (fParc) fParc.value = m.parc || '-';
              if (fClass) fClass.value = m.tipo;
            }
          };
        }
      }, 50);
    }
  }

  global.ProventosMG = ProventosMG;
})(window);
