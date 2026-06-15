import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CravingEntry, MoodLog, RecoveryEvent } from '@/types';
import { authService } from '@/services/authService';

type AppContextType = {
  latestMoodLog: MoodLog | null;
  saveMoodLog: (log: MoodLog) => void;

  latestCravingEntry: CravingEntry | null;
  saveCravingEntry: (entry: CravingEntry) => void;

  latestRecoveryEvent: RecoveryEvent | null;
  recoveryEvents: RecoveryEvent[];
  saveRecoveryEvent: (event: RecoveryEvent) => void;

  finishCalibration: (data: any) => void;
  completeOnboarding: (data: any) => void;

  journals: any[];
  addJournal: (entry: any) => void;

  isLoggedIn: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  
  // Hardware Sync
  hardwareState: {
    connected: boolean;
    deviceName: string | null;
    batteryLevel: number | null;
    liveHeartRate: number | null;
    bodyTemp: number | null;
    stressLevel: number | null;
    spo2: number | null;
    lastSync: string | null;
  };
  connectHardware: (deviceName: string) => void;
  disconnectHardware: () => void;
  updateReading: (reading: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [latestMoodLog, setLatestMoodLog] = useState<MoodLog | null>(null);
  const [latestCravingEntry, setLatestCravingEntry] = useState<CravingEntry | null>(null);
  const [recoveryEvents, setRecoveryEvents] = useState<RecoveryEvent[]>([]);
  const [journals, setJournals] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hardwareState, setHardwareState] = useState({
    connected: false,
    deviceName: null as string | null,
    batteryLevel: null as number | null,
    liveHeartRate: null as number | null,
    bodyTemp: null as number | null,
    stressLevel: null as number | null,
    spo2: null as number | null,
    lastSync: null as string | null,
  });

  // Initialize auth service on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await authService.initialize();
        const tokens = authService.getTokens();
        if (tokens) {
          setIsLoggedIn(true);
          // Fetch user profile if needed
          setUser({ email: 'user@example.com' }); // Update with real user data
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  const connectHardware = (deviceName: string) => {
    // Mock connection
    setHardwareState({
      connected: true,
      deviceName,
      batteryLevel: 85,
      liveHeartRate: 72,
      bodyTemp: 36.6,
      stressLevel: 24,
      spo2: 98,
      lastSync: new Date().toISOString(),
    });
  };

  const disconnectHardware = () => {
    setHardwareState({
      connected: false,
      deviceName: null,
      batteryLevel: null,
      liveHeartRate: null,
      bodyTemp: null,
      stressLevel: null,
      spo2: null,
      lastSync: null,
    });
  };

  const updateReading = (reading: number) => {
    setHardwareState((prev) => ({
      ...prev,
      liveHeartRate: reading,
      lastSync: new Date().toISOString(),
    }));
  };

  const saveMoodLog = (log: MoodLog) => {
    setLatestMoodLog(log);
  };

  const saveCravingEntry = (entry: CravingEntry) => {
    setLatestCravingEntry(entry);
  };

  const saveRecoveryEvent = (event: RecoveryEvent) => {
    setRecoveryEvents((prev) => [event, ...prev]);
  };

  const finishCalibration = (data: any) => {
    console.log('finishCalibration', data);
  };

  const completeOnboarding = (data: any) => {
    finishCalibration(data);
  };

  const addJournal = (entry: any) => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      ...entry,
    };
    setJournals((prev) => [newEntry, ...(prev ?? [])]);
  };

  const login = async (email: string, password: string) => {
    try {
      setAuthError(null);
      await authService.login(email, password);
      setIsLoggedIn(true);
      setUser({ email });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setAuthError(message);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setAuthError(null);
      await authService.signup(email, password, name);
      setIsLoggedIn(true);
      setUser({ email, name });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      setAuthError(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setAuthError(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const value = useMemo(
    () => ({
      latestMoodLog,
      saveMoodLog,
      latestCravingEntry,
      saveCravingEntry,
      latestRecoveryEvent: recoveryEvents[0] ?? null,
      recoveryEvents,
      saveRecoveryEvent,
      finishCalibration,
      completeOnboarding,
      journals: journals ?? [],
      addJournal,
      isLoggedIn,
      user,
      login,
      logout,
      signup,
      authError,
      clearAuthError,
      hardwareState,
      connectHardware,
      disconnectHardware,
      updateReading,
    }),
    [latestMoodLog, latestCravingEntry, recoveryEvents, journals, isLoggedIn, user, hardwareState, authError]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
}
