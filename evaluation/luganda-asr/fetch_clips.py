"""Re-download the 3 Luganda test clips from Mozilla Common Voice 17.0 (CC0) for a local re-run.

The clips are real volunteers' voices, so they are never committed: they go to
resources/datasets/raw/common-voice-lg/, which .gitignore excludes. What is committed is
common-voice-clips.tsv (clip IDs, official transcripts, SHA-256), so anyone can fetch the exact same clips.

Downloads only what is needed: the Luganda test transcript list (about 4 MB, read in memory, used to
cross-check the transcripts) and the first 2 MB of the 487 MB test audio archive (an HTTP range request).
The full dataset is never downloaded. Python standard library only.

Source: an unofficial Hugging Face mirror of Common Voice Corpus 17.0 (licence CC0-1.0), because
Mozilla's own copies need an account. Transcripts are copied exactly; nothing is translated.

Run from the repo root:  python evaluation/luganda-asr/fetch_clips.py
"""
import csv
import hashlib
import io
import tarfile
import urllib.request
from pathlib import Path

MIRROR = "https://huggingface.co/datasets/0x3/common_voice_17_0/resolve/main"
TSV = f"{MIRROR}/transcript/lg/test.tsv"
TAR = f"{MIRROR}/audio/lg/test/lg_test_0.tar"
HERE = Path(__file__).resolve().parent
LIST = HERE / "common-voice-clips.tsv"  # committed: clip IDs, official transcripts, checksums
RAW = HERE.parents[1] / "resources" / "datasets" / "raw" / "common-voice-lg"  # gitignored: the audio


def get(url, byte_range=None):
    req = urllib.request.Request(url, headers={"Range": f"bytes={byte_range}"} if byte_range else {})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read()


def main():
    wanted = {r["file"]: r for r in csv.DictReader(open(LIST, encoding="utf-8"), delimiter="\t")}
    official = {r["path"]: r["sentence"] for r in csv.DictReader(io.StringIO(get(TSV).decode("utf-8")), delimiter="\t", quoting=csv.QUOTE_NONE)}
    for name, r in wanted.items():
        if official.get(name) != r["official_transcript"]:
            raise SystemExit(f"{name}: transcript in {LIST.name} does not match Common Voice")

    head = get(TAR, "0-2097151")  # first 2 MB only
    found = {}
    try:
        with tarfile.open(fileobj=io.BytesIO(head), mode="r:") as t:
            for m in t:
                name = m.name.split("/")[-1]
                if m.isfile() and name in wanted:
                    found[name] = t.extractfile(m).read()
    except tarfile.ReadError:
        pass  # the 2 MB slice ends mid-archive; earlier members are complete

    RAW.mkdir(parents=True, exist_ok=True)
    for name, r in wanted.items():
        if name not in found:
            raise SystemExit(f"{name} not in the first 2 MB of the archive")
        if hashlib.sha256(found[name]).hexdigest() != r["sha256"]:
            raise SystemExit(f"{name}: checksum differs from {LIST.name}")
        (RAW / name).write_bytes(found[name])
        print(f"{name}  {len(found[name])} bytes  checksum ok  {r['official_transcript']}")
    print(f"Saved to {RAW} (gitignored, local only)")


if __name__ == "__main__":
    main()
