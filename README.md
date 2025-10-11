# TheCommunity - P2P WebRTC Chat Application

A fully peer-to-peer chat application built with WebRTC. No backend servers, no brokers - just direct browser-to-browser communication.

## 🚀 Live Demo

Visit the live application: [https://themorpheus407.github.io/TheCommunity/](https://themorpheus407.github.io/TheCommunity/)

## ✨ Features

- **True P2P Communication**: Direct WebRTC connection between browsers with no backend infrastructure
- **Manual Signaling**: Exchange connection offers and answers manually for maximum control
- **Security First**:
  - Rate limiting on incoming messages
  - Message size validation
  - Channel label verification
  - Network address privacy warnings
- **Clean UI**: Modern, responsive design with collapsible panels
- **Error Handling**: Comprehensive error boundary and user-friendly error messages

## 🏗️ Architecture

This application follows a unique architecture:

- **Frontend Only**: Pure client-side application (HTML, CSS, JavaScript)
- **No Backend**: Zero server-side code - everything runs in the browser
- **React (via CDN)**: Uses React 18 without a build step
- **WebRTC DataChannel**: Peer-to-peer communication using RTCPeerConnection
- **Manual Signaling**: Users exchange connection information manually (no signaling server)

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed technical documentation.

## 🛠️ Development

### Prerequisites

- Node.js (for development tools only - not required for the app to run)
- A modern web browser with WebRTC support
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/TheMorpheus407/TheCommunity.git
cd TheCommunity
```

2. Install development dependencies:
```bash
npm install
```

3. Run validation/linting:
```bash
npm run lint
```

### Project Structure

```
TheCommunity/
├── index.html          # Main HTML entry point
├── app.js              # React application with WebRTC logic
├── styles.css          # Styling and responsive design
├── .nojekyll           # GitHub Pages configuration
├── .eslintrc.json      # ESLint configuration
├── package.json        # NPM scripts and dev dependencies
├── CLAUDE.md           # AI assistant instructions
├── ARCHITECTURE.md     # Technical architecture documentation
└── README.md           # This file
```

### Development Workflow

1. **Make Changes**: Edit `app.js`, `styles.css`, or `index.html`
2. **Validate**: Run `npm run validate` to check code quality
3. **Test Locally**: Open `index.html` in a browser or use a local server
4. **Commit**: Follow conventional commit style (e.g., `feat:`, `fix:`, `docs:`)
5. **Push**: Changes are automatically deployed via GitHub Pages

### Code Quality

This project uses ESLint for code quality. Available npm scripts:

- `npm run lint` - Check code for issues
- `npm run lint:fix` - Automatically fix linting issues
- `npm run validate` - Run all validation checks

## 🔒 Security Considerations

### What This App Does NOT Store or Transmit to Servers

- No messages are stored on any server
- No user data is collected or transmitted to backend systems
- No analytics or tracking (beyond standard GitHub Pages)
- Connection information (offers/answers) is shared manually between users

### Security Features

- **Rate Limiting**: Maximum 30 messages per 5 seconds from peers
- **Message Validation**:
  - Text-only messages (binary data blocked)
  - Maximum message length: 2000 characters
- **Channel Verification**: Only accepts expected data channel labels
- **Privacy Warning**: Users are warned about IP address exposure in WebRTC signals

### Known Limitations

- **IP Address Exposure**: WebRTC signals contain network addresses (ICE candidates). Only share with trusted peers.
- **No Encryption Beyond WebRTC**: Messages use WebRTC's built-in encryption (DTLS/SRTP)
- **No Authentication**: Anyone with your offer/answer can connect
- **Manual Signaling**: Requires out-of-band communication to exchange connection data

## 📖 How to Use

### Connecting Two Peers

1. **Peer A** clicks "Create Offer"
2. **Peer A** copies the generated signal and sends it to Peer B (via email, messenger, etc.)
3. **Peer B** pastes the signal into "Remote Signal" and clicks "Apply Remote"
4. **Peer B** clicks "Create Answer" and sends their signal back to Peer A
5. **Peer A** pastes Peer B's answer into "Remote Signal" and clicks "Apply Remote"
6. Connection establishes and chat becomes available

### UI Features

- **Collapsible Signaling Panel**: After connection, collapse to save space
- **Floating Chat**: Chat window can be minimized to the bottom-right corner
- **Status Indicators**: Real-time connection and channel status
- **Message History**: Scrollable message container with role-based styling

## 🤝 Contributing

This is a community-driven project. Contributions are guided by GitHub Issues.

### Contribution Guidelines

1. **Always Work from Issues**: Features and changes come from community issues
2. **Follow CLAUDE.md**: See project-specific guidelines for AI assistants
3. **Security First**: All PRs are reviewed for security implications
4. **Clean Code**: Maintain the existing architecture and code style
5. **Test Thoroughly**: The app is live - broken code affects real users

### Development Constraints

- **WebRTC Only**: No backend communication allowed (not even a signaling server)
- **No Build Step**: Keep it simple - no webpack, no bundlers
- **GitHub Pages Deployment**: All changes deploy automatically via GitHub Actions

## 📋 Roadmap

The future of this project is determined by the community via Issues. Initial focus:

- ✅ Basic P2P chat functionality
- ✅ Security hardening (rate limiting, validation)
- ✅ Error handling and boundaries
- ✅ Code quality tools (ESLint)
- 🔄 Automated testing
- 📝 Additional features (TBD by community)

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React 18 (via CDN)
- Styled with modern CSS (no frameworks)
- Deployed via GitHub Pages
- Community-driven development

---

**Note**: This is a community project. The direction is determined entirely by Issues. What started as a chat app may evolve into something entirely different based on community input.
