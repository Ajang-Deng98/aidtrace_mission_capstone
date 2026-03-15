# AidTrace — 5-Minute Demo Video Script

**Deployed URL:** https://aidtrace-southsudan.vercel.app  
**Total Duration:** ~5 minutes  
**Tool:** Use OBS Studio, Loom, or any screen recorder  
**Resolution:** 1280×720 minimum, full screen browser  
**Before recording:** Clear browser cache, zoom browser to 90%, use Chrome

---

## PRE-RECORDING CHECKLIST

- [ ] Open https://aidtrace-southsudan.vercel.app in Chrome
- [ ] Have 5 browser tabs ready — one per role (Admin, NGO, Donor, Supplier, Field Officer)
- [ ] Have test account credentials ready (see each section below)
- [ ] Open DevTools → Network tab to show blockchain TX hashes when needed
- [ ] Disable browser notifications

---

## SEGMENT 1 — Home Page & System Overview
**Duration: 0:00 – 0:30**

**What to show:**
1. Open https://aidtrace-southsudan.vercel.app
2. Slowly scroll down the home page — show the hero section, "How It Works" steps, and the "Submit Report" section
3. Click the language switcher (top right) — switch to **Arabic (العربية)** — pause 2 seconds to show full Arabic UI
4. Switch back to **English**
5. Point cursor at the "Get Started" button (do not click yet)

**Narration (say out loud or add as text overlay):**
> "AidTrace is a blockchain-powered humanitarian aid platform built for South Sudan. It connects donors, NGOs, suppliers, and field officers in a fully transparent, verifiable workflow. Every action is recorded on the Ethereum Sepolia testnet. The platform supports both English and Arabic."

---

## SEGMENT 2 — ADMIN: Approve Users & Projects
**Duration: 0:30 – 1:00**

**Login credentials:**
- Username: `admin` (or your admin account)
- Password: your admin password

**What to show:**
1. Click **Login** → enter Admin credentials → click **Sign In**
2. You land on `/admin` — show the dashboard stats cards (total donors, NGOs, suppliers, projects)
3. Click **Pending Users** tab — show a list of users waiting for approval
4. Click **Approve** on one user — show the success message
5. Click **Pending Projects** tab — show a project waiting for approval
6. Click **Approve** on the project — show status change
7. Click **Manage Users** — show the full user list with roles
8. Click **Logout**

**Narration:**
> "The Admin controls who enters the system. New registrations are blocked until the Admin approves them. The Admin also approves projects before they go live for funding."

---

## SEGMENT 3 — NGO: Create Project & Register Beneficiaries
**Duration: 1:00 – 2:00**

**Login credentials:**
- Username: your NGO account
- Password: your NGO password

**What to show:**

**3a — Create a Project (0:30)**
1. Login as NGO → land on `/ngo`
2. Show dashboard stats (total projects, funded, field officers)
3. Click **Create Project**
4. Fill in the form with these exact values:
   - Title: `Food Aid — Juba Central 2025`
   - Description: `Emergency food distribution for 200 families in Juba Central`
   - Location: `Juba, Central Equatoria`
   - Required Items: `Rice, Beans, Cooking Oil`
   - Budget: `15000`
5. Click **Submit** — show the project appearing in the list with status `CREATED`

**3b — Register a Beneficiary (0:30)**
1. Click **Beneficiaries** or navigate to beneficiary registration
2. Click **Add Beneficiary**
3. Fill in:
   - Name: `Mary Akol`
   - Phone: `+211912345678`
   - Project: select the project just created
4. Show the face capture step — position face in camera frame — capture
5. Show success: beneficiary saved with face descriptor stored
6. Add a second beneficiary with different data:
   - Name: `James Deng`
   - Phone: `+211923456789`
7. Show the beneficiary list with both entries

**Narration:**
> "The NGO creates aid projects and registers beneficiaries with biometric face data. Each beneficiary's 128-point face descriptor is stored securely and will be used for identity verification during distribution."

---

## SEGMENT 4 — DONOR: Fund a Project
**Duration: 2:00 – 2:40**

**Login credentials:**
- Username: your Donor account
- Password: your Donor password

**What to show:**
1. Login as Donor → land on `/donor`
2. Show **Pending Projects** section — the project created by NGO appears here
3. Click on `Food Aid — Juba Central 2025`
4. Show project details: location, budget, required items, NGO name
5. Enter funding amount: `15000`
6. Click **Fund Project**
7. Show the blockchain transaction hash appearing (e.g. `0xabc123...`) — highlight it
8. Open a new tab → go to https://sepolia.etherscan.io → paste the TX hash → show the confirmed transaction
9. Go back — show project status changed to `FUNDED` in **Funded Projects** section

**Narration:**
> "Donors browse approved projects and fund them directly. Each funding transaction is signed and recorded on the Ethereum Sepolia blockchain — fully transparent and immutable. Here you can see the live transaction on Etherscan."

---

## SEGMENT 5 — NGO: Request Supplier Quote
**Duration: 2:40 – 3:10**

**Still logged in as NGO (switch tab)**

**What to show:**
1. Go back to NGO dashboard
2. See the project is now `FUNDED`
3. Click **Create Quote Request** on the funded project
4. Fill in:
   - Items: `Rice (100 bags), Beans (50 bags), Cooking Oil (30 cans)`
   - Delivery Location: `Juba Central Warehouse`
   - Delivery Date: `2025-12-31`
   - Proposed Budget: `12000`
5. Click **Submit Quote Request**
6. Show the quote request appearing in the list with status `OPEN`

**Narration:**
> "Once funded, the NGO creates a supply quote request. Multiple suppliers can bid competitively. The NGO then selects the best quote — this selection is also recorded on the blockchain."

---

## SEGMENT 6 — SUPPLIER: Submit Quote & Confirm Delivery
**Duration: 3:10 – 3:40**

**Login credentials:**
- Username: your Supplier account
- Password: your Supplier password

**What to show:**
1. Login as Supplier → land on `/supplier`
2. Show **Open Quote Requests** — the NGO's request appears
3. Click on the quote request — show the items and delivery details
4. Click **Submit Quote**
5. Fill in:
   - Quoted Amount: `11500`
   - Delivery Terms: `Delivery within 14 days of selection`
6. Click **Submit** — show quote submitted successfully
7. Switch back to NGO tab → go to Quote Requests → show the supplier's quote
8. Click **Select Quote** — show status changes to `QUOTE_SELECTED`
9. Switch back to Supplier tab → show assignment now shows `SELECTED`
10. Click **Confirm Delivery** — show status moves to `SUPPLIER_CONFIRMED`

**Narration:**
> "Suppliers receive open quote requests, submit competitive bids, and the NGO selects the best offer. Once selected, the supplier confirms they can deliver — this is recorded on-chain."

---

## SEGMENT 7 — FIELD OFFICER: Verify Delivery & Distribute Aid
**Duration: 3:40 – 4:40**

**Login credentials:**
- Username: your Field Officer account
- Password: your Field Officer password

**What to show:**

**7a — Confirm Assignment (0:15)**
1. Login as Field Officer → land on `/field-officer`
2. Show **My Projects** — the project appears as assigned
3. Click **Confirm Assignment** — status moves to `FIELD_OFFICER_CONFIRMED`
4. Show project status is now `READY_FOR_DISTRIBUTION`

**7b — Face Verification (0:30)**
1. Click **Start Distribution** or navigate to distribution
2. Search for beneficiary: type `Mary Akol`
3. Click **Verify Identity**
4. Show the face scan camera activating
5. Position face — show the green match indicator (Euclidean distance < 0.6)
6. Show: "Face verified ✓"

**7c — OTP Verification (0:15)**
1. After face passes — click **Send OTP**
2. Show: "OTP sent to +211912345678"
3. Enter the 6-digit OTP received on the phone
4. Click **Verify OTP**
5. Show: "OTP verified ✓ — Distribution recorded"

**7d — Blockchain Confirmation (0:10)**
1. Show the distribution record with blockchain TX hash
2. Highlight: distribution is now permanently on-chain

**Narration:**
> "The Field Officer is the last line of verification. Before any aid is distributed, the beneficiary must pass two checks: face recognition using their stored biometric descriptor, and a one-time password sent to their registered phone. Only when both pass does the system record the distribution on the blockchain."

---

## SEGMENT 8 — PUBLIC TRANSPARENCY REPORT
**Duration: 4:40 – 4:55**

**No login required**

**What to show:**
1. Logout (or open incognito tab)
2. Go to https://aidtrace-southsudan.vercel.app/public-report
3. Fill in the report form:
   - Project Name: `Food Aid — Juba Central 2025`
   - Location: `Juba`
   - Description: `Aid was distributed fairly and on time`
   - Contact: (leave blank — anonymous)
4. Click **Submit Report**
5. Show success message
6. Click **View Reports** — show the submitted report in the public list

**Narration:**
> "Anyone — community members, journalists, or observers — can submit a transparency report without logging in. This creates public accountability outside the system."

---

## SEGMENT 9 — BLOCKCHAIN VERIFICATION
**Duration: 4:55 – 5:00**

**What to show:**
1. Open https://sepolia.etherscan.io/address/0x394D38B35364BB63bF6497b925E9bEF6Bc056Be3
2. Show the list of transactions — each one is a real on-chain action from the demo
3. Click one transaction — show the input data / event logs
4. End on this screen

**Narration:**
> "Every action in this demo — project creation, funding, quote selection, delivery, and distribution — is permanently recorded here on the Ethereum Sepolia testnet. AidTrace makes humanitarian aid fully transparent and tamper-proof."

---

## EDITING NOTES

| Segment | Duration | Key Screenshot to Capture |
|---|---|---|
| 1 — Home | 0:30 | Home page + Arabic UI |
| 2 — Admin | 0:30 | Pending users list + approve action |
| 3 — NGO | 1:00 | Project form + beneficiary face capture |
| 4 — Donor | 0:40 | Fund project + Etherscan TX |
| 5 — NGO Quote | 0:30 | Quote request form |
| 6 — Supplier | 0:30 | Quote submission + selection |
| 7 — Field Officer | 1:00 | Face scan + OTP + distribution record |
| 8 — Public Report | 0:15 | Report form + public list |
| 9 — Blockchain | 0:05 | Etherscan contract page |

**Add text overlays for:**
- Role name at the start of each segment (e.g. "ROLE: NGO")
- Blockchain TX hash when it appears
- "Face Verified ✓" and "OTP Verified ✓" during distribution
- Final screen: deployed URL + contract address

**Recommended tools:**
- Screen recorder: OBS Studio (free) or Loom
- Video editor: DaVinci Resolve (free) or CapCut
- Add captions if submitting for academic review
