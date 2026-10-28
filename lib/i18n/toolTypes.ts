export type PasswordStrengthKey =
  | 'veryWeak'
  | 'weak'
  | 'fair'
  | 'strong'
  | 'veryStrong';

export type PhishingRiskKey = 'low' | 'medium' | 'high';

export type ToolTranslations = {
  passwordChecker: {
    kicker: string;
    title: string;
    titleEm: string;
    lead: string;
    inputHeading: string;
    inputLabel: string;
    inputPlaceholder: string;
    show: string;
    hide: string;
    clear: string;
    copy: string;
    copied: string;
    copyFailed: string;
    strength: string;
    scoreOf: (n: number) => string;
    crackTime: string;
    commonPassword: string;
    checks: {
      length: string;
      upper: string;
      lower: string;
      number: string;
      symbol: string;
      noRepeat: string;
      noSequence: string;
    };
    strengthLabels: Record<PasswordStrengthKey, string>;
    recommendationsHeading: string;
    tips: {
      common: { title: string; why: string };
      length: { title: string; why: string };
      caseMix: { title: string; why: string };
      numbers: { title: string; why: string };
      symbols: { title: string; why: string };
      repeats: { title: string; why: string };
      sequences: { title: string; why: string };
      reuse: { title: string; why: string };
      manager: { title: string; why: string };
      personal: { title: string; why: string };
    };
    disclaimer: string;
    generatorHeading: string;
    lengthLabel: (n: number) => string;
    optUpper: string;
    optLower: string;
    optNumbers: string;
    optSymbols: string;
    generate: string;
    copyGenerated: string;
    genNote: string;
    genNeedCharset: string;
    eduHeading: string;
    edu: Array<{ title: string; body: string }>;
  };
  phishingDetector: {
    kicker: string;
    title: string;
    titleEm: string;
    lead: string;
    analyzeHeading: string;
    inputLabel: string;
    inputPlaceholder: string;
    analyze: string;
    clear: string;
    example: string;
    loadingReputation: string;
    riskBadge: (level: string, score: number) => string;
    parsedHost: string;
    protocol: string;
    port: string;
    noIndicators: string;
    nextStep: string;
    reputationHeading: string;
    reputationUnavailable: string;
    reputationSafeNone: string;
    reputationHit: string;
    reputationFailed: string;
    disclaimer: string;
    eduHeading: string;
    edu: Array<{ title: string; body: string }>;
    invalidUrl: string;
    indicators: Record<
      string,
      {
        title: string;
        detail: string;
        advice: string;
      }
    >;
    riskLevels: Record<PhishingRiskKey, string>;
  };
  courses: {
    kicker: string;
    title: string;
    titleEm: string;
    lead: string;
    searchPlaceholder: string;
    allCategories: string;
    subjectPlaceholder: string;
    allLevels: string;
    sortNewest: string;
    sortTitle: string;
    recentlyAdded: string;
    allResources: string;
    empty: string;
    loadError: string;
    loading: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    detailsKicker: string;
    author: string;
    added: string;
    readPdf: string;
    downloadPdf: string;
    backLibrary: string;
    unavailable: string;
    loadingResource: string;
    readerKicker: string;
    details: string;
    openFullscreen: string;
    download: string;
    readerFallback: string;
    readerError: string;
    categories: Record<string, string>;
  };
  admin: {
    kicker: string;
    title: string;
    titleEm: string;
    signedInAs: (name: string) => string;
    signOut: string;
    viewPublic: string;
    checkingSession: string;
    loginTitle: string;
    loginHint: string;
    username: string;
    password: string;
    signIn: string;
    uploadHeading: string;
    editHeading: string;
    fieldTitle: string;
    fieldDescription: string;
    fieldSubject: string;
    fieldAuthor: string;
    published: string;
    allowDownload: string;
    pdfFile: string;
    pdfReplace: string;
    coverOptional: string;
    save: string;
    saving: string;
    update: string;
    cancelEdit: string;
    existing: string;
    noUploads: string;
    status: string;
    meta: string;
    actions: string;
    draft: string;
    publishedStatus: string;
    edit: string;
    unpublish: string;
    publish: string;
    preview: string;
    delete: string;
    deleteConfirm: (title: string) => string;
    created: string;
    updated: string;
    saveFailed: string;
  };
};
