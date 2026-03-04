import React, { useEffect, useState } from 'react'
import { fetchJammingTree } from '../services/AdroneServices';
import { useSearchParams } from 'react-router-dom';

const ModalDetail = () => {

  const [jammingTreeData, setJammingTreeData] = useState(null);

  const [searchParams] = useSearchParams();
  const nodeId = searchParams.get("nodeId");

  const splitNodeId = nodeId.split("_");        // ["AOI", "2", "Weapon", "1", "0"]
  const jammingId = splitNodeId[splitNodeId.length - 2];  // "1"

  // fetch jamming tree data
  const loadJamming = async () => {
    try {
      const data = await fetchJammingTree(jammingId);
      if (data.statusCode === 200) {
        setJammingTreeData(data.payload);
      } else {
        console.warn("Invalid jamming API response:", data);
      }
    } catch (error) {
      console.error("Error loading jamming data:", error);
    }
  };

  // Fetch emitters data once
  useEffect(() => {
    loadJamming();
  }, [nodeId]);

  return (
    jammingTreeData ? (
      <div className="min-h-screen bg-[#414141] text-gray-200">
        <div className="px-10 pt-10 pb-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">Jamming</h1>
              <p>View the system recommended Jamming Response here. You can modify the response during mission creation.</p>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <p className="text-sm">
                LAST EDITED <span className=" font-medium text-white text-base">23 Jul'24 23:09</span>
              </p>
            </div>
          </div>

          <hr className=' mt-5 border-zinc-500' />

          {/* Display Jamming data */}
           <div className="w-full mt-10">
            <h2 className="text-lg font-semibold mb-4">Deception Jamming</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm max-w-4xl">
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Technique</p>
                <div className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.techniqueName}</div>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Select</p>
                <p className='py-2 rounded text-gray-200 text-base'>Pull In</p>  {/* Static value: Data not come from payload */}
              </div>
              <div className=' max-lg:hidden'>
                <p className="uppercase block text-sm text-white/70 font-mono"></p>
                <p className='py-2 rounded text-gray-200 text-base'></p> 
              </div>

              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Max Velocity</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.maxVelocity} M/S</p>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Min Velocity</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.minVelocity} M/S</p>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Rate of Change of Velocity</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.rateOfChangeOfVelocity} m/s<sup>2</sup></p>
              </div>

              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Max Range</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.maxRange} Km</p>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Min Range</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.minRange} Km</p>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Rate of Change of Range</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.rateOfChangeOfRange} Km/S</p>
              </div>

              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Hold Time</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.holdTime} s</p>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Stop Time</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.stopTime} s</p>
              </div>
              <div>
                <p className="uppercase block text-sm text-white/70 font-mono">Walk Time</p>
                <p className='py-2 rounded text-gray-200 text-base'>{jammingTreeData.walkTime} s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen bg-[#414141] text-white p-6">
        <p>Loading Jamming data...</p>
      </div>
    )
  )
}

export default ModalDetail