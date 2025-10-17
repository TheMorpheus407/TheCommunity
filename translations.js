/**
 * Multi-dialect German translations for PodTalk.
 * A high-German baseline is adapted into several dialect variants.
 */

const LANGUAGE_STORAGE_KEY = 'thecommunity.language-preference';

const baseTranslation = Object.freeze({
  name: 'Hochdeutsch',
  mascot: {
    ariaLabel: 'Wütendes Tux-Maskottchen, schwebe darüber, um ihn aufzuregen'
  },
  app: {
    title: 'PodTalk'
  },
  about: {
    button: 'Über',
    buttonAriaLabel: 'Über dieses Projekt',
    title: 'Über TheCommunity',
    description: 'Dies ist eine Peer-to-Peer-WebRTC-Chat-Anwendung ohne Backend. Die Community steuert alles über GitHub-Issues.',
    contributorsTitle: 'Mitwirkende',
    contributorsIntro: 'Danke an alle, die durch das Anlegen von Issues beigetragen haben:',
    loadingContributors: 'Lade Mitwirkende...',
    contributorsError: 'Mitwirkendenliste konnte nicht geladen werden. Bitte später erneut versuchen.',
    noIssues: 'Noch keine Issues. Öffne eines, um bei den Credits zu erscheinen.',
    issueCount: (count) => (count === 1 ? '1 Issue' : `${count} Issues`),
    close: 'Schließen',
    closeAriaLabel: 'Über-Dialog schließen'
  },
  signaling: {
    title: 'Manuelle Signalisierung',
    collapseAriaLabel: (collapsed) => (collapsed ? 'Signalisierung ausklappen' : 'Signalisierung einklappen'),
    securityNotice: 'Sicherheitshinweis:',
    securityWarning: 'Das Teilen von WebRTC-Signalen offenbart deine Netzwerkadressen. Teile Angebote nur mit vertrauenswürdigen Peers.',
    step1: 'Schritt 1: Eine Person klickt auf „Angebot erstellen“ und teilt das unten erscheinende Signal.',
    step2: 'Schritt 2: Die andere Person fügt es bei „Entferntes Signal“ ein, klickt auf „Remote anwenden“, dann auf „Antwort erstellen“ und teilt ihre Antwort.',
    step3: 'Schritt 3: Die erste Person fügt die Antwort bei „Entferntes Signal“ ein und wendet sie an. Der Chat startet, sobald der Status „verbunden“ anzeigt.',
    createOffer: 'Angebot erstellen',
    createAnswer: 'Antwort erstellen',
    applyRemote: 'Remote anwenden',
    disconnect: 'Trennen',
    disconnectAriaLabel: 'Verbindung zum Peer trennen',
    working: 'Arbeite...',
    localSignalLabel: 'Lokales Signal (dies teilen)',
    localSignalPlaceholder: 'Das lokale SDP erscheint hier, sobald es bereit ist.',
    remoteSignalLabel: 'Entferntes Signal (empfangenes JSON hier einfügen)',
    remoteSignalPlaceholder: 'Füge das JSON deines Peers ein. Drücke Strg+Enter (Cmd+Enter auf dem Mac) oder klicke auf Remote anwenden.',
    copyButton: 'Kopieren',
    copied: 'Kopiert!',
    copyFailed: 'Fehlgeschlagen',
    copyAriaLabel: 'Lokales Signal in die Zwischenablage kopieren'
  },
  chat: {
    title: 'Chat',
    addApiKey: 'OpenAI-Schlüssel hinzufügen',
    updateApiKey: 'OpenAI-Schlüssel aktualisieren',
    themeToggle: (isDark) => (isDark ? '🌞 Heller Modus' : '🌙 Dunkler Modus'),
    themeToggleTitle: (isDark) => (isDark ? 'Zum hellen Theme wechseln' : 'Zum dunklen Theme wechseln'),
    clear: 'Leeren',
    clearAriaLabel: 'Alle Chat-Nachrichten löschen',
    emptyState: 'Noch keine Nachrichten. Verbinde dich mit einem Peer, um zu chatten.',
    roleLabels: {
      local: 'Du',
      remote: 'Peer',
      system: 'Hinweis'
    },
    inputPlaceholder: 'Nachricht eingeben...',
    inputAriaLabel: 'Nachrichteneingabe',
    aiButton: 'Mit KI umschreiben',
    aiButtonBusy: 'Schreibe um...',
    aiButtonNoKey: 'OpenAI-Schlüssel hinzufügen, um KI zu aktivieren',
    aiButtonTitle: 'Lass OpenAI einen klareren Vorschlag für deine Nachricht machen.',
    aiButtonTitleNoKey: 'Füge deinen OpenAI-Schlüssel hinzu, um KI-Unterstützung zu aktivieren.',
    send: 'Senden',
    sendAriaLabel: 'Nachricht senden',
    sendTitle: 'Nachricht senden',
    charCount: (current, max) => `${current} / ${max}`
  },
  apiKeyModal: {
    title: 'OpenAI-Integration',
    close: 'Schließen',
    closeAriaLabel: 'API-Schlüssel-Dialog schließen',
    description: 'Gib deinen persönlichen OpenAI-API-Schlüssel ein, um optionale KI-Unterstützung zu aktivieren. Der Schlüssel bleibt nur in dieser Sitzung gespeichert und wird ausschließlich an api.openai.com gesendet.',
    label: 'OpenAI-API-Schlüssel',
    placeholder: 'sk-...',
    hint: 'Gib API-Schlüssel niemals auf nicht vertrauenswürdigen Geräten ein. Aktualisiere die Seite oder deaktiviere die KI, um den Schlüssel zu entfernen.',
    save: 'Schlüssel speichern',
    disable: 'KI deaktivieren',
    continueWithout: 'Ohne KI fortfahren'
  },
  status: {
    waiting: 'Warte auf Verbindung...',
    signalReady: 'Signal bereit zum Teilen',
    ice: (state) => `ICE: ${state}`,
    connection: (state) => `Verbindung: ${state}`,
    creatingOffer: 'Erstelle Angebot...',
    creatingAnswer: 'Erstelle Antwort...',
    remoteApplied: (type) => `Entferntes ${type} angewendet`,
    disconnected: 'Getrennt',
    channelOpen: 'Kanal offen',
    channelClosed: 'Kanal geschlossen',
    answerApplied: 'Antwort angewendet, warte auf Kanal...'
  },
  systemMessages: {
    themeSwitch: (theme) => `Theme gewechselt zu ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
    continueWithoutAi: 'Ohne KI-Unterstützung fortfahren. Du kannst später im Chatbereich einen Schlüssel hinzufügen.',
    apiKeyStored: 'OpenAI-Schlüssel nur in dieser Browsersitzung gespeichert. Aktualisiere die Seite, um ihn zu entfernen.',
    aiDisabled: 'KI-Unterstützung deaktiviert. Nachrichten werden ohne KI gesendet.',
    aiReady: 'OpenAI-Unterstützung bereit. Prüfe Vorschläge vor dem Senden.',
    securityBlocked: 'Sicherheitsnotiz: Nicht-textuelle Nachricht blockiert.',
    messageTooLong: (max) => `Nachricht blockiert: überschreitet das Limit von ${max} Zeichen.`,
    rateLimit: 'Rate-Limit aktiv: Peer sendet Nachrichten zu schnell.',
    channelBlocked: (label) => `Sicherheitsnotiz: Unerwarteten Datenkanal „${label || 'unbenannt'}“ blockiert.`,
    createOfferFailed: 'Angebot konnte nicht erstellt werden. Prüfe Browserberechtigungen und WebRTC-Unterstützung.',
    remoteEmpty: 'Entferntes Signal ist leer. Füge das erhaltene JSON ein.',
    remoteInvalidJson: 'Entferntes Signal ist kein gültiges JSON. Kopiere das vollständige Signal erneut.',
    remoteMissingData: 'Dem entfernten Signal fehlen erforderliche Daten. Stelle sicher, dass Angebot oder Antwort unverändert eingefügt wurden.',
    createAnswerFailed: 'Antwort konnte nicht erstellt werden. Wende zuerst ein gültiges Angebot an und prüfe die WebRTC-Unterstützung.',
    needOfferForAnswer: 'Zum Erstellen einer Antwort wird zuvor ein Angebot benötigt.',
    messageInputTooLong: (max, current) => `Nachricht zu lang: Limit ${max} Zeichen (aktuell ${current}).`,
    disconnectNotice: 'Verbindung getrennt. Erstelle ein neues Angebot, um erneut zu verbinden.',
    aiRewriteFailed: (error) => `KI-Umschreibung fehlgeschlagen: ${error || 'Anfrage wurde zurückgewiesen.'}`,
    aiTruncated: 'KI-Vorschlag gekürzt, um das Zeichenlimit einzuhalten.',
    aiSuggestionApplied: 'KI-Vorschlag übernommen. Prüfe vor dem Senden.',
    chatCleared: 'Chatverlauf gelöscht.',
    aiRewriteNotAttempted: (max) => `KI-Umschreibung nicht möglich: Entwürfe müssen unter ${max} Zeichen bleiben.`,
    languageChanged: (name) => `Sprache auf ${name} umgestellt.`
  },
  aiErrors: {
    emptyKey: 'Gib einen OpenAI-API-Schlüssel ein, um die KI-Umschreibung zu aktivieren.',
    unauthorized: 'OpenAI hat die Anfrage zurückgewiesen. Prüfe Schlüssel und Berechtigungen.',
    requestFailed: (status) => `OpenAI-Anfrage fehlgeschlagen (Status ${status}).`,
    missingContent: 'Antwort von OpenAI enthält keinen Text.',
    emptySuggestion: 'OpenAI hat keinen Vorschlag geliefert.'
  },
  language: {
    label: 'Sprache',
    ariaLabel: 'Sprache auswählen'
  },
  screenShare: {
    header: 'Bildschirmfreigabe',
    actions: {
      start: 'Freigabe starten',
      startAria: 'Bildschirm freigeben',
      sharing: 'Freigabe läuft...',
      stop: 'Freigabe beenden',
      stopAria: 'Bildschirmfreigabe stoppen'
    },
    includeAudio: 'Systemaudio einbeziehen',
    status: {
      sharing: 'Teilt deinen Bildschirm',
      ready: 'Bereit zur Freigabe',
      connect: 'Verbinde dich, um Bildschirmfreigabe zu aktivieren'
    },
    remote: {
      receiving: 'Empfange Bildschirm des Peers',
      idle: 'Peer teilt aktuell keinen Bildschirm',
      title: 'Bildschirm des Peers',
      ariaInteractive: 'Vorschau des Peer-Bildschirms. Fokus setzen, um zu steuern.',
      aria: 'Vorschau des Peer-Bildschirms',
      streamAria: 'Bildschirmstream des Peers',
      peerStarted: 'Peer hat die Bildschirmfreigabe gestartet.',
      peerStopped: 'Peer hat die Bildschirmfreigabe beendet.'
    },
    local: {
      title: 'Dein Bildschirm',
      aria: 'Eigene Bildschirmvorschau',
      placeholderReady: 'Starte die Freigabe, um deinen Bildschirm zu senden.',
      placeholderDisconnected: 'Verbinde dich mit einem Peer, um Bildschirmfreigabe zu aktivieren.'
    },
    messages: {
      stopped: 'Bildschirmfreigabe beendet.',
      notSupported: 'Bildschirmfreigabe wird in diesem Browser nicht unterstützt.',
      started: 'Bildschirmfreigabe aktiv. Achte auf sensible Inhalte.'
    },
    errors: {
      peerNotReady: 'Peer-Verbindung ist noch nicht bereit.',
      noVideoTrack: 'Keine Videospur aus der Bildschirmaufnahme erhalten.',
      permissionDenied: 'Berechtigung wurde verweigert.',
      failed: (reason) => `Bildschirmfreigabe fehlgeschlagen: ${reason}`
    },
    footnote: 'Bildschirmfreigabe ist rein Peer-to-Peer. Teile Zugriff nur mit Personen, denen du vertraust.'
  },
  remoteControl: {
    label: 'Fernsteuerung:',
    actions: {
      allow: 'Fernsteuerung erlauben',
      disable: 'Fernsteuerung beenden'
    },
    statusDisabled: 'Fernsteuerung deaktiviert',
    statusGranted: 'Fernsteuerung erlaubt – mit Bildschirm interagieren',
    statusDisabledByPeer: 'Fernsteuerung vom Peer beendet',
    statusChannelClosed: 'Fernsteuerungskanal geschlossen',
    statusDisabledInputLimit: 'Fernsteuerung deaktiviert (Eingabelimit erreicht)',
    statusEnabled: 'Fernsteuerung aktiv – Peer darf steuern',
    statusUnavailable: 'Fernsteuerungskanal nicht verfügbar',
    hints: {
      active: 'Fernsteuerung aktiv – bewege den Cursor hier, um zu interagieren.'
    },
    system: {
      disabledOnScreenStop: 'Fernsteuerung deaktiviert, weil die Bildschirmfreigabe beendet wurde.',
      revokeFailed: 'Peer konnte nicht über die beendete Fernsteuerung informiert werden.',
      payloadTooLarge: 'Fernsteuerungsnachricht ignoriert: Nutzlast zu groß.',
      rateLimited: 'Fernsteuerungskanal gedrosselt. Zu viele Eingaben.',
      peerEnabled: 'Peer hat die Fernsteuerung erlaubt. Nutze die Vorschau zum Interagieren.',
      peerDisabled: 'Peer hat die Fernsteuerung deaktiviert.',
      deliveryFailed: 'Fernsteuerungsnachricht konnte nicht zugestellt werden. Verbindung prüfen.',
      typingDisabled: 'Remote-Eingaben deaktiviert: Eingabelimit erreicht.',
      unavailable: 'Fernsteuerung ist erst möglich, wenn der Steuerkanal bereit ist.',
      negotiating: 'Fernsteuerungskanal verhandelt noch. Bitte kurz warten.',
      requiresScreenShare: 'Starte zuerst die Bildschirmfreigabe, um Fernsteuerung zu aktivieren.',
      updateFailed: 'Fernsteuerungsstatus konnte nicht aktualisiert werden. Bitte erneut versuchen.',
      peerCanControl: 'Dein Peer kann nun deinen Bildschirm steuern. Behalte die Aktivitäten im Blick.',
      controlRevokedLocal: 'Fernsteuerung für deinen Bildschirm wurde beendet.'
    }
  },
  imageShare: {
    selectImage: 'Bild auswählen',
    sendImage: 'Bild senden',
    sendImageTitle: 'Bild zum Senden auswählen',
    channelReady: 'Bildfreigabe bereit.',
    channelNotReady: 'Bildfreigabe noch nicht bereit. Warte auf Verbindung.',
    invalidType: 'Ungültiger Bildtyp. Nur JPEG, PNG, GIF und WebP sind erlaubt.',
    tooLarge: 'Bild ist zu groß. Maximale Größe ist 5 MB.',
    rateLimitSend: 'Zu viele Bilder gesendet. Bitte warte eine Minute.',
    rateLimitReceive: 'Zu viele Bilder empfangen. Peer sendet zu schnell.',
    tooManyConcurrent: 'Zu viele gleichzeitige Bildübertragungen.',
    sendFailed: 'Bild konnte nicht gesendet werden.',
    receiveFailed: 'Bild konnte nicht empfangen werden.',
    sentImage: (fileName) => `Bild gesendet: ${fileName}`,
    receivedImage: (fileName) => `Bild empfangen: ${fileName}`
  }
});

function applyReplacements(text, replacements) {
  return replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

function mapStrings(value, transform) {
  if (typeof value === 'string') {
    return transform(value);
  }
  if (typeof value === 'function') {
    return (...args) => transform(value(...args));
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapStrings(item, transform));
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = mapStrings(val, transform);
    }
    return result;
  }
  return value;
}

function deepMerge(target, source) {
  const output = Array.isArray(target) ? target.slice() : { ...target };
  if (!source || typeof source !== 'object') {
    return output;
  }
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      output[key] = deepMerge(output[key] || {}, value);
    } else {
      output[key] = value;
    }
  }
  return output;
}

function createDialect(config) {
  const { name, replacements = [], overrides = {} } = config;
  const transform = (text) => applyReplacements(text, replacements);
  const dialect = mapStrings(baseTranslation, transform);
  dialect.name = name;
  return Object.freeze(deepMerge(dialect, overrides));
}

const dialectConfigs = {
  bar: {
    name: 'Bayerisch',
    replacements: [
      [/\bNicht\b/g, 'Ned'],
      [/\bnicht\b/g, 'ned'],
      [/\bIch\b/g, 'I'],
      [/\bich\b/g, 'i'],
      [/\bdein\b/g, 'dei'],
      [/\bDein\b/g, 'Dei'],
      [/\bdeine\b/g, 'dei'],
      [/\bDeine\b/g, 'Dei'],
      [/\bauch\b/g, 'aa'],
      [/\bAuch\b/g, 'Aa'],
      [/\bfür\b/g, 'fia'],
      [/\bPeer\b/g, 'Spezi'],
      [/\bpeer\b/g, 'spezi']
    ],
    overrides: {
      language: {
        label: 'Sproch',
        ariaLabel: 'Sproch aussuacha'
      }
    }
  },
  swa: {
    name: 'Schwäbisch',
    replacements: [
      [/\bNicht\b/g, 'Net'],
      [/\bnicht\b/g, 'net'],
      [/\bIch\b/g, 'I'],
      [/\bich\b/g, 'i'],
      [/\bauch\b/g, 'au'],
      [/\bAuch\b/g, 'Au'],
      [/\bfür\b/g, 'für'],
      [/\bPeer\b/g, 'Kumpel'],
      [/\bpeer\b/g, 'kumpel']
    ],
    overrides: {
      language: {
        label: 'Dialect',
        ariaLabel: 'Dialect aussuacha'
      }
    }
  },
  sxu: {
    name: 'Sächsisch',
    replacements: [
      [/\bNicht\b/g, 'Ni'],
      [/\bnicht\b/g, 'ni'],
      [/\bIch\b/g, 'Isch'],
      [/\bich\b/g, 'isch'],
      [/\bauch\b/g, 'ooch'],
      [/\bAuch\b/g, 'Ooch'],
      [/\bPeer\b/g, 'Kumpel'],
      [/\bpeer\b/g, 'kumpel']
    ],
    overrides: {
      language: {
        label: 'Sproche',
        ariaLabel: 'Sproche auswähl’n'
      }
    }
  },
  ber: {
    name: 'Berlinerisch',
    replacements: [
      [/\bNicht\b/g, 'Nich'],
      [/\bnicht\b/g, 'nich'],
      [/\bIch\b/g, 'Ick'],
      [/\bich\b/g, 'ick'],
      [/\bauch\b/g, 'ooch'],
      [/\bAuch\b/g, 'Ooch'],
      [/\bPeer\b/g, 'Kumpel'],
      [/\bpeer\b/g, 'kumpel']
    ],
    overrides: {
      language: {
        label: 'Sprache',
        ariaLabel: 'Sprache aussuchen'
      }
    }
  },
  rhe: {
    name: 'Rheinisch',
    replacements: [
      [/\bNicht\b/g, 'Nit'],
      [/\bnicht\b/g, 'nit'],
      [/\bIch\b/g, 'Ich'],
      [/\bich\b/g, 'ich'],
      [/\bauch\b/g, 'och'],
      [/\bAuch\b/g, 'Och'],
      [/\bPeer\b/g, 'Kumpel'],
      [/\bpeer\b/g, 'kumpel'],
      [/\bdein\b/g, 'ding'],
      [/\bDein\b/g, 'Ding']
    ],
    overrides: {
      language: {
        label: 'Sprooch',
        ariaLabel: 'Sprooch ussöke'
      }
    }
  },
  snoe: {
    name: 'Schnöseldeutsch',
    replacements: [
      [/\bNicht\b/g, 'Nicht wirklich'],
      [/\bnicht\b/g, 'nicht wirklich'],
      [/\bDoch\b/g, 'Aber natürlich'],
      [/\bdoch\b/g, 'aber natürlich'],
      [/\bPeer\b/g, 'Kontrahent'],
      [/\bpeer\b/g, 'kontrahent']
    ],
    overrides: {
      language: {
        label: 'Idiome',
        ariaLabel: 'Idiome kuratieren'
      },
      remoteControl: {
        hints: {
          active: 'Fernsteuerung aktiv – bitte mit gepflegtem Cursor bewegen.'
        }
      }
    }
  }
};

const translations = Object.freeze({
  de: baseTranslation,
  bar: createDialect(dialectConfigs.bar),
  swa: createDialect(dialectConfigs.swa),
  sxu: createDialect(dialectConfigs.sxu),
  ber: createDialect(dialectConfigs.ber),
  rhe: createDialect(dialectConfigs.rhe),
  snoe: createDialect(dialectConfigs.snoe)
});

function getTranslation(trans, path) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), trans);
}

function getCurrentLanguage() {
  if (typeof window === 'undefined') {
    return 'de';
  }
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored && translations[stored] ? stored : 'de';
  } catch (error) {
    console.warn('Language preference could not be read from storage.', error);
    return 'de';
  }
}

function setCurrentLanguage(language) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Language preference could not be saved.', error);
  }
}

function getAvailableLanguages() {
  return Object.keys(translations).map((code) => ({
    code,
    name: translations[code].name
  }));
}
