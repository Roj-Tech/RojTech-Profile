export type LearnCardMeta = {
  id: string;
  icon: string;
  delay: string;
};

export const LEARN_CARDS_META: LearnCardMeta[] = [
  { id: 'network-security', icon: '🛡️', delay: 'reveal-delay-1' },
  { id: 'penetration-testing', icon: '⚔️', delay: 'reveal-delay-2' },
  { id: 'future-software-technologies', icon: '🚀', delay: 'reveal-delay-3' },
  { id: 'game-development', icon: '🎮', delay: 'reveal-delay-1' },
  { id: 'web-development', icon: '🌐', delay: 'reveal-delay-2' },
  { id: 'cloud-security', icon: '☁️', delay: 'reveal-delay-3' },
];

export type FeatureSlideMeta = {
  id: string;
  tag: string;
  icon: string;
};

export const FEATURE_SLIDES_META: FeatureSlideMeta[] = [
  { id: 'password-checker', tag: 'FEATURE_01', icon: '🔐' },
  { id: 'project-x', tag: 'FEATURE_02', icon: '🛠️' },
  { id: 'phishing-detector', tag: 'FEATURE_03', icon: '🎣' },
  { id: 'courses', tag: 'FEATURE_04', icon: '📚' },
];

export type UpcomingFeatureMeta = {
  id: string;
  tag: string;
  icon: string;
  className?: string;
};

export const UPCOMING_FEATURES_META: UpcomingFeatureMeta[] = [
  { id: 'password-checker', tag: 'MODULE_01', icon: '🔐' },
  { id: 'project-x', tag: 'MODULE_02', icon: '🛠️' },
  { id: 'courses', tag: 'MODULE_03', icon: '📚' },
  { id: 'phishing-detector', tag: 'MODULE_04', icon: '🎣', className: 'ufc-below-center' },
];

export type TeamMemberMeta = {
  id: string;
  name: string;
  image: string;
  instagram?: string;
  linkedin?: string;
};

export const TEAM_MEMBERS_META: TeamMemberMeta[] = [
  {
    id: 'mustafa',
    name: 'Mustafa Kamaran',
    image: '/Mustafa.PNG',
    instagram: 'https://www.instagram.com/mustafa_._kamaran',
    linkedin: 'https://www.linkedin.com/in/mustafa-kamaran-02b61b418',
  },
  {
    id: 'ballen',
    name: 'Ballen Hassan',
    image: '/NewBallen.jpeg',
    instagram: 'https://www.instagram.com/balen_khoshnnaw',
  },
  {
    id: 'mazn',
    name: 'Balen Mazn Abdulrahman',
    image: '/mazn.jpeg',
    instagram: 'https://www.instagram.com/balen.831',
    linkedin: 'https://www.linkedin.com/in/balen-mezn-a70bb934a',
  },
  {
    id: 'bilind',
    name: 'Bilind Farman',
    image: '/Bilind.PNG',
    instagram: 'https://www.instagram.com/bilind.farman',
    linkedin: 'https://www.linkedin.com/in/blnd-farman-28432735b',
  },
];
