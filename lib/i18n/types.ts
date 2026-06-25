export type Locale = 'en' | 'ku' | 'ar';

export const LOCALES: Locale[] = ['en', 'ku', 'ar'];

export const RTL_LOCALES: Locale[] = ['ku', 'ar'];

export type LearnTopicContent = {
  tag: string;
  title: string;
  paragraphs: string[];
};

export type LearnCardContent = {
  name: string;
  sub: string;
  tags: string[];
};

export type FeatureContent = {
  title: string;
  desc: string;
  projectX?: boolean;
};

export type TeamMemberContent = {
  index: string;
  role: string;
  roleLine2?: string;
  bio: string;
};

export type Translations = {
  meta: {
    title: string;
    description: string;
  };
  common: {
    comingSoon: string;
    openLesson: string;
    closeLesson: string;
    close: string;
    previous: string;
    next: string;
    goToSlide: (n: number) => string;
    goToMember: (n: number) => string;
    learnAbout: (topic: string) => string;
    featModalMsg: string;
    deploying: string;
    complete: string;
    sliderBoxLabel: string;
  };
  lang: {
    label: string;
    en: string;
    ku: string;
    ar: string;
  };
  nav: {
    about: string;
    team: string;
    learn: string;
    connect: string;
    openMenu: string;
    closeMenu: string;
  };
  hero: {
    logoAlt: string;
    joinCommunity: string;
    meetTeam: string;
    featuresLabel: string;
  };
  about: {
    tag: string;
    titleLine1: string;
    titleEm: string;
    p1: string;
    p2: string;
    p3: string;
    focusAreas: string[];
  };
  team: {
    tag: string;
    titlePrefix: string;
    titleEm: string;
    members: Record<string, TeamMemberContent>;
  };
  learn: {
    tag: string;
    titlePrefix: string;
    titleEm: string;
    hint: string;
    cards: Record<string, LearnCardContent>;
    topics: Record<string, LearnTopicContent>;
  };
  cta: {
    tag: string;
    titlePrefix: string;
    titleSuffix: string;
    sub: string;
    instagram: string;
    tiktok: string;
    github: string;
    followInstagram: string;
    followTiktok: string;
    viewGithub: string;
  };
  upcoming: {
    tag: string;
    titlePrefix: string;
    titleEm: string;
    features: Record<string, { title: string; feature: string }>;
  };
  footer: {
    copy: string;
  };
  features: Record<string, FeatureContent>;
};
