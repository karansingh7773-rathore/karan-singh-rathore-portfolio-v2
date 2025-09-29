'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Chatbot from '../components/Chatbot'

// Mock data for demonstration when Supabase is not configured
// Added 'slug' for dynamic routing
const mockProjects = [
  {
    id: 1,
    slug: "e-commerce-platform",
    title: "E-Commerce Platform",
    short_description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.",
    cover_image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    technologies: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Stripe']
  },
  {
    id: 2,
    slug: "task-management-app",
    title: "Task Management App",
    short_description: "Collaborative project management tool with real-time updates, team chat, and progress tracking.",
    cover_image_url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    technologies: ['React', 'Firebase', 'Material-UI', 'WebSocket']
  },
  {
    id: 3,
    slug: "healthcare-dashboard",
    title: "Healthcare Dashboard",
    short_description: "Medical data visualization platform for healthcare professionals with patient management system.",
    cover_image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
    technologies: ['Vue.js', 'Python', 'Django', 'Chart.js', 'MySQL']
  },
  {
    id: 4,
    slug: "learning-management-system",
    title: "Learning Management System",
    short_description: "Educational platform with course creation, student tracking, and interactive assessments.",
    cover_image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    technologies: ['Angular', 'TypeScript', 'Express.js', 'MongoDB', 'Socket.io']
  }
]

// --- UPDATED ProjectCard Component ---
// NOTE: Replaced Next.js <Link> with a standard <a> tag to resolve build errors.
const ProjectCard = ({ project }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    // The entire card is now a link to the project's detail page
    <a href={`/projects/${project.slug}`} className="block h-full">
      <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-slate-700 h-full flex flex-col">
        {/* Project Image */}
        <div className="relative h-48 bg-slate-700 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          )}
          <img
            src={project.cover_image_url}
            alt={project.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop'
              setImageLoaded(true)
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        </div>

        {/* Project Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-slate-300 mb-4 line-clamp-3 leading-relaxed flex-grow">
            {project.short_description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.technologies?.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium border border-blue-600/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

// Main Portfolio Page Component
export default function PortfolioPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch projects from Supabase
  useEffect(() => {
    async function fetchProjects() {
      try {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          setProjects(mockProjects)
        } else {
          setProjects(data || mockProjects)
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        setProjects(mockProjects)
        setError('Failed to load projects. Showing sample data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      {/* Header/Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-purple-900/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent mb-6 animate-fade-in py-4">
              Karan Singh Rathore
             </h1>
            
            {/* Subtitle */}
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-8 animate-fade-in delay-200">
              Freelance IT Project Developer
            </h2>
            
            {/* Bio */}
            <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in delay-400">
              Passionate full-stack developer with expertise in modern web technologies. 
              I create scalable, user-friendly applications that solve real-world problems. 
              From concept to deployment, I deliver high-quality solutions that exceed expectations.
            </p>
            
            {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-600">
        <a
          href="mailto:karansinghrathore820@gmail.com"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          Email
        </a>

        <a
          href="https://github.com/karansingh7773-rathore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          GitHub
        </a>
        
        <a
          href="https://www.linkedin.com/in/karansingh7773/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</header>


      {/* Project Showcase Section */}
      <section id="projects" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Project Showcase
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Explore my latest work and see how I bring ideas to life through code
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <span className="text-lg text-slate-400">Loading projects...</span>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-8 mb-8">
              <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-orange-300">{error}</p>
              </div>
            </div>
          )}

          {/* Projects grid */}
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* No projects state */}
          {!loading && projects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-slate-400">No projects found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's Work Together
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              Ready to bring your next project to life? I'm available for freelance work and 
              always excited to take on new challenges. Let's discuss how we can create something amazing together.
            </p>
            <a
              href="mailto:karansinghrathore820@gmail.com"
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-lg"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} Karan Singh Rathore. All rights reserved.
          </p>
        </div>
      </footer>

      <Chatbot />
    </div>
  )
}

