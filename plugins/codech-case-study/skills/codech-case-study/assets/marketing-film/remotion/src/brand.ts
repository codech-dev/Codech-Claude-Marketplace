/* Per-film settings: the opener and end card read everything from here. */
export const CLIENT = {
  name: 'Acme Trading',            // opener subtitle "Proposed for <logo> <name>" + "Built by Codech · for <name>"
  solution: [[{gold: 'AI-powered'}], ['ordering', 'agent']] as (string | {gold: string})[][],  // opener TITLE = the solution's name (lines of words); wrap the key word as {gold: 'word'}
  logo: null as string | null,     // e.g. 'client-logo.png' in public/ (trimmed, transparent); null = no logo in the lockup
  pillars: ['AI ordering agent', 'System integration', 'Company AI portal'],  // 3 short solution names
  pillarDots: ['#D4B895', '#F59443', '#0B0D12'],  // dot per pillar: use each solution's signature colour (ShingTik: WhatsApp green, gold, blue)
};
export const CONTACTS = {
  web: 'codech.co',
  email: 'codech.co@gmail.com',
  phone: '+6013-9473347',
  qr: 'qr-wa.png',                 // WhatsApp QR for wa.me/60139473347 (segno); null hides the QR card
  headline: ["Let's", 'build', {gold: 'yours.'}] as (string | {gold: string})[],
};
