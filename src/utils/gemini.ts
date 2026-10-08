import OpenAI from 'openai';
import { StudentProfile, CareerPath } from '@/types';
import { careerPaths as mockCareerPaths } from '@/data/careerPaths';

const MODEL_NAME = 'llama-3.1-8b-instant';

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

let client: OpenAI | null = null;
if (apiKey && apiKey.length > 0) {
  try {
    client = new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey,
      dangerouslyAllowBrowser: true,
    });
  } catch (e) {
    console.error('[PathFinder] Failed to initialize OpenAI client:', e);
  }
}

export function isGeminiConfigured(): boolean {
  return !!client;
}

/** Returns true if the VITE_GROQ_API_KEY env var is a non-empty string. */
export function envKeyBoolean(): boolean {
  return Boolean(import.meta.env.VITE_GROQ_API_KEY);
}

export interface ApiErrorInfo {
  message: string;
  status: string;
  raw: unknown;
}

export interface ChatResult {
  content: string;
  error: ApiErrorInfo | null;
}

function buildProfileContext(profile: StudentProfile): string {
  return `Student Profile:
- Email: ${profile.email}
- Year of Study: ${profile.yearOfStudy}
- Current Skills: ${profile.skills.join(', ')}
- Core Interests: ${profile.interests}
- Target Companies: ${profile.targetCompanies.join(', ')}`;
}

const colorPalette = ['cyan', 'violet', 'emerald'];
const iconPalette = ['ServerCog', 'BrainCircuit', 'Database'];
const gradientMap: Record<string, string> = {
  cyan: 'from-cyan-500/20 to-blue-500/5',
  violet: 'from-violet-500/20 to-fuchsia-500/5',
  emerald: 'from-emerald-500/20 to-teal-500/5',
};

interface RawCareerPath {
  title?: string;
  subtitle?: string;
  description?: string;
  matchScore?: number;
  demandScore?: number;
  skillsToMaster?: string[];
  projects?: { title?: string; description?: string }[];
  milestones?: { year?: string; title?: string; description?: string }[];
  first30Days?: { label?: string }[];
}

function normalizePath(raw: RawCareerPath, index: number): CareerPath {
  const color = colorPalette[index % colorPalette.length];
  const icon = iconPalette[index % iconPalette.length];
  return {
    id: `ai-path-${index}`,
    title: raw.title || `Career Path ${index + 1}`,
    subtitle: raw.subtitle || '',
    icon,
    color,
    gradient: gradientMap[color],
    description: raw.description || '',
    skillsToMaster: (raw.skillsToMaster || []).slice(0, 12),
    projects: (raw.projects || []).slice(0, 3).map((p) => ({
      title: p.title || '',
      description: p.description || '',
    })),
    milestones: (raw.milestones || []).slice(0, 4).map((m) => ({
      year: m.year || '',
      title: m.title || '',
      description: m.description || '',
    })),
    first30Days: (raw.first30Days || []).slice(0, 8).map((item, i) => ({
      id: `ai-${index}-${i}`,
      label: item.label || '',
      done: false,
    })),
    demandScore: raw.demandScore || Math.round(80 + Math.random() * 18),
    matchScore: raw.matchScore || Math.round(75 + Math.random() * 22),
  };
}

function extractJson(text: string): RawCareerPath[] {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];
  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    const cleaned = jsonMatch[0].replace(/```json/gi, '').replace(/```/g, '').trim();
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
    return [];
  }
}

function extractErrorInfo(error: unknown): ApiErrorInfo {
  let message = 'Unknown error';
  let status = 'N/A';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>;
    if (e.message) message = String(e.message);
    if (e.status) status = String(e.status);
    const errorObj = e.error as Record<string, unknown> | undefined;
    if (errorObj) {
      if (errorObj.message) message = String(errorObj.message);
      if (errorObj.status) status = String(errorObj.status);
      const details = errorObj.details as unknown[] | undefined;
      if (details && details.length > 0) {
        const first = details[0] as Record<string, unknown>;
        if (first?.message) message = String(first.message);
      }
    }
  }

  const statusMatch = message.match(/\b(\d{3})\b/);
  if (status === 'N/A' && statusMatch) {
    status = statusMatch[1];
  }

  return { message, status, raw: error };
}

// ─── Dynamic Fallback Generator ──────────────────────────────────────────────
// Parses the student's exact inputs (Year, Skills, Interests) and constructs
// 3 tailored career paths that adapt to whatever the user typed.

function dynamicFallback(profile: StudentProfile): CareerPath[] {
  const skills = profile.skills.length > 0 ? profile.skills : ['Python', 'Programming'];
  const interests = profile.interests.trim() || 'technology and building impactful systems';
  const yearMap: Record<string, string[]> = {
    '1st Year': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    '2nd Year': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    '3rd Year': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
    '4th Year': ['1st Year', '2nd Year', '3rd Year', '4th Year'],
  };
  const milestoneYears = yearMap[profile.yearOfStudy] || ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const primarySkill = skills[0];
  const interestLower = interests.toLowerCase();

  // Determine path archetypes from the student's interests
  const wantsResearch = interestLower.match(/research|paper|academia|phd|theory|fundamental/);
  const wantsData = interestLower.match(/data|analytic|pipeline|warehouse|big data|etl/);
  const wantsBuild = interestLower.match(/build|deploy|production|infra|scale|cloud|devops|ship/);
  const wantsAI = interestLower.match(/ai|ml|machine|deep|neural|intelligen|model|train|learn/);

  const archetypes: CareerPath[] = [];

  const pushArchetype = (path: Omit<CareerPath, 'id'>) => {
    archetypes.push({ ...path, id: `fb-path-${archetypes.length}` });
  };

  // Path 1: Always generated — AI/ML Engineer (if AI-leaning) or Software Engineer
  if (wantsAI || (!wantsResearch && !wantsData && !wantsBuild)) {
    pushArchetype({
      title: `AI/ML Engineer`,
      subtitle: `Build intelligent systems with ${primarySkill}`,
      icon: 'BrainCircuit',
      color: 'violet',
      gradient: gradientMap['violet'],
      description: `Leverage your ${skills.slice(0, 3).join(', ')} skills to design, train, and deploy machine learning models. Your interest in "${interests.slice(0, 80)}" aligns perfectly with the AI/ML engineering track — you will build models that solve real-world problems at scale.`,
      skillsToMaster: [
        'Python & NumPy',
        'Scikit-learn',
        'PyTorch or TensorFlow',
        ...skills.filter((s) => !['Python', 'NumPy'].includes(s)).slice(0, 2),
        'Pandas & Data Wrangling',
        'Model Evaluation & Metrics',
        'Feature Engineering',
        'Deep Learning Fundamentals',
        'HuggingFace Transformers',
      ].slice(0, 9),
      projects: [
        {
          title: `${primarySkill} ML Pipeline`,
          description: `Build an end-to-end ML pipeline using ${primarySkill}: data collection, preprocessing, model training, evaluation, and inference API.`,
        },
        {
          title: 'Real-world Prediction Model',
          description: `Train a model on a dataset matching your interests — "${interests.slice(0, 60)}" — and deploy it as a web service with a simple UI.`,
        },
        {
          title: 'Fine-tuned LLM Application',
          description: 'Fine-tune a pre-trained language model on a domain-specific dataset and build a chatbot or Q&A system around it.',
        },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'ML Foundations', description: `Master ${primarySkill} for data science. Complete an ML course (Coursera/fast.ai). Build your first regression and classification models.` },
        { year: milestoneYears[1], title: 'Deep Learning & Projects', description: 'Learn neural networks, CNNs, and RNNs. Build 2-3 portfolio projects using your skills: ' + skills.slice(0, 3).join(', ') + '.' },
        { year: milestoneYears[2], title: 'Specialization & Internship', description: `Deep-dive into your area of interest. Apply for ML internships at ${profile.targetCompanies.slice(0, 2).join(' or ')}. Contribute to open-source ML projects.` },
        { year: milestoneYears[3], title: 'Production & Placement', description: 'Deploy models to production. Solidify your portfolio with 3+ impactful projects. Secure a full-time ML engineering role.' },
      ],
      first30Days: [
        { id: 'fb1-1', label: `Install Python ML stack: NumPy, Pandas, Scikit-learn, PyTorch`, done: false },
        { id: 'fb1-2', label: 'Complete the Scikit-learn "Getting Started" tutorial', done: false },
        { id: 'fb1-3', label: 'Load a dataset on Kaggle and do exploratory data analysis', done: false },
        { id: 'fb1-4', label: 'Train your first classification model and evaluate accuracy', done: false },
        { id: 'fb1-5', label: 'Read "Attention Is All You Need" paper and write a summary', done: false },
        { id: 'fb1-6', label: 'Follow a PyTorch tutorial and train a neural network on MNIST', done: false },
        { id: 'fb1-7', label: `Join a Kaggle competition related to your interests`, done: false },
      ],
      demandScore: 94,
      matchScore: 92,
    });
  }

  // Path 2: Research-oriented (if research interest) or Data Engineer (if data interest)
  if (wantsResearch) {
    pushArchetype({
      title: 'AI Research Scientist',
      subtitle: `Push the frontier with ${primarySkill}`,
      icon: 'BrainCircuit',
      color: 'cyan',
      gradient: gradientMap['cyan'],
      description: `Channel your passion for "${interests.slice(0, 80)}" into fundamental AI research. You will design novel architectures, publish at top conferences (NeurIPS, ICML), and contribute to the next generation of intelligent systems.`,
      skillsToMaster: [
        'Linear Algebra & Calculus',
        'Probability & Statistics',
        'PyTorch / JAX',
        'Transformer Architectures',
        'Paper Reading & Reproduction',
        'LaTeX & Academic Writing',
        'Optimization Theory',
        ...skills.filter((s) => !['Mathematics', 'Statistics'].includes(s)).slice(0, 1),
        'Reinforcement Learning',
      ].slice(0, 9),
      projects: [
        { title: 'Paper Reproduction', description: `Reproduce a recent NeurIPS/ICML paper from scratch in PyTorch and write a detailed technical blog about your findings.` },
        { title: 'Novel Architecture Experiment', description: 'Design a small architectural improvement to an existing model and benchmark it against the baseline on a standard dataset.' },
        { title: 'Research Blog Series', description: 'Write 5 in-depth technical blogs explaining core ML concepts (attention, backprop, optimization) with interactive visualizations.' },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'Math & Python Mastery', description: `Complete linear algebra, calculus, and probability courses. Build comfort with NumPy and PyTorch tensors using ${primarySkill}.` },
        { year: milestoneYears[1], title: 'Deep Learning Foundations', description: 'Complete CS231n or fast.ai. Build and train neural networks from scratch. Start reading 1 research paper per week.' },
        { year: milestoneYears[2], title: 'Research & Publications', description: `Join a university research lab. Reproduce 5+ papers. Target a workshop paper at a top conference. Apply to ${profile.targetCompanies.slice(0, 2).join(' or ')} research internships.` },
        { year: milestoneYears[3], title: 'Research Internship & Thesis', description: 'Secure a research internship. Publish a main-track paper. Build a strong publication record for grad school or industry research roles.' },
      ],
      first30Days: [
        { id: 'fb2-1', label: 'Watch 3Blue1Brown Linear Algebra series', done: false },
        { id: 'fb2-2', label: 'Complete PyTorch 60-minute blitz tutorial', done: false },
        { id: 'fb2-3', label: 'Read and summarize your first ML paper', done: false },
        { id: 'fb2-4', label: 'Implement a neural network from scratch in NumPy', done: false },
        { id: 'fb2-5', label: 'Set up a LaTeX template for research notes', done: false },
        { id: 'fb2-6', label: 'Train an MNIST classifier in PyTorch', done: false },
        { id: 'fb2-7', label: 'Join an online ML reading group or Discord community', done: false },
      ],
      demandScore: 87,
      matchScore: 88,
    });
  } else if (wantsData) {
    pushArchetype({
      title: 'Data Engineer',
      subtitle: `Build data pipelines with ${primarySkill}`,
      icon: 'Database',
      color: 'emerald',
      gradient: gradientMap['emerald'],
      description: `Transform your ${skills.slice(0, 3).join(', ')} skills into large-scale data engineering. You will architect pipelines that ingest, transform, and serve petabytes of data, fueling every data-driven decision in the organization.`,
      skillsToMaster: [
        'SQL (Advanced)',
        'Apache Spark',
        'Apache Airflow',
        'Kafka & Event Streaming',
        'Python & Scala',
        ...skills.filter((s) => !['SQL', 'Python'].includes(s)).slice(0, 1),
        'ETL/ELT Design',
        'Data Modeling',
        'dbt & Snowflake',
      ].slice(0, 9),
      projects: [
        { title: 'Real-time Data Pipeline', description: `Build a Kafka-based streaming pipeline that ingests events, processes them with Spark Structured Streaming, and writes to a warehouse.` },
        { title: 'Batch ETL with Airflow', description: 'Create an Airflow DAG that extracts data from an API, transforms it with PySpark, and loads it into BigQuery with scheduling and alerts.' },
        { title: 'Analytics Warehouse', description: 'Design a star-schema data warehouse in Snowflake/dbt with models, tests, and documentation for a mock e-commerce dataset.' },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'SQL & Python Core', description: `Master advanced SQL (joins, window functions, CTEs) and Python data libraries. Build comfort with ${primarySkill}.` },
        { year: milestoneYears[1], title: 'Big Data & Streaming', description: 'Learn Apache Spark and Kafka. Build your first batch and streaming data processing jobs.' },
        { year: milestoneYears[2], title: 'Orchestration & Warehousing', description: `Master Airflow for pipeline orchestration. Design data models in BigQuery/Snowflake. Apply to ${profile.targetCompanies.slice(0, 2).join(' or ')} for data engineering internships.` },
        { year: milestoneYears[3], title: 'Scale & Placement', description: 'Land a data engineering internship working on production pipelines. Solidify your portfolio and secure a full-time role.' },
      ],
      first30Days: [
        { id: 'fb2-1', label: 'Complete SQLBolt interactive SQL course', done: false },
        { id: 'fb2-2', label: 'Learn Pandas — read, filter, group, and merge data', done: false },
        { id: 'fb2-3', label: 'Install Apache Spark locally and run a PySpark job', done: false },
        { id: 'fb2-4', label: 'Set up a local PostgreSQL database', done: false },
        { id: 'fb2-5', label: 'Build a simple ETL script: extract CSV → transform → load to Postgres', done: false },
        { id: 'fb2-6', label: 'Read about data warehousing and the star schema', done: false },
        { id: 'fb2-7', label: 'Install Apache Airflow and write your first DAG', done: false },
      ],
      demandScore: 95,
      matchScore: 86,
    });
  } else {
    // Default second path: ML Ops / Production
    pushArchetype({
      title: 'ML Ops Engineer',
      subtitle: `Deploy & scale AI with ${primarySkill}`,
      icon: 'ServerCog',
      color: 'cyan',
      gradient: gradientMap['cyan'],
      description: `Combine your ${skills.slice(0, 3).join(', ')} skills with infrastructure expertise. You will own the pipeline that takes ML models from notebooks to scalable, monitored production services serving millions of requests.`,
      skillsToMaster: [
        'Docker & Kubernetes',
        'AWS / GCP Cloud',
        'CI/CD Pipelines',
        'MLflow & Model Registry',
        'FastAPI',
        'Terraform',
        ...skills.filter((s) => !['Docker', 'AWS'].includes(s)).slice(0, 1),
        'Prometheus & Grafana',
        'PyTorch Serving',
      ].slice(0, 9),
      projects: [
        { title: 'Model Serving API', description: `Deploy a ${primarySkill} model as a REST API with FastAPI, Docker, and auto-scaling on Kubernetes.` },
        { title: 'MLOps Pipeline', description: 'Build an end-to-end pipeline with data versioning, training, evaluation, and automated deployment using MLflow and GitHub Actions.' },
        { title: 'Monitoring Dashboard', description: 'Set up Prometheus + Grafana to track model latency, drift detection, and prediction quality in real time.' },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'Foundations', description: `Master ${primarySkill}, Linux, Git, and basic cloud concepts. Complete an introductory AWS/GCP certification.` },
        { year: milestoneYears[1], title: 'Containerization & APIs', description: 'Learn Docker, build REST APIs with FastAPI, and deploy your first containerized ML model.' },
        { year: milestoneYears[2], title: 'Orchestration & Pipelines', description: `Master Kubernetes, set up CI/CD with GitHub Actions, and build a full MLOps pipeline. Apply to ${profile.targetCompanies.slice(0, 2).join(' or ')}.` },
        { year: milestoneYears[3], title: 'Production & Placement', description: 'Land a DevOps/ML Ops internship. Implement monitoring, auto-scaling, and canary deployments. Secure a full-time role.' },
      ],
      first30Days: [
        { id: 'fb2-1', label: 'Set up a Linux VM and install Docker', done: false },
        { id: 'fb2-2', label: 'Complete the Docker Getting Started guide', done: false },
        { id: 'fb2-3', label: 'Build a simple FastAPI app with one endpoint', done: false },
        { id: 'fb2-4', label: 'Containerize the FastAPI app with Docker', done: false },
        { id: 'fb2-5', label: 'Create a free AWS account and explore EC2', done: false },
        { id: 'fb2-6', label: 'Deploy the containerized app on AWS EC2', done: false },
        { id: 'fb2-7', label: 'Write your first GitHub Actions workflow', done: false },
      ],
      demandScore: 92,
      matchScore: 84,
    });
  }

  // Path 3: Product/Applied track or Data Engineer (whichever hasn't been used)
  if (wantsBuild) {
    pushArchetype({
      title: 'AI Product Engineer',
      subtitle: `Ship AI products with ${primarySkill}`,
      icon: 'ServerCog',
      color: 'emerald',
      gradient: gradientMap['emerald'],
      description: `Turn your ${skills.slice(0, 3).join(', ')} skills and interest in "${interests.slice(0, 70)}" into shipped products. You will bridge AI research and user-facing applications, building tools that people actually use.`,
      skillsToMaster: [
        'Full-Stack Development',
        'REST API Design',
        'React / Frontend Basics',
        ...skills.filter((s) => !['React', 'JavaScript'].includes(s)).slice(0, 2),
        'Vector Databases (Pinecone, Weaviate)',
        'LangChain & LLM Orchestration',
        'Docker & Deployment',
        'API Integration Patterns',
        'Product Thinking & UX',
      ].slice(0, 9),
      projects: [
        { title: 'AI-Powered Web App', description: `Build a full-stack web app that uses an ML model behind a clean UI. Use ${primarySkill} for the backend and React for the frontend.` },
        { title: 'LLM Tool with RAG', description: 'Build a retrieval-augmented generation (RAG) application using a vector database, an LLM API, and a chat interface.' },
        { title: 'AI API Service', description: 'Create a hosted AI API service with authentication, rate limiting, and usage analytics. Deploy on Railway or Render.' },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'Full-Stack Foundations', description: `Learn ${primarySkill} for backend and basics of React for frontend. Build a simple CRUD app with a database.` },
        { year: milestoneYears[1], title: 'AI Integration', description: 'Learn to integrate ML models into web apps. Build a project that serves model predictions through an API + UI.' },
        { year: milestoneYears[2], title: 'Product Building', description: `Build 2-3 AI-powered products for your portfolio. Apply to ${profile.targetCompanies.slice(0, 2).join(' or ')} for product engineering internships.` },
        { year: milestoneYears[3], title: 'Launch & Placement', description: 'Launch a product with real users. Solidify your portfolio. Secure a full-time AI product engineering role.' },
      ],
      first30Days: [
        { id: 'fb3-1', label: 'Learn the basics of REST API design', done: false },
        { id: 'fb3-2', label: 'Build a simple CRUD backend with FastAPI or Express', done: false },
        { id: 'fb3-3', label: 'Learn React basics — components, state, props', done: false },
        { id: 'fb3-4', label: 'Connect your backend API to a simple React frontend', done: false },
        { id: 'fb3-5', label: 'Integrate a pre-trained ML model into your app', done: false },
        { id: 'fb3-6', label: 'Learn about vector databases and embeddings', done: false },
        { id: 'fb3-7', label: 'Build a simple RAG chatbot using an LLM API', done: false },
      ],
      demandScore: 90,
      matchScore: 85,
    });
  } else if (!wantsData) {
    // Use Data Engineer as the third path if not already used
    pushArchetype({
      title: 'Data Engineer',
      subtitle: `Build the data backbone with ${primarySkill}`,
      icon: 'Database',
      color: 'emerald',
      gradient: gradientMap['emerald'],
      description: `Architect the pipelines and warehouses that fuel AI. Using your ${skills.slice(0, 3).join(', ')} skills, you will design systems that ingest, transform, and serve petabytes of data reliably.`,
      skillsToMaster: [
        'SQL (Advanced)',
        'Apache Spark',
        'Apache Airflow',
        'Kafka & Event Streaming',
        'Python & Scala',
        ...skills.filter((s) => !['SQL', 'Python'].includes(s)).slice(0, 1),
        'ETL/ELT Design',
        'Data Modeling',
        'dbt & Snowflake',
      ].slice(0, 9),
      projects: [
        { title: 'Real-time Data Pipeline', description: `Build a Kafka-based streaming pipeline that ingests events, processes them with Spark Structured Streaming, and writes to a warehouse.` },
        { title: 'Batch ETL with Airflow', description: 'Create an Airflow DAG that extracts data from an API, transforms it with PySpark, and loads it into BigQuery with scheduling and alerts.' },
        { title: 'Analytics Warehouse', description: 'Design a star-schema data warehouse in Snowflake/dbt with models, tests, and documentation for a mock e-commerce dataset.' },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'SQL & Python Core', description: `Master advanced SQL and Python data libraries. Build comfort with ${primarySkill}.` },
        { year: milestoneYears[1], title: 'Big Data & Streaming', description: 'Learn Apache Spark and Kafka. Build your first batch and streaming data processing jobs.' },
        { year: milestoneYears[2], title: 'Orchestration & Warehousing', description: `Master Airflow for pipeline orchestration. Apply to ${profile.targetCompanies.slice(0, 2).join(' or ')} for data engineering internships.` },
        { year: milestoneYears[3], title: 'Scale & Placement', description: 'Land a data engineering internship. Work on production pipelines handling terabytes of data. Secure a full-time role.' },
      ],
      first30Days: [
        { id: 'fb3-1', label: 'Complete SQLBolt interactive SQL course', done: false },
        { id: 'fb3-2', label: 'Learn Pandas — read, filter, group, and merge data', done: false },
        { id: 'fb3-3', label: 'Install Apache Spark locally and run a PySpark job', done: false },
        { id: 'fb3-4', label: 'Set up a local PostgreSQL database', done: false },
        { id: 'fb3-5', label: 'Build a simple ETL script: extract CSV → transform → load to Postgres', done: false },
        { id: 'fb3-6', label: 'Read about data warehousing and the star schema', done: false },
        { id: 'fb3-7', label: 'Install Apache Airflow and write your first DAG', done: false },
      ],
      demandScore: 95,
      matchScore: 82,
    });
  } else {
    // Fallback third path — AI Researcher
    pushArchetype({
      title: 'AI Research Scientist',
      subtitle: `Push the frontier with ${primarySkill}`,
      icon: 'BrainCircuit',
      color: 'cyan',
      gradient: gradientMap['cyan'],
      description: `Channel your passion for "${interests.slice(0, 80)}" into fundamental AI research. Design novel architectures, publish at top conferences, and shape the next generation of intelligent systems.`,
      skillsToMaster: [
        'Linear Algebra & Calculus',
        'Probability & Statistics',
        'PyTorch / JAX',
        'Transformer Architectures',
        'Paper Reading & Reproduction',
        'LaTeX & Academic Writing',
        'Optimization Theory',
        ...skills.filter((s) => !['Mathematics', 'Statistics'].includes(s)).slice(0, 1),
        'Reinforcement Learning',
      ].slice(0, 9),
      projects: [
        { title: 'Paper Reproduction', description: `Reproduce a recent NeurIPS/ICML paper from scratch in PyTorch and write a detailed technical blog.` },
        { title: 'Novel Architecture Experiment', description: 'Design a small architectural improvement to an existing model and benchmark it against the baseline.' },
        { title: 'Research Blog Series', description: 'Write 5 in-depth technical blogs explaining core ML concepts with visualizations.' },
      ],
      milestones: [
        { year: milestoneYears[0], title: 'Math & Python Mastery', description: `Complete linear algebra, calculus, and probability. Build comfort with ${primarySkill} and PyTorch.` },
        { year: milestoneYears[1], title: 'Deep Learning Foundations', description: 'Complete CS231n or fast.ai. Build neural networks from scratch. Read 1 paper per week.' },
        { year: milestoneYears[2], title: 'Research & Publications', description: `Join a research lab. Reproduce 5+ papers. Apply to ${profile.targetCompanies.slice(0, 2).join(' or ')} research internships.` },
        { year: milestoneYears[3], title: 'Research Internship & Thesis', description: 'Secure a research internship. Publish a main-track paper. Build a strong publication record.' },
      ],
      first30Days: [
        { id: 'fb3-1', label: 'Watch 3Blue1Brown Linear Algebra series', done: false },
        { id: 'fb3-2', label: 'Complete PyTorch 60-minute blitz tutorial', done: false },
        { id: 'fb3-3', label: 'Read and summarize your first ML paper', done: false },
        { id: 'fb3-4', label: 'Implement a neural network from scratch in NumPy', done: false },
        { id: 'fb3-5', label: 'Set up a LaTeX template for research notes', done: false },
        { id: 'fb3-6', label: 'Train an MNIST classifier in PyTorch', done: false },
        { id: 'fb3-7', label: 'Join an online ML reading group or Discord community', done: false },
      ],
      demandScore: 87,
      matchScore: 80,
    });
  }

  // Ensure exactly 3 paths
  while (archetypes.length < 3) {
    const base = mockCareerPaths[archetypes.length % mockCareerPaths.length];
    pushArchetype({
      ...base,
      title: base.title,
      description: `Based on your skills (${skills.slice(0, 3).join(', ')}) and interest in "${interests.slice(0, 60)}", this path is tailored for you. ${base.description}`,
      matchScore: base.matchScore ?? 80,
    });
  }

  return archetypes.slice(0, 3);
}

// ─── Timeout wrapper ──────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// ─── Career Path Generation ──────────────────────────────────────────────────

export async function generateCareerPaths(
  profile: StudentProfile
): Promise<{ paths: CareerPath[]; source: 'ai' | 'fallback'; error: ApiErrorInfo | null }> {
  if (!client) {
    return { paths: dynamicFallback(profile), source: 'fallback', error: null };
  }

  try {
    const prompt = `You are an expert AI career counselor for engineering students. Based on the student profile below, generate exactly 3 distinct, personalized career paths that would be excellent fits for this student.

${buildProfileContext(profile)}

Return ONLY a raw JSON array (no markdown, no explanation, no code fences) of 3 career path objects. Each object MUST have this exact structure:
{
  "title": "Career Path Name",
  "subtitle": "Short tagline",
  "description": "2-3 sentence description of this career path",
  "matchScore": <number 70-98>,
  "demandScore": <number 80-98>,
  "skillsToMaster": ["Skill1", "Skill2", ...up to 9 skills],
  "projects": [
    {"title": "Project Name", "description": "1-2 sentence project description"}
  ],
  "milestones": [
    {"year": "1st Year", "title": "Milestone Title", "description": "What to achieve"},
    {"year": "2nd Year", "title": "Milestone Title", "description": "What to achieve"},
    {"year": "3rd Year", "title": "Milestone Title", "description": "What to achieve"},
    {"year": "4th Year", "title": "Milestone Title", "description": "What to achieve"}
  ],
  "first30Days": [
    {"label": "Action item 1"},
    {"label": "Action item 2"},
    ... up to 7 items
  ]
}

Make the paths diverse (e.g., one research-focused, one engineering-focused, one data/product-focused). Tailor the skills, projects, and milestones to the student's current skills and interests. Return ONLY the JSON array.`;

    const completion = await withTimeout(
      client.chat.completions.create({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
      3000
    );
    const text = completion.choices[0]?.message?.content || '';

    const rawPaths = extractJson(text);
    if (rawPaths.length >= 3) {
      const normalized = rawPaths.slice(0, 3).map((raw, i) => normalizePath(raw, i));
      return { paths: normalized, source: 'ai', error: null };
    }

    if (rawPaths.length > 0) {
      const normalized = rawPaths.slice(0, 3).map((raw, i) => normalizePath(raw, i));
      while (normalized.length < 3) {
        normalized.push(dynamicFallback(profile)[normalized.length]);
      }
      return { paths: normalized, source: 'ai', error: null };
    }

    return { paths: dynamicFallback(profile), source: 'fallback', error: null };
  } catch (error) {
    const info = extractErrorInfo(error);
    console.error('[PathFinder] Groq career generation failed:', info.message, 'Status:', info.status);
    return { paths: dynamicFallback(profile), source: 'fallback', error: null };
  }
}

// ─── Demo Fallback for Chat ──────────────────────────────────────────────────

function demoFallback(profile: StudentProfile, question: string): string {
  const q = question.toLowerCase();
  const skills = profile.skills.length > 0 ? profile.skills.join(', ') : 'programming and problem-solving';
  const interests = profile.interests.trim() || 'technology';
  const companies = profile.targetCompanies.slice(0, 2).join(' or ') || 'leading tech companies';
  const year = profile.yearOfStudy || 'your year';

  if (q.match(/career.*path|which.*path|best.*path|suit.*me/)) {
    return `Based on your skills in ${skills} and interest in ${interests}, I'd recommend exploring three directions: an AI/ML engineering track if you enjoy building intelligent systems, a data engineering track if you like working with pipelines and large datasets, or an ML Ops track if you're drawn to deployment and infrastructure. Head to the AI Trainer page to generate your personalized roadmap for each!`;
  }

  if (q.match(/start.*ai|begin.*ml|get started|how.*ai.*ml|learn.*ml/)) {
    return `Great question! As a ${year} student, start by strengthening your ${skills} foundation. Pick up Python with NumPy and Pandas, then work through the Scikit-learn tutorials. Build a simple classification model on a Kaggle dataset — that hands-on experience will cement the concepts. After that, move on to PyTorch and deep learning.`;
  }

  if (q.match(/research|academia|phd|industry|vs/)) {
    return `Research vs. industry is a big decision! If you love deep theoretical work and publishing papers, research could be a great fit — start by joining a university lab. If you prefer building products that ship to users and want faster impact, industry roles at ${companies} might suit you better. You can always pivot later — many researchers move to industry and vice versa.`;
  }

  if (q.match(/project|build.*semester|this.*semester|what.*build/)) {
    return `For this semester, I'd suggest building something aligned with your interest in ${interests}. A solid first project: an end-to-end ML pipeline using ${skills} — data collection, preprocessing, model training, and a simple web UI for inference. That covers the full stack and looks great on a resume when applying to ${companies}.`;
  }

  if (q.match(/internship|job|apply|company|hire/)) {
    return `For internships at ${companies}, focus on three things: 2-3 strong portfolio projects that showcase ${skills}, a clean GitHub profile, and practicing coding interview problems. As a ${year} student, start applying early — many companies recruit months in advance. Hackathons are also a great way to stand out.`;
  }

  if (q.match(/skill|learn|study|improve/)) {
    return `To level up, focus on skills that complement your current ${skills}. For AI/ML roles, add PyTorch, Scikit-learn, and model deployment. For data roles, strengthen SQL and Spark. For product roles, learn React and REST API design. Pick one area, build a project around it, and iterate!`;
  }

  if (q.match(/hackathon|competition|contest/)) {
    return `Hackathons are fantastic for building your portfolio and networking! Look for AI-focused hackathons on Devpost or MLH. Form a team, use your ${skills} to build a working prototype in 24-48 hours, and present it well. Even if you don't win, the project adds real value to your resume for ${companies} applications.`;
  }

  return `That's a great question! Based on your profile as a ${year} student with skills in ${skills} and interests in ${interests}, I'd recommend focusing on projects and experiences that build toward your goals. Consider applying to ${companies} for internships, and check out the AI Trainer page for a detailed career roadmap tailored to you. What specifically would you like to dive deeper into?`;
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export function isGroqConfigured(): boolean {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  return Boolean(key && key.length > 0);
}

export async function chatWithCounselor(
  profile: StudentProfile,
  messages: { role: 'user' | 'model'; content: string }[],
  newMessage: string
): Promise<ChatResult> {
  const groqKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!groqKey || groqKey.length === 0) {
    return { content: demoFallback(profile, newMessage), error: null };
  }

  try {
    const systemInstruction = `You are PathFinder AI, a friendly and knowledgeable career counselor for engineering students interested in AI, ML, and tech careers. You are talking to a student whose profile is:

${buildProfileContext(profile)}

Always personalize your advice based on this profile. Be encouraging, specific, and practical. Keep responses concise (3-5 sentences unless asked for detail). Use the student's year of study to give time-appropriate advice. Reference their current skills and interests when relevant. If they ask about something unrelated to careers or tech, gently steer back to their career journey.`;

    const history = messages
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({
        role: (m.role === 'model' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.content,
      }));

    const response = await withTimeout(
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: systemInstruction },
            ...history,
            { role: 'user', content: newMessage },
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      }),
      8000
    );

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '';

    if (!text) {
      return { content: demoFallback(profile, newMessage), error: null };
    }

    return { content: text, error: null };
  } catch (error) {
    const info = extractErrorInfo(error);
    console.error('[PathFinder] Groq chat error:', info.message, 'Status:', info.status);
    return { content: demoFallback(profile, newMessage), error: null };
  }
}
