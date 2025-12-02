'use client';

import { useEffect, useRef } from 'react';

const ASCII_ART = `
  ____              _             _
 |  _ \\  __ ___   _(_) __ _ _ __ (_)
 | | | |/ _\` \\ \\ / / |/ _\` | '_ \\| |
 | |_| | (_| |\\ V /| | (_| | | | | |
 |____/ \\__,_| \\_/ |_|\\__,_|_| |_|_|

`;

const MESSAGES = {
  fr: {
    welcome: "Bienvenue dans la console !",
    curious: "Ah, un développeur curieux... J'aime ça !",
    hint: "Psst... essayez le Konami Code sur n'importe quelle page.",
    hiring: "Intéressé par mon profil ? → hello@daviani.dev",
  },
  en: {
    welcome: "Welcome to the console!",
    curious: "Ah, a curious developer... I like that!",
    hint: "Psst... try the Konami Code on any page.",
    hiring: "Interested in my profile? → hello@daviani.dev",
  },
};

interface UseConsoleMessageOptions {
  enabled?: boolean;
}

export function useConsoleMessage({ enabled = true }: UseConsoleMessageOptions = {}) {
  const hasLogged = useRef(false);

  useEffect(() => {
    if (!enabled || hasLogged.current || typeof window === 'undefined') return;

    hasLogged.current = true;

    // Detect browser language
    const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';
    const msg = MESSAGES[lang];

    // ASCII Art in Nord blue
    console.log(
      '%c' + ASCII_ART,
      'color: #5E81AC; font-family: monospace; font-size: 10px;'
    );

    // Welcome message
    console.log(
      '%c' + msg.welcome,
      'color: #A3BE8C; font-size: 16px; font-weight: bold;'
    );

    // Curious message
    console.log('%c' + msg.curious, 'color: #EBCB8B; font-size: 12px;');

    // Hint
    console.log(
      '%c' + msg.hint,
      'color: #88C0D0; font-size: 12px; font-style: italic;'
    );

    // Divider
    console.log(
      '%c' + '─'.repeat(50),
      'color: #4C566A;'
    );

    // Hiring message
    console.log(
      '%c' + msg.hiring,
      'color: #B48EAD; font-size: 14px; font-weight: bold;'
    );

    // Another divider
    console.log(
      '%c' + '─'.repeat(50),
      'color: #4C566A;'
    );
  }, [enabled]);
}