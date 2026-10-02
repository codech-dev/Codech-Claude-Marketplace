/* Per-film settings: the opener and end card read everything from here. */
export const CLIENT = {
  name: 'OTSO Markets',            // "Built for <name>" credit + opener title
  title: ['OTSO', 'Markets'],      // opener title: first word ink, rest gold
  logo: 'otso-logo-trimmed.png' as string | null,
  pillars: ['AI document search', 'AI assistant', 'Team chat'],
  pillarDots: ['#2F6BFF', '#D4B895', '#0B0D12'],
};
export const CONTACTS = {
  web: 'codech.co',
  email: 'codech.co@gmail.com',
  phone: '+6013-9473347',
  qr: 'qr-wa.png',
  headline: ["Let's", 'build', {gold: 'yours.'}] as (string | {gold: string})[],
};
