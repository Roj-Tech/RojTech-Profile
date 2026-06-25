import type { Translations } from '../types';

export const en: Translations = {
  meta: {
    title: 'RojTech — Security Learning Platform',
    description:
      'RojTech — cybersecurity, software, and emerging technologies learning platform.',
  },
  common: {
    comingSoon: 'COMING SOON',
    openLesson: 'Open lesson →',
    closeLesson: 'Close lesson',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    goToSlide: (n) => `Go to slide ${n}`,
    goToMember: (n) => `Go to team member ${n}`,
    learnAbout: (topic) => `Learn about ${topic}`,
    featModalMsg: 'We are working to give you the best',
    deploying: 'DEPLOYING_V2.0',
    complete: '65% COMPLETE',
    sliderBoxLabel: 'UPCOMING_FEATURES',
  },
  lang: {
    label: 'Language',
    en: 'EN',
    ku: 'KU',
    ar: 'AR',
  },
  nav: {
    about: 'About',
    team: 'Team',
    learn: 'Learn',
    connect: 'Connect',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
  hero: {
    logoAlt: 'RojTech Logo',
    joinCommunity: 'Join Our Community',
    meetTeam: 'Meet The Team',
    featuresLabel: 'New Features Are Coming, Stay Tuned',
  },
  about: {
    tag: 'About The Platform',
    titleLine1: 'Empowering the Next',
    titleEm: 'Generation of Tech',
    p1: 'RojTech is a modern platform focused on cybersecurity, software, and emerging technologies. Our goal is to share knowledge, explore digital innovation, and help people stay connected with the fast-moving world of technology.',
    p2: 'From cybersecurity awareness to software projects and technical content, RojTech is built for curious minds who want to learn, create, and grow in the tech field.',
    p3: 'We believe technology should be accessible, educational, and inspiring for everyone.',
    focusAreas: [
      'Cybersecurity',
      'Software Development',
      'AI & Technology',
      'Digital Innovation',
    ],
  },
  team: {
    tag: 'The Team',
    titlePrefix: 'The Minds Behind ',
    titleEm: 'RojTech',
    members: {
      mustafa: {
        index: '01 / TEAM',
        role: 'Co-Founder • Scriptwriter • Front-End Developer',
        roleLine2: 'CS-Student',
        bio: "Visionary strategist and creative lead responsible for the platform's narrative and core architecture.",
      },
      ballen: {
        index: '02 / TEAM',
        role: 'Co-Founder • Videographer • Graphic Designer',
        roleLine2: 'CS-Student',
        bio: "Creative mastermind behind the platform's visual identity, specializing in high-end cinematic production and editing.",
      },
      mazn: {
        index: '03 / TEAM',
        role: 'Speaker • Backend Developer',
        roleLine2: 'SE-Student',
        bio: 'Charismatic speaker and backend developer building reliable server infrastructure and representing RojTech in the community.',
      },
      bilind: {
        index: '04 / TEAM',
        role: 'Co-Founder • Speaker',
        roleLine2: 'CS-Student',
        bio: "Charismatic communicator and strategic lead, driving the platform's community engagement and public presence.",
      },
    },
  },
  learn: {
    tag: 'Learning Hub',
    titlePrefix: 'Explore ',
    titleEm: 'Topics',
    hint: 'Click a topic to open the lesson module',
    cards: {
      'network-security': {
        name: 'Network Security',
        sub: 'Firewalls · IDS/IPS · VPN',
        tags: ['Wireshark', 'Snort', 'pfSense', 'Nmap'],
      },
      'penetration-testing': {
        name: 'Penetration Testing',
        sub: 'Red Team · OSCP · CTF',
        tags: ['Metasploit', 'Burp Suite', 'Kali Linux', 'SQLMap'],
      },
      'future-software-technologies': {
        name: 'Future Software Technologies',
        sub: 'AI · Cloud · Automation · XR',
        tags: ['Artificial Intelligence', 'Cloud Computing', 'Automation', 'VR / AR'],
      },
      'game-development': {
        name: 'Game Development',
        sub: 'Unity · Unreal · Design · Esports',
        tags: ['Unity', 'Unreal Engine', 'Game Design', 'Esports'],
      },
      'web-development': {
        name: 'Web Development',
        sub: 'Frontend · Backend · Full-Stack',
        tags: ['HTML / CSS / JS', 'Node.js', 'React', 'MySQL'],
      },
      'cloud-security': {
        name: 'Cloud Security',
        sub: 'AWS · Azure · GCP',
        tags: ['AWS IAM', 'Security Hub', 'Terraform', 'GuardDuty'],
      },
    },
    topics: {
      'network-security': {
        tag: 'TOPIC_01',
        title: 'Network Security',
        paragraphs: [
          'Network security is the process of protecting computer networks from unauthorized access, cyber attacks, malware, data theft, and other digital threats. It includes both hardware and software technologies designed to keep systems safe and secure.',
          'As internet usage continues to grow worldwide, cybercriminals are becoming more advanced. Hackers constantly search for weaknesses in networks to steal private information, damage systems, or gain unauthorized access. Because of this, companies and organizations invest heavily in cybersecurity and network protection.',
          'There are many different threats that can target a network. One of the most common threats is malware, which includes viruses, worms, and ransomware. Malware can damage files, slow down systems, or even lock users out of their devices. Another dangerous threat is phishing, where attackers trick people into revealing passwords or personal information through fake emails or websites.',
          'To defend against these threats, organizations use multiple layers of security. Firewalls help block unauthorized traffic from entering a network. Antivirus software detects and removes malicious programs. Encryption protects sensitive data by converting it into unreadable code that only authorized users can access. Strong passwords and multi-factor authentication also play an important role in protecting accounts and systems.',
        ],
      },
      'penetration-testing': {
        tag: 'TOPIC_02',
        title: 'Penetration Testing',
        paragraphs: [
          'Penetration testing is a controlled, authorized attempt to find and exploit security weaknesses in systems, applications, and networks before real attackers do. Ethical hackers simulate real-world attacks to help organizations understand their true risk exposure.',
          'A typical engagement follows a structured methodology: reconnaissance to gather information, scanning to map services, exploitation to demonstrate impact, and reporting with clear remediation steps. Findings are prioritized by severity so teams can fix the most critical issues first.',
          'Common techniques include web application testing, password attacks, privilege escalation, and social engineering simulations. Tools such as Burp Suite, Metasploit, and Nmap support testing, but skilled judgment and documentation matter just as much as tooling.',
          'Penetration testing strengthens compliance, incident readiness, and secure development practices. When combined with regular patching and secure configuration, it helps organizations stay ahead of evolving threats.',
        ],
      },
      'future-software-technologies': {
        tag: 'TOPIC_03',
        title: 'Future Software Technologies',
        paragraphs: [
          'Future Software Technologies are transforming the way people live, work, communicate, and interact with the digital world. As technology continues evolving rapidly, software is becoming smarter, faster, and more powerful than ever before.',
          'In the future, software will play an even bigger role in daily life. Artificial intelligence is expected to become deeply integrated into applications and systems, allowing software to learn, make decisions, and automate complex tasks. AI-powered assistants, intelligent applications, and smart systems are already changing industries such as healthcare, education, finance, and cybersecurity.',
          'Cloud computing is also shaping the future of software. Instead of relying only on local devices, many applications now operate through cloud platforms, allowing users to access services and data from anywhere in the world. This technology improves flexibility, collaboration, and storage capabilities.',
          'Another important future technology is automation. Businesses are increasingly using software automation to improve productivity and reduce human effort. Automated systems can manage operations, analyze data, and perform repetitive tasks efficiently.',
          'Virtual reality and augmented reality are expected to become more advanced in the coming years. These technologies may completely change gaming, education, training, and online communication by creating immersive digital experiences.',
        ],
      },
      'game-development': {
        tag: 'TOPIC_04',
        title: 'Game Development',
        paragraphs: [
          'Game development is the process of creating video games for computers, consoles, mobile devices, and online platforms. It combines programming, design, storytelling, graphics, animation, sound, and creativity to build interactive digital experiences.',
          'The gaming industry has become one of the largest entertainment industries in the world. Millions of people play games every day, and modern games continue becoming more realistic, competitive, and immersive through advanced technology.',
          'Game development involves multiple stages. Developers first create ideas and concepts for the game, including characters, gameplay mechanics, and storylines. Programmers then write the code that makes the game function, while designers create graphics, environments, and animations. Sound engineers add music and audio effects to improve the player experience.',
          'Game developers use powerful engines such as Unity and Unreal Engine to create modern games with advanced graphics and physics systems. Artificial intelligence is also used in games to control non-player characters and improve gameplay experiences.',
          'The gaming industry continues growing because of esports, online streaming, and digital communities. Competitive gaming tournaments now attract millions of viewers worldwide, turning gaming into both entertainment and a professional career path.',
          'However, game development can also be challenging. Developers must optimize performance, fix bugs, improve gameplay balance, and create engaging content for players. Creating a successful game requires both technical skills and creativity.',
          'Game development is more than just creating entertainment — it is a combination of technology, art, and innovation that continues shaping modern digital culture.',
        ],
      },
      'web-development': {
        tag: 'TOPIC_05',
        title: 'Web Development',
        paragraphs: [
          'Web development is the process of creating and maintaining websites and web applications. It is one of the most important areas in modern technology because websites are used every day for communication, business, education, entertainment, and online services.',
          'Web development involves designing how a website looks and programming how it works. Developers use different technologies and programming languages to build modern websites that are fast, interactive, and user-friendly.',
          'Web development is usually divided into three main areas. Front-End Development focuses on the visual part of a website that users interact with directly. Front-end developers use technologies such as HTML, CSS, and JavaScript to create layouts, animations, buttons, and responsive designs.',
          'Back-End Development handles the server, database, and application logic behind the website. It ensures that websites can process data, manage accounts, and function properly. Popular back-end technologies include Python, PHP, Java, Node.js, and databases like MySQL.',
          'Full-Stack Development means working on both front-end and back-end development. Full-stack developers can build complete websites and applications from start to finish.',
          'Web development is used in many industries. Online shopping websites, social media platforms, banking systems, educational platforms, and streaming services all depend on web technologies.',
          'Modern web development continues evolving rapidly. Developers now create responsive websites that work across phones, tablets, and computers. Artificial intelligence, cloud computing, and advanced web frameworks are also shaping the future of the internet.',
          'Security is another important part of web development. Developers must protect websites from hackers, data leaks, and cyber attacks by using secure coding practices and strong security systems.',
          'Web development is not only about building websites — it is about creating digital experiences that connect people around the world. As technology grows, web development will remain one of the most powerful and essential fields in the software industry.',
        ],
      },
      'cloud-security': {
        tag: 'TOPIC_06',
        title: 'Cloud Security',
        paragraphs: [
          'Cloud security protects data, applications, and infrastructure hosted in public, private, or hybrid cloud environments. Major providers such as AWS, Azure, and GCP offer native controls, but customers remain responsible for configuring identity, networking, and data protection correctly.',
          'Identity and access management (IAM) is foundational: least-privilege roles, strong authentication, and continuous review of permissions prevent unauthorized access to resources.',
          'Services like AWS Security Hub and GuardDuty aggregate findings and detect suspicious API activity, misconfigurations, and threats. Infrastructure-as-code tools such as Terraform enable repeatable, auditable secure deployments.',
          'Cloud security also requires encryption in transit and at rest, logging and monitoring across all accounts, and incident response plans tailored to ephemeral, distributed assets.',
        ],
      },
    },
  },
  cta: {
    tag: 'Stay Connected',
    titlePrefix: 'Join the ',
    titleSuffix: 'Community',
    sub: 'Follow RojTech on Instagram and TikTok for tips and updates, or explore our projects on GitHub.',
    instagram: 'Instagram',
    tiktok: 'TikTok',
    github: 'GitHub',
    followInstagram: 'Follow RojTech on Instagram',
    followTiktok: 'Follow RojTech on TikTok',
    viewGithub: 'View RojTech on GitHub',
  },
  upcoming: {
    tag: 'Stay Tuned',
    titlePrefix: 'New ',
    titleEm: 'Features',
    features: {
      'password-checker': {
        title: 'Password Checker',
        feature: 'Password Checker',
      },
      'project-x': {
        title: 'Project X',
        feature: 'Project X',
      },
      courses: {
        title: 'Courses',
        feature: 'Courses',
      },
      'phishing-detector': {
        title: 'Phishing Detector',
        feature: 'Phishing Detector',
      },
    },
  },
  footer: {
    copy: '© 2026 RojTech Platform · All Rights Reserved',
  },
  features: {
    'password-checker': {
      title: 'Password Checker',
      desc: 'Instantly analyze the strength of any password — entropy score, breach detection, and hardening tips powered by real-time analysis.',
    },
    'project-x': {
      title: 'Project X',
      desc: 'Hands-on cybersecurity project workspace — build, document, and showcase real-world offensive and defensive security work.',
      projectX: true,
    },
    'phishing-detector': {
      title: 'Phishing Detector',
      desc: 'Scan suspicious links and messages for phishing signs — URL analysis, sender checks, and risk scoring to help you avoid scams before you click.',
    },
    courses: {
      title: 'Courses',
      desc: 'Structured learning paths from beginner to advanced — video lessons, guided modules, and practical exercises across cybersecurity, development, and emerging tech.',
    },
  },
};
