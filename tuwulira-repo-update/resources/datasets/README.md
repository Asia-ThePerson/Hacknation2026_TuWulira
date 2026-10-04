# TuWulira — Data catalogue

Checked 4 Oct 2026. Licences change; re-check each page before release. Anything marked **CHECK** was not confirmed on the source page.

## Data we build and test with

| Dataset / model | Use in TuWulira | Licence | Size | Access |
|---|---|---|---|---|
| Mozilla Common Voice, Luganda | Fine-tune / test Ears model | CC0 | ~560 h recorded, ~437 h validated, 672 speakers (Common Voice 26.0, per team research) | Open download |
| Google FLEURS, Luganda | Held-out WER benchmark only (never trained on) | CC BY 4.0 (CHECK card) | Small per-language test split | Hugging Face |
| Sunbird SALT | Luganda speech + Luganda–English parallel text; glossary building | **CC BY-SA 4.0** (Hugging Face card) | ~25,000 sentences in English + 6 languages; ~5,000 multispeaker ASR sentences; ~5,000 studio TTS sentences | Hugging Face `Sunbird/salt` |
| Makerere Radio Speech Corpus | **Test only** (natural speech, some code-switching) | Conflicting: paper says **CC BY-NC-ND 4.0**; Zenodo metadata says CC BY 4.0. We follow the stricter one. ND means no derivatives, so we do not train on it | 155 h, of which 20 h human-transcribed | Zenodo, marked "restricted" — request access |
| Dialogs of Delivery (Kimera et al., 2026) | Symptom glossary + labeler test (text only, maternal health) | CHECK on Harvard Dataverse | 3,640 Q/A pairs in English, Luganda, Runyankore, Swahili | Harvard Dataverse |
| Small Luganda CTC ASR (candidate) | On-device Ears model | CHECK model card | Target under ~120 MB int8 | TBD |
| SunflowerASR (Sunbird, Whisper large-v3 adaptation, 51 languages) | **Benchmark only**; too large for device | CHECK model card | Whisper large-v3 class | Hugging Face |
| Sunflower on-device (Gemma 4 E2B) | Not used: ~3.8–7.3 GB per variant breaks side-loading | — | ~3.8 GB smallest | GitHub `SunbirdAI/sunflower-app` |
| Team role-play recordings | Code-switched clinical test clips | Ours; consent recorded; CC0 if we release | TODO (target 20–30 clips) | Repo `/evaluation/clips` |
| Synthetic patient complaints | Labeler test set — **labelled synthetic** | Ours | TODO (target 20–30) | Repo `/evaluation/synthetic` |

**Licence notes for the scalability section:** SALT is share-alike (derivatives must keep CC BY-SA). The radio corpus is non-commercial and no-derivatives. A commercial or ministry deployment needs these checked or replaced.

## Evidence the problem is real (not used for training)

| Source | Used for | Year | Country |
|---|---|---|---|
| World Bank / EPRC Service Delivery Indicators | Provider absence, diagnostic accuracy | 2013 | Uganda |
| MoH HMIS Health Unit Procedure Manual (HMIS 031, tally sheet) | Paper documentation process | 2010 | Uganda |
| HMIS 105 monthly report | Diagnosis list, report fields | 2019 print | Uganda |
| WHO IMCI Chart Booklet; WHO PCPNC; Uganda Clinical Guidelines 2023 | Danger-sign rules | 2014 / 3rd ed. / 2023 | Global / Uganda |
| GSMA Mobile Gender Gap Report | Phone ownership by gender | 2025 | Incl. Uganda |
| eCHIS (MoH, Medic, Living Goods) | Android devices at VHT level | 2023–2026 | Uganda |
| Statcounter / phone market data | Reference device choice | 2025–2026 | Uganda / Africa |

## What our data does not cover

- **Code-switched clinical speech.** No public Luganda–English dataset of people describing symptoms exists. Our role-play clips are the only examples.
- **Read vs natural speech.** Common Voice and SALT are mostly read sentences, not sick people speaking freely.
- **Older and rural voices, regional accents, noisy waiting rooms.**
- **Clinical vocabulary** beyond maternal health (Dialogs of Delivery).
- **Other languages.** Lusoga, Lumasaaba and others have far less data (see `docs/LESS_SUPPORTED_LANGUAGE.md`).
- **Real patient data.** We use none. All test complaints are synthetic or role-played.
