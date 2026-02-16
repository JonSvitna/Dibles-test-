'use client';

import { useState, useEffect } from 'react';
import type { Program, ColumnMapping, MappingProfile } from '@/lib/types';
import { getRequiredFields } from '@/lib/programConfig';
import { getMappingProfilesByProgram, saveMappingProfile } from '@/lib/mappingProfiles';
import Button from './Button';
import Card from './Card';

interface MappingProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program;
  headers: string[];
  currentMapping: ColumnMapping;
  onApplyMapping: (mapping: ColumnMapping) => void;
  onSaveProfile: (name: string, mapping: ColumnMapping) => void;
}

export default function MappingProfileModal({
  isOpen,
  onClose,
  program,
  headers,
  currentMapping,
  onApplyMapping,
  onSaveProfile,
}: MappingProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'profiles'>('map');
  const [mapping, setMapping] = useState<ColumnMapping>(currentMapping);
  const [profileName, setProfileName] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<MappingProfile[]>([]);

  const requiredFields = getRequiredFields(program);
  const optionalFields = program === 'MAP_R' 
    ? ['term'] 
    : ['season', 'organization_purpose', 'evidence_elaboration', 'conventions'];

  useEffect(() => {
    setMapping(currentMapping);
  }, [currentMapping]);

  useEffect(() => {
    if (isOpen) {
      setSavedProfiles(getMappingProfilesByProgram(program));
    }
  }, [isOpen, program]);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, column: string) => {
    setMapping((prev) => ({
      ...prev,
      [field]: column,
    }));
  };

  const handleApply = () => {
    onApplyMapping(mapping);
    onClose();
  };

  const handleSave = () => {
    if (!profileName.trim()) {
      alert('Please enter a profile name');
      return;
    }
    
    onSaveProfile(profileName.trim(), mapping);
    setSavedProfiles(getMappingProfilesByProgram(program));
    setProfileName('');
    alert('Mapping profile saved!');
  };

  const handleLoadProfile = (profile: MappingProfile) => {
    setMapping(profile.mapping);
    onApplyMapping(profile.mapping);
    onClose();
  };

  const allFieldsMapped = requiredFields.every((field) => mapping[field]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Column Mapping</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Match your file columns to the required fields
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'map'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Map Columns
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'profiles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Saved Profiles
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'map' ? (
            <div className="space-y-6">
              {/* Required Fields */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Required Fields <span className="text-red-600">*</span>
                </h3>
                <div className="space-y-3">
                  {requiredFields.map((field) => (
                    <div key={field} className="grid grid-cols-2 gap-4 items-center">
                      <label className="text-sm font-medium text-gray-700">
                        {field.replace(/_/g, ' ').toUpperCase()}
                      </label>
                      <select
                        value={mapping[field] || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- Select Column --</option>
                        {headers.map((header) => (
                          <option key={header} value={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              {optionalFields.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Optional Fields</h3>
                  <div className="space-y-3">
                    {optionalFields.map((field) => (
                      <div key={field} className="grid grid-cols-2 gap-4 items-center">
                        <label className="text-sm font-medium text-gray-700">
                          {field.replace(/_/g, ' ').toUpperCase()}
                        </label>
                        <select
                          value={mapping[field] || ''}
                          onChange={(e) => handleFieldChange(field, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Select Column --</option>
                          {headers.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Profile Section */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h4 className="font-medium text-gray-900 mb-2">Save This Mapping</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Save this column mapping for future imports
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Profile name (e.g., 'District Export')"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleSave} variant="outline" size="sm">
                    Save
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProfiles.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">No saved profiles yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create a profile in the "Map Columns" tab
                  </p>
                </Card>
              ) : (
                savedProfiles.map((profile) => (
                  <Card key={profile.name} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{profile.name}</h4>
                        <p className="text-sm text-gray-500">
                          Created {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button onClick={() => handleLoadProfile(profile)} size="sm">
                        Use This Profile
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div>
            {!allFieldsMapped && activeTab === 'map' && (
              <p className="text-sm text-red-600">
                ⚠️ Please map all required fields before applying
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            {activeTab === 'map' && (
              <Button onClick={handleApply} disabled={!allFieldsMapped}>
                Apply Mapping
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
