"use client";

import { useEffect, useMemo } from "react";
import { useSessionStorage } from "usehooks-ts";
import { BarsArrowUpIcon } from "@heroicons/react/20/solid";
import { ContractUI } from "~~/app/debug/_components/contract";
import { ContractName, GenericContract } from "~~/utils/scaffold-eth/contract";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";

const selectedContractStorageKey = "scaffoldEth2.selectedContract";

export function DebugContracts() {
  const contractsData = useAllContracts();
  const contractNames = useMemo(
    () =>
      Object.keys(contractsData).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
      }) as ContractName[],
    [contractsData],
  );

  const [selectedContract, setSelectedContract] = useSessionStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false },
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [contractNames, selectedContract, setSelectedContract]);

  return (
    <div className="flex flex-col gap-y-6">
      {contractNames.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-10 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Contracts Found</h2>
            <p className="text-gray-500 text-sm">Deploy some contracts to see them here!</p>
          </div>
        </div>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className="flex flex-row gap-3 w-full pb-4 flex-wrap justify-center">
              {contractNames.map(contractName => (
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    contractName === selectedContract
                      ? "bg-[#FF5722] text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                  key={contractName}
                  onClick={() => setSelectedContract(contractName)}
                >
                  <span className="flex items-center gap-2">
                    {contractName}
                    {(contractsData[contractName] as GenericContract)?.external && (
                      <span 
                        className="tooltip tooltip-top" 
                        data-tip="External contract"
                      >
                        <BarsArrowUpIcon className="h-3 w-3" />
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          )}
          <div className="w-full">
            {contractNames.map(contractName => (
              <ContractUI
                key={contractName}
                contractName={contractName}
                className={contractName === selectedContract ? "" : "hidden"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
