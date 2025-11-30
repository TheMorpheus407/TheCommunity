# Privacy Guide for TheCommunity

**Last Updated**: 2025-11-30

This guide explains how TheCommunity handles your data, what privacy guarantees it provides, and how to maximize your anonymity when using the application.

---

## Table of Contents

1. [What TheCommunity Does (and Doesn't Do)](#what-thecommunity-does-and-doesnt-do)
2. [Understanding IP Address Disclosure](#understanding-ip-address-disclosure)
3. [How to Protect Your Privacy](#how-to-protect-your-privacy)
4. [Using Tor for Signaling](#using-tor-for-signaling)
5. [Frequently Asked Questions](#frequently-asked-questions)

---

## What TheCommunity Does (and Doesn't Do)

### ✅ Privacy Features We Provide

- **No Backend Server**: All communication is direct peer-to-peer. We don't see, log, or store your conversations.
- **No User Accounts**: No registration, no passwords, no identity tracking.
- **No Analytics**: We don't track your usage, behavior, or analytics.
- **Manual Signaling**: You control exactly who receives your connection information.
- **SDP Metadata Minimization**: We remove unnecessary fingerprinting data from WebRTC signals.
- **Open Source**: All code is public and auditable on GitHub.

### ❌ Privacy Limitations You Should Know

- **IP Addresses Visible to Peers**: When you connect to someone, they can see your IP address (and you can see theirs). This is how WebRTC peer-to-peer connections work.
- **No End-to-End Encryption**: Messages are encrypted in transit (DTLS), but we don't provide additional end-to-end encryption with forward secrecy.
- **No Message Persistence**: Messages are not saved (which is good for privacy, but bad if you want history).
- **Browser Fingerprinting**: Your browser can be fingerprinted through WebRTC, even with privacy protections.

---

## Understanding IP Address Disclosure

### Why Does WebRTC Reveal IPs?

WebRTC is designed for **direct, low-latency connections** between browsers. To establish the fastest possible connection, your browser:

1. **Discovers your network addresses** (local and public IPs)
2. **Includes them in the connection offer** (SDP signal)
3. **Shares them with your peer** so they can connect directly to you

This is **by design** and is how P2P connections achieve low latency (no intermediary servers).

### What Information Is Shared?

When you create an offer or answer, the signal contains:
- Your **local IP address** (e.g., `192.168.1.100`)
- Your **public IP address** (e.g., `203.0.113.45`)
- Your **network port numbers**
- Your **browser and WebRTC version** (some fingerprinting data)

**Example** (simplified):
```json
{
  "type": "offer",
  "sdp": "...
    a=candidate:1 1 UDP 2130706431 192.168.1.100 54321 typ host
    a=candidate:2 1 UDP 1694498815 203.0.113.45 54322 typ srflx
    ..."
}
```

Your peer will see these addresses when they receive your signal.

### Can This Be Prevented?

**Short answer**: Not without using a relay server (which would require a backend, violating our core design principle).

**Long answer**: WebRTC offers privacy modes (like `default_address_only`), but these only limit the number of addresses shared—they don't hide your IP entirely. True anonymity requires routing traffic through a relay server or anonymization network, which introduces centralization and defeats the purpose of pure P2P.

---

## How to Protect Your Privacy

### 1. Use a VPN

**What it does**: Hides your real IP address from your peer.

**How to do it**:
1. Connect to a VPN service (Mullvad, ProtonVPN, etc.)
2. Open TheCommunity
3. Create offer/answer (your peer will see the VPN IP, not your real IP)

**Pros**:
- ✅ Simple to use
- ✅ Hides your real IP
- ✅ No changes to the app needed

**Cons**:
- ❌ Costs money (most VPNs)
- ❌ Requires trusting the VPN provider
- ❌ Peer's IP is still visible to you (not mutual anonymity)

---

### 2. Exchange Signals via Tor

**What it does**: Hides the signaling exchange from network observers (but not your IP from your peer).

**How to do it**:
1. Open Tor Browser
2. Visit a Tor-accessible pastebin (e.g., `http://pastebin[...]onion`)
3. Paste your offer/answer there
4. Share the pastebin link with your peer (via secure messaging)
5. Peer retrieves the signal via Tor
6. Connect normally in TheCommunity

**Pros**:
- ✅ Signaling metadata hidden from your ISP/network
- ✅ Free (no VPN cost)
- ✅ Mutual anonymity during signaling phase

**Cons**:
- ❌ Complex workflow (extra steps)
- ❌ **IP still visible after connection** (not full anonymity)
- ❌ Requires trusting the pastebin service
- ❌ Slower signaling (Tor latency)

**Recommended Tor Pastebins**:
- **ZeroBin** (various .onion instances)
- **PrivateBin** (self-hosted, some .onion sites)
- **Note**: Always verify .onion addresses from trusted sources

---

### 3. Combine VPN + Tor Signaling

**What it does**: Maximum privacy—hides signaling AND IP addresses.

**How to do it**:
1. Connect to VPN
2. Exchange signals via Tor pastebin (as above)
3. Connect in TheCommunity (peer sees VPN IP, not real IP)

**Pros**:
- ✅ Signaling anonymous (Tor)
- ✅ Connection anonymous (VPN)
- ✅ Best privacy for both parties

**Cons**:
- ❌ Most complex workflow
- ❌ Requires both VPN and Tor
- ❌ Slower performance

---

### 4. Only Connect with Trusted Peers

**What it does**: Reduces risk by limiting who can see your IP.

**How to do it**:
- Only share signals with people you know personally
- Verify identity out-of-band (Signal, phone, in-person)
- Don't post offers publicly (forums, social media)

**Pros**:
- ✅ Simple (no extra tools)
- ✅ Reduces attack surface

**Cons**:
- ❌ Doesn't hide your IP (peer can still see it)
- ❌ Limited to trusted contacts only

---

## Using Tor for Signaling

### Why Use Tor for Signaling?

Even if your peer will eventually see your IP address (after WebRTC connection), you may want to hide the **signaling process** from:
- Your ISP (Internet Service Provider)
- Network administrators (at work, school, etc.)
- Government surveillance

Tor hides **who** you're trying to connect with, even if the connection itself isn't anonymous.

### Step-by-Step: Tor Signaling Workflow

#### Step 1: Install Tor Browser
- Download from: https://www.torproject.org/download/
- Install and launch Tor Browser

#### Step 2: Find a Tor Pastebin
- Use Tor Browser to search for ".onion pastebin"
- **Verify** the .onion address from trusted sources (Tor Project forums, etc.)
- Examples (verify current addresses):
  - PrivateBin instances
  - ZeroBin instances

#### Step 3: Create and Share Offer
1. In TheCommunity (normal browser), click **Create Offer**
2. Copy the signal JSON
3. In Tor Browser, paste it into the Tor pastebin
4. Copy the pastebin link
5. Share the link with your peer via secure messaging (Signal, Matrix, etc.)

#### Step 4: Peer Retrieves Offer
1. Peer opens the Tor pastebin link in Tor Browser
2. Peer copies the offer
3. Peer pastes it into TheCommunity, clicks **Apply Remote**

#### Step 5: Peer Creates Answer
1. Peer clicks **Create Answer** in TheCommunity
2. Peer copies the answer JSON
3. Peer pastes it into the Tor pastebin (new paste)
4. Peer shares the new pastebin link with you

#### Step 6: Complete Connection
1. You retrieve the answer from Tor pastebin
2. You paste it into TheCommunity, click **Apply Remote**
3. Connection establishes (your IPs are now visible to each other)

### Important Notes
- ⚠️ **Tor hides signaling, not the connection** - Once WebRTC connects, your IPs are visible
- ⚠️ **Use VPN for full IP anonymity** - Combine Tor signaling + VPN for best privacy
- ⚠️ **Verify .onion addresses** - Phishing sites exist; only use trusted pastebins

---

## Frequently Asked Questions

### Q: Does TheCommunity hide my IP address?

**A**: No. WebRTC connections require sharing IP addresses to establish direct peer-to-peer links. Your peer will see your public IP address after connecting.

To hide your IP, use a **VPN** before connecting.

---

### Q: Can I use Tor Browser with TheCommunity?

**A**: No. Tor Browser blocks WebRTC by default to prevent IP leaks. If you enable WebRTC in Tor Browser, you defeat Tor's anonymity protections.

**Instead**: Use Tor for signaling exchange only (see [Using Tor for Signaling](#using-tor-for-signaling)), and use a normal browser + VPN for the connection.

---

### Q: Is my chat encrypted?

**A**: Yes, but with limitations:
- **In-transit encryption**: WebRTC uses DTLS (similar to HTTPS) to encrypt data between browsers
- **No end-to-end encryption**: We don't provide additional E2E encryption layer
- **No forward secrecy**: If your browser is compromised, past messages could theoretically be decrypted

For sensitive communications, use a dedicated E2E encrypted messaging app (Signal, Matrix, etc.).

---

### Q: Does TheCommunity log my messages?

**A**: No. There is no backend server. All messages are sent directly between browsers and are **not logged, stored, or persisted** anywhere by TheCommunity.

However, your peer could log/screenshot messages on their end—trust is required.

---

### Q: Can my ISP/employer see my messages?

**A**: They can see:
- ✅ That you're using WebRTC (visible in network traffic)
- ✅ The IP address you're connecting to (your peer's IP)
- ✅ The amount of data being transferred

They **cannot** see:
- ❌ Message content (encrypted via DTLS)
- ❌ What you're typing (end-to-end encrypted in transit)

To hide metadata (who you're connecting to), use a VPN.

---

### Q: What information does GitHub Pages (the host) see?

**A**: GitHub Pages only serves the static website (HTML, CSS, JavaScript). They see:
- ✅ Your IP address when you load the page (standard web hosting)
- ✅ Browser user-agent (standard web hosting)

They **cannot** see:
- ❌ Your chat messages (P2P, doesn't go through GitHub)
- ❌ Who you connect with (WebRTC connections are direct)
- ❌ Any app usage after the page loads

---

### Q: How can I verify TheCommunity isn't tracking me?

**A**:
1. **Open browser DevTools** (F12)
2. **Go to Network tab**
3. **Use the app** (chat, connect, etc.)
4. **Observe**: After the initial page load, you'll see **zero requests** to any servers (except CDN for React)

You can also:
- ✅ **Read the source code** (it's open-source on GitHub)
- ✅ **Audit network traffic** (use Wireshark or browser DevTools)
- ✅ **Self-host** (run a local copy to be 100% sure)

---

### Q: Is TheCommunity secure for activists/journalists?

**A**: **Not without additional precautions.**

TheCommunity provides:
- ✅ No central logging (good)
- ✅ P2P architecture (good)
- ✅ In-transit encryption (good)

TheCommunity does **not** provide:
- ❌ IP anonymity (use VPN)
- ❌ Deniability (no disappearing messages)
- ❌ Metadata protection (use Tor for signaling)
- ❌ Device security (if your device is compromised, messages can be logged)

**For high-risk scenarios**, use purpose-built tools:
- **Signal** (encrypted messaging with disappearing messages)
- **Briar** (P2P + Tor integration built-in)
- **Matrix** (federated, E2E encrypted)

TheCommunity is best for:
- Learning about P2P technology
- Casual conversations with trusted friends
- Experimenting with WebRTC

---

### Q: Can TheCommunity be blocked/censored?

**A**: Yes, in several ways:
- **ISP blocking**: Your ISP could block access to `themorpheus407.github.io`
  - **Workaround**: Use VPN or Tor to access the site
- **WebRTC blocking**: Some networks block WebRTC traffic
  - **Workaround**: Use a different network or VPN
- **GitHub Pages blocking**: Some countries block GitHub
  - **Workaround**: Self-host the app or use a VPN

---

### Q: What happens if GitHub Pages is down?

**A**: The website won't load, but:
- ✅ You can **self-host** (clone the repo, run locally)
- ✅ You can **fork and deploy** to your own GitHub Pages
- ✅ The app works **offline after first load** (if you cache it)

---

### Q: Should I trust TheCommunity for sensitive communications?

**A**: No. TheCommunity is:
- ✅ Good for: Learning, casual chat, experimentation
- ❌ Not designed for: Highly sensitive communications, activism, journalism

**Threat model**:
- **Peer threat**: Your peer can log everything, screenshot, etc. (trust required)
- **Network threat**: ISP/employer can see metadata (who you connect to, when, how much data)
- **Device threat**: If your device is compromised, messages are visible

**Mitigation**:
- Use dedicated secure messaging apps (Signal, Briar, etc.) for sensitive topics
- TheCommunity is best for privacy-conscious casual use, not high-stakes security

---

## Summary

**TheCommunity prioritizes privacy where possible (no backend, no tracking), but WebRTC inherently reveals IP addresses to peers.**

**To maximize your privacy**:
1. ✅ **Use a VPN** to hide your IP from peers
2. ✅ **Exchange signals via Tor** to hide metadata from network observers
3. ✅ **Only connect with trusted peers**
4. ✅ **Understand the limitations** (no E2E encryption, IP disclosure)

**For high-security needs**: Use purpose-built tools (Signal, Briar) instead.

---

**Questions or feedback?** Open an issue on GitHub: https://github.com/TheMorpheus407/TheCommunity/issues

**Want to contribute?** We welcome privacy enhancements! Read `CONTRIBUTING.md` (if it exists) or open a discussion.

---

**Last Updated**: 2025-11-30
**Related Documents**:
- [Tor Integration Feasibility Analysis](./TOR_INTEGRATION_FEASIBILITY.md)
- [Architecture Constraints](./arc/02-architecture-constraints.md)
- [Risks and Technical Debt](./arc/11-risks-and-technical-debt.md)
