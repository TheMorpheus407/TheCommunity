# TheCommunity

A fully peer-to-peer WebRTC chat application with **no backend server** and **no signaling broker**. Communication happens directly between browsers using manual signaling exchange.

🌐 **Live Demo:** [https://themorpheus407.github.io/TheCommunity/](https://themorpheus407.github.io/TheCommunity/)

## Overview

TheCommunity is a community-driven project that demonstrates true peer-to-peer communication. The project direction is entirely steered by the community through GitHub Issues. Starting as a chat application, its future evolution depends on community contributions and ideas.

## Key Features

### 🔒 Security & Privacy
- **No Backend Required** - All communication happens directly between peers via WebRTC DataChannels
- **Manual Signaling** - No automatic signaling server means users control exactly what information is shared
- **Rate Limiting** - Protection against message flooding (max 30 messages per 5-second interval)
- **Message Size Limits** - Maximum 2000 characters per message to prevent abuse
- **Channel Validation** - Only accepts the expected 'chat' data channel, blocks others
- **Security Warnings** - Users are informed that sharing WebRTC signals reveals network addresses

### 💬 Chat Features
- **Real-time P2P Messaging** - Direct browser-to-browser communication
- **Message History** - Visual distinction between your messages, peer messages, and system notices
- **Auto-scroll** - Messages automatically scroll to show the latest content
- **Input Validation** - Client-side validation for message length and format

### 🎨 User Interface
- **Collapsible Signaling Window** - Hide the technical signaling UI once connected
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Modern Dark Theme** - Beautiful gradient background with glassmorphic design
- **Status Indicators** - Real-time connection status and channel state feedback
- **Accessible** - ARIA labels and semantic HTML for better accessibility

### 🛠️ Technical Features
- **Zero Dependencies** - Uses only native browser APIs and React from CDN
- **No Build Step** - Pure JavaScript that runs directly in the browser
- **ICE Candidate Collection** - Automatically gathers and includes ICE candidates in signals
- **Connection State Monitoring** - Tracks ICE and peer connection states
- **Graceful Cleanup** - Properly closes connections when the page is unloaded

## Technologies Used

### Core Technologies
- **WebRTC** - Real-time peer-to-peer communication
  - RTCPeerConnection API for establishing connections
  - RTCDataChannel API for text messaging
  - ICE (Interactive Connectivity Establishment) for NAT traversal

### Frontend
- **React 18** - UI library (loaded from CDN)
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, backdrop filters, and responsive design
- **JavaScript (ES6+)** - Modern JavaScript with hooks (useState, useRef, useCallback, useEffect)

### Infrastructure
- **GitHub Pages** - Static hosting
- **GitHub Actions** - Automated deployment

## How It Works

### The Manual Signaling Process

Since there's no signaling server, users manually exchange WebRTC signals:

1. **Peer A (Initiator)**
   - Clicks "Create Offer"
   - Copies the generated JSON signal
   - Shares it with Peer B (via email, chat, etc.)

2. **Peer B (Responder)**
   - Pastes Peer A's signal into "Remote Signal"
   - Clicks "Apply Remote"
   - Clicks "Create Answer"
   - Copies and shares their answer signal with Peer A

3. **Peer A (Completing Connection)**
   - Pastes Peer B's answer into "Remote Signal"
   - Clicks "Apply Remote"
   - Connection establishes automatically

4. **Chat Begins**
   - Once connected, the signaling window can be collapsed
   - Messages flow directly peer-to-peer
   - No server involvement in the conversation

### WebRTC Architecture

```
┌─────────────┐                    ┌─────────────┐
│   Peer A    │                    │   Peer B    │
│  (Browser)  │                    │  (Browser)  │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │  1. Create Offer                │
       ├──────────────────────────────►  │
       │     (Manual Exchange)            │
       │                                  │
       │  2. Create Answer                │
       │  ◄──────────────────────────────┤
       │     (Manual Exchange)            │
       │                                  │
       │  3. Direct P2P Connection        │
       │  ◄═══════════════════════════►  │
       │      (WebRTC DataChannel)        │
       │                                  │
       │  4. Chat Messages                │
       │  ◄═══════════════════════════►  │
       │                                  │
```

## Getting Started

### Prerequisites
- A modern web browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- No installation required!

### Usage

#### Option 1: Use the Live Version
Simply visit [https://themorpheus407.github.io/TheCommunity/](https://themorpheus407.github.io/TheCommunity/)

#### Option 2: Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/TheMorpheus407/TheCommunity.git
   cd TheCommunity
   ```

2. Open `index.html` in your browser:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Node.js
   npx http-server
   ```

3. Navigate to `http://localhost:8000`

### Connecting with a Peer

1. Both users open the application
2. One user creates an offer and shares the signal
3. The other user applies the offer, creates an answer, and shares back
4. The first user applies the answer
5. Start chatting!

**Note:** For best results, have both users ready at the same time since the signaling exchange is manual.

## Project Structure

```
TheCommunity/
├── index.html          # Main HTML file
├── app.js              # React application with WebRTC logic
├── styles.css          # All styling (dark theme, responsive)
├── package.json        # Project metadata
├── LICENSE             # MIT License
├── CLAUDE.md           # AI development guidelines
├── AGENTS.md           # Additional development guidelines
└── .github/
    └── workflows/      # GitHub Actions for deployment
```

## Security Considerations

### What This Application Does
- ✅ Establishes direct peer-to-peer connections
- ✅ Protects against message flooding
- ✅ Validates data channel names
- ✅ Limits message sizes
- ✅ Warns users about network address exposure

### What This Application Doesn't Do
- ❌ Encrypt messages (WebRTC DataChannels use DTLS, but content is not end-to-end encrypted)
- ❌ Authenticate users
- ❌ Persist message history
- ❌ Hide your IP address from peers

### Recommendations
- Only connect with people you trust
- Don't share sensitive information
- Be aware that your IP address is visible to peers
- Consider using a VPN if privacy is a concern

## Development

### Contributing

This is a community-driven project! Here's how to contribute:

1. **Check Existing Issues** - See what the community is working on
2. **Create an Issue** - Propose new features or report bugs
3. **Submit a Pull Request** - Follow the project's clean code guidelines
4. **Follow CLAUDE.md** - Read the development guidelines before contributing

### Development Principles (from CLAUDE.md)

- Clean, maintainable code
- Extensible architecture
- No breaking changes to the live application
- Security-first approach
- Community-driven feature development
- WebRTC-only communication (no backend)

### Testing Your Changes

Since the app is deployed via GitHub Actions:
1. Test thoroughly in your local environment
2. Check the preview at `https://themorpheus407.github.io/TheCommunity/` after deployment
3. Verify no functionality is broken
4. Test on multiple browsers if possible

## Roadmap

The future of TheCommunity is decided by the community through GitHub Issues. Current areas of interest:

- Additional P2P features
- Enhanced security measures
- UI/UX improvements
- Mobile experience optimization
- File sharing capabilities (future consideration)
- Video/audio chat (future consideration)

Want to suggest a feature? [Open an issue!](https://github.com/TheMorpheus407/TheCommunity/issues/new)

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome  | 56+            | Full support |
| Firefox | 44+            | Full support |
| Safari  | 11+            | Full support |
| Edge    | 79+            | Full support (Chromium) |

## Troubleshooting

### Connection Not Establishing
- Ensure both peers have completed the full signaling exchange
- Check that the signals are copied completely (they're long JSON strings)
- Verify both browsers support WebRTC
- Try refreshing and starting over

### Messages Not Sending
- Check that the channel status shows "Channel open"
- Ensure you're not sending messages too quickly (rate limit)
- Verify your message is under 2000 characters

### "ICE: failed" Status
- One or both peers may be behind a restrictive firewall
- Consider using a STUN/TURN server (requires code modification)
- Try on a different network

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with WebRTC technology
- Powered by React
- Designed for the community, by the community

## Contact & Support

- **Issues:** [GitHub Issues](https://github.com/TheMorpheus407/TheCommunity/issues)
- **Discussions:** Use GitHub Issues for feature requests and questions
- **Repository:** [https://github.com/TheMorpheus407/TheCommunity](https://github.com/TheMorpheus407/TheCommunity)

---

**Built with ❤️ by the community | No servers, no tracking, just pure P2P**
