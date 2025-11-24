/**
 * ExportToolbar - Export options toolbar
 */

import React from 'react';
import { CISButton } from './CISButton';

export interface ExportToolbarProps {
  onExportJPG?: () => void;
  onExportPDF?: () => void;
  onExportBundle?: () => void;
  disabled?: boolean;
}

export const ExportToolbar: React.FC<ExportToolbarProps> = ({
  onExportJPG,
  onExportPDF,
  onExportBundle,
  disabled = false,
}) => {
  return (
    <div className="flex gap-2">
      {onExportJPG && (
        <CISButton onClick={onExportJPG} disabled={disabled} size="sm">
          Export JPG
        </CISButton>
      )}
      {onExportPDF && (
        <CISButton onClick={onExportPDF} disabled={disabled} size="sm" variant="secondary">
          Export PDF
        </CISButton>
      )}
      {onExportBundle && (
        <CISButton onClick={onExportBundle} disabled={disabled} size="sm" variant="secondary">
          Export Bundle
        </CISButton>
      )}
    </div>
  );
};
