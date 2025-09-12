"use client";

// @refresh reset
import { useReducer } from "react";
import { ContractReadMethods } from "./ContractReadMethods";
import { ContractVariables } from "./ContractVariables";
import { ContractWriteMethods } from "./ContractWriteMethods";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useNetworkColor } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ContractName } from "~~/utils/scaffold-eth/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName, className = "" }: ContractUIProps) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const { targetNetwork } = useTargetNetwork();
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo({ contractName });
  const networkColor = useNetworkColor();

  if (deployedContractLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-sm mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#FF5722] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Loading Contract</h3>
            <p className="text-gray-500 text-sm text-center">Please wait while we fetch contract data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Contract Not Found</h3>
            <p className="text-gray-500 text-sm text-center">
              No contract found by the name of <span className="font-mono bg-gray-100 px-2 py-1 rounded">{contractName}</span> on chain <span className="font-semibold text-[#FF5722]">{targetNetwork.name}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Contract Info & Variables */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contract Header */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#FF5722] rounded-full"></div>
              <span className="font-bold text-xl text-gray-900">{contractName}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-gray-500 font-medium w-20 flex-shrink-0">Address:</span>
                <div className="text-xs font-mono bg-gray-50 px-2 py-1 rounded border">
                  <Address address={deployedContractData.address} onlyEnsOrAddress />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 font-medium w-20 flex-shrink-0">Balance:</span>
                <div className="text-xs">
                  <Balance address={deployedContractData.address} className="px-0 h-1.5 min-h-[0.375rem]" />
                </div>
              </div>
              {targetNetwork && (
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-medium w-20 flex-shrink-0">Network:</span>
                  <span 
                    className="text-xs font-medium px-3 py-1 rounded-full border"
                    style={{ 
                      color: networkColor,
                      backgroundColor: `${networkColor}10`,
                      borderColor: `${networkColor}30`
                    }}
                  >
                    {targetNetwork.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contract Variables */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">Contract Variables</h3>
            </div>
            <ContractVariables
              refreshDisplayVariables={refreshDisplayVariables}
              deployedContractData={deployedContractData}
            />
          </div>
        </div>

        {/* Read & Write Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Read Methods */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Read Methods</h3>
              </div>
            </div>
            <div className="p-6">
              <ContractReadMethods deployedContractData={deployedContractData} />
            </div>
          </div>

          {/* Write Methods */}
          <div className="bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/20 border-b border-[#FF5722]/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF5722] rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">✏️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Write Methods</h3>
              </div>
            </div>
            <div className="p-6">
              <ContractWriteMethods
                deployedContractData={deployedContractData}
                onChange={triggerRefreshDisplayVariables}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
