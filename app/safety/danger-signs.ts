// Danger signs that trigger "Tell the nurse now" (PR9, RQ4.1).
// Only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs.
// NEVER add a sign without a source. RQ4.1 stays open until each entry is checked against its source
// document and Luganda phrases are written with native speakers.
//
// `phrasesEn` are English demo phrases only, for synthetic test clips.
// `phrasesLg` is empty on purpose: no Luganda phrase is added until a native speaker writes it.

export type DangerSign = {
  id: string;
  label: string;
  source: string;
  verified: boolean; // checked against the source document by a team member
  phrasesEn: string[];
  phrasesLg: string[];
};

export const DANGER_SIGNS: readonly DangerSign[] = [
  { id: 'imci_unable_to_drink', label: 'Child not able to drink or breastfeed', source: 'WHO IMCI general danger signs', verified: false, phrasesEn: ['not able to drink', 'cannot drink', 'not able to breastfeed', 'cannot breastfeed', 'unable to drink', 'unable to breastfeed'], phrasesLg: [] },
  { id: 'imci_vomits_everything', label: 'Child vomits everything', source: 'WHO IMCI general danger signs', verified: false, phrasesEn: ['vomits everything', 'vomiting everything', 'throws up everything'], phrasesLg: [] },
  { id: 'imci_convulsions', label: 'Convulsions', source: 'WHO IMCI general danger signs', verified: false, phrasesEn: ['convulsion', 'convulsions', 'fits', 'seizure'], phrasesLg: [] },
  { id: 'imci_lethargic_unconscious', label: 'Child lethargic or unconscious', source: 'WHO IMCI general danger signs', verified: false, phrasesEn: ['lethargic', 'unconscious', 'will not wake', 'cannot wake'], phrasesLg: [] },
  // TODO(RQ4.1): add WHO maternal danger signs and Uganda Clinical Guidelines entries, each with its source.
];
