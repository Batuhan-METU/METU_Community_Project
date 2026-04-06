export type ChatMessage = {
  id: string;
  text: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: number;
  isMe: boolean;
};

const now = Date.now();
const min = 60_000;
const hr = 60 * min;

/**
 * Per-club conversation stubs keyed by club ID.
 * Falls back to DEFAULT_MESSAGES for clubs without bespoke data.
 */
const CLUB_MESSAGES: Record<string, ChatMessage[]> = {
  /* ── AI Builders Club ── */
  '2': [
    { id: 'm1',  text: 'Hey everyone! Quick reminder — the ML workshop is this Wednesday at 17:30 in the Informatics building.',                             senderName: 'Elif Kaya',     timestamp: now - 4 * hr,         isMe: false },
    { id: 'm2',  text: 'Should we bring laptops? Last time the lab machines were super slow.',                                                               senderName: 'You',           timestamp: now - 3 * hr - 50 * min, isMe: true },
    { id: 'm3',  text: 'Definitely bring your own. We\'ll be running PyTorch notebooks and the lab GPUs are still not configured.',                           senderName: 'Burak Demir',   timestamp: now - 3 * hr - 45 * min, isMe: false },
    { id: 'm4',  text: 'Can someone share the GitHub repo link again? I lost the bookmark.',                                                                 senderName: 'Zeynep Arslan', timestamp: now - 3 * hr - 20 * min, isMe: false },
    { id: 'm5',  text: 'github.com/metu-ai-builders/workshop-2026 — it\'s pinned in the channel too.',                                                      senderName: 'Elif Kaya',     timestamp: now - 3 * hr - 18 * min, isMe: false },
    { id: 'm6',  text: 'Thanks Elif! I\'ll clone it tonight.',                                                                                               senderName: 'You',           timestamp: now - 3 * hr - 10 * min, isMe: true },
    { id: 'm7',  text: 'Also — we\'re voting on next month\'s topic. Current options: Reinforcement Learning, Diffusion Models, or LLM Fine-tuning.',        senderName: 'Burak Demir',   timestamp: now - 2 * hr - 30 * min, isMe: false },
    { id: 'm8',  text: 'LLM fine-tuning for sure. That\'s the hottest topic right now.',                                                                     senderName: 'Cem Öztürk',    timestamp: now - 2 * hr - 15 * min, isMe: false },
    { id: 'm9',  text: 'I second that! Would love to fine-tune something on Turkish data.',                                                                  senderName: 'You',           timestamp: now - 2 * hr,            isMe: true },
    { id: 'm10', text: '+1 for LLMs',                                                                                                                       senderName: 'Zeynep Arslan', timestamp: now - 1 * hr - 40 * min, isMe: false },
    { id: 'm11', text: 'Looks like LLMs win. I\'ll start prepping the notebook. See you all Wednesday!',                                                     senderName: 'Elif Kaya',     timestamp: now - 1 * hr,            isMe: false },
    { id: 'm12', text: 'Can\'t wait 🔥',                                                                                                                     senderName: 'You',           timestamp: now - 45 * min,          isMe: true },
  ],

  /* ── Campus Music Night ── */
  '1': [
    { id: 'm1',  text: 'Acoustic night lineup is almost final! We have 6 acts confirmed.',                                senderName: 'Deniz Yılmaz',   timestamp: now - 5 * hr,             isMe: false },
    { id: 'm2',  text: 'Nice! Is there still a slot open? My roommate plays classical guitar and wants to join.',          senderName: 'You',             timestamp: now - 4 * hr - 50 * min,  isMe: true },
    { id: 'm3',  text: 'We have one slot left. Tell them to DM me with a short video by tomorrow.',                        senderName: 'Deniz Yılmaz',   timestamp: now - 4 * hr - 45 * min,  isMe: false },
    { id: 'm4',  text: 'Will do, thanks!',                                                                                senderName: 'You',             timestamp: now - 4 * hr - 40 * min,  isMe: true },
    { id: 'm5',  text: 'Guys, can we talk about the sound system? Last time the bass was way too loud.',                   senderName: 'Selin Korkmaz',   timestamp: now - 3 * hr - 20 * min,  isMe: false },
    { id: 'm6',  text: 'Agreed. I\'ll bring my mixer this time so we can control levels better.',                          senderName: 'Mert Aksoy',      timestamp: now - 3 * hr,             isMe: false },
    { id: 'm7',  text: 'Perfect. Also reminder: doors open at 19:00, first act at 19:30. Volunteers please arrive by 18:00.', senderName: 'Deniz Yılmaz', timestamp: now - 2 * hr - 10 * min,  isMe: false },
    { id: 'm8',  text: 'I\'ll be there at 18 to help with chairs.',                                                       senderName: 'You',             timestamp: now - 2 * hr,             isMe: true },
    { id: 'm9',  text: 'Anyone bringing a camera? Would be nice to get some photos for the Instagram.',                    senderName: 'Selin Korkmaz',   timestamp: now - 1 * hr - 20 * min,  isMe: false },
    { id: 'm10', text: 'I can shoot some reels! 🎥',                                                                      senderName: 'Mert Aksoy',      timestamp: now - 1 * hr,             isMe: false },
    { id: 'm11', text: 'This is going to be great. See everyone Friday!',                                                 senderName: 'Deniz Yılmaz',   timestamp: now - 30 * min,           isMe: false },
  ],

  /* ── Astronomy Society ── */
  '6': [
    { id: 'm1',  text: 'Clear skies tonight! Observatory session is ON. 🔭',                                               senderName: 'Prof. Aydın',     timestamp: now - 6 * hr,             isMe: false },
    { id: 'm2',  text: 'Finally! It\'s been cloudy for two weeks straight.',                                                senderName: 'You',             timestamp: now - 5 * hr - 50 * min,  isMe: true },
    { id: 'm3',  text: 'Jupiter and Saturn should both be visible tonight. Bring warm clothes — it gets cold on the roof.',  senderName: 'Prof. Aydın',     timestamp: now - 5 * hr - 30 * min,  isMe: false },
    { id: 'm4',  text: 'Is the 12-inch telescope set up or are we using the smaller ones?',                                 senderName: 'Ayşe Çelik',     timestamp: now - 4 * hr,             isMe: false },
    { id: 'm5',  text: 'The 12-inch is ready. Furkan calibrated it this afternoon.',                                        senderName: 'Prof. Aydın',     timestamp: now - 3 * hr - 45 * min,  isMe: false },
    { id: 'm6',  text: 'I\'m bringing my DSLR with the telescope adapter. Let\'s try some astrophotography!',               senderName: 'You',             timestamp: now - 3 * hr - 30 * min,  isMe: true },
    { id: 'm7',  text: 'That would be amazing. We need good photos for the semester newsletter anyway.',                    senderName: 'Ayşe Çelik',     timestamp: now - 3 * hr,             isMe: false },
    { id: 'm8',  text: 'See you all at 20:00. Don\'t forget hot drinks ☕',                                                 senderName: 'Prof. Aydın',     timestamp: now - 2 * hr,             isMe: false },
  ],
};

const DEFAULT_MESSAGES: ChatMessage[] = [
  { id: 'm1',  text: 'Welcome to the group chat! Feel free to introduce yourselves.',      senderName: 'Admin',          timestamp: now - 8 * hr,             isMe: false },
  { id: 'm2',  text: 'Hey everyone! Excited to be here.',                                  senderName: 'You',            timestamp: now - 7 * hr - 30 * min,  isMe: true },
  { id: 'm3',  text: 'Hi! Looking forward to the upcoming events.',                        senderName: 'Merve Yıldız',   timestamp: now - 7 * hr,             isMe: false },
  { id: 'm4',  text: 'When is the next meetup? I missed the last announcement.',           senderName: 'Ahmet Kara',     timestamp: now - 6 * hr - 20 * min,  isMe: false },
  { id: 'm5',  text: 'Next Friday at 16:00 in the Student Center. See you there!',         senderName: 'Admin',          timestamp: now - 6 * hr,             isMe: false },
  { id: 'm6',  text: 'I\'ll be there! Can I bring a friend who wants to join?',            senderName: 'You',            timestamp: now - 5 * hr - 30 * min,  isMe: true },
  { id: 'm7',  text: 'Of course — newcomers are always welcome.',                          senderName: 'Admin',          timestamp: now - 5 * hr,             isMe: false },
  { id: 'm8',  text: 'Great community vibes already 🙌',                                   senderName: 'Merve Yıldız',   timestamp: now - 3 * hr,             isMe: false },
];

export function getMessagesForClub(clubId: string): ChatMessage[] {
  return CLUB_MESSAGES[clubId] ?? DEFAULT_MESSAGES;
}

/**
 * Mock role assignments for chat senders, keyed by clubId → senderName.
 * Only senders with a visible badge are listed; absence means regular member.
 */
export type SenderRole = 'ADMIN' | 'EDITOR';
export const MOCK_SENDER_ROLES: Record<string, Record<string, SenderRole>> = {
  '2': { 'Elif Kaya': 'ADMIN',  'Burak Demir': 'EDITOR' },
  '1': { 'Deniz Yılmaz': 'ADMIN' },
  '6': { 'Prof. Aydın': 'ADMIN', 'Ayşe Çelik': 'EDITOR' },
};
