# Findings

Numbered findings R1, R2 and so on. Each one states what we learned, the evidence, and the research question it answers. Product requirements (PR#) in [docs/product/prd.md](../docs/product/prd.md) cite these.

Rules:
- One finding per row. Never renumber; mark a wrong finding as `withdrawn` instead.
- Evidence is a link to a note in [sources/notes/](sources/notes/) or a primary source, with year and country.
- "Secondary" means we have it from our landscape review and have not yet checked the primary source. Check it before it goes in the video.

| ID | Finding | Evidence | Answers | Status |
|---|---|---|---|---|
| R1 | SMS alone already delivers large health gains, so our AI must do something SMS cannot. Project Mwana cut infant HIV result delivery from 66 to 33 days on average; Uganda's mTrac cut malaria drug (ACT) stock-outs from 25.2% to 13.8%. | Landscape review section 2, citing UNICEF (Project Mwana) and Communication Initiative (mTrac). Secondary. | Brief 05 "could SMS do this?" | secondary |
| R2 | The strongest recent proof point for clinical AI in a similar region is Penda Health's AI Consult (Nairobi): 16% fewer diagnostic errors, 13% fewer treatment errors, 32% fewer history-taking errors. It runs on GPT-4o in the cloud, inside urban clinic records. | Landscape review section 3, citing OpenAI / Penda Health (July 2025) and arXiv 2507.16947. Secondary. | RQ2.4, RQ7.1, RQ7.2 (context) | secondary |
| R3 | Current small on-device general models are too big for the target device. Gemma 4 E2B loads into about 2.4 GB RAM and needs a phone with at least 4 GB RAM and 3 GB free storage. | Landscape review section 1, citing Gemma 4 release coverage (April 2026) and SunbirdAI sunflower-app. Secondary. | RQ6.1 (partial) | secondary |
| R4 | A task-specific model can be compressed enough for low-end phones: Wadhwani AI's CottonAce went from 268 MB to 5 MB and runs offline with PyTorch Mobile. | Landscape review section 1, citing Wadhwani AI and The Next Web (Oct 2020). Secondary. | RQ6.1 (precedent) | secondary |
| R5 | DHIS2 is used by ministries of health in more than 70 countries, so a DHIS2-shaped export is the most plausible destination for our records and the base of the country pack. | Brief Annex A.2 (DHIS2 row). | RQ1.2 (partial), RQ7.3 | confirmed (brief) |
| R6 | Even IFC TechEmerge Health's strongest AI-assisted tools in Kenya, Uganda and Ethiopia needed 2G/3G to work, and clinician trust and regulatory acceptance took years. | Brief Annex A.1 "Preconditions to keep in mind". | RQ7.1 (context) | confirmed (brief) |
