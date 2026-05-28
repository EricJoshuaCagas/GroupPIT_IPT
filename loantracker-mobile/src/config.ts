import Constants from 'expo-constants';

const FALLBACK_LAN_IP = '192.168.1.7';
const API_PORT = '8000';
const API_PATH = '/api';

type ExpoConstantsWithLegacyManifest = typeof Constants & {
  manifest2?: {
    extra?: {
      expoGo?: {
        debuggerHost?: string;
      };
    };
  };
  manifest?: {
    debuggerHost?: string;
  };
};

const getExpoDevHost = (): string | null => {
  const constants = Constants as ExpoConstantsWithLegacyManifest;
  const hostUri =
    Constants.expoConfig?.hostUri ??
    constants.manifest2?.extra?.expoGo?.debuggerHost ??
    constants.manifest?.debuggerHost;

  if (!hostUri) {
    return null;
  }

  const [host] = hostUri.split(':');
  return host || null;
};

const normalizeBaseUrl = (rawUrl: string): string => {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const withProtocol = hasProtocol ? trimmed : `http://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (!parsed.pathname || parsed.pathname === '/') {
      parsed.pathname = API_PATH;
    }
    return parsed.toString().replace(/\/+$/, '');
  } catch {
    return withProtocol;
  }
};

const buildDefaultApiBaseUrl = (): string => {
  const host = getExpoDevHost() ?? FALLBACK_LAN_IP;
  return `http://${host}:${API_PORT}${API_PATH}`;
};

const envApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL = normalizeBaseUrl(envApiBaseUrl || buildDefaultApiBaseUrl());
