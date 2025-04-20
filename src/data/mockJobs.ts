import { Job } from '../types/job';

// Generate random date within the last 60 days
const randomDate = (days: number = 60): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date.toISOString();
};

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    category: 'Engineering',
    description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for developing user interfaces using Vue.js and TypeScript.',
    requirements: [
      'At least 5 years of experience in frontend development',
      'Strong knowledge of Vue.js, TypeScript, and modern CSS',
      'Experience with state management (Vuex, Pinia)',
      'Understanding of responsive design and cross-browser compatibility',
      'Excellent problem-solving skills'
    ],
    benefits: [
      'Competitive salary and equity options',
      'Health, dental, and vision insurance',
      'Flexible work schedule',
      'Remote work options',
      '401(k) matching'
    ],
    postedAt: randomDate(5),
    applicationCount: 42,
    featured: true
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateCo',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    category: 'Product',
    description: 'InnovateCo is seeking a talented Product Manager to help us build amazing digital products. You will work closely with engineering, design, and marketing teams.',
    requirements: [
      'Bachelor\'s degree in Business, Computer Science, or related field',
      '3+ years of experience in product management',
      'Strong analytical skills and data-driven approach',
      'Excellent communication and leadership skills',
      'Experience with agile methodologies'
    ],
    benefits: [
      'Competitive salary and bonuses',
      'Comprehensive health benefits',
      'Unlimited PTO',
      'Professional development budget',
      'Gym membership'
    ],
    postedAt: randomDate(12),
    applicationCount: 38,
    featured: false
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'DesignLab',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    category: 'Design',
    description: 'DesignLab is looking for a creative UX/UI Designer to create beautiful and functional user interfaces for our digital products.',
    requirements: [
      'Portfolio demonstrating strong UI design skills',
      'Experience with Figma, Sketch, or Adobe XD',
      'Knowledge of design systems and component libraries',
      'Understanding of user-centered design principles',
      'Ability to collaborate with product and engineering teams'
    ],
    benefits: [
      'Competitive salary',
      'Remote-first culture',
      'Flexible hours',
      'Health insurance',
      'Equipment allowance'
    ],
    postedAt: randomDate(),
    applicationCount: 24,
    featured: true
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    category: 'Engineering',
    description: 'CloudTech is seeking a DevOps Engineer to help us build and maintain our cloud infrastructure. You will work with AWS, Docker, and Kubernetes.',
    requirements: [
      'Strong experience with AWS or other cloud providers',
      'Knowledge of Docker, Kubernetes, and containerization',
      'Experience with CI/CD pipelines',
      'Infrastructure as Code (Terraform, CloudFormation)',
      'Linux system administration skills'
    ],
    benefits: [
      'Competitive salary',
      'Stock options',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Home office stipend'
    ],
    postedAt: randomDate(15),
    applicationCount: 19,
    featured: false
  },
  {
    id: '5',
    title: 'Marketing Specialist',
    company: 'GrowthPartners',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$70,000 - $90,000',
    category: 'Marketing',
    description: 'GrowthPartners is looking for a Marketing Specialist to join our growing team. You will help develop and implement marketing campaigns across various channels.',
    requirements: [
      'Bachelor\'s degree in Marketing or related field',
      '2+ years of experience in digital marketing',
      'Experience with SEO, SEM, and social media marketing',
      'Strong analytical skills and experience with marketing analytics tools',
      'Excellent communication and creative thinking'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Paid time off',
      'Professional development opportunities'
    ],
    postedAt: randomDate(8),
    applicationCount: 31,
    featured: false
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'AnalyticsPro',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: '$115,000 - $145,000',
    category: 'Data Science',
    description: 'AnalyticsPro is seeking a Data Scientist to help us extract insights from complex datasets. You will use statistical analysis and machine learning techniques.',
    requirements: [
      'Master\'s or PhD in Statistics, Computer Science, or related field',
      'Strong programming skills in Python or R',
      'Experience with machine learning frameworks',
      'Knowledge of SQL and database systems',
      'Excellent problem-solving skills'
    ],
    benefits: [
      'Competitive salary',
      'Health, dental, and vision insurance',
      'Flexible work arrangements',
      'Continuous learning opportunities',
      'Modern office with great amenities'
    ],
    postedAt: randomDate(3),
    applicationCount: 27,
    featured: true
  },
  {
    id: '7',
    title: 'Customer Success Manager',
    company: 'ServiceFirst',
    location: 'Denver, CO',
    type: 'Full-time',
    salary: '$80,000 - $100,000',
    category: 'Customer Service',
    description: 'ServiceFirst is looking for a Customer Success Manager to ensure our clients get the most value from our products. You will be the primary point of contact for a portfolio of clients.',
    requirements: [
      'Bachelor\'s degree in Business or related field',
      '3+ years of experience in customer success or account management',
      'Strong communication and relationship building skills',
      'Problem-solving and conflict resolution abilities',
      'Experience with CRM software'
    ],
    benefits: [
      'Competitive base salary + commission',
      'Comprehensive health benefits',
      'Paid time off',
      'Career advancement opportunities',
      'Collaborative work environment'
    ],
    postedAt: randomDate(20),
    applicationCount: 22,
    featured: false
  },
  {
    id: '8',
    title: 'Software Engineer',
    company: 'CodeWorks',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    category: 'Engineering',
    description: 'CodeWorks is seeking a talented Software Engineer to join our engineering team. You will design, develop, and maintain software applications.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      '3+ years of experience in software development',
      'Proficiency in one or more programming languages (Python, JavaScript, Java)',
      'Experience with web frameworks and RESTful APIs',
      'Knowledge of database systems and SQL'
    ],
    benefits: [
      'Competitive salary',
      'Health, dental, and vision insurance',
      'Retirement plan with matching',
      'Flexible work hours',
      'Regular team outings and events'
    ],
    postedAt: randomDate(1),
    applicationCount: 45,
    featured: true
  },
  {
    id: '9',
    title: 'Content Writer',
    company: 'MediaHub',
    location: 'Remote',
    type: 'Contract',
    salary: '$40 - $60 per hour',
    category: 'Content',
    description: 'MediaHub is looking for a skilled Content Writer to create engaging and informative content for our clients. You will work on blog posts, articles, and website copy.',
    requirements: [
      'Bachelor\'s degree in English, Journalism, or related field',
      'Portfolio demonstrating writing skills',
      'SEO knowledge and experience',
      'Ability to meet deadlines and handle multiple projects',
      'Research skills and attention to detail'
    ],
    benefits: [
      'Competitive hourly rate',
      'Flexible schedule',
      'Remote work',
      'Potential for long-term collaboration',
      'Diverse projects and clients'
    ],
    postedAt: randomDate(25),
    applicationCount: 19,
    featured: false
  },
  {
    id: '10',
    title: 'HR Manager',
    company: 'PeopleFirst',
    location: 'Atlanta, GA',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    category: 'Human Resources',
    description: 'PeopleFirst is seeking an experienced HR Manager to oversee all aspects of human resources for our growing company. You will handle recruitment, employee relations, benefits, and more.',
    requirements: [
      'Bachelor\'s degree in Human Resources or related field',
      '5+ years of experience in HR management',
      'Knowledge of employment laws and regulations',
      'Experience with HRIS and payroll systems',
      'Strong leadership and communication skills'
    ],
    benefits: [
      'Competitive salary',
      'Comprehensive benefits package',
      'Paid time off',
      'Professional development opportunities',
      'Employee wellness program'
    ],
    postedAt: randomDate(18),
    applicationCount: 15,
    featured: false
  },
  {
    id: '11',
    title: 'Backend Developer',
    company: 'ServerStack',
    location: 'Portland, OR',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    category: 'Engineering',
    description: 'ServerStack is looking for a Backend Developer to build and maintain our server infrastructure. You will work with Node.js, databases, and cloud services.',
    requirements: [
      'Strong experience with Node.js and Express',
      'Knowledge of database design and SQL/NoSQL databases',
      'Experience with RESTful APIs and microservices',
      'Understanding of cloud services (AWS, Azure, or GCP)',
      'Problem-solving and debugging skills'
    ],
    benefits: [
      'Competitive salary',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      'Remote work options',
      'Continuous learning budget'
    ],
    postedAt: randomDate(2),
    applicationCount: 33,
    featured: true
  },
  {
    id: '12',
    title: 'Financial Analyst',
    company: 'CapitalGroup',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$85,000 - $105,000',
    category: 'Finance',
    description: 'CapitalGroup is seeking a Financial Analyst to support our financial planning and analysis team. You will prepare financial reports, forecasts, and budgets.',
    requirements: [
      'Bachelor\'s degree in Finance, Accounting, or related field',
      '2+ years of experience in financial analysis',
      'Proficiency in Excel and financial modeling',
      'Knowledge of financial reporting and analysis',
      'Attention to detail and analytical thinking'
    ],
    benefits: [
      'Competitive salary',
      'Performance bonuses',
      'Comprehensive benefits package',
      '401(k) with matching',
      'Professional development opportunities'
    ],
    postedAt: randomDate(10),
    applicationCount: 28,
    featured: false
  }
];