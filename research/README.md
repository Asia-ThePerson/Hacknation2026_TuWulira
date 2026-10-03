# Research

Everything we learn before and while building, and how it turns into product decisions.

## Index

| File | What it holds | Owner |
|---|---|---|
| [questions.md](questions.md) | Every research question (RQ#), with tier, owner, status, answer and evidence | Beth (section 1), Asia (section 2), others TBD |
| [findings.md](findings.md) | Numbered findings (R#), each with evidence and the RQ it answers | Whoever answers the RQ |
| [analysis/landscape.md](analysis/landscape.md) | Landscape review, precedents (Penda, Mwana, mTrac, CottonAce, Sunbird) and idea scoring | Team |
| [sources/brief/](sources/brief/) | The brief and our own source documents | Team |
| [sources/notes/](sources/notes/) | One note per paper, guideline, case or standard. Links only, never copyrighted PDFs | Whoever reads it |

The register field mapping lives in [docs/product/register-field-map.md](../docs/product/register-field-map.md).

## How research feeds the product

```
RQ# (question)  ->  R# (finding)  ->  PR# (product requirement)  ->  D# (design decision) / F# (feature)
```

1. Pick an open RQ in [questions.md](questions.md). Tier 1 first.
2. Read sources. Write a note in `sources/notes/` named `<year>-<short-name>.md` with: link, what it says, country and year, what it does not cover.
3. Fill in the RQ's answer and evidence link, and set its status.
4. Add a finding R# to [findings.md](findings.md).
5. If it changes what we build, add or update a PR# in [docs/product/prd.md](../docs/product/prd.md) and the matching CHECKLIST.md item.

If you cannot answer an RQ in time, mark it `assumption` and write the assumption down. A stated assumption is better than a silent one.

## Note template

```markdown
# <Title> (<year>)
- Link:
- Type: paper / guideline / case / standard / dataset
- Country and year:
- What it says (2 to 4 lines, our words):
- What it does not cover:
- Used for: RQ#, R#
```
