# Skills

Skills Claude Code can use in this repo. Each folder is copied unchanged from its source; do not edit them here. To update one, re-copy it from the source and note the date.

Every skill below was checked on 2026-10-03: `SKILL.md` at the top of its folder, frontmatter between `---` markers, and a `name` that matches the folder. All 69 pass. None of them ships a LICENSE file; check the upstream repo before reusing one outside this project.

Taste skills: the Dari and Portfolio repos store ten of them under folder names that do not match their `name` field (for example `taste-skill`). The user-level copies are byte-identical and correctly named, so those were copied.

Shared checklists used by the agent-skills family live in [../references/](../references/).

## Skills

| Skill | Type | Upstream source | Found in | SKILL.md valid | LICENSE | When to use it here |
|---|---|---|---|---|---|---|
| `impeccable` | skill | pbakaus/impeccable | Dari, Portfolio (also a plugin) | yes | no | Design review of every app/ screen and docs/design/design-system.md. Log findings in CHECKLIST F (Design). |
| `emil-design-eng` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | UI polish on intake card and scribe form: spacing, states, small details. |
| `design-taste-frontend` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as taste-skill), user-level | yes | no | Taste: overall visual direction for app/ so it does not look templated. |
| `design-taste-frontend-v1` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as taste-skill-v1), user-level | yes | no | Older Taste version. Use only if v2 output is off. |
| `high-end-visual-design` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as soft-skill), user-level | yes | no | Pitch deck and README visuals. Not the clinic app (too decorative). |
| `minimalist-ui` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as minimalist-skill), user-level | yes | no | Candidate style for the clinician view: calm, low-noise. |
| `industrial-brutalist-ui` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as brutalist-skill), user-level | yes | no | Not a fit for the clinic app. Keep for reference. |
| `gpt-taste` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as gpt-tasteskill), user-level | yes | no | Landing-page motion. Not used in the app. |
| `image-to-code` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as image-to-code-skill), user-level | yes | no | Turning a screen mockup into code if Figma is skipped. |
| `redesign-existing-projects` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as redesign-skill), user-level | yes | no | Second-pass polish of finished screens. |
| `stitch-design-taste` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as stitch-skill), user-level | yes | no | Generating a DESIGN.md for Google Stitch. Optional. |
| `full-output-enforcement` | skill | Leonxlnx/taste-skill | Dari, Portfolio (as output-skill), user-level | yes | no | Long generated files (seed docs, schemas) without truncation. |
| `brandkit` | skill | Leonxlnx/taste-skill | Dari, Portfolio, user-level | yes | no | Product name and logo once [PRODUCT NAME] is chosen. |
| `imagegen-frontend-mobile` | skill | Leonxlnx/taste-skill | Dari, Portfolio, user-level | yes | no | Quick mobile screen concepts before building. |
| `imagegen-frontend-web` | skill | Leonxlnx/taste-skill | Dari, Portfolio, user-level | yes | no | Not used (no website). |
| `animate` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Web animation. Rarely needed here. |
| `animate-expo` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Motion in the Expo app: recording pulse, confirm states. |
| `animation-vocabulary` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Naming a motion effect. |
| `apple-design` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Touch and motion principles for the clinician view. |
| `ask-sonner` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Not used (web toasts). |
| `break-ui` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Stress-test screens with long Luganda strings, missing fields, huge counts. |
| `find-animation-opportunities` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Optional motion pass. |
| `improve-animations` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Optional motion audit. |
| `review-animations` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Review a motion change. |
| `mobile-native` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Android touch behaviour, safe areas, input zoom. |
| `pick-ui-library` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Choosing a component library, if any. |
| `prototype` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Throwaway prototypes of the intake flow. |
| `write-swift` | skill | emilkowalski/skills | Dari, Portfolio, user-level | yes | no | Not used (Android). |
| `api-and-interface-design` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Field schemas and module boundaries between intake, scribe, safety, sync. |
| `browser-testing-with-devtools` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Not used unless a web build is added. |
| `ci-cd-and-automation` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | If scripts/check is wired into GitHub Actions. |
| `code-review-and-quality` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Every PR before merge. |
| `code-simplification` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Cleanup passes. |
| `constraint-driven-development` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Keeping the offline, small-model and no-diagnosis limits in every change. |
| `context-engineering` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Keeping CLAUDE.md useful. |
| `debugging-and-error-recovery` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | When the speech pipeline or sync breaks. |
| `deprecation-and-migration` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Rarely needed in a weekend build. |
| `documentation-and-adrs` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Recording design decisions (D#). |
| `doubt-driven-development` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Challenging safety claims before they reach the video. |
| `frontend-ui-engineering` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Building app/ screens. |
| `git-workflow-and-versioning` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Branches, commits with IDs, PRs. |
| `idea-refine` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Sharpening the problem statement. |
| `incremental-implementation` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Building intake, scribe, sync one slice at a time. |
| `interview-me` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Drafting the clinician interview (RQ7.2). |
| `observability-and-instrumentation` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Logging latency and flag rates for eval/. |
| `performance-optimization` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Model size, RAM and latency work (RQ6.1, RQ6.3). |
| `planning-and-task-breakdown` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Turning CHECKLIST.md into tasks. |
| `security-and-hardening` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Data at rest on the shared device, no secrets, no real patient data. |
| `shipping-and-launch` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Final-hour submission pass. |
| `source-driven-development` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Citing guidelines and datasets correctly. |
| `spec-driven-development` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Writing PRD requirements (PR#). |
| `test-driven-development` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Safety rules and extractor tests. |
| `using-agent-skills` | skill | addyosmani/agent-skills | Dari, Portfolio | yes | no | Index for the agent-skills family. |
| `ponytail` | skill | DietrichGebert/ponytail | Dari, Portfolio (also a plugin) | yes | no | Keep the build small: stdlib and native first. |
| `ponytail-audit` | skill | DietrichGebert/ponytail | Dari, Portfolio | yes | no | Audit for over-engineering. |
| `ponytail-debt` | skill | DietrichGebert/ponytail | Dari, Portfolio | yes | no | List deliberate shortcuts. |
| `ponytail-gain` | skill | DietrichGebert/ponytail | Dari, Portfolio | yes | no | Measure what simplification saved. |
| `ponytail-help` | skill | DietrichGebert/ponytail | Dari, Portfolio | yes | no | Ponytail usage help. |
| `ponytail-review` | skill | DietrichGebert/ponytail | Dari, Portfolio | yes | no | Review a diff for bloat. |
| `graphify` | skill | Graphify-Labs/graphify | Dari, Portfolio, user-level; named in CLAUDE.md | yes | no | Knowledge graph of research sources. Trigger: /graphify. |
| `web-design-guidelines` | skill | user-level only, upstream not recorded | user-level | yes | no | Accessibility and interface review of screens (CHECKLIST F, Inclusivity). |
| `writing-guidelines` | skill | user-level only, upstream not recorded | user-level | yes | no | Plain-language review of docs and on-screen text. |
| `deploy-to-vercel` | skill | user-level only, upstream not recorded | user-level | yes | no | Not used (no web deploy). |
| `vercel-cli-with-tokens` | skill | user-level only, upstream not recorded | user-level | yes | no | Not used. |
| `vercel-composition-patterns` | skill | user-level only, upstream not recorded | user-level | yes | no | React component structure in app/. |
| `vercel-optimize` | skill | user-level only, upstream not recorded | user-level | yes | no | Not used. |
| `vercel-react-best-practices` | skill | user-level only, upstream not recorded | user-level | yes | no | React performance in app/. |
| `vercel-react-native-skills` | skill | user-level only, upstream not recorded | user-level | yes | no | React Native and Expo practices for app/. |
| `vercel-react-view-transitions` | skill | user-level only, upstream not recorded | user-level | yes | no | Not used (web only). |

## Plugins (install through Claude Code, not by copying)

| Plugin | Install | Found in | When to use it here |
|---|---|---|---|
| frontend-slides | `/plugin marketplace add https://github.com/zarazhangrui/frontend-slides.git` then `/plugin install frontend-slides@frontend-slides` | user-level skill copy only, not yet installed as a plugin (MIT) | Pitch deck and the slide parts of the video. |
| impeccable | `/plugin marketplace add https://github.com/pbakaus/impeccable.git` then `/plugin install impeccable@impeccable` | Dari and Portfolio settings, user settings | Same as the skill, plus its hooks. |
| ponytail | `/plugin marketplace add https://github.com/DietrichGebert/ponytail.git` then `/plugin install ponytail@ponytail` | Dari and Portfolio settings, user settings | Same as the skill, plus its hooks. |
| agent-skills | `/plugin marketplace add https://github.com/addyosmani/agent-skills.git` then `/plugin install agent-skills@addy-agent-skills` | user settings | Same skills as the agent-skills rows above. |
| superpowers, frontend-design, code-review, skill-creator, github, figma | `/plugin install <name>@claude-plugins-official` | user settings | Planning, review and Figma work. Figma needs authorising with `/mcp`. |

Not found anywhere: no INF repo was located on 2026-10-03, so nothing came from it.
