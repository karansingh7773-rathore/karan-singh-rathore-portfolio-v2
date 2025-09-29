'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../../lib/supabase' // Updated to relative path

// Helper component for embedding videos
const VideoPlayer = ({ url }) => {
    // Check if it's a direct video file
    const isVideoFile = /\.(mp4|webm|ogg)$/i.test(url)
    
    if (isVideoFile) {
        return (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-slate-700">
                <video 
                    src={url}
                    controls
                    className="w-full h-full object-contain bg-slate-800"
                    poster="/video-placeholder.jpg"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        )
    }

    // Handle embedded videos (YouTube/Vimeo)
    let embedUrl = ''
    try {
        const videoUrl = new URL(url)
        if (videoUrl.hostname.includes('youtube.com') || videoUrl.hostname.includes('youtu.be')) {
            const videoId = videoUrl.searchParams.get('v') || videoUrl.pathname.split('/').pop()
            embedUrl = `https://www.youtube.com/embed/${videoId}`
        } else if (videoUrl.hostname.includes('vimeo.com')) {
            const videoId = videoUrl.pathname.split('/').pop()
            embedUrl = `https://player.vimeo.com/video/${videoId}`
        }
    } catch (error) {
        console.error("Invalid video URL:", url)
        return <p className="text-orange-400">Invalid video URL provided.</p>
    }

    if (!embedUrl) {
        return <p className="text-orange-400">This video platform is not supported. Please use YouTube, Vimeo, or direct video files.</p>
    }

    return (
        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-slate-700">
            <iframe
                src={embedUrl}
                title="Project Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
    )
}


export default function ProjectDetailPage() {
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Extract slug from the window's URL path
        const pathParts = window.location.pathname.split('/');
        const slug = pathParts.pop() || pathParts.pop(); // handle potential trailing slash

        async function fetchProject() {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('slug', slug)
                    .single() // We expect only one project for a given slug

                if (error) {
                    console.error('Supabase error:', error)
                    setError('Could not find the requested project.')
                } else {
                    setProject(data)
                }
            } catch (err) {
                console.error('Error fetching project:', err)
                setError('An unexpected error occurred while fetching the project.')
            } finally {
                setLoading(false)
            }
        }

        fetchProject()
    }, []) // Empty dependency array ensures this runs once on mount

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center">
                <div>
                    <div className="inline-flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                        <span className="text-lg text-slate-400">Loading project...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center px-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
                    <p className="text-xl text-slate-400 mb-8">{error}</p>
                    <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                        ← Back to Homepage
                    </a>
                </div>
            </div>
        )
    }

    if (!project) {
        // This case is generally handled by the error state, but provides a fallback.
        return (
             <div className="min-h-screen bg-slate-900 flex items-center justify-center text-center px-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
                    <p className="text-xl text-slate-400 mb-8">The project you're looking for doesn't seem to exist.</p>
                    <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
                        ← Back to Homepage
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300">
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="max-w-4xl mx-auto">
                    {/* Back to Home Link */}
                    <a href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-8 group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to All Projects
                    </a>

                    {/* Project Title */}
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        {project.title}
                    </h1>

                    {/* Short Description */}
                    <p className="text-xl text-slate-400 mb-12 whitespace-pre-wrap">
                        {project.short_description}
                    </p>

                    {/* Video Player */}
                    {project.prototype_video_url ? (
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Project Demo</h2>
                            <VideoPlayer url={project.prototype_video_url} />
                        </div>
                    ) : null}

                    {/* Full Explanation with Markdown */}
                    <div className="prose prose-invert prose-lg max-w-none">
                        <h2 className="text-3xl font-bold text-white mb-4">Detailed Explanation</h2>
                        <ReactMarkdown>
                          {project.full_explanation || "No detailed explanation provided."}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
}

