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
  menu: {
    ariaLabel: 'Hauptnavigation',
    about: 'Über',
    help: 'Hilfe',
    impressum: 'Impressum',
    issues: 'Anderweitige Entwicklungen',
    versionHistory: 'Versionshistorie'
  },
  help: {
    button: 'Hilfe',
    buttonAriaLabel: 'Hilfe öffnen',
    title: 'Hilfe',
    description: 'Willkommen bei PodTalk! Diese Anwendung ermöglicht Peer-to-Peer-Kommunikation über WebRTC ohne Backend-Server.',
    howToConnect: 'Wie verbinde ich mich?',
    howToConnectSteps: [
      'Eine Person erstellt ein "Angebot" und teilt das Signal mit dem anderen Peer (z.B. über einen sicheren Kanal wie Signal oder WhatsApp).',
      'Die zweite Person fügt das Signal ein, wendet es an, erstellt eine "Antwort" und teilt diese zurück.',
      'Die erste Person fügt die Antwort ein und wendet sie an. Die Verbindung wird automatisch hergestellt.'
    ],
    features: 'Verfügbare Funktionen:',
    featuresList: [
      'Text-Chat: Senden Sie Nachrichten in Echtzeit',
      'Bildfreigabe: Teilen Sie Bilder mit Ihrem Peer',
      'Bildschirmfreigabe: Zeigen Sie Ihren Bildschirm',
      'Fernsteuerung: Steuern Sie den Bildschirm Ihres Peers (mit Erlaubnis)',
      'Spiele: Spielen Sie Pong, Trivia, Flappy Bird oder Schach zusammen',
      'KI-Assistent: Nutzen Sie OpenAI oder Ollama für KI-gestützte Antworten',
      'Sprachnachrichten: Nehmen Sie Sprachnachrichten auf und transkribieren Sie sie'
    ],
    security: 'Sicherheit:',
    securityNote: 'Alle Kommunikation erfolgt direkt zwischen den Peers über verschlüsselte WebRTC-Verbindungen. Es gibt keinen zentralen Server, der Ihre Daten speichert.',
    feedback: 'Feedback geben:',
    feedbackNote: 'Haben Sie Vorschläge oder Fehler gefunden? Öffnen Sie ein Issue auf GitHub!',
    feedbackButton: '📝 Issue erstellen',
    feedbackButtonAriaLabel: 'Öffne GitHub um ein Issue zu erstellen',
    close: 'Schließen',
    closeAriaLabel: 'Hilfe-Dialog schließen'
  },
  impressum: {
    button: 'Impressum',
    buttonAriaLabel: 'Impressum öffnen',
    title: 'Impressum',
    projectInfo: 'Projektinformationen',
    projectName: 'PodTalk / TheCommunity',
    projectDescription: 'Dies ist ein Open-Source-Community-Projekt, das vollständig über GitHub Issues gesteuert wird.',
    responsibility: 'Verantwortlich für den Inhalt:',
    communityDriven: 'Community-gesteuert via GitHub',
    repository: 'GitHub Repository:',
    repositoryLink: 'https://github.com/TheMorpheus407/TheCommunity',
    license: 'Lizenz:',
    licenseInfo: 'Dieses Projekt ist Open Source. Bitte beachten Sie die Lizenzbedingungen im Repository.',
    contact: 'Kontakt:',
    contactInfo: 'Für Fragen oder Anregungen öffnen Sie bitte ein Issue auf GitHub.',
    disclaimer: 'Haftungsausschluss:',
    disclaimerText: 'Diese Anwendung wird ohne jegliche Garantie zur Verfügung gestellt. Die Nutzung erfolgt auf eigene Verantwortung. Da es sich um eine P2P-Anwendung ohne Backend handelt, haben die Projektmaintainer keinen Zugriff auf Ihre Verbindungen oder Daten.',
    privacy: 'Datenschutz:',
    privacyText: 'Es werden keine Daten auf einem Server gespeichert. Alle Kommunikation erfolgt direkt zwischen den Peers. Lokale Einstellungen werden nur in Ihrem Browser (localStorage) gespeichert.',
    close: 'Schließen',
    closeAriaLabel: 'Impressum-Dialog schließen'
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
  offTopic: {
    button: 'Anderweitige Entwicklungen',
    buttonAriaLabel: 'Anderweitige Entwicklungen ansehen',
    title: 'Anderweitige Entwicklungen',
    description: 'Hier finden Sie Projekte und Analysen, die nicht direkt mit der Hauptanwendung zusammenhängen, aber dennoch interessant sind.',
    close: 'Schließen',
    closeAriaLabel: 'Anderweitige-Entwicklungen-Dialog schließen',
    higgsAnalysisTitle: 'Higgs-Boson-Analyse',
    higgsAnalysisDescription: 'Eine vollständige High-Energy-Physics-Analyse des Higgs-Boson-Entdeckungskanals H→ZZ→4ℓ.',
    higgsAnalysisButton: 'H→ZZ→4ℓ Analyse →'
  },
  versionHistory: {
    button: 'Versionshistorie',
    buttonAriaLabel: 'Versionshistorie öffnen',
    title: 'Versionshistorie',
    description: 'Hier können Sie alle Versionen der Anwendung einsehen und Änderungen zwischen Versionen vergleichen.',
    close: 'Schließen',
    closeAriaLabel: 'Versionshistorie-Dialog schließen',
    loading: 'Lade Versionshistorie...',
    loadError: 'Versionshistorie konnte nicht geladen werden.',
    currentVersion: 'Aktuelle Version',
    current: 'aktuell',
    allVersions: 'Alle Versionen',
    changes: 'Änderungen:',
    viewDetails: 'Details anzeigen',
    deselect: 'Auswahl aufheben',
    compareWith: 'Vergleichen mit',
    cancelCompare: 'Vergleich abbrechen',
    comparisonTitle: 'Versionsvergleich'
  },
  signaling: {
    title: 'Manuelle Signalisierung',
    collapseAriaLabel: (collapsed) => (collapsed ? 'Signalisierung ausklappen' : 'Signalisierung einklappen'),
    securityNotice: 'Sicherheitshinweis:',
    securityWarning: 'Das Teilen von WebRTC-Signalen offenbart deine Netzwerkadressen. Teile Angebote nur mit vertrauenswürdigen Peers.',
    step1: 'Schritt 1: Eine Person klickt auf „Angebot erstellen" und teilt das unten erscheinende Signal.',
    step2: 'Schritt 2: Die andere Person fügt es bei „Entferntes Signal" ein, klickt auf „Remote anwenden", dann auf „Antwort erstellen" und teilt ihre Antwort.',
    step3: 'Schritt 3: Die erste Person fügt die Antwort bei „Entferntes Signal" ein und wendet sie an. Der Chat startet, sobald der Status „verbunden" anzeigt.',
    createOffer: 'Angebot erstellen',
    createAnswer: 'Antwort erstellen',
    applyRemote: 'Remote anwenden',
    disconnect: 'Trennen',
    disconnectAriaLabel: 'Verbindung zum Peer trennen',
    restartIce: 'ICE Neustart',
    restartIceAriaLabel: 'ICE-Verbindung neu starten',
    working: 'Arbeite...',
    localSignalLabel: 'Lokales Signal (dies teilen)',
    localSignalPlaceholder: 'Das lokale SDP erscheint hier, sobald es bereit ist.',
    remoteSignalLabel: 'Entferntes Signal (empfangenes JSON hier einfügen)',
    remoteSignalPlaceholder: 'Füge das JSON deines Peers ein. Drücke Strg+Enter (Cmd+Enter auf dem Mac) oder klicke auf Remote anwenden.',
    copyButton: 'Kopieren',
    copied: 'Kopiert!',
    copyFailed: 'Fehlgeschlagen',
    copyAriaLabel: 'Lokales Signal in die Zwischenablage kopieren',
    qrCodeLabel: 'QR-Code zum Verbinden',
    qrCodeDescription: 'Scanne diesen QR-Code mit dem entfernten Gerät, um direkt zu verbinden'
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
    charCount: (current, max) => `${current} / ${max}`,
    voiceButton: '🎤',
    voiceButtonRecording: '⏹',
    voiceButtonAriaLabel: 'Sprachnachricht aufnehmen',
    voiceButtonAriaLabelRecording: 'Aufnahme stoppen',
    voiceButtonTitle: 'Klicke, um Sprachnachricht aufzunehmen',
    voiceButtonTitleRecording: 'Klicke, um Aufnahme zu stoppen',
    settingsButton: '⚙️',
    settingsButtonAriaLabel: 'Einstellungen öffnen',
    settingsButtonTitle: 'Sprachmodell-Einstellungen'
  },
  voiceSettings: {
    title: 'Sprachmodell-Einstellungen',
    close: 'Schließen',
    closeAriaLabel: 'Einstellungen schließen',
    description: 'Wähle das Whisper-Modell für Spracherkennung. Kleinere Modelle sind schneller, größere sind genauer.',
    modelLabel: 'Whisper-Modell',
    models: {
      tinyEn: 'Tiny Englisch (schnell, ~75MB)',
      base: 'Base Multilingual (ausgewogen, ~150MB)'
    },
    loadingModel: 'Lade Modell...',
    modelLoaded: 'Modell geladen',
    modelError: 'Fehler beim Laden des Modells'
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
    answerApplied: 'Antwort angewendet, warte auf Kanal...',
    iceRestarting: 'ICE: Neustart läuft...',
    iceRestartFailed: 'ICE: Neustart fehlgeschlagen'
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
    languageChanged: (name) => `Sprache auf ${name} umgestellt.`,
    connectionClosed: 'Verbindung geschlossen.',
    noConnection: 'Keine aktive Verbindung zum Neustart.',
    cannotRestartNoRemote: 'ICE-Neustart nicht möglich: Keine entfernte Beschreibung vorhanden.',
    iceRestartStarted: 'ICE-Neustart gestartet...',
    iceRestartComplete: 'ICE-Neustart abgeschlossen. Teile das neue Signal mit deinem Peer.',
    iceRestartFailed: 'ICE-Neustart fehlgeschlagen.'
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
  franconiaIntro: {
    title: 'Willkommen bei Fränggisch!',
    close: 'Schließen',
    closeAriaLabel: 'Intro-Video schließen'
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
      started: 'Bildschirmfreigabe aktiv. Achte auf sensible Inhalte.',
      codecSelected: (codec) => `Verwende Codec: ${codec}`
    },
    quality: {
      label: 'Videoqualität',
      auto: 'Auto (Empfohlen)',
      low: 'Niedrig (500 kbps)',
      medium: 'Mittel (1.5 Mbps)',
      high: 'Hoch (4 Mbps)'
    },
    errors: {
      peerNotReady: 'Peer-Verbindung ist noch nicht bereit.',
      noVideoTrack: 'Keine Videospur aus der Bildschirmaufnahme erhalten.',
      permissionDenied: 'Berechtigung wurde verweigert.',
      failed: (reason) => `Bildschirmfreigabe fehlgeschlagen: ${reason}`
    },
    footnote: 'Bildschirmfreigabe ist rein Peer-to-Peer. Teile Zugriff nur mit Personen, denen du vertraust.'
  },
  voiceVideo: {
    header: 'Sprach-/Videoanruf',
    actions: {
      start: 'Anruf starten',
      startAria: 'Sprach-/Videoanruf starten',
      active: 'Anruf läuft...',
      stop: 'Anruf beenden',
      stopAria: 'Sprach-/Videoanruf beenden',
      toggleCamera: 'Kamera umschalten',
      toggleCameraAria: 'Kamera ein-/ausschalten',
      toggleMicrophone: 'Mikrofon umschalten',
      toggleMicrophoneAria: 'Mikrofon ein-/ausschalten'
    },
    status: {
      active: 'Anruf aktiv',
      ready: 'Bereit zum Anrufen',
      connect: 'Verbinde dich, um Anrufe zu aktivieren'
    },
    remote: {
      receiving: 'Empfange Video/Audio des Peers',
      idle: 'Peer sendet aktuell kein Video/Audio',
      title: 'Video des Peers',
      aria: 'Video-Stream des Peers',
      peerStarted: 'Peer hat den Anruf gestartet.',
      peerStopped: 'Peer hat den Anruf beendet.'
    },
    local: {
      title: 'Dein Video',
      aria: 'Eigene Videovorschau',
      placeholderReady: 'Starte den Anruf, um Video/Audio zu senden.',
      placeholderDisconnected: 'Verbinde dich mit einem Peer, um Anrufe zu aktivieren.'
    },
    messages: {
      stopped: 'Sprach-/Videoanruf beendet.',
      notSupported: 'Sprach-/Videoanrufe werden in diesem Browser nicht unterstützt.',
      started: 'Sprach-/Videoanruf aktiv.',
      nothingEnabled: 'Bitte aktiviere Kamera oder Mikrofon.',
      cameraOn: 'Kamera eingeschaltet.',
      cameraOff: 'Kamera ausgeschaltet.',
      microphoneOn: 'Mikrofon eingeschaltet.',
      microphoneOff: 'Mikrofon ausgeschaltet.'
    },
    errors: {
      peerNotReady: 'Peer-Verbindung ist noch nicht bereit.',
      permissionDenied: 'Berechtigung für Kamera/Mikrofon wurde verweigert.',
      failed: (reason) => `Sprach-/Videoanruf fehlgeschlagen: ${reason}`,
      cameraFailed: 'Fehler beim Aktivieren der Kamera.',
      microphoneFailed: 'Fehler beim Aktivieren des Mikrofons.'
    },
    footnote: 'Sprach-/Videoanrufe sind rein Peer-to-Peer verschlüsselt.'
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
    statusDisabledBurst: 'Fernsteuerung deaktiviert (Burst erkannt)',
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
      controlRevokedLocal: 'Fernsteuerung für deinen Bildschirm wurde beendet.',
      burstDetected: 'Schnelle Tastatureingabe erkannt – Fernsteuerung aus Sicherheitsgründen deaktiviert'
    }
  },
  videoQuality: {
    manualApplied: (preset) => `Videoqualität auf ${preset} gesetzt`,
    autoApplied: (bitrate) => `Videoqualität automatisch optimiert (${bitrate} kbps)`
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
  fileShare: {
    selectFile: 'Datei auswählen',
    sendFile: 'Datei senden',
    sendFileTitle: 'Datei zum Senden auswählen',
    channelReady: 'Dateifreigabe bereit.',
    channelNotReady: 'Dateifreigabe noch nicht bereit. Warte auf Verbindung.',
    invalidType: 'Ungültiger Dateityp. Erlaubt sind: Bilder (JPEG, PNG, GIF, WebP), Videos (MP4, WebM, OGG), Dokumente (PDF, TXT, MD).',
    tooLarge: 'Datei ist zu groß. Maximale Größe ist 50 MB.',
    rateLimitSend: 'Zu viele Dateien gesendet. Bitte warte eine Minute.',
    rateLimitReceive: 'Zu viele Dateien empfangen. Peer sendet zu schnell.',
    tooManyConcurrent: 'Zu viele gleichzeitige Dateiübertragungen.',
    sendFailed: 'Datei konnte nicht gesendet werden.',
    receiveFailed: 'Datei konnte nicht empfangen werden.',
    sentFile: 'Datei gesendet',
    receivedFile: 'Datei empfangen',
    videoMetadataWarning: 'Hinweis: Metadaten-Entfernung für Videos wird nicht unterstützt (zu rechenintensiv). Video wird ohne Änderung gesendet.',
    documentMetadataWarning: 'Hinweis: Metadaten-Entfernung für Dokumente wird nicht unterstützt. Dokument wird ohne Änderung gesendet.'
  },
  soundboard: {
    button: 'Soundboard',
    buttonTitle: 'Sound aus Soundboard senden',
    selectSound: 'Sound auswählen...',
    sounds: {
      fanfare: '🎺 Fanfare',
      drumroll: '🥁 Trommelwirbel',
      horn: '📯 Signalhorn',
      circus: '🎪 Zirkusmusik',
      jingle: '🎵 Erkennungsmelodie',
      bell: '🔔 Klingel',
      applause: '📢 Applaus',
      laugh: '😂 Lachkonserve',
      alarm: '⚠️ Alarmton',
      cheer: '🎉 Jubelschrei'
    }
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
      saveButton: 'Speichern',
      savedTitle: 'Gespeicherte Witze',
      showSaved: 'Gespeicherte anzeigen',
      hideSaved: 'Gespeicherte ausblenden',
      deleteButton: 'Löschen',
      alreadySaved: 'Bereits gespeichert',
      noSavedJokes: 'Noch keine Witze gespeichert',
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
        'Manche Menschen haben Albträume. Entwickler träumen von Production-Deployments am Freitagnachmittag.',
        'Warum haben Programmierer keine Freunde? Sie bevorzugen asynchrone Beziehungen.',
        'Ein Entwickler betritt eine Bar. Oder doch nicht? Die Antwort kommt in einem async Promise.',
        '"Ich ändere nur eine Zeile" - Grabinschrift eines Entwicklers, der die gesamte Datenbank gelöscht hat.',
        'Der Unterschied zwischen einem Virus und Windows? Viren funktionieren.',
        'Warum gehen Programmierer nie nach draußen? Die Sonne gibt zu viele Warnungen aus.',
        'Ein Array geht zum Arzt. Diagnose: Index out of bounds. Prognose: Fatal.',
        'Wie nennt man einen Entwickler nach dem Deployment? Arbeitslos.',
        'Rekursion: Siehe Rekursion. Wenn du das nicht verstehst, siehe Rekursion.',
        'Ein Pointer ging verloren. Er wurde nie gefunden. Segmentation fault (core dumped).',
        'Die einzige Person, die deine Commit-Messages liest, ist der Entwickler, der deinen Code debuggen muss.',
        'Git commit -m "fixed bug" - Die größte Lüge in der Softwareentwicklung.',
        'Warum sind Programmierer immer müde? Weil sie in Endlosschleifen arbeiten.',
        'Ein Developer ohne Kaffee ist wie eine Null ohne Einsen - komplett nutzlos.',
        'Der Tod eines Entwicklers: rm -rf / --no-preserve-root',
        'Warum weinen Programmierer? Weil sie ihre eigene Dokumentation lesen müssen.',
        'Ein Merge-Konflikt ist wie ein Familiendrama - alle behaupten, sie hätten Recht.',
        'Code-Reviews sind wie Autopsien - man findet immer etwas Totes.',
        '"It\'s not a bug, it\'s a feature" - Letzte Worte vor der Kündigung.',
        'Die Definition von Wahnsinn: npm install nach dem Löschen von node_modules.',
        'Ein Programm ohne Fehler? Das ist der Beweis, dass du nicht genug getestet hast.'
      ]
    },
    n8nExample: {
      title: 'n8n Beispiel des Tages',
      examples: [
        'Automatische Slack-Benachrichtigung bei neuen GitHub-Issues: Webhook → GitHub → Slack',
        'E-Mail-Anhänge automatisch in Google Drive speichern: Gmail → Filter → Google Drive',
        'Twitter-Tweets mit bestimmten Hashtags in Notion-Datenbank speichern: Twitter → Filter → Notion',
        'Automatische Backup-Erstellung von Datenbanken und Upload zu Dropbox: Cron → PostgreSQL → Dropbox',
        'Lead-Erfassung von Webformular zu CRM: Webhook → Validierung → HubSpot → Slack-Benachrichtigung',
        'Automatische Rechnungserstellung aus Google Sheets: Sheets → PDF generieren → E-Mail versenden',
        'Monitoring-Alert-System: HTTP Request → Bedingung → Telegram + PagerDuty',
        'Social Media Cross-Posting: RSS Feed → Filter → Twitter + LinkedIn + Facebook',
        'Kundenservice-Ticketsystem: E-Mail → Kategorisierung → Jira → Antwort-Template',
        'Automatische Datenanalyse-Reports: Cron → SQL-Abfrage → Chart erstellen → E-Mail mit PDF',
        'Kalender-Synchronisation zwischen verschiedenen Plattformen: Google Calendar → Microsoft Outlook',
        'Automatische Produktinventur-Überwachung: Shopify → Bestandsprüfung → Bestellauslöser bei niedrigem Bestand',
        'Content-Moderation-Pipeline: Webhook → Bildanalyse-API → Filter → Benachrichtigung bei Verstoß',
        'Automatische Meeting-Protokolle: Zoom → Transkription → Zusammenfassung → Notion',
        'IoT-Datenverarbeitung: MQTT → Datenfilterung → InfluxDB → Grafana-Dashboard-Update'
      ]
    }
  },
  pong: {
    challengeButton: 'Pong-Herausforderung starten',
    challengeButtonBusy: 'Pong läuft...',
    challengeButtonDisabled: 'Verbinde dich, um Pong zu spielen',
    title: 'Pong',
    gameStarted: 'Pong-Spiel gestartet! Nutze Pfeiltasten ↑/↓ um zu spielen.',
    challengeSent: 'Pong-Herausforderung gesendet! Warte auf Peer...',
    victory: 'Du hast gewonnen! Glückwunsch!',
    defeat: 'Du hast verloren! Besser beim nächsten Mal.',
    defeatMessage: 'Du hast mich geschlagen! Deine Pong-Fähigkeiten sind überlegen. Gut gespielt!',
    channelReady: 'Pong-Kanal bereit.',
    channelClosed: 'Pong-Kanal geschlossen.',
    channelError: 'Pong-Kanal Fehler aufgetreten.',
    instructions: 'Benutze ↑ und ↓ Pfeiltasten, um deinen Schläger zu bewegen. Jeder Spieler hat 3 Leben.',
    score: 'Punkte',
    lives: 'Leben',
    waitingForPeer: 'Warte auf Peer, um Pong zu spielen...',
    closeGame: 'Spiel beenden'
  },
  doom: {
    challengeButton: 'ASCII Doom spielen',
    challengeButtonBusy: 'Doom läuft...',
    title: '👾 ASCII Doom',
    gameStarted: 'Doom gestartet! Nutze Pfeiltasten oder WASD zum Bewegen.',
    gameStopped: 'Doom beendet.',
    channelReady: 'Doom-Kanal bereit.',
    channelClosed: 'Doom-Kanal geschlossen.',
    channelError: 'Doom-Kanal Fehler aufgetreten.',
    instructions: 'Pfeiltasten / WASD zum Bewegen und Drehen. LEERTASTE zum Start. ESC zum Beenden.',
    waitingForPeer: 'Warte auf Peer, um Doom zu spielen...',
    closeGame: 'Spiel beenden',
    ready: 'Doom ist bereit. Drücke LEERTASTE zum Starten!',
    noDisplay: 'Doom-Anzeige nicht gefunden'
  },
  trivia: {
    challengeButton: 'Trivia-Quiz starten',
    challengeButtonBusy: 'Quiz läuft...',
    challengeButtonDisabled: 'Verbinde dich, um Quiz zu spielen',
    title: 'Trivia-Quiz',
    selectQuestions: 'Anzahl Fragen wählen:',
    questionCount: (count) => `${count} ${count === 1 ? 'Frage' : 'Fragen'}`,
    gameStarted: 'Trivia-Quiz gestartet! Viel Erfolg!',
    challengeSent: 'Quiz-Herausforderung gesendet! Warte auf Peer...',
    victory: '🎉 Glückwunsch! Du hast gewonnen! 🏆',
    defeat: 'Schade! Der Peer hat gewonnen. Besser beim nächsten Mal! 💪',
    tie: '🤝 Unentschieden! Ihr seid beide Gewinner!',
    channelReady: 'Trivia-Kanal bereit.',
    channelClosed: 'Trivia-Kanal geschlossen.',
    channelError: 'Trivia-Kanal Fehler aufgetreten.',
    questionNumber: (current, total) => `Frage ${current} von ${total}`,
    category: 'Kategorie',
    timeRemaining: (seconds) => `⏱️ ${seconds}s`,
    selectAnswer: 'Wähle deine Antwort:',
    waitingForAnswer: 'Warte auf Antwort vom Peer...',
    bothAnswered: 'Beide haben geantwortet!',
    correctAnswer: '✓ Richtig!',
    wrongAnswer: '✗ Falsch!',
    noAnswer: '⊗ Keine Antwort',
    yourAnswer: 'Deine Antwort',
    peerAnswer: 'Peer Antwort',
    score: 'Punkte',
    yourScore: 'Deine Punkte',
    peerScore: 'Peer Punkte',
    summary: 'Zusammenfassung',
    finalScore: 'Endergebnis',
    correctAnswers: (count, total) => `${count} von ${total} richtig`,
    accuracy: (percent) => `Genauigkeit: ${percent}%`,
    playAgain: 'Nochmal spielen',
    closeGame: 'Quiz beenden',
    waitingForNextQuestion: 'Warte auf nächste Frage...',
    congratulations: '🎊 HERZLICHEN GLÜCKWUNSCH! 🎊',
    youWin: 'DU HAST GEWONNEN!',
    tieGame: 'UNENTSCHIEDEN!',
    wellPlayed: 'Gut gespielt!'
  },
  brainsPlan: {
    title: 'Brains Plan zur Weltherrschaft',
    newPlan: 'Neuer Plan',
    collapse: 'Einklappen',
    expand: 'Ausklappen'
  },
  dangerZone: {
    title: 'Gefahrenzone',
    warning: '⚠️ Achtung: Die folgenden Aktionen sind nicht rückgängig zu machen!',
    description: 'Diese Funktionen dienen als Notfall-Datenschutz. Verwende sie nur, wenn nötig.',
    clearLocalData: 'Alle lokalen Daten löschen',
    clearLocalDataDesc: 'Löscht Theme-Einstellungen, Sprachpräferenzen und Cache',
    clearSession: 'Sitzungsdaten löschen',
    clearSessionDesc: 'Löscht API-Schlüssel und trennt aktive Verbindungen',
    nuclearOption: 'Alles löschen & neu laden',
    nuclearOptionDesc: 'Löscht alle Daten und lädt die Seite neu (vollständiger Reset)',
    confirmModal: {
      title: 'Bestätigung erforderlich',
      clearLocalDataTitle: 'Alle lokalen Daten löschen?',
      clearLocalDataMessage: 'Dies wird unwiderruflich löschen:\n• Theme-Einstellungen\n• Sprachpräferenz\n• GitHub-Mitwirkenden-Cache\n\nAktive Verbindungen und API-Schlüssel bleiben erhalten.',
      clearSessionTitle: 'Sitzung löschen?',
      clearSessionMessage: 'Dies wird:\n• Alle API-Schlüssel entfernen\n• Aktive WebRTC-Verbindungen trennen\n• Sitzungsspezifische Daten löschen\n\nDeine gespeicherten Einstellungen bleiben erhalten.',
      nuclearTitle: 'Alles löschen?',
      nuclearMessage: 'WARNUNG: Dies ist der Notfall-Kill-Switch!\n\nDies wird ALLES löschen:\n• Alle lokalen Daten\n• Alle Sitzungsdaten\n• Alle Verbindungen\n• Alle Einstellungen\n\nDie Seite wird automatisch neu geladen.\n\nGib "LÖSCHEN" ein, um zu bestätigen:',
      confirmPlaceholder: 'Gib LÖSCHEN ein',
      confirmButton: 'Bestätigen',
      cancelButton: 'Abbrechen',
      typeMismatch: 'Bitte gib "LÖSCHEN" ein, um zu bestätigen'
    },
    systemMessages: {
      localDataCleared: 'Alle lokalen Daten wurden gelöscht. Einstellungen wurden zurückgesetzt.',
      sessionCleared: 'Sitzung wurde beendet. API-Schlüssel entfernt und Verbindungen getrennt.',
      nuclearExecuted: 'Vollständiger Reset durchgeführt. Seite wird neu geladen...'
    }
  },
  cookieConsent: {
    banner: {
      title: 'Cookie & Datenschutz',
      description: 'Wir verwenden localStorage und Cookies, um deine Einstellungen zu speichern und die App-Funktionalität zu gewährleisten. Weitere Informationen findest du in unserer Datenschutzerklärung.',
      acceptAll: 'Alle akzeptieren',
      rejectNonEssential: 'Nur Essentiell',
      settings: 'Einstellungen',
      settingsAriaLabel: 'Cookie-Einstellungen öffnen'
    },
    modal: {
      title: 'Datenschutz & Cookie-Einstellungen',
      close: 'Schließen',
      closeAriaLabel: 'Datenschutz-Dialog schließen',
      description: 'Diese App verwendet localStorage und Cookies, um deine Nutzererfahrung zu verbessern. Du kannst selbst entscheiden, welche Kategorien du zulassen möchtest.',
      savePreferences: 'Einstellungen speichern',
      acceptAll: 'Alle akzeptieren',
      rejectAll: 'Alle ablehnen',
      categories: {
        essential: {
          title: 'Essenziell',
          description: 'Erforderlich für grundlegende Funktionen wie die Verbindungs verwaltung. Kann nicht deaktiviert werden.',
          alwaysActive: 'Immer aktiv'
        },
        preferences: {
          title: 'Präferenzen',
          description: 'Speichert Theme-Auswahl (Hell/Dunkel/RGB) und Spracheinstellungen, um deine persönlichen Vorlieben zu erhalten.',
          items: [
            'Theme-Einstellung (localStorage: thecommunity.theme-preference)',
            'Spracheinstellung (localStorage: thecommunity.language-preference)'
          ]
        },
        statistics: {
          title: 'Statistiken',
          description: 'Ermöglicht das Caching von GitHub-Statistiken und Mitwirkenden-Informationen für eine bessere Performance.',
          items: [
            'GitHub-Statistiken-Cache (localStorage)',
            'Mitwirkenden-Cache (localStorage)'
          ]
        },
        easterEgg: {
          title: 'Easter Egg',
          description: 'Speichert ein Cookie für eine spielerische Umleitung zur Higgs-Analyse-Seite (10% Wahrscheinlichkeit bei Seitenaufruf).',
          items: [
            'Higgs-Redirect-Cookie (Cookie: higgs_redirect, 365 Tage)'
          ]
        },
        aiPreference: {
          title: 'KI-Präferenz',
          description: 'Speichert, ob du die OpenAI-Integration abgelehnt hast, damit du nicht jedes Mal gefragt wirst.',
          items: [
            'KI-Präferenz (localStorage: thecommunity.ai-preference)'
          ]
        }
      }
    },
    privacy: {
      title: 'Datenschutzerklärung',
      intro: 'TheCommunity (PodTalk) ist eine vollständig dezentrale Peer-to-Peer-Anwendung. Es gibt keinen Backend-Server.',
      dataCollection: {
        title: 'Welche Daten werden gespeichert?',
        description: 'Alle Daten werden ausschließlich lokal in deinem Browser gespeichert. Nichts wird an einen Server gesendet, außer:',
        items: [
          '**WebRTC-Verbindung**: Direktverbindung zu anderen Peers (P2P, kein Server beteiligt)',
          '**GitHub API**: Öffentliche Statistiken über Mitwirkende (nur Lesezugriff)',
          '**OpenAI API**: Nur wenn du einen API-Schlüssel eingibst und die KI-Funktion nutzt'
        ]
      },
      localStorage: {
        title: 'localStorage (Browser-Speicher)',
        items: [
          '**thecommunity.theme-preference**: Deine Theme-Auswahl (hell/dunkel/RGB)',
          '**thecommunity.language-preference**: Deine Sprachauswahl',
          '**thecommunity.ai-preference**: Ob du die KI-Funktion abgelehnt hast',
          '**thecommunity.cookie-consent**: Deine Cookie-Einstellungen',
          '**GitHub-Cache**: Zwischengespeicherte Statistiken (5 Minuten gültig)'
        ]
      },
      cookies: {
        title: 'Cookies',
        items: [
          '**higgs_redirect**: Easter-Egg-Cookie für Higgs-Analyse-Umleitung (365 Tage, SameSite=Strict)'
        ]
      },
      webrtc: {
        title: 'WebRTC & Netzwerk',
        description: 'Bei WebRTC-Verbindungen werden deine lokalen Netzwerkadressen (IP) an den Peer offengelegt. Dies ist technisch notwendig für P2P-Verbindungen. Teile Verbindungssignale nur mit vertrauenswürdigen Personen.'
      },
      thirdParty: {
        title: 'Externe Dienste',
        items: [
          '**OpenAI API**: Nur wenn du aktiv einen API-Schlüssel eingibst und die KI-Funktion nutzt',
          '**GitHub API**: Nur zum Laden öffentlicher Mitwirkenden-Informationen',
          '**CDN (React, QR-Code)**: Externe JavaScript-Bibliotheken'
        ]
      },
      yourRights: {
        title: 'Deine Rechte',
        description: 'Du kannst jederzeit:',
        items: [
          'Alle lokalen Daten in der "Gefahrenzone" löschen',
          'Deine Cookie-Einstellungen hier anpassen',
          'Den Browser-Speicher manuell löschen (F12 → Application → Clear Storage)'
        ]
      },
      contact: {
        title: 'Kontakt',
        description: 'Bei Fragen oder Anliegen zum Datenschutz, eröffne bitte ein Issue auf GitHub: https://github.com/TheMorpheus407/TheCommunity/issues'
      }
    }
  },
  rooms: {
    randomButton: 'Zufälliger Raum',
    randomButtonTitle: 'Zufälligen öffentlichen Raum beitreten',
    randomButtonAria: 'Einen zufälligen öffentlichen Chatroom beitreten',
    currentRoom: 'Aktueller Raum:',
    noRoom: 'Kein Raum',
    roomId: (id) => `Raum: ${id}`,
    publicRoomJoined: (roomId) => `Öffentlichem Raum "${roomId}" beigetreten. Erstelle ein Angebot oder warte auf eine Verbindung.`,
    roomCreated: (roomId) => `Raum "${roomId}" erstellt.`,
    passwordRequired: 'Dieser Raum erfordert ein Passwort.',
    passwordIncorrect: 'Falsches Passwort.',
    invalidInvite: 'Ungültiger Einladungslink oder falsches Passwort.',
    communityEnabled: 'Raum ist jetzt in der Community-Liste sichtbar.',
    communityDisabled: 'Raum aus der Community-Liste entfernt.',
    createRoom: {
      title: 'Raum-Einstellungen',
      allowRandom: 'Zufällige Nutzer dürfen beitreten',
      linkOnly: 'Nur mit Link beitreten',
      description: 'Bestimme, ob dieser Raum im "Zufällige Räume"-Feature auftauchen soll.',
      button: 'Neuen Raum erstellen',
      passwordLabel: 'Passwort (optional)',
      passwordPlaceholder: 'Raum-Passwort eingeben...',
      communityToggle: 'Als Community-Raum sichtbar machen',
      generateInviteButton: 'Einladungslink erstellen',
      inviteLink: 'Einladungslink:',
      copyInvite: 'Link kopieren',
      inviteCopied: 'Kopiert!',
      inviteCopyFailed: 'Fehler beim Kopieren'
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
        ariaLabel: 'Sproche auswähl\'n'
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
          placeholderDisconnected: 'Verbind disch mit \'nem Kumpel, um Glotzbüchse-Freigabe zu aktiviern.'
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
          placeholderDisconnected: 'Verbind dir mit \'nem Kumpel, um Flimmerkiste-Freigabe zu aktivieren.'
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
          placeholderDisconnected: 'Verbind dich mit \'nem Kumpel, um Kiekkasten-Freigabe zu aktiviere.'
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
  ale: {
    name: 'Alemannisch',
    replacements: [
      [/\bNicht\b/g, 'Nit'],
      [/\bnicht\b/g, 'nit'],
      [/\bIch\b/g, 'I'],
      [/\bich\b/g, 'i'],
      [/\bist\b/g, 'isch'],
      [/\bIst\b/g, 'Isch'],
      [/\bdas\b/g, 'des'],
      [/\bDas\b/g, 'Des'],
      [/\bdein\b/g, 'di'],
      [/\bDein\b/g, 'Di'],
      [/\bdeine\b/g, 'dini'],
      [/\bDeine\b/g, 'Dini'],
      [/\bauch\b/g, 'au'],
      [/\bAuch\b/g, 'Au'],
      [/\bfür\b/g, 'fer'],
      [/\bFür\b/g, 'Fer'],
      [/\bPeer\b/g, 'Gsell'],
      [/\bpeer\b/g, 'gsell']
    ],
    overrides: {
      mascot: {
        ariaLabel: 'Würschts Tux-Maskottli, schweb drüber, denn wird\'r arg wüescht'
      },
      app: {
        title: 'PodTalk'
      },
      about: {
        button: 'Über',
        buttonAriaLabel: 'Über des Projäkt',
        title: 'Über TheCommunity',
        description: 'Des isch e Peer-to-Peer-WebRTC-Chat-Awendig ohni Backend. D\'Community stüürt alles über GitHub-Issues.',
        contributorsTitle: 'Mitschaffer',
        contributorsIntro: 'Vergält\'s Gott allne, wo mit Issues mitgholfe hän:',
        loadingContributors: 'Lade Mitschaffer...',
        contributorsError: 'Mitschaffer-Lischt het nit chönne glade werde. Bitte später nomol probiere.',
        noIssues: 'No kei Issues. Mach eis uf, denn stohsch au bi de Credits.',
        issueCount: (count) => (count === 1 ? '1 Issue' : `${count} Issues`),
        close: 'Zueche',
        closeAriaLabel: 'Über-Dialog zueche'
      },
      offTopic: {
        button: 'Anderi Entwicklige',
        buttonAriaLabel: 'Anderi Entwicklige aaluege',
        title: 'Anderi Entwicklige',
        description: 'Do findsch Projäkt und Analyse, wo nit direkt mit dr Haupt-App z\'tue hän, aber trotzdem intressant sin.',
        close: 'Zueche',
        closeAriaLabel: 'Anderi-Entwicklige-Dialog zueche',
        higgsAnalysisTitle: 'Higgs-Boson-Analyse',
        higgsAnalysisDescription: 'E vollständigi High-Energy-Physics-Analyse vom Higgs-Boson-Entdeckigs-Kanal H→ZZ→4ℓ.',
        higgsAnalysisButton: 'H→ZZ→4ℓ Analyse →'
      },
      signaling: {
        title: 'Händischs Signalisiere',
        collapseAriaLabel: (collapsed) => (collapsed ? 'Signalisierig uufchlappe' : 'Signalisierig zueche'),
        securityNotice: 'Sicherheits-Hinwis:',
        securityWarning: 'S\'Teile vo WebRTC-Signal zeigt dini Netzwärk-Adrässe. Teil Aagebot numme mit Lüt, wo\'de vertrausch.',
        step1: 'Schritt 1: Eini Person druckt uf „Aagebot mache" und teilt des Signal, wo denn chunnt.',
        step2: 'Schritt 2: Di ander Person füegt\'s bi „Fremds Signal" ii, druckt uf „Remote aawände", denn uf „Antwort mache" und teilt ihri Antwort.',
        step3: 'Schritt 3: Di erscht Person füegt d\'Antwort bi „Fremds Signal" ii und wendet si aa. Dr Chat goht los, sobald „verbunde" aazeigt wird.',
        createOffer: 'Aagebot mache',
        createAnswer: 'Antwort mache',
        applyRemote: 'Remote aawände',
        disconnect: 'Tränne',
        disconnectAriaLabel: 'Verbindig zum Gsell tränne',
        working: 'Am schaffe...',
        localSignalLabel: 'Eigets Signal (des teile)',
        localSignalPlaceholder: 'S\'lokal SDP erschiint do, sobald\'s bereit isch.',
        remoteSignalLabel: 'Fremds Signal (überchunnets JSON do iifüege)',
        remoteSignalPlaceholder: 'Füeg s\'JSON vo dim Gsell ii. Druck Strg+Enter (Cmd+Enter uf em Mac) oder klick uf Remote aawände.',
        copyButton: 'Kopiere',
        copied: 'Kopiert!',
        copyFailed: 'Fählgschlage',
        copyAriaLabel: 'Eigets Signal i d\'Zwüscheablag kopiere',
        qrCodeLabel: 'QR-Code zum Verbinde',
        qrCodeDescription: 'Scann dä QR-Code mit em fremde Grät, zum direkt z\'verbinde'
      },
      chat: {
        title: 'Schwätze',
        addApiKey: 'OpenAI-Schlüssel hinzuefüege',
        updateApiKey: 'OpenAI-Schlüssel aktualisiere',
        themeToggle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return '🌞 Helle Modus';
            case 'rgb':
              return '🌈 RGB-Modus';
            case 'dark':
            default:
              return '🌙 Dungle Modus';
          }
        },
        themeToggleTitle: (nextTheme) => {
          switch (nextTheme) {
            case 'light':
              return 'Zum helle Theme wächsle';
            case 'rgb':
              return 'Zum RGB-Gaming-Modus wächsle';
            case 'dark':
            default:
              return 'Zum dungle Theme wächsle';
          }
        },
        clear: 'Leere',
        clearAriaLabel: 'Alli Chat-Nachrichta lösche',
        emptyState: 'No kei Nachrichta. Verbind di mit eme Gsell zum Schwätze.',
        roleLabels: {
          local: 'Du',
          remote: 'Gsell',
          system: 'Hinwis'
        },
        inputPlaceholder: 'Nachricht iigä...',
        inputAriaLabel: 'Nachricht-Iigab',
        aiButton: 'Mit KI umschriibe',
        aiButtonBusy: 'Am Umschriibe...',
        aiButtonNoKey: 'OpenAI-Schlüssel hinzuefüege zum KI aktiviere',
        aiButtonTitle: 'Los OpenAI e chlare Vorschlag fer dini Nachricht mache.',
        aiButtonTitleNoKey: 'Füeg di OpenAI-Schlüssel hinzue zum KI-Unterstützig aktiviere.',
        send: 'Schicke',
        sendAriaLabel: 'Nachricht schicke',
        sendTitle: 'Nachricht schicke',
        charCount: (current, max) => `${current} / ${max}`
      },
      apiKeyModal: {
        title: 'OpenAI-Integratschon',
        close: 'Zueche',
        closeAriaLabel: 'API-Schlüssel-Dialog zueche',
        description: 'Gib di persönliche OpenAI-API-Schlüssel ii zum optionali KI-Unterstützig aktiviere. Dr Schlüssel bliibt numme in däre Sitzig gspicheret und wird usschliesslich aa api.openai.com gschickt.',
        label: 'OpenAI-API-Schlüssel',
        placeholder: 'sk-...',
        hint: 'Gib API-Schlüssel nie uf nit vertrauenswürdige Grät ii. Aktualisier d\'Sitte oder deaktiviere d\'KI zum dr Schlüssel z\'entferne.',
        save: 'Schlüssel spichere',
        disable: 'KI deaktiviere',
        continueWithout: 'Ohni KI witerfahre'
      },
      status: {
        waiting: 'Warte uf Verbindig...',
        signalReady: 'Signal bereit zum Teile',
        ice: (state) => `ICE: ${state}`,
        connection: (state) => `Verbindig: ${state}`,
        creatingOffer: 'Am Aagebot mache...',
        creatingAnswer: 'Am Antwort mache...',
        remoteApplied: (type) => `Fremds ${type} aagwendet`,
        disconnected: 'Gtrännt',
        channelOpen: 'Kanal offe',
        channelClosed: 'Kanal zue',
        answerApplied: 'Antwort aagwendet, warte uf Kanal...'
      },
      systemMessages: {
        themeSwitch: (theme) => {
          switch (theme) {
            case 'dark':
              return 'Theme gwächselt zum dungle Modus.';
            case 'light':
              return 'Theme gwächselt zum helle Modus.';
            case 'rgb':
              return 'Theme gwächselt zum RGB-Gaming-Modus.';
            default:
              return `Theme gwächselt zu ${theme}.`;
          }
        },
        continueWithoutAi: 'Ohni KI-Unterstützig witerfahre. Du chasch später im Chat-Beriich e Schlüssel hinzuefüege.',
        apiKeyStored: 'OpenAI-Schlüssel numme i däre Browser-Sitzig gspicheret. Aktualisier d\'Sitte zum ne z\'entferne.',
        aiDisabled: 'KI-Unterstützig deaktiviert. Nachrichta werde ohni KI gschickt.',
        aiReady: 'OpenAI-Unterstützig bereit. Prüef Vorschläg vor em Schicke.',
        securityBlocked: 'Sicherheitsnotiz: Nit-textuelli Nachricht blockiert.',
        messageTooLong: (max) => `Nachricht blockiert: überschriitet s\'Limit vo ${max} Zeiche.`,
        rateLimit: 'Rate-Limit aktiv: Gsell schickt Nachrichta z\'schnäll.',
        channelBlocked: (label) => `Sicherheitsnotiz: Unerwartet Datekanal „${label || 'unbenannt'}" blockiert.`,
        createOfferFailed: 'Aagebot het nit chönne gmacht werde. Prüef Browser-Berechtigunge und WebRTC-Unterstützig.',
        remoteEmpty: 'Fremds Signal isch leer. Füeg s\'überchunne JSON ii.',
        remoteInvalidJson: 'Fremds Signal isch kei gültigs JSON. Kopier s\'vollständig Signal nomol.',
        remoteMissingData: 'Em fremde Signal fähle erforderlichi Date. Stell sicher, dass Aagebot oder Antwort unveränderet iigfüegt worde sind.',
        createAnswerFailed: 'Antwort het nit chönne gmacht werde. Wend zerscht e gültigs Aagebot aa und prüef d\'WebRTC-Unterstützig.',
        needOfferForAnswer: 'Zum e Antwort mache wird vorhär e Aagebot benötigt.',
        messageInputTooLong: (max, current) => `Nachricht z\'lang: Limit ${max} Zeiche (aktuell ${current}).`,
        disconnectNotice: 'Verbindig gtrännt. Mach e neus Aagebot zum erneut verbinde.',
        aiRewriteFailed: (error) => `KI-Umschriibig fählgschlage: ${error || 'Aafrog isch zruckgwiese worde.'}`,
        aiTruncated: 'KI-Vorschlag gchürzt zum s\'Zeichelimit iizhalte.',
        aiSuggestionApplied: 'KI-Vorschlag übernumme. Prüef vor em Schicke.',
        chatCleared: 'Chatverlauf glöscht.',
        aiRewriteNotAttempted: (max) => `KI-Umschriibig nit mögli: Entwürf müend unter ${max} Zeiche bliibe.`,
        languageChanged: (name) => `Sproch uf ${name} umgstellt.`
      },
      aiErrors: {
        emptyKey: 'Gib e OpenAI-API-Schlüssel ii zum d\'KI-Umschriibig aktiviere.',
        unauthorized: 'OpenAI het d\'Aafrog zruckgwiese. Prüef Schlüssel und Berechtigunge.',
        requestFailed: (status) => `OpenAI-Aafrog fählgschlage (Status ${status}).`,
        missingContent: 'Antwort vo OpenAI enthält kei Text.',
        emptySuggestion: 'OpenAI het kei Vorschlag glieferet.'
      },
      language: {
        label: 'Sproch',
        ariaLabel: 'Sproch uuswähle'
      },
      screenShare: {
        header: 'Bildschirm-Friigab',
        actions: {
          start: 'Friigab starte',
          startAria: 'Bildschirm friigä',
          sharing: 'Friigab lauft...',
          stop: 'Friigab beände',
          stopAria: 'Bildschirm-Friigab stoppe'
        },
        includeAudio: 'Systemaudio au iibzieh',
        status: {
          sharing: 'Teilt di Bildschirm',
          ready: 'Bereit zur Friigab',
          connect: 'Verbind di zum Bildschirm-Friigab aktiviere'
        },
        remote: {
          receiving: 'Am Bildschirm vom Gsell empfange',
          idle: 'Gsell teilt grad kei Bildschirm',
          title: 'Bildschirm vom Gsell',
          ariaInteractive: 'Vorschau vom Gsell-Bildschirm. Fokus setze zum schtüüre.',
          aria: 'Vorschau vom Gsell-Bildschirm',
          streamAria: 'Bildschirm-Stream vom Gsell',
          peerStarted: 'Gsell het d\'Bildschirm-Friigab gstartet.',
          peerStopped: 'Gsell het d\'Bildschirm-Friigab beändet.'
        },
        local: {
          title: 'Di Bildschirm',
          aria: 'Eigeti Bildschirm-Vorschau',
          placeholderReady: 'Start d\'Friigab zum di Bildschirm z\'schicke.',
          placeholderDisconnected: 'Verbind di mit eme Gsell zum Bildschirm-Friigab aktiviere.'
        },
        messages: {
          stopped: 'Bildschirm-Friigab beändet.',
          notSupported: 'Bildschirm-Friigab wird i dem Browser nit unterstützt.',
          started: 'Bildschirm-Friigab aktiv. Acht uf sensibli Inhalt.'
        },
        errors: {
          peerNotReady: 'Gsell-Verbindig isch no nit bereit.',
          noVideoTrack: 'Kei Videospur us dr Bildschirm-Ufnahm überchunne.',
          permissionDenied: 'Berechtigung isch verweigeret worde.',
          failed: (reason) => `Bildschirm-Friigab fählgschlage: ${reason}`
        },
        footnote: 'Bildschirm-Friigab isch rein Peer-to-Peer. Teil Zuegriff numme mit Lüt, wo\'de vertrausch.'
      },
      remoteControl: {
        label: 'Fernschteuerig:',
        actions: {
          allow: 'Fernschteuerig erlaube',
          disable: 'Fernschteuerig beände'
        },
        statusDisabled: 'Fernschteuerig deaktiviert',
        statusGranted: 'Fernschteuerig erlaubt – mit Bildschirm interagiere',
        statusDisabledByPeer: 'Fernschteuerig vom Gsell beändet',
        statusChannelClosed: 'Fernschteuerigs-Kanal gschlosse',
        statusDisabledInputLimit: 'Fernschteuerig deaktiviert (Iigabelimit erreicht)',
        statusEnabled: 'Fernschteuerig aktiv – Gsell derf schtüüre',
        statusUnavailable: 'Fernschteuerigs-Kanal nit verfüegbar',
        hints: {
          active: 'Fernschteuerig aktiv – beweg dr Cursor do zum interagiere.'
        },
        system: {
          disabledOnScreenStop: 'Fernschteuerig deaktiviert, will d\'Bildschirm-Friigab beändet worde isch.',
          revokeFailed: 'Gsell het nit chönne über di beändet Fernschteuerig informiert werde.',
          payloadTooLarge: 'Fernschteuerigs-Nachricht ignoriert: Nutzlast z\'gross.',
          rateLimited: 'Fernschteuerigs-Kanal gedrosslet. Z\'vieli Iigabe.',
          peerEnabled: 'Gsell het d\'Fernschteuerig erlaubt. Nutz d\'Vorschau zum Interagiere.',
          peerDisabled: 'Gsell het d\'Fernschteuerig deaktiviert.',
          deliveryFailed: 'Fernschteuerigs-Nachricht het nit chönne zuegstellt werde. Verbindig prüefe.',
          typingDisabled: 'Remote-Iigabe deaktiviert: Iigabelimit erreicht.',
          unavailable: 'Fernschteuerig isch erscht mögli, wenn dr Schteuerkanal bereit isch.',
          negotiating: 'Fernschteuerigs-Kanal verhandlet no. Bitte churz warte.',
          requiresScreenShare: 'Start zerscht d\'Bildschirm-Friigab zum Fernschteuerig aktiviere.',
          updateFailed: 'Fernschteuerigs-Status het nit chönne aktualisiert werde. Bitte erneut versuche.',
          peerCanControl: 'Di Gsell cha jetz di Bildschirm schtüüre. Bhalte d\'Aktivitäte im Aug.',
          controlRevokedLocal: 'Fernschteuerig fer di Bildschirm isch beändet worde.'
        }
      },
      imageShare: {
        selectImage: 'Bild uuswähle',
        sendImage: 'Bild schicke',
        sendImageTitle: 'Bild zum Schicke uuswähle',
        channelReady: 'Bildfriigab bereit.',
        channelNotReady: 'Bildfriigab no nit bereit. Warte uf Verbindig.',
        invalidType: 'Ungültige Bildtyp. Numme JPEG, PNG, GIF und WebP sind erlaubt.',
        tooLarge: 'Bild isch z\'gross. Maximali Gröss isch 5 MB.',
        rateLimitSend: 'Z\'vieli Bilder gschickt. Bitte wart e Minute.',
        rateLimitReceive: 'Z\'vieli Bilder empfange. Gsell schickt z\'schnäll.',
        tooManyConcurrent: 'Z\'vieli glychziitigi Bildübertraigunge.',
        sendFailed: 'Bild het nit chönne gschickt werde.',
        receiveFailed: 'Bild het nit chönne empfange werde.',
        sentImage: (fileName) => `Bild gschickt: ${fileName}`,
        receivedImage: (fileName) => `Bild empfange: ${fileName}`
      },
      fileShare: {
        selectFile: 'Datei uuswähle',
        sendFile: 'Datei schicke',
        sendFileTitle: 'Datei zum Schicke uuswähle',
        channelReady: 'Dateifriigab bereit.',
        channelNotReady: 'Dateifriigab no nit bereit. Warte uf Verbindig.',
        invalidType: 'Ungültige Dateityp. Erlaubt sind: Bilder (JPEG, PNG, GIF, WebP), Videos (MP4, WebM, OGG), Dokumänt (PDF, TXT, MD).',
        tooLarge: 'Datei isch z\'gross. Maximali Gröss isch 50 MB.',
        rateLimitSend: 'Z\'vieli Dateie gschickt. Bitte wart e Minute.',
        rateLimitReceive: 'Z\'vieli Dateie empfange. Gsell schickt z\'schnäll.',
        tooManyConcurrent: 'Z\'vieli glychziitigi Dateiübertraigunge.',
        sendFailed: 'Datei het nit chönne gschickt werde.',
        receiveFailed: 'Datei het nit chönne empfange werde.',
        sentFile: 'Datei gschickt',
        receivedFile: 'Datei empfange',
        videoMetadataWarning: 'Hiiwis: Metadate-Entfernig für Videos wird nit unterstützt (z\'recheintensiv). Video wird ohni Änderig gschickt.',
        documentMetadataWarning: 'Hiiwis: Metadate-Entfernig für Dokumänt wird nit unterstützt. Dokumänt wird ohni Änderig gschickt.'
      },
      soundboard: {
        button: 'Soundboard',
        buttonTitle: 'Sound us em Soundboard schicke',
        selectSound: 'Sound uuswähle...',
        sounds: {
          fanfare: '🎺 Fanfare',
          drumroll: '🥁 Trommelwirbel',
          horn: '📯 Signalhorn',
          circus: '🎪 Zirkusmusig',
          jingle: '🎵 Erkennigsmalodie',
          bell: '🔔 Glogge',
          applause: '📢 Applaus',
          laugh: '😂 Lachkonserve',
          alarm: '⚠️ Alarmton',
          cheer: '🎉 Jubelschrei'
        }
      },
      statistics: {
        title: 'KI-Statistik',
        header: 'Vo KI glösti Issues',
        loading: 'Am Statistike lade...',
        error: 'Statistike hän nit chönne glade werde.',
        noIssues: 'No kei vo KI glösti Issues gfunde.',
        issueNumber: (num) => `Issue #${num}`,
        status: {
          success: 'Erfolgriich glöst',
          failed: 'Probleem uufgtrete',
          pending: 'Am Bearbeite'
        },
        columns: {
          issue: 'Issue',
          title: 'Titel',
          summary: 'Zämmefassig',
          status: 'Status'
        },
        summaryPlaceholder: 'Zämmefassig wird glade...',
        summaryError: 'Zämmefassig nit verfüegbar',
        aiSummaryNote: 'KI-Zämmefassige werde generiert, wenn e OpenAI-Schlüssel verfüegbar isch.',
        cachedNote: 'Date werde 5 Minute zwüschegspicheret.',
        joke: {
          title: 'Makabere Witz vom Tag',
          jokes: [
            'Wurum möge Programmierer d\'Natur nit? Z\'vieli Bugs.',
            'E Entwickler isch gstorbe. Si letscht Wort: "Es funktioniert uf minere Maschine..."',
            'Wie vieli Programmierer brucht\'s zum e Glüehbirne wächsle? Kei. Des isch e Hardware-Problem.',
            'Dr schlimmst Bug isch dä, wo\'de scho behobbe hesch... i eme andere Branch.',
            'E SQL-Query goht i e Bar, gseht zwei Tabelle und frogt: "Derf i joinen?"',
            'Debugge isch wie e Detektivfilm, wo\'de gliichzitig Mörder und Detektiv bisch.',
            'Es git numme zwei hert Problem i dr Informatik: Cache-Invalidierig, Name vergä und Off-by-One-Fähler.',
            'S\'einzig, wo schlimmer isch als Legacy-Code, isch Code, wo\'de sälber vor 6 Mönet gschriibe hesch.',
            '"Es isch numme e chline Fix" - Berüehmti letschti Wort vor 3 Täg Debugge.',
            'Manchi Lüt hän Alpträum. Entwickler träume vo Production-Deployments am Fritignochmittag.',
            'Wurum hän Programmierer kei Fründe? Si bevorzuged asynchroni Beziehige.',
            'E Entwickler chunnt i e Bar. Oder doch nit? D\'Antwort chunnt i eme async Promise.',
            '"I ändere numme ei Ziili" - Grabischrift vomene Entwickler, wo di ganz Datebank glöscht het.',
            'Dr Unterschied zwüsche eme Virus und Windows? Vire funktioniered.',
            'Wurum gönd Programmierer nie uuse? D\'Sunne git z\'vieli Warnige uus.',
            'Es Array goht zum Arzt. Diagnose: Index out of bounds. Prognose: Fatal.',
            'Wie nennt me e Entwickler nach em Deployment? Arbeitslos.',
            'Rekursion: Gseh Rekursion. Wenn\'de des nit verstohsch, gseh Rekursion.',
            'E Pointer isch verlore gange. Er isch nie gfunde worde. Segmentation fault (core dumped).',
            'Di einzig Person, wo dini Commit-Messages liest, isch dr Entwickler, wo din Code debugge mues.',
            'Git commit -m "fixed bug" - Di grösst Lüüg i dr Softwareentwicklig.',
            'Wurum sind Programmierer immer müed? Will si i Endlosschlaufe schaffe.',
            'E Developer ohni Kafi isch wie e Null ohni Oise - komplett nutzlos.',
            'Dr Tod vomene Entwickler: rm -rf / --no-preserve-root',
            'Wurum brüele Programmierer? Will si ihri eigeni Dokumentation müend läse.',
            'E Merge-Konflikt isch wie e Familiendrama - alli behaupte, si hätted Rächt.',
            'Code-Reviews sind wie Autopsie - me findet immer öppis Tots.',
            '"It\'s not a bug, it\'s a feature" - Letschti Wort vor dr Kündig.',
            'D\'Definitio vo Wahnsinn: npm install nach em Lösche vo node_modules.',
            'Es Programm ohni Fähler? Des isch dr Bewis, dass\'de nit gnueg testet hesch.'
          ]
        },
        n8nExample: {
          title: 'n8n Bispiil vom Tag',
          examples: [
            'Automatischi Slack-Benachrichtigung bi neue GitHub-Issues: Webhook → GitHub → Slack',
            'E-Mail-Aahäng automatisch i Google Drive speichere: Gmail → Filter → Google Drive',
            'Twitter-Tweets mit bestimmte Hashtags i Notion-Datebank speichere: Twitter → Filter → Notion',
            'Automatischi Backup-Erstellig vo Datebanke und Upload zu Dropbox: Cron → PostgreSQL → Dropbox',
            'Lead-Erfassig vo Webformular zu CRM: Webhook → Validierig → HubSpot → Slack-Benachrichtigung',
            'Automatischi Rechnigserstellig us Google Sheets: Sheets → PDF generiere → E-Mail versände',
            'Monitoring-Alert-System: HTTP Request → Bedingig → Telegram + PagerDuty',
            'Social Media Cross-Posting: RSS Feed → Filter → Twitter + LinkedIn + Facebook',
            'Kundeservice-Ticketsystem: E-Mail → Kategorisierig → Jira → Antwort-Template',
            'Automatischi Dateanalyse-Reports: Cron → SQL-Abfrog → Chart erstelle → E-Mail mit PDF',
            'Kalender-Synchronisierig zwüsche verschiedene Plattforme: Google Calendar → Microsoft Outlook',
            'Automatischi Produktinventur-Überwaachig: Shopify → Bestandsprüefig → Bestelluslöser bi niedrigem Bestand',
            'Content-Moderation-Pipeline: Webhook → Bildanalyse-API → Filter → Benachrichtigung bi Verstoss',
            'Automatischi Meeting-Protokoll: Zoom → Transkription → Zämmefassig → Notion',
            'IoT-Dateverarbeitig: MQTT → Datefilterig → InfluxDB → Grafana-Dashboard-Update'
          ]
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
      offTopic: {
        button: 'Annere Entwigglungen',
        buttonAriaLabel: 'Annere Entwigglungen ooschaung',
        title: 'Annere Entwigglungen',
        description: 'Do findsd Broggd und Analysen, die ned direkd zur Haubd-App ghörn, abber trotzdem ganz schee indaressand senn.',
        close: 'Zumachn',
        closeAriaLabel: 'Annere-Entwigglungen-Dialog zumachn',
        higgsAnalysisTitle: 'Higgs-Boson-Analyse',
        higgsAnalysisDescription: 'A vollschdändiche High-Energy-Physics-Analyse vom Higgs-Boson-Enddeggungs-Kanal H→ZZ→4ℓ.',
        higgsAnalysisButton: 'H→ZZ→4ℓ Analyse →'
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
        copyAriaLabel: 'Eigns Signal in Zwischenspeicha kopiern',
        qrCodeLabel: 'QR-Code zum Verbindn',
        qrCodeDescription: 'Scann den QR-Code mit dem fremdn Grät, zum direkt z\'verbindn'
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
      fileShare: {
        selectFile: 'Datei aussuchn',
        sendFile: 'Datei schickn',
        sendFileTitle: 'Datei zum Schickn aussuchn',
        channelReady: 'Dateifreigebm bereit.',
        channelNotReady: 'Dateifreigebm no ned soweit.',
        invalidType: 'Falscha Datei-Typ. Erlaubt: Bildla (JPEG, PNG, GIF, WebP), Videos (MP4, WebM, OGG), Dokumente (PDF, TXT, MD).',
        tooLarge: 'Datei z\'groß. Max 50 MB.',
        rateLimitSend: 'Z\'vui Dateien gschickd. Wart a Minud.',
        rateLimitReceive: 'Peer schickd z\'vui Dateien.',
        tooManyConcurrent: 'Z\'vui gleichzeidige Übertragungen.',
        sendFailed: 'Datei konnt ned gschickd werdn.',
        receiveFailed: 'Datei konnt ned emfpangd werdn.',
        sentFile: 'Datei gschickd',
        receivedFile: 'Datei kriagt',
        videoMetadataWarning: 'Hinweis: Metadatn-Entfernung bei Videos gehd ned (z\'rechninddensiv). Video werd ohne Änderung gschickd.',
        documentMetadataWarning: 'Hinweis: Metadatn-Entfernung bei Dokumentn gehd ned. Dokument werd ohne Änderung gschickd.'
      },
      soundboard: {
        button: 'Soundboard',
        buttonTitle: 'Sound vom Soundboard schickn',
        selectSound: 'Sound aussuchn...',
        sounds: {
          fanfare: '🎺 Tusch',
          drumroll: '🥁 Trommelwirbel',
          horn: '📯 Signalhorn',
          circus: '🎪 Zirkusmusi',
          jingle: '🎵 Erkennungsmelodie',
          bell: '🔔 Glocke',
          applause: '📢 Applaus',
          laugh: '😂 Lachkonserve',
          alarm: '⚠️ Alarmton',
          cheer: '🎉 Jubelschrei'
        }
      },
      franconiaIntro: {
        title: 'Willkumm beim Fränggischn!',
        close: 'Zumachn',
        closeAriaLabel: 'Intro-Video zumachn'
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
            'Manch Leit träum von Albtraum. Entwickla träum vom Friday-Deploy.',
            'Warum ham Programmiera koa Freind? Die mögn liaber async Beziehungn.',
            'A Entwickla gehd in a Bar. Oda doch ned? D\'Antwort kummd in am async Promise.',
            '"I ändar nur oa Zeiln" - Grabinschrift vo am Entwickla, der\'d ganze Datebank glöscht hod.',
            'Der Unterschiad zwischen am Virus und Windows? Viren funktionieren.',
            'Warum gänga Programmiera nia aussi? D\'Sunn git z\'vui Warnungen aus.',
            'A Array gehd zum Dokta. Diagnose: Index out of bounds. Prognose: Fatal.',
            'Wia nennst an Entwickla nachn Deployment? Arbeitslos.',
            'Rekursion: Schau Rekursion. Wennd des ned verstehsd, schau Rekursion.',
            'A Pointer is verloren gangn. Is nia gfundn worn. Segmentation fault (core dumped).',
            'Die oinzge Person, die dei Commit-Messages liest, is der Entwickla, der dein Code debuggen muss.',
            'Git commit -m "fixed bug" - Die grösste Lügn in da Softwareentwicklung.',
            'Warum san Programmiera imma müad? Weil sie in Endlosschleifen schaffen.',
            'A Developer ohne Kaffee is wia a Null ohne Oansa - komplett nutzlos.',
            'Der Tod vo am Entwickla: rm -rf / --no-preserve-root',
            'Warum heulen Programmiera? Weils ihre eigane Doku lesn müassn.',
            'A Merge-Konflikt is wia a Familiendrama - olle behaupten, sie hättn Recht.',
            'Code-Reviews san wia Obduktionen - ma findet imma was Totes.',
            '"It\'s not a bug, it\'s a feature" - Letzte Wort vorm Rausschmiss.',
            'Die Definition vo Wahnsinn: npm install nochn Löschn vo node_modules.',
            'A Programm ohne Fehla? Des is da Beweis, dassd ned gnua testet hosd.'
          ]
        },
        n8nExample: {
          title: 'n8n Beispul vom Dog',
          examples: [
            'Automatisch Slack-Benachrichtigung bei neie GitHub-Issues: Webhook → GitHub → Slack',
            'E-Mail-Aahäng automatisch in Google Drive speichern: Gmail → Filter → Google Drive',
            'Twitter-Tweets mit bestimmte Hashtags in Notion-Datenbank speichern: Twitter → Filter → Notion',
            'Automatisch Backup-Erstellung vo Datenbanke und Upload zu Dropbox: Cron → PostgreSQL → Dropbox',
            'Lead-Erfassung vo Webformular zu CRM: Webhook → Validierung → HubSpot → Slack-Benachrichtigung',
            'Automatisch Rechnungserstellung aus Google Sheets: Sheets → PDF generieren → E-Mail verschicka',
            'Monitoring-Alert-System: HTTP Request → Bedingung → Telegram + PagerDuty',
            'Social Media Cross-Posting: RSS Feed → Filter → Twitter + LinkedIn + Facebook',
            'Kundenservice-Ticketsystem: E-Mail → Kategorisierung → Jira → Antwort-Template',
            'Automatisch Datenanalyse-Reports: Cron → SQL-Abfrag → Chart erstella → E-Mail mit PDF',
            'Kalender-Synchronisation zwischn verschieden Plattforma: Google Calendar → Microsoft Outlook',
            'Automatisch Produktinventur-Überwachung: Shopify → Bestandsprüfung → Bestellauslöser bei niedrigem Bestand',
            'Content-Moderation-Pipeline: Webhook → Bildanalyse-API → Filter → Benachrichtigung bei Verstoß',
            'Automatisch Meeting-Protokoll: Zoom → Transkription → Zsammafassung → Notion',
            'IoT-Datenverarbeitung: MQTT → Datenfilterung → InfluxDB → Grafana-Dashboard-Update'
          ]
        }
      }
    }
  }
};

// International Language Translations
const englishTranslation = Object.freeze({
  name: 'English',
  mascot: {
    ariaLabel: 'Friendly dolphin mascot, hover to see animation'
  },
  app: {
    title: 'PodTalk'
  },
  menu: {
    ariaLabel: 'Main navigation',
    about: 'About',
    help: 'Help',
    impressum: 'Imprint',
    issues: 'Other Developments',
    versionHistory: 'Version History'
  },
  help: {
    button: 'Help',
    buttonAriaLabel: 'Open help',
    title: 'Help',
    description: 'Welcome to PodTalk! This application enables peer-to-peer communication via WebRTC without backend servers.',
    howToConnect: 'How to connect?',
    howToConnectSteps: [
      'One person creates an "offer" and shares the signal with the other peer (e.g., via a secure channel like Signal or WhatsApp).',
      'The second person pastes the signal, applies it, creates an "answer," and shares it back.',
      'The first person pastes the answer and applies it. The connection establishes automatically.'
    ],
    features: 'Available features:',
    featuresList: [
      'Text Chat: Send messages in real-time',
      'Image Sharing: Share images with your peer',
      'Screen Sharing: Show your screen',
      'Remote Control: Control your peer\'s screen (with permission)',
      'Games: Play Pong, Trivia, Flappy Bird, or Chess together',
      'AI Assistant: Use OpenAI or Ollama for AI-powered responses',
      'Voice Messages: Record and transcribe voice messages'
    ],
    security: 'Security:',
    securityNote: 'All communication happens directly between peers via encrypted WebRTC connections. There is no central server storing your data.',
    feedback: 'Give Feedback:',
    feedbackNote: 'Have suggestions or found a bug? Open an issue on GitHub!',
    feedbackButton: '📝 Create Issue',
    feedbackButtonAriaLabel: 'Open GitHub to create an issue',
    close: 'Close',
    closeAriaLabel: 'Close help dialog'
  },
  impressum: {
    button: 'Imprint',
    buttonAriaLabel: 'Open imprint',
    title: 'Imprint',
    projectInfo: 'Project Information',
    projectName: 'PodTalk / TheCommunity',
    projectDescription: 'This is an open-source community project entirely steered via GitHub Issues.',
    responsibility: 'Responsible for content:',
    communityDriven: 'Community-driven via GitHub',
    repository: 'GitHub Repository:',
    repositoryLink: 'https://github.com/TheMorpheus407/TheCommunity',
    license: 'License:',
    licenseInfo: 'This project is open source. Please see the license terms in the repository.',
    contact: 'Contact:',
    contactInfo: 'For questions or suggestions, please open an issue on GitHub.',
    disclaimer: 'Disclaimer:',
    disclaimerText: 'This application is provided without any warranty. Use at your own risk. As this is a P2P application without a backend, the project maintainers have no access to your connections or data.',
    privacy: 'Privacy:',
    privacyText: 'No data is stored on a server. All communication happens directly between peers. Local settings are only stored in your browser (localStorage).',
    close: 'Close',
    closeAriaLabel: 'Close imprint dialog'
  },
  about: {
    button: 'About',
    buttonAriaLabel: 'About this project',
    title: 'About TheCommunity',
    description: 'This is a peer-to-peer WebRTC chat application with no backend. The community controls everything via GitHub issues.',
    contributorsTitle: 'Contributors',
    contributorsIntro: 'Thanks to everyone who contributed by creating issues:',
    loadingContributors: 'Loading contributors...',
    contributorsError: 'Could not load contributors list. Please try again later.',
    noIssues: 'No issues yet. Open one to appear in the credits.',
    issueCount: (count) => (count === 1 ? '1 issue' : `${count} issues`),
    close: 'Close',
    closeAriaLabel: 'Close about dialog'
  },
  offTopic: {
    button: 'Other Developments',
    buttonAriaLabel: 'View other developments',
    title: 'Other Developments',
    description: 'Here you can find projects and analyses not directly related to the main application, but still interesting.',
    close: 'Close',
    closeAriaLabel: 'Close other developments dialog',
    higgsAnalysisTitle: 'Higgs Boson Analysis',
    higgsAnalysisDescription: 'A complete high-energy physics analysis of the Higgs boson discovery channel H→ZZ→4ℓ.',
    higgsAnalysisButton: 'H→ZZ→4ℓ Analysis →'
  },
  versionHistory: {
    button: 'Version History',
    buttonAriaLabel: 'Open version history',
    title: 'Version History',
    description: 'Here you can view all versions of the application and compare changes between versions.',
    close: 'Close',
    closeAriaLabel: 'Close version history dialog',
    loading: 'Loading version history...',
    loadError: 'Could not load version history.',
    currentVersion: 'Current Version',
    current: 'current',
    allVersions: 'All Versions',
    changes: 'Changes:',
    viewDetails: 'View Details',
    deselect: 'Deselect',
    compareWith: 'Compare with',
    cancelCompare: 'Cancel Comparison',
    comparisonTitle: 'Version Comparison'
  },
  signaling: {
    title: 'Manual Signaling',
    collapseAriaLabel: (collapsed) => (collapsed ? 'Expand signaling' : 'Collapse signaling'),
    securityNotice: 'Security Notice:',
    securityWarning: 'Sharing WebRTC signals reveals your network addresses. Only share offers with trusted peers.',
    step1: 'Step 1: One person clicks "Create Offer" and shares the signal that appears below.',
    step2: 'Step 2: The other person pastes it into "Remote Signal," clicks "Apply Remote," then "Create Answer," and shares their answer.',
    step3: 'Step 3: The first person pastes the answer into "Remote Signal" and applies it. Chat starts when the status shows "connected."',
    createOffer: 'Create Offer',
    createAnswer: 'Create Answer',
    applyRemote: 'Apply Remote',
    disconnect: 'Disconnect',
    disconnectAriaLabel: 'Disconnect from peer',
    restartIce: 'Restart ICE',
    restartIceAriaLabel: 'Restart ICE connection',
    working: 'Working...',
    localSignalLabel: 'Local Signal (share this)',
    localSignalPlaceholder: 'The local SDP will appear here once ready.',
    remoteSignalLabel: 'Remote Signal (paste received JSON here)',
    remoteSignalPlaceholder: 'Paste your peer\'s JSON. Press Ctrl+Enter (Cmd+Enter on Mac) or click Apply Remote.',
    copyButton: 'Copy',
    copied: 'Copied!',
    copyFailed: 'Failed',
    copyAriaLabel: 'Copy local signal to clipboard',
    qrCodeLabel: 'QR Code to Connect',
    qrCodeDescription: 'Scan this QR code with the remote device to connect directly'
  },
  chat: {
    title: 'Chat',
    addApiKey: 'Add OpenAI Key',
    updateApiKey: 'Update OpenAI Key',
    themeToggle: (nextTheme) => {
      switch (nextTheme) {
        case 'light':
          return '🌞 Light Mode';
        case 'rgb':
          return '🌈 RGB Mode';
        case 'cat':
          return '🐱 Cat Mode';
        case 'dark':
        default:
          return '🌙 Dark Mode';
      }
    },
    themeToggleTitle: (nextTheme) => {
      switch (nextTheme) {
        case 'light':
          return 'Switch to light theme';
        case 'rgb':
          return 'Switch to RGB gaming mode';
        case 'cat':
          return 'Switch to cat theme';
        case 'dark':
        default:
          return 'Switch to dark theme';
      }
    },
    clear: 'Clear',
    clearAriaLabel: 'Clear all chat messages',
    emptyState: 'No messages yet. Connect with a peer to start chatting.',
    roleLabels: {
      local: 'You',
      remote: 'Peer',
      system: 'Notice'
    },
    inputPlaceholder: 'Type a message...',
    inputAriaLabel: 'Message input',
    aiButton: 'Rewrite with AI',
    aiButtonBusy: 'Rewriting...',
    aiButtonNoKey: 'Add OpenAI key to enable AI',
    aiButtonTitle: 'Let OpenAI suggest a clearer version of your message.',
    aiButtonTitleNoKey: 'Add your OpenAI key to enable AI assistance.',
    send: 'Send',
    sendAriaLabel: 'Send message',
    sendTitle: 'Send message',
    charCount: (current, max) => `${current} / ${max}`,
    voiceButton: '🎤',
    voiceButtonRecording: '⏹',
    voiceButtonAriaLabel: 'Record voice message',
    voiceButtonAriaLabelRecording: 'Stop recording',
    voiceButtonTitle: 'Click to record voice message',
    voiceButtonTitleRecording: 'Click to stop recording',
    settingsButton: '⚙️',
    settingsButtonAriaLabel: 'Open settings',
    settingsButtonTitle: 'Voice model settings'
  },
  voiceSettings: {
    title: 'Voice Model Settings',
    close: 'Close',
    closeAriaLabel: 'Close settings',
    description: 'Choose the Whisper model for voice recognition. Smaller models are faster, larger ones are more accurate.',
    modelLabel: 'Whisper Model',
    models: {
      tinyEn: 'Tiny English (fast, ~75MB)',
      base: 'Base Multilingual (balanced, ~150MB)'
    },
    loadingModel: 'Loading model...',
    modelLoaded: 'Model loaded',
    modelError: 'Error loading model'
  },
  apiKeyModal: {
    title: 'OpenAI Integration',
    close: 'Close',
    closeAriaLabel: 'Close API key dialog',
    description: 'Enter your personal OpenAI API key to enable optional AI assistance. The key is only stored in this session and sent exclusively to api.openai.com.',
    label: 'OpenAI API Key',
    placeholder: 'sk-...',
    hint: 'Never enter API keys on untrusted devices. Refresh the page or disable AI to remove the key.',
    save: 'Save Key',
    disable: 'Disable AI',
    errorInvalid: 'Please enter a valid API key.',
    errorNetwork: 'Network error. Please check your connection.',
    providerLabel: 'AI Provider',
    providers: {
      openai: 'OpenAI',
      ollama: 'Ollama (Local)'
    },
    ollamaEndpoint: 'Ollama Endpoint',
    ollamaEndpointPlaceholder: 'http://localhost:11434',
    ollamaEndpointHint: 'Enter your Ollama server URL (default: http://localhost:11434)'
  },
  cookieConsent: {
    title: 'Cookie Preferences',
    description: 'We use localStorage to remember your preferences. Choose which categories to enable:',
    categories: {
      essential: 'Essential',
      essentialDescription: 'Required for basic functionality',
      preferences: 'Preferences',
      preferencesDescription: 'Theme, language, and UI settings',
      statistics: 'Statistics',
      statisticsDescription: 'Anonymous usage statistics',
      easterEgg: 'Easter Eggs',
      easterEggDescription: 'Fun surprises and special features',
      aiPreference: 'AI Preferences',
      aiPreferenceDescription: 'AI provider and model choices'
    },
    acceptAll: 'Accept All',
    acceptSelected: 'Accept Selected',
    rejectAll: 'Reject All'
  },
  language: {
    label: 'Language',
    ariaLabel: 'Select language'
  },
  status: {
    waiting: 'Waiting for connection',
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    failed: 'Connection failed',
    channelClosed: 'Channel closed',
    channelOpen: 'Channel open',
    iceRestarting: 'ICE: Restarting...',
    iceRestartFailed: 'ICE: Restart failed'
  },
  systemMessages: {
    connected: 'Connected to peer.',
    disconnected: 'Disconnected from peer.',
    channelOpened: 'Chat channel opened.',
    channelClosed: 'Chat channel closed.',
    connectionFailed: 'Connection failed.',
    themeSwitch: (theme) => `Switched to ${theme} theme.`,
    languageChanged: (name) => `Language changed to ${name}.`,
    connectionClosed: 'Connection closed.',
    noConnection: 'No active connection to restart.',
    cannotRestartNoRemote: 'Cannot restart ICE without remote description.',
    iceRestartStarted: 'ICE restart initiated...',
    iceRestartComplete: 'ICE restart complete. Share the new signal with your peer.',
    iceRestartFailed: 'ICE restart failed.',
    cleared: 'Chat cleared.',
    imageSent: 'Image sent.',
    imageReceived: 'Image received from peer.',
    imageTransferStart: (filename) => `Sending image: ${filename}`,
    imageTransferProgress: (percent) => `Image transfer: ${percent}% complete`,
    imageTransferComplete: 'Image transfer complete.',
    imageTransferFailed: 'Image transfer failed.',
    aiRewriteSuccess: 'AI rewrote your message.',
    aiRewriteError: 'AI rewrite failed. Please try again.',
    voiceRecordingStarted: 'Voice recording started...',
    voiceRecordingStopped: 'Voice recording stopped.',
    voiceTranscriptionInProgress: 'Transcribing voice...',
    voiceTranscriptionComplete: 'Transcription complete.',
    voiceTranscriptionError: 'Transcription failed.',
    publicRoomJoined: (roomId) => `Joined public room: ${roomId}`
  },
  errors: {
    rateLimitExceeded: 'Message rate limit exceeded. Please slow down.',
    messageTooLong: (max) => `Message too long. Maximum ${max} characters allowed.`,
    channelNotOpen: 'Cannot send message. Channel is not open.',
    invalidMessage: 'Invalid message format.',
    imageTooBig: (maxMB) => `Image too large. Maximum size is ${maxMB}MB.`,
    imageTypeNotAllowed: 'Image type not allowed. Please use JPEG, PNG, GIF, or WebP.',
    imageTransferFailed: 'Image transfer failed.',
    genericError: 'An error occurred.'
  },
  remoteControl: {
    title: 'Remote Control',
    statusDisabled: 'Remote control: Disabled',
    statusRequested: 'Remote control: Permission requested',
    statusActive: 'Remote control: Active',
    enableButton: 'Enable Remote Control',
    disableButton: 'Disable Remote Control',
    description: 'Allow your peer to control your mouse and keyboard within this app.',
    securityWarning: 'Only enable this with trusted peers!'
  },
  screenShare: {
    title: 'Screen Share',
    startButton: 'Start Screen Share',
    stopButton: 'Stop Screen Share',
    status: 'Screen sharing active'
  },
  imageTransfer: {
    title: 'Image Sharing',
    selectButton: 'Select Image',
    sending: 'Sending image...',
    receiving: 'Receiving image...'
  },
  games: {
    pong: {
      title: 'Pong',
      start: 'Start Pong',
      waiting: 'Waiting for peer...',
      playing: 'Playing Pong',
      score: (left, right) => `${left} : ${right}`
    },
    trivia: {
      title: 'Trivia',
      start: 'Start Trivia',
      waiting: 'Waiting for peer...',
      playing: 'Playing Trivia',
      score: (score) => `Score: ${score}`
    },
    flappyBird: {
      title: 'Flappy Bird',
      start: 'Start Flappy Bird',
      playing: 'Playing Flappy Bird',
      score: (score) => `Score: ${score}`
    },
    chess: {
      title: 'Chess',
      start: 'Start Chess',
      waiting: 'Waiting for peer...',
      playing: 'Playing Chess',
      yourTurn: 'Your turn',
      opponentTurn: 'Opponent\'s turn'
    },
    doom: {
      title: 'ASCII Doom',
      start: 'Start Doom',
      playing: 'Playing Doom',
      instructions: 'Arrow Keys / WASD to move and turn. SPACE to start. ESC to exit.'
    }
  },
  rooms: {
    title: 'Public Rooms',
    description: 'Join a public room to find peers:',
    randomRoom: 'Random Room',
    publicRoomJoined: (roomId) => `Joined public room: ${roomId}`,
    currentRoom: (roomId) => `Current room: ${roomId}`
  },
  brainsPlan: {
    title: 'Brain\'s Evil Plan',
    toggle: 'Toggle Plan',
    content: 'Tonight, Pinky, we take over the world!'
  }
});

const translations = Object.freeze({
  de: baseTranslation,
  en: englishTranslation,
  bar: createDialect(dialectConfigs.bar),
  swa: createDialect(dialectConfigs.swa),
  sxu: createDialect(dialectConfigs.sxu),
  ber: createDialect(dialectConfigs.ber),
  rhe: createDialect(dialectConfigs.rhe),
  snoe: createDialect(dialectConfigs.snoe),
  ale: createDialect(dialectConfigs.ale),
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
