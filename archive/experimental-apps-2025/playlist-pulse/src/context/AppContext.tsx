'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface AppState {
  uploadedFile: File | null;
  uploadProgress: number;
  isUploading: boolean;
  uploadComplete: boolean;
  showResults: boolean;
  curators: Curator[];
  pitchSettings: PitchSettings;
  generatedPitch: string;
  currentStep: 'upload' | 'customize' | 'results';
}

interface Curator {
  id: string;
  name: string;
  playlistName: string;
  genre: string;
  email: string;
  followers: string;
  compatibility: number;
  pitch: string;
  social: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    spotify?: string;
  };
}

interface PitchSettings {
  professionalism: number[];
  enthusiasm: number[];
  creativity: number[];
  urgency: number[];
  personalTouch: number[];
  dataFocus: number[];
}

type AppAction =
  | { type: 'SET_UPLOADED_FILE'; payload: File | null }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'SET_IS_UPLOADING'; payload: boolean }
  | { type: 'SET_UPLOAD_COMPLETE'; payload: boolean }
  | { type: 'SET_SHOW_RESULTS'; payload: boolean }
  | { type: 'SET_CURATORS'; payload: Curator[] }
  | { type: 'UPDATE_PITCH_SETTINGS'; payload: Partial<PitchSettings> }
  | { type: 'SET_GENERATED_PITCH'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: 'upload' | 'customize' | 'results' };

const sampleCurators: Curator[] = [
  {
    id: '1',
    name: 'Alex Chen',
    playlistName: 'Dreamy Afternoons',
    genre: 'Indie Pop',
    email: 'alex@indievibes.com',
    followers: '125K',
    compatibility: 94,
    pitch:
      'Hi Alex! Your indie pop playlist "Dreamy Afternoons" perfectly captures the ethereal sound I create. My latest track combines dreamy vocals with indie sensibilities that would resonate with your 125K followers who love discovering fresh indie gems.',
    social: {
      instagram: '@alexindievibes',
      twitter: '@alexchen_music',
      youtube: 'AlexIndieVibes',
    },
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    playlistName: 'Electronic Pulse',
    genre: 'Electronic',
    email: 'sarah@electrobeats.co',
    followers: '89K',
    compatibility: 87,
    pitch:
      'Hey Sarah! I\'ve been following your "Electronic Pulse" playlist and love how you showcase emerging electronic artists. My new track features the kind of innovative production and melodic hooks that your audience craves.',
    social: {
      instagram: '@sarahelectro',
      twitter: '@electrobeats_sm',
      youtube: 'ElectroBeatsOfficial',
    },
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    playlistName: 'Urban Flow',
    genre: 'Hip Hop',
    email: 'marcus@urbanflow.net',
    followers: '203K',
    compatibility: 91,
    pitch:
      'What\'s good Marcus! Your "Urban Flow" playlist is fire and I know my track would fit perfectly. The production quality and lyrical content align with the high standards you maintain for your 203K followers.',
    social: {
      instagram: '@marcusurbanflow',
      twitter: '@mjohnson_hiphop',
      youtube: 'UrbanFlowMusic',
    },
  },
  {
    id: '4',
    name: 'Emma Thompson',
    playlistName: 'Rock Revival',
    genre: 'Alternative Rock',
    email: 'emma@rockrevival.com',
    followers: '156K',
    compatibility: 89,
    pitch:
      'Hi Emma! Your "Rock Revival" playlist showcases exactly the kind of alternative sound I create. My latest track has the raw energy and authentic feel that your community of 156K rock enthusiasts would absolutely love.',
    social: {
      instagram: '@emmarockrevival',
      twitter: '@emma_altrock',
      youtube: 'RockRevivalPlaylist',
    },
  },
  {
    id: '5',
    name: 'David Kim',
    playlistName: 'Chill Study Beats',
    genre: 'Lo-Fi Hip Hop',
    email: 'david@chillbeats.io',
    followers: '78K',
    compatibility: 85,
    pitch:
      'Hey David! Your "Chill Study Beats" playlist is my go-to for focus music. My new lo-fi track has those perfect study vibes with subtle jazz influences that would complement your carefully curated collection.',
    social: {
      instagram: '@davidchillbeats',
      twitter: '@lofi_david',
      youtube: 'ChillBeatsStudy',
    },
  },
  {
    id: '6',
    name: 'Lisa Rodriguez',
    playlistName: 'Soulful Nights',
    genre: 'R&B/Soul',
    email: 'lisa@soulfulvibes.com',
    followers: '134K',
    compatibility: 92,
    pitch:
      'Hi Lisa! Your "Soulful Nights" playlist captures the essence of modern R&B beautifully. My track combines classic soul elements with contemporary production that would resonate perfectly with your sophisticated audience.',
    social: {
      instagram: '@lisasoulfulvibes',
      twitter: '@lisa_rnb',
      youtube: 'SoulfulVibesMusic',
    },
  },
];

const initialState: AppState = {
  uploadedFile: null,
  uploadProgress: 0,
  isUploading: false,
  uploadComplete: false,
  showResults: false,
  curators: sampleCurators,
  pitchSettings: {
    professionalism: [75],
    enthusiasm: [60],
    creativity: [80],
    urgency: [40],
    personalTouch: [55],
    dataFocus: [65],
  },
  generatedPitch: '',
  currentStep: 'upload',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_UPLOADED_FILE':
      return { ...state, uploadedFile: action.payload, currentStep: 'customize' };
    case 'SET_UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    case 'SET_IS_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_UPLOAD_COMPLETE':
      return { ...state, uploadComplete: action.payload };
    case 'SET_SHOW_RESULTS':
      return {
        ...state,
        showResults: action.payload,
        currentStep: action.payload ? 'results' : state.currentStep,
      };
    case 'SET_CURATORS':
      return { ...state, curators: action.payload };
    case 'UPDATE_PITCH_SETTINGS':
      return { ...state, pitchSettings: { ...state.pitchSettings, ...action.payload } };
    case 'SET_GENERATED_PITCH':
      return { ...state, generatedPitch: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export type { Curator, PitchSettings };
