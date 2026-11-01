import {
  validateJobApplicationEligibility,
  classifyBio,
  classifyJob,
} from './job-restriction.util';
describe('Job Restriction Eligibility', () => {
  const techJob = {
    title: 'Senior Frontend Engineer',
    requiredskill: 'React, TypeScript, Next.js',
    description: 'Build web applications with modern frontend frameworks.',
  };
  const nonTechJob = {
    title: 'Customer Success Manager',
    requiredskill:
      'Customer Relationship Management, SaaS, Stakeholder Management',
    description: 'Support enterprise clients and ensure customer satisfaction.',
  };
  const financeJob = {
    title: 'Staff Accountant',
    requiredskill: 'Taxation, Auditing, Accounting',
    description: 'Handle company tax returns and auditing.',
  };
  describe('Tech-only Biography', () => {
    const techBio =
      'I am a full stack software engineer with 5 years experience building scalable web apps in React and Node.js.';
    it('should identify profile as tech_only', () => {
      const classification = classifyBio(techBio);
      expect(classification.domainType).toBe('tech_only');
      expect(classification.hasTech).toBe(true);
      expect(classification.hasNonTech).toBe(false);
    });

    it('should ALLOW tech bio candidate to apply to a tech job', () => {
      const result = validateJobApplicationEligibility(techBio, '', techJob);
      expect(result.allowed).toBe(true);
      expect(result.profileType).toBe('tech_only');
    });
    it('should BLOCK tech bio candidate from applying to a non-tech job', () => {
      const result = validateJobApplicationEligibility(techBio, '', nonTechJob);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain(
        'Your profile has a tech biography, so you can only apply to tech jobs.',
      );
    });
    it('should BLOCK tech bio candidate from applying to an accountant job', () => {
      const result = validateJobApplicationEligibility(techBio, '', financeJob);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain(
        'Your profile has a tech biography, so you can only apply to tech jobs.',
      );
    });
  });
  describe('Non-tech Biography', () => {
    const nonTechBio =
      'Certified accountant specializing in corporate tax, financial auditing, and bookkeeping with 6 years experience.';

    it('should identify profile as non_tech_only', () => {
      const classification = classifyBio(nonTechBio);
      expect(classification.domainType).toBe('non_tech_only');
      expect(classification.hasTech).toBe(false);
      expect(classification.hasNonTech).toBe(true);
    });
    it('should BLOCK non-tech bio candidate from applying to a tech job', () => {
      const result = validateJobApplicationEligibility(nonTechBio, '', techJob);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain(
        'Your profile is in a non-tech field, so you cannot apply to tech jobs.',
      );
    });
    it('should ALLOW non-tech bio candidate to apply to a non-tech job', () => {
      const result = validateJobApplicationEligibility(
        nonTechBio,
        '',
        nonTechJob,
      );
      expect(result.allowed).toBe(true);
      expect(result.profileType).toBe('non_tech_only');
    });
    it('should ALLOW non-tech bio candidate to apply to an accountant job', () => {
      const result = validateJobApplicationEligibility(
        nonTechBio,
        '',
        financeJob,
      );
      expect(result.allowed).toBe(true);
    });
  });
  describe('Hybrid / Both Biography (Tech and Non-tech)', () => {
    const hybridBio =
      'Experienced digital marketing manager and full-stack web developer skilled in SEO, CRM, Python, and React.';
    it('should identify profile as both', () => {
      const classification = classifyBio(hybridBio);
      expect(classification.domainType).toBe('both');
      expect(classification.hasTech).toBe(true);
      expect(classification.hasNonTech).toBe(true);
    });

    it('should ALLOW hybrid candidate to apply to a tech job', () => {
      const result = validateJobApplicationEligibility(hybridBio, '', techJob);
      expect(result.allowed).toBe(true);
      expect(result.profileType).toBe('both');
    });
    it('should ALLOW hybrid candidate to apply to a non-tech job', () => {
      const result = validateJobApplicationEligibility(
        hybridBio,
        '',
        nonTechJob,
      );
      expect(result.allowed).toBe(true);
      expect(result.profileType).toBe('both');
    });
    it('should ALLOW hybrid candidate to apply to finance job', () => {
      const result = validateJobApplicationEligibility(
        hybridBio,
        '',
        financeJob,
      );
      expect(result.allowed).toBe(true);
    });
  });
  describe('Empty / Unclear Biography', () => {
    it('should reject application if biography is completely empty and no skill provided', () => {
      const result = validateJobApplicationEligibility('', '', techJob);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain(
        'Could not determine your professional field',
      );
    });
    it('should fall back to skills if biography is generic', () => {
      const genericBio = 'Enthusiastic hard worker looking for opportunities.';
      const techSkills = 'React, Node.js, TypeScript';
      const result = validateJobApplicationEligibility(
        genericBio,
        techSkills,
        techJob,
      );
      expect(result.allowed).toBe(true);
      expect(result.profileType).toBe('tech_only');
    });
  });
});