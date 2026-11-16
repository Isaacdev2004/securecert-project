/* Auto-generated from Google Stitch — do not edit by hand */
export const bodyClass = "bg-surface font-body-md text-on-surface antialiased";
export const html = `<header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(16,30,53,0.06)]"><div class="h-20 w-full px-margin-lg flex items-center justify-between gap-gutter"><div class="flex items-center gap-space-lg"><a class="flex items-center gap-space-sm group" data-path="interactive-verifier" href="#"><div class="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary shadow-sm"><span class="material-symbols-outlined text-[20px]">verified_user</span></div><div class="flex flex-col"><span class="font-title-md text-title-md tracking-tight text-primary leading-none">SecureCert</span><span class="font-label-code text-[10px] uppercase tracking-wider text-secondary leading-none mt-1">National Ledger</span></div></a><div class="hidden xl:flex items-center gap-space-xs bg-surface-container-low px-space-md py-1 rounded-full"><span class="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span><span class="font-audit-mono text-audit-mono text-on-surface-variant font-medium">LIVE MAINNET // 1.48M+ ANCHORS</span></div></div><nav class="hidden lg:flex items-center gap-space-md" data-active-classes="text-primary font-title-sm bg-surface-container-high px-space-md py-1.5 rounded-lg"><a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-md py-1.5 rounded-lg transition-colors" data-path="interactive-verifier" href="#">Interactive Verifier</a><a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-md py-1.5 rounded-lg transition-colors" data-path="platform-architecture" href="#">Platform Architecture</a><a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-md py-1.5 rounded-lg transition-colors" data-path="institutions-and-sis-partners" href="#">Institutions &amp; SIS Partners</a><a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-md py-1.5 rounded-lg transition-colors" data-path="developer-apis" href="#">Developer APIs</a><a class="font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-md py-1.5 rounded-lg transition-colors" data-path="wholesale-economics" href="#">Wholesale Economics</a></nav><div class="flex items-center gap-space-md"><a class="hidden sm:inline-flex items-center justify-center font-title-sm text-title-sm text-on-surface bg-surface-container-lowest hover:bg-surface-container-low px-space-lg py-2.5 rounded-lg shadow-sm transition-colors" data-path="interactive-verifier" href="#">Verify a Credential</a><a class="inline-flex items-center justify-center font-title-sm text-title-sm text-on-primary bg-primary-container hover:bg-primary px-space-lg py-2.5 rounded-lg shadow-sm transition-colors" data-path="book-enterprise-onboarding" href="#">Book Enterprise Onboarding</a><div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"><span class="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main class="w-full pt-20 bg-surface"><div class="flex flex-col w-full">
<!-- Nav Highlighting Script & Tab Controller -->
<script>
    document.addEventListener("DOMContentLoaded", () => {
      // Highlight active nav item
      const navLinks = document.querySelectorAll('header nav a');
      navLinks.forEach(link => {
        if (link.getAttribute('data-path') === 'platform-architecture') {
          link.className = 'text-primary font-title-sm text-title-sm bg-surface-container-high px-space-md py-1.5 rounded-lg transition-colors';
        }
      });
    });

    function switchLayer(layerId) {
      const allPanels = document.querySelectorAll('.layer-detail-panel');
      const allTabs = document.querySelectorAll('.layer-nav-btn');
      
      allPanels.forEach(p => p.classList.add('hidden'));
      allTabs.forEach(t => {
        t.classList.remove('bg-primary-container', 'text-on-primary', 'shadow-md');
        t.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
      });

      const activePanel = document.getElementById(\`panel-\${layerId}\`);
      const activeTab = document.getElementById(\`tab-\${layerId}\`);
      if (activePanel) activePanel.classList.remove('hidden');
      if (activeTab) {
        activeTab.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
        activeTab.classList.add('bg-primary-container', 'text-on-primary', 'shadow-md');
      }
    }

    function toggleFaq(faqId) {
      const content = document.getElementById(\`faq-content-\${faqId}\`);
      const icon = document.getElementById(\`faq-icon-\${faqId}\`);
      if (!content || !icon) return;
      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.innerText = 'remove';
      } else {
        content.classList.add('hidden');
        icon.innerText = 'add';
      }
    }

    function copySnippet(elementId, btnId) {
      const code = document.getElementById(elementId).innerText;
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById(btnId);
        const originalText = btn.innerHTML;
        btn.innerHTML = \`<span class="material-symbols-outlined text-[14px]">check</span> Copied\`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      });
    }
  </script>
<!-- Section 1: Hero Header & System Telemetry -->
<section class="relative w-full px-margin-lg pt-space-xl pb-space-xl overflow-hidden bg-surface-container-low/40">
<div class="relative max-w-[1400px] mx-auto flex flex-col gap-space-xl">
<!-- Architectural Metadata Ribbon -->
<div class="flex flex-wrap items-center justify-between gap-space-md">
<div class="inline-flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded-full shadow-sm">
<span class="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
<span class="font-audit-mono text-audit-mono text-on-surface font-semibold tracking-wider uppercase">FIPS 140-2 LEVEL 3 HSM · ZERO-KNOWLEDGE LEDGER · W3C VC 2.0</span>
</div>
<div class="flex items-center gap-space-md text-on-surface-variant">
<span class="font-audit-mono text-audit-mono">SPEC: RFC-8740-FED-SPEC</span>
<span class="font-audit-mono text-audit-mono">REVISION: v4.18.2</span>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-on-tertiary-container text-[16px]">lock</span>
<span class="font-audit-mono text-audit-mono text-on-surface font-semibold">AIR-GAPPED CEREMONY PASSED</span>
</div>
</div>
</div>
<!-- Main Heading Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
<div class="lg:col-span-8 flex flex-col gap-space-lg">
<h1 class="font-headline-xl text-headline-xl text-primary tracking-tight font-bold">
            Sovereign Cryptographic Infrastructure for National Credential Assurance
          </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
            A comprehensive technical blueprint of SecureCert’s 4-layer trust stack: from local campus SIS ingress, through air-gapped hardware enclaves and SHA-256 Merkle root minting, to decentralized Anycast edge verification.
          </p>
<!-- CTAs -->
<div class="flex flex-wrap items-center gap-space-md pt-space-xs">
<a class="inline-flex items-center gap-space-xs font-title-sm text-title-sm text-on-primary bg-primary-container hover:bg-primary px-space-lg py-3 rounded-lg shadow-md transition-all" href="#interactive-stack">
<span class="material-symbols-outlined text-[18px]">account_tree</span>
              Explore Interactive Dataflow
            </a>
<a class="inline-flex items-center gap-space-xs font-title-sm text-title-sm text-on-surface bg-surface-container-lowest hover:bg-surface-container-high px-space-lg py-3 rounded-lg shadow-sm transition-all" href="#technical-specs">
<span class="material-symbols-outlined text-[18px]">description</span>
              Download Architecture Whitepaper (PDF)
            </a>
</div>
</div>
<!-- Telemetry Node Box -->
<div class="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
<div class="flex items-center justify-between">
<span class="font-label-status text-label-status uppercase text-secondary">ACTIVE LEDGER TELEMETRY</span>
<span class="font-audit-mono text-[10px] text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded">0.00ms JITTER</span>
</div>
<div class="grid grid-cols-2 gap-space-sm pt-space-xs">
<div class="bg-surface-container-low p-space-sm rounded">
<span class="font-audit-mono text-[10px] text-on-surface-variant block uppercase">Cluster Latency</span>
<span class="font-title-md text-title-md text-primary font-bold">24.8 ms</span>
<span class="font-audit-mono text-[9px] text-on-tertiary-container block">Anycast Tier-IV</span>
</div>
<div class="bg-surface-container-low p-space-sm rounded">
<span class="font-audit-mono text-[10px] text-on-surface-variant block uppercase">Enclaves Active</span>
<span class="font-title-md text-title-md text-primary font-bold">4 HSM</span>
<span class="font-audit-mono text-[9px] text-secondary block">Abuja / Lagos</span>
</div>
<div class="bg-surface-container-low p-space-sm rounded">
<span class="font-audit-mono text-[10px] text-on-surface-variant block uppercase">Quorum Ratio</span>
<span class="font-title-md text-title-md text-primary font-bold">3 of 5</span>
<span class="font-audit-mono text-[9px] text-secondary block">Shamir Threshold</span>
</div>
<div class="bg-surface-container-low p-space-sm rounded">
<span class="font-audit-mono text-[10px] text-on-surface-variant block uppercase">Root Integrity</span>
<span class="font-title-md text-title-md text-primary font-bold">100%</span>
<span class="font-audit-mono text-[9px] text-on-tertiary-container block">Zero Divergence</span>
</div>
</div>
<div class="p-space-xs bg-surface-container-high rounded text-center">
<span class="font-audit-mono text-[10px] text-on-surface font-medium">LATEST ANCHOR: 0x9f7a...3e01 @ BLOCK #1,489,102</span>
</div>
</div>
</div>
<!-- Quick Metrics Strip -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter pt-space-sm">
<div class="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center gap-space-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[22px]">developer_board</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">4 Hardware Enclaves</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Tier-IV Datacenters in Nigeria</span>
</div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center gap-space-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[22px]">key</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">256-bit Elliptic Curves</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Ed25519 &amp; Secp256k1 Hybrid</span>
</div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center gap-space-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[22px]">group_work</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">3-of-5 M-of-N Quorum</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Sovereign Cold Key Custody</span>
</div>
</div>
<div class="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex items-center gap-space-md">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
<span class="material-symbols-outlined text-[22px]">bolt</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">&lt; 24.8ms Edge Latency</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Decentralized Anycast Resolvers</span>
</div>
</div>
</div>
</div>
</section>
<!-- Section 2: Interactive 4-Tier Trust Stack Blueprint -->
<section class="w-full px-margin-lg py-space-xl max-w-[1400px] mx-auto" id="interactive-stack">
<div class="flex flex-col gap-space-lg mb-space-lg">
<div class="flex flex-col gap-space-xs">
<span class="font-label-status text-label-status uppercase text-secondary">ARCHITECTURAL TAXONOMY</span>
<h2 class="font-headline-lg text-headline-lg text-primary font-bold">
          The 4-Layer Cryptographic Trust Stack
        </h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Inspect each stage of credential issuance: how data is extracted without exposing raw PII, signed inside air-gapped hardware, batch-anchored to the sovereign ledger, and verified globally.
        </p>
</div>
<!-- Layer Navigation Bar (Tabs) -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm p-space-xs bg-surface-container-low rounded-xl">
<button class="layer-nav-btn text-left p-space-md rounded-lg bg-primary-container text-on-primary shadow-md transition-all flex items-center gap-space-sm" id="tab-layer1" onclick="switchLayer('layer1')">
<div class="w-7 h-7 rounded bg-surface-container-highest/20 flex items-center justify-center font-audit-mono text-audit-mono font-bold">01</div>
<div class="flex flex-col min-w-0">
<span class="font-title-sm text-title-sm truncate">Layer 1: Ingress</span>
<span class="font-audit-mono text-[10px] opacity-80 truncate">SIS Connectors &amp; NDPA Salt</span>
</div>
</button>
<button class="layer-nav-btn text-left p-space-md rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-space-sm" id="tab-layer2" onclick="switchLayer('layer2')">
<div class="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-audit-mono text-audit-mono font-bold">02</div>
<div class="flex flex-col min-w-0">
<span class="font-title-sm text-title-sm truncate">Layer 2: HSM Enclave</span>
<span class="font-audit-mono text-[10px] opacity-80 truncate">Luna PCIe &amp; Quorum Core</span>
</div>
</button>
<button class="layer-nav-btn text-left p-space-md rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-space-sm" id="tab-layer3" onclick="switchLayer('layer3')">
<div class="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-audit-mono text-audit-mono font-bold">03</div>
<div class="flex flex-col min-w-0">
<span class="font-title-sm text-title-sm truncate">Layer 3: Merkle Minting</span>
<span class="font-audit-mono text-[10px] opacity-80 truncate">50k Batch PoA Ledger</span>
</div>
</button>
<button class="layer-nav-btn text-left p-space-md rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-space-sm" id="tab-layer4" onclick="switchLayer('layer4')">
<div class="w-7 h-7 rounded bg-surface-container-high flex items-center justify-center font-audit-mono text-audit-mono font-bold">04</div>
<div class="flex flex-col min-w-0">
<span class="font-title-sm text-title-sm truncate">Layer 4: ZK Edge Proof</span>
<span class="font-audit-mono text-[10px] opacity-80 truncate">did:sc:ng Resolver &amp; PDF/A</span>
</div>
</button>
</div>
</div>
<!-- Interactive Layer Detail Panels Container -->
<div class="bg-surface-container-lowest rounded-xl shadow-lg p-space-lg lg:p-space-xl">
<!-- LAYER 1 PANEL -->
<div class="layer-detail-panel flex flex-col gap-space-xl" id="panel-layer1">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<div class="lg:col-span-7 flex flex-col gap-space-md">
<div class="flex items-center gap-space-sm">
<span class="bg-surface-container-high text-primary font-audit-mono text-audit-mono px-2 py-0.5 rounded font-bold">SPEC: INGRESS-01</span>
<span class="bg-surface-container-low text-secondary font-label-status text-label-status px-2 py-0.5 rounded uppercase">NDPA 2023 SECURED</span>
</div>
<h3 class="font-headline-md text-headline-md text-primary font-bold">
              Layer 1: Ingress Sanitization &amp; Zero-Knowledge Identity Hashing
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              University Student Information Systems (SIS)—including Ellucian Banner, Oracle PeopleSoft, EduNova, and custom campus SQL engines—interface through dedicated SecureCert edge connectors. Before any credential payload leaves the campus boundary, sensitive student identity factors are stripped, salted with institutional entropy, and transformed into cryptographic claims.
            </p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Local PII Isolation</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Personal identifiers (NIN, Matriculation, DOB) never traverse the public wire in plaintext. Salted HMAC-SHA256 blinds individual records while preserving mathematical unicity.
                </p>
</div>
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Dual-Signing Token Handshake</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Campus registrars validate uploads through physical FIPS 140-2 Level 2 security keys, generating an ephemeral registrar assertion before batch ingestion.
                </p>
</div>
</div>
<!-- Ingress Telemetry Snapshot -->
<div class="flex items-center gap-space-lg pt-space-xs">
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Supported Connectors</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">Banner, PeopleSoft, Moodle, Custom API</span>
</div>
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Transform Latency</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">1.2ms / 1,000 Records</span>
</div>
</div>
</div>
<!-- Code / Visual Artifact: JSON-LD Sanitized Ingress -->
<div class="lg:col-span-5 bg-primary-container text-on-primary p-space-md rounded-xl shadow-md flex flex-col gap-space-sm">
<div class="flex items-center justify-between pb-2">
<span class="font-audit-mono text-[11px] text-on-primary-container flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                PAYLOAD: INGRESS_HASH_TRANSFORM.json
              </span>
<button class="font-audit-mono text-[10px] bg-surface-container-highest/20 hover:bg-surface-container-highest/40 px-2 py-1 rounded text-on-primary transition-colors flex items-center gap-1" id="copy-btn-1" onclick="copySnippet('code-layer1', 'copy-btn-1')">
<span class="material-symbols-outlined text-[14px]">content_copy</span> Copy
              </button>
</div>
<pre class="font-label-code text-[11px] text-surface-container-high overflow-x-auto p-space-sm bg-primary/40 rounded leading-relaxed" id="code-layer1">{
  "@context": [
    "https://www.w3.org/2018/credentials/v2",
    "https://schema.securecert.gov.ng/v1"
  ],
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "did:sc:ng-unilag:reg-782",
  "issuanceDate": "2025-02-18T09:14:22Z",
  "credentialSubject": {
    "id": "did:sc:ng-holder:0x88c4b92...",
    "degreeAwarded": "B.Sc. Computer Engineering",
    "honours": "First Class Honours",
    "blindedNINHash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "saltNonce": "8f3b20e98031d27"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "proofPurpose": "assertionMethod"
  }
}</pre>
<div class="flex items-center justify-between text-[10px] font-audit-mono text-on-primary-container pt-1">
<span>NDPA PRIVACY LEVEL: STRICT</span>
<span>SHA-256 CONFLICT SAFE</span>
</div>
</div>
</div>
</div>
<!-- LAYER 2 PANEL -->
<div class="layer-detail-panel hidden flex flex-col gap-space-xl" id="panel-layer2">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<div class="lg:col-span-7 flex flex-col gap-space-md">
<div class="flex items-center gap-space-sm">
<span class="bg-surface-container-high text-primary font-audit-mono text-audit-mono px-2 py-0.5 rounded font-bold">SPEC: CUSTODY-02</span>
<span class="bg-surface-container-low text-on-tertiary-container font-label-status text-label-status px-2 py-0.5 rounded uppercase">FIPS 140-2 LEVEL 3 VALIDATED</span>
</div>
<h3 class="font-headline-md text-headline-md text-primary font-bold">
              Layer 2: Cryptographic Custody &amp; Air-Gapped Enclave Boundary
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              At the core of the SecureCert infrastructure lies physical Thales Luna 7000 PCIe Hardware Security Modules housed in physically isolated, Tier-IV datacenters in Abuja and Lagos. Private signing keys are non-exportable and physically bound to tamper-reactive silicon cores.
            </p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">3-of-5 M-of-N Quorum</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  No individual, engineer, or agency official can authorize signing key alterations. 3 of 5 physical smart cards across statutory custodians are required for cryptographic operations.
                </p>
</div>
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Zero Plaintext Egress</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Signing occurs strictly within AWS Nitro / On-Prem PCIe secure enclaves. Operations take place via memory-isolated ring buffers with zero disk swapping.
                </p>
</div>
</div>
<!-- HSM Ceremony Details -->
<div class="flex items-center gap-space-lg pt-space-xs">
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Key Protection</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">Hardware Zeroization on Tamper</span>
</div>
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Signing Throughput</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">12,000 Signatures / sec</span>
</div>
</div>
</div>
<!-- HSM Architectural Diagram Card -->
<div class="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-md">
<span class="font-label-status text-label-status uppercase text-secondary">PHYSICAL ENCLAVE ENVELOPE</span>
<div class="flex flex-col gap-space-sm">
<div class="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between shadow-sm">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-primary text-[20px]">memory</span>
<span class="font-title-sm text-title-sm text-primary">Thales Luna PCIe Module</span>
</div>
<span class="font-audit-mono text-[10px] text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded font-bold">L3 HSM</span>
</div>
<div class="flex justify-center text-on-surface-variant">
<span class="material-symbols-outlined text-[18px]">south</span>
</div>
<div class="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between shadow-sm">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[20px]">cloud_download</span>
<span class="font-title-sm text-title-sm text-primary">Shamir Split Smart-Card Quorum</span>
</div>
<span class="font-audit-mono text-[10px] text-primary font-bold">3 / 5 REQUIRED</span>
</div>
<div class="flex justify-center text-on-surface-variant">
<span class="material-symbols-outlined text-[18px]">south</span>
</div>
<div class="bg-primary-container text-on-primary p-space-sm rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-on-tertiary-container text-[20px]">verified</span>
<span class="font-title-sm text-title-sm">Ed25519 Canonical Batch Root</span>
</div>
<span class="font-audit-mono text-[10px] text-on-primary-container">NON-REPUDIABLE</span>
</div>
</div>
<div class="p-space-sm bg-surface-container-high rounded text-center">
<span class="font-audit-mono text-[11px] text-on-surface-variant">CHASSIS SENSORS: 4 OPTICAL · ZEROIZATION ACTIVE</span>
</div>
</div>
</div>
</div>
<!-- LAYER 3 PANEL -->
<div class="layer-detail-panel hidden flex flex-col gap-space-xl" id="panel-layer3">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<div class="lg:col-span-7 flex flex-col gap-space-md">
<div class="flex items-center gap-space-sm">
<span class="bg-surface-container-high text-primary font-audit-mono text-audit-mono px-2 py-0.5 rounded font-bold">SPEC: MERKLE-MINT-03</span>
<span class="bg-surface-container-low text-secondary font-label-status text-label-status px-2 py-0.5 rounded uppercase">BATCH AGGREGATION</span>
</div>
<h3 class="font-headline-md text-headline-md text-primary font-bold">
              Layer 3: Batch Merkle Minting &amp; Sovereign Consensus Anchoring
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              To achieve wholesale throughput while preserving sub-second verification, individual student credentials are organized into balanced binary Merkle trees containing up to 50,000 records per block. The aggregate Merkle root is stamped into the Federal Proof-of-Authority (PoA) ledger.
            </p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Double-Hashed Leaves</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Leaves undergo double SHA-256 rounds: <span class="font-audit-mono text-[11px]">H(H(payload) || nonce)</span>. This completely neutralizes length-extension exploits and preimage collisions.
                </p>
</div>
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Lightweight Proof Generation</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Verifiers only need the log2(N) sibling hashes (~16 hashes for 65k records) to verify any credential against the immutable federal root.
                </p>
</div>
</div>
<div class="flex items-center gap-space-lg pt-space-xs">
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Batch Throughput</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">50,000 Leaves / 4.1 sec</span>
</div>
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Consensus Rail</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">Federal PoA (7 Gov Nodes)</span>
</div>
</div>
</div>
<!-- Interactive Merkle Tree Visualizer -->
<div class="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-md">
<span class="font-label-status text-label-status uppercase text-secondary">MERKLE TREE AUDIT TRAIL</span>
<div class="flex flex-col items-center gap-space-xs">
<!-- Merkle Root -->
<div class="w-full bg-primary-container text-on-primary p-space-sm rounded-lg text-center shadow-sm">
<span class="font-audit-mono text-[10px] text-on-primary-container block uppercase">Anchor Root (Height 16)</span>
<span class="font-label-code text-label-code font-bold">0x4a8f9b2c3d1e...90af</span>
</div>
<!-- Branch Lines SVG -->
<svg class="w-full h-8 text-on-surface-variant/30" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 300 32">
<path d="M150 0 V16 M150 16 H75 V32 M150 16 H225 V32"></path>
</svg>
<!-- Level 1 Nodes -->
<div class="grid grid-cols-2 gap-space-sm w-full">
<div class="bg-surface-container-lowest p-space-xs rounded text-center shadow-sm">
<span class="font-audit-mono text-[9px] text-on-surface-variant block">Sub-Tree Left</span>
<span class="font-label-code text-[11px] text-primary">0x7c21...fa91</span>
</div>
<div class="bg-surface-container-lowest p-space-xs rounded text-center shadow-sm">
<span class="font-audit-mono text-[9px] text-on-surface-variant block">Sub-Tree Right</span>
<span class="font-label-code text-[11px] text-primary">0x3b14...00e2</span>
</div>
</div>
<!-- Branch Lines SVG -->
<svg class="w-full h-6 text-on-surface-variant/30" fill="none" stroke="currentColor" stroke-width="1.5" viewbox="0 0 300 24">
<path d="M75 0 V12 M75 12 H37.5 V24 M75 12 H112.5 V24 M225 0 V12 M225 12 H187.5 V24 M225 12 H262.5 V24"></path>
</svg>
<!-- Level 0 Leaves -->
<div class="grid grid-cols-4 gap-1 w-full text-center">
<div class="bg-surface-container-highest/60 p-1 rounded font-audit-mono text-[9px] text-on-surface truncate">Leaf #0</div>
<div class="bg-surface-container-highest/60 p-1 rounded font-audit-mono text-[9px] text-on-surface truncate">Leaf #1</div>
<div class="bg-on-tertiary-container text-on-primary p-1 rounded font-audit-mono text-[9px] font-bold truncate">TARGET *</div>
<div class="bg-surface-container-highest/60 p-1 rounded font-audit-mono text-[9px] text-on-surface truncate">Leaf #3</div>
</div>
</div>
<div class="p-space-xs bg-surface-container-high rounded text-center">
<span class="font-audit-mono text-[10px] text-on-surface">BRANCH PROOF SIZE: 512 BYTES · INSTANT OFFLINE RE-COMPUTE</span>
</div>
</div>
</div>
</div>
<!-- LAYER 4 PANEL -->
<div class="layer-detail-panel hidden flex flex-col gap-space-xl" id="panel-layer4">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
<div class="lg:col-span-7 flex flex-col gap-space-md">
<div class="flex items-center gap-space-sm">
<span class="bg-surface-container-high text-primary font-audit-mono text-audit-mono px-2 py-0.5 rounded font-bold">SPEC: EDGE-ZK-04</span>
<span class="bg-surface-container-low text-secondary font-label-status text-label-status px-2 py-0.5 rounded uppercase">W3C VC 2.0 RESOLVER</span>
</div>
<h3 class="font-headline-md text-headline-md text-primary font-bold">
              Layer 4: Global Verification &amp; Zero-Knowledge Edge Network
            </h3>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Credential verifiers—foreign consulates, banks, graduate schools, and enterprise employers—query the decentralized Anycast resolver network using sovereign DIDs (\`did:sc:ng-*\`). Verifications execute within 24.8ms with zero backhaul to campus web servers.
            </p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Selective Disclosure (ZK-Proof)</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Using Circom Groth16 zk-SNARKs and BBS+ signatures, holders can prove “Graduated with CGPA &gt; 3.5” without ever disclosing their exact matric number or full transcript.
                </p>
</div>
<div class="p-space-md bg-surface-container-low rounded-lg">
<span class="font-title-sm text-title-sm text-primary block font-bold mb-1">Offline PDF/A-1b Self-Containment</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                  Every issued PDF transcript contains an embedded ISO 19005-1 cryptographic XML envelope with full Merkle siblings. It verifies offline via Adobe Acrobat standard trust stores.
                </p>
</div>
</div>
<div class="flex items-center gap-space-lg pt-space-xs">
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Global Latency</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">&lt; 25ms Across 32 Anycast Pops</span>
</div>
<div>
<span class="font-audit-mono text-[10px] text-on-surface-variant uppercase block">Campus Offline Resilience</span>
<span class="font-audit-mono text-audit-mono text-primary font-bold">100% Unaffected by Campus Outages</span>
</div>
</div>
</div>
<!-- Code Artifact: ZK Proof Query Payload -->
<div class="lg:col-span-5 bg-primary-container text-on-primary p-space-md rounded-xl shadow-md flex flex-col gap-space-sm">
<div class="flex items-center justify-between pb-2">
<span class="font-audit-mono text-[11px] text-on-primary-container flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
                RESOLVER: ZK_GROTH16_VERIFY.json
              </span>
<button class="font-audit-mono text-[10px] bg-surface-container-highest/20 hover:bg-surface-container-highest/40 px-2 py-1 rounded text-on-primary transition-colors flex items-center gap-1" id="copy-btn-4" onclick="copySnippet('code-layer4', 'copy-btn-4')">
<span class="material-symbols-outlined text-[14px]">content_copy</span> Copy
              </button>
</div>
<pre class="font-label-code text-[11px] text-surface-container-high overflow-x-auto p-space-sm bg-primary/40 rounded leading-relaxed" id="code-layer4">{
  "protocol": "did:sc:ng:zk-verify-v2",
  "statement": "CGPA_GREATER_THAN_EQUAL_3_5",
  "pi_a": [
    "0x21a4f89d9e2...",
    "0x098bb12ce41..."
  ],
  "pi_b": [
    ["0x1d...", "0x0c..."],
    ["0x3a...", "0x2f..."]
  ],
  "merkleSiblingPath": [
    "0x9f7a...3e01",
    "0x112c...88ba",
    "0xee40...a991"
  ],
  "verified": true,
  "verdict": "CRYPTOGRAPHICALLY_VALID"
}</pre>
<div class="flex items-center justify-between text-[10px] font-audit-mono text-on-primary-container pt-1">
<span>GAS COST: 0 (SOVEREIGN PoA)</span>
<span>RESOLVER STATUS: 200 OK</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Section 3: Technical Security Specifications & Cryptographic Primitives -->
<section class="w-full px-margin-lg py-space-xl bg-surface-container-low/50" id="technical-specs">
<div class="max-w-[1400px] mx-auto flex flex-col gap-space-lg">
<div class="flex flex-col gap-space-xs">
<span class="font-label-status text-label-status uppercase text-secondary">SECURITY SPECIFICATIONS</span>
<h2 class="font-headline-lg text-headline-lg text-primary font-bold">
          Cryptographic Primitives &amp; Compliance Standards
        </h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Engineered to satisfy federal statutory governance, the Lisbon Recognition Convention, and global verification registries.
        </p>
</div>
<!-- Comprehensive Data Table -->
<div class="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
<div class="overflow-x-auto">
<table class="w-full text-left">
<thead>
<tr class="bg-surface-container-low border-b-0">
<th class="py-space-md px-space-lg font-title-sm text-title-sm text-primary uppercase">Primitive Domain</th>
<th class="py-space-md px-space-lg font-title-sm text-title-sm text-primary uppercase">Active Implementation</th>
<th class="py-space-md px-space-lg font-title-sm text-title-sm text-primary uppercase">Underlying Standard</th>
<th class="py-space-md px-space-lg font-title-sm text-title-sm text-primary uppercase">Hardware / Enclave</th>
<th class="py-space-md px-space-lg font-title-sm text-title-sm text-primary uppercase">Security Guarantee</th>
</tr>
</thead>
<tbody class="divide-y divide-surface-container-low">
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-space-md px-space-lg font-title-sm text-title-sm text-primary flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[18px]">vpn_key</span>
                  Digital Signature Scheme
                </td>
<td class="py-space-md px-space-lg font-label-code text-label-code text-on-surface">Ed25519 (RFC 8032) + Secp256k1</td>
<td class="py-space-md px-space-lg font-audit-mono text-audit-mono text-on-surface-variant">W3C VC Data Model 2.0</td>
<td class="py-space-md px-space-lg font-body-sm text-body-sm text-on-surface">Thales Luna 7000 PCIe HSM</td>
<td class="py-space-md px-space-lg">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-audit-mono text-audit-mono font-bold bg-[#D1FAE5] text-[#065F46]">
<span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> 128-bit Security Level
                  </span>
</td>
</tr>
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-space-md px-space-lg font-title-sm text-title-sm text-primary flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[18px]">tag</span>
                  Cryptographic Hashing
                </td>
<td class="py-space-md px-space-lg font-label-code text-label-code text-on-surface">SHA-256 (FIPS 180-4) + HMAC</td>
<td class="py-space-md px-space-lg font-audit-mono text-audit-mono text-on-surface-variant">NIST SP 800-107</td>
<td class="py-space-md px-space-lg font-body-sm text-body-sm text-on-surface">Hardware Accel Crypto Engines</td>
<td class="py-space-md px-space-lg">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-audit-mono text-audit-mono font-bold bg-[#D1FAE5] text-[#065F46]">
<span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Preimage &amp; Collision Resistant
                  </span>
</td>
</tr>
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-space-md px-space-lg font-title-sm text-title-sm text-primary flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[18px]">visibility_off</span>
                  Privacy &amp; Selective Disclosure
                </td>
<td class="py-space-md px-space-lg font-label-code text-label-code text-on-surface">Circom Groth16 SNARKs + BBS+</td>
<td class="py-space-md px-space-lg font-audit-mono text-audit-mono text-on-surface-variant">ISO/IEC 18013-5 &amp; NDPA 2023</td>
<td class="py-space-md px-space-lg font-body-sm text-body-sm text-on-surface">AWS Nitro Enclaves (Isolated CPU)</td>
<td class="py-space-md px-space-lg">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-audit-mono text-audit-mono font-bold bg-[#D1FAE5] text-[#065F46]">
<span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Zero PII Leakage
                  </span>
</td>
</tr>
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-space-md px-space-lg font-title-sm text-title-sm text-primary flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                  Federated Consensus
                </td>
<td class="py-space-md px-space-lg font-label-code text-label-code text-on-surface">Istanbul BFT 2.0 (Proof-of-Authority)</td>
<td class="py-space-md px-space-lg font-audit-mono text-audit-mono text-on-surface-variant">NUC National Trust Guidelines</td>
<td class="py-space-md px-space-lg font-body-sm text-body-sm text-on-surface">7 Sovereign Federal Nodes</td>
<td class="py-space-md px-space-lg">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-audit-mono text-audit-mono font-bold bg-[#D1FAE5] text-[#065F46]">
<span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Byzantine Fault Tolerant
                  </span>
</td>
</tr>
<tr class="hover:bg-surface-container-low/40 transition-colors">
<td class="py-space-md px-space-lg font-title-sm text-title-sm text-primary flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[18px]">picture_as_pdf</span>
                  Document Interoperability
                </td>
<td class="py-space-md px-space-lg font-label-code text-label-code text-on-surface">PDF/A-1b + Embedded XML Metadata</td>
<td class="py-space-md px-space-lg font-audit-mono text-audit-mono text-on-surface-variant">ISO 19005-1 &amp; Open Badges 3.0</td>
<td class="py-space-md px-space-lg font-body-sm text-body-sm text-on-surface">Standard Reader Trust Root</td>
<td class="py-space-md px-space-lg">
<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-audit-mono text-audit-mono font-bold bg-[#D1FAE5] text-[#065F46]">
<span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Long-Term Archival (50+ yrs)
                  </span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</section>
<!-- Section 4: Disaster Recovery & Physical Tamper Resilience -->
<section class="w-full px-margin-lg py-space-xl max-w-[1400px] mx-auto">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div class="lg:col-span-6 flex flex-col gap-space-md">
<span class="font-label-status text-label-status uppercase text-secondary">FAIL-SAFE ASSURANCE</span>
<h2 class="font-headline-lg text-headline-lg text-primary font-bold">
          Active-Active Replication &amp; Physical Zeroization Safeguards
        </h2>
<p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          National infrastructure requires perpetual operational availability combined with instantaneous physical zeroization in the event of hardware compromise or hostile chassis intrusion.
        </p>
<div class="flex flex-col gap-space-md pt-space-xs">
<div class="flex items-start gap-space-md">
<div class="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">sync_alt</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">Dual-Hub Federal Replication</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                The Abuja Tier-IV Core Node and Lagos Ingress Datacenter replicate state through dedicated, dark-fiber IPsec tunnels with microsecond latency. If a datacenter goes dark, quorum automatically transitions in zero milliseconds.
              </p>
</div>
</div>
<div class="flex items-start gap-space-md">
<div class="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">sensor_door</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">Optical Chassis Tamper Sensors</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                HSM chassis are equipped with dual-envelope optical and micro-switch intrusion sensors. Any uncertified casing rupture triggers immediate memory wipe and permanent chip-level zeroization within 2 milliseconds.
              </p>
</div>
</div>
<div class="flex items-start gap-space-md">
<div class="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0 mt-0.5">
<span class="material-symbols-outlined text-[20px]">key_off</span>
</div>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary font-bold">Cold Disaster Recovery Quorum</span>
<p class="font-body-sm text-body-sm text-on-surface-variant">
                Master recovery seeds are split using Shamir’s Secret Sharing and stored in high-security biometric safe deposit vaults distributed between the Judiciary, National Universities Commission, and Central Vaults.
              </p>
</div>
</div>
</div>
</div>
<!-- High-Tech Enclave Graphic Box -->
<div class="lg:col-span-6 bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-xl shadow-lg flex flex-col gap-space-lg">
<div class="flex items-center justify-between pb-space-sm">
<div class="flex items-center gap-space-sm">
<span class="w-3 h-3 rounded-full bg-on-tertiary-container animate-pulse"></span>
<span class="font-title-sm text-title-sm text-primary">Tamper Detection Perimeter</span>
</div>
<span class="font-audit-mono text-audit-mono text-on-surface-variant">STATUS: ARMED &amp; SEALED</span>
</div>
<!-- System Schematic Card -->
<div class="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-sm">
<div class="flex justify-between items-center text-[12px] font-audit-mono">
<span class="text-on-surface-variant">PRIMARY NODE</span>
<span class="text-primary font-bold">ABUJA FEDERAL TIER-IV (ACTIVE)</span>
</div>
<div class="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
<div class="bg-on-tertiary-container h-full w-[100%]"></div>
</div>
<div class="flex justify-between items-center text-[12px] font-audit-mono pt-2">
<span class="text-on-surface-variant">SECONDARY NODE</span>
<span class="text-primary font-bold">LAGOS COMMERCIAL TIER-IV (ACTIVE)</span>
</div>
<div class="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
<div class="bg-on-tertiary-container h-full w-[100%]"></div>
</div>
<div class="flex justify-between items-center text-[12px] font-audit-mono pt-2">
<span class="text-on-surface-variant">SYNCHRONIZATION JITTER</span>
<span class="text-on-tertiary-container font-bold">0.82 ms (FIBER DUAL PATH)</span>
</div>
</div>
<div class="p-space-md bg-surface-container-high/60 rounded-lg flex items-center justify-between">
<div class="flex items-center gap-space-sm">
<span class="material-symbols-outlined text-secondary text-[24px]">verified</span>
<div class="flex flex-col">
<span class="font-title-sm text-title-sm text-primary">Sovereignty Attestation</span>
<span class="font-body-sm text-body-sm text-on-surface-variant">Zero cloud dependencies outside Nigerian jurisdiction.</span>
</div>
</div>
<span class="font-audit-mono text-[11px] text-on-tertiary-container font-bold">NUC VALIDATED</span>
</div>
</div>
</div>
</section>
<!-- Section 5: Technical FAQ / Engineering Dossier -->
<section class="w-full px-margin-lg py-space-xl bg-surface-container-low/40">
<div class="max-w-[1000px] mx-auto flex flex-col gap-space-lg">
<div class="flex flex-col gap-space-xs text-center items-center">
<span class="font-label-status text-label-status uppercase text-secondary">ENGINEERING DOSSIER</span>
<h2 class="font-headline-lg text-headline-lg text-primary font-bold">
          Frequently Answered Architectural Questions
        </h2>
<p class="font-body-md text-body-md text-on-surface-variant max-w-xl">
          Detailed cryptographic and systemic explanations for Chief Information Officers, Security Officers, and Registrars.
        </p>
</div>
<div class="flex flex-col gap-space-sm pt-space-md">
<!-- FAQ Item 1 -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<button class="w-full py-space-md px-space-lg text-left flex items-center justify-between gap-space-md hover:bg-surface-container-low/40 transition-colors" onclick="toggleFaq(1)">
<span class="font-title-sm text-title-sm text-primary">
              How does verification work if the issuing university's internet or local server is offline?
            </span>
<span class="material-symbols-outlined text-on-surface-variant shrink-0" id="faq-icon-1">remove</span>
</button>
<div class="px-space-lg pb-space-lg pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed" id="faq-content-1">
            Verification never queries campus servers at runtime. When a university issues a degree, its cryptographic representation is anchored into the national Merkle root on the Sovereign PoA Ledger. Verification requires only the public credential metadata, the Merkle sibling hashes, and the federally registered public keys cached across worldwide Anycast nodes. If a university server suffers downtime or physical flooding, 100% of its previously minted credentials remain verifiable instantly worldwide.
          </div>
</div>
<!-- FAQ Item 2 -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<button class="w-full py-space-md px-space-lg text-left flex items-center justify-between gap-space-md hover:bg-surface-container-low/40 transition-colors" onclick="toggleFaq(2)">
<span class="font-title-sm text-title-sm text-primary">
              How does SecureCert protect student privacy under the Nigeria Data Protection Act (NDPA 2023)?
            </span>
<span class="material-symbols-outlined text-on-surface-variant shrink-0" id="faq-icon-2">add</span>
</button>
<div class="hidden px-space-lg pb-space-lg pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed" id="faq-content-2">
            Under NDPA 2023 requirements, no raw personally identifiable information (such as full legal names, National Identity Numbers, or birth dates) is stored directly on immutable ledger blocks. All personal attributes are salted with unique campus entropy and transformed into one-way SHA-256 hashes. Furthermore, zero-knowledge proofs (zk-SNARKs via Circom) permit students to selectively disclose credential criteria without exposing secondary personal attributes.
          </div>
</div>
<!-- FAQ Item 3 -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<button class="w-full py-space-md px-space-lg text-left flex items-center justify-between gap-space-md hover:bg-surface-container-low/40 transition-colors" onclick="toggleFaq(3)">
<span class="font-title-sm text-title-sm text-primary">
              Can revoked credentials be modified or undeleted on the ledger?
            </span>
<span class="material-symbols-outlined text-on-surface-variant shrink-0" id="faq-icon-3">add</span>
</button>
<div class="hidden px-space-lg pb-space-lg pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed" id="faq-content-3">
            No. The ledger preserves an append-only, strictly immutable log. Revocation occurs via cryptographic state transitions: when an institution revokes an invalid or fraudulently obtained credential, a signed revocation assertion is appended to the revocation status registry (conforming to W3C Bitstring Status List v1.0). The original record cannot be erased, providing an unalterable forensic record that the credential existed and was explicitly nullified.
          </div>
</div>
<!-- FAQ Item 4 -->
<div class="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
<button class="w-full py-space-md px-space-lg text-left flex items-center justify-between gap-space-md hover:bg-surface-container-low/40 transition-colors" onclick="toggleFaq(4)">
<span class="font-title-sm text-title-sm text-primary">
              What cryptographic suites ensure post-quantum and future-proof durability?
            </span>
<span class="material-symbols-outlined text-on-surface-variant shrink-0" id="faq-icon-4">add</span>
</button>
<div class="hidden px-space-lg pb-space-lg pt-0 text-on-surface-variant font-body-md text-body-md leading-relaxed" id="faq-content-4">
            SecureCert employs an agile cryptographic abstraction layer. While today’s operational credentials leverage Ed25519 and 256-bit elliptic curves, the ledger envelope supports simultaneous dual-signatures with NIST-selected post-quantum algorithms (ML-DSA / Dilithium and Falcon). The schema architecture supports rolling key rotations without breaking the verification validity of historical blocks.
          </div>
</div>
</div>
</div>
</section>
<!-- Section 6: Next Steps CTA Banner -->
<section class="w-full px-margin-lg py-space-xl">
<div class="max-w-[1400px] mx-auto bg-primary-container text-on-primary rounded-2xl p-space-xl lg:p-space-xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-space-xl relative overflow-hidden">
<!-- Subtle Decorative Vector Lattice Behind -->
<div class="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center">
<svg class="w-96 h-96" fill="none" stroke="currentColor" stroke-width="1" viewbox="0 0 200 200">
<circle cx="100" cy="100" r="80" stroke-dasharray="4 4"></circle>
<polygon points="100,20 180,180 20,180"></polygon>
<polygon points="100,180 20,20 180,20"></polygon>
</svg>
</div>
<div class="flex flex-col gap-space-md relative z-10 max-w-2xl">
<div class="inline-flex items-center gap-space-xs bg-surface-container-highest/20 px-space-md py-1 rounded-full w-max">
<span class="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
<span class="font-audit-mono text-audit-mono text-on-primary uppercase font-medium">SOVEREIGN TRUST SPECIFICATION</span>
</div>
<h2 class="font-headline-xl text-headline-xl text-on-primary font-bold tracking-tight">
          Validate Your Institution’s Infrastructure Today
        </h2>
<p class="font-body-md text-body-md text-on-primary-container leading-relaxed">
          Schedule an in-depth architectural briefing with SecureCert’s Lead Cryptographers. Review raw JSON-LD schema specs, examine HSM enclave security proofs, or execute a sandbox campus integration trial.
        </p>
</div>
<div class="flex flex-col sm:flex-row items-center gap-space-md relative z-10 shrink-0">
<a class="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs font-title-sm text-title-sm text-primary bg-surface-container-lowest hover:bg-surface-container-high px-space-lg py-3 rounded-lg shadow-md transition-all" href="#">
<span class="material-symbols-outlined text-[18px]">engineering</span>
          Consult with Lead Cryptographer
        </a>
<a class="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs font-title-sm text-title-sm text-on-primary bg-surface-container-highest/20 hover:bg-surface-container-highest/30 px-space-lg py-3 rounded-lg transition-all" href="#">
<span class="material-symbols-outlined text-[18px]">terminal</span>
          Review Source Specs
        </a>
</div>
</div>
</section>
</div></main><footer class="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(16,30,53,0.03)] pt-space-xl pb-space-lg"><div class="w-full px-margin-lg"><div class="pb-space-xl mb-space-xl bg-surface-container-low/50 rounded-xl p-space-lg"><div class="flex flex-col md:flex-row md:items-center justify-between gap-space-md"><div class="flex flex-col"><span class="font-label-status text-label-status text-secondary uppercase">Federated Cryptographic Compliance &amp; Accreditations</span><p class="font-body-sm text-body-sm text-on-surface-variant mt-1">Anchored with immutable Zero-Knowledge validity proofs across sovereign registry networks.</p></div><div class="flex flex-wrap items-center gap-space-md"><div class="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded shadow-sm"><span class="material-symbols-outlined text-on-tertiary-container text-[18px]">gavel</span><span class="font-audit-mono text-audit-mono text-on-surface font-semibold">NUC ACCREDITED</span></div><div class="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded shadow-sm"><span class="material-symbols-outlined text-on-tertiary-container text-[18px]">lock</span><span class="font-audit-mono text-audit-mono text-on-surface font-semibold">FIPS 140-2 L3</span></div><div class="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded shadow-sm"><span class="material-symbols-outlined text-on-tertiary-container text-[18px]">shield</span><span class="font-audit-mono text-audit-mono text-on-surface font-semibold">NDPA 2023 PRIVACY</span></div><div class="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-1.5 rounded shadow-sm"><span class="material-symbols-outlined text-on-tertiary-container text-[18px]">hub</span><span class="font-audit-mono text-audit-mono text-on-surface font-semibold">W3C VC 2.0 WG</span></div></div></div></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl"><div class="lg:col-span-1 flex flex-col"><div class="flex items-center gap-space-sm mb-space-md"><div class="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary"><span class="material-symbols-outlined text-[18px]">verified_user</span></div><span class="font-title-md text-title-md text-primary">SecureCert</span></div><p class="font-body-sm text-body-sm text-on-surface-variant mb-space-md">National &amp; Institutional digital credential verification rail. Cryptographically verifiable, tamper-evident degree and identity proofs.</p><div class="flex items-center gap-2"><span class="inline-block w-2 h-2 rounded-full bg-on-tertiary-container"></span><span class="font-audit-mono text-audit-mono text-on-surface-variant font-medium">SYSTEM OPERATIONAL (99.99%)</span></div></div><div class="flex flex-col"><span class="font-label-status text-label-status text-on-surface uppercase mb-space-md">Institutions</span><ul class="flex flex-col gap-space-sm"><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Universities &amp; Colleges</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Polytechnics &amp; Colleges of Ed</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Professional Licensing Boards</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">National Security Councils</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Registrar Ledger Sync</li></ul></div><div class="flex flex-col"><span class="font-label-status text-label-status text-on-surface uppercase mb-space-md">SIS Partners</span><ul class="flex flex-col gap-space-sm"><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Ellucian Banner Connector</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Oracle PeopleSoft Campus</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Workday Student Cloud</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">OpenSIS Open-Source Node</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Automated Webhook Sync</li></ul></div><div class="flex flex-col"><span class="font-label-status text-label-status text-on-surface uppercase mb-space-md">Developers</span><ul class="flex flex-col gap-space-sm"><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Core REST &amp; GraphQL APIs</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">JSON-LD / VC 2.0 Schemas</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Ed25519 &amp; BBS+ Cryptosuites</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Node.js &amp; Python SDKs</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Sandbox Testnet Faucet</li></ul></div><div class="flex flex-col"><span class="font-label-status text-label-status text-on-surface uppercase mb-space-md">Legal &amp; Cryptographic Audits</span><ul class="flex flex-col gap-space-sm"><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Formal Verification Reports</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">SOC 2 Type II Compliance</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Statutory Privacy Disclosures</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Public Key Certificate Ledger</li><li class="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer">Vulnerability Disclosure Policy</li></ul></div></div><div class="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant"><span class="font-audit-mono text-audit-mono">© 2025 SecureCert National Digital Infrastructure. All cryptographic rights reserved.</span><div class="flex items-center gap-space-lg font-audit-mono text-audit-mono"><span>GENESIS: BLOCK #00000001</span><span>SHA-256 HSM VALIDATED</span></div></div></div></footer>`;
