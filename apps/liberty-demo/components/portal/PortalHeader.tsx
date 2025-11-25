'use client';

import React from 'react';
import { Music, LogOut } from 'lucide-react';
import type { PortalArtist } from '@/lib/api/portal';

interface PortalHeaderProps {
  artist: PortalArtist;
  currentCampaign?: string;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ artist, currentCampaign }) => {
  return (
    <header className="bg-white border-b border-[#D9D7D2] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Artist */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="liberty-metadata text-[11px] normal-case">Liberty Music PR</div>
                <div className="text-sm font-jakarta font-semibold text-[#111]">Artist Portal</div>
              </div>
            </div>

            {artist.image && (
              <div className="flex items-center gap-3 pl-6 border-l border-[#D9D7D2]">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#D9D7D2] grayscale"
                />
                <div>
                  <div className="text-sm font-jakarta font-semibold text-[#111]">
                    {artist.name}
                  </div>
                  {currentCampaign && (
                    <div className="liberty-metadata text-[11px] normal-case">
                      {currentCampaign}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#737373] hover:text-[#111] transition-colors font-jakarta">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;
