/**
 * Multi-dialect German translations for PodTalk
 * Supports various German dialects and a sassy invented one
 */

const translations = {
  // Hochdeutsch (Standard German)
  de: {
    name: 'Hochdeutsch',
    mascot: {
      ariaLabel: 'Wütender Tux-Maskottchen, schwebe darüber, um ihn aufzuregen'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Über',
      buttonAriaLabel: 'Über dieses Projekt',
      title: 'Über TheCommunity',
      description: 'Dies ist eine Peer-to-Peer-WebRTC-Chat-Anwendung ohne Backend. Die Community steuert, wohin dieses Projekt durch GitHub Issues geht.',
      contributorsTitle: 'Mitwirkende',
      contributorsIntro: 'Vielen Dank an alle, die durch das Erstellen von Issues beigetragen haben:',
      loadingContributors: 'Lade Mitwirkende...',
      contributorsError: 'Mitwirkende-Liste konnte nicht geladen werden. Bitte später erneut versuchen.',
      noIssues: 'Noch keine Issues. Öffne eins, um den Credits beizutreten.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Schließen',
      closeAriaLabel: 'Über-Dialog schließen'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung ausklappen' : 'Signalisierung einklappen',
      securityNotice: 'Sicherheitshinweis:',
      securityWarning: 'Das Teilen von WebRTC-Signalen offenbart Ihre Netzwerkadressen. Tauschen Sie Angebote nur mit vertrauenswürdigen Peers aus.',
      step1: 'Schritt 1: Ein Benutzer klickt auf "Angebot erstellen" und teilt das unten generierte Signal.',
      step2: 'Schritt 2: Der andere Benutzer fügt es in "Entferntes Signal" ein, klickt auf "Remote anwenden", dann auf "Antwort erstellen" und teilt seine Antwort.',
      step3: 'Schritt 3: Der erste Benutzer fügt die Antwort in "Entferntes Signal" ein und wendet sie an. Der Chat startet, wenn der Status "verbunden" anzeigt.',
      createOffer: 'Angebot erstellen',
      createAnswer: 'Antwort erstellen',
      applyRemote: 'Remote anwenden',
      disconnect: 'Trennen',
      disconnectAriaLabel: 'Von Peer trennen',
      working: 'Arbeite...',
      localSignalLabel: 'Lokales Signal (dies teilen)',
      localSignalPlaceholder: 'Lokales SDP erscheint hier, sobald es bereit ist.',
      remoteSignalLabel: 'Entferntes Signal (empfangenes JSON hier einfügen)',
      remoteSignalPlaceholder: 'Fügen Sie das JSON von Ihrem Peer ein. Drücken Sie Strg+Enter (Cmd+Enter auf Mac) oder klicken Sie auf Remote anwenden.',
      copyButton: 'Kopieren',
      copied: 'Kopiert!',
      copyFailed: 'Fehlgeschlagen',
      copyAriaLabel: 'Lokales Signal in Zwischenablage kopieren'
    },
    chat: {
      title: 'Chat',
      addApiKey: 'OpenAI-Schlüssel hinzufügen',
      updateApiKey: 'OpenAI-Schlüssel aktualisieren',
      themeToggle: (isDark) => isDark ? '🌙 Dunkler Modus' : '🌞 Heller Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln',
      clear: 'Löschen',
      clearAriaLabel: 'Alle Chat-Nachrichten löschen',
      emptyState: 'Noch keine Nachrichten. Verbinde dich mit einem Peer, um zu chatten.',
      roleLabels: {
        local: 'Du',
        remote: 'Peer',
        system: 'Hinweis'
      },
      inputPlaceholder: 'Gib eine Nachricht ein...',
      inputAriaLabel: 'Nachrichteneingabe',
      aiButton: 'Mit KI umschreiben',
      aiButtonBusy: 'Schreibe um…',
      aiButtonNoKey: 'OpenAI-Schlüssel hinzufügen, um KI zu aktivieren',
      aiButtonTitle: 'Lassen Sie OpenAI eine klarere Version Ihrer Nachricht vorschlagen.',
      aiButtonTitleNoKey: 'Fügen Sie Ihren OpenAI-Schlüssel hinzu, um KI-Unterstützung zu aktivieren.',
      send: 'Senden',
      sendAriaLabel: 'Nachricht senden',
      sendTitle: 'Nachricht senden',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Schließen',
      closeAriaLabel: 'API-Schlüssel-Dialog schließen',
      description: 'Geben Sie Ihren persönlichen OpenAI-API-Schlüssel ein, um optionale KI-Unterstützung zu aktivieren. Der Schlüssel wird nur im Speicher gespeichert und während Umschreibungsanfragen ausschließlich an api.openai.com gesendet.',
      label: 'OpenAI-API-Schlüssel',
      placeholder: 'sk-...',
      hint: 'Teilen Sie niemals API-Schlüssel auf nicht vertrauenswürdigen Geräten. Aktualisieren Sie diese Seite oder deaktivieren Sie die KI, um den Schlüssel zu löschen.',
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
      continueWithoutAi: 'Ohne KI-Unterstützung fortfahren. Sie können später einen Schlüssel aus dem Chat-Bereich hinzufügen.',
      apiKeyStored: 'OpenAI-API-Schlüssel nur in dieser Browsersitzung gespeichert. Seite aktualisieren, um ihn zu löschen.',
      aiDisabled: 'KI-Unterstützung deaktiviert. Nachrichten werden ohne KI-Hilfe gesendet.',
      aiReady: 'OpenAI-Unterstützung bereit. Überprüfen Sie Vorschläge vor dem Senden.',
      securityBlocked: 'Sicherheitshinweis: Nachricht blockiert, die kein reiner Text war.',
      messageTooLong: (max) => `Nachricht blockiert: überschreitet das ${max}-Zeichen-Limit.`,
      rateLimit: 'Ratenlimit angewendet: Peer sendet Nachrichten zu schnell.',
      channelBlocked: (label) => `Sicherheitshinweis: Unerwarteten Datenkanal "${label || 'unbenannt'}" blockiert.`,
      createOfferFailed: 'Angebot konnte nicht erstellt werden. WebRTC wird möglicherweise nicht unterstützt oder Browserberechtigungen wurden verweigert.',
      remoteEmpty: 'Entferntes Signal ist leer. Fügen Sie das von Ihrem Peer erhaltene JSON ein.',
      remoteInvalidJson: 'Entferntes Signal ist kein gültiges JSON. Kopieren Sie das vollständige Signal erneut und versuchen Sie es erneut.',
      remoteMissingData: 'Entferntem Signal fehlen erforderliche Daten. Stellen Sie sicher, dass Sie das Angebot oder die Antwort genau so eingefügt haben, wie sie bereitgestellt wurde.',
      createAnswerFailed: 'Antwort konnte nicht erstellt werden. Wenden Sie zuerst ein gültiges entferntes Angebot an und stellen Sie sicher, dass WebRTC verfügbar ist.',
      needOfferForAnswer: 'Vor dem Erstellen einer Antwort wird ein entferntes Angebot benötigt.',
      messageInputTooLong: (max, current) => `Nachricht zu lang: Limit ist ${max} Zeichen (Sie haben ${current} eingegeben).`,
      disconnectNotice: 'Verbindung geschlossen. Erstellen Sie ein neues Angebot, um sich wieder zu verbinden.',
      aiRewriteFailed: (error) => `KI-Umschreibung fehlgeschlagen: ${error || 'Anfrage wurde abgelehnt.'}`,
      aiTruncated: 'KI-Vorschlag gekürzt, um das Nachrichtenlängenlimit zu passen.',
      aiSuggestionApplied: 'KI-Vorschlag angewendet. Überprüfen und bearbeiten Sie vor dem Senden.',
      chatCleared: 'Chatverlauf gelöscht.',
      aiRewriteNotAttempted: (max) => `KI-Umschreibung nicht versucht: Entwürfe müssen unter ${max} Zeichen sein.`
    },
    aiErrors: {
      emptyKey: 'Geben Sie einen OpenAI-API-Schlüssel ein, um die KI-Umschreibung zu aktivieren.',
      unauthorized: 'OpenAI hat die Anfrage abgelehnt. Überprüfen Sie, dass Ihr API-Schlüssel korrekt ist und den erforderlichen Zugriff hat.',
      requestFailed: (status) => `OpenAI-Anfrage fehlgeschlagen mit Status ${status}`,
      missingContent: 'OpenAI-Antwort fehlt Inhalt.',
      emptySuggestion: 'OpenAI hat einen leeren Vorschlag zurückgegeben.'
    },
    language: {
      label: 'Sprache',
      ariaLabel: 'Sprache auswählen'
    }
  },

  // Bayerisch (Bavarian)
  bar: {
    name: 'Bayerisch',
    mascot: {
      ariaLabel: 'Grantige Tux-Maskottchen, fahr mit da Maus drüber zum Aufregn'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Über',
      buttonAriaLabel: 'Über des Projekt',
      title: 'Über TheCommunity',
      description: 'Des is a Peer-to-Peer-WebRTC-Chat-Anwendung ohne Backend. D\'Community steuert, wo des Projekt durch GitHub Issues higeht.',
      contributorsTitle: 'Mitwirkende',
      contributorsIntro: 'Vergelt\'s Gott an alle, die durch des Erstellen von Issues mitgholfen ham:',
      loadingContributors: 'Load Mitwirkende...',
      contributorsError: 'Mitwirkende-Liste konnt ned gladen wern. Bittschön später nomoi probiern.',
      noIssues: 'No koane Issues. Mach eins auf, zum bei de Credits dabei sein.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Zua',
      closeAriaLabel: 'Über-Dialog zuamachen'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung aufklappen' : 'Signalisierung zuklappen',
      securityNotice: 'Sicherheitshinweis:',
      securityWarning: 'Des Toan von WebRTC-Signalen zeigt deine Netzwerkadressen. Tausch Angebote nur mit vertrauenswürdigen Peers aus.',
      step1: 'Schritt 1: A Benutzer klickt auf "Angebot erstellen" und toit des unten generierte Signal.',
      step2: 'Schritt 2: Da andere Benutzer fügt\'s in "Entferntes Signal" ei, klickt auf "Remote anwenden", dann auf "Antwort erstellen" und toit sei Antwort.',
      step3: 'Schritt 3: Da erste Benutzer fügt d\'Antwort in "Entferntes Signal" ei und wendt\'s o. Da Chat startet, wenn da Status "verbunden" ozeigt.',
      createOffer: 'Angebot erstellen',
      createAnswer: 'Antwort erstellen',
      applyRemote: 'Remote anwenden',
      disconnect: 'Trennen',
      disconnectAriaLabel: 'Von Peer trennen',
      working: 'Schafft...',
      localSignalLabel: 'Lokales Signal (des toan)',
      localSignalPlaceholder: 'Lokales SDP erscheint do, sobald\'s bereit is.',
      remoteSignalLabel: 'Entferntes Signal (empfangenes JSON do eifügen)',
      remoteSignalPlaceholder: 'Füg des JSON von deim Peer ei. Drück Strg+Enter (Cmd+Enter am Mac) oder klick auf Remote anwenden.',
      copyButton: 'Kopieren',
      copied: 'Kopiert!',
      copyFailed: 'Fehlgschlagen',
      copyAriaLabel: 'Lokales Signal in Zwischenoblage kopieren'
    },
    chat: {
      title: 'Chat',
      addApiKey: 'OpenAI-Schlüssel hinzufügen',
      updateApiKey: 'OpenAI-Schlüssel aktualisieren',
      themeToggle: (isDark) => isDark ? '🌙 Dunkler Modus' : '🌞 Heller Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln',
      clear: 'Löschen',
      clearAriaLabel: 'Olle Chat-Nachrichten löschen',
      emptyState: 'No koane Nachrichten. Verbind di mit am Peer, zum chatten.',
      roleLabels: {
        local: 'Du',
        remote: 'Peer',
        system: 'Hinweis'
      },
      inputPlaceholder: 'Gib a Nachricht ei...',
      inputAriaLabel: 'Nachrichteneingabe',
      aiButton: 'Mit KI umschreiben',
      aiButtonBusy: 'Schreib um…',
      aiButtonNoKey: 'OpenAI-Schlüssel hinzufügen, zum KI aktivieren',
      aiButtonTitle: 'Loss OpenAI a klarere Version von deiner Nachricht vorschlagen.',
      aiButtonTitleNoKey: 'Füg dein OpenAI-Schlüssel hinzu, zum KI-Unterstützung aktivieren.',
      send: 'Schicken',
      sendAriaLabel: 'Nachricht schicken',
      sendTitle: 'Nachricht schicken',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Zua',
      closeAriaLabel: 'API-Schlüssel-Dialog zuamachen',
      description: 'Gib dein persönlichen OpenAI-API-Schlüssel ei, zum optionale KI-Unterstützung aktivieren. Da Schlüssel wird nur im Speicher gspeichert und während Umschreibungsanfragen ausschließlich an api.openai.com gschickt.',
      label: 'OpenAI-API-Schlüssel',
      placeholder: 'sk-...',
      hint: 'Toil niemals API-Schlüssel auf ned vertrauenswürdigen Geräten. Aktualisier de Seitn oder deaktivier d\'KI, zum den Schlüssel löschen.',
      save: 'Schlüssel speichern',
      disable: 'KI deaktivieren',
      continueWithout: 'Ohne KI weitermachen'
    },
    status: {
      waiting: 'Wart auf Verbindung...',
      signalReady: 'Signal bereit zum Toan',
      ice: (state) => `ICE: ${state}`,
      connection: (state) => `Verbindung: ${state}`,
      creatingOffer: 'Erstell Angebot...',
      creatingAnswer: 'Erstell Antwort...',
      remoteApplied: (type) => `Entferntes ${type} angewendet`,
      disconnected: 'Trennt',
      channelOpen: 'Kanal offen',
      channelClosed: 'Kanal zua',
      answerApplied: 'Antwort angewendet, wart auf Kanal...'
    },
    systemMessages: {
      themeSwitch: (theme) => `Theme gwechselt zu ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
      continueWithoutAi: 'Ohne KI-Unterstützung weitermachen. Du kannst später an Schlüssel aus dem Chat-Bereich hinzufügen.',
      apiKeyStored: 'OpenAI-API-Schlüssel nur in dera Browsersitzung gspeichert. Seitn aktualisieren, zum\'n löschen.',
      aiDisabled: 'KI-Unterstützung deaktiviert. Nachrichten werdn ohne KI-Hilfe gschickt.',
      aiReady: 'OpenAI-Unterstützung bereit. Prüf Vorschläge vor\'m Schicken.',
      securityBlocked: 'Sicherheitshinweis: Nachricht blockiert, die koa reiner Text war.',
      messageTooLong: (max) => `Nachricht blockiert: überschreitet des ${max}-Zeichen-Limit.`,
      rateLimit: 'Ratenlimit angewendet: Peer schickt Nachrichten zu schnell.',
      channelBlocked: (label) => `Sicherheitshinweis: Unerwarteten Datenkanal "${label || 'unbenannt'}" blockiert.`,
      createOfferFailed: 'Angebot konnt ned erstellt wern. WebRTC wird möglicherweise ned unterstützt oder Browserberechtigungen wurden verweigert.',
      remoteEmpty: 'Entferntes Signal is leer. Füg des von deim Peer erhaltene JSON ei.',
      remoteInvalidJson: 'Entferntes Signal is koa gültiges JSON. Kopier des vollständige Signal nomoi und versuch\'s nomoi.',
      remoteMissingData: 'Entferntem Signal fehlen erforderliche Daten. Stell sicher, dass du des Angebot oder d\'Antwort genau so eigfügt host, wie\'s bereitgstellt wurde.',
      createAnswerFailed: 'Antwort konnt ned erstellt wern. Wend zuerst a gültiges entferntes Angebot o und stell sicher, dass WebRTC verfügbar is.',
      needOfferForAnswer: 'Vor\'m Erstellen von a Antwort wird a entferntes Angebot benötigt.',
      messageInputTooLong: (max, current) => `Nachricht zu lang: Limit is ${max} Zeichen (du host ${current} eiggeben).`,
      disconnectNotice: 'Verbindung gschlossen. Erstell a neues Angebot, zum di wieder verbinden.',
      aiRewriteFailed: (error) => `KI-Umschreibung fehlgschlagen: ${error || 'Anfrage wurde abgelehnt.'}`,
      aiTruncated: 'KI-Vorschlag gekürzt, zum des Nachrichtenlängenlimit passen.',
      aiSuggestionApplied: 'KI-Vorschlag angewendet. Prüf und bearbeit vor\'m Schicken.',
      chatCleared: 'Chatverlauf glöscht.',
      aiRewriteNotAttempted: (max) => `KI-Umschreibung ned versucht: Entwürfe müssen unter ${max} Zeichen sein.`
    },
    aiErrors: {
      emptyKey: 'Gib an OpenAI-API-Schlüssel ei, zum d\'KI-Umschreibung aktivieren.',
      unauthorized: 'OpenAI hot d\'Anfrage abglehnt. Prüf, dass dein API-Schlüssel korrekt is und den erforderlichen Zugriff hot.',
      requestFailed: (status) => `OpenAI-Anfrage fehlgschlagen mit Status ${status}`,
      missingContent: 'OpenAI-Antwort fehlt Inhalt.',
      emptySuggestion: 'OpenAI hot an leeren Vorschlag zurückgeben.'
    },
    language: {
      label: 'Sprach',
      ariaLabel: 'Sprach auswählen'
    }
  },

  // Schwäbisch (Swabian)
  swa: {
    name: 'Schwäbisch',
    mascot: {
      ariaLabel: 'Grummliger Tux-Maskottchen, fahr mit dr Maus drüber zum Ärger macha'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Über',
      buttonAriaLabel: 'Über des Projekt',
      title: 'Über TheCommunity',
      description: 'Des isch a Peer-to-Peer-WebRTC-Chat-Owendung ohne Backend. D\'Community steuert, wo des Projekt durch GitHub Issues higeht.',
      contributorsTitle: 'Mithelfer',
      contributorsIntro: 'Vergelt\'s Gott an alle, die durch\'s Erschdelle vo Issues mitgholfa hend:',
      loadingContributors: 'Lade Mithelfer...',
      contributorsError: 'Mithelfer-Lischde konnt ned glade werre. Bitte schpäter nochmal probiere.',
      noIssues: 'No koine Issues. Mach ois auf, zum bei de Credits dabei sei.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Zua',
      closeAriaLabel: 'Über-Dialog zuamache'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung aufklappa' : 'Signalisierung zuklappa',
      securityNotice: 'Sicherheitshinweis:',
      securityWarning: 'Des Teile vo WebRTC-Signale zeigt deine Netzwerkadressa. Tausch Angebote nur mit vertrauenswürdige Peers aus.',
      step1: 'Schritt 1: Oi Benutzer klickt auf "Angebot erschdelle" ond teilt des unda generierte Signal.',
      step2: 'Schritt 2: Dr ander Benutzer fügt\'s in "Entferntes Signal" ei, klickt auf "Remote awende", dann auf "Antwort erschdelle" ond teilt sei Antwort.',
      step3: 'Schritt 3: Dr erschde Benutzer fügt d\'Antwort in "Entferntes Signal" ei ond wendet\'s a. Dr Chat startet, wenn dr Status "verbunda" ozeigt.',
      createOffer: 'Angebot erschdelle',
      createAnswer: 'Antwort erschdelle',
      applyRemote: 'Remote awende',
      disconnect: 'Trenna',
      disconnectAriaLabel: 'Vo Peer trenna',
      working: 'Schafft...',
      localSignalLabel: 'Lokales Signal (des teile)',
      localSignalPlaceholder: 'Lokales SDP erscheint do, sobald\'s bereit isch.',
      remoteSignalLabel: 'Entferntes Signal (empfangenes JSON do eifüge)',
      remoteSignalPlaceholder: 'Füg des JSON vo deim Peer ei. Drück Strg+Enter (Cmd+Enter am Mac) oder klick auf Remote awende.',
      copyButton: 'Kopiere',
      copied: 'Kopiert!',
      copyFailed: 'Fehlgschlaga',
      copyAriaLabel: 'Lokales Signal in Zwischaoablage kopiere'
    },
    chat: {
      title: 'Chat',
      addApiKey: 'OpenAI-Schlüssel hinzufüge',
      updateApiKey: 'OpenAI-Schlüssel aktualisiere',
      themeToggle: (isDark) => isDark ? '🌙 Dunkler Modus' : '🌞 Heller Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zu hellem Theme wechsle' : 'Zu dunklem Theme wechsle',
      clear: 'Lösche',
      clearAriaLabel: 'Alle Chat-Nachrichta lösche',
      emptyState: 'No koine Nachrichta. Verbind di mit am Peer, zum chattet.',
      roleLabels: {
        local: 'Du',
        remote: 'Peer',
        system: 'Hinweis'
      },
      inputPlaceholder: 'Gib a Nachricht ei...',
      inputAriaLabel: 'Nachrichtaeigabe',
      aiButton: 'Mit KI umschreibe',
      aiButtonBusy: 'Schreib um…',
      aiButtonNoKey: 'OpenAI-Schlüssel hinzufüge, zum KI aktiviere',
      aiButtonTitle: 'Loss OpenAI a klarere Version vo deiner Nachricht vorschlaga.',
      aiButtonTitleNoKey: 'Füg dein OpenAI-Schlüssel hinzu, zum KI-Unterstützung aktiviere.',
      send: 'Schicka',
      sendAriaLabel: 'Nachricht schicka',
      sendTitle: 'Nachricht schicka',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Zua',
      closeAriaLabel: 'API-Schlüssel-Dialog zuamache',
      description: 'Gib dein persönliche OpenAI-API-Schlüssel ei, zum optionale KI-Unterstützung aktiviere. Dr Schlüssel wird nur im Speicher gschpeichert ond während Umschreibungsafraga ausschließlich a api.openai.com gschickt.',
      label: 'OpenAI-API-Schlüssel',
      placeholder: 'sk-...',
      hint: 'Teil niemals API-Schlüssel auf ned vertrauenswürdige Geräta. Aktualisier d\'Seite oder deaktivier d\'KI, zum de Schlüssel lösche.',
      save: 'Schlüssel schpeichere',
      disable: 'KI deaktiviere',
      continueWithout: 'Ohne KI weitermacha'
    },
    status: {
      waiting: 'Wart auf Verbindung...',
      signalReady: 'Signal bereit zum Teile',
      ice: (state) => `ICE: ${state}`,
      connection: (state) => `Verbindung: ${state}`,
      creatingOffer: 'Erschdell Angebot...',
      creatingAnswer: 'Erschdell Antwort...',
      remoteApplied: (type) => `Entferntes ${type} awendet`,
      disconnected: 'Trennt',
      channelOpen: 'Kanal offa',
      channelClosed: 'Kanal zua',
      answerApplied: 'Antwort awendet, wart auf Kanal...'
    },
    systemMessages: {
      themeSwitch: (theme) => `Theme gwechselt zu ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
      continueWithoutAi: 'Ohne KI-Unterstützung weitermacha. Du kannsch schpäter an Schlüssel aus\'m Chat-Bereich hinzufüge.',
      apiKeyStored: 'OpenAI-API-Schlüssel nur in dera Browsersitzung gschpeichert. Seite aktualisiere, zum\'n lösche.',
      aiDisabled: 'KI-Unterstützung deaktiviert. Nachrichta werdet ohne KI-Hilf gschickt.',
      aiReady: 'OpenAI-Unterstützung bereit. Prüf Vorschläg vor\'m Schicka.',
      securityBlocked: 'Sicherheitshinweis: Nachricht blockiert, die koi reiner Text war.',
      messageTooLong: (max) => `Nachricht blockiert: überschreitet des ${max}-Zeicha-Limit.`,
      rateLimit: 'Ratenlimit awendet: Peer schickt Nachrichta zu schnell.',
      channelBlocked: (label) => `Sicherheitshinweis: Unerwarteta Datekkanal "${label || 'unbenannt'}" blockiert.`,
      createOfferFailed: 'Angebot konnt ned erschdellt werre. WebRTC wird möglicherweise ned unterstützt oder Browserberechtigunga wurdet verweigert.',
      remoteEmpty: 'Entferntes Signal isch leer. Füg des vo deim Peer erhaltene JSON ei.',
      remoteInvalidJson: 'Entferntes Signal isch koi gültigs JSON. Kopier des vollständige Signal nommal ond versuch\'s nommal.',
      remoteMissingData: 'Entferntem Signal fehlet erforderliche Data. Stell sicher, dass du des Angebot oder d\'Antwort genau so eigfügt hosch, wie\'s bereitgstellt wurde.',
      createAnswerFailed: 'Antwort konnt ned erschdellt werre. Wend zuerscht a gültigs entferntes Angebot a ond stell sicher, dass WebRTC verfügbar isch.',
      needOfferForAnswer: 'Vor\'m Erschdelle vo a Antwort wird a entferntes Angebot benötigt.',
      messageInputTooLong: (max, current) => `Nachricht zu lang: Limit isch ${max} Zeicha (du hosch ${current} eiggebe).`,
      disconnectNotice: 'Verbindung gschlossa. Erschdell a neis Angebot, zum di wieder verbinda.',
      aiRewriteFailed: (error) => `KI-Umschreibung fehlgschlaga: ${error || 'Afrage wurde abglehnt.'}`,
      aiTruncated: 'KI-Vorschlag gekürzt, zum des Nachrichtlängelimit passa.',
      aiSuggestionApplied: 'KI-Vorschlag awendet. Prüf ond bearbeit vor\'m Schicka.',
      chatCleared: 'Chatverlauf glöscht.',
      aiRewriteNotAttempted: (max) => `KI-Umschreibung ned versucht: Entwürf müsset unter ${max} Zeicha sei.`
    },
    aiErrors: {
      emptyKey: 'Gib an OpenAI-API-Schlüssel ei, zum d\'KI-Umschreibung aktiviere.',
      unauthorized: 'OpenAI hot d\'Afrage abglehnt. Prüf, dass dein API-Schlüssel korrekt isch ond de erforderliche Zugriff hot.',
      requestFailed: (status) => `OpenAI-Afrage fehlgschlaga mit Status ${status}`,
      missingContent: 'OpenAI-Antwort fehlt Inhalt.',
      emptySuggestion: 'OpenAI hot an leera Vorschlag zruckgeba.'
    },
    language: {
      label: 'Sprach',
      ariaLabel: 'Sprach auswähle'
    }
  },

  // Sächsisch (Saxon)
  sxu: {
    name: 'Sächsisch',
    mascot: {
      ariaLabel: 'Saurer Tux-Maskottchen, fahr mit dr Maus drüber zum uffregn'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Über',
      buttonAriaLabel: 'Über des Projeggt',
      title: 'Über TheCommunity',
      description: 'Des is ä Peer-to-Peer-WebRTC-Chat-Anwendung ohne Backend. De Community steuert, wo des Projeggt durch GitHub Issues hingeht.',
      contributorsTitle: 'Mitwirkende',
      contributorsIntro: 'Danke an alle, die durch des Erschdellen von Issues mitjehelfen ham:',
      loadingContributors: 'Lade Mitwirkende...',
      contributorsError: 'Mitwirkende-Lischde konnt nich jeladen wern. Bitte schbäter nochmal versuchen.',
      noIssues: 'Noch keene Issues. Mach eins uff, um bei de Credits dabei zu sein.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Zu',
      closeAriaLabel: 'Über-Dialoch zumachen'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung uffklappn' : 'Signalisierung zuklappn',
      securityNotice: 'Sicherheitshinweis:',
      securityWarning: 'Des Teiln von WebRTC-Signale zeicht deine Netzwerkadressen. Tausch Anjebote nur mit vertrauenswürdijen Peers aus.',
      step1: 'Schritt 1: Ä Benutzer glickt uff "Anjebot erschdellen" und teilt des unten jenerierte Signal.',
      step2: 'Schritt 2: Dr andre Benutzer fücht\'s in "Entferntes Signal" ein, glickt uff "Remote anwendn", dann uff "Antwort erschdellen" und teilt seine Antwort.',
      step3: 'Schritt 3: Dr erschde Benutzer fücht de Antwort in "Entferntes Signal" ein und wendet\'s an. Dr Chat starteet, wenn dr Status "verbundn" anzeicht.',
      createOffer: 'Anjebot erschdellen',
      createAnswer: 'Antwort erschdellen',
      applyRemote: 'Remote anwendn',
      disconnect: 'Trennen',
      disconnectAriaLabel: 'Von Peer trennen',
      working: 'Arbeet...',
      localSignalLabel: 'Lokales Signal (des teiln)',
      localSignalPlaceholder: 'Lokales SDP erscheint hier, sobald\'s bereit is.',
      remoteSignalLabel: 'Entferntes Signal (empfanjenes JSON hier einfüchen)',
      remoteSignalPlaceholder: 'Füch des JSON von deim Peer ein. Drück Strg+Enter (Cmd+Enter am Mac) oder glick uff Remote anwendn.',
      copyButton: 'Kopiern',
      copied: 'Kopiert!',
      copyFailed: 'Fejlgeschlagen',
      copyAriaLabel: 'Lokales Signal in Zwischenablache kopiern'
    },
    chat: {
      title: 'Chat',
      addApiKey: 'OpenAI-Schlüssel hinzufüchn',
      updateApiKey: 'OpenAI-Schlüssel aktualisieren',
      themeToggle: (isDark) => isDark ? '🌙 Dunkler Modus' : '🌞 Heller Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln',
      clear: 'Löschn',
      clearAriaLabel: 'Alle Chat-Nachrichtn löschn',
      emptyState: 'Noch keene Nachrichtn. Verbind dich mit \'m Peer, um zu chattn.',
      roleLabels: {
        local: 'Du',
        remote: 'Peer',
        system: 'Hinweis'
      },
      inputPlaceholder: 'Jib ä Nachricht ein...',
      inputAriaLabel: 'Nachrichteinjabe',
      aiButton: 'Mit KI umschreibn',
      aiButtonBusy: 'Schreib um…',
      aiButtonNoKey: 'OpenAI-Schlüssel hinzufüchn, um KI aktiviern',
      aiButtonTitle: 'Loss OpenAI ä klarere Version von deiner Nachricht vorschlagn.',
      aiButtonTitleNoKey: 'Füch dein OpenAI-Schlüssel hinzu, um KI-Unterstützung aktiviern.',
      send: 'Schickn',
      sendAriaLabel: 'Nachricht schickn',
      sendTitle: 'Nachricht schickn',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Zu',
      closeAriaLabel: 'API-Schlüssel-Dialoch zumachen',
      description: 'Jib dein persönlichen OpenAI-API-Schlüssel ein, um optionale KI-Unterstützung aktiviern. Dr Schlüssel wird nur im Speicher jespeichert und während Umschreibungsanfragen ausschließlich an api.openai.com jeschickt.',
      label: 'OpenAI-API-Schlüssel',
      placeholder: 'sk-...',
      hint: 'Teil niemals API-Schlüssel uff nich vertrauenswürdijen Jeräten. Aktualisier de Seite oder deaktivier de KI, um den Schlüssel löschn.',
      save: 'Schlüssel speichern',
      disable: 'KI deaktiviern',
      continueWithout: 'Ohne KI weitermaachen'
    },
    status: {
      waiting: 'Wart uff Verbindung...',
      signalReady: 'Signal bereit zum Teiln',
      ice: (state) => `ICE: ${state}`,
      connection: (state) => `Verbindung: ${state}`,
      creatingOffer: 'Erschdell Anjebot...',
      creatingAnswer: 'Erschdell Antwort...',
      remoteApplied: (type) => `Entferntes ${type} anjewendet`,
      disconnected: 'Jetrennt',
      channelOpen: 'Kanal offen',
      channelClosed: 'Kanal zu',
      answerApplied: 'Antwort anjewendet, wart uff Kanal...'
    },
    systemMessages: {
      themeSwitch: (theme) => `Theme jewechselt zu ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
      continueWithoutAi: 'Ohne KI-Unterstützung weitermaachen. Du kannst schbäter \'n Schlüssel aus\'m Chat-Bereich hinzufüchn.',
      apiKeyStored: 'OpenAI-API-Schlüssel nur in derer Browsersitzung jespeichert. Seite aktualisieren, um\'n löschn.',
      aiDisabled: 'KI-Unterstützung deaktiviert. Nachrichtn wern ohne KI-Hilfe jeschickt.',
      aiReady: 'OpenAI-Unterstützung bereit. Prüf Vorschläche vor\'m Schickn.',
      securityBlocked: 'Sicherheitshinweis: Nachricht blockiert, die keen reiner Text war.',
      messageTooLong: (max) => `Nachricht blockiert: überschreitet des ${max}-Zeichen-Limit.`,
      rateLimit: 'Ratenlimit anjewendet: Peer schickt Nachrichtn zu schnell.',
      channelBlocked: (label) => `Sicherheitshinweis: Unerwarteten Datenkanal "${label || 'unbenannt'}" blockiert.`,
      createOfferFailed: 'Anjebot konnt nich erschdellt wern. WebRTC wird möglicherweise nich unterstützt oder Browserberechtijungen wurdn verweijert.',
      remoteEmpty: 'Entferntes Signal is leer. Füch des von deim Peer erhaltene JSON ein.',
      remoteInvalidJson: 'Entferntes Signal is keen jültigs JSON. Kopier des vollständije Signal nochmal und versuch\'s nochmal.',
      remoteMissingData: 'Entferntem Signal fehln erforderliche Datn. Stell sicher, dass du des Anjebot oder de Antwort jenau so einjefücht hasd, wie\'s bereitjestellt wurde.',
      createAnswerFailed: 'Antwort konnt nich erschdellt wern. Wend zuersd ä jültigs entferntes Anjebot an und stell sicher, dass WebRTC verfügbar is.',
      needOfferForAnswer: 'Vor\'m Erschdelln von ä Antwort wird ä entferntes Anjebot benöticht.',
      messageInputTooLong: (max, current) => `Nachricht zu lang: Limit is ${max} Zeichen (du hasd ${current} einjejeben).`,
      disconnectNotice: 'Verbindung jeschlossen. Erschdell ä neues Anjebot, um dich wieder verbindn.',
      aiRewriteFailed: (error) => `KI-Umschreibung fejlgeschlagen: ${error || 'Anfrage wurde abjelehnt.'}`,
      aiTruncated: 'KI-Vorschlag jekürzt, um des Nachrichtlänjelimit passn.',
      aiSuggestionApplied: 'KI-Vorschlag anjewendet. Prüf und bearbeit vor\'m Schickn.',
      chatCleared: 'Chatverlauf jelöscht.',
      aiRewriteNotAttempted: (max) => `KI-Umschreibung nich versucht: Entwürfe müssn unter ${max} Zeichen sein.`
    },
    aiErrors: {
      emptyKey: 'Jib \'n OpenAI-API-Schlüssel ein, um de KI-Umschreibung aktiviern.',
      unauthorized: 'OpenAI hat de Anfrage abjelehnt. Prüf, dass dein API-Schlüssel korreggt is und den erforderlichen Zugriff hat.',
      requestFailed: (status) => `OpenAI-Anfrage fejlgeschlagen mit Status ${status}`,
      missingContent: 'OpenAI-Antwort fehlt Inhalt.',
      emptySuggestion: 'OpenAI hat \'n leeren Vorschlag zurückjejeben.'
    },
    language: {
      label: 'Sprache',
      ariaLabel: 'Sprache auswähln'
    }
  },

  // Berlinerisch (Berlin)
  ber: {
    name: 'Berlinerisch',
    mascot: {
      ariaLabel: 'Mufflicher Tux-Maskottchen, fahr mit da Maus drüber zum uffrejen'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Über',
      buttonAriaLabel: 'Über dit Projek',
      title: 'Über TheCommunity',
      description: 'Dit is ne Peer-to-Peer-WebRTC-Chat-Anwendung ohne Backend. De Community steuert, wo dit Projek durch GitHub Issues hinjeht.',
      contributorsTitle: 'Mitwirkende',
      contributorsIntro: 'Danke an alle, die durch\'s Erstellen von Issues mitjeholfen ham:',
      loadingContributors: 'Lade Mitwirkende...',
      contributorsError: 'Mitwirkende-Liste konnte nich jeladen wern. Bitte später nochmal probieren.',
      noIssues: 'Noch keene Issues. Mach eins uf, um bei de Credits dabei zu sein.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Zu',
      closeAriaLabel: 'Über-Dialoch zumachen'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung ufklappen' : 'Signalisierung zuklappen',
      securityNotice: 'Sicherheitshinweis:',
      securityWarning: 'Dit Teilen von WebRTC-Signalen zeecht deine Netzwerkadressen. Tausch Anjebote nur mit vertrauenswürdijen Peers aus.',
      step1: 'Schritt 1: Een Benutzer klickt uf "Anjebot erstellen" und teilt dit unten jenerierte Signal.',
      step2: 'Schritt 2: Da andre Benutzer füjt\'s in "Entferntes Signal" ein, klickt uf "Remote anwenden", dann uf "Antwort erstellen" und teilt seine Antwort.',
      step3: 'Schritt 3: Da erste Benutzer füjt de Antwort in "Entferntes Signal" ein und wendet\'s an. Da Chat starteet, wenn da Status "verbunden" anzeecht.',
      createOffer: 'Anjebot erstellen',
      createAnswer: 'Antwort erstellen',
      applyRemote: 'Remote anwenden',
      disconnect: 'Trennen',
      disconnectAriaLabel: 'Von Peer trennen',
      working: 'Arbeet...',
      localSignalLabel: 'Lokalet Signal (dit teilen)',
      localSignalPlaceholder: 'Lokalet SDP erscheint hier, sobald\'s bereit is.',
      remoteSignalLabel: 'Entferntet Signal (empfanjenet JSON hier einfüjen)',
      remoteSignalPlaceholder: 'Füj dit JSON von deim Peer ein. Drück Strg+Enter (Cmd+Enter am Mac) oder klick uf Remote anwenden.',
      copyButton: 'Kopieren',
      copied: 'Kopiert!',
      copyFailed: 'Fehljeslagen',
      copyAriaLabel: 'Lokalet Signal in Zwischenablaje kopieren'
    },
    chat: {
      title: 'Chat',
      addApiKey: 'OpenAI-Schlüssel hinzufüjen',
      updateApiKey: 'OpenAI-Schlüssel aktualisieren',
      themeToggle: (isDark) => isDark ? '🌙 Dunkler Modus' : '🌞 Heller Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln',
      clear: 'Löschen',
      clearAriaLabel: 'Alle Chat-Nachrichten löschen',
      emptyState: 'Noch keene Nachrichten. Verbind dich mit \'m Peer, um zu chatten.',
      roleLabels: {
        local: 'Du',
        remote: 'Peer',
        system: 'Hinweis'
      },
      inputPlaceholder: 'Jib ne Nachricht ein...',
      inputAriaLabel: 'Nachrichteinjabe',
      aiButton: 'Mit KI umschreiben',
      aiButtonBusy: 'Schreib um…',
      aiButtonNoKey: 'OpenAI-Schlüssel hinzufüjen, um KI aktivieren',
      aiButtonTitle: 'Lass OpenAI ne klarere Version von deiner Nachricht vorschlachen.',
      aiButtonTitleNoKey: 'Füj dein OpenAI-Schlüssel hinzu, um KI-Unterstützung aktivieren.',
      send: 'Schicken',
      sendAriaLabel: 'Nachricht schicken',
      sendTitle: 'Nachricht schicken',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Zu',
      closeAriaLabel: 'API-Schlüssel-Dialoch zumachen',
      description: 'Jib dein persönlichen OpenAI-API-Schlüssel ein, um optionale KI-Unterstützung aktivieren. Da Schlüssel wird nur im Speicher jespeichert und während Umschreibungsanfragen ausschließlich an api.openai.com jeschickt.',
      label: 'OpenAI-API-Schlüssel',
      placeholder: 'sk-...',
      hint: 'Teil niemals API-Schlüssel uf nich vertrauenswürdijen Jeräten. Aktualisier de Seite oder deaktivier de KI, um den Schlüssel löschen.',
      save: 'Schlüssel speichern',
      disable: 'KI deaktivieren',
      continueWithout: 'Ohne KI weitermachen'
    },
    status: {
      waiting: 'Wart uf Verbindung...',
      signalReady: 'Signal bereit zum Teilen',
      ice: (state) => `ICE: ${state}`,
      connection: (state) => `Verbindung: ${state}`,
      creatingOffer: 'Erstell Anjebot...',
      creatingAnswer: 'Erstell Antwort...',
      remoteApplied: (type) => `Entferntet ${type} anjewendet`,
      disconnected: 'Jetrennt',
      channelOpen: 'Kanal offen',
      channelClosed: 'Kanal zu',
      answerApplied: 'Antwort anjewendet, wart uf Kanal...'
    },
    systemMessages: {
      themeSwitch: (theme) => `Theme jewechselt zu ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
      continueWithoutAi: 'Ohne KI-Unterstützung weitermachen. Du kannst später \'n Schlüssel aus\'m Chat-Bereich hinzufüjen.',
      apiKeyStored: 'OpenAI-API-Schlüssel nur in derer Browsersitzung jespeichert. Seite aktualisieren, um\'n löschen.',
      aiDisabled: 'KI-Unterstützung deaktiviert. Nachrichten werden ohne KI-Hilfe jeschickt.',
      aiReady: 'OpenAI-Unterstützung bereit. Prüf Vorschläje vor\'m Schicken.',
      securityBlocked: 'Sicherheitshinweis: Nachricht blockiert, de keen reinet Text war.',
      messageTooLong: (max) => `Nachricht blockiert: überschreitet dit ${max}-Zeichen-Limit.`,
      rateLimit: 'Ratenlimit anjewendet: Peer schickt Nachrichten zu schnell.',
      channelBlocked: (label) => `Sicherheitshinweis: Unerwarteten Datenkanal "${label || 'unbenannt'}" blockiert.`,
      createOfferFailed: 'Anjebot konnte nich erstellt werden. WebRTC wird möjlicherweise nich unterstützt oder Browserberechtijungen wurden verweijert.',
      remoteEmpty: 'Entferntet Signal is leer. Füj dit von deim Peer erhaltene JSON ein.',
      remoteInvalidJson: 'Entferntet Signal is keen jültjet JSON. Kopier dit vollständije Signal nochmal und versuch\'s nochmal.',
      remoteMissingData: 'Entferntem Signal fehlen erforderliche Daten. Stell sicher, dass du dit Anjebot oder de Antwort jenau so einjefüjt hast, wie\'s bereitjestellt wurde.',
      createAnswerFailed: 'Antwort konnte nich erstellt werden. Wend zuerst een jültjet entferntet Anjebot an und stell sicher, dass WebRTC verfügbar is.',
      needOfferForAnswer: 'Vor\'m Erstellen von ne Antwort wird een entferntet Anjebot benöticht.',
      messageInputTooLong: (max, current) => `Nachricht zu lang: Limit is ${max} Zeichen (du hast ${current} einjejeben).`,
      disconnectNotice: 'Verbindung jeschlossen. Erstell een neues Anjebot, um dich wieder verbinden.',
      aiRewriteFailed: (error) => `KI-Umschreibung fehljeslagen: ${error || 'Anfrage wurde abjelehnt.'}`,
      aiTruncated: 'KI-Vorschlag jekürzt, um dit Nachrichtlänjelimit passen.',
      aiSuggestionApplied: 'KI-Vorschlag anjewendet. Prüf und bearbeit vor\'m Schicken.',
      chatCleared: 'Chatverlauf jelöscht.',
      aiRewriteNotAttempted: (max) => `KI-Umschreibung nich versucht: Entwürfe müssen unter ${max} Zeichen sein.`
    },
    aiErrors: {
      emptyKey: 'Jib \'n OpenAI-API-Schlüssel ein, um de KI-Umschreibung aktivieren.',
      unauthorized: 'OpenAI hat de Anfrage abjelehnt. Prüf, dass dein API-Schlüssel korrekt is und den erforderlichen Zugriff hat.',
      requestFailed: (status) => `OpenAI-Anfrage fehljeslagen mit Status ${status}`,
      missingContent: 'OpenAI-Antwort fehlt Inhalt.',
      emptySuggestion: 'OpenAI hat \'n leeren Vorschlag zurückjejeben.'
    },
    language: {
      label: 'Sprache',
      ariaLabel: 'Sprache auswählen'
    }
  },

  // Rheinisch (Rhineland)
  rhe: {
    name: 'Rheinisch',
    mascot: {
      ariaLabel: 'Mufflige Tux-Maskottchen, fahr met dr Maus drövver zom oprejje'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Övver',
      buttonAriaLabel: 'Övver dat Projek',
      title: 'Övver TheCommunity',
      description: 'Dat es ene Peer-to-Peer-WebRTC-Chat-Aanwendung ohne Backend. De Community stüüert, wo dat Projek durch GitHub Issues hinjeiht.',
      contributorsTitle: 'Methelfer',
      contributorsIntro: 'Dank aan all, die durch et Erstelle vun Issues metjeholfe han:',
      loadingContributors: 'Laade Methelfer...',
      contributorsError: 'Methelfer-Leß konnt nit jeladen weede. Bette später nochma versööke.',
      noIssues: 'Noch kein Issues. Maach eins op, öm bei de Credits dabei ze sin.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Zo',
      closeAriaLabel: 'Övver-Dialoch zomache'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung opklappe' : 'Signalisierung zoklappe',
      securityNotice: 'Sicherheitshinweis:',
      securityWarning: 'Dat Deile vun WebRTC-Signale zeich dinge Netzwerkadressen. Tuusch Aanjebote nor met vertrauenswürdije Peers us.',
      step1: 'Schrett 1: Ene Benutzer kleck op "Aanjebot erstelle" un deilt dat unge jenerierte Signal.',
      step2: 'Schrett 2: Dä ander Benutzer föch et en "Entferntet Signal" en, kleck op "Remote aanwende", dann op "Antwood erstelle" un deilt sing Antwood.',
      step3: 'Schrett 3: Dä eezte Benutzer föch de Antwood en "Entferntet Signal" en un wendet et aan. Dä Chat started, wann dä Status "verbonge" aanzeich.',
      createOffer: 'Aanjebot erstelle',
      createAnswer: 'Antwood erstelle',
      applyRemote: 'Remote aanwende',
      disconnect: 'Trenne',
      disconnectAriaLabel: 'Vun Peer trenne',
      working: 'Schafft...',
      localSignalLabel: 'Lokalet Signal (dat deile)',
      localSignalPlaceholder: 'Lokalet SDP ersching hee, sobald et bereech es.',
      remoteSignalLabel: 'Entferntet Signal (empfangenet JSON hee enfööje)',
      remoteSignalPlaceholder: 'Föch dat JSON vun dingem Peer en. Dröck Strg+Enter (Cmd+Enter am Mac) oder kleck op Remote aanwende.',
      copyButton: 'Kopiere',
      copied: 'Kopiert!',
      copyFailed: 'Fehljeslaage',
      copyAriaLabel: 'Lokalet Signal en Zwescheaablaach kopiere'
    },
    chat: {
      title: 'Chat',
      addApiKey: 'OpenAI-Schlößel dobeiföje',
      updateApiKey: 'OpenAI-Schlößel aktualisiere',
      themeToggle: (isDark) => isDark ? '🌙 Dunkle Modus' : '🌞 Helle Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zo hellem Theme wääßele' : 'Zo dunklem Theme wääßele',
      clear: 'Fottschmieße',
      clearAriaLabel: 'All Chat-Nohrechte fottschmieße',
      emptyState: 'Noch kein Nohrechte. Verbind dich met enem Peer, öm ze chatte.',
      roleLabels: {
        local: 'Do',
        remote: 'Peer',
        system: 'Henwies'
      },
      inputPlaceholder: 'Jiff en Nohrecht en...',
      inputAriaLabel: 'Nohrechteenjabe',
      aiButton: 'Met KI ömschrieve',
      aiButtonBusy: 'Schriev öm…',
      aiButtonNoKey: 'OpenAI-Schlößel dobeiföje, öm KI aktiviere',
      aiButtonTitle: 'Lohß OpenAI en klarere Version vun dinger Nohrecht vörschlaare.',
      aiButtonTitleNoKey: 'Föch dinge OpenAI-Schlößel dobei, öm KI-Ungerstötzung aktiviere.',
      send: 'Schecke',
      sendAriaLabel: 'Nohrecht schecke',
      sendTitle: 'Nohrecht schecke',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Zo',
      closeAriaLabel: 'API-Schlößel-Dialoch zomache',
      description: 'Jiff dinge persönliche OpenAI-API-Schlößel en, öm optionale KI-Ungerstötzung aktiviere. Dä Schlößel weed nor em Specher jespeechert un während Ömschriebungsaanfroore usschließlich aan api.openai.com jescheck.',
      label: 'OpenAI-API-Schlößel',
      placeholder: 'sk-...',
      hint: 'Deil nimohß API-Schlößel op nit vertrauenswürdije Jeräte. Aktualisier de Sigg oder deaktivier de KI, öm dä Schlößel fottschmieße.',
      save: 'Schlößel speichere',
      disable: 'KI deaktiviere',
      continueWithout: 'Ohne KI wiggermaache'
    },
    status: {
      waiting: 'Waat op Verbindung...',
      signalReady: 'Signal bereech zom Deile',
      ice: (state) => `ICE: ${state}`,
      connection: (state) => `Verbindung: ${state}`,
      creatingOffer: 'Erstell Aanjebot...',
      creatingAnswer: 'Erstell Antwood...',
      remoteApplied: (type) => `Entferntet ${type} aanjewendt`,
      disconnected: 'Jetrennt',
      channelOpen: 'Kanal op',
      channelClosed: 'Kanal zo',
      answerApplied: 'Antwood aanjewendt, waat op Kanal...'
    },
    systemMessages: {
      themeSwitch: (theme) => `Theme jewääßelt zo ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
      continueWithoutAi: 'Ohne KI-Ungerstötzung wiggermaache. Do kanns später ene Schlößel us dem Chat-Bereich dobeiföje.',
      apiKeyStored: 'OpenAI-API-Schlößel nor en derer Browsersetzung jespeechert. Sigg aktualisiere, öm en fottschmieße.',
      aiDisabled: 'KI-Ungerstötzung deaktiviert. Nohrechte weede ohne KI-Hölp jescheck.',
      aiReady: 'OpenAI-Ungerstötzung bereech. Prööf Vörschläch vör dem Schecke.',
      securityBlocked: 'Sicherheitshinweis: Nohrecht blockiert, die kei reinet Text wohr.',
      messageTooLong: (max) => `Nohrecht blockiert: övverschriet dat ${max}-Zeiche-Limit.`,
      rateLimit: 'Ratenlimit aanjewendt: Peer scheck Nohrechte zo flöck.',
      channelBlocked: (label) => `Sicherheitshinweis: Unerwahrte Datekanal "${label || 'ohne Name'}" blockiert.`,
      createOfferFailed: 'Aanjebot konnt nit erstellt weede. WebRTC weed müjlicherwiese nit ungerstötzt oder Browserberechtijunge woodte verwihrt.',
      remoteEmpty: 'Entferntet Signal es lädisch. Föch dat vun dingem Peer erhaltene JSON en.',
      remoteInvalidJson: 'Entferntet Signal es kei jültich JSON. Kopier dat vollständije Signal nochma un versöök et nochma.',
      remoteMissingData: 'Entferntem Signal fähle nüdije Date. Stell secher, dat do dat Aanjebot oder de Antwood jenau esu enjejovve has, wi et bereechjeställt wood.',
      createAnswerFailed: 'Antwood konnt nit erstellt weede. Wend zeesch en jültich entferntet Aanjebot aan un stell secher, dat WebRTC verfögbar es.',
      needOfferForAnswer: 'Vör dem Erstelle vun ener Antwood weed en entferntet Aanjebot jenöticht.',
      messageInputTooLong: (max, current) => `Nohrecht zo lang: Limit es ${max} Zeiche (do has ${current} enjejovve).`,
      disconnectNotice: 'Verbindung jeschlosse. Erstell en neu Aanjebot, öm dich widder verbinde.',
      aiRewriteFailed: (error) => `KI-Ömschriebung fehljeslaage: ${error || 'Aanfrooch wood aavjelähnt.'}`,
      aiTruncated: 'KI-Vörschlaach jeköözt, öm et Nohrechtlängenlimit passe.',
      aiSuggestionApplied: 'KI-Vörschlaach aanjewendt. Prööf un beärbeech vör dem Schecke.',
      chatCleared: 'Chatverlauf fottjeschmesse.',
      aiRewriteNotAttempted: (max) => `KI-Ömschriebung nit versöök: Entwörf mööße unger ${max} Zeiche sin.`
    },
    aiErrors: {
      emptyKey: 'Jiff ene OpenAI-API-Schlößel en, öm de KI-Ömschriebung aktiviere.',
      unauthorized: 'OpenAI hät de Aanfrooch aavjelähnt. Prööf, dat dinge API-Schlößel korrekt es un dä nüdije Zojereff hät.',
      requestFailed: (status) => `OpenAI-Aanfrooch fehljeslaage met Status ${status}`,
      missingContent: 'OpenAI-Antwood fählt Inhalt.',
      emptySuggestion: 'OpenAI hät ene lädije Vörschlaach zröckjejovve.'
    },
    language: {
      label: 'Sproch',
      ariaLabel: 'Sproch ussöke'
    }
  },

  // Schnöseldeutsch (Invented Sassy German)
  snoe: {
    name: 'Schnöseldeutsch',
    mascot: {
      ariaLabel: 'Überheblicher Tux-Maskottchen, fahren Sie mit der Maus darüber, falls Sie sich trauen'
    },
    app: {
      title: 'PodTalk'
    },
    about: {
      button: 'Über',
      buttonAriaLabel: 'Über dieses exquisite Projekt',
      title: 'Über TheCommunity',
      description: 'Dies ist eine hochwohlgeborene Peer-to-Peer-WebRTC-Chat-Anwendung ohne Backend, versteht sich. Die Community, sofern sie überhaupt kompetent genug ist, steuert, wohin dieses distinguierte Projekt durch GitHub Issues zu schreiten geruht.',
      contributorsTitle: 'Contribu-wer?',
      contributorsIntro: 'Man möchte sich bei all jenen bedanken, die durch das Verfassen von Issues ihre bescheidenen Beiträge geleistet haben:',
      loadingContributors: 'Lade Contributors, bitte Geduld bewahren...',
      contributorsError: 'Die Contributor-Liste konnte nicht geladen werden. Wie ärgerlich für Sie.',
      noIssues: 'Noch keine Issues. Öffnen Sie eines, falls Sie sich zutrauen, den Credits beizutreten.',
      issueCount: (count) => count === 1 ? '1 Issue' : `${count} Issues`,
      close: 'Adieu',
      closeAriaLabel: 'Über-Dialog schließen, falls beliebt'
    },
    signaling: {
      title: 'Manuelle Signalisierung',
      collapseAriaLabel: (collapsed) => collapsed ? 'Signalisierung expandieren' : 'Signalisierung kollabieren',
      securityNotice: 'Sicherheitsnotiz:',
      securityWarning: 'Das Teilen von WebRTC-Signalen offenbart Ihre Netzwerkadressen. Tauschen Sie Offerten nur mit Peers aus, die Ihrer würdig sind.',
      step1: 'Schritt 1: Ein Benutzer klickt auf "Offerte kreieren" und teilt das unten generierte Signal.',
      step2: 'Schritt 2: Der andere Benutzer fügt es in "Entferntes Signal" ein, klickt auf "Remote applizieren", dann auf "Replik kreieren" und teilt seine Antwort.',
      step3: 'Schritt 3: Der erste Benutzer fügt die Replik in "Entferntes Signal" ein und appliziert sie. Der Chat startet, wenn der Status "konnektiert" anzeigt.',
      createOffer: 'Offerte kreieren',
      createAnswer: 'Replik kreieren',
      applyRemote: 'Remote applizieren',
      disconnect: 'Diskonnektieren',
      disconnectAriaLabel: 'Von Peer diskonnektieren',
      working: 'In Arbeit, bitte warten...',
      localSignalLabel: 'Lokales Signal (dies zu teilen geruhen)',
      localSignalPlaceholder: 'Lokales SDP erscheint hier, sobald es fertiggestellt wurde.',
      remoteSignalLabel: 'Entferntes Signal (empfangenes JSON hier einzufügen belieben)',
      remoteSignalPlaceholder: 'Fügen Sie das JSON von Ihrem Peer ein. Drücken Sie Strg+Enter (Cmd+Enter am Mac) oder klicken Sie auf Remote applizieren.',
      copyButton: 'Duplizieren',
      copied: 'Dupliziert!',
      copyFailed: 'Fehlgeschlagen',
      copyAriaLabel: 'Lokales Signal in Zwischenablage duplizieren'
    },
    chat: {
      title: 'Konversation',
      addApiKey: 'OpenAI-Schlüssel hinzufügen',
      updateApiKey: 'OpenAI-Schlüssel aktualisieren',
      themeToggle: (isDark) => isDark ? '🌙 Dunkler Modus' : '🌞 Heller Modus',
      themeToggleTitle: (isDark) => isDark ? 'Zu hellem Theme wechseln' : 'Zu dunklem Theme wechseln',
      clear: 'Entfernen',
      clearAriaLabel: 'Alle Konversations-Mitteilungen entfernen',
      emptyState: 'Noch keine Mitteilungen. Konnektieren Sie sich mit einem Peer, sofern Sie jemanden finden.',
      roleLabels: {
        local: 'Ihre Wenigkeit',
        remote: 'Peer',
        system: 'Notiz'
      },
      inputPlaceholder: 'Verfassen Sie eine Mitteilung...',
      inputAriaLabel: 'Mitteilungs-Eingabe',
      aiButton: 'Mit KI raffinieren',
      aiButtonBusy: 'Raffiniere…',
      aiButtonNoKey: 'OpenAI-Schlüssel hinzufügen, um KI zu aktivieren',
      aiButtonTitle: 'Lassen Sie OpenAI eine distinguiertere Version Ihrer Mitteilung vorschlagen.',
      aiButtonTitleNoKey: 'Fügen Sie Ihren OpenAI-Schlüssel hinzu, um KI-Assistenz zu aktivieren.',
      send: 'Absenden',
      sendAriaLabel: 'Mitteilung absenden',
      sendTitle: 'Mitteilung absenden',
      charCount: (current, max) => `${current} / ${max}`
    },
    apiKeyModal: {
      title: 'OpenAI-Integration',
      close: 'Adieu',
      closeAriaLabel: 'API-Schlüssel-Dialog schließen',
      description: 'Geben Sie Ihren persönlichen OpenAI-API-Schlüssel ein, um optionale KI-Assistenz zu aktivieren. Der Schlüssel wird nur im Speicher verwahrt und während Raffinierungsanfragen ausschließlich an api.openai.com transmittiert.',
      label: 'OpenAI-API-Schlüssel',
      placeholder: 'sk-...',
      hint: 'Teilen Sie niemals API-Schlüssel auf nicht vertrauenswürdigen Apparaten. Aktualisieren Sie diese Seite oder deaktivieren Sie die KI, um den Schlüssel zu eliminieren.',
      save: 'Schlüssel konservieren',
      disable: 'KI deaktivieren',
      continueWithout: 'Ohne KI fortfahren'
    },
    status: {
      waiting: 'Warte auf Konnektion...',
      signalReady: 'Signal bereit zur Transmission',
      ice: (state) => `ICE: ${state}`,
      connection: (state) => `Konnektion: ${state}`,
      creatingOffer: 'Kreiere Offerte...',
      creatingAnswer: 'Kreiere Replik...',
      remoteApplied: (type) => `Entferntes ${type} appliziert`,
      disconnected: 'Diskonnektiert',
      channelOpen: 'Kanal offen',
      channelClosed: 'Kanal geschlossen',
      answerApplied: 'Replik appliziert, warte auf Kanal...'
    },
    systemMessages: {
      themeSwitch: (theme) => `Theme gewechselt zu ${theme === 'dark' ? 'dunklem' : 'hellem'} Modus.`,
      continueWithoutAi: 'Ohne KI-Assistenz fortfahren. Sie können später einen Schlüssel aus dem Konversations-Bereich hinzufügen, falls Sie sich anders besinnen.',
      apiKeyStored: 'OpenAI-API-Schlüssel nur in dieser Browser-Session konserviert. Seite aktualisieren, um ihn zu eliminieren.',
      aiDisabled: 'KI-Assistenz deaktiviert. Mitteilungen werden ohne KI-Hilfe abgesendet.',
      aiReady: 'OpenAI-Assistenz bereit. Prüfen Sie Vorschläge vor dem Absenden, versteht sich.',
      securityBlocked: 'Sicherheitsnotiz: Mitteilung blockiert, die kein reiner Text war.',
      messageTooLong: (max) => `Mitteilung blockiert: überschreitet das ${max}-Zeichen-Limit.`,
      rateLimit: 'Ratenlimit appliziert: Peer transmittiert Mitteilungen zu rapide.',
      channelBlocked: (label) => `Sicherheitsnotiz: Unerwarteten Datenkanal "${label || 'unbenannt'}" blockiert.`,
      createOfferFailed: 'Offerte konnte nicht kreiert werden. WebRTC wird möglicherweise nicht supportiert oder Browser-Berechtigungen wurden verweigert.',
      remoteEmpty: 'Entferntes Signal ist vakant. Fügen Sie das von Ihrem Peer erhaltene JSON ein.',
      remoteInvalidJson: 'Entferntes Signal ist kein valides JSON. Kopieren Sie das komplette Signal erneut und repetieren Sie den Vorgang.',
      remoteMissingData: 'Entferntem Signal fehlen essentielle Daten. Stellen Sie sicher, dass Sie die Offerte oder Replik exakt so eingefügt haben, wie sie präsentiert wurde.',
      createAnswerFailed: 'Replik konnte nicht kreiert werden. Applizieren Sie zuerst eine valide entfernte Offerte und stellen Sie sicher, dass WebRTC verfügbar ist.',
      needOfferForAnswer: 'Vor dem Kreieren einer Replik wird eine entfernte Offerte benötigt.',
      messageInputTooLong: (max, current) => `Mitteilung zu lang: Limit ist ${max} Zeichen (Sie haben ${current} getippt).`,
      disconnectNotice: 'Konnektion geschlossen. Kreieren Sie eine neue Offerte, um sich erneut zu konnektieren.',
      aiRewriteFailed: (error) => `KI-Raffinierung fehlgeschlagen: ${error || 'Anfrage wurde zurückgewiesen.'}`,
      aiTruncated: 'KI-Vorschlag gekürzt, um dem Mitteilungslängenlimit zu entsprechen.',
      aiSuggestionApplied: 'KI-Vorschlag appliziert. Prüfen Sie und editieren Sie vor dem Absenden.',
      chatCleared: 'Konversations-Verlauf eliminiert.',
      aiRewriteNotAttempted: (max) => `KI-Raffinierung nicht attemptet: Entwürfe müssen unter ${max} Zeichen sein.`
    },
    aiErrors: {
      emptyKey: 'Geben Sie einen OpenAI-API-Schlüssel ein, um die KI-Raffinierung zu aktivieren.',
      unauthorized: 'OpenAI hat die Anfrage zurückgewiesen. Prüfen Sie, dass Ihr API-Schlüssel korrekt ist und den erforderlichen Zugriff besitzt.',
      requestFailed: (status) => `OpenAI-Anfrage fehlgeschlagen mit Status ${status}`,
      missingContent: 'OpenAI-Replik fehlt Inhalt.',
      emptySuggestion: 'OpenAI hat einen vakanten Vorschlag retourniert.'
    },
    language: {
      label: 'Idiom',
      ariaLabel: 'Idiom selektieren'
    }
  }
};

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'thecommunity.language-preference';

/**
 * Get translation value by path
 * @param {Object} translations - Translation object
 * @param {string} path - Dot-separated path (e.g., 'chat.title')
 * @returns {*} Translation value
 */
function getTranslation(translations, path) {
  return path.split('.').reduce((obj, key) => obj?.[key], translations);
}

/**
 * Get current language from storage or default to 'de'
 * @returns {string} Language code
 */
function getCurrentLanguage() {
  if (typeof window === 'undefined') {
    return 'de';
  }
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && translations[stored]) {
      return stored;
    }
  } catch (error) {
    console.warn('Language preference could not be read from storage.', error);
  }
  return 'de';
}

/**
 * Set current language in storage
 * @param {string} language - Language code
 */
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

/**
 * Get all available languages
 * @returns {Array<{code: string, name: string}>}
 */
function getAvailableLanguages() {
  return Object.keys(translations).map(code => ({
    code,
    name: translations[code].name
  }));
}
