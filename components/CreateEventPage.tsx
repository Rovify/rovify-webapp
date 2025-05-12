'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { getCurrentUser } from '@/mocks/data/users';
import { Event, EventCategory, User } from '@/types';

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
    image: string; // In a real app, this would be a file upload
};

export default function CreateEventPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    // Form setup with react-hook-form
    const { register, handleSubmit, control, watch, formState: { errors } } = useForm<EventFormData>({
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
        }, 500);

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

        // In a real app, we would send this to the API and handle blockchain operations
        console.log('Form submitted:', data);

        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/success?type=event');
        }, 2000);
    };

    // Move to next step if validation passes
    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
    };

    // Move to previous step
    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-rovify-black/70 border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {!isLoading && currentUser && (
                        <div className="flex items-center gap-2">
                            <Link href="/profile" className="h-8 w-8 rounded-full overflow-hidden">
                                <Image
                                    src={currentUser.image}
                                    alt={currentUser.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 mb-16">
                <h1 className="text-3xl font-bold mb-2">Create Event</h1>
                <p className="text-white/70 mb-6">Share your experience with the world</p>

                {/* Form Progress */}
                <div className="mb-8">
                    <div className="flex items-center mb-2">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= step
                                    ? 'bg-gradient-to-r from-rovify-orange to-rovify-lavender'
                                    : 'bg-white/10'
                                    }`}>
                                    {currentStep > step ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <span className="text-white">{step}</span>
                                    )}
                                </div>
                                {step < 3 && (
                                    <div className={`w-16 h-1 ${currentStep > step ? 'bg-gradient-to-r from-rovify-orange to-rovify-lavender' : 'bg-white/10'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-sm text-white/70">
                        <span>Event Details</span>
                        <span>Location & Time</span>
                        <span>Tickets & Publish</span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Step 1: Event Details */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            {/* Event Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Event Title*
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    placeholder="Give your event a catchy title"
                                    className={`w-full bg-white/10 border ${errors.title ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("title", { required: 'Title is required' })}
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                            </div>

                            {/* Event Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">
                                    Event Description*
                                </label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    placeholder="Describe what makes your event special"
                                    className={`w-full bg-white/10 border ${errors.description ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("description", { required: 'Description is required', minLength: { value: 20, message: 'Description should be at least 20 characters' } })}
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            {/* Category and Subcategory */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                                        Category*
                                    </label>
                                    <select
                                        id="category"
                                        className={`w-full bg-white/10 border ${errors.category ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
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
                                    <label htmlFor="subcategory" className="block text-sm font-medium mb-1">
                                        Subcategory
                                    </label>
                                    <input
                                        type="text"
                                        id="subcategory"
                                        placeholder="E.g., Electronic, Workshop, Exhibition"
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                                        {...register("subcategory")}
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium mb-1">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="tags"
                                    placeholder="E.g., music, nightlife, art"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                                    {...register("tags")}
                                />
                                <p className="text-white/50 text-xs mt-1">Help people discover your event with relevant tags</p>
                            </div>

                            {/* Event Image */}
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium mb-1">
                                    Event Image URL*
                                </label>
                                <input
                                    type="text"
                                    id="image"
                                    placeholder="https://example.com/my-event-image.jpg"
                                    className={`w-full bg-white/10 border ${errors.image ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("image", { required: 'Image URL is required' })}
                                />
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

                                {/* In a real app, there would be an actual image upload component here */}
                                <p className="text-white/50 text-xs mt-1">
                                    In the final app, this would be an image upload. For now, use a URL.
                                </p>

                                {/* Image Preview */}
                                {previewImage && (
                                    <div className="mt-2 relative h-48 rounded-lg overflow-hidden">
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
                                className={`w-full py-3 rounded-lg font-medium ${watchTitle && watchCategory
                                    ? 'bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90'
                                    : 'bg-white/20 cursor-not-allowed'
                                    } transition-all`}
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
                                <label htmlFor="locationName" className="block text-sm font-medium mb-1">
                                    Venue/Location Name*
                                </label>
                                <input
                                    type="text"
                                    id="locationName"
                                    placeholder="Where is your event happening?"
                                    className={`w-full bg-white/10 border ${errors.locationName ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("locationName", { required: 'Venue name is required' })}
                                />
                                {errors.locationName && <p className="text-red-500 text-sm mt-1">{errors.locationName.message}</p>}
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="locationAddress" className="block text-sm font-medium mb-1">
                                    Address*
                                </label>
                                <input
                                    type="text"
                                    id="locationAddress"
                                    placeholder="Street address"
                                    className={`w-full bg-white/10 border ${errors.locationAddress ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("locationAddress", { required: 'Address is required' })}
                                />
                                {errors.locationAddress && <p className="text-red-500 text-sm mt-1">{errors.locationAddress.message}</p>}
                            </div>

                            {/* City */}
                            <div>
                                <label htmlFor="locationCity" className="block text-sm font-medium mb-1">
                                    City*
                                </label>
                                <input
                                    type="text"
                                    id="locationCity"
                                    placeholder="City where the event is located"
                                    className={`w-full bg-white/10 border ${errors.locationCity ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("locationCity", { required: 'City is required' })}
                                />
                                {errors.locationCity && <p className="text-red-500 text-sm mt-1">{errors.locationCity.message}</p>}
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                                        Start Date*
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        className={`w-full bg-white/10 border ${errors.date ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                        {...register("date", { required: 'Start date is required' })}
                                    />
                                    {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium mb-1">
                                        Start Time*
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        className={`w-full bg-white/10 border ${errors.time ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                        {...register("time", { required: 'Start time is required' })}
                                    />
                                    {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
                                </div>
                            </div>

                            {/* End Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                                        End Date*
                                    </label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        className={`w-full bg-white/10 border ${errors.endDate ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                        {...register("endDate", { required: 'End date is required' })}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                                        End Time*
                                    </label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        className={`w-full bg-white/10 border ${errors.endTime ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
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
                                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={!watchDate}
                                    className={`flex-1 py-3 rounded-lg font-medium ${watchDate
                                        ? 'bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90'
                                        : 'bg-white/20 cursor-not-allowed'
                                        } transition-all`}
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
                                    <label htmlFor="minPrice" className="block text-sm font-medium mb-1">
                                        Minimum Price*
                                    </label>
                                    <input
                                        type="number"
                                        id="minPrice"
                                        placeholder="0"
                                        min={0}
                                        className={`w-full bg-white/10 border ${errors.minPrice ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                        {...register("minPrice", {
                                            required: 'Min price is required',
                                            min: { value: 0, message: 'Price cannot be negative' },
                                            valueAsNumber: true
                                        })}
                                    />
                                    {errors.minPrice && <p className="text-red-500 text-sm mt-1">{errors.minPrice.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">
                                        Maximum Price*
                                    </label>
                                    <input
                                        type="number"
                                        id="maxPrice"
                                        placeholder="100"
                                        min={0}
                                        className={`w-full bg-white/10 border ${errors.maxPrice ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                        {...register("maxPrice", {
                                            required: 'Max price is required',
                                            min: { value: 0, message: 'Price cannot be negative' },
                                            valueAsNumber: true
                                        })}
                                    />
                                    {errors.maxPrice && <p className="text-red-500 text-sm mt-1">{errors.maxPrice.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium mb-1">
                                        Currency*
                                    </label>
                                    <select
                                        id="currency"
                                        className={`w-full bg-white/10 border ${errors.currency ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
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
                                <label htmlFor="totalTickets" className="block text-sm font-medium mb-1">
                                    Total Available Tickets*
                                </label>
                                <input
                                    type="number"
                                    id="totalTickets"
                                    placeholder="100"
                                    min={1}
                                    className={`w-full bg-white/10 border ${errors.totalTickets ? 'border-red-500' : 'border-white/20'} rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender`}
                                    {...register("totalTickets", {
                                        required: 'Total tickets is required',
                                        min: { value: 1, message: 'Must have at least 1 ticket' },
                                        valueAsNumber: true
                                    })}
                                />
                                {errors.totalTickets && <p className="text-red-500 text-sm mt-1">{errors.totalTickets.message}</p>}
                            </div>

                            {/* NFT Tickets Option */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="flex items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rovify-orange" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                            </svg>
                                            NFT Tickets
                                        </h3>
                                        <p className="text-white/70 text-sm">
                                            Create blockchain-based tickets that can be collected, traded, and verified on-chain.
                                        </p>
                                        <ul className="mt-2 space-y-1 text-sm text-white/80">
                                            <li className="flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-lavender" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Collectable digital memorabilia
                                            </li>
                                            <li className="flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-lavender" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Resellable on secondary marketplaces
                                            </li>
                                            <li className="flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-lavender" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Enhanced anti-fraud protection
                                            </li>
                                            <li className="flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-lavender" viewBox="0 0 20 20" fill="currentColor">
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
                                            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rovify-lavender rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rovify-orange peer-checked:to-rovify-lavender"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Event Preview */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <h3 className="font-semibold text-lg mb-4">Event Preview</h3>
                                <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={previewImage || 'https://via.placeholder.com/600x400/77A8FF/FFFFFF?text=Event+Image'}
                                        alt="Event preview"
                                        fill
                                        className="object-cover"
                                    />
                                    {watchHasNft && (
                                        <div className="absolute top-3 right-3 bg-rovify-orange text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                            </svg>
                                            NFT
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-semibold text-lg">{watchTitle || 'Event Title'}</h4>
                                <p className="text-white/70 text-sm mt-1">
                                    {watchCategory ? watchCategory.charAt(0) + watchCategory.slice(1).toLowerCase() : 'Category'} • {watchDate || 'Date'}
                                </p>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 rounded-lg font-medium transition-opacity flex items-center justify-center"
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
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-rovify-black/90 backdrop-blur-md border-t border-white/10 py-2 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-around items-center">
                        <Link href="/" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs">Home</span>
                        </Link>

                        <Link href="/discover" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="text-xs">Map</span>
                        </Link>

                        <Link href="/create" className="relative">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rovify-orange to-rovify-lavender blur-md opacity-80"></div>
                            <div className="relative h-12 w-12 rounded-full bg-gradient-to-r from-rovify-orange to-rovify-lavender flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/tickets" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-xs">Tickets</span>
                        </Link>

                        <Link href="/profile" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs">Profile</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}