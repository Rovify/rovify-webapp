'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { getCurrentUser } from '@/mocks/data/users';
import { EventCategory, User } from '@/types';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { FiChevronLeft } from 'react-icons/fi';

// Form types
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

export default function CreateEventPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    // Form setup with react-hook-form
    const { register, handleSubmit, watch, formState: { errors } } = useForm<EventFormData>({
        defaultValues: {
            currency: 'USD',
            hasNftTickets: true,
            image: 'https://via.placeholder.com/600x400/77A8FF/FFFFFF?text=Event+Image'
        }
    });

    // Watch form values for validation and preview
    const watchTitle = watch('title');
    const watchCategory = watch('category');
    const watchImage = watch('image');
    const watchDate = watch('date');
    const watchHasNft = watch('hasNftTickets');

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setCurrentUser(getCurrentUser());
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Update preview image when image URL changes
    useEffect(() => {
        if (watchImage) {
            setPreviewImage(watchImage);
        }
    }, [watchImage]);

    // Form submission handler
    const onSubmit = async (data: EventFormData) => {
        setIsSubmitting(true);

        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/success?type=event');
        }, 2000);
    };

    // Navigation functions
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="flex items-center mb-4">
                    <button
                        onClick={() => router.back()}
                        className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm mr-4"
                    >
                        <FiChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Create Event</h1>
                        <p className="text-gray-500">Share your experience with the world</p>
                    </div>
                </div>

                {/* Form Progress */}
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
                        <div className="flex justify-between">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-4 w-24 bg-gray-200 rounded-md animate-shimmer"
                                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-8">
                        <div className="flex items-center mb-2">
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= step
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'bg-white text-gray-500 border border-gray-200'
                                        }`}>
                                        {currentStep > step ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <span>{step}</span>
                                        )}
                                    </div>
                                    {step < 3 && (
                                        <div className={`w-16 h-1 ${currentStep > step ? 'bg-[#FF5722]/70' : 'bg-gray-200'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Event Details</span>
                            <span>Location & Time</span>
                            <span>Tickets & Publish</span>
                        </div>
                    </div>
                )}

                {/* Form Content */}
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Step 1: Event Details */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                {/* Event Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Title*
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        placeholder="Give your event a catchy title"
                                        className={`w-full bg-white border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("title", { required: 'Title is required' })}
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                </div>

                                {/* Event Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Description*
                                    </label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        placeholder="Describe what makes your event special"
                                        className={`w-full bg-white border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("description", { required: 'Description is required', minLength: { value: 20, message: 'Description should be at least 20 characters' } })}
                                    />
                                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                </div>

                                {/* Category and Subcategory */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category*
                                        </label>
                                        <select
                                            id="category"
                                            className={`w-full bg-white border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
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
                                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                                            Subcategory
                                        </label>
                                        <input
                                            type="text"
                                            id="subcategory"
                                            placeholder="E.g., Electronic, Workshop, Exhibition"
                                            className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                            {...register("subcategory")}
                                        />
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="tags"
                                        placeholder="E.g., music, nightlife, art"
                                        className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                        {...register("tags")}
                                    />
                                    <p className="text-gray-500 text-xs mt-1">Help people discover your event with relevant tags</p>
                                </div>

                                {/* Event Image */}
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Image URL*
                                    </label>
                                    <input
                                        type="text"
                                        id="image"
                                        placeholder="https://example.com/my-event-image.jpg"
                                        className={`w-full bg-white border ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("image", { required: 'Image URL is required' })}
                                    />
                                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

                                    <p className="text-gray-500 text-xs mt-1">
                                        In the final app, this would be an image upload. For now, use a URL.
                                    </p>

                                    {/* Image Preview */}
                                    {previewImage && (
                                        <div className="mt-3 relative h-48 rounded-lg overflow-hidden shadow-sm">
                                            <Image
                                                src={previewImage}
                                                alt="Event preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Next Step Button */}
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={!watchTitle || !watchCategory}
                                    className={`w-full py-3 rounded-lg font-medium transition-all ${watchTitle && watchCategory
                                        ? 'bg-[#FF5722] text-white hover:bg-[#E64A19] shadow-md'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Next: Location & Time
                                </button>
                            </div>
                        )}

                        {/* Step 2: Location & Time */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                {/* Location Name */}
                                <div>
                                    <label htmlFor="locationName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Venue/Location Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="locationName"
                                        placeholder="Where is your event happening?"
                                        className={`w-full bg-white border ${errors.locationName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("locationName", { required: 'Venue name is required' })}
                                    />
                                    {errors.locationName && <p className="text-red-500 text-sm mt-1">{errors.locationName.message}</p>}
                                </div>

                                {/* Address */}
                                <div>
                                    <label htmlFor="locationAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address*
                                    </label>
                                    <input
                                        type="text"
                                        id="locationAddress"
                                        placeholder="Street address"
                                        className={`w-full bg-white border ${errors.locationAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("locationAddress", { required: 'Address is required' })}
                                    />
                                    {errors.locationAddress && <p className="text-red-500 text-sm mt-1">{errors.locationAddress.message}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="locationCity" className="block text-sm font-medium text-gray-700 mb-1">
                                        City*
                                    </label>
                                    <input
                                        type="text"
                                        id="locationCity"
                                        placeholder="City where the event is located"
                                        className={`w-full bg-white border ${errors.locationCity ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("locationCity", { required: 'City is required' })}
                                    />
                                    {errors.locationCity && <p className="text-red-500 text-sm mt-1">{errors.locationCity.message}</p>}
                                </div>

                                {/* Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date*
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            className={`w-full bg-white border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("date", { required: 'Start date is required' })}
                                        />
                                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Time*
                                        </label>
                                        <input
                                            type="time"
                                            id="time"
                                            className={`w-full bg-white border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("time", { required: 'Start time is required' })}
                                        />
                                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                                    </div>
                                </div>

                                {/* End Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date*
                                        </label>
                                        <input
                                            type="date"
                                            id="endDate"
                                            className={`w-full bg-white border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("endDate", { required: 'End date is required' })}
                                        />
                                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                                            End Time*
                                        </label>
                                        <input
                                            type="time"
                                            id="endTime"
                                            className={`w-full bg-white border ${errors.endTime ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("endTime", { required: 'End time is required' })}
                                        />
                                        {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>}
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={!watchDate}
                                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${watchDate
                                            ? 'bg-[#FF5722] text-white hover:bg-[#E64A19] shadow-md'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Next: Tickets
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Tickets & Publish */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                {/* Pricing */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                            Minimum Price*
                                        </label>
                                        <input
                                            type="number"
                                            id="minPrice"
                                            placeholder="0"
                                            min={0}
                                            className={`w-full bg-white border ${errors.minPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("minPrice", {
                                                required: 'Min price is required',
                                                min: { value: 0, message: 'Price cannot be negative' },
                                                valueAsNumber: true
                                            })}
                                        />
                                        {errors.minPrice && <p className="text-red-500 text-sm mt-1">{errors.minPrice.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                                            Maximum Price*
                                        </label>
                                        <input
                                            type="number"
                                            id="maxPrice"
                                            placeholder="100"
                                            min={0}
                                            className={`w-full bg-white border ${errors.maxPrice ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("maxPrice", {
                                                required: 'Max price is required',
                                                min: { value: 0, message: 'Price cannot be negative' },
                                                valueAsNumber: true
                                            })}
                                        />
                                        {errors.maxPrice && <p className="text-red-500 text-sm mt-1">{errors.maxPrice.message}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                                            Currency*
                                        </label>
                                        <select
                                            id="currency"
                                            className={`w-full bg-white border ${errors.currency ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                            {...register("currency", { required: 'Currency is required' })}
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="JPY">JPY (¥)</option>
                                        </select>
                                        {errors.currency && <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>}
                                    </div>
                                </div>

                                {/* Total Tickets */}
                                <div>
                                    <label htmlFor="totalTickets" className="block text-sm font-medium text-gray-700 mb-1">
                                        Total Available Tickets*
                                    </label>
                                    <input
                                        type="number"
                                        id="totalTickets"
                                        placeholder="100"
                                        min={1}
                                        className={`w-full bg-white border ${errors.totalTickets ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent`}
                                        {...register("totalTickets", {
                                            required: 'Total tickets is required',
                                            min: { value: 1, message: 'Must have at least 1 ticket' },
                                            valueAsNumber: true
                                        })}
                                    />
                                    {errors.totalTickets && <p className="text-red-500 text-sm mt-1">{errors.totalTickets.message}</p>}
                                </div>

                                {/* NFT Tickets Option */}
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <div className="flex items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-gray-800">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                </svg>
                                                NFT Tickets
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                Create blockchain-based tickets that can be collected, traded, and verified on-chain.
                                            </p>
                                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                                <li className="flex items-center gap-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Collectable digital memorabilia
                                                </li>
                                                <li className="flex items-center gap-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Resellable on secondary marketplaces
                                                </li>
                                                <li className="flex items-center gap-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Enhanced anti-fraud protection
                                                </li>
                                                <li className="flex items-center gap-1.5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
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
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF5722] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5722]"></div>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Preview */}
                                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Event Preview</h3>
                                    <div className="relative h-48 rounded-lg overflow-hidden mb-4 shadow-sm">
                                        <Image
                                            src={previewImage || 'https://via.placeholder.com/600x400/77A8FF/FFFFFF?text=Event+Image'}
                                            alt="Event preview"
                                            fill
                                            className="object-cover"
                                        />
                                        {watchHasNft && (
                                            <div className="absolute top-3 right-3 bg-[#FF5722] text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                </svg>
                                                NFT
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-semibold text-lg text-gray-800">{watchTitle || 'Event Title'}</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {watchCategory ? watchCategory.charAt(0) + watchCategory.slice(1).toLowerCase() : 'Category'} • {watchDate || 'Date'}
                                    </p>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handlePrevStep}
                                        className="flex-1 py-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg font-medium transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-lg font-medium transition-colors shadow-md flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Event...
                                            </>
                                        ) : (
                                            'Publish Event'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </main>

            <BottomNavigation />

            {/* Global Styles */}
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
            `}</style>
        </div>
    );
}