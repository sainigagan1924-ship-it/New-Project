import mongoose from 'mongoose';

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Backend' },
  estimatedHours: { type: Number, default: 24 },
  stages: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      level: { type: String, required: true },
      order: { type: Number, required: true },
      description: { type: String },
      estimatedTime: { type: String },
      videos: [
        {
          videoId: { type: String, required: true },
          title: { type: String, required: true },
          channelTitle: { type: String },
          duration: { type: String },
          viewsFormatted: { type: String },
          timeAgo: { type: String },
          thumbnail: { type: String },
          qualityScore: { type: Number },
          badge: { type: String, default: 'Recommended' }, // 'Must Watch', 'Recommended', 'Optional'
          completed: { type: Boolean, default: false }
        }
      ]
    }
  ],
  savedByUsers: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const RoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

export const defaultRoadmaps = [
  {
    id: 'java-spring-boot',
    slug: 'java-spring-boot',
    title: 'Java Spring Boot Learning Roadmap',
    description: 'A structured playlist to take you from beginner to advanced level',
    category: 'Backend Development',
    estimatedHours: 32,
    stages: [
      {
        id: 'stage-beginner',
        name: 'Beginner Level',
        level: 'Beginner',
        order: 1,
        description: 'Start here if you are new to Spring Boot. Learn the fundamentals step by step.',
        estimatedTime: '6 videos • 12 hours',
        videoCount: 6,
        videos: [
          {
            id: 'v1',
            videoId: 'vtPkZShrvXQ',
            title: 'Spring Boot Full Course for Beginners',
            channelTitle: 'CodeWithHarry',
            duration: '8:12:34',
            viewsFormatted: '3.2M views',
            timeAgo: '6 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&auto=format&fit=crop&q=80',
            qualityScore: 92,
            badge: 'Must Watch',
            completed: true
          },
          {
            id: 'v2',
            videoId: '35EQXmHKZY9',
            title: 'How to Setup Spring Boot Project in IntelliJ',
            channelTitle: 'Amigoscode',
            duration: '25:10',
            viewsFormatted: '1.1M views',
            timeAgo: '8 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&auto=format&fit=crop&q=80',
            qualityScore: 88,
            badge: 'Recommended',
            completed: true
          },
          {
            id: 'v3',
            videoId: 'core-concepts',
            title: 'Spring Boot Core Concepts Explained',
            channelTitle: 'Telusko',
            duration: '45:20',
            viewsFormatted: '980K views',
            timeAgo: '7 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
            qualityScore: 85,
            badge: 'Recommended',
            completed: false
          },
          {
            id: 'v4',
            videoId: 'spring-data-jpa',
            title: 'Spring Data JPA with Spring Boot',
            channelTitle: 'Programming with Mosh',
            duration: '1:12:10',
            viewsFormatted: '1.4M views',
            timeAgo: '6 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=640&auto=format&fit=crop&q=80',
            qualityScore: 82,
            badge: 'Recommended',
            completed: false
          },
          {
            id: 'v5',
            videoId: 'dependency-inj',
            title: 'Understanding Spring Inversion of Control & DI In-Depth',
            channelTitle: 'Laur Spilca',
            duration: '52:14',
            viewsFormatted: '380K views',
            timeAgo: '5 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc13c734919?w=640&auto=format&fit=crop&q=80',
            qualityScore: 90,
            badge: 'Must Watch',
            completed: false
          },
          {
            id: 'v6',
            videoId: 'rest-fundamentals',
            title: 'Building Your First REST Controller with Postman Validation',
            channelTitle: 'Java Brains',
            duration: '38:00',
            viewsFormatted: '850K views',
            timeAgo: '9 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=640&auto=format&fit=crop&q=80',
            qualityScore: 87,
            badge: 'Recommended',
            completed: false
          }
        ]
      },
      {
        id: 'stage-intermediate',
        name: 'Intermediate Level',
        level: 'Intermediate',
        order: 2,
        description: 'Build robust REST APIs, configure database connections, handle validation, and implement authentication.',
        estimatedTime: '6 videos • 14 hours',
        videoCount: 6,
        videos: [
          {
            id: 'v7',
            videoId: 'mSbt_2kC6eQ',
            title: 'Spring Boot Microservices Full Course | Build Microservices',
            channelTitle: 'Telusko',
            duration: '6:45:12',
            viewsFormatted: '1.1M views',
            timeAgo: '4 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
            qualityScore: 85,
            badge: 'Must Watch',
            completed: false
          },
          {
            id: 'v8',
            videoId: 'security-jwt',
            title: 'Spring Security 6 with JWT Token Authentication & Authorization',
            channelTitle: 'Amigoscode',
            duration: '2:15:00',
            viewsFormatted: '620K views',
            timeAgo: '3 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&auto=format&fit=crop&q=80',
            qualityScore: 93,
            badge: 'Must Watch',
            completed: false
          },
          {
            id: 'v9',
            videoId: 'exception-handling',
            title: 'Global Exception Handling with @ControllerAdvice in Spring',
            channelTitle: 'Dan Vega',
            duration: '32:45',
            viewsFormatted: '210K views',
            timeAgo: '4 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&auto=format&fit=crop&q=80',
            qualityScore: 89,
            badge: 'Recommended',
            completed: false
          },
          {
            id: 'v10',
            videoId: 'caching-redis',
            title: 'Redis Caching in Spring Boot for Blazing Fast Response Times',
            channelTitle: 'Java Techie',
            duration: '48:10',
            viewsFormatted: '340K views',
            timeAgo: '5 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&auto=format&fit=crop&q=80',
            qualityScore: 86,
            badge: 'Recommended',
            completed: false
          }
        ]
      },
      {
        id: 'stage-advanced',
        name: 'Advanced Level',
        level: 'Advanced',
        order: 3,
        description: 'Master asynchronous architectures, distributed tracing, high availability, and Kafka streaming.',
        estimatedTime: '5 videos • 10 hours',
        videoCount: 5,
        videos: [
          {
            id: 'v11',
            videoId: 'Gaq79pS2p-0',
            title: 'Mastering Spring Security 6 & OAuth2 with Keycloak',
            channelTitle: 'Laur Spilca',
            duration: '4:18:40',
            viewsFormatted: '450K views',
            timeAgo: '3 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=640&auto=format&fit=crop&q=80',
            qualityScore: 94,
            badge: 'Must Watch',
            completed: false
          },
          {
            id: 'v12',
            videoId: 'kafka-spring',
            title: 'Event-Driven Architecture with Apache Kafka & Spring Cloud Stream',
            channelTitle: 'Daily Code Buffer',
            duration: '1:54:20',
            viewsFormatted: '290K views',
            timeAgo: '2 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=640&auto=format&fit=crop&q=80',
            qualityScore: 91,
            badge: 'Recommended',
            completed: false
          }
        ]
      },
      {
        id: 'stage-projects',
        name: 'Projects',
        level: 'Projects',
        order: 4,
        description: 'End-to-end production systems from scratch: E-commerce backend, Payment integration, and Kubernetes deploy.',
        estimatedTime: '4 videos • 18 hours',
        videoCount: 4,
        videos: [
          {
            id: 'v13',
            videoId: 'ecom-full',
            title: 'Complete E-Commerce Microservices Platform from Scratch',
            channelTitle: 'Amigoscode',
            duration: '9:30:00',
            viewsFormatted: '1.2M views',
            timeAgo: '2 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
            qualityScore: 96,
            badge: 'Must Watch',
            completed: false
          },
          {
            id: 'v14',
            videoId: 'k8s-deploy',
            title: 'Deploying Spring Boot to Production Kubernetes Cluster with CI/CD',
            channelTitle: 'TechWorld with Nana',
            duration: '3:45:00',
            viewsFormatted: '890K views',
            timeAgo: '1 month ago',
            thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&auto=format&fit=crop&q=80',
            qualityScore: 95,
            badge: 'Must Watch',
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 'react-fullstack',
    slug: 'react-fullstack',
    title: 'React & Modern Frontend Architecture Roadmap',
    description: 'Master component design, state managers, server actions, and full-stack performance',
    category: 'Frontend Development',
    estimatedHours: 28,
    stages: [
      {
        id: 'rf-beginner',
        name: 'Beginner Level',
        level: 'Beginner',
        order: 1,
        description: 'Core concepts: JSX, Props, Hooks, Events, and Component Lifecycle.',
        estimatedTime: '4 videos • 8 hours',
        videoCount: 4,
        videos: [
          {
            id: 'rv1',
            videoId: 'w7ejDZ8SWv8',
            title: 'React Crash Course for Absolute Beginners',
            channelTitle: 'Traversy Media',
            duration: '2:10:15',
            viewsFormatted: '920K views',
            timeAgo: '5 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&auto=format&fit=crop&q=80',
            qualityScore: 88,
            badge: 'Must Watch',
            completed: false
          }
        ]
      },
      {
        id: 'rf-intermediate',
        name: 'Intermediate Level',
        level: 'Intermediate',
        order: 2,
        description: 'Complex state with TanStack Query, Zustand, and Next.js App Router.',
        estimatedTime: '5 videos • 11 hours',
        videoCount: 5,
        videos: [
          {
            id: 'rv2',
            videoId: 'bMknfKXIFA8',
            title: 'React 19 & Next.js Full Course 2025',
            channelTitle: 'freeCodeCamp.org',
            duration: '11:45:00',
            viewsFormatted: '1.8M views',
            timeAgo: '2 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&auto=format&fit=crop&q=80',
            qualityScore: 95,
            badge: 'Must Watch',
            completed: false
          }
        ]
      }
    ]
  }
];

export const memoryRoadmaps = new Map(defaultRoadmaps.map(r => [r.slug, r]));

