# SRI Hash Implementation Guide

**Status:** ⚠️ PENDING - SRI hashes need to be added manually
**Priority:** 🔴 HIGH - Critical security issue
**Issue:** Missing Subresource Integrity protection on CDN resources

## Overview

Subresource Integrity (SRI) hashes are cryptographic checksums that ensure CDN-loaded scripts haven't been tampered with. Without SRI, if a CDN is compromised or a Man-in-the-Middle attack occurs, malicious JavaScript could be injected into the application.

## Resources Requiring SRI Hashes

### index.html (4 resources)

1. **React 18**
   - URL: `https://unpkg.com/react@18/umd/react.production.min.js`
   - Line: 14

2. **React-DOM 18**
   - URL: `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
   - Line: 15

3. **QRCodeJS 1.0.0**
   - URL: `https://unpkg.com/qrcodejs@1.0.0/qrcode.min.js`
   - Line: 16

4. **Transformers.js 2.17.2**
   - URL: `https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2`
   - Line: 17

### higgs_analysis.html (2 resources)

5. **Chart.js 4.4.0**
   - URL: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`
   - Line: 11

6. **MathJax 3**
   - URL: `https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js`
   - Line: 12

## How to Generate SRI Hashes

### Method 1: Command Line (Recommended)

```bash
# For each URL, run:
curl -s <URL> | openssl dgst -sha384 -binary | openssl base64 -A

# Example for React:
curl -s https://unpkg.com/react@18/umd/react.production.min.js | openssl dgst -sha384 -binary | openssl base64 -A
```

### Method 2: Online Tool

Visit: https://www.srihash.org/
1. Paste the CDN URL
2. Click "Hash!"
3. Copy the generated `integrity` attribute

### Method 3: Browser DevTools

```javascript
// In browser console, after loading the script:
fetch('https://unpkg.com/react@18/umd/react.production.min.js')
  .then(response => response.text())
  .then(text => crypto.subtle.digest('SHA-384', new TextEncoder().encode(text)))
  .then(hash => {
    const hashArray = Array.from(new Uint8Array(hash));
    const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
    console.log('sha384-' + hashBase64);
  });
```

## Implementation Format

Once you have the hashes, update the script tags as follows:

### Before (Current - INSECURE)
```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin="anonymous" defer></script>
```

### After (With SRI - SECURE)
```html
<script
  src="https://unpkg.com/react@18/umd/react.production.min.js"
  integrity="sha384-[HASH_HERE]"
  crossorigin="anonymous"
  defer>
</script>
```

## Implementation Checklist

### index.html
- [ ] Add SRI to React 18 (line 14)
- [ ] Add SRI to React-DOM 18 (line 15)
- [ ] Add SRI to QRCodeJS 1.0.0 (line 16)
- [ ] Add SRI to Transformers.js 2.17.2 (line 17)

### higgs_analysis.html
- [ ] Add SRI to Chart.js 4.4.0 (line 11)
- [ ] Add SRI to MathJax 3 (line 12)

## Testing After Implementation

1. **Load the application** in a browser
2. **Open DevTools** > Console
3. **Look for errors** like:
   - "Failed to find a valid digest in the 'integrity' attribute"
   - "Subresource Integrity check failed"
4. **If errors occur:**
   - Verify the hash was generated correctly
   - Ensure the URL exactly matches the script src
   - Regenerate the hash if needed

## Important Notes

### Hash Algorithm
- Use **SHA-384** (recommended for security/performance balance)
- SHA-256 is also acceptable
- SHA-512 is overkill for most use cases

### CrossOrigin Attribute
- Already set to `crossorigin="anonymous"` ✅
- This is **required** for SRI to work
- Without it, SRI checks will fail

### Version Pinning
- All URLs already use specific versions ✅
- React: `@18` (major version)
- QRCodeJS: `@1.0.0` (exact version)
- Transformers.js: `@2.17.2` (exact version)
- Chart.js: `@4.4.0` (exact version)
- MathJax: `@3` (major version)

**Warning:** If you update library versions, you MUST regenerate SRI hashes!

### CDN Reliability
Both CDNs used are highly reliable:
- **unpkg.com**: Official npm CDN
- **cdn.jsdelivr.net**: Fast, reliable, and has SRI support

## Security Impact

### Without SRI (Current State)
- ❌ CDN compromise could inject malicious code
- ❌ MITM attacks could modify scripts
- ❌ No verification of script integrity
- ❌ Fails OWASP A08: Software and Data Integrity Failures

### With SRI (After Implementation)
- ✅ Browser verifies script integrity
- ✅ Modified scripts are blocked
- ✅ MITM attacks are mitigated
- ✅ Defense-in-depth security layer

## Maintenance

### When to Update SRI Hashes
1. **When updating library versions**
2. **When changing CDN providers**
3. **When URLs change**
4. **Quarterly verification** (compare against known-good hashes)

### Monitoring
After implementation:
- Monitor browser console for SRI failures
- Set up alerts for integrity check failures
- Periodically verify hashes match expected values

## References

- [MDN: Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
- [SRI Hash Generator](https://www.srihash.org/)
- [W3C SRI Specification](https://www.w3.org/TR/SRI/)
- [OWASP: Securing CDN Usage](https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html)

## Next Steps

1. Generate SRI hashes for all 6 CDN resources
2. Update index.html with hashes (resources 1-4)
3. Update higgs_analysis.html with hashes (resources 5-6)
4. Test application thoroughly
5. Deploy to production
6. Mark this issue as complete in security audit

---

**Created:** 2025-11-27
**Security Audit:** SECURITY_AUDIT_2025-11-27.md
**Related Issue:** #122
