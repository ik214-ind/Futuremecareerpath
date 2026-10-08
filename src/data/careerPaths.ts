import { CareerPath } from '@/types';

export const careerPaths: CareerPath[] = [
  {
    id: 'mlops',
    title: 'ML Ops Engineer',
    subtitle: 'Deploy & scale AI systems',
    icon: 'ServerCog',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-blue-500/5',
    description:
      'Bridge the gap between ML research and production. You will own the infrastructure that takes models from notebooks to scalable, monitored services serving millions of requests.',
    skillsToMaster: [
      'Docker & Kubernetes',
      'AWS / GCP Cloud',
      'CI/CD Pipelines',
      'MLflow & Model Registry',
      'FastAPI',
      'Terraform',
      'Kubeflow',
      'Prometheus & Grafana',
      'PyTorch Serving',
    ],
    projects: [
      {
        title: 'Model Serving API',
        description: 'Deploy a PyTorch model as a REST API with FastAPI, Docker, and auto-scaling on Kubernetes.',
      },
      {
        title: 'MLOps Pipeline',
        description: 'Build an end-to-end pipeline with data versioning, training, evaluation, and automated deployment using MLflow and GitHub Actions.',
      },
      {
        title: 'Monitoring Dashboard',
        description: 'Set up Prometheus + Grafana to track model latency, drift detection, and prediction quality in real time.',
      },
    ],
    milestones: [
      {
        year: '1st Year',
        title: 'Foundations',
        description: 'Master Python, Linux, Git, and basic cloud concepts. Complete an introductory AWS/GCP certification.',
      },
      {
        year: '2nd Year',
        title: 'Containerization & APIs',
        description: 'Learn Docker, build REST APIs with FastAPI, and deploy your first containerized ML model.',
      },
      {
        year: '3rd Year',
        title: 'Orchestration & Pipelines',
        description: 'Master Kubernetes, set up CI/CD with GitHub Actions, and build a full MLOps pipeline with MLflow.',
      },
      {
        year: '4th Year',
        title: 'Production & Internship',
        description: 'Land a DevOps/ML Ops internship. Implement monitoring, auto-scaling, and canary deployments.',
      },
    ],
    first30Days: [
      { id: 'm1', label: 'Set up a Linux VM and install Docker', done: false },
      { id: 'm2', label: 'Complete the Docker Getting Started guide', done: false },
      { id: 'm3', label: 'Build a simple FastAPI app with one endpoint', done: false },
      { id: 'm4', label: 'Containerize the FastAPI app with Docker', done: false },
      { id: 'm5', label: 'Create a free AWS account and explore EC2', done: false },
      { id: 'm6', label: 'Deploy the containerized app on AWS EC2', done: false },
      { id: 'm7', label: 'Write your first GitHub Actions workflow', done: false },
    ],
    demandScore: 92,
  },
  {
    id: 'ai-researcher',
    title: 'Core AI Researcher',
    subtitle: 'Push the frontier of intelligence',
    icon: 'BrainCircuit',
    color: 'violet',
    gradient: 'from-violet-500/20 to-fuchsia-500/5',
    description:
      'Drive fundamental breakthroughs in machine learning. You will design novel architectures, publish at top-tier conferences (NeurIPS, ICML), and shape the next generation of AI systems.',
    skillsToMaster: [
      'Linear Algebra & Calculus',
      'Probability & Statistics',
      'PyTorch / JAX',
      'Transformer Architectures',
      'Paper Reading & Reproduction',
      'LaTeX & Academic Writing',
      'Optimization Theory',
      'Reinforcement Learning',
      'Diffusion Models',
    ],
    projects: [
      {
        title: 'Paper Reproduction',
        description: 'Reproduce a NeurIPS/ICML paper from scratch in PyTorch and write a detailed technical blog about it.',
      },
      {
        title: 'Novel Architecture',
        description: 'Design a small architectural improvement to an existing model and benchmark it against the baseline.',
      },
      {
        title: 'Research Blog Series',
        description: 'Write 5 in-depth technical blogs explaining core ML concepts (attention, backprop, optimization) with visualizations.',
      },
    ],
    milestones: [
      {
        year: '1st Year',
        title: 'Math & Python Mastery',
        description: 'Complete linear algebra, calculus, and probability courses. Build comfort with NumPy and PyTorch tensors.',
      },
      {
        year: '2nd Year',
        title: 'Deep Learning Foundations',
        description: 'Complete CS231n or fast.ai. Build and train neural networks from scratch. Start reading research papers.',
      },
      {
        year: '3rd Year',
        title: 'Research & Publications',
        description: 'Join a university research lab. Reproduce 5+ papers. Aim for a workshop paper at a top conference.',
      },
      {
        year: '4th Year',
        title: 'Research Internship & Thesis',
        description: 'Secure a research internship at Google Brain, DeepMind, or a university lab. Publish a main-track paper.',
      },
    ],
    first30Days: [
      { id: 'r1', label: 'Watch 3Blue1Brown Linear Algebra series', done: false },
      { id: 'r2', label: 'Complete PyTorch 60-minute blitz tutorial', done: false },
      { id: 'r3', label: 'Read and summarize your first ML paper (Attention Is All You Need)', done: false },
      { id: 'r4', label: 'Implement a neural network from scratch in NumPy', done: false },
      { id: 'r5', label: 'Set up a LaTeX template for notes', done: false },
      { id: 'r6', label: 'Train an MNIST classifier in PyTorch', done: false },
      { id: 'r7', label: 'Join an online ML reading group or Discord community', done: false },
    ],
    demandScore: 88,
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    subtitle: 'Build the data backbone',
    icon: 'Database',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/5',
    description:
      'Architect the pipelines and warehouses that fuel AI. You will design systems that ingest, transform, and serve petabytes of data reliably, enabling every data-driven decision in the organization.',
    skillsToMaster: [
      'SQL (Advanced)',
      'Apache Spark',
      'Apache Airflow',
      'Kafka & Event Streaming',
      'Data Warehousing (Snowflake, BigQuery)',
      'Python & Scala',
      'ETL/ELT Design',
      'Data Modeling',
      'dbt',
    ],
    projects: [
      {
        title: 'Real-time Data Pipeline',
        description: 'Build a Kafka-based streaming pipeline that ingests events, processes them with Spark Structured Streaming, and writes to a data warehouse.',
      },
      {
        title: 'Batch ETL with Airflow',
        description: 'Create an Airflow DAG that extracts data from an API, transforms it with PySpark, and loads it into BigQuery with scheduling and alerts.',
      },
      {
        title: 'Analytics Warehouse',
        description: 'Design a star-schema data warehouse in Snowflake/dbt with dbt models, tests, and documentation for a mock e-commerce dataset.',
      },
    ],
    milestones: [
      {
        year: '1st Year',
        title: 'SQL & Python Core',
        description: 'Master advanced SQL (joins, window functions, CTEs) and Python data libraries (Pandas, NumPy).',
      },
      {
        year: '2nd Year',
        title: 'Big Data & Streaming',
        description: 'Learn Apache Spark and Kafka. Build your first batch and streaming data processing jobs.',
      },
      {
        year: '3rd Year',
        title: 'Orchestration & Warehousing',
        description: 'Master Airflow for pipeline orchestration. Design data models in BigQuery or Snowflake using dbt.',
      },
      {
        year: '4th Year',
        title: 'Scale & Internship',
        description: 'Land a data engineering internship. Work on production pipelines handling terabytes of data.',
      },
    ],
    first30Days: [
      { id: 'd1', label: 'Complete SQLBolt interactive SQL course', done: false },
      { id: 'd2', label: 'Learn Pandas — read, filter, group, and merge data', done: false },
      { id: 'd3', label: 'Install Apache Spark locally and run a PySpark job', done: false },
      { id: 'd4', label: 'Set up a local PostgreSQL database', done: false },
      { id: 'd5', label: 'Build a simple ETL script: extract CSV → transform → load to Postgres', done: false },
      { id: 'd6', label: 'Read about data warehousing and the star schema', done: false },
      { id: 'd7', label: 'Install Apache Airflow and write your first DAG', done: false },
    ],
    demandScore: 95,
  },
];
