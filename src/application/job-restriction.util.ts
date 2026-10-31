 /*Utility for evaluating profile biography domain (tech vs non-tech)
 * and job role domain to enforce application restrictions.
 */
export const TECH_KEYWORDS: string[] = [
  // Tech Roles & Titles
  'software',
  'developer',
  'programmer',
  'programming',
  'frontend',
  'front-end',
  'backend',
  'back-end',
  'fullstack',
  'full-stack',
  'web developer',
  'devops',
  'sysadmin',
  'system administrator',
  'systems administrator',
  'database administrator',
  'dba',
  'data scientist',
  'data science',
  'data analyst',
  'data analytics',
  'data engineer',
  'machine learning',
  'deep learning',
  'artificial intelligence',
  'ai engineer',
  'cybersecurity',
  'cyber security',
  'infosec',
  'information security',
  'network engineer',
  'network administrator',
  'cloud engineer',
  'cloud architect',
  'solution architect',
  'solutions architect',
  'qa engineer',
  'qa tester',
  'quality assurance',
  'software engineer',
  'computer engineer',
  'it specialist',
  'it support',
  'it administrator',
  'information technology',
  'computer science',
  'embedded systems',
  'mobile developer',
  'android developer',
  'ios developer',
  // Programming Languages & Runtimes
  'javascript',
  'typescript',
  'python',
  'java',
  'c\\+\\+',
  'c#',
  'golang',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'dart',
  'nodejs',
  'node\\.js',
  // Frameworks & Libraries
  'react',
  'reactjs',
  'react\\.js',
  'angular',
  'vue',
  'vuejs',
  'svelte',
  'nextjs',
  'next\\.js',
  'nestjs',
  'nest\\.js',
  'expressjs',
  'express\\.js',
  'django',
  'flask',
  'fastapi',
  'spring boot',
  'laravel',
  'rails',
  'ruby on rails',
  'flutter',
  'react native',
  'tailwind',
  // Tools, Cloud, DB, Infrastructure
  'sql',
  'mysql',
  'postgresql',
  'postgres',
  'mongodb',
  'redis',
  'nosql',
  'docker',
  'kubernetes',
  'k8s',
  'terraform',
  'aws',
  'azure',
  'gcp',
  'linux',
  'git',
  'github',
  'gitlab',
  'rest api',
  'restful',
  'graphql',
  'microservices',
  'ci/cd',
];
export const NON_TECH_KEYWORDS: string[] = [
  // Healthcare & Medicine
  'healthcare',
  'health care',
  'medical',
  'medicine',
  'nurse',
  'nursing',
  'doctor',
  'physician',
  'hospital',
  'clinic',
  'clinical',
  'patient care',
  'pharmacy',
  'pharmacist',
  'therapy',
  'therapist',
  'dental',
  'dentist',
  'psychology',
  'psychologist',
  // Finance, Accounting & Banking
  'accounting',
  'accountant',
  'bookkeeper',
  'bookkeeping',
  'auditor',
  'auditing',
  'audit',
  'tax',
  'taxes',
  'taxation',
  'banking',
  'banker',
  'finance',
  'financial',
  'economics',
  'economist',
  'payroll',
  'wealth management',
  // Sales, Marketing & Customer Relations
  'sales',
  'salesperson',
  'sales executive',
  'sales representative',
  'marketing',
  'marketer',
  'digital marketing',
  'seo',
  'sem',
  'social media marketing',
  'advertising',
  'copywriter',
  'copywriting',
  'public relations',
  'customer service',
  'customer support',
  'customer success',
  'crm',
  'retail',
  'cashier',
  'telemarketing',
  'merchandising',
  // Human Resources & Administration
  'human resources',
  'hr',
  'recruitment',
  'recruiter',
  'talent acquisition',
  'administrative',
  'admin assistant',
  'office manager',
  'receptionist',
  'secretary',
  'clerk',
  // Education
  'teacher',
  'teaching',
  'tutor',
  'tutoring',
  'professor',
  'lecturer',
  'instructor',
  'education',
  'kindergarten',
  'pedagogy',
    'customer success',
  'crm',
  'retail',
  'cashier',
  'telemarketing',
  'merchandising',
  // Human Resources & Administration
  'human resources',
  'hr',
  'recruitment',
  'recruiter',
  'talent acquisition',
  'administrative',
  'admin assistant',
  'office manager',
  'receptionist',
  'secretary',
  'clerk',
  // Education
  'teacher',
  'teaching',
  'tutor',
  'tutoring',
  'professor',
  'lecturer',
  'instructor',
  'education',
  'kindergarten',
  'pedagogy',
  // Legal
  'lawyer',
  'attorney',
  'legal',
  'law',
  'paralegal',
  'compliance',
  'litigation',
  // Hospitality, Food & Tourism
  'hospitality',
  'hotel',
  'restaurant',
  'chef',
  'cook',
  'culinary',
  'barista',
  'waiter',
  'waitress',
  'tourism',
  'tour guide',
  // Trades, Construction, Logistics
  'construction',
  'carpenter',
  'carpentry',
  'plumber',
  'plumbing',
  'electrician',
  'mechanic',
  'driver',
  'truck driver',
  'logistics',
  'warehouse',
  'supply chain',
  'procurement',
  'inventory',
  'manufacturing',
  // Arts & Media (Non-tech)
  'journalism',
  'journalist',
  'writer',
  'author',
  'interior design',
  'fashion',
  'photography',
  'photographer',
  'musician',
  'artist',
];
/**
 * Checks whether text matches any of the given keywords as standalone words or phrases.
 */
export function containsKeywords(
  text: string | null | undefined,
  keywords: string[],
): boolean {
  if (!text || typeof text !== 'string') return false;
  return keywords.some((kw) => {
    const pattern = new RegExp(`(^|[^a-zA-Z0-9_])${kw}([^a-zA-Z0-9_]|$)`, 'i');
    return pattern.test(text);
  });
  }
export type ProfileDomainType = 'tech_only' | 'non_tech_only' | 'both' | 'unknown';
export interface BioClassification {
  hasTech: boolean;
  hasNonTech: boolean;
  domainType: ProfileDomainType;
}
/**
 * Classifies a user's biography and skills into tech, non-tech, or both.
 */
export function classifyBio(
  bio: string | null | undefined,
  skill?: string | null,
): BioClassification {
  const bioTech = containsKeywords(bio, TECH_KEYWORDS);
  const bioNonTech = containsKeywords(bio, NON_TECH_KEYWORDS);
   let hasTech = bioTech;
  let hasNonTech = bioNonTech;
  // Fallback to skill if neither was detected in biography
  if (!hasTech && !hasNonTech && skill) {
    hasTech = containsKeywords(skill, TECH_KEYWORDS);
    hasNonTech = containsKeywords(skill, NON_TECH_KEYWORDS);
  }
  let domainType: ProfileDomainType = 'unknown';
  if (hasTech && hasNonTech) {
    domainType = 'both';
  } else if (hasTech) {
    domainType = 'tech_only';
  } else if (hasNonTech) {
    domainType = 'non_tech_only';
  }
  return { hasTech, hasNonTech, domainType };
}
/**
 * Classifies a job as tech or non-tech based on title, skills, and description.
 */
export function classifyJob(job: {
  title?: string;
  requiredskill?: string;
  description?: string;
}): { isTech: boolean; isNonTech: boolean } {
  const titleTech = containsKeywords(job.title, TECH_KEYWORDS);
  const skillTech = containsKeywords(job.requiredskill, TECH_KEYWORDS);
  const descTech = containsKeywords(job.description, TECH_KEYWORDS);
  const titleNonTech = containsKeywords(job.title, NON_TECH_KEYWORDS);
  const skillNonTech = containsKeywords(job.requiredskill, NON_TECH_KEYWORDS);
  const isTech = titleTech || skillTech || (descTech && !titleNonTech);
  const isNonTech = !isTech || titleNonTech || skillNonTech;
  return { isTech, isNonTech };
}
export interface ApplicationValidationResult {
  allowed: boolean;
  reason?: string;
  profileType: ProfileDomainType;
  isTechJob: boolean;
}
/**
 * Validates whether the applicant is eligible to apply to the job according to the rules:
 * - If profile has a tech biography: can apply only to tech jobs.
 * - If profile has other field not related to tech: cannot apply to tech jobs.
 * - If profile has both: can apply to both tech and non-tech jobs.
 */
export function validateJobApplicationEligibility(
  bio: string | null | undefined,
  skill: string | null | undefined,
  job: {
    title?: string;
    requiredskill?: string;
    description?: string;
  },
): ApplicationValidationResult {
  const profile = classifyBio(bio, skill);
  const jobClassification = classifyJob(job);
  if (!profile.hasTech && !profile.hasNonTech) {
    return {
      allowed: false,
      reason:
        'Could not determine your professional field from your profile biography. Please update your biography before applying.',
      profileType: 'unknown',
      isTechJob: jobClassification.isTech,
    };
  }
  // Profile has both tech and non-tech fields
  if (profile.domainType === 'both') {
    return {
      allowed: true,
      profileType: 'both',
      isTechJob: jobClassification.isTech,
    };
  }
  // Tech-only biography -> can apply ONLY to tech jobs
  if (profile.domainType === 'tech_only') {
    if (!jobClassification.isTech) {
      return {
        allowed: false,
        reason:
          'Your profile has a tech biography, so you can only apply to tech jobs.',
        profileType: 'tech_only',
        isTechJob: jobClassification.isTech,
      };
    }
    return {
      allowed: true,
      profileType: 'tech_only',
      isTechJob: jobClassification.isTech,
    };
  }
  // Non-tech biography -> CANNOT apply to tech jobs
  if (profile.domainType === 'non_tech_only') {
    if (jobClassification.isTech) {
      return {
        allowed: false,
        reason:
          'Your profile is in a non-tech field, so you cannot apply to tech jobs.',
        profileType: 'non_tech_only',
        isTechJob: jobClassification.isTech,
      };
    }
    return {
      allowed: true,
      profileType: 'non_tech_only',
      isTechJob: jobClassification.isTech,
    };
  }
  return {
    allowed: true,
    profileType: profile.domainType,
    isTechJob: jobClassification.isTech,
  };
}