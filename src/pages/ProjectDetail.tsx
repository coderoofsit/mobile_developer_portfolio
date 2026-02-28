import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Play, Calendar, Users, Star, Award, Zap, Shield, Smartphone, ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getProjectById, Project } from "@/data/projects";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeMedia, setActiveMedia] = useState("images");
  const [project, setProject] = useState<Project | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (id) {
      const projectData = getProjectById(id);
      if (projectData) {
        setProject(projectData);
      } else {
        // Redirect to 404 or home if project not found
        navigate('/');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };

    if (isMouseDown) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseUp);
    };
  }, [isMouseDown]);

  const handleBackToPortfolio = () => {
    navigate('/', { replace: true });
    // Small delay to ensure navigation completes before scrolling
    setTimeout(() => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoClick = () => {
    togglePlayPause();
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !isMouseDown) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseDown(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown && videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = Math.max(0, Math.min((clickX / rect.width) * duration, duration));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleProgressMouseUp = () => {
    setIsMouseDown(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // Custom Play Store Icon Component
  const PlayStoreIcon = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
    </svg>
  );

  // Custom App Store Icon Component
  const AppStoreIcon = ({ className = "h-4 w-4" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M17.564 13.222c-.019-2.043 1.668-3.021 1.744-3.067-0.951-1.389-2.429-1.58-2.951-1.601-1.257-.127-2.454.736-3.09.736-.636 0-1.62-.717-2.667-.697-1.372.02-2.637.797-3.34 2.025-1.429 2.477-.364 6.142 1.025 8.153.678.98 1.484 2.08 2.544 2.04 1.027-.04 1.414-.658 2.655-.658 1.241 0 1.579.658 2.667.638 1.104-.02 1.797-.997 2.47-1.98.78-1.14 1.104-2.247 1.122-2.304-.025-.012-2.154-.826-2.174-3.28zm-2.563-5.98c.555-.672.93-1.606.827-2.542-.8.032-1.767.532-2.342 1.204-.514.594-.966 1.543-.797 2.448.844.066 1.757-.428 2.312-1.11z" />
      </g>
    </svg>
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
          <p className="text-gray-400">Please wait while we load the project details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect sticky top-0 z-50 premium-shadow"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToPortfolio}
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Portfolio</span>
            </button>
            <div className="flex items-center">
              {/* Header content without buttons */}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 mb-4">
            {project.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{project.title.split(' - ')[0]}</span>
            <br />
            <span className="text-white text-3xl md:text-4xl">{project.title.split(' - ')[1]}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {project.subtitle}
          </p>
        </motion.div>

        {/* Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-2xl p-8 premium-shadow">
            {/* Media Toggle */}
            <div className="flex justify-center mb-8">
              <div className="glass-effect rounded-full p-2 flex space-x-2">
                <button
                  onClick={() => setActiveMedia("images")}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeMedia === "images"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Screenshots
                </button>
                <button
                  onClick={() => setActiveMedia("video")}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeMedia === "video"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Demo Video
                </button>
              </div>
            </div>

            {/* Media Content */}
            {activeMedia === "images" ? (
              <div className="relative">
                <Carousel
                  opts={{ align: "start", loop: true }}
                  className="w-full"
                >
                  <CarouselContent>
                    {Array.from({ length: Math.ceil(project.images.length / 3) }).map((_, slideIndex) => (
                      <CarouselItem key={slideIndex}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {project.images
                            .slice(slideIndex * 3, slideIndex * 3 + 3)
                            .map((image, imageIndex) => (
                              <motion.div
                                key={slideIndex * 3 + imageIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: imageIndex * 0.1 }}
                                className="overflow-hidden rounded-lg"
                              >
                                <img
                                  src={image}
                                  alt={`${project.title} Screenshot ${slideIndex * 3 + imageIndex + 1}`}
                                  className="w-full h-auto object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                                />
                              </motion.div>
                          ))}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4" />
                  <CarouselNext className="right-4" />
                </Carousel>
              </div>
            ) : (
              <div 
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleVideoClick}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full rounded-lg object-contain bg-black"
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  controls={false}
                >
                  <source src={project.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Custom Play/Pause Button Overlay */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    onClick={togglePlayPause}
                    className="bg-black/50 hover:bg-black/70 rounded-full p-4 transition-all duration-300 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <Pause className="h-12 w-12 text-white" />
                    ) : (
                      <Play className="h-12 w-12 text-white ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Simple Controls Overlay */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayPause}
                        className="text-white hover:text-gray-300 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </button>
                      
                      {/* Time Display */}
                      <span className="text-white text-sm font-mono">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                      
                      {/* Progress Bar */}
                      <div className="flex-1 relative min-w-0">
                        <div 
                          className="w-full h-2 bg-white/30 cursor-pointer rounded relative"
                          onMouseDown={handleProgressMouseDown}
                          onMouseMove={handleProgressMouseMove}
                          onMouseUp={handleProgressMouseUp}
                          onMouseLeave={handleProgressMouseUp}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProgressClick(e);
                          }}
                        >
                          {/* Progress fill - pointer-events-none so clicks hit the track */}
                          <div 
                            className="absolute left-0 top-0 h-full bg-white rounded transition-all duration-100 pointer-events-none"
                            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play Button for Initial State */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-6 shadow-2xl"
                    >
                      <Play className="h-16 w-16 text-white ml-2" />
                    </motion.div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Project Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <div className="glass-effect rounded-xl p-6 text-center">
            <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{project.stats.rating}</div>
            <div className="text-gray-400 text-sm">Rating</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{project.stats.users}</div>
            <div className="text-gray-400 text-sm">Users</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <Award className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{project.stats.downloads}</div>
            <div className="text-gray-400 text-sm">Downloads</div>
          </div>
          <div className="glass-effect rounded-xl p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{project.timeline.duration}</div>
            <div className="text-gray-400 text-sm">Timeline</div>
          </div>
        </motion.div>

        {/* Rest of the component remains the same... */}
        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-2xl p-8 premium-shadow">
              <h2 className="text-3xl font-bold text-white mb-6">Project Overview</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {project.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Project Details</h3>
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{project.timeline.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team Size:</span>
                      <span>{project.timeline.team}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>My Role:</span>
                      <span>{project.timeline.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client:</span>
                      <span>{project.timeline.client}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Key Results</h3>
                  <ul className="space-y-2 text-gray-300">
                    {project.results.slice(0, 4).map((result, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Zap className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                        <span className="text-sm">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6 premium-shadow">
              <h3 className="text-xl font-semibold text-white mb-4">Technologies Used</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">Frontend</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techDetails.frontend.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-green-400 font-medium mb-2">Backend</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techDetails.backend.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-purple-400 font-medium mb-2">APIs & Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techDetails.apis.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* App Links Boxes with proper store icons */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-effect rounded-xl p-4 premium-shadow">
                  <h4 className="text-sm font-semibold text-white mb-3 text-center">Play Store</h4>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-xs py-2" 
                    asChild
                  >
                    <a href={project.playStoreLink} target="_blank" rel="noopener noreferrer">
                      <PlayStoreIcon className="h-3 w-3 mr-1" />
                      Get App
                    </a>
                  </Button>
                </div>
                
                <div className="glass-effect rounded-xl p-4 premium-shadow">
                  <h4 className="text-sm font-semibold text-white mb-3 text-center">App Store</h4>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-xs py-2" 
                    asChild
                  >
                    <a href={project.appStoreLink} target="_blank" rel="noopener noreferrer">
                      <AppStoreIcon className="h-3 w-3 mr-1" />
                      Get App
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-2xl p-8 premium-shadow">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Key Features</h2>
            <div className="space-y-6 max-h-96 overflow-y-auto scrollbar-hide pr-4">
              {project.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.1), duration: 0.6 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mb-16"
        >
          <div className="glass-effect rounded-2xl p-8 premium-shadow">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Challenges & Solutions</h2>
            <div className="space-y-6 max-h-96 overflow-y-auto scrollbar-hide pr-4">
              {project.challenges.map((challenge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + (index * 0.1), duration: 0.6 }}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetail;