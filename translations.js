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
    themeToggle: (nextTheme) => {
      switch (nextTheme) {
        case 'light':
          return '🌞 Heller Modus';
        case 'rgb':
          return '🌈 RGB-Modus';
        case 'dark':
        default:
          return '🌙 Dunkler Modus';
      }
    },
    themeToggleTitle: (nextTheme) => {
      switch (nextTheme) {
        case 'light':
          return 'Zum hellen Theme wechseln';
        case 'rgb':
          return 'Zum RGB-Gaming-Modus wechseln';
        case 'dark':
        default:
          return 'Zum dunklen Theme wechseln';
      }
    },
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
    themeSwitch: (theme) => {
      switch (theme) {
        case 'dark':
          return 'Theme gewechselt zu dunklem Modus.';
        case 'light':
          return 'Theme gewechselt zu hellem Modus.';
        case 'rgb':
          return 'Theme gewechselt zu RGB-Gaming-Modus.';
        default:
          return `Theme gewechselt zu ${theme}.`;
      }
    },
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
  },
  statistics: {
    title: 'KI-Statistik',
    header: 'Von KI gelöste Issues',
    loading: 'Lade Statistiken...',
    error: 'Statistiken konnten nicht geladen werden.',
    noIssues: 'Noch keine von KI gelösten Issues gefunden.',
    issueNumber: (num) => `Issue #${num}`,
    status: {
      success: 'Erfolgreich gelöst',
      failed: 'Probleme aufgetreten',
      pending: 'In Bearbeitung'
    },
    columns: {
      issue: 'Issue',
      title: 'Titel',
      summary: 'Zusammenfassung',
      status: 'Status'
    },
    summaryPlaceholder: 'Zusammenfassung wird geladen...',
    summaryError: 'Zusammenfassung nicht verfügbar',
    aiSummaryNote: 'KI-Zusammenfassungen werden generiert, wenn ein OpenAI-Schlüssel verfügbar ist.',
    cachedNote: 'Daten werden 5 Minuten zwischengespeichert.',
    joke: {
      title: 'Makaberer Witz des Tages',
      jokes: [
        'Warum mögen Programmierer die Natur nicht? Zu viele Bugs.',
        'Ein Entwickler starb. Sein letztes Wort war: "Es funktioniert auf meiner Maschine..."',
        'Wie viele Programmierer braucht man, um eine Glühbirne zu wechseln? Keinen. Das ist ein Hardware-Problem.',
        'Der schlimmste Bug ist der, den du schon behoben hast... in einem anderen Branch.',
        'Ein SQL-Query geht in eine Bar, sieht zwei Tabellen und fragt: "Darf ich joinen?"',
        'Debugging ist wie ein Detektivfilm, in dem du gleichzeitig Mörder und Detektiv bist.',
        'Es gibt nur zwei harte Probleme in der Informatik: Cache-Invalidierung, Namen vergeben und Off-by-One-Fehler.',
        'Das einzige, was schlimmer ist als Legacy-Code, ist Code, den du selbst vor 6 Monaten geschrieben hast.',
        '"Es ist nur ein kleiner Fix" - Berühmte letzte Worte vor 3 Tagen Debugging.',
        'Manche Menschen haben Albträume. Entwickler träumen von Production-Deployments am Freitagnachmittag.'
      ]
    }
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
      },
      chat: {
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Zum hellen Gsichtl wechseln';
            case 'rgb':
              return 'Zum RGB-Gaming-Modus wechseln';
            case 'dark':
            default:
              return 'Zum dunklen Gsichtl wechseln';
          }
        }
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Gsichtl gwechselt zu dunklem Modus.';
            case 'light':
              return 'Gsichtl gwechselt zu hellem Modus.';
            case 'rgb':
              return 'Gsichtl gwechselt zu RGB-Gaming-Modus.';
            default:
              return `Gsichtl gwechselt zu ${theme}.`;
          }
        }
      },
      screenShare: {
        header: 'Glotznkastn-Freigabe',
        actions: {
          start: 'Freigabe starten',
          startAria: 'Glotznkastn freigeben',
          sharing: 'Freigabe lafft...',
          stop: 'Freigabe beenden',
          stopAria: 'Glotznkastn-Freigabe stoppen'
        },
        includeAudio: 'Systemaudio einbeziehen',
        status: {
          sharing: 'Teilt dein Glotznkastn',
          ready: 'Bereit zur Freigabe',
          connect: 'Verbind di, um Glotznkastn-Freigabe zu aktivieren'
        },
        remote: {
          receiving: 'Empfang Glotznkastn vom Spezi',
          idle: 'Spezi teilt aktuell koan Glotznkastn',
          title: 'Glotznkastn vom Spezi',
          ariaInteractive: 'Vorschau vom Spezi-Glotznkastn. Fokus setzen, um zu steuern.',
          aria: 'Vorschau vom Spezi-Glotznkastn',
          streamAria: 'Glotznkastn-Stream vom Spezi',
          peerStarted: 'Spezi hat die Glotznkastn-Freigabe gstartet.',
          peerStopped: 'Spezi hat die Glotznkastn-Freigabe beendet.'
        },
        local: {
          title: 'Dei Glotznkastn',
          aria: 'Eigene Glotznkastn-Vorschau',
          placeholderReady: 'Start die Freigabe, um dein Glotznkastn zu senden.',
          placeholderDisconnected: 'Verbind di mit am Spezi, um Glotznkastn-Freigabe zu aktivieren.'
        },
        messages: {
          stopped: 'Glotznkastn-Freigabe beendet.',
          notSupported: 'Glotznkastn-Freigabe wird in dem Browser ned unterstützt.',
          started: 'Glotznkastn-Freigabe aktiv. Acht auf sensible Inhalte.'
        },
        errors: {
          peerNotReady: 'Spezi-Verbindung is no ned bereit.',
          noVideoTrack: 'Koa Videospur aus der Glotznkastn-Aufnahme erhalten.',
          permissionDenied: 'Berechtigung wurde verweigert.',
          failed: (reason) => `Glotznkastn-Freigabe fehlgschlagen: ${reason}`
        },
        footnote: 'Glotznkastn-Freigabe is rein Spezi-to-Spezi. Teil Zugriff nur mit Leit, dene du vertraust.'
      },
      remoteControl: {
        label: 'Fernsteuerung:',
        actions: {
          allow: 'Fernsteuerung erlauben',
          disable: 'Fernsteuerung beenden'
        },
        statusDisabled: 'Fernsteuerung deaktiviert',
        statusGranted: 'Fernsteuerung erlaubt – mit Glotznkastn interagieren',
        statusDisabledByPeer: 'Fernsteuerung vom Spezi beendet',
        statusChannelClosed: 'Fernsteuerungskanal gschlossen',
        statusDisabledInputLimit: 'Fernsteuerung deaktiviert (Eingabelimit erreicht)',
        statusEnabled: 'Fernsteuerung aktiv – Spezi derf steuern',
        statusUnavailable: 'Fernsteuerungskanal ned verfügbar',
        hints: {
          active: 'Fernsteuerung aktiv – beweg den Cursor da, um zu interagieren.'
        },
        system: {
          disabledOnScreenStop: 'Fernsteuerung deaktiviert, weil die Glotznkastn-Freigabe beendet wurde.',
          revokeFailed: 'Spezi konnte ned über die beendete Fernsteuerung informiert werden.',
          payloadTooLarge: 'Fernsteuerungsnachricht ignoriert: Nutzlast zu groß.',
          rateLimited: 'Fernsteuerungskanal gedrosselt. Zu viele Eingaben.',
          peerEnabled: 'Spezi hat die Fernsteuerung erlaubt. Nutz die Vorschau zum Interagieren.',
          peerDisabled: 'Spezi hat die Fernsteuerung deaktiviert.',
          deliveryFailed: 'Fernsteuerungsnachricht konnte ned zugestellt werden. Verbindung prüfen.',
          typingDisabled: 'Remote-Eingaben deaktiviert: Eingabelimit erreicht.',
          unavailable: 'Fernsteuerung is erst möglich, wenn der Steuerkanal bereit is.',
          negotiating: 'Fernsteuerungskanal verhandelt no. Bitte kurz warten.',
          requiresScreenShare: 'Start zuerst die Glotznkastn-Freigabe, um Fernsteuerung zu aktivieren.',
          updateFailed: 'Fernsteuerungsstatus konnte ned aktualisiert werden. Bitte erneut versuchen.',
          peerCanControl: 'Dei Spezi kann jetzt dein Glotznkastn steuern. Behalt die Aktivitäten im Blick.',
          controlRevokedLocal: 'Fernsteuerung fia dein Glotznkastn wurde beendet.'
        }
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
      },
      chat: {
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Zum helle Uussehe wechsle';
            case 'rgb':
              return 'Zum RGB-Gaming-Modus wechsle';
            case 'dark':
            default:
              return 'Zum dunkle Uussehe wechsle';
          }
        }
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Uussehe gwechselt zu dunklem Modus.';
            case 'light':
              return 'Uussehe gwechselt zu hellem Modus.';
            case 'rgb':
              return 'Uussehe gwechselt zu RGB-Gaming-Modus.';
            default:
              return `Uussehe gwechselt zu ${theme}.`;
          }
        }
      },
      screenShare: {
        header: 'Glotzkaschdle-Freigabe',
        actions: {
          start: 'Freigabe starte',
          startAria: 'Glotzkaschdle freigebe',
          sharing: 'Freigabe lauft...',
          stop: 'Freigabe beende',
          stopAria: 'Glotzkaschdle-Freigabe stoppe'
        },
        includeAudio: 'Systemaudio au dazunemme',
        status: {
          sharing: 'Teilt dei Glotzkaschdle',
          ready: 'Bereit zur Freigabe',
          connect: 'Verbind di, um Glotzkaschdle-Freigabe zu aktiviere'
        },
        remote: {
          receiving: 'Empfang Glotzkaschdle vom Kumpel',
          idle: 'Kumpel teilt grad koi Glotzkaschdle',
          title: 'Glotzkaschdle vom Kumpel',
          ariaInteractive: 'Vorschau vom Kumpel-Glotzkaschdle. Fokus setze, um zu steuere.',
          aria: 'Vorschau vom Kumpel-Glotzkaschdle',
          streamAria: 'Glotzkaschdle-Stream vom Kumpel',
          peerStarted: 'Kumpel hat die Glotzkaschdle-Freigabe gstartet.',
          peerStopped: 'Kumpel hat die Glotzkaschdle-Freigabe beendet.'
        },
        local: {
          title: 'Dei Glotzkaschdle',
          aria: 'Eigenes Glotzkaschdle-Vorschau',
          placeholderReady: 'Start die Freigabe, um dei Glotzkaschdle zu sende.',
          placeholderDisconnected: 'Verbind di mit am Kumpel, um Glotzkaschdle-Freigabe zu aktiviere.'
        },
        messages: {
          stopped: 'Glotzkaschdle-Freigabe beendet.',
          notSupported: 'Glotzkaschdle-Freigabe wird in dem Browser net unterstützt.',
          started: 'Glotzkaschdle-Freigabe aktiv. Aufpasse bei sensible Inhalte.'
        },
        errors: {
          peerNotReady: 'Kumpel-Verbindung isch no net bereit.',
          noVideoTrack: 'Koi Videospur aus der Glotzkaschdle-Aufnahme erhalte.',
          permissionDenied: 'Berechtigung isch verweigert worde.',
          failed: (reason) => `Glotzkaschdle-Freigabe isch fehlgschlage: ${reason}`
        },
        footnote: 'Glotzkaschdle-Freigabe isch rein Kumpel-to-Kumpel. Teil Zugriff nur mit Leut, dene du vertraust.'
      },
      remoteControl: {
        label: 'Fernsteuerung:',
        actions: {
          allow: 'Fernsteuerung erlaube',
          disable: 'Fernsteuerung beende'
        },
        statusDisabled: 'Fernsteuerung deaktiviert',
        statusGranted: 'Fernsteuerung erlaubt – mit Glotzkaschdle interagiere',
        statusDisabledByPeer: 'Fernsteuerung vom Kumpel beendet',
        statusChannelClosed: 'Fernsteuerungskanal gschlossen',
        statusDisabledInputLimit: 'Fernsteuerung deaktiviert (Eingabelimit erreicht)',
        statusEnabled: 'Fernsteuerung aktiv – Kumpel darf steuere',
        statusUnavailable: 'Fernsteuerungskanal net verfügbar',
        hints: {
          active: 'Fernsteuerung aktiv – beweg de Cursor da, um zu interagiere.'
        },
        system: {
          disabledOnScreenStop: 'Fernsteuerung deaktiviert, weil die Glotzkaschdle-Freigabe beendet isch.',
          revokeFailed: 'Kumpel konnte net über die beendete Fernsteuerung informiert werde.',
          payloadTooLarge: 'Fernsteuerungsnachricht ignoriert: Nutzlast zu groß.',
          rateLimited: 'Fernsteuerungskanal gedrosselt. Zu viele Eingabe.',
          peerEnabled: 'Kumpel hat die Fernsteuerung erlaubt. Nutz die Vorschau zum Interagiere.',
          peerDisabled: 'Kumpel hat die Fernsteuerung deaktiviert.',
          deliveryFailed: 'Fernsteuerungsnachricht konnte net zugestellt werde. Verbindung prüfe.',
          typingDisabled: 'Remote-Eingabe deaktiviert: Eingabelimit erreicht.',
          unavailable: 'Fernsteuerung isch erst möglich, wenn der Steuerkanal bereit isch.',
          negotiating: 'Fernsteuerungskanal verhandelt no. Bitte kurz warte.',
          requiresScreenShare: 'Start zuerst die Glotzkaschdle-Freigabe, um Fernsteuerung zu aktiviere.',
          updateFailed: 'Fernsteuerungsstatus konnte net aktualisiert werde. Bitte erneut versuche.',
          peerCanControl: 'Dei Kumpel kann jetzt dei Glotzkaschdle steuere. Behalt die Aktivitäte im Blick.',
          controlRevokedLocal: 'Fernsteuerung für dei Glotzkaschdle isch beendet worde.'
        }
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
        ariaLabel: 'Sproche auswähl'n'
      },
      chat: {
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Zur hellen Offmachung wechseln';
            case 'rgb':
              return 'Zum RGB-Gaming-Modus wechseln';
            case 'dark':
            default:
              return 'Zur dunklen Offmachung wechseln';
          }
        }
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Offmachung gewechselt zu dunklem Modus.';
            case 'light':
              return 'Offmachung gewechselt zu hellem Modus.';
            case 'rgb':
              return 'Offmachung gewechselt zu RGB-Gaming-Modus.';
            default:
              return `Offmachung gewechselt zu ${theme}.`;
          }
        }
      },
      screenShare: {
        header: 'Glotzbüchse-Freigabe',
        actions: {
          start: 'Freigabe starten',
          startAria: 'Glotzbüchse freigeben',
          sharing: 'Freigabe läuft...',
          stop: 'Freigabe beenden',
          stopAria: 'Glotzbüchse-Freigabe stoppen'
        },
        includeAudio: 'Systemaudio ooch einbeziehen',
        status: {
          sharing: 'Teilt deine Glotzbüchse',
          ready: 'Bereit zur Freigabe',
          connect: 'Verbind disch, um Glotzbüchse-Freigabe zu aktiviern'
        },
        remote: {
          receiving: 'Empfange Glotzbüchse vom Kumpel',
          idle: 'Kumpel teilt aktuell keene Glotzbüchse',
          title: 'Glotzbüchse vom Kumpel',
          ariaInteractive: 'Vorschau von Kumpel-Glotzbüchse. Fokus setzen, um zu steuern.',
          aria: 'Vorschau von Kumpel-Glotzbüchse',
          streamAria: 'Glotzbüchse-Stream vom Kumpel',
          peerStarted: 'Kumpel hat die Glotzbüchse-Freigabe gestartet.',
          peerStopped: 'Kumpel hat die Glotzbüchse-Freigabe beendet.'
        },
        local: {
          title: 'Deine Glotzbüchse',
          aria: 'Eigene Glotzbüchse-Vorschau',
          placeholderReady: 'Start die Freigabe, um deine Glotzbüchse zu senden.',
          placeholderDisconnected: 'Verbind disch mit 'nem Kumpel, um Glotzbüchse-Freigabe zu aktiviern.'
        },
        messages: {
          stopped: 'Glotzbüchse-Freigabe beendet.',
          notSupported: 'Glotzbüchse-Freigabe wird in dem Browser ni unterstützt.',
          started: 'Glotzbüchse-Freigabe aktiv. Acht auf sensible Inhalte.'
        },
        errors: {
          peerNotReady: 'Kumpel-Verbindung is noch ni bereit.',
          noVideoTrack: 'Keene Videospur aus der Glotzbüchse-Aufnahme erhalten.',
          permissionDenied: 'Berechtigung wurde verweigert.',
          failed: (reason) => `Glotzbüchse-Freigabe fehlgeschlagen: ${reason}`
        },
        footnote: 'Glotzbüchse-Freigabe is rein Kumpel-to-Kumpel. Teil Zugriff nur mit Leuten, denen du vertraust.'
      },
      remoteControl: {
        label: 'Fernsteuerung:',
        actions: {
          allow: 'Fernsteuerung erlauben',
          disable: 'Fernsteuerung beenden'
        },
        statusDisabled: 'Fernsteuerung deaktiviert',
        statusGranted: 'Fernsteuerung erlaubt – mit Glotzbüchse interagiern',
        statusDisabledByPeer: 'Fernsteuerung vom Kumpel beendet',
        statusChannelClosed: 'Fernsteuerungskanal geschlossen',
        statusDisabledInputLimit: 'Fernsteuerung deaktiviert (Eingabelimit erreicht)',
        statusEnabled: 'Fernsteuerung aktiv – Kumpel darf steuern',
        statusUnavailable: 'Fernsteuerungskanal ni verfügbar',
        hints: {
          active: 'Fernsteuerung aktiv – beweg den Cursor hier, um zu interagiern.'
        },
        system: {
          disabledOnScreenStop: 'Fernsteuerung deaktiviert, weil die Glotzbüchse-Freigabe beendet wurde.',
          revokeFailed: 'Kumpel konnte ni über die beendete Fernsteuerung informiert werden.',
          payloadTooLarge: 'Fernsteuerungsnachricht ignoriert: Nutzlast zu groß.',
          rateLimited: 'Fernsteuerungskanal gedrosselt. Zu viele Eingaben.',
          peerEnabled: 'Kumpel hat die Fernsteuerung erlaubt. Nutz die Vorschau zum Interagiern.',
          peerDisabled: 'Kumpel hat die Fernsteuerung deaktiviert.',
          deliveryFailed: 'Fernsteuerungsnachricht konnte ni zugestellt werden. Verbindung prüfen.',
          typingDisabled: 'Remote-Eingaben deaktiviert: Eingabelimit erreicht.',
          unavailable: 'Fernsteuerung is erst möglich, wenn der Steuerkanal bereit is.',
          negotiating: 'Fernsteuerungskanal verhandelt noch. Bitte kurz warten.',
          requiresScreenShare: 'Start zuerst die Glotzbüchse-Freigabe, um Fernsteuerung zu aktiviern.',
          updateFailed: 'Fernsteuerungsstatus konnte ni aktualisiert werden. Bitte erneut versuchen.',
          peerCanControl: 'Dein Kumpel kann jetzt deine Glotzbüchse steuern. Behalt die Aktivitäten im Blick.',
          controlRevokedLocal: 'Fernsteuerung für deine Glotzbüchse wurde beendet.'
        }
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
      },
      chat: {
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Zur hellen Maske wechseln';
            case 'rgb':
              return 'Zum RGB-Gaming-Modus wechseln';
            case 'dark':
            default:
              return 'Zur dunklen Maske wechseln';
          }
        }
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Maske gewechselt zu dunklem Modus.';
            case 'light':
              return 'Maske gewechselt zu hellem Modus.';
            case 'rgb':
              return 'Maske gewechselt zu RGB-Gaming-Modus.';
            default:
              return `Maske gewechselt zu ${theme}.`;
          }
        }
      },
      screenShare: {
        header: 'Flimmerkiste-Freigabe',
        actions: {
          start: 'Freigabe starten',
          startAria: 'Flimmerkiste freigeben',
          sharing: 'Freigabe läuft...',
          stop: 'Freigabe beenden',
          stopAria: 'Flimmerkiste-Freigabe stoppen'
        },
        includeAudio: 'Systemaudio ooch einbeziehen',
        status: {
          sharing: 'Teilt deine Flimmerkiste',
          ready: 'Bereit zur Freigabe',
          connect: 'Verbind dir, um Flimmerkiste-Freigabe zu aktivieren'
        },
        remote: {
          receiving: 'Empfange Flimmerkiste vom Kumpel',
          idle: 'Kumpel teilt aktuell keene Flimmerkiste',
          title: 'Flimmerkiste vom Kumpel',
          ariaInteractive: 'Vorschau von Kumpel-Flimmerkiste. Fokus setzen, um zu steuern.',
          aria: 'Vorschau von Kumpel-Flimmerkiste',
          streamAria: 'Flimmerkiste-Stream vom Kumpel',
          peerStarted: 'Kumpel hat die Flimmerkiste-Freigabe gestartet.',
          peerStopped: 'Kumpel hat die Flimmerkiste-Freigabe beendet.'
        },
        local: {
          title: 'Deine Flimmerkiste',
          aria: 'Eigene Flimmerkiste-Vorschau',
          placeholderReady: 'Start die Freigabe, um deine Flimmerkiste zu senden.',
          placeholderDisconnected: 'Verbind dir mit 'nem Kumpel, um Flimmerkiste-Freigabe zu aktivieren.'
        },
        messages: {
          stopped: 'Flimmerkiste-Freigabe beendet.',
          notSupported: 'Flimmerkiste-Freigabe wird in dem Browser nich unterstützt.',
          started: 'Flimmerkiste-Freigabe aktiv. Acht uff sensible Inhalte.'
        },
        errors: {
          peerNotReady: 'Kumpel-Verbindung is noch nich bereit.',
          noVideoTrack: 'Keene Videospur aus der Flimmerkiste-Aufnahme erhalten.',
          permissionDenied: 'Berechtigung wurde verweigert.',
          failed: (reason) => `Flimmerkiste-Freigabe fehlgeschlagen: ${reason}`
        },
        footnote: 'Flimmerkiste-Freigabe is rein Kumpel-to-Kumpel. Teil Zugriff nur mit Leuten, denen du vertraust.'
      },
      remoteControl: {
        label: 'Fernsteuerung:',
        actions: {
          allow: 'Fernsteuerung erlauben',
          disable: 'Fernsteuerung beenden'
        },
        statusDisabled: 'Fernsteuerung deaktiviert',
        statusGranted: 'Fernsteuerung erlaubt – mit Flimmerkiste interagieren',
        statusDisabledByPeer: 'Fernsteuerung vom Kumpel beendet',
        statusChannelClosed: 'Fernsteuerungskanal geschlossen',
        statusDisabledInputLimit: 'Fernsteuerung deaktiviert (Eingabelimit erreicht)',
        statusEnabled: 'Fernsteuerung aktiv – Kumpel darf steuern',
        statusUnavailable: 'Fernsteuerungskanal nich verfügbar',
        hints: {
          active: 'Fernsteuerung aktiv – beweg den Cursor hier, um zu interagieren.'
        },
        system: {
          disabledOnScreenStop: 'Fernsteuerung deaktiviert, weil die Flimmerkiste-Freigabe beendet wurde.',
          revokeFailed: 'Kumpel konnte nich über die beendete Fernsteuerung informiert werden.',
          payloadTooLarge: 'Fernsteuerungsnachricht ignoriert: Nutzlast zu groß.',
          rateLimited: 'Fernsteuerungskanal gedrosselt. Zu viele Eingaben.',
          peerEnabled: 'Kumpel hat die Fernsteuerung erlaubt. Nutz die Vorschau zum Interagieren.',
          peerDisabled: 'Kumpel hat die Fernsteuerung deaktiviert.',
          deliveryFailed: 'Fernsteuerungsnachricht konnte nich zugestellt werden. Verbindung prüfen.',
          typingDisabled: 'Remote-Eingaben deaktiviert: Eingabelimit erreicht.',
          unavailable: 'Fernsteuerung is erst möglich, wenn der Steuerkanal bereit is.',
          negotiating: 'Fernsteuerungskanal verhandelt noch. Bitte kurz warten.',
          requiresScreenShare: 'Start zuerst die Flimmerkiste-Freigabe, um Fernsteuerung zu aktivieren.',
          updateFailed: 'Fernsteuerungsstatus konnte nich aktualisiert werden. Bitte erneut versuchen.',
          peerCanControl: 'Dein Kumpel kann jetzt deine Flimmerkiste steuern. Behalt die Aktivitäten im Blick.',
          controlRevokedLocal: 'Fernsteuerung für deine Flimmerkiste wurde beendet.'
        }
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
      },
      chat: {
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Zum helle Ussjohn wechsele';
            case 'rgb':
              return 'Zum RGB-Gaming-Modus wechsele';
            case 'dark':
            default:
              return 'Zum dunkle Ussjohn wechsele';
          }
        }
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Ussjohn gewechselt zu dunklem Modus.';
            case 'light':
              return 'Ussjohn gewechselt zu hellem Modus.';
            case 'rgb':
              return 'Ussjohn gewechselt zu RGB-Gaming-Modus.';
            default:
              return `Ussjohn gewechselt zu ${theme}.`;
          }
        }
      },
      screenShare: {
        header: 'Kiekkasten-Freigabe',
        actions: {
          start: 'Freigabe starte',
          startAria: 'Kiekkasten freigebe',
          sharing: 'Freigabe läuft...',
          stop: 'Freigabe beende',
          stopAria: 'Kiekkasten-Freigabe stoppe'
        },
        includeAudio: 'Systemaudio och einbeziehe',
        status: {
          sharing: 'Teilt dinge Kiekkasten',
          ready: 'Bereit zur Freigabe',
          connect: 'Verbind dich, um Kiekkasten-Freigabe zu aktiviere'
        },
        remote: {
          receiving: 'Empfang Kiekkasten vom Kumpel',
          idle: 'Kumpel teilt aktuell keine Kiekkasten',
          title: 'Kiekkasten vom Kumpel',
          ariaInteractive: 'Vorschau vom Kumpel-Kiekkasten. Fokus setze, um zu steuere.',
          aria: 'Vorschau vom Kumpel-Kiekkasten',
          streamAria: 'Kiekkasten-Stream vom Kumpel',
          peerStarted: 'Kumpel hat die Kiekkasten-Freigabe gestartet.',
          peerStopped: 'Kumpel hat die Kiekkasten-Freigabe beendet.'
        },
        local: {
          title: 'Dinge Kiekkasten',
          aria: 'Eigene Kiekkasten-Vorschau',
          placeholderReady: 'Start die Freigabe, um dinge Kiekkasten zu sende.',
          placeholderDisconnected: 'Verbind dich mit 'nem Kumpel, um Kiekkasten-Freigabe zu aktiviere.'
        },
        messages: {
          stopped: 'Kiekkasten-Freigabe beendet.',
          notSupported: 'Kiekkasten-Freigabe wird in dem Browser nit unterstützt.',
          started: 'Kiekkasten-Freigabe aktiv. Acht op sensible Inhalte.'
        },
        errors: {
          peerNotReady: 'Kumpel-Verbindung is noch nit bereit.',
          noVideoTrack: 'Keine Videospur aus der Kiekkasten-Aufnahme erhalte.',
          permissionDenied: 'Berechtigung wurde verweigert.',
          failed: (reason) => `Kiekkasten-Freigabe fehlgeschlage: ${reason}`
        },
        footnote: 'Kiekkasten-Freigabe is rein Kumpel-to-Kumpel. Teil Zugriff nur mit Leute, dene du vertraust.'
      },
      remoteControl: {
        label: 'Fernsteuerung:',
        actions: {
          allow: 'Fernsteuerung erlaube',
          disable: 'Fernsteuerung beende'
        },
        statusDisabled: 'Fernsteuerung deaktiviert',
        statusGranted: 'Fernsteuerung erlaubt – mit Kiekkasten interagiere',
        statusDisabledByPeer: 'Fernsteuerung vom Kumpel beendet',
        statusChannelClosed: 'Fernsteuerungskanal geschlosse',
        statusDisabledInputLimit: 'Fernsteuerung deaktiviert (Eingabelimit erreicht)',
        statusEnabled: 'Fernsteuerung aktiv – Kumpel darf steuere',
        statusUnavailable: 'Fernsteuerungskanal nit verfügbar',
        hints: {
          active: 'Fernsteuerung aktiv – beweg de Cursor da, um zu interagiere.'
        },
        system: {
          disabledOnScreenStop: 'Fernsteuerung deaktiviert, weil die Kiekkasten-Freigabe beendet wurde.',
          revokeFailed: 'Kumpel konnte nit über die beendete Fernsteuerung informiert werde.',
          payloadTooLarge: 'Fernsteuerungsnachricht ignoriert: Nutzlast zu groß.',
          rateLimited: 'Fernsteuerungskanal gedrosselt. Zu viele Eingabe.',
          peerEnabled: 'Kumpel hat die Fernsteuerung erlaubt. Nutz die Vorschau zum Interagiere.',
          peerDisabled: 'Kumpel hat die Fernsteuerung deaktiviert.',
          deliveryFailed: 'Fernsteuerungsnachricht konnte nit zugestellt werde. Verbindung prüfe.',
          typingDisabled: 'Remote-Eingabe deaktiviert: Eingabelimit erreicht.',
          unavailable: 'Fernsteuerung is erst möglich, wenn der Steuerkanal bereit is.',
          negotiating: 'Fernsteuerungskanal verhandelt noch. Bitte kurz warte.',
          requiresScreenShare: 'Start zuerst die Kiekkasten-Freigabe, um Fernsteuerung zu aktiviere.',
          updateFailed: 'Fernsteuerungsstatus konnte nit aktualisiert werde. Bitte erneut versuche.',
          peerCanControl: 'Dinge Kumpel kann jetzt dinge Kiekkasten steuere. Behalt die Aktivitäte im Blick.',
          controlRevokedLocal: 'Fernsteuerung für dinge Kiekkasten wurde beendet.'
        }
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
  },
  fra: {
    name: 'Fränggisch',
    replacements: [],
    overrides: {
      mascot: {
        ariaLabel: 'Grantigs Tux-Maskoddchn, schweb drüber, dann werd\'r gscheid narrisch'
      },
      app: {
        title: 'PodTalk'
      },
      about: {
        button: 'Üwwer',
        buttonAriaLabel: 'Üwwer dess Broggd',
        title: 'Üwwer TheCommunity',
        description: 'Des is a Peer-to-Peer-WebRTC-Gschwätz-App ganz ohne Server. Die Gmoochdschaft regeldd all\'s über GitHub-Issues.',
        contributorsTitle: 'Mitmoochda',
        contributorsIntro: 'Vergelt\'s Gott an alla, die mit Issues gholfa hamm:',
        loadingContributors: 'Lad Mitmoochda...',
        contributorsError: 'Mitmoochda-Lisd konn ned gholdd werdn. Probier\'s späder nouchmool.',
        noIssues: 'Nouch ka Issues. Mach a Issue auf, dann stähsd aa bei de Credits.',
        issueCount: (count) => (count === 1 ? '1 Issue' : `${count} Issues`),
        close: 'Zumachn',
        closeAriaLabel: 'Üwwer-Dialog zumachn'
      },
      signaling: {
        title: 'Handgmochds Signalisiern',
        collapseAriaLabel: (collapsed) => (collapsed ? 'Signalisiern ausklappn' : 'Signalisiern einklappn'),
        securityNotice: 'Sichaherheeds-Hinweis:',
        securityWarning: 'Wennde dei WebRTC-Signal weitergibsd, zeigst a dei Netzwerkadressen. Gib\'s bloß Leit, dene\'d vertraugsd.',
        step1: 'Schdridd 1: Oiner driggd auf „Aagebood machn" und gebbd des Signal weiter.',
        step2: 'Schdridd 2: Der annere függds bei „Fremds Signal" ei, driggd auf „Remote owend" und dann auf „Antwort machn" un schickd des zrugg.',
        step3: 'Schdridd 3: Der erst függd die Antwort aa bei „Fremds Signal" ei. Der Gschwätz fangd a, sobbald „verbundn" do steht.',
        createOffer: 'Aagebood machn',
        createAnswer: 'Antwort machn',
        applyRemote: 'Remote owend',
        disconnect: 'Obbruchn',
        disconnectAriaLabel: 'Verbinddung zum Peer obbruchn',
        working: 'Schaff...',
        localSignalLabel: 'Eigns Signal (des weitergebm)',
        localSignalPlaceholder: 'Des lokale SDP kummd do nei, sobbald\'s feardich is.',
        remoteSignalLabel: 'Fremds Signal (des kriegde JSON nei)',
        remoteSignalPlaceholder: 'Füg des JSON vom Peer ei. Drigg Strg+Enter (am Mac Cmd+Enter) oder klick auf Remote owend.',
        copyButton: 'Kopiern',
        copied: 'Kopierd!',
        copyFailed: 'Fehlschlogn',
        copyAriaLabel: 'Eigns Signal in Zwischenspeicha kopiern'
      },
      chat: {
        title: 'Gschwätz',
        addApiKey: 'OpenAI-Schlüssl eiwern',
        updateApiKey: 'OpenAI-Schlüssl erneiern',
        themeToggle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return '🌞 Häller Modus';
            case 'rgb':
              return '🌈 RGB-Modus';
            case 'dark':
            default:
              return '🌙 Dungler Modus';
          }
        },
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Aufs helle Bräschendaddion umschaltn';
            case 'rgb':
              return 'Aufn RGB-Gaming-Modus umschaltn';
            case 'dark':
            default:
              return 'Aufs dungle Bräschendaddion umschaltn';
          }
        },
        clear: 'Leer machn',
        clearAriaLabel: 'Alla Gschwätz-Norichdn leschn',
        emptyState: 'Nouch ka Norichdn. Verbinn di mit am Peer, wennnde schwätz maggsd.',
        roleLabels: {
          local: 'Du',
          remote: 'Peer',
          system: 'Hinweis'
        },
        inputPlaceholder: 'Norichd eiwern...',
        inputAriaLabel: 'Norichd-Eigob',
        aiButton: 'Mit KI umschreim',
        aiButtonBusy: 'Schreim um...',
        aiButtonNoKey: 'OpenAI-Schlüssl eiwern, damit KI geht',
        aiButtonTitle: 'Lass OpenAI dei Norichd kloarer umschreim.',
        aiButtonTitleNoKey: 'Eiwern dei OpenAI-Schlüssl, dann geht KI-Unterstützung.',
        send: 'Schickn',
        sendAriaLabel: 'Norichd schickn',
        sendTitle: 'Norichd schickn',
        charCount: (current, max) => `${current} / ${max}`
      },
      apiKeyModal: {
        title: 'OpenAI-Integratschn',
        close: 'Zumachn',
        closeAriaLabel: 'API-Schlüssl-Dialog zumachn',
        description: 'Gib dei persöhnlichn OpenAI-API-Schlüssl ei, dann geht die KI. Der Schlüssl bleibd bloß in dera Sitzung und gehd nur an api.openai.com.',
        label: 'OpenAI-API-Schlüssl',
        placeholder: 'sk-...',
        hint: 'Gib dei Schlüssl ned auf fremde Gräd ein. Lad die Seit neu oder mach KI aus, wenn\'dn leschn maggsd.',
        save: 'Schlüssl speichrn',
        disable: 'KI ausschaltn',
        continueWithout: 'Ohne KI weidamachn'
      },
      status: {
        waiting: 'Waard auf Verbinddung...',
        signalReady: 'Signal is feardich zum weitergebm',
        ice: (state) => `ICE: ${state}`,
        connection: (state) => `Verbinddung: ${state}`,
        creatingOffer: 'Mach Aagebood...',
        creatingAnswer: 'Mach Antwort...',
        remoteApplied: (type) => `Fremds ${type} ogewendd`,
        disconnected: 'Getrennd',
        channelOpen: 'Kanal offn',
        channelClosed: 'Kanal zua',
        answerApplied: 'Antwort ogewendd, waards auf Kanal...'
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Bräschendaddion is jetz dungl.';
            case 'light':
              return 'Bräschendaddion is jetz hell.';
            case 'rgb':
              return 'Bräschendaddion is jetz RGB-Gaming-Modus.';
            default:
              return `Bräschendaddion is jetz ${theme}.`;
          }
        },
        continueWithoutAi: 'Mach ohne KI weida. Kannsd späda im Gschwätz no an Schlüssl eiwern.',
        apiKeyStored: 'OpenAI-Schlüssl bloß in dera Sitzung speicherd. Lad die Seit neu, dann isser weg.',
        aiDisabled: 'KI is aus. Norichdn geh\'n ohne KI.',
        aiReady: 'KI is startklor. Prüff Vorschläg bevor\'d schickst.',
        securityBlocked: 'Sicherheitsnotiz: Ned-textuelli Norichd geblockd.',
        messageTooLong: (max) => `Norichd geblockd: zu lang, Limit ${max} Zeichn.`,
        rateLimit: 'Limit: Peer schickd z\'viel.',
        channelBlocked: (label) => `Sicherheitsnotiz: Unnerwaards Datenkanal „${label || 'unbenannt'}" geblockd.`,
        createOfferFailed: 'Aagebood konn ned gmachd werdn. Prüff Browser-Erschtattung un WebRTC.',
        remoteEmpty: 'Fremds Signal is leer. Füg des JSON ei.',
        remoteInvalidJson: 'Fremds Signal is ka gültigs JSON.',
        remoteMissingData: 'Dem fremdn Signal fehln Datn. Nimm des Angebot oder die Antwort wia\'s is.',
        createAnswerFailed: 'Antwort konn ned gmachd werdn. Wend erst a gültigs Angebot aa.',
        needOfferForAnswer: 'Antwort braucht erst a Angebot.',
        messageInputTooLong: (max, current) => `Norichd zu lang: Limit ${max}, jetzt ${current}.`,
        disconnectNotice: 'Verbinddung weg. Mach a neis Aagebood.',
        aiRewriteFailed: (error) => `KI-Umsschreimn is schiefganga: ${error || 'Anfrooch abgweisn.'}`,
        aiTruncated: 'KI-Vorschlog is gkürzt, damit\'s nei passt.',
        aiSuggestionApplied: 'KI-Vorschlog übernumm. Prüff bevor\'d schickst.',
        chatCleared: 'Gschwätz-Verlauf is glöscht.',
        aiRewriteNotAttempted: (max) => `Konn ned umgeschriebn werdn: mussi unner ${max} Zeichn bleim.`,
        languageChanged: (name) => `Sprooch auf ${name} gstellt.`
      },
      aiErrors: {
        emptyKey: 'Gib an OpenAI-Schlüssl ei, dann gehd des Umschreimn.',
        unauthorized: 'OpenAI hods abgweisn. Prüff dei Schlüssl.',
        requestFailed: (status) => `OpenAI-Anfrooch schiefganga (Status ${status}).`,
        missingContent: 'Antwort hod kan Text ghabt.',
        emptySuggestion: 'OpenAI hod nix gschriebn.'
      },
      language: {
        label: 'Sprooch',
        ariaLabel: 'Sprooch aussuchn'
      },
      screenShare: {
        header: 'Gloddsn-Freigebm',
        actions: {
          start: 'Freigebm anfang',
          startAria: 'Gloddsn frei gebm',
          sharing: 'Freigebm laffd...',
          stop: 'Freigebm aufhörn',
          stopAria: 'Gloddsn-Freigebm stoppn'
        },
        includeAudio: 'System-Audio aa gebm',
        status: {
          sharing: 'Gebbd dei Gloddsn frei',
          ready: 'Bereid zur Frei gebm',
          connect: 'Verbinn di, dann gehd Gloddsn-Frei gebm'
        },
        remote: {
          receiving: 'Kriegd Gloddsn vom Peer',
          idle: 'Peer gebbd grad nix frei',
          title: 'Gloddsn vom Peer',
          ariaInteractive: 'Vorschau vom Peer-Gloddsn. Fokus drauf, dann koochsd steuern.',
          aria: 'Vorschau vom Peer-Gloddsn',
          streamAria: 'Gloddsn-Stream vom Peer',
          peerStarted: 'Peer hod Frei gebm angfang.',
          peerStopped: 'Peer hod Frei gebm aufghörd.'
        },
        local: {
          title: 'Dei Gloddsn',
          aria: 'Eigene Gloddsn-Vorschau',
          placeholderReady: 'Starz Frei gebm, dann sehgn die annern dei Gloddsn.',
          placeholderDisconnected: 'Verbinn di mit am Peer, dann gehd Frei gebm.'
        },
        messages: {
          stopped: 'Frei gebm is zua.',
          notSupported: 'Dei Browser kennts ned.',
          started: 'Gloddsn-Frei gebm laffd. Pass auf mit sensible Sache.'
        },
        errors: {
          peerNotReady: 'Peer is no ned soweit.',
          noVideoTrack: 'Kan Video-Kanal aus der Aufnahm kriagt.',
          permissionDenied: 'Erlaubnis verweigert.',
          failed: (reason) => `Frei gebm is schiefganga: ${reason}`
        },
        footnote: 'Gloddsn-Frei gebm is direkt Peer-to-Peer. Gebbd\'s bloß Leit, dene\'d vertraugsd.'
      },
      remoteControl: {
        label: 'Fernschderung:',
        actions: {
          allow: 'Fernschderung erlauba',
          disable: 'Fernschderung beendn'
        },
        statusDisabled: 'Fernschderung aus',
        statusGranted: 'Fernschderung an – du kanschd dei Gloddsn steuern loßn',
        statusDisabledByPeer: 'Peer hod Fernschderung ausgmachd',
        statusChannelClosed: 'Fernschder-Kanal zua',
        statusDisabledInputLimit: 'Fernschderung aus (z\'vui Eingobn)',
        statusEnabled: 'Fernschderung an – Peer derf steuern',
        statusUnavailable: 'Fernschder-Kanal ned da',
        hints: {
          active: 'Fernschderung an – beweg dei Maus do, dann gehd\'s.'
        },
        system: {
          disabledOnScreenStop: 'Fernschderung aus, weil Frei gebm gstoppt is.',
          revokeFailed: 'Peer konnt ned informiert werdn.',
          payloadTooLarge: 'Nachricht zu groß, ignoriert.',
          rateLimited: 'Zu vui Eingobn, Kanal is gebremst.',
          peerEnabled: 'Peer derf jetz steuern. Nutz Vorschau.',
          peerDisabled: 'Peer hod ausgmachd.',
          deliveryFailed: 'Nachricht konnt ned gschickt werdn. Prüff Verbinddung.',
          typingDisabled: 'Eingobn blockiert: Limit erreicht.',
          unavailable: 'Fernschderung gehd erst, wenn Kanal bereit.',
          negotiating: 'Verhandeld no... wart a weng.',
          requiresScreenShare: 'Mach erst Frei gebm an.',
          updateFailed: 'Konn Status ned aktualisiern. Probier nouchmool.',
          peerCanControl: 'Dei Peer kann jetz dei Gloddsn bedienn. Pass auf.',
          controlRevokedLocal: 'Fernschderung is ausgmachd.'
        }
      },
      imageShare: {
        selectImage: 'Bild aussuchn',
        sendImage: 'Bild schickn',
        sendImageTitle: 'Bild zum Schickn aussuchn',
        channelReady: 'Bildfreigebm bereit.',
        channelNotReady: 'Bildfreigebm no ned soweit.',
        invalidType: 'Falscha Bild-Typ. Nua JPEG, PNG, GIF, WebP.',
        tooLarge: 'Bild z\'groß. Max 5 MB.',
        rateLimitSend: 'Z\'vui Bildla gschickd. Wart a Minud.',
        rateLimitReceive: 'Peer schickd z\'vui Bildla.',
        tooManyConcurrent: 'Z\'vui gleichzeidige Übertragungen.',
        sendFailed: 'Bild konnt ned gschickd werdn.',
        receiveFailed: 'Bild konnt ned emfpangd werdn.',
        sentImage: (fileName) => `Bild gschickd: ${fileName}`,
        receivedImage: (fileName) => `Bild kriagt: ${fileName}`
      },
      statistics: {
        title: 'KI-Statistik',
        header: 'Von KI g\'löste Issues',
        loading: 'Lad Statistik...',
        error: 'Statistik konnt ned gholdd werdn.',
        noIssues: 'Nouch ka Issues von KI.',
        issueNumber: (num) => `Issue #${num}`,
        status: {
          success: 'Erfolgrich g\'löist',
          failed: 'Fehler gabbd',
          pending: 'No am machn'
        },
        columns: {
          issue: 'Issue',
          title: 'Titel',
          summary: 'Zsammafassung',
          status: 'Status'
        },
        summaryPlaceholder: 'Zsammafassung kummd...',
        summaryError: 'Zsammafassung ned da',
        aiSummaryNote: 'KI-Zsammafassung gehd, wenn a OpenAI-Schlüssl do is.',
        cachedNote: 'Daten werdn 5 Minud gspeicherd.',
        joke: {
          title: 'Derber Witz vom Dog',
          jokes: [
            'Warum mög Programmiera die Natur ned? Z\'vui Bugs.',
            'A Entwickla is gstorbn. Letzde Wort: "Auf meiner Maschin gehd\'s..."',
            'Wie vui Programmiera brauchd\'s für a Glühbirn? Koi. Is Hardware.',
            'Der schlimmsde Bug is der, dennd scho gfixd ghabt hosd... in am annarn Branch.',
            'A SQL-Query gehd in a Bar, sieht zwa Tabellen: "Darf i joinen?"',
            'Debuggn is wia a Krimi, wo\'d selba Mörder un Kommissar bischd.',
            'Es gebbd nua zwa harte Problems: Cache invalidiern, Namen gebm un Off-by-One.',
            'Des ei\'zig schlimmer wie Legacy-Code is dei eigana vo vor 6 Monatn.',
            '"Is nur a kloana Fix" – berühmd letzte Wort vorm 3-Daach-Debuggn.',
            'Manch Leit träum von Albtraum. Entwickla träum vom Friday-Deploy.'
          ]
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
  snoe: createDialect(dialectConfigs.snoe),
  fra: createDialect(dialectConfigs.fra)
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
