export const experience = [
	{
		company: 'Amazon',
		role: 'Software Engineer Intern',
		date: 'June 2026 – Aug 2026',
		location: 'Bellevue, WA',
		logo: '/logos/amazon.svg',
		logoDark: true,
		bullets: [
			'Built sub-minute live order tracking for Amazon Quick Commerce using SQS, EventBridge, and Step Functions.',
			'Engineered per-order refresh schedules scoped to the delivery lifecycle, removing compute spend on inactive orders.',
			'Reduced update latency 75% and cut billing cost $14,400/month by moving tracking to express state machines.',
		],
	},
	{
		company: 'Fred Hutch Cancer Research Center',
		role: 'Machine Learning Research Intern',
		date: 'Sep 2025 – May 2026',
		location: 'Seattle, WA',
		logo: '/logos/fred-hutch.png',
		logoDark: false,
		bullets: [
			'Developed predictive models helping doctors prevent skeletal complications in metastatic bone cancer patients.',
			'Engineered clinical features to uncover patterns automating risk assessment across 30,000+ patient records.',
			'Enabled collaborative prediction across 3 cancer centers through federated learning, achieving 0.815 AUC.',
		],
	},
	{
		company: 'University of Washington NLP Lab',
		role: 'Undergraduate Researcher',
		date: 'Jan 2026 – May 2026',
		location: 'Seattle, WA',
		logo: '/logos/uw.svg',
		logoDark: true,
		bullets: [
			'Built and shipped an AI tool enabling Innocence Project attorneys to extract case timelines from court transcripts.',
			'Designed event storage retrieval to preserve context during processing, improving date extraction accuracy by 30%.',
			'Automated timeline evaluation against attorney-written references, benchmarking extraction quality across 50+ cases.',
		],
	},
	{
		company: 'Scale AI',
		role: 'Software Engineer Intern',
		date: 'Feb 2025 – May 2025',
		location: 'San Francisco, CA',
		logo: '/logos/scale.svg',
		logoDark: true,
		bullets: [
			'Constructed scalable RLHF pipelines on Kubernetes, accelerating preference model training and policy alignment.',
			'Developed a data labeling feedback API to capture rater uncertainty, exposing training signals for data refinement.',
			'Contributed to an LLM evaluation suite (HFC) to benchmark models on safety, factuality, and reasoning failures.',
		],
	},
];
export const skills = [
	{ name: 'Languages', values: ['Python', 'TypeScript', 'Java', 'C++', 'SQL', 'HTML/CSS'] },
	{
		name: 'Frameworks',
		values: ['PyTorch', 'scikit-learn', 'Hugging Face Transformers', 'NumPy', 'pandas'],
	},
	{
		name: 'Libraries & Tools',
		values: ['Git', 'Docker', 'Linux', 'AWS', 'vLLM', 'Weights & Biases'],
	},
];
export const coursework = [
	'Machine Learning',
	'Deep Learning',
	'Natural Language Processing',
	'Computer Vision',
	'Data Structures and Algorithms',
	'Discrete Mathematics',
	'Probability and Combinatorics',
	'Operating Systems',
	'Distributed Systems',
	'Artificial Intelligence',
];
