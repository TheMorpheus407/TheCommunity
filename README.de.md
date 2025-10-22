# TheCommunity

Eine vollständig peer-to-peer WebRTC-Chat-Anwendung **ohne Backend-Server** und **ohne Signalisierungs-Broker**. Die Kommunikation erfolgt direkt zwischen Browsern durch manuellen Signalaustausch.

🌐 **Live-Demo:** [https://themorpheus407.github.io/TheCommunity/](https://themorpheus407.github.io/TheCommunity/)

## Überblick

TheCommunity ist ein gemeinschaftsgetriebenes Projekt, das echte Peer-to-Peer-Kommunikation demonstriert. Die Projektrichtung wird vollständig von der Community über GitHub Issues gesteuert. Als Chat-Anwendung gestartet, hängt die zukünftige Entwicklung von Community-Beiträgen und Ideen ab.

## Hauptmerkmale

### 🔒 Sicherheit & Privatsphäre
- **Kein Backend erforderlich** - Die gesamte Kommunikation erfolgt direkt zwischen Peers über WebRTC DataChannels
- **Manuelle Signalisierung** - Kein automatischer Signalisierungsserver bedeutet, dass Benutzer genau kontrollieren, welche Informationen geteilt werden
- **Rate Limiting** - Schutz vor Nachrichtenflut (maximal 30 Nachrichten pro 5-Sekunden-Intervall)
- **Nachrichtengrößenbeschränkung** - Maximal 2000 Zeichen pro Nachricht zur Missbrauchsverhinderung
- **Kanalvalidierung** - Akzeptiert nur den erwarteten 'chat'-Datenkanal, blockiert andere
- **Sicherheitswarnungen** - Benutzer werden informiert, dass das Teilen von WebRTC-Signalen Netzwerkadressen offenlegt

### 💬 Chat-Funktionen
- **Echtzeit-P2P-Messaging** - Direkte Browser-zu-Browser-Kommunikation
- **Nachrichtenverlauf** - Visuelle Unterscheidung zwischen eigenen Nachrichten, Peer-Nachrichten und Systemhinweisen
- **Auto-Scroll** - Nachrichten scrollen automatisch zum neuesten Inhalt
- **Eingabevalidierung** - Client-seitige Validierung für Nachrichtenlänge und Format
- **KI-Entwurfshilfe** - Optionale OpenAI-gestützte Neuschreiben-Funktion, die Ihren Text lokal mit Ihrem eigenen API-Schlüssel verfeinert

### 🖥️ Bildschirm-Zusammenarbeit
- **Bildschirmfreigabe** - Streamen Sie Ihren Bildschirm peer-to-peer ohne Server
- **Berechtigte Fernsteuerung** - Erlauben Sie Ihrem Peer, Ihre Maus und Tastatur innerhalb der App zu steuern, mit explizitem Opt-in und sofortigem Widerruf

### 🎨 Benutzeroberfläche
- **Einklappbares Signalisierungsfenster** - Verstecken Sie die technische Signalisierungs-UI nach dem Verbinden
- **Responsives Design** - Funktioniert nahtlos auf Desktop- und Mobilgeräten
- **Hell/Dunkel-Theme-Umschalter** - Ein-Klick-Wechsel zwischen Farbpaletten, pro Browser gespeichert und von der Systemeinstellung übernommen
- **Sprachauswahl** - Wechseln Sie die Oberfläche zwischen mehreren deutschen Dialekten im Handumdrehen
- **Statusanzeigen** - Echtzeit-Verbindungsstatus und Kanalzustands-Feedback
- **Barrierefrei** - ARIA-Labels und semantisches HTML für bessere Zugänglichkeit

### 🔊 Audio-Erlebnis
- **Hintergrund-Loop** - Nach Ihrer ersten Interaktion startet der angeforderte "oiia oiia"-Soundtrack mit voller Lautstärke und wiederholt sich für maximale Gamer-Energie (Issue #73)
- **Konami-Remix** - Geben Sie die klassische ↑ ↑ ↓ ↓ ← → ← → B A Kombination ein, um den Nyan Cat-Track zusätzlich zum Hintergrund-Loop zu aktivieren

### 🛠️ Technische Funktionen
- **Null Abhängigkeiten** - Verwendet nur native Browser-APIs und React von CDN
- **Kein Build-Schritt** - Reines JavaScript, das direkt im Browser läuft
- **ICE-Kandidaten-Sammlung** - Sammelt und enthält automatisch ICE-Kandidaten in Signalen
- **Verbindungszustands-Überwachung** - Verfolgt ICE- und Peer-Verbindungszustände
- **Elegante Bereinigung** - Schließt Verbindungen ordnungsgemäß, wenn die Seite entladen wird

## Verwendete Technologien

### Kerntechnologien
- **WebRTC** - Echtzeit-Peer-to-Peer-Kommunikation
  - RTCPeerConnection API zum Aufbau von Verbindungen
  - RTCDataChannel API für Text-Messaging
  - ICE (Interactive Connectivity Establishment) für NAT-Traversierung

### Frontend
- **React 18** - UI-Bibliothek (von CDN geladen)
- **HTML5** - Semantisches Markup
- **CSS3** - Modernes Styling mit Verläufen, Backdrop-Filtern und responsivem Design
- **JavaScript (ES6+)** - Modernes JavaScript mit Hooks (useState, useRef, useCallback, useEffect)

### Infrastruktur
- **GitHub Pages** - Statisches Hosting
- **GitHub Actions** - Automatisierte Bereitstellung

## Wie es funktioniert

### Der manuelle Signalisierungsprozess

Da es keinen Signalisierungsserver gibt, tauschen Benutzer WebRTC-Signale manuell aus:

1. **Peer A (Initiator)**
   - Klickt auf "Create Offer"
   - Kopiert das generierte JSON-Signal
   - Teilt es mit Peer B (per E-Mail, Chat usw.)

2. **Peer B (Responder)**
   - Fügt Peer A's Signal in "Remote Signal" ein
   - Klickt auf "Apply Remote"
   - Klickt auf "Create Answer"
   - Kopiert und teilt ihr Antwortsignal mit Peer A

3. **Peer A (Verbindung vervollständigen)**
   - Fügt Peer B's Antwort in "Remote Signal" ein
   - Klickt auf "Apply Remote"
   - Verbindung wird automatisch hergestellt

4. **Chat beginnt**
   - Sobald verbunden, kann das Signalisierungsfenster eingeklappt werden
   - Nachrichten fließen direkt peer-to-peer
   - Keine Server-Beteiligung an der Konversation

### KI-Entwurfshilfe (Optional)

1. Beim Start der App können Sie einen persönlichen OpenAI API-Schlüssel einfügen. Der Schlüssel blverbleibt nur im Browser-Speicher und wird ausschließlich an `api.openai.com` gesendet.
2. Entwerfen Sie eine Nachricht und klicken Sie auf **Rewrite with AI**, um eine verfeinerte Version anzufordern. Das Ergebnis ersetzt Ihren lokalen Entwurf, sodass Sie ihn vor dem Senden überprüfen können.
3. Verwenden Sie **Update OpenAI Key** im Chat-Header jederzeit, um den Schlüssel zu rotieren oder zu entfernen.
4. Wählen Sie **Disable AI** oder aktualisieren Sie die Seite, um den Schlüssel vollständig zu löschen. Sie sind für alle Nutzungsgebühren verantwortlich, die Ihrem OpenAI-Konto berechnet werden.

### Theme-Präferenzen

- Das anfängliche Theme entspricht, wenn möglich, Ihrer Betriebssystemeinstellung.
- Verwenden Sie den **Light/Dark Mode**-Umschalter im Chat-Header, um jederzeit zwischen Farbpaletten zu wechseln.
- Ihre Wahl wird lokal gespeichert; löschen Sie den Browser-Speicher oder schalten Sie erneut um, um einer anderen Präferenz zu folgen.

### WebRTC-Architektur

```
┌─────────────┐                    ┌─────────────┐
│   Peer A    │                    │   Peer B    │
│  (Browser)  │                    │  (Browser)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  1. Create Offer                │
       ├──────────────────────────────►  │
       │     (Manueller Austausch)        │
       │                                  │
       │  2. Create Answer                │
       │  ◄──────────────────────────────┤
       │     (Manueller Austausch)        │
       │                                  │
       │  3. Direkte P2P-Verbindung       │
       │  ◄═══════════════════════════►  │
       │      (WebRTC DataChannel)        │
       │                                  │
       │  4. Chat-Nachrichten             │
       │  ◄═══════════════════════════►  │
       │                                  │
```

## Erste Schritte

### Voraussetzungen
- Ein moderner Webbrowser mit WebRTC-Unterstützung (Chrome, Firefox, Safari, Edge)
- Keine Installation erforderlich!

### Verwendung

#### Option 1: Live-Version verwenden
Besuchen Sie einfach [https://themorpheus407.github.io/TheCommunity/](https://themorpheus407.github.io/TheCommunity/)

#### Option 2: Lokal ausführen
1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/TheMorpheus407/TheCommunity.git
   cd TheCommunity
   ```

2. Öffnen Sie `index.html` in Ihrem Browser:
   ```bash
   # Mit Python 3
   python -m http.server 8000

   # Oder mit Node.js
   npx http-server
   ```

3. Navigieren Sie zu `http://localhost:8000`

### Mit einem Peer verbinden

1. Beide Benutzer öffnen die Anwendung
2. Ein Benutzer erstellt ein Angebot und teilt das Signal
3. Der andere Benutzer wendet das Angebot an, erstellt eine Antwort und teilt sie zurück
4. Der erste Benutzer wendet die Antwort an
5. Loschatten!

**Hinweis:** Für beste Ergebnisse sollten beide Benutzer gleichzeitig bereit sein, da der Signalaustausch manuell erfolgt.

## Projektstruktur

```
TheCommunity/
├── index.html          # Haupt-HTML-Datei
├── app.js              # React-Anwendung mit WebRTC-Logik
├── styles.css          # Alle Stile (dunkles Theme, responsiv)
├── package.json        # Projekt-Metadaten
├── LICENSE             # MIT-Lizenz
├── CLAUDE.md           # KI-Entwicklungsrichtlinien
├── AGENTS.md           # Zusätzliche Entwicklungsrichtlinien
└── .github/
    └── workflows/      # GitHub Actions für Deployment
```

## Sicherheitsüberlegungen

### Was diese Anwendung tut
- ✅ Stellt direkte Peer-to-Peer-Verbindungen her
- ✅ Schützt vor Nachrichtenflut
- ✅ Validiert Datenkanalnamen
- ✅ Begrenzt Nachrichtengrößen
- ✅ Warnt Benutzer vor Offenlegung der Netzwerkadresse

### Was diese Anwendung nicht tut
- ❌ Verschlüsselt Nachrichten nicht (WebRTC DataChannels verwenden DTLS, aber der Inhalt ist nicht Ende-zu-Ende-verschlüsselt)
- ❌ Authentifiziert Benutzer nicht
- ❌ Speichert keinen Nachrichtenverlauf dauerhaft
- ❌ Versteckt Ihre IP-Adresse nicht vor Peers
- ❌ Leitet OpenAI-Anfragen nicht in Ihrem Namen weiter (Ihr Browser kommuniziert direkt mit api.openai.com mit Ihrem Schlüssel)

### Empfehlungen
- Verbinden Sie sich nur mit Personen, denen Sie vertrauen
- Teilen Sie keine sensiblen Informationen
- Seien Sie sich bewusst, dass Ihre IP-Adresse für Peers sichtbar ist
- Erwägen Sie die Verwendung eines VPN, wenn Privatsphäre ein Anliegen ist
- Behandeln Sie Ihren OpenAI API-Schlüssel wie ein Passwort und geben Sie ihn nur auf Geräten ein, die Sie kontrollieren

## Entwicklung

### Beitragen

Dies ist ein gemeinschaftsgetriebenes Projekt! So können Sie beitragen:

1. **Bestehende Issues prüfen** - Sehen Sie, woran die Community arbeitet
2. **Ein Issue erstellen** - Schlagen Sie neue Funktionen vor oder melden Sie Fehler
3. **Einen Pull Request einreichen** - Folgen Sie den Clean-Code-Richtlinien des Projekts
4. **Folgen Sie CLAUDE.md** - Lesen Sie die Entwicklungsrichtlinien, bevor Sie beitragen

### Entwicklungsprinzipien (aus CLAUDE.md)

- Sauberer, wartbarer Code
- Erweiterbare Architektur
- Keine Breaking Changes für die Live-Anwendung
- Security-First-Ansatz
- Gemeinschaftsgetriebene Feature-Entwicklung
- Nur WebRTC-Kommunikation (kein Backend)

### Ihre Änderungen testen

Da die App über GitHub Actions bereitgestellt wird:
1. Testen Sie gründlich in Ihrer lokalen Umgebung
2. Überprüfen Sie die Vorschau unter `https://themorpheus407.github.io/TheCommunity/` nach dem Deployment
3. Stellen Sie sicher, dass keine Funktionalität defekt ist
4. Testen Sie wenn möglich auf mehreren Browsern

## Roadmap

Die Zukunft von TheCommunity wird von der Community über GitHub Issues entschieden. Aktuelle Interessensgebiete:

- Zusätzliche P2P-Funktionen
- Erweiterte Sicherheitsmaßnahmen
- UI/UX-Verbesserungen
- Mobile-Erfahrungs-Optimierung
- Dateifreigabe-Fähigkeiten (zukünftige Überlegung)
- Video-/Audio-Chat (zukünftige Überlegung)

Möchten Sie eine Funktion vorschlagen? [Öffnen Sie ein Issue!](https://github.com/TheMorpheus407/TheCommunity/issues/new)

## Browser-Kompatibilität

| Browser | Mindestversion | Anmerkungen |
|---------|----------------|-------------|
| Chrome  | 56+            | Volle Unterstützung |
| Firefox | 44+            | Volle Unterstützung |
| Safari  | 11+            | Volle Unterstützung |
| Edge    | 79+            | Volle Unterstützung (Chromium) |

## Fehlerbehebung

### Verbindung wird nicht hergestellt
- Stellen Sie sicher, dass beide Peers den vollständigen Signalaustausch abgeschlossen haben
- Überprüfen Sie, dass die Signale vollständig kopiert wurden (es sind lange JSON-Strings)
- Verifizieren Sie, dass beide Browser WebRTC unterstützen
- Versuchen Sie, die Seite zu aktualisieren und neu zu starten

### Nachrichten werden nicht gesendet
- Überprüfen Sie, dass der Kanalstatus "Channel open" anzeigt
- Stellen Sie sicher, dass Sie nicht zu schnell Nachrichten senden (Rate Limit)
- Verifizieren Sie, dass Ihre Nachricht unter 2000 Zeichen liegt

### "ICE: failed"-Status
- Ein oder beide Peers befinden sich möglicherweise hinter einer restriktiven Firewall
- Erwägen Sie die Verwendung eines STUN/TURN-Servers (erfordert Code-Änderung)
- Versuchen Sie es in einem anderen Netzwerk

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE)-Datei für Details.

## Deutsche Dialekte & Umgangssprache

Diese App ist für alle deutschsprachigen Communities gedacht! Hier einige regionale Variationen, wie man "Let's chat!" sagen könnte:

- 🇩🇪 **Hochdeutsch** (Standard): "Lass uns chatten!"
- 🥨 **Bayerisch**: "Kemma schwätzen!" oder "Losgeht's zum Ratschen!"
- 🏔️ **Schwäbisch**: "Komm, mir schwätzet oi bissle!"
- 🐻 **Berlinerisch**: "Komm, wa labern ma ne Runde!"
- 🍺 **Kölsch**: "Kumm, loss mer kalle!"
- ⚓ **Norddeutsch/Platt**: "Komm, wi schnackt mal!"
- 🍷 **Pfälzisch**: "Komm, mir schwätze mol!"
- 🎭 **Sächsisch**: "Nu gomm, mor glaabschn a bissl!"
- 🏰 **Fränkisch**: "Kumm, mir schwätzn a weng!"
- 🌲 **Alemannisch**: "Chum, mir schwätze chli!"

**Hinweis:** Egal ob du "Grüß Gott", "Moin", "Servus" oder "Tach" sagst - diese P2P-Chat-App verbindet uns alle ohne Server, ohne Tracking, nur pure direkte Verbindung!

## Anerkennungen

- Gebaut mit WebRTC-Technologie
- Powered by React
- Entworfen für die Community, von der Community

## Kontakt & Support

- **Issues:** [GitHub Issues](https://github.com/TheMorpheus407/TheCommunity/issues)
- **Diskussionen:** Nutzen Sie GitHub Issues für Feature-Requests und Fragen
- **Repository:** [https://github.com/TheMorpheus407/TheCommunity](https://github.com/TheMorpheus407/TheCommunity)

---

**Gebaut mit ❤️ von der Community | Keine Server, kein Tracking, nur reines P2P**
