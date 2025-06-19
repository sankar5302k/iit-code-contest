"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Play,
  Users,
  Zap,
  Trophy,
  Star,
  ArrowRight,
  GamepadIcon,
  TwitchIcon as Stream,
  Twitch,
  Youtube,
  DiscIcon as Discord,
  Target,
  Sparkles,
  Rocket,
  Crown,
  Shield,
  Flame,
} from "lucide-react"

export default function GameStreamingPlatform() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCard, setActiveCard] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])
  const [mouseRipples, setMouseRipples] = useState<Array<{ id: number; x: number; y: number; timestamp: number }>>([])
  const [visibleStats, setVisibleStats] = useState(false)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])

  const heroRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const rippleCounter = useRef(0)
  const mouseRippleCounter = useRef(0)
  const lastMouseRipple = useRef(0)

  // Enhanced mouse tracking with ripple effects
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newPosition = { x: e.clientX, y: e.clientY }
    setMousePosition(newPosition)

    // Create mouse ripples at intervals
    const now = Date.now()
    if (now - lastMouseRipple.current > 100) {
      // Throttle ripples
      const newRipple = {
        id: mouseRippleCounter.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: now,
      }

      setMouseRipples((prev) => [...prev, newRipple])
      lastMouseRipple.current = now

      // Clean up old ripples
      setTimeout(() => {
        setMouseRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
      }, 1000)
    }
  }, [])

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => setScrollY(window.scrollY)

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !visibleStats) {
            setVisibleStats(true)
            animateStats()
          }
        })
      },
      { threshold: 0.5 },
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      observer.disconnect()
    }
  }, [visibleStats, handleMouseMove])

  const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: rippleCounter.current++, x, y, timestamp: Date.now() }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 1000)
  }

  const animateStats = () => {
    const targets = [10000000, 500000000, 50, 99.9]
    const duration = 2000
    const steps = 60
    const increment = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)

      setAnimatedStats(targets.map((target) => Math.floor(target * easeOutQuart)))

      if (step >= steps) {
        clearInterval(timer)
        setAnimatedStats(targets)
      }
    }, increment)
  }

  const formatStat = (value: number, index: number) => {
    switch (index) {
      case 0:
        return `${(value / 1000000).toFixed(1)}M+`
      case 1:
        return `${(value / 1000000).toFixed(0)}M+`
      case 2:
        return `${value}+`
      case 3:
        return `${(value / 10).toFixed(1)}%`
      default:
        return value.toString()
    }
  }

  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "Ultra-Low Latency",
      description: "Stream with less than 50ms delay for real-time gaming experiences",
      color: "from-purple-500 to-pink-500",
      progress: 95,
      image: "/images/uncharted.jpg",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Hub",
      description: "Connect with millions of gamers and build your streaming community",
      color: "from-blue-500 to-cyan-500",
      progress: 88,
      image: "/images/ac.jpg",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI-Powered Tools",
      description: "Smart highlights, auto-editing, and content optimization",
      color: "from-green-500 to-emerald-500",
      progress: 92,
      image: "/images/god-of-war.png",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Monetization",
      description: "Multiple revenue streams including donations, subscriptions, and sponsorships",
      color: "from-orange-500 to-red-500",
      progress: 90,
      image: "/images/uncharted-collage.jpg",
    },
  ]

  const testimonials = [
    {
      name: "ProGamer_X",
      role: "Professional Esports Player",
      content: "The streaming quality is incredible. My viewers love the crystal-clear gameplay!",
      avatar: "/images/uncharted.jpg",
      rating: 5,
    },
    {
      name: "StreamQueen",
      role: "Content Creator",
      content: "Best platform for building a gaming community. The tools are amazing!",
      avatar: "/images/ac.jpg",
      rating: 5,
    },
    {
      name: "GameMaster_Pro",
      role: "Variety Streamer",
      content: "Finally, a platform that understands gamers. The monetization options are fantastic!",
      avatar: "/images/god-of-war.png",
      rating: 5,
    },
  ]

  const stats = [
    { number: "Active Streamers", label: "Active Streamers" },
    { number: "Hours Watched", label: "Hours Watched" },
    { number: "Game Categories", label: "Game Categories" },
    { number: "Uptime", label: "Uptime" },
  ]

  const floatingObjects = [
    { icon: <Crown className="w-6 h-6" />, delay: 0, color: "text-yellow-400" },
    { icon: <Shield className="w-6 h-6" />, delay: 1000, color: "text-blue-400" },
    { icon: <Flame className="w-6 h-6" />, delay: 2000, color: "text-red-400" },
    { icon: <Sparkles className="w-6 h-6" />, delay: 3000, color: "text-purple-400" },
    { icon: <Rocket className="w-6 h-6" />, delay: 4000, color: "text-green-400" },
    { icon: <Target className="w-6 h-6" />, delay: 5000, color: "text-pink-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Mouse Ripples */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {mouseRipples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute w-4 h-4 bg-purple-400/30 rounded-full animate-ping"
            style={{
              left: ripple.x - 8,
              top: ripple.y - 8,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>

      {/* Enhanced Animated Background with Advanced Parallax */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) translateY(${scrollY * 0.1}px)`,
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.2),transparent_50%)]"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px) translateY(${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.2),transparent_50%)]"
          style={{
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px) translateY(${scrollY * 0.15}px)`,
          }}
        />
      </div>

      {/* Enhanced Floating Objects with Mouse Parallax */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {floatingObjects.map((obj, index) => (
          <div
            key={index}
            className={`absolute ${obj.color} animate-float-complex opacity-60`}
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + index * 10}%`,
              animationDelay: `${obj.delay}ms`,
              transform: `translate(${scrollY * (0.1 + index * 0.05) + mousePosition.x * 0.01}px, ${scrollY * (0.05 + index * 0.02) + mousePosition.y * 0.008}px)`,
            }}
          >
            <div className="animate-spin-slow">{obj.icon}</div>
          </div>
        ))}
      </div>

      {/* Enhanced Loader */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin animate-reverse" />
            <div className="absolute inset-4 w-12 h-12 border-4 border-blue-500 border-l-transparent rounded-full animate-spin" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <GamepadIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-40 p-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
              <GamepadIcon className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GameStream
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-purple-400 transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#community" className="hover:text-purple-400 transition-colors relative group">
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all group-hover:w-full"></span>
            </a>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white relative overflow-hidden"
              onClick={createRipple}
            >
              Sign In
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              ))}
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 relative overflow-hidden"
              onClick={createRipple}
            >
              Start Streaming
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              ))}
            </Button>
          </div>
        </nav>
      </header>

      {/* Enhanced Hero Section with Advanced Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6">
        {/* Hero Background Image with Parallax */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/images/uncharted-collage.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            left: "50%",
            transform: `translateX(-50%) translateY(${scrollY * 0.3}px) scale(${1 + scrollY * 0.0002})`,
          }}
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${scrollY * 0.2}px) translateX(${scrollY * 0.05}px) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        >
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse-complex" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-pink-400 rounded-full animate-pulse-complex delay-1000" />
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse-complex delay-2000" />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 animate-bounce-subtle">
            🎮 Next-Gen Gaming Platform
          </Badge>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in-up">
            Stream Like a
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
              Champion
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-300">
            The ultimate platform for gamers to stream, connect, and monetize their passion. Join millions of creators
            in the next evolution of gaming entertainment.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 group relative overflow-hidden"
              onClick={createRipple}
            >
              Start Streaming Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              ))}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white text-lg px-8 py-4 relative overflow-hidden"
              onClick={createRipple}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              ))}
            </Button>
          </div>
        </div>

        {/* Enhanced Floating Cards with Advanced Parallax */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-10 animate-float-3d"
            style={{
              transform: `translateY(${scrollY * -0.2}px) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          >
            <Card className="w-24 h-24 bg-purple-500/10 border-purple-500/20 backdrop-blur-sm transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <CardContent className="p-4 flex items-center justify-center">
                <Stream className="w-8 h-8 text-purple-400" />
              </CardContent>
            </Card>
          </div>
          <div
            className="absolute top-1/3 right-10 animate-float-3d delay-1000"
            style={{
              transform: `translateY(${scrollY * -0.3}px) translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.015}px)`,
            }}
          >
            <Card className="w-24 h-24 bg-pink-500/10 border-pink-500/20 backdrop-blur-sm transform -rotate-12 hover:rotate-0 transition-transform duration-500">
              <CardContent className="p-4 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-pink-400" />
              </CardContent>
            </Card>
          </div>
          <div
            className="absolute bottom-1/4 left-1/3 animate-float-3d delay-2000"
            style={{
              transform: `translateY(${scrollY * -0.15}px) translate(${mousePosition.x * 0.008}px, ${mousePosition.y * -0.01}px)`,
            }}
          >
            <Card className="w-20 h-20 bg-blue-500/10 border-blue-500/20 backdrop-blur-sm transform rotate-45 hover:rotate-12 transition-transform duration-500">
              <CardContent className="p-3 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section with Animated Counters */}
      <section ref={statsRef} className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Platform Statistics
            </h2>
            <p className="text-gray-400">Real-time metrics from our growing community</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300 px-2"
                onMouseEnter={() => setActiveCard(index)}
                style={{
                  transform: `translateY(${scrollY * 0.05}px) translate(${mousePosition.x * 0.005}px, ${mousePosition.y * 0.003}px)`,
                }}
              >
                <div className="relative">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 animate-count-up break-words">
                    {formatStat(animatedStats[index], index)}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base lg:text-lg mb-4 break-words">{stat.label}</div>

                  {/* Progress bar for visual appeal */}
                  <div className="w-full max-w-xs mx-auto">
                    <Progress value={visibleStats ? 85 + index * 5 : 0} className="h-2 bg-slate-800" />
                  </div>

                  {activeCard === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg -z-10 animate-pulse-glow" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section with Images */}
      <section id="features" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Features section header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Everything you need to create, stream, and grow your gaming community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                onMouseEnter={() => setActiveCard(index)}
                style={{
                  transform: `translateY(${scrollY * 0.02}px) translate(${mousePosition.x * 0.003}px, ${mousePosition.y * 0.002}px)`,
                }}
              >
                {/* Feature Image - Better suited */}
                <div className="relative h-32 md:h-36 lg:h-40 overflow-hidden">
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110 filter brightness-75 group-hover:brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800/90 via-slate-800/50 to-transparent" />

                  {/* Feature icon overlay on image */}
                  <div className="absolute top-3 right-3 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center backdrop-blur-sm shadow-lg`}
                    >
                      <div className="text-white flex items-center justify-center">
                        {React.cloneElement(feature.icon, {
                          className: "w-5 h-5 md:w-6 md:h-6",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 group-hover:text-gray-300 transition-colors mb-4 line-clamp-3">
                    {feature.description}
                  </p>

                  {/* Feature progress indicator */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-500">Performance</span>
                      <span className="text-purple-400">{feature.progress}%</span>
                    </div>
                    <Progress value={activeCard === index ? feature.progress : 0} className="h-1 bg-slate-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Carousel with Images */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background with subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900/50" />

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Testimonials section header */}
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs md:text-sm">
              ⭐ Community Feedback
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What Streamers Say
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto px-4">
              Real feedback from our amazing community of content creators
            </p>
          </div>

          {/* Testimonials Grid - Make it fully responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`group bg-slate-800/50 border-slate-700 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer ${
                  activeCard === index ? "ring-2 ring-purple-500/50 border-purple-500/50" : ""
                }`}
                onMouseEnter={() => setActiveCard(index)}
              >
                <CardContent className="p-4 md:p-6 lg:p-8">
                  {/* Rating Stars */}
                  <div className="flex justify-center mb-4 md:mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current animate-twinkle"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <blockquote className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 italic text-center leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 ring-2 ring-purple-500/50 group-hover:ring-purple-400 transition-all duration-300">
                        <AvatarImage
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="object-cover object-center"
                        />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm md:text-base lg:text-lg">
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse" />
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-purple-400 text-sm md:text-base lg:text-lg group-hover:text-purple-300 transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-400 text-xs md:text-sm">{testimonial.role}</div>
                      <div className="flex items-center justify-center sm:justify-start mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        <span className="text-xs text-green-400">Live Streaming</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Interactive Dots */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 ${
                  activeCard === index
                    ? "bg-purple-500 scale-125 shadow-lg shadow-purple-500/50"
                    : "bg-gray-600 hover:bg-gray-500 hover:scale-110"
                }`}
                onClick={() => setActiveCard(index)}
              >
                {activeCard === index && (
                  <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />
                )}
              </button>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 md:mt-16">
            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Join thousands of satisfied streamers</p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 md:px-8 py-2 md:py-3 text-sm md:text-base relative overflow-hidden group"
              onClick={createRipple}
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              ))}
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with Background Image */}
      <section className="py-20 px-6 relative">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('/images/god-of-war.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-text-shimmer">
              Streaming Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already building their gaming empire on GameStream
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-12 py-6 relative overflow-hidden group transform hover:scale-105 transition-all duration-300"
              onClick={createRipple}
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500" />
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute bg-white/30 rounded-full animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 10,
                    top: ripple.y - 10,
                    width: 20,
                    height: 20,
                  }}
                />
              ))}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse-glow">
                <GamepadIcon className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GameStream
              </span>
            </div>

            <div className="flex items-center space-x-6">
              <Twitch className="w-6 h-6 text-gray-400 hover:text-purple-400 cursor-pointer transition-all duration-300 hover:scale-125" />
              <Youtube className="w-6 h-6 text-gray-400 hover:text-red-400 cursor-pointer transition-all duration-300 hover:scale-125" />
              <Discord className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer transition-all duration-300 hover:scale-125" />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-400">
            <p>&copy; 2024 GameStream. All rights reserved. Built for gamers, by gamers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
