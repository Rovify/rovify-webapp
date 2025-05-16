/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { getCurrentUser } from '@/mocks/data/users';
import { EventCategory, User } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { FiChevronLeft, FiCalendar, FiClock, FiMapPin, FiDollarSign, FiTag, FiEdit, FiFileText, FiImage, FiGlobe } from 'react-icons/fi';

// Form types with improved validation requirements
type EventFormData = {
    title: string;
    description: string;
    category: EventCategory;
    subcategory: string;
    date: string;
    time: string;
    endDate: string;
    endTime: string;
    locationName: string;
    locationAddress: string;
    locationCity: string;
    minPrice: number;
    maxPrice: number;
    currency: string;
    totalTickets: number;
    hasNftTickets: boolean;
    tags: string;
    image: string;
};

// Default form values to prevent undefined states
const defaultFormValues = {
    title: '',
    description: '',
    category: '' as EventCategory,
    subcategory: '',
    date: '',
    time: '',
    endDate: '',
    endTime: '',
    locationName: '',
    locationAddress: '',
    locationCity: '',
    minPrice: 0,
    maxPrice: 100,
    currency: 'USD',
    totalTickets: 100,
    hasNftTickets: true,
    tags: '',
    image: 'https://via.placeholder.com/600x400/77A8FF/FFFFFF?text=Event+Image'
};

export default function CreateEventPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>(defaultFormValues.image);

    // Refs for auto-focusing the first field in each step
    const titleInputRef = useRef<HTMLInputElement>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);
    const priceInputRef = useRef<HTMLInputElement>(null);

    // Improved form setup with react-hook-form, including validation
    const {
        register,
        handleSubmit,
        watch,
        control,
        trigger,
        setValue,
        formState: { errors, isValid, dirtyFields }
    } = useForm<EventFormData>({
        defaultValues: defaultFormValues,
        mode: 'onChange' // Validate on change for better UX feedback
    });

    // Watch form values for validation and preview
    const watchTitle = watch('title');
    const watchCategory = watch('category');
    const watchImage = watch('image');
    const watchDate = watch('date');
    const watchEndDate = watch('endDate');
    const watchMinPrice = watch('minPrice');
    const watchMaxPrice = watch('maxPrice');
    const watchHasNft = watch('hasNftTickets');

    // Initialize user data - with proper dependency array
    useEffect(() => {
        let isMounted = true;

        // Simulate API fetch delay
        const timer = setTimeout(() => {
            if (isMounted) {
                const user = getCurrentUser();
                setCurrentUser(user);
                setIsLoading(false);

                // Pre-fill city from user profile if available
                if (user?.city) {
                    setValue('locationCity', user.city);
                }
            }
        }, 1500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [setValue]); // Only include setValue in dependencies

    // Set focus on the first field of the current step
    useEffect(() => {
        if (!isLoading) {
            // Set focus on the first input of the current step
            setTimeout(() => {
                if (currentStep === 1 && titleInputRef.current) {
                    titleInputRef.current.focus();
                } else if (currentStep === 2 && locationInputRef.current) {
                    locationInputRef.current.focus();
                } else if (currentStep === 3 && priceInputRef.current) {
                    priceInputRef.current.focus();
                }
            }, 100);
        }
    }, [currentStep, isLoading]);

    // Update preview image when image URL changes - with safeguard to prevent infinite loops
    useEffect(() => {
        if (watchImage && watchImage !== previewImage) {
            setPreviewImage(watchImage);
        }
    }, [watchImage, previewImage]);

    // Auto-update end date based on start date if end date is empty
    useEffect(() => {
        if (watchDate && !watchEndDate && !dirtyFields.endDate) {
            setValue('endDate', watchDate);
        }
    }, [watchDate, watchEndDate, setValue, dirtyFields.endDate]);

    // Ensure min price is never greater than max price
    useEffect(() => {
        if (watchMinPrice > watchMaxPrice) {
            setValue('maxPrice', watchMinPrice);
        }
    }, [watchMinPrice, watchMaxPrice, setValue]);

    // Form submission handler with error handling
    const onSubmit = async (data: EventFormData) => {
        try {
            setIsSubmitting(true);

            // Normalize data before submission
            const normalizedData = {
                ...data,
                title: data.title.trim(),
                description: data.description.trim(),
                tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean).join(','),
                locationName: data.locationName.trim(),
                locationAddress: data.locationAddress.trim(),
                locationCity: data.locationCity.trim()
            };

            // Simulate API call delay
            setTimeout(() => {
                console.log('Submitting form data:', normalizedData);
                setIsSubmitting(false);
                router.push('/success?type=event');
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
            // Handle error (could show error message to user)
        }
    };

    // Validate the current step before proceeding
    const validateStep = async (step: number) => {
        let fieldsToValidate: string[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ['title', 'description', 'category'];
                break;
            case 2:
                fieldsToValidate = ['locationName', 'locationAddress', 'locationCity', 'date', 'time', 'endDate', 'endTime'];
                break;
            case 3:
                fieldsToValidate = ['minPrice', 'maxPrice', 'currency', 'totalTickets'];
                break;
        }

        const result = await trigger(fieldsToValidate as any);
        return result;
    };

    // Navigation functions with validation
    const handleNextStep = async () => {
        const isStepValid = await validateStep(currentStep);
        if (isStepValid) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    // Helper function to format date inputs with browser compatibility
    const formatDateForInput = (date: string) => {
        if (!date) return '';
        return date;
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 mr-4 border border-gray-100"
                        aria-label="Go back"
                    >
                        <FiChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-[#FF5722]">Create Event</h1>
                        <p className="text-gray-500">Share your experience with the world</p>
                    </div>
                </div>

                {/* Journey Path Step Indicator */}
                {isLoading ? (
                    <div className="mb-8">
                        <div className="flex items-center mb-2">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-shimmer" style={{ animationDelay: `${(step - 1) * 0.1}s` }}></div>
                                    {step < 3 && (
                                        <div className="w-16 h-1 bg-gray-200 animate-shimmer" style={{ animationDelay: `${(step - 1) * 0.1 + 0.05}s` }}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-12 mt-6">
                        {/* Main Path Container */}
                        <div className="relative mx-auto px-2 py-4 max-w-3xl">

                            {/* Decorative Background Pattern (subtle hexagons) */}
                            <div className="absolute inset-0 bg-pattern opacity-5" aria-hidden="true"></div>

                            {/* Main Journey Path - Curves using SVG */}
                            <div className="relative h-20 mx-auto">
                                <svg width="100%" height="100%" viewBox="0 0 800 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden="true">
                                    {/* Background Track */}
                                    <path
                                        d="M0,40 C100,70 200,0 400,40 C600,80 700,10 800,40"
                                        stroke="#E5E7EB"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="drop-shadow-sm"
                                    />

                                    {/* Progress Track (Animated and Gradient-Filled) */}
                                    <path
                                        d="M0,40 C100,70 200,0 400,40 C600,80 700,10 800,40"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray="800"
                                        strokeDashoffset={currentStep === 1 ? "800" : currentStep === 2 ? "400" : "0"}
                                        className="transition-all duration-1000 ease-in-out"
                                    />

                                    {/* Gradient Definition */}
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%">
                                            <stop offset="0%" stopColor="#FF5722" />
                                            <stop offset="100%" stopColor="#FF9800" />
                                        </linearGradient>
                                        <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
                                            <feGaussianBlur stdDeviation="2" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>
                                </svg>

                                {/* Step Markers along the Path */}
                                <div className="absolute top-0 left-0 w-full h-full flex justify-between items-center pointer-events-none">
                                    {/* Step 1: Event Details */}
                                    <div className={`transform transition-all duration-700 ${currentStep >= 1 ? 'scale-100' : 'scale-90 opacity-70'}`}
                                        style={{ marginLeft: '2%' }}>
                                        <div className={`
                                            relative flex items-center justify-center
                                            ${currentStep === 1
                                                ? 'animate-float-slow'
                                                : currentStep > 1
                                                    ? 'animate-none'
                                                    : 'animate-none opacity-50'
                                            }
                                        `}>
                                            {/* Step Circle */}
                                            <div className={`
                                                h-12 w-12 rounded-full flex items-center justify-center z-10
                                                transition-all duration-500
                                                ${currentStep > 1
                                                    ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-90'
                                                    : currentStep === 1
                                                        ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-110 shadow-lg shadow-orange-300/30'
                                                        : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }
                                            `} role="button" tabIndex={currentStep !== 1 ? 0 : -1} onClick={() => currentStep > 1 && setCurrentStep(1)} aria-label="Go to step 1: Event Details">
                                                {currentStep > 1 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <FiFileText className="h-6 w-6" aria-hidden="true" />
                                                )}

                                                {/* Active Pulse Animation */}
                                                {currentStep === 1 && (
                                                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-ping-slow" aria-hidden="true"></div>
                                                )}
                                            </div>

                                            {/* Step Label */}
                                            <div className={`
                                                absolute -bottom-8 left-1/2 transform -translate-x-1/2 min-w-max
                                                text-sm font-medium 
                                                ${currentStep >= 1 ? 'text-[#FF5722]' : 'text-gray-500'}
                                            `}>
                                                <div className="relative">
                                                    <span className={currentStep === 1 ? 'drop-shadow-sm' : ''}>Event Details</span>
                                                    {currentStep === 1 && (
                                                        <div className="h-1 w-1 rounded-full bg-[#FF5722] absolute -bottom-2 left-1/2 transform -translate-x-1/2" aria-hidden="true"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Location & Time */}
                                    <div className={`transform transition-all duration-700 ${currentStep >= 2 ? 'scale-100' : 'scale-90 opacity-70'}`}
                                        style={{ marginTop: '-15%' }}>
                                        <div className={`
                                            relative flex items-center justify-center
                                            ${currentStep === 2
                                                ? 'animate-float-slow'
                                                : currentStep > 2
                                                    ? 'animate-none'
                                                    : 'animate-none opacity-50'
                                            }
                                        `}>
                                            {/* Step Circle */}
                                            <div className={`
                                                h-12 w-12 rounded-full flex items-center justify-center z-10
                                                transition-all duration-500
                                                ${currentStep > 2
                                                    ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-90'
                                                    : currentStep === 2
                                                        ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-110 shadow-lg shadow-orange-300/30'
                                                        : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }
                                            `} role="button" tabIndex={currentStep > 1 && currentStep !== 2 ? 0 : -1} onClick={() => currentStep > 2 && setCurrentStep(2)} aria-label="Go to step 2: Location & Time">
                                                {currentStep > 2 ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <FiMapPin className="h-6 w-6" aria-hidden="true" />
                                                )}

                                                {/* Active Pulse Animation */}
                                                {currentStep === 2 && (
                                                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-ping-slow" aria-hidden="true"></div>
                                                )}
                                            </div>

                                            {/* Step Label */}
                                            <div className={`
                                                absolute -bottom-8 left-1/2 transform -translate-x-1/2 min-w-max
                                                text-sm font-medium
                                                ${currentStep >= 2 ? 'text-[#FF5722]' : 'text-gray-500'}
                                            `}>
                                                <div className="relative">
                                                    <span className={currentStep === 2 ? 'drop-shadow-sm' : ''}>Location & Time</span>
                                                    {currentStep === 2 && (
                                                        <div className="h-1 w-1 rounded-full bg-[#FF5722] absolute -bottom-2 left-1/2 transform -translate-x-1/2" aria-hidden="true"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 3: Tickets & Publish */}
                                    <div className={`transform transition-all duration-700 ${currentStep >= 3 ? 'scale-100' : 'scale-90 opacity-70'}`}
                                        style={{ marginRight: '2%' }}>
                                        <div className={`
                                            relative flex items-center justify-center
                                            ${currentStep === 3
                                                ? 'animate-float-slow'
                                                : 'animate-none opacity-50'
                                            }
                                        `}>
                                            {/* Step Circle */}
                                            <div className={`
                                                h-12 w-12 rounded-full flex items-center justify-center z-10
                                                transition-all duration-500
                                                ${currentStep === 3
                                                    ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white scale-110 shadow-lg shadow-orange-300/30'
                                                    : 'bg-white text-gray-400 border-2 border-gray-200'
                                                }
                                            `} aria-label="Step 3: Tickets & Publish">
                                                <FiDollarSign className="h-6 w-6" aria-hidden="true" />

                                                {/* Active Pulse Animation */}
                                                {currentStep === 3 && (
                                                    <div className="absolute inset-0 rounded-full border-4 border-orange-400/20 animate-ping-slow" aria-hidden="true"></div>
                                                )}
                                            </div>

                                            {/* Step Label */}
                                            <div className={`
                                                absolute -bottom-8 left-1/2 transform -translate-x-1/2 min-w-max
                                                text-sm font-medium
                                                ${currentStep >= 3 ? 'text-[#FF5722]' : 'text-gray-500'}
                                            `}>
                                                <div className="relative">
                                                    <span className={currentStep === 3 ? 'drop-shadow-sm' : ''}>Tickets & Publish</span>
                                                    {currentStep === 3 && (
                                                        <div className="h-1 w-1 rounded-full bg-[#FF5722] absolute -bottom-2 left-1/2 transform -translate-x-1/2" aria-hidden="true"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Animated Elements - Only visible on desktop */}
                                <div className="hidden md:block">
                                    {/* Traveling dot along the path */}
                                    <div
                                        className={`absolute top-0 h-3 w-3 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] shadow-lg z-20 transition-all duration-1000 ease-in-out ${currentStep > 1 ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        style={{
                                            left: `${currentStep === 1 ? 0 : currentStep === 2 ? 50 : 100}%`,
                                            top: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            filter: 'drop-shadow(0 0 4px rgba(255, 87, 34, 0.5))'
                                        }}
                                        aria-hidden="true"
                                    ></div>

                                    {/* Decorative Elements - Small floating dots/particles */}
                                    <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-[#FF5722]/20 animate-float-particle-1" aria-hidden="true"></div>
                                    <div className="absolute top-3/4 left-1/2 h-1.5 w-1.5 rounded-full bg-[#FF9800]/30 animate-float-particle-2" aria-hidden="true"></div>
                                    <div className="absolute top-1/3 left-3/4 h-1 w-1 rounded-full bg-[#FF5722]/40 animate-float-particle-3" aria-hidden="true"></div>
                                </div>
                            </div>

                            {/* Mobile-Optimized View - Shows on small screens only */}
                            <div className="md:hidden mt-10 relative">
                                <div className="flex justify-between items-center mb-1 px-2">
                                    {["Event Details", "Location & Time", "Tickets & Publish"].map((label, idx) => (
                                        <span
                                            key={idx}
                                            className={`text-xs font-medium transition-all duration-300 ${currentStep > idx + 1
                                                ? 'text-[#FF5722]'
                                                : currentStep === idx + 1
                                                    ? 'text-[#FF5722] font-semibold'
                                                    : 'text-gray-400'
                                                }`}
                                        >
                                            {idx + 1}. {idx === 0 ? label : idx === 1 ? "Location" : "Tickets"}
                                        </span>
                                    ))}
                                </div>

                                {/* Mobile Progress Bar */}
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] rounded-full transition-all duration-700 ease-in-out"
                                        style={{ width: `${(currentStep / 3) * 100}%` }}
                                    >
                                        {/* Animated Shine Effect */}
                                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                                            <div
                                                className="absolute top-0 left-[-100%] h-full w-[50%] bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 animate-shimmerMobile"
                                                aria-hidden="true"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Content */}
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                    {isLoading ? (
                        // Form Loading Skeleton
                        <div className="space-y-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div
                                        className="h-5 w-32 bg-gray-200 rounded-md animate-shimmer"
                                        style={{ animationDelay: `${0.7 + i * 0.2}s` }}
                                    ></div>
                                    <div
                                        className="h-12 w-full bg-gray-200 rounded-lg animate-shimmer"
                                        style={{ animationDelay: `${0.8 + i * 0.2}s` }}
                                    ></div>
                                </div>
                            ))}

                            {/* Grid Layout for Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div
                                            className="h-5 w-32 bg-gray-200 rounded-md animate-shimmer"
                                            style={{ animationDelay: `${1.5 + i * 0.2}s` }}
                                        ></div>
                                        <div
                                            className="h-12 w-full bg-gray-200 rounded-lg animate-shimmer"
                                            style={{ animationDelay: `${1.6 + i * 0.2}s` }}
                                        ></div>
                                    </div>
                                ))}
                            </div>

                            {/* Button Row */}
                            <div className="pt-4">
                                <div
                                    className="h-12 w-full bg-gray-200 rounded-lg animate-shimmer"
                                    style={{ animationDelay: '2s' }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="animate-fadeIn">
                            {/* Step 1: Event Details - Improved sequence and validation */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    {/* Event Title */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Event Title*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FiEdit className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                id="title"
                                                ref={titleInputRef}
                                                placeholder="Give your event a catchy title"
                                                className={`w-full bg-white border ${errors.title ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("title", {
                                                    required: 'Title is required',
                                                    minLength: {
                                                        value: 5,
                                                        message: 'Title should be at least 5 characters'
                                                    },
                                                    maxLength: {
                                                        value: 100,
                                                        message: 'Title should be less than 100 characters'
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.title && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.title.message}
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1 ml-1">
                                            A clear, descriptive title helps your event stand out
                                        </p>
                                    </div>

                                    {/* Event Category and Subcategory - Moved up for better logical flow */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300 relative">
                                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Category*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiTag className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <select
                                                    id="category"
                                                    className={`w-full bg-white border ${errors.category ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base pr-10 appearance-none`}
                                                    {...register("category", { required: 'Category is required' })}
                                                >
                                                    <option value="">Select a category</option>
                                                    <option value="MUSIC">Music</option>
                                                    <option value="CONFERENCE">Conference</option>
                                                    <option value="WORKSHOP">Workshop</option>
                                                    <option value="ART">Art</option>
                                                    <option value="WELLNESS">Wellness</option>
                                                    <option value="GAMING">Gaming</option>
                                                    <option value="FILM">Film</option>
                                                    <option value="AUTOMOTIVE">Automotive</option>
                                                    <option value="TECHNOLOGY">Technology</option>
                                                    <option value="FOOD">Food</option>
                                                </select>
                                                {/* Custom dropdown arrow */}
                                                <div className="absolute right-3.5 top-1/2 mt-0.5 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.category && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.category.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Subcategory <span className="text-gray-400">(Optional)</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiTag className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="text"
                                                    id="subcategory"
                                                    placeholder="E.g., Electronic, Workshop, Exhibition"
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base"
                                                    {...register("subcategory")}
                                                />
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1 ml-1">
                                                Helps attendees find your event more easily
                                            </p>
                                        </div>
                                    </div>

                                    {/* Event Description */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Event Description*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-5 transform text-gray-400">
                                                <FiFileText className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <textarea
                                                id="description"
                                                rows={4}
                                                placeholder="Describe what makes your event special"
                                                className={`w-full bg-white border ${errors.description ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("description", {
                                                    required: 'Description is required',
                                                    minLength: { value: 20, message: 'Description should be at least 20 characters' },
                                                    maxLength: { value: 2000, message: 'Description is too long' }
                                                })}
                                            />
                                        </div>
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.description.message}
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1 ml-1">Markdown formatting is supported</p>
                                    </div>

                                    {/* Tags */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Tags <span className="text-gray-400">(Optional, comma separated)</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FiTag className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                id="tags"
                                                placeholder="E.g., music, nightlife, art"
                                                className="w-full bg-white border border-gray-300 rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base"
                                                {...register("tags")}
                                            />
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1 ml-1">Help people discover your event with relevant tags</p>
                                    </div>

                                    {/* Next Step Button */}
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!watchTitle || !watchCategory}
                                        className={`w-full py-3.5 rounded-lg font-medium transition-all duration-300 mt-6 text-base ${watchTitle && watchCategory
                                            ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white hover:shadow-lg hover:translate-y-[-2px]'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {watchTitle && watchCategory ? (
                                            <div className="flex items-center justify-center">
                                                Next: Location & Time
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Complete required fields
                                            </div>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Location & Time - Improved with icons and better grouping */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    {/* Location Section */}
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Event Location</h3>

                                    {/* Location Name */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Venue/Location Name*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FiMapPin className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                id="locationName"
                                                ref={locationInputRef}
                                                placeholder="Where is your event happening?"
                                                className={`w-full bg-white border ${errors.locationName ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("locationName", { required: 'Venue name is required' })}
                                            />
                                        </div>
                                        {errors.locationName && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.locationName.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Address*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FiMapPin className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                id="locationAddress"
                                                placeholder="Street address"
                                                className={`w-full bg-white border ${errors.locationAddress ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("locationAddress", { required: 'Address is required' })}
                                            />
                                        </div>
                                        {errors.locationAddress && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.locationAddress.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* City */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            City*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FiGlobe className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                id="locationCity"
                                                placeholder="City where the event is located"
                                                className={`w-full bg-white border ${errors.locationCity ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("locationCity", { required: 'City is required' })}
                                            />
                                        </div>
                                        {errors.locationCity && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.locationCity.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date and Time Section */}
                                    <h3 className="text-lg font-medium text-gray-800 mb-4 mt-8">Event Schedule</h3>

                                    {/* Start Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Start Date*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiCalendar className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="date"
                                                    id="date"
                                                    className={`w-full bg-white border ${errors.date ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("date", { required: 'Start date is required' })}
                                                />
                                            </div>
                                            {errors.date && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.date.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Start Time*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiClock className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="time"
                                                    id="time"
                                                    className={`w-full bg-white border ${errors.time ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("time", { required: 'Start time is required' })}
                                                />
                                            </div>
                                            {errors.time && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.time.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* End Date and Time */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                End Date*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiCalendar className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="date"
                                                    id="endDate"
                                                    className={`w-full bg-white border ${errors.endDate ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("endDate", { required: 'End date is required' })}
                                                />
                                            </div>
                                            {errors.endDate && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.endDate.message}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1 ml-1">Defaults to same as start date for single-day events</p>
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                End Time*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiClock className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="time"
                                                    id="endTime"
                                                    className={`w-full bg-white border ${errors.endTime ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("endTime", { required: 'End time is required' })}
                                                />
                                            </div>
                                            {errors.endTime && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.endTime.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Navigation Buttons */}
                                    <div className="flex gap-4 mt-8">
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="flex-1 py-3.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-all duration-300 hover:shadow text-base flex items-center justify-center hover:translate-y-[-2px]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextStep}
                                            disabled={!watchDate}
                                            className={`flex-1 py-3.5 rounded-lg font-medium transition-all duration-300 text-base flex items-center justify-center ${watchDate
                                                ? 'bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white hover:shadow-lg hover:translate-y-[-2px]'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {watchDate ? (
                                                <>
                                                    Next: Tickets
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            ) : (
                                                <div className="flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Complete required fields
                                                </div>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Tickets & Publish - Improved section organization */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    {/* Pricing Section Header */}
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Ticket Pricing</h3>

                                    {/* Pricing Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Minimum Price*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiDollarSign className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="number"
                                                    id="minPrice"
                                                    ref={priceInputRef}
                                                    placeholder="0"
                                                    min={0}
                                                    className={`w-full bg-white border ${errors.minPrice ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("minPrice", {
                                                        required: 'Min price is required',
                                                        min: { value: 0, message: 'Price cannot be negative' },
                                                        valueAsNumber: true
                                                    })}
                                                />
                                            </div>
                                            {errors.minPrice && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.minPrice.message}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1 ml-1">Set to 0 for free tickets</p>
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Maximum Price*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiDollarSign className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="number"
                                                    id="maxPrice"
                                                    placeholder="100"
                                                    min={0}
                                                    className={`w-full bg-white border ${errors.maxPrice ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                    {...register("maxPrice", {
                                                        required: 'Max price is required',
                                                        min: { value: 0, message: 'Price cannot be negative' },
                                                        valueAsNumber: true
                                                    })}
                                                />
                                            </div>
                                            {errors.maxPrice && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.maxPrice.message}
                                                </p>
                                            )}
                                            <p className="text-gray-500 text-xs mt-1 ml-1">Same as min price for single price</p>
                                        </div>

                                        <div className="transform transition-all hover:scale-[1.01] duration-300">
                                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                                Currency*
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                    <FiDollarSign className="h-5 w-5" aria-hidden="true" />
                                                </div>
                                                <select
                                                    id="currency"
                                                    className={`w-full bg-white border ${errors.currency ? 'border-red-500' : 'border-gray-300'
                                                        } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base appearance-none pr-10`}
                                                    {...register("currency", { required: 'Currency is required' })}
                                                >
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="JPY">JPY (¥)</option>
                                                </select>
                                                <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            {errors.currency && (
                                                <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {errors.currency.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Total Tickets */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700 mb-1 ml-1">
                                            Total Available Tickets*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="number"
                                                id="totalTickets"
                                                placeholder="100"
                                                min={1}
                                                className={`w-full bg-white border ${errors.totalTickets ? 'border-red-500' : 'border-gray-300'
                                                    } rounded-lg p-3.5 pl-10 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent shadow-sm hover:shadow transition-shadow duration-300 text-base`}
                                                {...register("totalTickets", {
                                                    required: 'Total tickets is required',
                                                    min: { value: 1, message: 'Must have at least 1 ticket' },
                                                    valueAsNumber: true
                                                })}
                                            />
                                        </div>
                                        {errors.totalTickets && (
                                            <p className="text-red-500 text-sm mt-1.5 ml-1 flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.totalTickets.message}
                                            </p>
                                        )}
                                        <p className="text-gray-500 text-xs mt-1 ml-1">You can update this later if needed</p>
                                    </div>

                                    {/* NFT Tickets Option - Enhanced with gradient instead of emojis */}
                                    <div className="bg-gradient-to-r from-white to-orange-50 rounded-xl p-6 border border-orange-100 shadow-md transform transition-all hover:shadow-lg duration-300 hover:scale-[1.01]">
                                        <div className="flex items-start">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-xl mb-2 flex items-center gap-2 text-gray-800">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-md">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                        </svg>
                                                    </div>
                                                    NFT Tickets
                                                    {watchHasNft && (
                                                        <span className="text-xs bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white px-2 py-1 rounded-full ml-2 shadow-sm">Enabled</span>
                                                    )}
                                                </h3>
                                                <p className="text-gray-600 text-sm">
                                                    Create blockchain-based tickets that can be collected, traded, and verified on-chain.
                                                </p>
                                                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Collectable digital memorabilia
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Resellable on secondary marketplaces
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Enhanced anti-fraud protection
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center shadow-sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        Creator royalties on resales
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="ml-4 flex items-center h-full">
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        {...register("hasNftTickets")}
                                                    />
                                                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF5722] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#FF5722] peer-checked:to-[#FF9800] shadow-inner"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation & Final Submit Buttons */}
                                    <div className="flex gap-4 mt-8">
                                        {/* Back Button */}
                                        <button
                                            type="button"
                                            onClick={handlePrevStep}
                                            className="flex-1 py-3.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-all duration-300 hover:shadow text-base flex items-center justify-center hover:translate-y-[-2px]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </button>

                                        {/* Submit Button - Enhanced with better feedback */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 py-3.5 bg-gradient-to-r from-[#FF5722] to-[#FF9800] hover:from-[#E64A19] hover:to-[#FB8C00] text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center hover:translate-y-[-2px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Creating Your Event...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>Publish Event</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </main>

            <BottomNavigation />

            {/* Global Styles - with improved animation performance */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }

                @keyframes fadeIn {
                    0% { opacity: 0; transform: scale(0.98); }
                    100% { opacity: 1; transform: scale(1); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }

                @keyframes shimmerMobile {
                    0% { left: -50%; }
                    100% { left: 100%; }
                }
                
                .animate-shimmerMobile {
                    animation: shimmerMobile 1.5s ease-in-out infinite;
                }

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                }
                
                .animate-float-slow {
                    animation: float-slow 3s ease-in-out infinite;
                }

                @keyframes ping-slow {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    70%, 100% { transform: scale(1.8); opacity: 0; }
                }
                
                .animate-ping-slow {
                    animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                @keyframes float-particle-1 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.6; }
                    25% { transform: translate(3px, -5px); opacity: 0.8; }
                    50% { transform: translate(8px, 2px); opacity: 0.4; }
                    75% { transform: translate(4px, 8px); opacity: 0.7; }
                }
                
                .animate-float-particle-1 {
                    animation: float-particle-1 8s ease-in-out infinite;
                }

                @keyframes float-particle-2 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.4; }
                    25% { transform: translate(-5px, 4px); opacity: 0.7; }
                    50% { transform: translate(-2px, -6px); opacity: 0.5; }
                    75% { transform: translate(3px, 5px); opacity: 0.8; }
                }
                
                .animate-float-particle-2 {
                    animation: float-particle-2 10s ease-in-out infinite;
                    animation-delay: 1s;
                }

                @keyframes float-particle-3 {
                    0%, 100% { transform: translate(0, 0); opacity: 0.3; }
                    25% { transform: translate(4px, 6px); opacity: 0.6; }
                    50% { transform: translate(-5px, 4px); opacity: 0.4; }
                    75% { transform: translate(-7px, -4px); opacity: 0.7; }
                }
                
                .animate-float-particle-3 {
                    animation: float-particle-3 12s ease-in-out infinite;
                    animation-delay: 2s;
                }

                .bg-pattern {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
                }

                /* Style fixes for date/time inputs in various browsers */
                input[type="date"], input[type="time"] {
                    appearance: none;
                    -webkit-appearance: none;
                    -moz-appearance: none;
                }

                /* More consistent dropdown behavior */
                select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23718096'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E");
                    background-position: right 0.75rem center;
                    background-repeat: no-repeat;
                    background-size: 1.5em;
                }
                
                /* Optimize animation performance */
                .animate-fadeIn, .animate-float-slow, .animate-ping-slow {
                    will-change: transform, opacity;
                }
            `}</style>
        </div>
    );
}