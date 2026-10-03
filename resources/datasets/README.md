# Dataset catalogue

Every dataset the brief names for the Health track (common layer, section 7.3, and health layer, Annex A.2), plus Sunbird AI's SALT, which our research questions name. The brief says to check terms ourselves because access conditions change, so **every license starts as "to verify"**. Data grounding is 15% of the score, and "what our data does not cover" is scored.

**Before using a dataset:** open its page, record license and size here, write its card in [cards/](cards/) (copy [cards/_template.md](cards/_template.md)), and set status to `reviewed`. `scripts/check` fails while any license says "to verify" or any card lacks a "What this does not cover" section.

Legend. **Used for:** *evidence* = shows the problem is real (cite source, year, country); *build* = the tool learns from or is tested on it. **Priority:** ★ = most relevant to our build and evidence.

## Common layer (brief 7.3)

| Priority | Dataset | Source | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | Mozilla Common Voice | Mozilla | to verify (brief says CC0) | TODO | build: Luganda speech for testing | not reviewed | [card](cards/common-voice.md) |
| ★ | FLEURS | Google | to verify | TODO | build: Luganda WER benchmark (RQ3.1) | not reviewed | [card](cards/fleurs.md) |
| ★ | MMS | Meta | to verify | TODO | build: speech recognition starting point | not reviewed | [card](cards/mms.md) |
| | FLORES-200 / NLLB-200 | Meta | to verify | TODO | build: only if we translate Luganda to English | not reviewed | |
| | OPUS | OPUS project | to verify | TODO | build: parallel text, if needed | not reviewed | |
| | MASSIVE | Amazon | to verify | TODO | build: intent sorting template; Luganda coverage to check | not reviewed | |
| | Masakhane | Masakhane community | to verify | TODO | build: African-language NLP resources | not reviewed | |
| | AI4Bharat / IndicVoices | AI4Bharat | n/a | n/a | not relevant (South Asian languages) | not used | |
| ★ | GSMA Mobile Gender Gap Report | GSMA | to verify | TODO | evidence: phone vs smartphone ownership by gender (device claim) | not reviewed | |
| | OpenCelliD | OpenCelliD | to verify | TODO | evidence: where there is no signal (offline need) | not reviewed | |
| | Global Findex | World Bank | to verify | TODO | evidence: mobile money use by gender | not reviewed | |
| | WorldPop | WorldPop | to verify | TODO | evidence: clinic catchment size | not reviewed | |
| | OpenStreetMap | OpenStreetMap contributors | to verify | TODO | evidence: facility locations, offline maps | not reviewed | |
| | VIIRS Nighttime Lights | (named in brief 7.3 C) | to verify | TODO | evidence: electrification proxy (power for the device, RQ6.3) | not reviewed | |
| | World Bank Data360 | World Bank | to verify | TODO | evidence: country indicators | not reviewed | |
| | World Development Indicators | World Bank | to verify | TODO | evidence: country indicators by year | not reviewed | |
| | World Bank Microdata Library and Data Catalog | World Bank | to verify | TODO | evidence: survey microdata | not reviewed | |
| | Humanitarian Data Exchange (HDX) | UN OCHA | to verify | TODO | evidence: boundaries, population, infrastructure | not reviewed | |

## Health layer (brief Annex A.2)

| Priority | Dataset | Source | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | Service Delivery Indicators | World Bank | to verify | TODO | evidence: staffing, absenteeism, caseload (RQ1.1, RQ1.3, RQ2.2) | not reviewed | [card](cards/service-delivery-indicators.md) |
| | healthsites.io | healthsites.io (OpenStreetMap-based) | to verify | TODO | evidence: facility locations | not reviewed | |
| | Maina et al., Scientific Data | Maina et al. | to verify | about 98,000 facilities (brief) | evidence: public facility list, sub-Saharan Africa | not reviewed | |
| ★ | DHS Program and Service Provision Assessments | DHS Program | to verify (free registration) | TODO | evidence: health-seeking, staffing, hours (RQ1.1) | not reviewed | |
| | Malaria Atlas Project travel-time surfaces | Malaria Atlas Project | to verify | TODO | evidence: travel time to facility | not reviewed | |
| | AccessMod | WHO | to verify | TODO | evidence: geographic access (only if we touch referral) | not reviewed | |
| ★ | DHIS2 | DHIS2 (University of Oslo) | to verify | TODO | build: target schema for synced records (RQ1.2) | not reviewed | [card](cards/dhis2.md) |
| | WHO Global Health Observatory | WHO | to verify | TODO | evidence: workforce density, coverage | not reviewed | |
| | Global Health Data Exchange | IHME | to verify | TODO | evidence: burden of disease, surveys | not reviewed | |

## Named in our research questions

| Priority | Dataset | Source | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | SALT | Sunbird AI | to verify | TODO | build: Luganda benchmark and models (RQ3.1, RQ3.2) | not reviewed | [card](cards/salt.md) |

## Our own data

| Dataset | Source | License | Size | Used for | Status |
|---|---|---|---|---|---|
| Synthetic test clips and transcripts | This team, [synthetic/](synthetic/) and [eval/test-sets/](../../eval/test-sets/) | MIT (this repo) | TODO | build: evaluation | in progress. Every file labelled synthetic. |

## What our data does not cover (overall)

- No open local-language clinical conversation corpus exists that we know of, so our test encounters are synthetic (landscape review, H1 Data score).
- No real clinic recordings, so results show behaviour on scripted clips, not in a real clinic.
- Lusoga coverage in public speech data: TODO, measure per dataset (RQ3.3).
- TODO: fill per-dataset gaps from each card.
