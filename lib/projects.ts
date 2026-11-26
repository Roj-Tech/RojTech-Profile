export type ProjectMeta = {
  id: string;
  code: string;
  url: string;
  accent: 'cyan' | 'orange' | 'green';
};

export const PROJECTS_META: ProjectMeta[] = [
  {
    id: 'hali-kar',
    code: '01',
    url: 'https://hali-kar-demo.netlify.app/demo',
    accent: 'cyan',
  },
  {
    id: 'parastin360',
    code: '02',
    url: 'https://parastin360-demo.netlify.app',
    accent: 'orange',
  },
  {
    id: 'ukh-lab',
    code: '03',
    url: 'https://ukh-lab-system-demo.netlify.app',
    accent: 'green',
  },
  {
    id: 'keepit',
    code: '04',
    url: 'https://keepit-demo.netlify.app',
    accent: 'cyan',
  },
  {
    id: 'roj-quest',
    code: '05',
    url: 'https://mywebsite-two-drab.vercel.app',
    accent: 'orange',
  },
];
