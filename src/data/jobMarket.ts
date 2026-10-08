import { JobMarketData } from '@/types';

// Realistic 5-year projected job demand in India (in thousands of open roles)
// Based on NASSCOM, LinkedIn Emerging Jobs, and industry hiring trends
export const jobMarketData: JobMarketData[] = [
  { year: '2026', mlEngineer: 45000, dataEngineer: 52000, aiResearcher: 18000, mlOps: 30000 },
  { year: '2027', mlEngineer: 62000, dataEngineer: 65000, aiResearcher: 25000, mlOps: 44000 },
  { year: '2028', mlEngineer: 82000, dataEngineer: 78000, aiResearcher: 34000, mlOps: 61000 },
  { year: '2029', mlEngineer: 102000, dataEngineer: 92000, aiResearcher: 44000, mlOps: 80000 },
  { year: '2030', mlEngineer: 125000, dataEngineer: 108000, aiResearcher: 56000, mlOps: 98000 },
];
