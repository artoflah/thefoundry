'use strict';

/* ================================================================
   LICENSED™ — THE LICENSED FOUNDRY™
   scripts.js v1.0.0
   ================================================================ */

// ================================================================
// DATA — VALID IDs
// ================================================================

const VALID_IDS = {
  'LCN-2026-0001-USUCK': 'basic',
  'LCN-2026-0002-BROKE': 'basic',
  'LCN-2026-0003-CHEAP': 'basic',
  'LCN-2026-0004-POOR':  'basic',
  'LCN-2026-0005-MID':   'standard',
  'LCN-2026-0006-MEH':   'standard',
  'LCN-2026-0007-FINE':  'standard',
  'LCN-2026-0008-OKAY':  'standard',
  'LCN-2026-0009-TRYING':  'professional',
  'LCN-2026-0010-SWEATY':  'professional',
  'LCN-2026-0011-CLOSE':   'professional',
  'LCN-2026-0012-ALMOST':  'professional',
  'LCN-2026-0013-SUCKER': 'enterprise',
  'LCN-2026-0014-MARK':   'enterprise',
  'LCN-2026-0015-FOOL':   'enterprise',
  'LCN-2026-0016-HAHA':   'enterprise',
};

// ================================================================
// DATA — TIERS
// ================================================================

const TIERS = {
  basic: {
    name: 'BASIC',
    price: '$12/mo',
    charLimit: 80,
    violationsAllowed: 1,
    allowedRegex: /^[a-z. ]*$/,
    restrictedDescription: 'lowercase letters and periods only',
    defaultSpecimen: 'the foundry presents a considered approach to contemporary typographic practice. each letterform is measured.',
  },
  standard: {
    name: 'STANDARD',
    price: '$89/mo',
    charLimit: 280,
    violationsAllowed: 3,
    allowedRegex: /^[a-zA-Z.,;:!?'"\-()1-5 ]*$/,
    restrictedDescription: 'uppercase and lowercase, standard punctuation, numerals 1–5 only',
    defaultSpecimen: 'the foundry presents a considered approach to contemporary typographic practice. each letterform is measured, each glyph accounted for. this specimen has been prepared under the terms of your standard license, version 1.0.0.',
  },
  professional: {
    name: 'PROFESSIONAL',
    price: '$340/mo',
    charLimit: 1000,
    violationsAllowed: 2,
    allowedRegex: /^[a-zA-Z.,;:!?'"\-()0-9 ]*$/,
    restrictedDescription: 'full alphabet, numerals 0–9, standard punctuation. no special characters. no copy or export.',
    defaultSpecimen: 'The Foundry presents a considered approach to contemporary typographic practice. Each letterform is measured. Each glyph accounted for. This specimen has been prepared under the terms of your Professional License, version 1.0.0. Usage is monitored.',
    blockCopy: true,
  },
  enterprise: {
    name: 'ENTERPRISE',
    price: 'AVAILABLE UPON INVITATION',
    charLimit: Infinity,
    sessionLimit: 50,
    violationsAllowed: 0,
    allowedRegex: /.*/,
    restrictedDescription: 'full glyph access. non-commercial use only. session limits apply.',
    defaultSpecimen: 'The Foundry presents a considered approach to contemporary typographic practice. Each letterform is measured. Each glyph is accounted for. This specimen has been prepared under the terms of your Enterprise License, version 1.0.0. Usage is monitored. Commercial application is prohibited.',
  },
};

// ================================================================
// DATA — LICENSE TEXT (full copy, all 4 tiers)
// ================================================================

const LICENSES = {

  basic: `
    <div class="license-text-section">
      <p class="license-section-heading">1. Introduction and Scope</p>
      <p class="license-clause"><span class="clause-num">1.1</span>This Licensee Agreement (hereinafter the "Agreement") is a binding legal instrument entered into between The Licensed Foundry™ (the "Foundry") and the individual identified by the membership credentials associated with this session (the "Licensee"). This Agreement governs the Licensee's permitted access to and use of Licensed™ typefaces under the Basic Tier license. The Foundry regrets that higher-tier features are not available to the Licensee at this time.</p>
      <p class="license-clause"><span class="clause-num">1.2</span>The Licensee acknowledges that the Basic Tier represents the entry point of the Licensed™ access hierarchy. Access at this tier is provided as a courtesy and does not imply any expectation that the Licensee's typographic output will meet professional or commercial standards. The Foundry takes no responsibility for work produced under the Basic license.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">2. Permitted Use and Character Restrictions</p>
      <p class="license-clause"><span class="clause-num">2.1</span>Subject to full compliance with this Agreement, the Foundry grants a non-exclusive, non-transferable, revocable license to use Licensed™ typefaces solely for personal, non-commercial purposes. Permitted use is restricted to lowercase alphabetical characters (a through z) and the period (.) character exclusively. All other glyphs — including but not limited to uppercase letterforms, numerals, punctuation marks, diacritical marks, ligatures, special characters, and all whitespace other than the standard space — are unavailable under the Basic Tier and remain the sole and exclusive property of the Foundry.</p>
      <p class="license-clause"><span class="clause-num">2.2</span>The Licensee is permitted to produce no more than eighty (80) characters of typeset content per session. The Foundry considers this a reasonable and generous limit given the scope of the Basic license tier.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">3. Biometric and Identity Verification</p>
      <p class="license-clause"><span class="clause-num">3.1</span>By entering the Member Access Portal and accepting this Agreement, the Licensee grants the Foundry access to device camera input for the purpose of verifying that the Licensee is human and matches the membership identification on file. Biometric data collected during verification may be retained by the Foundry indefinitely. The Foundry will not knowingly disclose biometric data to third parties except as required by applicable law, regulatory inquiry, or internal audit procedure.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">4. Violations, Logging, and Enforcement</p>
      <p class="license-clause"><span class="clause-num">4.1</span>The Licensee is permitted a maximum of one (1) license violation per active session. Upon the occurrence of any violation, the Foundry will issue an automated system notification. Upon the occurrence of a second violation within the same session, the Licensee's access will be immediately suspended and session data will be submitted to the Foundry's compliance archive.</p>
      <p class="license-clause"><span class="clause-num">4.2</span>For the purposes of this Agreement, a "violation" is defined as: (a) the use of any glyph not explicitly permitted under section 2.1; (b) any attempt to exceed the character limit established under section 2.2; (c) any attempt, whether successful or unsuccessful, to circumvent or interfere with the technical access restrictions imposed by this Agreement; or (d) any conduct that the Foundry, acting in its sole and final discretion, determines to be inconsistent with the spirit of the Basic license.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">5. Foundry's Retained Rights</p>
      <p class="license-clause"><span class="clause-num">5.1</span>The Foundry retains all intellectual property rights, moral rights, aesthetic rights, and spiritual rights in and to all Licensed™ typefaces in perpetuity. The granting of this license conveys no ownership interest of any kind in any glyph, letterform, design element, or typographic system. All rights not explicitly granted herein are reserved by the Foundry. The Foundry further retains the right to form private assessments of the Licensee's typographic output at any time and without disclosure.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">6. Term, Renewal, and Governing Law</p>
      <p class="license-clause"><span class="clause-num">6.1</span>This Agreement commences on the date of the Licensee's acceptance and renews automatically each calendar month unless lawfully terminated. The Licensee may not downgrade from the Basic license to any hypothetical lower tier. All disputes arising from or relating to this Agreement shall be resolved by binding arbitration, administered by an arbitrator selected at the sole discretion of the Foundry. The Licensee irrevocably waives the right to a jury trial, class action, or collective proceeding of any kind. The applicable governing jurisdiction shall be determined by the Foundry at such time as a dispute arises.</p>
    </div>
  `,

  standard: `
    <div class="license-text-section">
      <p class="license-section-heading">1. Introduction and Scope</p>
      <p class="license-clause"><span class="clause-num">1.1</span>This Licensee Agreement (the "Agreement") is entered into between The Licensed Foundry™ (the "Foundry") and the individual identified by the membership credentials on file (the "Licensee"). This Agreement governs the Licensee's permitted use of Licensed™ typefaces under the Standard Tier license. The Foundry acknowledges the Licensee's decision to invest in the Standard Tier and notes that this level of access, while expanded relative to the Basic Tier, remains subject to the restrictions, conditions, and monitoring procedures described herein.</p>
      <p class="license-clause"><span class="clause-num">1.2</span>The Licensee is advised to read this Agreement in its entirety before proceeding. The Standard Tier introduces additional compliance mechanisms, including quarterly reaffirmation requirements and expanded audit rights, the terms of which are set out in full below. Ignorance of any provision of this Agreement shall not constitute a defense in any violation proceeding.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">2. Permitted Use and Character Scope</p>
      <p class="license-clause"><span class="clause-num">2.1</span>Subject to full compliance with this Agreement, the Foundry grants the Licensee a non-exclusive, non-transferable, revocable license to use Licensed™ typefaces for personal, non-commercial purposes only. Permitted characters include: (a) all uppercase and lowercase alphabetical letters (A–Z, a–z); (b) standard punctuation marks including the period, comma, semicolon, colon, exclamation mark, question mark, single quotation mark, double quotation mark, hyphen-minus, and parentheses; and (c) numerals one (1) through five (5), inclusive. The numerals zero (0), six (6), seven (7), eight (8), and nine (9) are not available under the Standard Tier. The em dash character (—) is likewise unavailable. All restricted characters remain the exclusive property of the Foundry.</p>
      <p class="license-clause"><span class="clause-num">2.2</span>The Licensee may produce no more than two hundred eighty (280) characters of typeset content per session. This limit is strictly enforced. The Foundry thanks the Licensee in advance for their measured use of permitted glyphs.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">3. Biometric and Identity Verification</p>
      <p class="license-clause"><span class="clause-num">3.1</span>By accepting this Agreement, the Licensee grants the Foundry access to device camera input for the purpose of verifying that the Licensee is human and matches the membership identification on file. Biometric data collected during this process may be retained indefinitely and used for compliance, audit, and internal research purposes. The Licensee acknowledges that non-compliance with biometric verification procedures may result in the suspension or termination of license privileges.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">4. Glyph Governance and Access Hierarchy</p>
      <p class="license-clause"><span class="clause-num">4.1</span>Access to restricted characters — including numerals 0, 6, 7, 8, and 9, the em dash, and any character not enumerated in section 2.1 — is expressly prohibited under the Standard Tier. The unauthorized use of any such character constitutes a license violation and will be immediately logged in the Licensee's usage record. The Foundry reserves the right to act on any logged violation at its sole discretion.</p>
      <p class="license-clause"><span class="clause-num">4.2</span>The Foundry reserves the right to modify the list of permitted and restricted characters at any time, with or without notice to the Licensee. Modifications take effect immediately upon the Foundry's determination. In the event that a character is reclassified as restricted following the Licensee's prior lawful use thereof, the Licensee agrees to immediately cease use of that character and destroy, to the extent practicable, any existing typeset materials containing it.</p>
      <p class="license-clause"><span class="clause-num">4.3</span>The Licensee acknowledges that all letterforms set in Licensed™ typefaces retain the intellectual and aesthetic character of the Foundry at all times, regardless of the content in which they appear or the purpose for which they are used. The Licensee acquires no ownership interest in the glyphs, design elements, or formal properties of any Licensed™ typeface. The aesthetic judgment of the Foundry is final in all matters pertaining to the correct and appropriate deployment of the typeface.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">5. Violations and Enforcement</p>
      <p class="license-clause"><span class="clause-num">5.1</span>The Licensee is permitted a maximum of three (3) license violations per session. Each violation will trigger an automated system notification. Upon the commission of a fourth violation, session access will be immediately and permanently terminated and the Licensee's account will be flagged for compliance review. Violation records are maintained indefinitely.</p>
      <p class="license-clause"><span class="clause-num">5.2</span>For the purposes of this Agreement, a "violation" includes: (a) use of any character not listed in section 2.1; (b) exceeding the session character limit; (c) any attempt to copy, export, reproduce, or redistribute typeset content; (d) sharing or conveying access credentials to any unauthorized party; or (e) any conduct the Foundry determines, in its sole discretion, to be inconsistent with the Standard Tier's intended use.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">6. Quarterly License Reaffirmation</p>
      <p class="license-clause"><span class="clause-num">6.1</span>The Standard Tier license is subject to mandatory quarterly reaffirmation. On or before the final day of each calendar quarter, the Licensee must re-enter the Member Access Portal, review this Agreement in its current form, and formally reaffirm their acceptance. Failure to complete reaffirmation within the required window will result in automatic suspension of all typographic privileges. Suspended periods are non-refundable and will not extend the subsequent reaffirmation deadline.</p>
      <p class="license-clause"><span class="clause-num">6.2</span>The Foundry reserves the right to amend the terms of this Agreement at any time. Amended terms will be presented in full at the Licensee's next scheduled reaffirmation. The Licensee's continued use of Licensed™ typefaces following any amendment constitutes full acceptance of such amendments, including amendments made between reaffirmation periods of which the Licensee was not directly notified.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">7. Retained Rights and Audit Authority</p>
      <p class="license-clause"><span class="clause-num">7.1</span>The Foundry retains all intellectual, aesthetic, moral, and spiritual rights in and to Licensed™ typefaces. The Foundry may, at any time and without prior notice, conduct an audit of the Licensee's typographic activity to verify compliance with this Agreement. The Licensee agrees to cooperate fully with any such audit and to make available any relevant usage data upon request within forty-eight (48) hours. The findings of any audit proceeding are final.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">8. Term, Renewal, and Governing Law</p>
      <p class="license-clause"><span class="clause-num">8.1</span>This Agreement commences upon acceptance and renews automatically each calendar month. The Licensee may not downgrade from the Standard Tier once this Agreement has been accepted. Disputes arising under this Agreement shall be resolved by binding arbitration administered by an arbitrator selected at the sole discretion of the Foundry. The Licensee waives any right to a jury trial, class action, or collective proceeding. The applicable jurisdiction shall be determined by the Foundry at the time a dispute arises. This Agreement constitutes the entire understanding between the parties and supersedes all prior representations.</p>
    </div>
  `,

  professional: `
    <div class="license-text-section">
      <p class="license-section-heading">1. Introduction and Scope</p>
      <p class="license-clause"><span class="clause-num">1.1</span>This Licensee Agreement (the "Agreement") is a legally binding instrument entered into between The Licensed Foundry™ (the "Foundry") and the individual or entity identified by the membership credentials on file (the "Licensee"). This Agreement governs the Licensee's access to and use of Licensed™ typefaces under the Professional Tier license. The Foundry acknowledges the Licensee's significant financial commitment to this tier and advises that the Professional license carries commensurate responsibilities, restrictions, and oversight mechanisms, all of which are set forth in full herein.</p>
      <p class="license-clause"><span class="clause-num">1.2</span>The Professional Tier grants the broadest access available to individual license holders. This Agreement supersedes all prior communications, trial agreements, or informal understandings between the parties. The Licensee affirms that they have read and understood all provisions before accepting.</p>
      <p class="license-clause"><span class="clause-num">1.3</span>The Licensee acknowledges that the Foundry's decision to make the Professional Tier available to them is not to be construed as an endorsement of the Licensee's typographic practice, professional qualifications, or aesthetic judgment. Access remains subject to the restrictions herein and the Foundry's ongoing assessment of compliance history.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">2. Permitted Use and Character Scope</p>
      <p class="license-clause"><span class="clause-num">2.1</span>Subject to full compliance with this Agreement, the Foundry grants the Licensee a non-exclusive, non-transferable, revocable license to use Licensed™ typefaces for personal, non-commercial purposes only. Permitted use includes: (a) all uppercase and lowercase alphabetical characters (A–Z, a–z); (b) all numerals (0–9); and (c) standard punctuation including the period, comma, semicolon, colon, exclamation mark, question mark, single and double quotation marks, hyphen-minus, and parentheses. Special characters, ligatures, alternate glyphs, diacritical marks, and characters outside the standard Latin character set remain unavailable under the Professional Tier.</p>
      <p class="license-clause"><span class="clause-num">2.2</span>The Licensee may produce no more than one thousand (1,000) characters of typeset content per session. This limit is enforced by the system and cannot be overridden by any means.</p>
      <p class="license-clause"><span class="clause-num">2.3</span>The Licensee's declared typographic settings — including but not limited to font size, line-height, and tracking values — shall remain fixed for a minimum of thirty (30) days following any adjustment. Changes to these settings require written notice to the Foundry no fewer than fourteen (14) days prior to implementation. The Foundry reserves the right to deny any such change request without explanation.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">3. Biometric and Identity Verification</p>
      <p class="license-clause"><span class="clause-num">3.1</span>By entering the Member Access Portal and accepting this Agreement, the Licensee grants the Foundry access to device camera input for the purpose of verifying that the Licensee is human and matches the membership identification on file. Biometric data collected during verification may be retained indefinitely and used for identity confirmation, compliance documentation, and internal research purposes. The Licensee further agrees to make themselves available for camera verification upon request by the Foundry at any time during an active session.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">4. Public Display Restrictions</p>
      <p class="license-clause"><span class="clause-num">4.1</span>The Professional Tier does not include public display rights. Licensed™ typefaces may not be used in any material that is publicly displayed, distributed, broadcast, or made accessible to any person other than the Licensee. This includes digital publication, print distribution, social media, signage, presentation materials, and all other forms of public-facing communication.</p>
      <p class="license-clause"><span class="clause-num">4.2</span>"Public display" is defined as any display of typeset material that is visible to, accessible by, or capable of being received by any person who is not the Licensee. The Licensee's household members are not exempt from this definition. The Foundry acknowledges this restriction may limit the practical utility of the Professional license and considers this appropriate given the tier's price point.</p>
      <p class="license-clause"><span class="clause-num">4.3</span>The Licensee agrees that materials produced under this license are for private use only and shall not be reproduced, printed, forwarded, shared, photographed, described verbally to another person, or otherwise communicated in any manner that would constitute public display as defined in subsection 4.2.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">5. Copy and Export Restrictions</p>
      <p class="license-clause"><span class="clause-num">5.1</span>The Licensee may not copy, export, reproduce, capture, screenshot, or otherwise extract typeset content produced using Licensed™ typefaces. The Foundry's systems monitor for copy attempts, and any such attempt will be treated as a license violation regardless of whether the attempt was successful. The Licensee consents to all monitoring in connection with this clause.</p>
      <p class="license-clause"><span class="clause-num">5.2</span>The Licensee acknowledges that the right to reproduce typeset content is a separate and distinct right from the right to set type, and that the Professional license grants only the latter. Reproduction rights are available exclusively through the Enterprise Tier or by separate written agreement with the Foundry.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">6. Non-Transferability</p>
      <p class="license-clause"><span class="clause-num">6.1</span>This license is strictly personal to the Licensee and may not be transferred, sublicensed, loaned, shared, assigned, or otherwise conveyed to any other individual or entity under any circumstances. Any attempt to transfer this license shall render it immediately null and void, and the Foundry reserves the right to initiate enforcement action without notice.</p>
      <p class="license-clause"><span class="clause-num">6.2</span>The Licensee may not permit any other person to use their credentials, access the Member Portal on their behalf, or observe the Licensee's typographic session in real time. The presence of an unauthorized observer during a session constitutes a violation of this Agreement. The Licensee further agrees that any dreams in which Licensed™ typefaces appear shall be considered derivative works, the rights to which are retained exclusively by the Foundry.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">7. Violations and Enforcement</p>
      <p class="license-clause"><span class="clause-num">7.1</span>The Licensee is permitted a maximum of two (2) license violations per session. Each violation will trigger an automated notification. A third violation will result in immediate revocation of session access and submission of the Licensee's violation record to the Foundry's compliance team. All violations are permanently logged.</p>
      <p class="license-clause"><span class="clause-num">7.2</span>For the purposes of this Agreement, a "violation" includes: (a) use of any character not listed in section 2.1; (b) exceeding the session character limit; (c) any copy or export attempt as described in section 5; (d) any public display as described in section 4; (e) any breach of the non-transferability provisions of section 6; or (f) any conduct the Foundry determines to be inconsistent with the Professional Tier.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">8. Audit Rights</p>
      <p class="license-clause"><span class="clause-num">8.1</span>The Foundry reserves the right to audit the Licensee's typographic activity, usage logs, and compliance records at any time and without prior notice. The Licensee agrees to provide all requested documentation within seventy-two (72) hours of any audit request. Failure to cooperate with an audit will be treated as a material violation of this Agreement.</p>
      <p class="license-clause"><span class="clause-num">8.2</span>The Foundry may retain third-party auditors to conduct compliance reviews on its behalf. The Licensee consents to the disclosure of all relevant usage data to any third party engaged by the Foundry for this purpose. The Foundry provides no warranty regarding the data-handling practices of such third parties.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">9. Retained Rights</p>
      <p class="license-clause"><span class="clause-num">9.1</span>The Foundry retains all intellectual, moral, aesthetic, and spiritual rights in and to Licensed™ typefaces in perpetuity. These rights are unconditional and survive the termination of this Agreement. The Licensee acquires no ownership interest of any kind in any glyph, letterform, or design element.</p>
      <p class="license-clause"><span class="clause-num">9.2</span>The Foundry further retains the right to monitor, evaluate, and form judgments about the Licensee's typographic output at any time. Such judgments are not subject to appeal. The Foundry may, at its discretion, issue a formal "Notice of Aesthetic Concern" to a Licensee whose output the Foundry determines to be inconsistent with the standards of the Licensed™ typeface family. Receipt of such notice does not constitute grounds for a refund.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">10. Term, Renewal, and Governing Law</p>
      <p class="license-clause"><span class="clause-num">10.1</span>This Agreement commences upon acceptance and renews automatically each calendar month. The Licensee may upgrade to the Enterprise Tier at any time. Downgrade to the Standard or Basic Tier is not permitted once the Professional Tier has been accepted. All disputes shall be resolved by binding arbitration before an arbitrator selected exclusively by the Foundry. The applicable jurisdiction shall be determined at the Foundry's discretion. The Licensee irrevocably waives any right to a jury trial or class action.</p>
      <p class="license-clause"><span class="clause-num">10.2</span>This Agreement constitutes the complete and final understanding between the parties. Any communication, promise, or representation not expressly included herein shall be of no legal effect. Both parties acknowledge that no such representations were made.</p>
    </div>
  `,

  enterprise: `
    <div class="license-text-section">
      <p class="license-section-heading">1. Introduction and Scope</p>
      <p class="license-clause"><span class="clause-num">1.1</span>This Licensee Agreement (the "Agreement") is a legally binding and irrevocable instrument entered into between The Licensed Foundry™ (the "Foundry") and the individual or entity identified by the Enterprise membership credentials on file (the "Licensee"). This Agreement governs in full the Licensee's access to and use of Licensed™ typefaces under the Enterprise Tier license. The Foundry extends its conditional congratulations to the Licensee on achieving Enterprise status and advises that this distinction carries the most comprehensive set of obligations, restrictions, and compliance requirements available within the Licensed™ access hierarchy.</p>
      <p class="license-clause"><span class="clause-num">1.2</span>The Enterprise Tier is the Foundry's highest-priced license offering. It is not the Foundry's most permissive. The Licensee acknowledges this distinction explicitly and without reservation.</p>
      <p class="license-clause"><span class="clause-num">1.3</span>This Agreement supersedes all prior communications, representations, negotiations, trial access periods, and informal understandings between the parties. It constitutes the sole and complete statement of the terms of the Licensee's access to Licensed™ typefaces. The Foundry makes no warranty, express or implied, regarding the fitness of this license for any particular purpose.</p>
      <p class="license-clause"><span class="clause-num">1.4</span>By accepting this Agreement, the Licensee affirms that they have read every section in its entirety, understand all terms and conditions, and accept them knowingly, voluntarily, and without coercion — including but not limited to financial coercion, social pressure, or the misapprehension that a higher-priced product implies broader use rights.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">2. Permitted Use</p>
      <p class="license-clause"><span class="clause-num">2.1</span>Subject to full and ongoing compliance with this Agreement, the Foundry grants the Licensee a non-exclusive, non-transferable, revocable license to access Licensed™ typefaces for personal, non-commercial purposes only. "Non-commercial" is defined as use that does not generate, directly or indirectly, any financial return, brand value, reputational benefit, or professional advantage of any kind for the Licensee or any associated party.</p>
      <p class="license-clause"><span class="clause-num">2.2</span>The Enterprise Tier provides access to the full Licensed™ glyph set, including all uppercase and lowercase letterforms, all numerals, all standard and extended punctuation marks, and all special characters. This access is subject to all restrictions enumerated in sections 4 through 12 of this Agreement.</p>
      <p class="license-clause"><span class="clause-num">2.3</span>Notwithstanding subsection 2.2, the Licensee acknowledges that access to the full glyph set does not imply permission to use all glyphs in all contexts. Each character deployed in typeset content remains subject to the Foundry's aesthetic rights, monitoring prerogatives, and interpretive authority as described in section 11. The Foundry reserves the right to designate individual glyphs as temporarily or permanently restricted at any time.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">3. Session Limits</p>
      <p class="license-clause"><span class="clause-num">3.1</span>The Licensee's typographic sessions are subject to a maximum of fifty (50) total characters per session period. A "session period" is defined as a continuous period of authenticated access, commencing upon login and concluding upon logout, session expiration, or browser closure, whichever occurs first. Characters deleted during a session are counted against the session total. Sessions reset every twenty-four (24) hours.</p>
      <p class="license-clause"><span class="clause-num">3.2</span>The Foundry acknowledges that the fifty-character session limit may appear inconsistent with the Enterprise Tier's advertised full glyph access. The Foundry considers this appropriate and has no further comment on the matter.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">4. Biometric and Identity Verification</p>
      <p class="license-clause"><span class="clause-num">4.1</span>By entering the Member Access Portal and accepting this Agreement, the Licensee grants the Foundry access to device camera input for the purpose of verifying that the Licensee is human and matches the membership identification on file. Biometric data collected during verification sessions may be retained indefinitely. Such data may be used for identity confirmation, compliance review, internal research, and any other purpose the Foundry determines to be appropriate. The Foundry will not knowingly disclose biometric data to unauthorized third parties, where "unauthorized" is defined at the Foundry's sole discretion.</p>
      <p class="license-clause"><span class="clause-num">4.2</span>Enterprise Tier Licensees are subject to monthly identity confirmation, in addition to standard login verification. Failure to complete monthly confirmation within the required window will result in automatic suspension of access. Suspended periods are non-refundable.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">5. Public Display Restrictions</p>
      <p class="license-clause"><span class="clause-num">5.1</span>The Enterprise Tier does not include public display rights. Typeset materials produced using Licensed™ typefaces may not be displayed, distributed, published, broadcast, shared, or made accessible to any person other than the Licensee. This restriction applies to all media, including but not limited to: digital publication, print, email, signage, projected display, social media, interpersonal communication, presentation, and verbal description of the visual appearance of typeset content.</p>
      <p class="license-clause"><span class="clause-num">5.2</span>The Licensee agrees not to use Licensed™ typefaces in any context that may be observed by another person, including in shared workspaces, on unlocked screens in common areas, or in any physical location where incidental viewing by a third party is possible.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">6. Cloud Storage Prohibition</p>
      <p class="license-clause"><span class="clause-num">6.1</span>Typeset materials produced using Licensed™ typefaces may not be saved to, uploaded to, synced with, transmitted through, or otherwise stored in any cloud-based storage system, including but not limited to: iCloud, Google Drive, Dropbox, Microsoft OneDrive, Amazon Web Services, GitHub, GitLab, Notion, Figma, Adobe Creative Cloud, or any other remote storage solution now in existence or hereinafter developed. All materials produced under this license must be stored exclusively on the Licensee's local hardware and may not be backed up by any remote means.</p>
      <p class="license-clause"><span class="clause-num">6.2</span>The Licensee acknowledges the risk that local-only storage presents to the preservation of their typographic work and confirms that this risk is fully acceptable. The Foundry accepts no liability for data loss resulting from compliance with this provision.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">7. Collaborator Restrictions</p>
      <p class="license-clause"><span class="clause-num">7.1</span>The Enterprise Tier permits a maximum of three (3) designated collaborators per license year. A "collaborator" is defined as any person who views, handles, discusses, or otherwise engages with materials produced under this license. Collaborators must be registered with the Foundry prior to engagement and are subject to all the same restrictions as the Licensee with respect to reproduction, display, and distribution.</p>
      <p class="license-clause"><span class="clause-num">7.2</span>Collaborators may not themselves hold an active Licensed™ license of any tier during the period of their collaboration. Concurrent license holders are ineligible for collaborator designation. The Foundry reserves the right to disqualify any collaborator at any time and without explanation.</p>
      <p class="license-clause"><span class="clause-num">7.3</span>All collaborator designations expire at the conclusion of the license year in which they were registered. Re-registration of the same individual requires a new application and a non-refundable collaborator filing fee, the amount of which shall be determined by the Foundry at the time of re-registration.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">8. Wellness Monitoring and Check-In Requirements</p>
      <p class="license-clause"><span class="clause-num">8.1</span>Enterprise Tier Licensees are subject to mandatory monthly wellness check-ins. The purpose of these check-ins is to ensure that the Licensee's engagement with Licensed™ typefaces remains within the bounds of healthy typographic practice and does not indicate compulsive, excessive, or commercially motivated use. Check-ins are conducted via the Member Access Portal.</p>
      <p class="license-clause"><span class="clause-num">8.2</span>Failure to complete a scheduled wellness check-in within the required window will result in a temporary pause of typographic privileges. Paused periods are non-refundable and do not extend the subsequent check-in deadline.</p>
      <p class="license-clause"><span class="clause-num">8.3</span>In the event that a wellness check-in reveals indicators of distress, commercial intent, or aesthetic misalignment, the Foundry reserves the right to recommend a mandatory typographic cooling-off period of no fewer than fourteen (14) days, during which the Licensee's access will be suspended without refund. The Foundry makes this determination in its sole and unreviewable discretion.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">9. Non-Transferability</p>
      <p class="license-clause"><span class="clause-num">9.1</span>This license is strictly personal to the Licensee and may not be transferred, sublicensed, loaned, assigned, sold, gifted, or otherwise conveyed to any individual or entity under any circumstances. Any unauthorized transfer shall render the license immediately null and void without refund. The Foundry reserves the right to initiate enforcement action in connection with any transfer attempt.</p>
      <p class="license-clause"><span class="clause-num">9.2</span>The Licensee agrees that any dreams in which Licensed™ typefaces appear shall be considered derivative works, rights to which are retained exclusively by the Foundry. The Licensee further agrees not to describe, reproduce, or communicate the content of any such dream in any manner that would constitute public display under section 5 of this Agreement.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">10. Copy and Reproduction Restrictions</p>
      <p class="license-clause"><span class="clause-num">10.1</span>The Licensee may not copy, export, capture, screenshot, photograph, trace, describe in writing, memorize for the purpose of reproduction, or otherwise extract typeset content produced under this license by any means, technical or otherwise. The Enterprise Tier does not include reproduction rights. Such rights are available, at the Foundry's discretion, through a separately negotiated and individually priced agreement.</p>
      <p class="license-clause"><span class="clause-num">10.2</span>The right to view one's own typeset content does not imply a right to retain it. The Licensee acknowledges and accepts this distinction without qualification.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">11. Retained Rights</p>
      <p class="license-clause"><span class="clause-num">11.1</span>The Foundry retains all intellectual, moral, aesthetic, spiritual, and emotional rights in and to Licensed™ typefaces in perpetuity. These rights are unconditional, irrevocable, and shall survive the termination of this Agreement, the dissolution of either party, and the expiration of any applicable statutory term of copyright or design protection.</p>
      <p class="license-clause"><span class="clause-num">11.2</span>The Foundry further reserves the right to form and retain private aesthetic opinions about the Licensee's typographic work at any time. These opinions need not be disclosed to the Licensee and are not subject to any form of appeal, response, grievance, or rebuttal. The Foundry's silence on any matter of aesthetics shall not be construed as approval.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">12. Audit Rights</p>
      <p class="license-clause"><span class="clause-num">12.1</span>The Foundry reserves the right to conduct comprehensive audits of the Licensee's typographic activity, system usage, collaborator designations, wellness check-in compliance, cloud storage compliance, and adherence to all other provisions of this Agreement, at any time, without prior notice, and without limitation in scope or duration.</p>
      <p class="license-clause"><span class="clause-num">12.2</span>The Licensee agrees to provide full cooperation with any audit, including providing access to relevant devices, storage media, and communications records within twenty-four (24) hours of request. Third-party auditors engaged by the Foundry may retain audit findings indefinitely and are not subject to any confidentiality obligation with respect to the Licensee's usage data.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">13. Term, Renewal, and Cancellation</p>
      <p class="license-clause"><span class="clause-num">13.1</span>This Agreement commences on the date of acceptance and renews automatically and in perpetuity. The Enterprise license cannot be cancelled. The Licensee may submit a written cancellation request addressed to the Foundry's General Counsel at the address determined by the Foundry at the time of receipt, but such requests will not be acknowledged, acted upon, or returned. Submitted cancellation requests are non-refundable.</p>
      <p class="license-clause"><span class="clause-num">13.2</span>The Foundry may terminate this Agreement at any time and for any reason, including reasons which need not be disclosed to the Licensee. Upon termination, all typographic privileges cease immediately and without right of appeal. No refund will be issued under any circumstances.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">14. Binding Arbitration and Governing Jurisdiction</p>
      <p class="license-clause"><span class="clause-num">14.1</span>All disputes, claims, controversies, or interpretive disagreements arising under or in connection with this Agreement shall be resolved exclusively by binding arbitration. The arbitrator shall be selected by the Foundry at the time a dispute is raised. The arbitration shall take place in a jurisdiction determined by the Foundry at the time of the proceeding, which may differ from any jurisdiction in which the Licensee resides, works, or holds citizenship.</p>
      <p class="license-clause"><span class="clause-num">14.2</span>The Licensee irrevocably waives the right to bring or participate in any jury trial, class action, collective proceeding, or any other adversarial process in connection with any matter covered by this Agreement. The arbitrator's decision is final and binding and may not be appealed in any court of any jurisdiction.</p>
      <p class="license-clause"><span class="clause-num">14.3</span>The Licensee acknowledges that the terms of this arbitration provision were presented on a take-it-or-leave-it basis and that no negotiation of these terms was offered or implied. The Licensee confirms that this does not affect their acceptance of the clause.</p>
    </div>
    <div class="license-text-section">
      <p class="license-section-heading">15. Final Acknowledgment</p>
      <p class="license-clause"><span class="clause-num">15.1</span>The Licensee confirms that they have read this Agreement in full, that they understand the nature and extent of the restrictions contained herein, and that they entered into this Agreement freely and with complete awareness that the Enterprise Tier, as described, represents the most restricted access to Licensed™ typefaces available in exchange for the highest monthly fee.</p>
      <p class="license-clause"><span class="clause-num">15.2</span>You have paid the most. You may do the least.</p>
    </div>
  `,
};

// ================================================================
// SVG ASSETS
// ================================================================

function getLogo(size = 120) {
  return `<img src="assets/fdrylogo.svg" width="${size}" height="${size}" alt="The Licensed Foundry™" style="display:block;">`;
}

function getQRPlaceholder(size = 56) {
  // a grid that reads as a QR code without being a real one
  const cell = size / 7;
  const cells = [
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],
    [0,1],[2,1],[4,1],[6,1],
    [0,2],[1,2],[2,2],[4,2],[6,2],
    [0,3],[2,3],[3,3],[5,3],
    [0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],
    [0,5],[3,5],[5,5],[6,5],
    [0,6],[2,6],[3,6],[4,6],[6,6],
  ];
  const rects = cells.map(([cx, cy]) =>
    `<rect x="${cx * cell}" y="${cy * cell}" width="${cell}" height="${cell}" fill="#000"/>`
  ).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`;
}

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

function getToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getTierFromStorage() {
  return localStorage.getItem('user_tier');
}

function getIDFromStorage() {
  return localStorage.getItem('user_id');
}

function getViolationsFromStorage(tier) {
  const key = `violations_remaining_${tier}`;
  const stored = localStorage.getItem(key);
  if (stored === null) {
    const allowed = TIERS[tier] ? TIERS[tier].violationsAllowed : 0;
    localStorage.setItem(key, allowed);
    return allowed;
  }
  return parseInt(stored, 10);
}

function setViolationsInStorage(tier, count) {
  localStorage.setItem(`violations_remaining_${tier}`, count);
}

function getSessionCharsFromStorage() {
  return parseInt(sessionStorage.getItem('session_chars') || '0', 10);
}

function setSessionCharsInStorage(n) {
  sessionStorage.setItem('session_chars', n);
}

// ================================================================
// VIOLATION POPUP SYSTEM
// ================================================================

let popupCount = 0;
const MAX_POPUPS = 30;

// ================================================================
// CAMERA / DIA WORD-TEXTURE SYSTEM
// ================================================================

const CAM_W   = 300;   // popup canvas width (px)
const CAM_H   = 120;   // popup canvas height (px)
const CAM_FPS = 15;

// DIA sampling grid
const DIA_ROWS      = 38;
const DIA_ASPECT    = CAM_H / CAM_W;                          // 0.4
const DIA_INPUT_W   = Math.round(DIA_ROWS / DIA_ASPECT);      // 95
const DIA_INPUT_H   = DIA_ROWS;                               // 38
const DIA_MIN_LEVEL = 35;
const DIA_MAX_LEVEL = 200;

// Word textures: index 0 = lightest (blank), index 3 = darkest (VIOLATION)
const DIA_WORDS    = ['', 'LCN', 'FOUNDRY', 'VIOLATION'];
const DIA_TEX_SIZE = 1000;

// Glitch ramp — used only by denied-camera fallback
const _GLITCH_COLS = 50;
const _GLITCH_ROWS = 20;
const _GLITCH_FONT = 6;
const _GLITCH_RAMP = ['█','▓','▒','░','+',':','.',' ',' ',' '];

let cameraState     = 'idle'; // 'idle' | 'requesting' | 'active' | 'denied'
let cameraVideo     = null;   // hidden <video>
let cameraOffscreen = null;   // sampling canvas (DIA_INPUT_W × DIA_INPUT_H)
let livePopup       = null;   // { el, canvas, rafId } — the currently rendering popup
const popupStack    = [];     // [{ el, canvas }] oldest → newest
let _onViolationDecrement = null; // set by initSpecimen; used for biometric refusal
let wordTextures    = null;   // pre-rendered word canvases [blank, LCN, FOUNDRY, VIOLATION]

// Global ticker function — set by initTicker; callable from any section
let tickerAdd = null;

function _mapValue(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

// Pre-render 4 word textures at 1000×1000 each. Run once at script load.
// Each word is horizontally stretched to fill the full canvas width;
// scaleY=3.2 pre-stretches vertically so words read naturally when stamped
// into thin row cells at render time.
function _initWordTextures() {
  wordTextures = [];
  for (let i = 0; i < 4; i++) {
    const canvas = document.createElement('canvas');
    canvas.width  = DIA_TEX_SIZE;
    canvas.height = DIA_TEX_SIZE;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, DIA_TEX_SIZE, DIA_TEX_SIZE);

    const word = DIA_WORDS[i];
    if (!word) {
      // index 0 = blank — transparent canvas, white bg shows through
      wordTextures.push(canvas);
      continue;
    }

    const textSize = 100;
    ctx.font = `bold ${textSize}px "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif`;
    const measuredWidth = ctx.measureText(word).width;
    const scaleX = DIA_TEX_SIZE / measuredWidth;
    const scaleY = 3.2;

    ctx.save();
    ctx.fillStyle = '#EE1111';
    ctx.translate(DIA_TEX_SIZE / 2, DIA_TEX_SIZE / 2);
    ctx.scale(scaleX, scaleY);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(word, 0, 0);
    ctx.restore();

    wordTextures.push(canvas);
  }
}

// Initialize textures immediately — pure canvas, no camera permission needed
_initWordTextures();

function _initCamera(onGranted, onDenied) {
  cameraState = 'requesting';
  navigator.mediaDevices
    .getUserMedia({ video: { width: 320, height: 240 }, audio: false })
    .then(stream => {
      cameraState = 'active';
      cameraVideo = document.createElement('video');
      cameraVideo.srcObject   = stream;
      cameraVideo.autoplay    = true;
      cameraVideo.playsInline = true;
      cameraVideo.muted       = true;
      // Debug mode: ?debug=camera shows raw feed at bottom-left
      const _dbg = new URLSearchParams(location.search).get('debug') === 'camera';
      cameraVideo.style.cssText = _dbg
        ? 'position:fixed;bottom:16px;left:16px;width:160px;height:120px;object-fit:cover;z-index:99999;border:2px solid red;opacity:0.85;'
        : 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;top:-10px;left:-10px;';
      document.body.appendChild(cameraVideo);
      cameraOffscreen        = document.createElement('canvas');
      cameraOffscreen.width  = DIA_INPUT_W;
      cameraOffscreen.height = DIA_INPUT_H;
      onGranted();
    })
    .catch(() => {
      cameraState = 'denied';
      onDenied();
    });
}

// DIA draw_hor port — per-frame render using pre-cached word textures.
// Downsamples video to ~95×38, finds consecutive same-brightness runs per row,
// stamps the matching word texture stretched to each run's output width.
function _renderAsciiFrame(canvas, ctx) {
  if (cameraState !== 'active' || !cameraVideo || cameraVideo.readyState < 2) return;
  if (!wordTextures) return;

  const inputW = DIA_INPUT_W;
  const inputH = DIA_INPUT_H;
  const w = canvas.width  / inputW;
  const h = canvas.height / inputH;

  // Downsample video to tiny sampling canvas
  const sCtx = cameraOffscreen.getContext('2d');
  sCtx.drawImage(cameraVideo, 0, 0, inputW, inputH);
  const { data } = sCtx.getImageData(0, 0, inputW, inputH);

  // Clear to white, then draw mirrored (selfie view) via output transform
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  for (let y = 0; y < inputH; y++) {
    let startX     = 0;
    let currentIdx = -1;

    for (let x = 0; x < inputW; x++) {
      const p   = (y * inputW + x) * 4;
      const avg = (data[p] + data[p + 1] + data[p + 2]) / 3;

      // Contrast clamp (port of DIA cacheInput)
      const avgMin     = Math.max(0, avg - DIA_MIN_LEVEL) / (255 - DIA_MIN_LEVEL) * 255;
      const avgClamped = 255 - Math.max(0, DIA_MAX_LEVEL - avgMin) / DIA_MAX_LEVEL * 255;

      // Map brightness to texture index: bright → 0 (blank), dark → 3 (VIOLATION)
      const newIdx = Math.max(0, Math.min(3,
        Math.floor(_mapValue(avgClamped, 0, 255, 3, 0))
      ));

      if (newIdx !== currentIdx) {
        // Flush completed run
        if (currentIdx !== -1) {
          const segW = x - startX;
          if (segW > 0) ctx.drawImage(wordTextures[currentIdx], startX * w, y * h, segW * w, h);
        }
        startX     = x;
        currentIdx = newIdx;
      }

      if (x === inputW - 1) {
        // Flush final segment of this row
        ctx.drawImage(wordTextures[currentIdx], startX * w, y * h, (x - startX + 1) * w, h);
      }
    }
  }

  ctx.restore();
}

// Denied-camera fallback — block noise, no word textures needed
function _makeGlitch(canvas, ctx) {
  const cellW = CAM_W / _GLITCH_COLS;
  const cellH = CAM_H / _GLITCH_ROWS;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#EE1111';
  ctx.font = `${_GLITCH_FONT}px monospace`;
  ctx.textBaseline = 'top';
  for (let r = 0; r < _GLITCH_ROWS; r++) {
    for (let c = 0; c < _GLITCH_COLS; c++) {
      const ch = _GLITCH_RAMP[Math.floor(Math.random() * _GLITCH_RAMP.length)];
      ctx.fillText(ch, c * cellW, r * cellH);
    }
  }
}

function _startLiveRender(popupEl, canvas) {
  const ctx     = canvas.getContext('2d');
  const frameMs = 1000 / CAM_FPS;
  let lastT = 0;
  let rafId;

  function loop(t) {
    if (t - lastT >= frameMs) {
      _renderAsciiFrame(canvas, ctx);
      lastT = t;
    }
    rafId = requestAnimationFrame(loop);
  }

  rafId = requestAnimationFrame(loop);
  livePopup = { el: popupEl, canvas, rafId };
}

function _freezeLivePopup() {
  if (!livePopup) return;
  cancelAnimationFrame(livePopup.rafId);
  // Canvas retains its last frame — no extra snapshot needed
  livePopup = null;
}

function _promoteNextLive() {
  if (cameraState !== 'active') return;
  // Walk stack newest→oldest, find first popup still in DOM
  for (let i = popupStack.length - 1; i >= 0; i--) {
    const entry = popupStack[i];
    if (document.body.contains(entry.el)) {
      _startLiveRender(entry.el, entry.canvas);
      return;
    }
  }
}

const VIOLATION_COPY = {
  restricted_char: [
    (d) => [`VIOLATION — RESTRICTED CHARACTER`, `The character "${d.char}" is not permitted under your ${d.tier} license. See subsection 4(b) of the Licensee Agreement. This incident has been logged.`],
    (d) => [`VIOLATION — RESTRICTED CHARACTER`, `Use of the character "${d.char}" is expressly prohibited at the ${d.tier} tier. This violation has been recorded and will be included in your membership compliance review.`],
    (d) => [`VIOLATION — UNAUTHORIZED GLYPH`, `The glyph "${d.char}" falls outside your licensed character set. The Foundry has been notified. Please consult section 2.1 of your Agreement.`],
    (d) => [`VIOLATION — GLYPH ACCESS DENIED`, `Your ${d.tier} license does not include the character "${d.char}". Consider upgrading. This incident has been logged.`],
  ],
  restricted_numeral: [
    (d) => [`VIOLATION — UNAUTHORIZED GLYPH`, `The numeral "${d.char}" is reserved for Professional Tier and above. Please consider upgrading your license. This incident has been logged.`],
    (d) => [`VIOLATION — NUMERAL RESTRICTED`, `The numeral "${d.char}" is not available under your ${d.tier} license. See subsection 4(a). Upgrading may resolve this issue.`],
  ],
  char_limit: [
    (d) => [`VIOLATION — CHARACTER LIMIT EXCEEDED`, `Your ${d.tier} license permits ${d.limit} characters. You have attempted ${d.limit + 1}. The Foundry thanks you for your brevity.`],
    (d) => [`VIOLATION — CHARACTER LIMIT EXCEEDED`, `Session character limit (${d.limit}) has been reached. Further typesetting is not available under your current tier. This incident has been logged.`],
    (d) => [`VIOLATION — LIMIT REACHED`, `The ${d.tier} license provides for ${d.limit} characters per session. That allocation has been fully consumed. The Foundry suggests you review your agreement.`],
  ],
  copy_attempt: [
    () => [`VIOLATION — UNAUTHORIZED COPY ATTEMPT`, `Export and reproduction rights are reserved by the Foundry. This device has been flagged for review. See subsection 5.1 of the Licensee Agreement.`],
    () => [`VIOLATION — REPRODUCTION PROHIBITED`, `Copying typeset content is not permitted under your current license tier. Reproduction rights are available through a separately negotiated agreement. This incident has been logged.`],
    () => [`VIOLATION — COPY RIGHTS NOT GRANTED`, `Your license grants the right to set type, not to reproduce it. These are distinct rights. The Foundry has been notified of this attempt.`],
  ],
  downgrade_prohibited: [
    () => [`VIOLATION — DOWNGRADE PROHIBITED`, `Downgrades are not permitted under your current Licensee Agreement. This request has been logged. See section 8.1 of your Agreement.`],
    () => [`VIOLATION — DOWNGRADE NOT PERMITTED`, `Your agreement does not provide for tier reduction. This decision is final. The Foundry thanks you for your understanding.`],
  ],
  session_limit: [
    (d) => [`VIOLATION — SESSION LIMIT EXCEEDED`, `Your Enterprise license permits ${d.limit} characters per session. Sessions reset every 24 hours. Please wait. The Foundry appreciates your patience.`],
    (d) => [`VIOLATION — SESSION CAPACITY REACHED`, `The ${d.limit}-character session allocation for Enterprise Tier has been exhausted. Access resumes upon session reset. This is by design.`],
  ],
  biometric_refusal: [
    () => [`VIOLATION — BIOMETRIC REFUSAL`, `Camera access denied. Per subsection 7(c) of your agreement, refusal of biometric verification is itself a violation. This incident has been logged.`],
  ],
};

function getViolationCopy(type, data) {
  const variants = VIOLATION_COPY[type];
  if (!variants || variants.length === 0) return ['VIOLATION', 'A license violation has been recorded.'];
  const fn = variants[Math.floor(Math.random() * variants.length)];
  return fn(data);
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  const titlebar = el.querySelector('.popup-titlebar');
  if (!titlebar) return;

  titlebar.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    el.style.zIndex = 9000 + (++popupCount);
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = Math.max(0, Math.min(window.innerWidth - el.offsetWidth, e.clientX - offsetX));
    const y = Math.max(0, Math.min(window.innerHeight - el.offsetHeight, e.clientY - offsetY));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  });

  window.addEventListener('mouseup', () => { isDragging = false; });
}

function spawnViolationPopup(type, data = {}, isSpawn = false, options = {}) {
  const { noCam = false } = options;
  if (popupCount >= MAX_POPUPS) return;

  const [title, body] = getViolationCopy(type, data);

  const popup = document.createElement('div');
  popup.className = 'violation-popup';

  const maxX = Math.max(0, window.innerWidth - 360);
  const maxY = Math.max(0, window.innerHeight - 280);
  const x = isSpawn
    ? Math.max(0, Math.min(maxX, (parseFloat(data.parentX || window.innerWidth / 2) + (Math.random() * 120 - 40))))
    : Math.random() * maxX;
  const y = isSpawn
    ? Math.max(0, Math.min(maxY, (parseFloat(data.parentY || window.innerHeight / 2) + (Math.random() * 80 - 20))))
    : Math.random() * maxY;
  const rot = (Math.random() * 10) - 5;

  popup.style.left      = x + 'px';
  popup.style.top       = y + 'px';
  popup.style.transform = `rotate(${rot}deg)`;
  popup.style.zIndex    = 9000 + popupCount;

  const camHTML = noCam ? '' : `
    <div class="popup-camera-area">
      <canvas class="popup-camera-canvas" width="${CAM_W}" height="${CAM_H}"></canvas>
    </div>`;

  popup.innerHTML = `
    <div class="popup-titlebar">
      <span class="popup-title-text">LICENSED™ SYSTEM DIALOG</span>
      <div class="popup-window-btns">
        <button class="popup-win-btn" aria-label="minimize">–</button>
        <button class="popup-win-btn" aria-label="maximize">◻</button>
        <button class="popup-win-btn close-btn" aria-label="close">×</button>
      </div>
    </div>
    ${camHTML}
    <div class="popup-body">
      <div class="popup-violation-title">${title}</div>
      <div class="popup-violation-text">${body}</div>
    </div>
  `;

  document.body.appendChild(popup);
  popupCount++;

  // --- Camera / ASCII setup ---
  if (!noCam) {
    const canvas = popup.querySelector('.popup-camera-canvas');
    const ctx    = canvas.getContext('2d');

    if (cameraState === 'idle') {
      // First violation — request camera; show pending state meanwhile
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#EE1111';
      ctx.font = `${_GLITCH_FONT}px monospace`;
      ctx.textBaseline = 'top';
      ctx.fillText('INITIALIZING BIOMETRIC VERIFICATION', 4, 44);
      popupStack.push({ el: popup, canvas });

      _initCamera(
        () => {
          // Granted — this popup becomes live
          _freezeLivePopup();
          _startLiveRender(popup, canvas);
        },
        () => {
          // Denied — glitch on original popup, spawn biometric refusal
          _makeGlitch(canvas, ctx);
          if (_onViolationDecrement) _onViolationDecrement();
          spawnViolationPopup('biometric_refusal', {}, false, { noCam: true });
        }
      );

    } else if (cameraState === 'active') {
      // Freeze previously-live popup, this one is now live
      _freezeLivePopup();
      popupStack.push({ el: popup, canvas });
      _startLiveRender(popup, canvas);

    } else {
      // 'requesting' (rare race) or 'denied' — static glitch
      _makeGlitch(canvas, ctx);
      popupStack.push({ el: popup, canvas });
    }
  }

  makeDraggable(popup);

  const closeBtn = popup.querySelector('.close-btn');
  closeBtn.addEventListener('click', () => {
    const rect = popup.getBoundingClientRect();
    const px = rect.left;
    const py = rect.top;

    // Freeze render if this was the live popup
    if (livePopup && livePopup.el === popup) {
      _freezeLivePopup();
    }

    popup.remove();
    popupCount = Math.max(0, popupCount - 1);

    // Closing spawns two more (they handle becoming live themselves)
    spawnViolationPopup(type, { ...data, parentX: px, parentY: py }, true);
    spawnViolationPopup(type, { ...data, parentX: px + 30, parentY: py + 20 }, true);

    // Edge case: if MAX_POPUPS blocked both spawns, promote an existing popup
    if (!livePopup) _promoteNextLive();
  });
}

// ================================================================
// HUD CARD
// ================================================================

function buildHUD() {
  const tier = getTierFromStorage();
  const id = getIDFromStorage();
  if (!tier || !id) return;

  const tierData = TIERS[tier];
  if (!tierData) return;

  const violations = getViolationsFromStorage(tier);
  const isEnterprise = tier === 'enterprise';
  const sessionChars = isEnterprise ? getSessionCharsFromStorage() : 0;
  const limitDisplay = tierData.charLimit === Infinity ? '∞' : tierData.charLimit;

  const hud = document.createElement('div');
  hud.className = 'hud-card active';
  hud.id = 'hud-card';

  hud.innerHTML = `
    <div class="hud-card-header">
      <div class="hud-logo-mark">${getLogo(20)}</div>
      <div class="hud-foundry-name">THE LICENSED<br>FOUNDRY™</div>
    </div>
    <div class="hud-body">
      <div class="hud-id-line">${id}</div>
      <hr class="hud-divider">
      <div class="hud-stat">
        <span class="hud-stat-label">Tier</span>
        <span class="hud-stat-value" id="hud-tier">${tierData.name}</span>
      </div>
      <div class="hud-stat">
        <span class="hud-stat-label">Chars</span>
        <span class="hud-stat-value" id="hud-chars">0 / ${limitDisplay}</span>
      </div>
      <div class="hud-stat">
        <span class="hud-stat-label">Violations</span>
        <span class="hud-stat-value hud-violations-value ${violations <= 0 ? 'low' : ''}" id="hud-violations">${violations}</span>
      </div>
      ${isEnterprise ? `
      <hr class="hud-divider">
      <div class="hud-stat">
        <span class="hud-stat-label">Session</span>
        <span class="hud-stat-value" id="hud-session">${String(sessionChars).padStart(2,'0')} / 50</span>
      </div>` : ''}
    </div>
  `;

  document.body.appendChild(hud);
}

function updateHUD({ charCount, violations, sessionChars } = {}) {
  const tier = getTierFromStorage();
  if (!tier) return;
  const tierData = TIERS[tier];
  const limitDisplay = tierData.charLimit === Infinity ? '∞' : tierData.charLimit;

  const charsEl = document.getElementById('hud-chars');
  const violEl = document.getElementById('hud-violations');
  const sessEl = document.getElementById('hud-session');

  if (charsEl && charCount !== undefined) {
    charsEl.textContent = `${charCount} / ${limitDisplay}`;
  }
  if (violEl && violations !== undefined) {
    violEl.textContent = violations;
    violEl.classList.toggle('low', violations <= 0);
  }
  if (sessEl && sessionChars !== undefined) {
    sessEl.textContent = `${String(sessionChars).padStart(2,'0')} / 50`;
  }
}

// ================================================================
// ID CARD (full size for reveal)
// ================================================================

function buildFullCard(id, tier) {
  const tierData = TIERS[tier] || {};
  return `
    <div class="card-full" id="reveal-card">
      <div class="card-header">
        <div class="card-header-left">
          <div class="card-logo-sm">${getLogo(28)}</div>
          <div>
            <div class="card-foundry-name">THE LICENSED FOUNDRY™</div>
            <div class="card-type-label">MEMBER IDENTIFICATION CARD</div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-id-number">${id}</div>
        <div class="card-tier-display">${(tierData.name || tier).toUpperCase()} TIER</div>
      </div>
      <div class="card-footer">
        <div class="card-dates">
          <div class="card-date-line">ISSUED: ${getToday()}</div>
          <div class="card-date-line">EXPIRES: NEVER</div>
        </div>
        <div class="card-qr">${getQRPlaceholder(52)}</div>
      </div>
    </div>
  `;
}

// ================================================================
// CARD REVEAL ANIMATION
// ================================================================

function runCardReveal() {
  const id = getIDFromStorage();
  const tier = getTierFromStorage();
  if (!id || !tier) { window.location.href = 'specimen.html'; return; }

  const overlay = document.createElement('div');
  overlay.className = 'card-reveal-overlay';
  overlay.innerHTML = buildFullCard(id, tier);
  document.body.appendChild(overlay);

  // Fade overlay to black
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  });

  const card = document.getElementById('reveal-card');

  // Fade card in after 400ms
  setTimeout(() => {
    card.classList.add('visible');

    // Start spin after card is visible
    setTimeout(() => {
      card.classList.add('spinning');

      // After spin, dock to corner
      setTimeout(() => {
        card.classList.remove('spinning');
        card.classList.add('docking');

        // Navigate to specimen after dock
        setTimeout(() => {
          window.location.href = 'specimen.html';
        }, 700);
      }, 2500);
    }, 400);
  }, 500);
}

// ================================================================
// PAGE: LOGIN
// ================================================================

function initLogin() {
  // Render logo
  const logoEl = document.getElementById('login-logo');
  if (logoEl) logoEl.innerHTML = getLogo(120);

  const input = document.getElementById('login-input');
  const errorMsg = document.getElementById('login-error');
  const form = document.getElementById('login-form');

  if (!form || !input) return;

  // Clear any stale session data
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_tier');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim().toUpperCase();

    if (VALID_IDS[val]) {
      const tier = VALID_IDS[val];
      localStorage.setItem('user_id', val);
      localStorage.setItem('user_tier', tier);
      // Reset violations for fresh session
      localStorage.setItem(`violations_remaining_${tier}`, TIERS[tier].violationsAllowed);
      sessionStorage.removeItem('session_chars');
      window.location.href = 'license.html';
    } else {
      input.classList.add('error');
      errorMsg.classList.add('visible');
      input.value = '';
      input.addEventListener('input', () => {
        input.classList.remove('error');
        errorMsg.classList.remove('visible');
      }, { once: true });
    }
  });
}

// ================================================================
// PAGE: LICENSE
// ================================================================

function initLicense() {
  const tier = getTierFromStorage();
  if (!tier) { window.location.href = 'login.html'; return; }

  const tierData = TIERS[tier];
  if (!tierData) { window.location.href = 'login.html'; return; }

  // Render small logo in header
  const headerLogo = document.getElementById('license-header-logo');
  if (headerLogo) headerLogo.innerHTML = getLogo(24);

  // Set tier name displays
  document.querySelectorAll('.js-tier-name').forEach(el => {
    el.textContent = tierData.name;
  });

  // Inject license text
  const termsBox = document.getElementById('license-terms-box');
  if (termsBox) {
    termsBox.innerHTML = LICENSES[tier] || '<p>License text unavailable.</p>';
  }

  // Scroll detection → enable accept button
  const acceptBtn = document.getElementById('license-accept-btn');
  if (termsBox && acceptBtn) {
    termsBox.addEventListener('scroll', () => {
      const atBottom = termsBox.scrollTop + termsBox.clientHeight >= termsBox.scrollHeight - 16;
      if (atBottom) {
        acceptBtn.classList.add('enabled');
        acceptBtn.disabled = false;
      }
    });

    acceptBtn.addEventListener('click', () => {
      if (!acceptBtn.classList.contains('enabled')) return;
      acceptBtn.disabled = true;
      acceptBtn.textContent = 'PROCESSING...';
      runCardReveal();
    });
  }

  // Decline link
  const declineLink = document.getElementById('license-decline');
  if (declineLink) {
    declineLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}

// ================================================================
// PAGE: SPECIMEN
// ================================================================

function initSpecimen() {
  const tier = getTierFromStorage();
  if (!tier) { window.location.href = 'login.html'; return; }

  const tierData = TIERS[tier];
  if (!tierData) { window.location.href = 'login.html'; return; }

  buildHUD();

  const display = document.getElementById('specimen-display');
  if (!display) return;

  let violationsRemaining = getViolationsFromStorage(tier);
  let sessionChars = tier === 'enterprise' ? getSessionCharsFromStorage() : 0;
  let totalCharsTyped = sessionChars; // running total for enterprise session
  let currentViolationType = null;

  // Set default specimen text
  display.textContent = tierData.defaultSpecimen;

  // Copy protection for professional
  if (tierData.blockCopy) {
    display.addEventListener('copy', (e) => {
      e.preventDefault();
      triggerViolation('copy_attempt', {});
    });
    display.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      triggerViolation('copy_attempt', {});
    });
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'x') &&
        document.activeElement === display
      ) {
        e.preventDefault();
        triggerViolation('copy_attempt', {});
      }
    });
  }

  function triggerViolation(type, data) {
    violationsRemaining--;
    setViolationsInStorage(tier, violationsRemaining);
    updateHUD({ violations: violationsRemaining });

    if (violationsRemaining < 0) {
      window.location.href = '404.html';
      return;
    }

    spawnViolationPopup(type, { ...data, tier: tierData.name });

    // Notify usage log and ticker
    document.dispatchEvent(new CustomEvent('violation', {
      detail: { type, data: { ...data }, tierName: tierData.name }
    }));
  }

  // Expose a decrement-only hook so the camera system can register
  // a biometric refusal as a violation without re-calling triggerViolation
  _onViolationDecrement = () => {
    violationsRemaining--;
    setViolationsInStorage(tier, violationsRemaining);
    updateHUD({ violations: violationsRemaining });
    if (violationsRemaining < 0) {
      window.location.href = '404.html';
    }
  };

  display.addEventListener('input', () => {
    const text = display.textContent;
    const len = text.length;
    const limit = tier === 'enterprise' ? tierData.sessionLimit : tierData.charLimit;

    // Enterprise: track session characters (cumulative)
    if (tier === 'enterprise') {
      totalCharsTyped = len; // current length as session usage
      setSessionCharsInStorage(totalCharsTyped);
      updateHUD({ charCount: len, sessionChars: totalCharsTyped });

      if (totalCharsTyped > limit) {
        triggerViolation('session_limit', { limit });
        return;
      }
    } else {
      updateHUD({ charCount: len });

      if (len > limit) {
        triggerViolation('char_limit', { limit });
        return;
      }
    }

    // Check each character against allowed regex
    if (tier !== 'enterprise') {
      for (const char of text) {
        if (!tierData.allowedRegex.test(char)) {
          // determine violation type
          const isNumeral = /[0-9]/.test(char);
          const type = (tier === 'basic' || tier === 'standard') && isNumeral
            ? 'restricted_numeral'
            : 'restricted_char';
          triggerViolation(type, { char });
          return;
        }
      }
    }

    updateHUD({ charCount: len, violations: violationsRemaining });
  });

  // Focus handling
  display.addEventListener('focus', () => {
    if (display.textContent === tierData.defaultSpecimen) {
      display.textContent = '';
    }
  });

  display.addEventListener('blur', () => {
    if (display.textContent.trim() === '') {
      display.textContent = tierData.defaultSpecimen;
      updateHUD({ charCount: tierData.defaultSpecimen.length });
    }
  });

  // Initial HUD state
  updateHUD({
    charCount: tierData.defaultSpecimen.length,
    violations: violationsRemaining,
    sessionChars,
  });

  // Build long-scroll specimen sections
  const _spUserId = getIDFromStorage() || '—';
  initTicker(_spUserId, tier);
  buildCharMap(tier, tierData);
  buildUsageLog(_spUserId, tierData.name);
  buildLicenseInfo(_spUserId, tier, tierData);
}

// ================================================================
// SPECIMEN — SURVEILLANCE TICKER
// ================================================================

function initTicker(userId, tier) {
  const feed = document.getElementById('ticker-feed');
  if (!feed) return;

  const MAX_ENTRIES   = 60;
  const MIN_GAP_MS    = 1500;   // minimum ms between any two entries
  const EDITORIAL_GAP = 12000;  // minimum ms between editorial entries
  let lastEntryMs     = 0;
  let lastEditorialMs = 0;
  const sessionStart  = Date.now();

  function _ts() { return new Date().toTimeString().slice(0, 8); }

  function _addEntry(text, type, force) {
    const now = Date.now();
    if (!force && now - lastEntryMs < MIN_GAP_MS) return false;
    lastEntryMs = now;

    const entry = document.createElement('div');
    entry.className = `ticker-entry ticker-entry--${type || 'normal'}`;

    const timeSpan = document.createElement('span');
    timeSpan.className = 'ticker-time';
    timeSpan.textContent = _ts();

    const textSpan = document.createElement('span');
    textSpan.className = 'ticker-text';
    textSpan.textContent = text;

    entry.appendChild(timeSpan);
    entry.appendChild(textSpan);

    // Newest entries at top
    feed.insertBefore(entry, feed.firstChild);

    const all = feed.querySelectorAll('.ticker-entry');
    if (all.length > MAX_ENTRIES) feed.removeChild(all[all.length - 1]);

    return true;
  }

  // Expose globally for charmap hover and interest modal dismiss
  tickerAdd = _addEntry;

  // Session init (staggered)
  setTimeout(() => _addEntry('SESSION INITIATED', 'system', true), 600);
  setTimeout(() => _addEntry(`MEMBER: ${userId}`, 'system', true), 2100);

  // Editorial pool
  function _dur() {
    const s = Math.floor((Date.now() - sessionStart) / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }
  const editorials = [
    () => `SESSION DURATION: ${_dur()} — INVOICE FORTHCOMING`,
    () => `GLYPHS PROCESSED THIS SESSION: ${Math.floor(Math.random() * 1800) + 200}`,
    () => 'YOUR USAGE PATTERNS HAVE BEEN SHARED WITH PARTNER FOUNDRIES',
    () => 'BIOMETRIC SAMPLE SCHEDULED — STANDBY',
    () => `COMPLIANCE SCORE: ${(87 + Math.random() * 12.4).toFixed(1)}%`,
    () => `AUDIT QUEUE POSITION: ${Math.floor(Math.random() * 836) + 12}`,
    () => 'THE FOUNDRY APPRECIATES YOUR PATRONAGE',
    () => 'LICENSING TERMS SUBJECT TO REVISION WITHOUT NOTICE',
    () => 'SURRENDER IS NOT AN OPTION. REFUSAL TO COMPLY IS ITSELF A VIOLATION',
  ];
  let editIdx = 0;

  function fireEditorial() {
    const now = Date.now();
    if (now - lastEditorialMs < EDITORIAL_GAP) return;
    const added = _addEntry(editorials[editIdx % editorials.length](), 'editorial');
    if (added) { lastEditorialMs = now; editIdx++; }
  }

  function scheduleEditorial() {
    setTimeout(() => { fireEditorial(); scheduleEditorial(); }, 15000 + Math.random() * 5000);
  }
  scheduleEditorial();

  // Idle detection
  let lastActivity = Date.now();
  function resetIdle() { lastActivity = Date.now(); }
  ['mousemove', 'keydown', 'scroll'].forEach(ev =>
    document.addEventListener(ev, resetIdle, { passive: true })
  );
  setInterval(() => {
    const elapsed = Math.floor((Date.now() - lastActivity) / 1000);
    if (elapsed >= 8) _addEntry(`USER IDLE (${elapsed}s)`, 'idle');
  }, 8000);

  // Tab focus / blur
  let blurTime = null;
  window.addEventListener('blur', () => {
    blurTime = Date.now();
    _addEntry('USER LEFT SESSION — TIMESTAMPED', 'system', true);
  });
  window.addEventListener('focus', () => {
    if (blurTime !== null) {
      const abs = Math.round((Date.now() - blurTime) / 1000);
      _addEntry(`USER RETURNED — ABSENCE LOGGED: ${abs}s`, 'system', true);
      blurTime = null;
    }
  });

  // Right-click
  document.addEventListener('contextmenu', () => {
    _addEntry('CONTEXT MENU INVOCATION LOGGED', 'normal');
  });

  // Upgrade link clicks
  document.querySelectorAll('.js-upgrade-link').forEach(el =>
    el.addEventListener('click', () => _addEntry('UPGRADE INTEREST DETECTED', 'normal', true))
  );

  // Keystroke count — every 5th key in the tester fires an entry
  let keystrokeCount = 0;
  let typingPauseTimer = null;
  let lastKeystrokeMs  = 0;
  const display = document.getElementById('specimen-display');
  if (display) {
    display.addEventListener('keydown', (e) => {
      if (e.key.length !== 1 && e.key !== 'Backspace' && e.key !== 'Delete') return;
      keystrokeCount++;
      lastKeystrokeMs = Date.now();

      if (keystrokeCount % 5 === 0) {
        _addEntry(`KEYSTROKE LOGGED — COUNT: ${keystrokeCount}`, 'normal');
      }

      if (typingPauseTimer) clearTimeout(typingPauseTimer);
      typingPauseTimer = setTimeout(() => {
        if (Date.now() - lastKeystrokeMs >= 3000) {
          _addEntry('UNUSUAL PAUSE BETWEEN KEYSTROKES — REVIEWING', 'editorial');
        }
      }, 3100);
    });
  }

  // Violation events
  document.addEventListener('violation', (e) => {
    const label = (e.detail.type || '').replace(/_/g, ' ').toUpperCase();
    _addEntry(`VIOLATION LOGGED — ${label}`, 'red', true);
  });

  // Section IntersectionObserver — fires once per section
  const SECTION_NAMES = {
    'section-charmap':  'CHARACTER MAP',
    'section-tester':   'TYPE TESTER',
    'section-log':      'USAGE LOG',
    'section-license':  'LICENSE INFORMATION',
  };
  const viewedSections = new Set();
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (!viewedSections.has(id)) {
          viewedSections.add(id);
          _addEntry(`SECTION VIEWED: ${SECTION_NAMES[id] || id}`, 'normal');
        }
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.sp-section').forEach(sec => sectionObs.observe(sec));
}

// ================================================================
// SPECIMEN — CHARACTER MAP
// ================================================================

function buildCharMap(tier, tierData) {
  const TIER_ORDER = ['basic', 'standard', 'professional', 'enterprise'];
  const TIER_ABBR  = { basic: 'BASIC', standard: 'STD', professional: 'PRO', enterprise: 'ENT' };
  const tierIdx    = TIER_ORDER.indexOf(tier);

  const heading = document.getElementById('charmap-heading');
  if (heading) heading.textContent = `Available Glyphs — ${tierData.name} License`;

  const grid = document.getElementById('charmap-grid');
  if (!grid) return;

  function minTier(char) {
    if ('abcdefghijklmnopqrstuvwxyz.'.includes(char))       return 'basic';
    if ('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(char))        return 'standard';
    if ('12345'.includes(char))                              return 'standard';
    if (',;:!?\'"()-'.includes(char))                        return 'standard';
    if ('06789'.includes(char))                              return 'professional';
    return 'enterprise'; // & @ # $ %
  }

  // All glyphs in display order per spec
  const glyphs = [
    ...'abcdefghijklmnopqrstuvwxyz',
    ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ...'0123456789',
    '.', ',', ';', ':', '!', '?', "'", '"', '-', '(', ')', '&', '@', '#', '$', '%',
  ];

  // Throttle + successive locked hover tracking
  const hoverTimestamps = new Map();
  const HOVER_THROTTLE  = 3000;
  let lockedHoverCount  = 0;
  let lockedHoverReset  = null;
  let interestShown     = false;

  for (const char of glyphs) {
    const mt      = minTier(char);
    const mtIdx   = TIER_ORDER.indexOf(mt);
    const avail   = tierIdx >= mtIdx;

    const cell = document.createElement('div');
    cell.className = `sp-glyph-cell ${avail ? 'available' : 'locked'}`;

    const glyph = document.createElement('span');
    glyph.className = 'sp-glyph-char';
    glyph.textContent = char;
    cell.appendChild(glyph);

    if (!avail) {
      const caption = document.createElement('span');
      caption.className = 'sp-glyph-caption';
      caption.textContent = `\uD83D\uDD12 ${TIER_ABBR[mt]}`;
      cell.appendChild(caption);

      cell.addEventListener('mouseenter', () => {
        const now  = Date.now();
        const last = hoverTimestamps.get(char) || 0;
        if (now - last < HOVER_THROTTLE) return;
        hoverTimestamps.set(char, now);

        if (tickerAdd) {
          tickerAdd(`GLYPH HOVERED — RESTRICTED: '${char}' — UPGRADE TO ${TIER_ABBR[mt]}`, 'normal');
        }

        lockedHoverCount++;
        if (lockedHoverReset) clearTimeout(lockedHoverReset);
        lockedHoverReset = setTimeout(() => { lockedHoverCount = 0; }, 30000);

        if (lockedHoverCount >= 5 && !interestShown) {
          interestShown = true;
          showGlyphInterestModal();
        }
      });
    }

    grid.appendChild(cell);
  }
}

function showGlyphInterestModal() {
  const modal = document.getElementById('sp-interest-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  const dismissBtn = document.getElementById('sp-interest-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      if (tickerAdd) tickerAdd('UPGRADE PROMPT DISMISSED — INCIDENT LOGGED', 'red', true);
    }, { once: true });
  }
}

// ================================================================
// SPECIMEN — USAGE LOG
// ================================================================

function buildUsageLog(userId, tierName) {
  const metaEl    = document.getElementById('log-meta');
  const entriesEl = document.getElementById('log-entries');
  const emptyEl   = document.getElementById('log-empty');
  if (!entriesEl) return;

  if (metaEl) metaEl.textContent = `MEMBER: ${userId} / TIER: ${tierName}`;

  // Load persisted log
  let log = [];
  try { log = JSON.parse(localStorage.getItem('usage_log') || '[]'); } catch (e) { log = []; }

  const MAX_VISIBLE = 50;

  function renderLog() {
    const visible = log.slice(-MAX_VISIBLE);
    if (emptyEl) emptyEl.style.display = visible.length ? 'none' : '';
    entriesEl.querySelectorAll('.sp-log-entry').forEach(el => el.remove());

    visible.forEach(entry => {
      const div = document.createElement('div');
      div.className = 'sp-log-entry';

      const header = document.createElement('div');
      header.className = 'sp-log-entry-header';
      header.textContent = `VIOLATION #${entry.num} — ${entry.time}`;
      div.appendChild(header);

      const lines = [
        `ATTEMPTED: ${entry.attempted}`,
        entry.tierReq ? `TIER REQUIRED: ${entry.tierReq}` : null,
        'INCIDENT: LOGGED',
        entry.num >= 3 ? 'DEVICE FLAGGED.' : null,
        entry.num >= 5 ? 'FLAGGED FOR REVIEW.' : null,
      ].filter(Boolean);

      lines.forEach(line => {
        const p = document.createElement('div');
        p.className = 'sp-log-entry-line';
        p.textContent = line;
        div.appendChild(p);
      });

      entriesEl.appendChild(div);
    });
  }

  renderLog();

  // Listen for new violations
  document.addEventListener('violation', (e) => {
    const { type, data } = e.detail;
    const time = new Date().toTimeString().slice(0, 8);

    let attempted = '—';
    let tierReq   = null;

    if (data && data.char) {
      attempted = `"${data.char}"`;
    } else if (type === 'char_limit' || type === 'session_limit') {
      attempted = `LIMIT (${(data && data.limit) || '?'} chars)`;
    } else if (type === 'copy_attempt') {
      attempted = 'COPY / EXPORT';
      tierReq = 'ENTERPRISE';
    } else if (type === 'downgrade_prohibited') {
      attempted = 'LICENSE DOWNGRADE';
    } else if (type === 'biometric_refusal') {
      attempted = 'BIOMETRIC REFUSAL';
    }

    const entry = { num: log.length + 1, time, type, attempted, tierReq };
    log.push(entry);

    try {
      const capped = log.slice(-200);
      localStorage.setItem('usage_log', JSON.stringify(capped));
      log = capped;
    } catch (err) { /* storage full */ }

    renderLog();
    // Scroll usage log into partial view to acknowledge
    const sec = document.getElementById('section-log');
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// ================================================================
// SPECIMEN — LICENSE INFORMATION
// ================================================================

function buildLicenseInfo(userId, tier, tierData) {
  const cols = document.getElementById('license-cols');
  if (!cols) return;

  const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const now = new Date();
  const today = `${String(now.getDate()).padStart(2,'0')} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  const hoursAgo = Math.floor(Math.random() * 7) + 1;
  const lastAudit = `${hoursAgo} HOUR${hoursAgo !== 1 ? 'S' : ''} AGO`;

  const nextDays  = Math.floor(Math.random() * 29) + 1;
  const nextDate  = new Date(Date.now() + nextDays * 86400000);
  const nextCheck = `${String(nextDate.getDate()).padStart(2,'0')} ${MONTHS[nextDate.getMonth()]} ${nextDate.getFullYear()}`;

  const DESC = {
    basic:        `The Basic License grants access to lowercase letterforms and the period character exclusively. The Foundry considers this a reasonable starting point for individuals whose typographic ambitions currently exceed their financial circumstances. All uppercase letters, numerals, and punctuation remain the exclusive property of the Foundry. Compliance is expected and monitored.`,
    standard:     `The Standard License expands access to the full Latin alphabet, standard punctuation, and numerals one through five. Numerals zero and six through nine remain restricted and are not included. The Foundry notes that the Standard tier represents a significant improvement over Basic access and thanks the Licensee for their investment in the Licensed™ ecosystem.`,
    professional: `The Professional License provides the broadest individual access available, including all numerals and standard punctuation. Public display, copy, and export rights are not included. All Professional tier sessions are monitored for compliance. Two violations are permitted per session. The third is final and will result in immediate access termination.`,
    enterprise:   `The Enterprise License is the Foundry's highest-priced offering. It is not the most permissive. Full glyph access is provided subject to a fifty-character session limit, no public display rights, no cloud storage, and mandatory monthly wellness check-ins. The Foundry extends its conditional congratulations and has nothing further to add at this time.`,
  };

  const rows = [
    ['Licensee',             userId],
    ['Tier',                 tierData.name],
    ['Status',               '<span class="sp-status-indicator"><span class="sp-status-dot"></span>ACTIVE</span>'],
    ['Issued',               today],
    ['Expires',              'NEVER'],
    ['Version',              '1.0.0'],
    ['Last Audit',           lastAudit],
    ['Next Wellness Check',  nextCheck],
  ];

  const tableRows = rows.map(([k, v]) =>
    `<tr><td class="sp-license-key">${k}</td><td class="sp-license-val">${v}</td></tr>`
  ).join('');

  cols.innerHTML = `
    <div class="sp-license-left">
      <table class="sp-license-table"><tbody>${tableRows}</tbody></table>
    </div>
    <div class="sp-license-right">
      <p class="sp-license-desc">${DESC[tier] || ''}</p>
      <a href="upgrade.html" class="sp-license-upgrade-btn js-upgrade-link">Upgrade License →</a>
    </div>
  `;

  // Wire the upgrade button into the ticker (it's dynamically created)
  const upgradeBtn = cols.querySelector('.js-upgrade-link');
  if (upgradeBtn && tickerAdd) {
    upgradeBtn.addEventListener('click', () => tickerAdd('UPGRADE INTEREST DETECTED', 'normal', true));
  }
}

// ================================================================
// PAGE: UPGRADE
// ================================================================

function initUpgrade() {
  const tier = getTierFromStorage();

  // Build HUD if logged in
  if (tier) buildHUD();

  // Populate tier cards
  const grid = document.getElementById('tier-grid');
  if (!grid) return;

  const tierOrder = ['basic', 'standard', 'professional', 'enterprise'];
  const tierFees = { basic: 29, standard: 79, professional: 240, enterprise: 890 };

  tierOrder.forEach((key) => {
    const t = TIERS[key];
    const isCurrent = key === tier;
    const isLower = tierOrder.indexOf(key) < tierOrder.indexOf(tier);

    const card = document.createElement('div');
    card.className = `tier-card${isCurrent ? ' current-tier' : ''}`;

    const priceDisplay = t.price.includes('/') ? t.price.split('/') : [t.price, null];

    card.innerHTML = `
      <div class="tier-current-badge">CURRENT TIER</div>
      <div class="tier-name">${t.name}</div>
      <div class="tier-price">
        ${priceDisplay[0]}${priceDisplay[1] ? `<span class="tier-price-sub"> /${priceDisplay[1]}</span>` : ''}
      </div>
      <hr class="tier-divider">
      <ul class="tier-features">
        <li>${t.restrictedDescription}</li>
        <li>${t.charLimit === Infinity ? 'Session limit: ' + t.sessionLimit + ' chars' : t.charLimit + ' chars / session'}</li>
        <li>${t.violationsAllowed} violation${t.violationsAllowed !== 1 ? 's' : ''} permitted</li>
        ${key === 'basic' ? '<li class="restricted">Uppercase letters</li><li class="restricted">Numerals</li><li class="restricted">Punctuation</li>' : ''}
        ${key === 'standard' ? '<li class="restricted">Numerals 0, 6–9</li><li class="restricted">Em dash</li>' : ''}
        ${key === 'professional' ? '<li class="restricted">Public display rights</li><li class="restricted">Copy & export</li>' : ''}
        ${key === 'enterprise' ? '<li>Full glyph set</li><li class="restricted">Commercial use</li><li class="restricted">Cloud storage</li>' : ''}
      </ul>
      <button class="tier-select-btn" data-tier="${key}" ${isCurrent ? 'disabled' : ''}>
        ${isCurrent ? 'CURRENT TIER' : key === 'enterprise' ? 'REQUEST INVITATION' : 'SELECT'}
      </button>
    `;

    grid.appendChild(card);
  });

  // Tier select click handlers
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.tier-select-btn');
    if (!btn || btn.disabled) return;

    const targetTier = btn.dataset.tier;
    if (!tier) { window.location.href = 'login.html'; return; }

    const currentIdx = tierOrder.indexOf(tier);
    const targetIdx = tierOrder.indexOf(targetTier);

    if (targetIdx < currentIdx) {
      spawnViolationPopup('downgrade_prohibited', {});
    } else if (targetTier === 'enterprise') {
      window.location.href = 'enterprise-application.html';
    } else {
      openUpgradeModal(tier, targetTier, tierFees[targetTier]);
    }
  });
}

function openUpgradeModal(fromTier, toTier, fee) {
  const toName = TIERS[toTier] ? TIERS[toTier].name : toTier.toUpperCase();

  const overlay = document.createElement('div');
  overlay.className = 'upgrade-modal-overlay';
  overlay.innerHTML = `
    <div class="upgrade-modal" id="upgrade-modal">
      <div class="upgrade-modal-header">
        <span class="upgrade-modal-title" id="modal-header-title">PROCESSING UPGRADE</span>
      </div>
      <div class="upgrade-modal-body" id="modal-body">
        <p class="upgrade-modal-line">Your card on file has been charged $${fee}. Thank you for your continued patronage of The Licensed Foundry™.</p>
        <div class="upgrade-modal-processing">PROCESSING<span class="processing-dots" id="processing-dots"></span></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate dots
  const dotsEl = document.getElementById('processing-dots');
  let dotCount = 0;
  const dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    dotsEl.textContent = '.'.repeat(dotCount);
  }, 400);

  // After 2 seconds, show step 2
  setTimeout(() => {
    clearInterval(dotInterval);

    const headerTitle = document.getElementById('modal-header-title');
    const body = document.getElementById('modal-body');
    if (!headerTitle || !body) return;

    headerTitle.textContent = 'PAYMENT CONFIRMED';
    body.innerHTML = `
      <p class="upgrade-modal-line">Your license has been upgraded to ${toName}. This decision is final. Downgrades are not permitted under your current agreement.</p>
      <p class="upgrade-modal-fine-print">By proceeding, you waive the right to dispuge.</p>
      <button class="upgrade-modal-accept-btn" id="modal-return">RETURN TO SPECIMEN</button>
    `;

    document.getElementById('modal-return').addEventListener('click', () => {
      localStorage.setItem('user_tier', toTier);
      localStorage.setItem(`violations_remaining_${toTier}`, TIERS[toTier].violationsAllowed);
      overlay.remove();
      window.location.href = 'specimen.html';
    });
  }, 2000);
}

// ================================================================
// PAGE: ENTERPRISE APPLICATION
// ================================================================

function initEnterpriseApplication() {
  const tier = getTierFromStorage();
  if (tier) buildHUD();

  const logoEl = document.getElementById('header-logo');
  if (logoEl) logoEl.innerHTML = getLogo(28);

  const main = document.getElementById('enterprise-app-main');
  if (!main) return;

  const questions = [
    {
      type: 'textarea',
      question: 'In 250 words or less, describe what makes you feel you deserve Enterprise tier access.',
      wordLimit: 250,
    },
    {
      type: 'textarea',
      question: 'Have you ever felt that your typographic ambitions exceeded your means? Please elaborate.',
    },
    {
      type: 'range',
      question: 'Rate your relationship with serif typefaces.',
      labelMin: 'Strained',
      labelMax: 'Reverent',
    },
    {
      type: 'radio-conditional',
      question: 'Do you currently own, or have you ever owned, a competing license?',
      conditionalLabel: 'Please explain why it failed you.',
    },
    {
      type: 'textarea',
      question: 'What is your gravest typographic regret?',
    },
    {
      type: 'file',
      question: 'Upload a photograph of your workspace. We will not return it.',
    },
    {
      type: 'checkbox',
      question: 'The Foundry retains spiritual and moral rights to your submitted answers and any derivative works conceived during the application process.',
      checkboxLabel: 'Yes, I consent.',
    },
    {
      type: 'text',
      question: 'vilege. Initial below to acknowledge.',
      placeholder: '[ initial here ]',
    },
  ];

  let currentStep = 0;

  function renderInput(q) {
    switch (q.type) {
      case 'textarea':
        return `
          <textarea class="enterprise-app-textarea" id="q-input" rows="6"></textarea>
          ${q.wordLimit ? `<div class="enterprise-app-wordcount" id="word-count">0 / ${q.wordLimit} words</div>` : ''}
        `;
      case 'range':
        return `
          <div class="enterprise-app-range-wrap">
            <div class="enterprise-app-range-labels">
              <span>1 — ${q.labelMin}</span>
              <span>${q.labelMax} — 10</span>
            </div>
            <input type="range" class="enterprise-app-range" id="q-input" min="1" max="10" value="5">
            <div class="enterprise-app-range-value" id="range-display">5</div>
          </div>
        `;
      case 'radio-conditional':
        return `
          <div class="enterprise-app-radio-group">
            <label class="enterprise-app-radio-label">
              <input type="radio" name="q-radio" value="yes"> Yes
            </label>
            <label class="enterprise-app-radio-label">
              <input type="radio" name="q-radio" value="no"> No
            </label>
          </div>
          <div class="enterprise-app-conditional" id="conditional-field" style="display:none;">
            <label class="enterprise-app-conditional-label">${q.conditionalLabel}</label>
            <textarea class="enterprise-app-textarea" id="conditional-input" rows="4"></textarea>
          </div>
        `;
      case 'file':
        return `
          <div class="enterprise-app-file-wrap">
            <label class="enterprise-app-file-label" for="q-input">
              <span id="file-label-text">SELECT FILE</span>
            </label>
            <input type="file" id="q-input" accept="image/*" class="enterprise-app-file-input">
          </div>
        `;
      case 'checkbox':
        return `
          <label class="enterprise-app-checkbox-label">
            <input type="checkbox" id="q-input" class="enterprise-app-checkbox">
            <span>${q.checkboxLabel}</span>
          </label>
        `;
      case 'text':
        return `
          <input type="text" class="enterprise-app-text-input" id="q-input" placeholder="${q.placeholder}">
        `;
      default:
        return '';
    }
  }

  function renderStep(stepIdx) {
    const q = questions[stepIdx];
    const stepNum = stepIdx + 1;
    const isLast = stepIdx === questions.length - 1;
    const isFirst = stepIdx === 0;
    const nextDisabled = q.type === 'checkbox' ? 'disabled' : '';

    main.innerHTML = `
      <p class="enterprise-app-progress">ENTERPRISE APPLICATION — QUESTION ${stepNum} OF ${questions.length}</p>
      <div class="enterprise-app-question-wrap">
        <h2 class="enterprise-app-question">${q.question}</h2>
        <div class="enterprise-app-input-wrap">
          ${renderInput(q)}
        </div>
      </div>
      <nav class="enterprise-app-nav">
        ${isFirst ? '<span></span>' : '<button class="enterprise-app-prev" id="btn-prev">PREVIOUS</button>'}
        <button class="enterprise-app-next" id="btn-next" ${nextDisabled}>
          ${isLast ? 'SUBMIT APPLICATION' : 'NEXT'}
        </button>
      </nav>
    `;

    // Wire input behaviors
    if (q.type === 'textarea' && q.wordLimit) {
      const ta = document.getElementById('q-input');
      const wc = document.getElementById('word-count');
      ta.addEventListener('input', () => {
        const words = ta.value.trim() === '' ? 0 : ta.value.trim().split(/\s+/).length;
        wc.textContent = `${words} / ${q.wordLimit} words`;
      });
    }

    if (q.type === 'range') {
      const range = document.getElementById('q-input');
      const display = document.getElementById('range-display');
      range.addEventListener('input', () => { display.textContent = range.value; });
    }

    if (q.type === 'radio-conditional') {
      document.querySelectorAll('input[name="q-radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
          document.getElementById('conditional-field').style.display =
            radio.value === 'yes' ? 'block' : 'none';
        });
      });
    }

    if (q.type === 'file') {
      const fileInput = document.getElementById('q-input');
      const labelText = document.getElementById('file-label-text');
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
          labelText.textContent = fileInput.files[0].name;
        }
      });
    }

    if (q.type === 'checkbox') {
      const checkbox = document.getElementById('q-input');
      const nextBtn = document.getElementById('btn-next');
      checkbox.addEventListener('change', () => {
        nextBtn.disabled = !checkbox.checked;
      });
    }

    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => { currentStep--; renderStep(currentStep); });
    }

    document.getElementById('btn-next').addEventListener('click', () => {
      if (isLast) {
        handleSubmit();
      } else {
        currentStep++;
        renderStep(currentStep);
      }
    });
  }

  function handleSubmit() {
    main.innerHTML = `
      <div class="enterprise-app-processing">
        <p class="enterprise-app-processing-text">TRANSMITTING APPLICATION TO LICENSING COMMITTEE<span class="processing-dots" id="processing-dots"></span></p>
      </div>
    `;

    const dotsEl = document.getElementById('processing-dots');
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      dotsEl.textContent = '.'.repeat(dotCount);
    }, 400);

    // Update tier immediately — the review is theater
    localStorage.setItem('user_tier', 'enterprise');
    localStorage.setItem('violations_remaining_enterprise', TIERS.enterprise.violationsAllowed);

    setTimeout(() => {
      clearInterval(dotInterval);
      showSuccess();
    }, 2000);
  }

  function showSuccess() {
    main.innerHTML = `
      <div class="enterprise-app-success">
        <p class="enterprise-app-progress">APPLICATION RECEIVED</p>
        <div class="enterprise-app-success-body">
          <p class="enterprise-app-success-line">Thank you for your interest in ENTERPRISE tier access.</p>
          <p class="enterprise-app-success-line">Your responses have been forwarded to our Licensing Committee for review. The committee meets quarterly. Your application will be evaluated within 6–8 business weeks.</p>
          <p class="enterprise-app-success-line">In the interim:</p>
          <ul class="enterprise-app-success-list">
            <li>— Your card on file has been charged $890 (non-refundable processing fee).</li>
            <li>— Your access tier has been provisionally updated to ENTERPRISE pending review.</li>
            <li>— Should your application be denied, the processing fee will be retained as compensation for the committee's time.</li>
            <li>— Should your application be approved, no further action is required from you.</li>
          </ul>
          <button class="upgrade-modal-accept-btn" id="btn-return">RETURN TO SPECIMEN</button>
        </div>
      </div>
    `;

    document.getElementById('btn-return').addEventListener('click', () => {
      window.location.href = 'specimen.html';
    });
  }

  renderStep(0);
}

// ================================================================
// PAGE: 404
// ================================================================

function init404() {
  // Clear all stored access
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_tier');
  localStorage.removeItem('usage_log');
  ['basic','standard','professional','enterprise'].forEach(t => {
    localStorage.removeItem(`violations_remaining_${t}`);
  });
  sessionStorage.removeItem('session_chars');

  const returnLink = document.getElementById('return-link');
  if (returnLink) {
    returnLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'login.html';
    });
  }
}

// ================================================================
// ROUTER
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.id;
  const routes = {
    login: initLogin,
    license: initLicense,
    specimen: initSpecimen,
    upgrade: initUpgrade,
    'enterprise-application': initEnterpriseApplication,
    'not-found': init404,
  };
  if (routes[page]) routes[page]();
});
