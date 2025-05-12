'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function BottomNavigation() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<string>(pathname);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const [isPulsing, setIsPulsing] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navRef = useRef<HTMLDivElement>(null);

    // Update active tab on pathname change with dramatic effect
    useEffect(() => {
        setActiveTab(pathname);

        // Create pulsing effect when tab changes
        setIsPulsing(true);
        const timer = setTimeout(() => setIsPulsing(false), 850);

        // Add ripple effect on tab change
        if (navRef.current) {
            const ripple = document.createElement('div');
            ripple.className = 'absolute w-[150%] h-[150%] rounded-full pointer-events-none';
            ripple.style.background = `radial-gradient(circle, ${getTabColor(pathname)}33 0%, ${getTabColor(pathname)}00 70%)`;
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.transform = 'translate(-50%, -50%) scale(0)';
            ripple.style.animation = 'ripple 1s ease-out forwards';
            navRef.current.appendChild(ripple);

            setTimeout(() => {
                if (navRef.current && navRef.current.contains(ripple)) {
                    navRef.current.removeChild(ripple);
                }
            }, 1000);
        }

        return () => clearTimeout(timer);
    }, [pathname]);

    // Track mouse for magnetic effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (navRef.current) {
                const rect = navRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Check if a route is active
    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    // Get tab-specific color
    const getTabColor = (path: string) => {
        switch (path) {
            case '/': return 'rgba(255, 31, 0, 0.9)'; // Orange
            case '/discover': return 'rgba(119, 168, 255, 0.9)'; // Blue
            case '/tickets': return 'rgba(194, 129, 255, 0.9)'; // Lavender
            case '/profile': return 'rgba(255, 31, 0, 0.9)'; // Orange
            case '/create': return 'rgba(255, 31, 0, 0.9)'; // Orange
            default: return 'rgba(255, 31, 0, 0.9)';
        }
    };

    // Generate magnetic translation for hovered tab
    const getMagneticTranslation = (path: string) => {
        if (hoveredTab !== path || !navRef.current) return '';

        const navWidth = navRef.current.offsetWidth;
        const tabPosition = path === '/' ? 0.1 :
            path === '/discover' ? 0.3 :
                path === '/tickets' ? 0.7 :
                    path === '/profile' ? 0.9 : 0.5;

        const centerX = navWidth * tabPosition;
        const magnetX = (mousePosition.x - centerX) / 15;

        return `translateX(${magnetX}px)`;
    };

    return (
        <div className="fixed bottom-5 left-0 right-0 z-50 px-3 flex justify-center pointer-events-none">
            {/* Ambient background glow that follows active tab */}
            <div
                className="fixed bottom-0 left-0 right-0 h-[30vh] opacity-70 pointer-events-none transition-opacity duration-1000"
                style={{
                    background: `radial-gradient(circle at ${activeTab === '/' ? '10%' :
                            activeTab === '/discover' ? '30%' :
                                activeTab === '/tickets' ? '70%' :
                                    activeTab === '/profile' ? '90%' : '50%'
                        } 100%, ${getTabColor(activeTab)} 0%, rgba(0,0,0,0) 70%)`,
                    opacity: isPulsing ? '0.3' : '0.15',
                    filter: 'blur(60px)',
                }}
            />

            {/* Main navigation container with frosted glass effect */}
            <div
                ref={navRef}
                className="relative w-full max-w-md rounded-2xl backdrop-blur-xl bg-black/40 shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto overflow-hidden transition-all duration-500 ease-out group"
                style={{
                    boxShadow: `0 10px 30px 0 rgba(0, 0, 0, 0.2), 
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      0 4px 6px -2px rgba(0, 0, 0, 0.05),
                      0 -2px 10px 0 ${getTabColor(activeTab)}30`,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transform: isPulsing ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
                }}
            >
                {/* Animated background pattern */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Animated highlight trails that follow the active tab */}
                <div
                    className="absolute h-10 w-40 rounded-full mix-blend-lighten transition-all duration-700 ease-out-expo"
                    style={{
                        background: `radial-gradient(circle, ${getTabColor(activeTab)}30 0%, ${getTabColor(activeTab)}00 70%)`,
                        left: activeTab === '/' ? '10%' :
                            activeTab === '/discover' ? '30%' :
                                activeTab === '/tickets' ? '70%' :
                                    activeTab === '/profile' ? '90%' : '50%',
                        top: '35%',
                        transform: 'translateX(-50%)',
                        filter: 'blur(10px)',
                        opacity: isPulsing ? 0.9 : 0.5,
                    }}
                />

                {/* Bottom Navigation */}
                <nav className="flex justify-around items-center h-16 relative z-10">
                    {/* Home */}
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center w-full h-full group/item"
                        onMouseEnter={() => setHoveredTab('/')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        <div
                            className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive('/') ? 'text-rovify-orange scale-110' :
                                    hoveredTab === '/' ? 'text-white scale-105' :
                                        'text-white/60'
                                }`}
                            style={{
                                transform: isActive('/') ? `scale(1.1) ${getMagneticTranslation('/')}` :
                                    hoveredTab === '/' ? `scale(1.05) ${getMagneticTranslation('/')}` :
                                        'scale(1)',
                                textShadow: isActive('/') ? '0 0 10px rgba(255,31,0,0.5)' : 'none'
                            }}
                        >
                            <div className="relative">
                                {/* 3D rotation effect container */}
                                <div className={`transition-all duration-300 ease-out ${hoveredTab === '/' ? 'translate-y-[-2px]' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        className={`w-6 h-6 drop-shadow-sm transition-all duration-300 ease-out ${hoveredTab === '/' ? 'rotate-[5deg]' : ''
                                            }`}
                                    >
                                        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.031-.028.062-.056.091-.086L12 5.43z" />
                                    </svg>
                                </div>

                                {/* Active indicator with animation */}
                                {isActive('/') && (
                                    <>
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-orange animate-pulse" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-orange animate-ping opacity-70" />
                                    </>
                                )}

                                {/* Hover glow effect */}
                                {hoveredTab === '/' && !isActive('/') && (
                                    <div className="absolute inset-0 scale-150 rounded-full opacity-40 animate-pulse-slow"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                                            filter: 'blur(8px)',
                                        }}
                                    ></div>
                                )}
                            </div>

                            <span className={`text-xs mt-1 font-medium transition-all duration-300 ${isActive('/') ? 'opacity-100' : 'opacity-70 group-hover/item:opacity-100'
                                }`}>Home</span>
                        </div>
                    </Link>

                    {/* Map - Similar enhancements as Home but with blue theme */}
                    <Link
                        href="/discover"
                        className="flex flex-col items-center justify-center w-full h-full group/item"
                        onMouseEnter={() => setHoveredTab('/discover')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        <div
                            className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive('/discover') ? 'text-rovify-blue scale-110' :
                                    hoveredTab === '/discover' ? 'text-white scale-105' :
                                        'text-white/60'
                                }`}
                            style={{
                                transform: isActive('/discover') ? `scale(1.1) ${getMagneticTranslation('/discover')}` :
                                    hoveredTab === '/discover' ? `scale(1.05) ${getMagneticTranslation('/discover')}` :
                                        'scale(1)',
                                textShadow: isActive('/discover') ? '0 0 10px rgba(119,168,255,0.5)' : 'none'
                            }}
                        >
                            <div className="relative">
                                <div className={`transition-all duration-300 ease-out ${hoveredTab === '/discover' ? 'translate-y-[-2px]' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        className={`w-6 h-6 drop-shadow-sm transition-all duration-300 ease-out ${hoveredTab === '/discover' ? 'rotate-[5deg]' : ''
                                            }`}
                                    >
                                        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {isActive('/discover') && (
                                    <>
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-blue animate-pulse" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-blue animate-ping opacity-70" />
                                    </>
                                )}

                                {hoveredTab === '/discover' && !isActive('/discover') && (
                                    <div className="absolute inset-0 scale-150 rounded-full opacity-40 animate-pulse-slow"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                                            filter: 'blur(8px)',
                                        }}
                                    ></div>
                                )}
                            </div>

                            <span className={`text-xs mt-1 font-medium transition-all duration-300 ${isActive('/discover') ? 'opacity-100' : 'opacity-70 group-hover/item:opacity-100'
                                }`}>Explore</span>
                        </div>
                    </Link>

                    {/* Create - Special center button with advanced effects */}
                    <Link
                        href="/create"
                        className="flex flex-col items-center justify-center w-full relative group/create"
                        onMouseEnter={() => setHoveredTab('/create')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        <div className="absolute -top-8 flex items-center justify-center scale-100 group-hover/create:scale-105 transition-all duration-300 ease-out">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                                {/* Gradient background with animated rotation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-rovify-orange via-rovify-lavender to-rovify-orange bg-[length:200%_100%] animate-gradient-x"></div>

                                {/* Animated particles on hover */}
                                {hoveredTab === '/create' && (
                                    <div className="absolute inset-0">
                                        <div className="absolute h-1 w-1 rounded-full bg-white top-[20%] left-[30%] animate-float-slow"></div>
                                        <div className="absolute h-1.5 w-1.5 rounded-full bg-white top-[70%] left-[25%] animate-float-medium"></div>
                                        <div className="absolute h-1 w-1 rounded-full bg-white top-[40%] left-[80%] animate-float-fast"></div>
                                        <div className="absolute h-2 w-2 rounded-full bg-white top-[80%] left-[70%] animate-float-slow"></div>
                                    </div>
                                )}

                                {/* Glow overlay */}
                                <div className="absolute inset-0 bg-black/10 group-hover/create:bg-black/0 transition-all duration-300"></div>

                                {/* Inner black circle with plus icon */}
                                <div className="absolute inset-0.5 rounded-full bg-gradient-to-b from-black/80 to-black/95 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"
                                        className="w-8 h-8 group-hover/create:scale-110 transition-all duration-300 ease-out-quad"
                                        style={{
                                            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))'
                                        }}
                                    >
                                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {/* Outer glow ring */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-rovify-orange to-rovify-lavender opacity-20 rounded-full blur-xl group-hover/create:opacity-40 transition-opacity duration-500"></div>

                                {/* Pulsing ring effect */}
                                <div className={`absolute inset-0 rounded-full border-2 border-white/30 ${isActive('/create') ? 'scale-100' : 'scale-0'} transition-transform duration-300`}></div>
                                {isActive('/create') && (
                                    <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping-slow"></div>
                                )}
                            </div>
                        </div>

                        {/* Label for create button */}
                        <span className="absolute bottom-0.5 text-xs text-white/60 font-medium opacity-0 group-hover/create:opacity-100 transition-all duration-300 delay-150">Create</span>
                    </Link>

                    {/* Tickets - Similar enhancements as other tabs but with lavender theme */}
                    <Link
                        href="/tickets"
                        className="flex flex-col items-center justify-center w-full h-full group/item"
                        onMouseEnter={() => setHoveredTab('/tickets')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        <div
                            className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive('/tickets') ? 'text-rovify-lavender scale-110' :
                                    hoveredTab === '/tickets' ? 'text-white scale-105' :
                                        'text-white/60'
                                }`}
                            style={{
                                transform: isActive('/tickets') ? `scale(1.1) ${getMagneticTranslation('/tickets')}` :
                                    hoveredTab === '/tickets' ? `scale(1.05) ${getMagneticTranslation('/tickets')}` :
                                        'scale(1)',
                                textShadow: isActive('/tickets') ? '0 0 10px rgba(194,129,255,0.5)' : 'none'
                            }}
                        >
                            <div className="relative">
                                <div className={`transition-all duration-300 ease-out ${hoveredTab === '/tickets' ? 'translate-y-[-2px]' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        className={`w-6 h-6 drop-shadow-sm transition-all duration-300 ease-out ${hoveredTab === '/tickets' ? 'rotate-[5deg]' : ''
                                            }`}
                                    >
                                        <path fillRule="evenodd" d="M1.5 6.375c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v3.026a.75.75 0 01-.375.65 2.249 2.249 0 000 3.898.75.75 0 01.375.65v3.026c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 17.625v-3.026a.75.75 0 01.374-.65 2.249 2.249 0 000-3.898.75.75 0 01-.374-.65V6.375zm15-1.125a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75zm-.75 3a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0v-.75a.75.75 0 01.75-.75zm.75 4.5a.75.75 0 00-1.5 0V18a.75.75 0 001.5 0v-.75zM6 12a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H6.75A.75.75 0 016 12zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {isActive('/tickets') && (
                                    <>
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-lavender animate-pulse" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-lavender animate-ping opacity-70" />
                                    </>
                                )}

                                {hoveredTab === '/tickets' && !isActive('/tickets') && (
                                    <div className="absolute inset-0 scale-150 rounded-full opacity-40 animate-pulse-slow"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                                            filter: 'blur(8px)',
                                        }}
                                    ></div>
                                )}
                            </div>

                            <span className={`text-xs mt-1 font-medium transition-all duration-300 ${isActive('/tickets') ? 'opacity-100' : 'opacity-70 group-hover/item:opacity-100'
                                }`}>Tickets</span>
                        </div>
                    </Link>

                    {/* Profile - Similar enhancements as other tabs but with orange theme */}
                    <Link
                        href="/profile"
                        className="flex flex-col items-center justify-center w-full h-full group/item"
                        onMouseEnter={() => setHoveredTab('/profile')}
                        onMouseLeave={() => setHoveredTab(null)}
                    >
                        <div
                            className={`flex flex-col items-center justify-center transition-all duration-300 ${isActive('/profile') ? 'text-rovify-orange scale-110' :
                                    hoveredTab === '/profile' ? 'text-white scale-105' :
                                        'text-white/60'
                                }`}
                            style={{
                                transform: isActive('/profile') ? `scale(1.1) ${getMagneticTranslation('/profile')}` :
                                    hoveredTab === '/profile' ? `scale(1.05) ${getMagneticTranslation('/profile')}` :
                                        'scale(1)',
                                textShadow: isActive('/profile') ? '0 0 10px rgba(255,31,0,0.5)' : 'none'
                            }}
                        >
                            <div className="relative">
                                <div className={`transition-all duration-300 ease-out ${hoveredTab === '/profile' ? 'translate-y-[-2px]' : ''}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        className={`w-6 h-6 drop-shadow-sm transition-all duration-300 ease-out ${hoveredTab === '/profile' ? 'rotate-[5deg]' : ''
                                            }`}
                                    >
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                {isActive('/profile') && (
                                    <>
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-orange animate-pulse" />
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rovify-orange animate-ping opacity-70" />
                                    </>
                                )}

                                {hoveredTab === '/profile' && !isActive('/profile') && (
                                    <div className="absolute inset-0 scale-150 rounded-full opacity-40 animate-pulse-slow"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                                            filter: 'blur(8px)',
                                        }}
                                    ></div>
                                )}
                            </div>

                            <span className={`text-xs mt-1 font-medium transition-all duration-300 ${isActive('/profile') ? 'opacity-100' : 'opacity-70 group-hover/item:opacity-100'
                                }`}>Profile</span>
                        </div>
                    </Link>
                </nav>

                {/* Active tab indicator - now with blur and glow */}
                <div
                    className="absolute bottom-0 h-1 w-14 rounded-full transition-all duration-700 ease-out"
                    style={{
                        background: `linear-gradient(to right, transparent, ${getTabColor(activeTab)}, transparent)`,
                        left: activeTab === '/' ? '10%' :
                            activeTab === '/discover' ? '30%' :
                                activeTab === '/tickets' ? '70%' :
                                    activeTab === '/profile' ? '90%' : '50%',
                        transform: 'translateX(-50%)',
                        opacity: activeTab === '/create' ? 0 : 1,
                        filter: 'blur(1px)',
                        boxShadow: `0 0 10px 0 ${getTabColor(activeTab)}`,
                    }}
                />
            </div>

            {/* Keyframe animations for the component */}
            <style jsx global>{`
        @keyframes ripple {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-15px) translateX(-10px); opacity: 0.3; }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
          50% { transform: translateY(-10px) translateX(5px); opacity: 0.3; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        
        .ease-out-quad {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
        </div>
    );
}