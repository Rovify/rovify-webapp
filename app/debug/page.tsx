import { DebugContracts } from "./_components/DebugContracts";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Debug Contracts",
  description: "Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way",
});

const Debug: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#FF5722] flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">🔧</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Debug Smart Contracts</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Interact with and debug your deployed smart contracts with our intuitive interface.
              <br />
              <span className="text-sm text-gray-500 mt-2 block">
                Implementation details in{" "}
                <code className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded border">
                  app / debug / page.tsx
                </code>
              </span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DebugContracts />
      </div>
    </div>
  );
};

export default Debug;
