# Library and model registry

Every library or model we consider, with a decision and the reason. **Research** = used to answer a research question only. **Product** = ships in the app.

Status: `evaluating`, `adopted`, `rejected` (always give the reason).

## Speech, translation and language models

| Name | Version | License | Link | Purpose | Research or product | Status | Reason |
|---|---|---|---|---|---|---|---|
| MMS (Meta) | TODO | to verify | TODO | On-device speech recognition for Luganda | product | evaluating | Named in the brief and the landscape review (H1). Need measured size, RAM and Luganda WER (RQ3.1, RQ6.1). |
| Sunbird AI speech models | TODO | to verify | TODO | Luganda speech recognition; Sunbird's published benchmarks (SALT) | product or research | evaluating | Ugandan-language specialist, named in RQ3.1. Check model size: the Sunflower app needs a flagship phone (landscape review), so a smaller model may be needed. |
| whisper-tiny-luganda-v2 (allandclive) | rev 7c130c3 | Apache-2.0 | https://huggingface.co/allandclive/whisper-tiny-luganda-v2 | Small Luganda speech recognition (Whisper tiny fine-tuned on Common Voice 16.1 and FLEURS) | research | evaluating | Smallest practical Luganda model found (37.8 M parameters, 151 MB float32). 2 of 22 words wrong on 3 Common Voice clips; invents words on silence and noise, caught by the safety layer ([smoke test](../../evaluation/results/2026-10-04-luganda-asr-smoke.md)). Not yet quantized or run on a phone. |
| NLLB-200 (Meta) | TODO | to verify | TODO | Luganda to English translation | research | **dropped** | Dropped from the device for size (D37). The labeler maps Luganda straight to the fixed list with a glossary. |
| Gemma 4 E2B (Google) | n/a | to verify | TODO | General on-device model | product | **rejected** | Needs about 2.4 GB RAM and a phone with at least 4 GB RAM and 3 GB free storage (landscape review section 1). The target clinic device may not have that. Also generative, which works against a fixed list of answers. |

## App runtime

| Name | Version | License | Link | Purpose | Research or product | Status | Reason |
|---|---|---|---|---|---|---|---|
| Expo SDK | ~54 | MIT | https://expo.dev | App framework, Android build | product | adopted | Team already shipped the Dari prototype on it; fastest path to a working Android demo. |
| React Native | 0.81 | MIT | https://reactnative.dev | UI runtime (via Expo) | product | adopted | Comes with Expo. |
| TypeScript | ~5.9 | Apache-2.0 | https://www.typescriptlang.org | Types for field schemas and safety rules | product | adopted | Catches schema mistakes before runtime. |
| expo-sqlite (SQLCipher enabled) | SDK 54 bundled | MIT (SQLCipher Community Edition: BSD-style, verify) | https://docs.expo.dev/versions/latest/sdk/sqlite/ | On-device record queue (PR11), encrypted at rest with AES-256 | product | adopted | Supports SQLCipher via the `useSQLCipher` config-plugin option, version-matched to the SDK, no third-party native dependency. Requires a development build (not Expo Go). App refuses to start if `PRAGMA cipher_version` is empty, because plain SQLite silently ignores the key. |
| expo-secure-store | SDK 54 bundled | MIT | https://docs.expo.dev/versions/latest/sdk/securestore/ | Holds the database key and the hashed staff PIN | product | adopted | Values are encrypted by the Android Keystore, so the key cannot be read from copied storage. |
| expo-crypto | SDK 54 bundled | MIT | https://docs.expo.dev/versions/latest/sdk/crypto/ | Generates the random 256-bit database key; hashes the staff PIN | product | adopted | Part of the Expo SDK; no extra native module. |
| expo-audio | TODO | to verify | TODO | Recording and playing prompts | product | evaluating | Used in the Dari prototype. |
| sherpa-onnx | TODO | to verify | TODO | On-device speech recognition runtime | product | evaluating | Candidate runtime for running a small speech model offline on Android. Check Luganda model support and Expo integration. |
| whisper.rn (whisper.cpp) | TODO | to verify | TODO | On-device speech recognition runtime | product | evaluating | Alternative runtime. Whisper's Luganda quality is unverified; compare against MMS and Sunbird. |

## How to add an entry

One row per candidate. When you reject something, keep the row and write why. Link any measurement to [evaluation/results/](../../evaluation/results/).
