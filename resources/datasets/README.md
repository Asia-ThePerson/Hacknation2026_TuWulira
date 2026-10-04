# Dataset catalogue

Every dataset the brief names for the Health track (common layer, section 7.3, and health layer, Annex A.2), plus Sunbird AI's SALT, which our research questions name. The brief says to check terms ourselves because access conditions change, so **every license starts as "to verify"**. Data grounding is 15% of the score, and "what our data does not cover" is scored.

**Before using a dataset:** open its page, record license and size here, write its card in [cards/](cards/) (copy [cards/_template.md](cards/_template.md)), and set status to `reviewed`. `scripts/check` fails while any license says "to verify" or any card lacks a "What this does not cover" section.

Legend. **Used for:** *evidence* = shows the problem is real (cite source, year, country); *build* = the tool learns from or is tested on it. **Priority:** ★ = most relevant to our build and evidence.

## Common layer (brief 7.3)

| Priority | Dataset | Source | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | Mozilla Common Voice | Mozilla | CC0 | Luganda: ~560 h recorded, ~437 h validated, 672 speakers (Common Voice 26.0, per team research) | build: fine-tune / test the Ears model | reviewed (team research, 4 Oct 2026) | [card](cards/common-voice.md) |
| ★ | FLEURS | Google | CC BY 4.0 (CHECK on the dataset card) | Small per-language test split | build: held-out Luganda WER benchmark only, never trained on (RQ3.1) | reviewed (team research, 4 Oct 2026) | [card](cards/fleurs.md) |
| ★ | MMS | Meta | CC BY-NC 4.0, code and model weights ([fairseq MMS README](https://github.com/facebookresearch/fairseq/blob/main/examples/mms/README.md)) | TODO | build: speech recognition starting point | not reviewed | [card](cards/mms.md) |
| | FLORES-200 / NLLB-200 | Meta | FLORES-200: CC BY-SA 4.0 ([Hugging Face card](https://huggingface.co/datasets/facebook/flores)). NLLB-200: models CC BY-NC 4.0, code MIT ([fairseq NLLB README](https://github.com/facebookresearch/fairseq/blob/nllb/README.md)) | TODO | not used: translation model dropped from the device (D37) | not used | |
| | OPUS | OPUS project | Varies per corpus; each corpus page on [OPUS](https://opus.nlpl.eu/) states its own licence | TODO | build: parallel text, if needed | not reviewed | |
| | MASSIVE | Amazon | Data CC BY 4.0, code Apache 2.0 ([NOTICE.md](https://github.com/alexa/massive/blob/main/NOTICE.md)) | TODO | build: intent sorting template; Luganda coverage to check | not reviewed | |
| | Masakhane | Masakhane community | No single licence; each repository sets its own (MIT, Apache 2.0, GPL 3.0, CC BY 4.0, or none) ([masakhane-io on GitHub](https://github.com/masakhane-io)) | TODO | build: African-language NLP resources | not reviewed | |
| | AI4Bharat / IndicVoices | AI4Bharat | n/a | n/a | not relevant (South Asian languages) | not used | |
| ★ | GSMA Mobile Gender Gap Report | GSMA | Copyright 2025 GSMA, no open licence stated ([report PDF](https://www.gsma.com/wp-content/uploads/2025/12/The-Mobile-Gender-Gap-Report-2025.pdf)); cited as evidence only | TODO | evidence: phone vs smartphone ownership by gender (device claim) | not reviewed | |
| | OpenCelliD | OpenCelliD | CC BY-SA 4.0 ([attribution page](https://docs.opencellid.org/docs/attribution)) | TODO | evidence: where there is no signal (offline need) | not reviewed | |
| | Global Findex | World Bank | CC BY 4.0 for the indicator database ([Data Catalog](https://datacatalog.worldbank.org/search/dataset/0039935)); 2021 microdata under the World Bank Research Data License ([Data Catalog](https://datacatalog.worldbank.org/search/dataset/0063277)) | TODO | evidence: mobile money use by gender | not reviewed | |
| | WorldPop | WorldPop | CC BY 4.0 ([WorldPop licence file](https://worldpop-public-data.soton.ac.uk/GIS/Population/Individual_countries/TZA/United_Republic_of_Tanzania_100m_Population/licence.txt)) | TODO | evidence: clinic catchment size | not reviewed | |
| | OpenStreetMap | OpenStreetMap contributors | ODbL ([copyright page](https://www.openstreetmap.org/copyright)) | TODO | evidence: facility locations, offline maps | not reviewed | |
| | VIIRS Nighttime Lights | (named in brief 7.3 C) | CC BY 4.0 for many products; check each product ([Earth Observation Group](https://eogdata.mines.edu/products/vnl/)) | TODO | evidence: electrification proxy (power for the device, RQ6.3) | not reviewed | |
| | World Bank Data360 | World Bank | CC BY 4.0 unless labelled otherwise; some third-party data may not be reused ([Data360](https://data360.worldbank.org/en/about)) | TODO | evidence: country indicators | not reviewed | |
| | World Development Indicators | World Bank | CC BY 4.0 ([Data Catalog](https://datacatalog.worldbank.org/search/dataset/0037712/world-development-indicators)) | TODO | evidence: country indicators by year | not reviewed | |
| | World Bank Microdata Library and Data Catalog | World Bank | Varies per study: Open, Direct, Public Use, Licensed, External or No Access ([terms of use](https://microdata.worldbank.org/index.php/terms-of-use)) | TODO | evidence: survey microdata | not reviewed | |
| | Humanitarian Data Exchange (HDX) | UN OCHA | Set per dataset by the contributing organisation: CC BY, CC BY-SA, CC BY-IGO, ODbL, ODC-BY, PDDL, CC0, multiple or other ([HDX data licences](https://docs.humdata.org/about/data-licenses)) | TODO | evidence: boundaries, population, infrastructure | not reviewed | |

## Health layer (brief Annex A.2)

| Priority | Dataset | Source | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | Service Delivery Indicators | World Bank | Indicators CC BY 4.0 ([Data Catalog](https://datacatalog.worldbank.org/search/dataset/0042030/service-delivery-indicators)); Uganda 2013 health microdata: Public Use (licensed), confidentiality declaration required ([Microdata Library](https://microdata.worldbank.org/index.php/catalog/2750)) | TODO | evidence: staffing, absenteeism, caseload (RQ1.1, RQ1.3, RQ2.2) | not reviewed | [card](cards/service-delivery-indicators.md) |
| | healthsites.io | healthsites.io (OpenStreetMap-based) | ODbL ([healthsites.io](https://healthsites.io/)) | TODO | evidence: facility locations | not reviewed | |
| | Maina et al., Scientific Data | Maina et al. | Data CC0 ([figshare](https://doi.org/10.6084/m9.figshare.7725374.v1)); article CC BY 4.0 ([Scientific Data](https://www.nature.com/articles/s41597-019-0142-2)) | about 98,000 facilities (brief) | evidence: public facility list, sub-Saharan Africa | not reviewed | |
| ★ | DHS Program and Service Provision Assessments | DHS Program | Not an open licence: free registration, use only for the registered study, no sharing without written consent ([terms of use](https://dhsprogram.com/data/terms-of-use.cfm)) | TODO | evidence: health-seeking, staffing, hours (RQ1.1) | not reviewed | |
| | Malaria Atlas Project travel-time surfaces | Malaria Atlas Project | CC BY 4.0 for the 2019 travel time to healthcare surface (provider terms in the [Earth Engine catalog](https://developers.google.com/earth-engine/datasets/catalog/Oxford_MAP_accessibility_to_healthcare_2019)); MAP maps generally CC BY 3.0 ([open access policy](https://malariaatlas.org/open-access-policy/)) | TODO | evidence: travel time to facility | not reviewed | |
| | AccessMod | WHO | GNU GPL v3, plus the WHO terms of use and software licence agreement ([AccessMod docs](https://accessmod.atlassian.net/wiki/spaces/EN/pages/4326779/3.1.+License+and+citation)) | TODO | evidence: geographic access (only if we touch referral) | not reviewed | |
| ★ | DHIS2 | DHIS2 (University of Oslo) | BSD 3-Clause, software ([dhis2-core licence](https://github.com/dhis2/dhis2-core/blob/master/LICENSE)) | TODO | build: target schema for synced records (RQ1.2) | not reviewed | [card](cards/dhis2.md) |
| | WHO Global Health Observatory | WHO | WHO terms for datasets: royalty-free, non-exclusive use with attribution; not a Creative Commons licence ([WHO terms](https://www.who.int/about/policies/publishing/data-policy/terms-and-conditions)) | TODO | evidence: workforce density, coverage | not reviewed | |
| | Global Health Data Exchange | IHME | IHME data: Free-of-Charge Non-Commercial User Agreement, no derivative data sets ([IHME](https://www.healthdata.org/data-tools-practices/data-practices/ihme-free-charge-non-commercial-user-agreement)); check each catalogued record's own terms | TODO | evidence: burden of disease, surveys | not reviewed | |

## Named in our research questions

| Priority | Dataset | Source | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | SALT | Sunbird AI (Hugging Face `Sunbird/salt`) | CC BY-SA 4.0 (Hugging Face card) | ~25,000 sentences in English + 6 languages; ~5,000 multispeaker ASR sentences; ~5,000 studio TTS sentences | build: Luganda speech + Luganda–English text, glossary (RQ3.1, RQ3.2) | reviewed (team research, 4 Oct 2026) | [card](cards/salt.md) |
| ★ | Makerere Radio Speech Corpus (Mukiibi et al., 2022) | Makerere University (Zenodo, access restricted) | CC BY-NC-ND 4.0 per the paper (Zenodo metadata says CC BY 4.0; we follow the stricter one) | 155 h, of which 20 h human-transcribed | **test only**: natural speech, some code-switching. No derivatives, so never trained on | reviewed (team research, 4 Oct 2026) | [card](cards/makerere-radio-corpus.md) |
| ★ | Dialogs of Delivery (Kimera et al., 2026) | Harvard Dataverse | CHECK on Harvard Dataverse | 3,640 Q/A pairs in English, Luganda, Runyankore, Swahili | build: symptom glossary and labeler test (text only, maternal health) | reviewed (team research, 4 Oct 2026); licence still to check | [card](cards/dialogs-of-delivery.md) |
| | SunflowerASR (Sunbird; Whisper large-v3 adaptation, 51 languages) | Sunbird AI (Hugging Face) | CHECK model card | Whisper large-v3 class | benchmark only; too large for the device | reviewed (team research, 4 Oct 2026) | |
| | Sunflower on-device (Gemma 4 E2B) | Sunbird AI (GitHub `SunbirdAI/sunflower-app`) | n/a | ~3.8 GB smallest variant (3.8 to 7.3 GB) | not used: breaks the side-loading constraint | not used | |
| | Small Luganda CTC ASR (candidate) | TBD | CHECK model card | Target under ~120 MB int8 | build: on-device Ears model | candidate | |

## Our own data

| Dataset | Source | License | Size | Used for | Status |
|---|---|---|---|---|---|
| Synthetic test clips and transcripts | This team, [synthetic/](synthetic/) and [evaluation/test-sets/](../../evaluation/test-sets/) | MIT (this repo) | TODO (target 20 to 30) | build: labeler and safety evaluation | in progress. Every file labelled synthetic. |
| Team role-play recordings | This team; consent recorded | Ours; CC0 if we release | TODO (target 20 to 30 clips) | build: code-switched clinical test clips; WER reported separately for pure-Luganda and mixed clips | planned |

## What our data does not cover (overall)

- **Code-switched clinical speech.** No public Luganda–English dataset of people describing symptoms exists. Our role-play clips are the only examples.
- **Read vs natural speech.** Common Voice and SALT are mostly read sentences, not sick people speaking freely.
- **Older and rural voices, regional accents, noisy waiting rooms.**
- **Clinical vocabulary** beyond maternal health (Dialogs of Delivery).
- **Other languages.** Lusoga, Lumasaaba and others have far less data ([less-supported-language.md](../../docs/product/less-supported-language.md)).
- **Real patient data.** We use none. All test complaints are synthetic or role-played.

**Licence notes for scaling:** SALT is share-alike (derivatives must keep CC BY-SA). The radio corpus is non-commercial and no-derivatives. A commercial or ministry deployment needs these checked or replaced.

## Evidence the problem is real (not used for training)

| Source | Used for | Year | Country |
|---|---|---|---|
| World Bank / EPRC Service Delivery Indicators | Provider absence, diagnostic accuracy | 2013 | Uganda |
| MoH HMIS Health Unit Procedure Manual (HMIS 031, tally sheet) | Paper documentation process | 2010 | Uganda |
| HMIS 105 monthly report | Diagnosis list, report fields | 2019 print | Uganda |
| WHO IMCI Chart Booklet; WHO PCPNC; Uganda Clinical Guidelines 2023 | Danger-sign rules ([danger-signs.md](../../docs/product/danger-signs.md)) | 2014 / 3rd ed. / 2023 | Global / Uganda |
| GSMA Mobile Gender Gap Report | Phone ownership by gender | 2025 | Incl. Uganda |
| eCHIS (MoH, Medic, Living Goods) | Android devices at VHT level | 2023 to 2026 | Uganda |
| Statcounter / phone market data | Reference device choice | 2025 to 2026 | Uganda / Africa |

Full problem statement and what we do not claim: [problem-statement.md](../../docs/product/problem-statement.md).

## Team-supplied sources

| Priority | Source | Publisher | License | Size | Used for | Status | Card |
|---|---|---|---|---|---|---|---|
| ★ | HMIS 105: Health Unit Outpatient Monthly Report, print version September 2019 | Ministry of Health, Uganda | to verify (government form; PDF kept out of the repo) | 32-page PDF; 246 rows from section 1.3 used | build: diagnosis pick-list, tally codes and age bands ([config/hmis105-diagnoses.json](../../config/hmis105-diagnoses.json)) | reviewed for section 1.3 | |
| ★ | Connected but not included | FSD Uganda, https://fsduganda.or.ug/connected-but-not-included/ | Copyright FSD Uganda, all rights reserved (site notice); no open licence ([report page](https://fsduganda.or.ug/connected-but-not-included/)); cited as evidence only | TODO | evidence: phone ownership in Uganda (about 79% of adults, team research note) | not reviewed | |

What these do not cover: the HMIS 105 form is the monthly summary, not the daily OPD register (HMIS 031), so register column numbers still need the HMIS 031 form (RQ1.2). It does not say which conditions are notifiable. The 2019 print version may have been revised since.
