/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiArrowRight } from 'react-icons/fi';
import RoviLogo from '@/public/images/contents/rovi-logo.png';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTargetNetwork } from "../hooks/scaffold-eth/useTargetNetwork";
import { useNetworkColor } from "../hooks/scaffold-eth/useNetworkColor";
import { getBlockExplorerAddressLink, getTargetNetworks } from "../utils/scaffold-eth";
import { Address } from "viem";
import { Balance } from "./scaffold-eth/Balance";
import { BlockieAvatar } from "./scaffold-eth/BlockieAvatar";
import { AddressInfoDropdown } from "./scaffold-eth/RainbowKitCustomConnectButton/AddressInfoDropdown";
import { WrongNetworkDropdown } from "./scaffold-eth/RainbowKitCustomConnectButton/WrongNetworkDropdown";
import { NetworkOptions } from "./scaffold-eth/RainbowKitCustomConnectButton/NetworkOptions";
import { ChevronDownIcon, DocumentDuplicateIcon, CheckCircleIcon, ArrowsRightLeftIcon, ArrowLeftOnRectangleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useOutsideClick } from "../hooks/scaffold-eth/useOutsideClick";
import { useCopyToClipboard } from "../hooks/scaffold-eth/useCopyToClipboard";
import { useDisconnect } from "wagmi";
import { getAddress } from "viem";

// Custom Dropdown Component for Wallet Info
const CustomWalletDropdown = ({ 
    address, 
    displayName, 
    ensAvatar, 
    blockExplorerAddressLink 
}: {
    address: Address;
    displayName: string;
    ensAvatar?: string;
    blockExplorerAddressLink?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectingNetwork, setSelectingNetwork] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { copyToClipboard, isCopiedToClipboard } = useCopyToClipboard();
    const { disconnect } = useDisconnect();
    const allowedNetworks = getTargetNetworks();
    const checkSumAddress = getAddress(address);

    useOutsideClick(dropdownRef, () => {
        setIsOpen(false);
        setSelectingNetwork(false);
    });

    const handleCopyAddress = () => {
        copyToClipboard(checkSumAddress);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200"
            >
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
                    <div className="space-y-1">
                        {/* Wallet Info Header */}
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <BlockieAvatar address={address} size={32} ensImage={ensAvatar} />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-700">
                                    {displayName || `${address.slice(0, 6)}...${address.slice(-4)}`}
                                </span>
                                <span className="text-xs text-gray-500">Wallet Address</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 my-2"></div>

                        {/* Network Options */}
                        {selectingNetwork ? (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
                                    <ArrowsRightLeftIcon className="h-4 w-4" />
                                    <span>Select Network</span>
                                </div>
                                <NetworkOptions hidden={false} />
                                <button
                                    onClick={() => setSelectingNetwork(false)}
                                    className="w-full text-left p-2 text-sm text-gray-500 hover:bg-gray-50 rounded"
                                >
                                    ← Back
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Copy Address */}
                                <button
                                    onClick={handleCopyAddress}
                                    className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 transition-colors duration-200"
                                >
                                    {isCopiedToClipboard ? (
                                        <>
                                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                            <span className="font-medium">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <DocumentDuplicateIcon className="h-4 w-4" />
                                            <span>Copy address</span>
                                        </>
                                    )}
                                </button>

                                {/* View on Explorer */}
                                {blockExplorerAddressLink && (
                                    <a
                                        href={blockExplorerAddressLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 transition-colors duration-200"
                                    >
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                        <span>View on Explorer</span>
                                    </a>
                                )}

                                {/* Switch Network */}
                                {allowedNetworks.length > 1 && (
                                    <button
                                        onClick={() => setSelectingNetwork(true)}
                                        className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 transition-colors duration-200"
                                    >
                                        <ArrowsRightLeftIcon className="h-4 w-4" />
                                        <span>Switch Network</span>
                                    </button>
                                )}

                                <div className="border-t border-gray-100 my-2"></div>

                                {/* Disconnect */}
                                <button
                                    onClick={() => disconnect()}
                                    className="w-full flex items-center gap-3 p-2.5 hover:bg-red-50 rounded-md text-sm text-red-600 transition-colors duration-200"
                                >
                                    <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                                    <span>Disconnect</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Custom Wallet Connect Button Component
const CustomWalletConnectButton = () => {
    const networkColor = useNetworkColor();
    const { targetNetwork } = useTargetNetwork();

    return (
        <ConnectButton.Custom>
            {({ account, chain, openConnectModal, mounted }) => {
                const connected = mounted && account && chain;
                const blockExplorerAddressLink = account
                    ? getBlockExplorerAddressLink(targetNetwork, account.address)
                    : undefined;

                return (
                    <>
                        {(() => {
                            if (!connected) {
                                return (
                                    <button 
                                        onClick={openConnectModal} 
                                        type="button"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 border border-gray-300 h-10 flex items-center"
                                    >
                                        Connect Wallet
                                    </button>
                                );
                            }

                            if (chain.unsupported || chain.id !== targetNetwork.id) {
                                return (
                                    <div className="relative wallet-connect-dropdown">
                                        <WrongNetworkDropdown />
                                    </div>
                                );
                            }

                            return (
                                <div className="relative wallet-connect-dropdown h-10">
                                    <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-full border border-gray-200 transition-colors duration-300 h-full">
                                        <div className="w-6 h-6 rounded-full overflow-hidden">
                                            <BlockieAvatar 
                                                address={account.address as Address} 
                                                size={24} 
                                                ensImage={account.ensAvatar} 
                                            />
                                        </div>
                                        <div className="flex flex-col items-start min-w-0">
                                            <span className="text-sm font-medium text-gray-700 truncate max-w-20">
                                                {account.displayName || 'Connected'}
                                            </span>
                                            <span className="text-xs text-gray-500" style={{ color: networkColor }}>
                                                {chain.name}
                                            </span>
                                        </div>
                                        <CustomWalletDropdown
                                            address={account.address as Address}
                                            displayName={account.displayName}
                                            ensAvatar={account.ensAvatar}
                                            blockExplorerAddressLink={blockExplorerAddressLink}
                                        />
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default function PublicHeader() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'py-3 bg-white shadow-sm'
                : 'py-5 bg-white'
                }`}
        >
            <div className="container mx-auto px-5 navbar-container justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <div className="h-10 w-10 rounded-full bg-[#FF5722] flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                        <Image
                            // src={RoviLogo}
                            src="/images/contents/rovi-logo.png"
                            alt="Rovify Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <span className="ml-2 text-[#FF5722] text-xl font-bold">rovify</span>
                </Link>

                {/* Wallet Connect and Get Started Buttons */}
                <div className="flex items-center gap-3 h-10">
                    <div className="relative">
                        <CustomWalletConnectButton />
                    </div>
                    <Link
                        href="/auth/register"
                        className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-2.5 rounded-full text-sm font-medium flex items-center transition-colors duration-300"
                    >
                        Get Started
                        <FiArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </header>
    );
}