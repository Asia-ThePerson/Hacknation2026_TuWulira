// The fixed answer set for yes/no questions (config/questions.lg-UG.json, answerTypes.yesNo).
import type { IconName } from './Icon.tsx';

export type Option = { value: string; label: string; icon?: IconName; uncertain?: boolean };

export const YES_NO: Option[] = [
  { value: 'yes', label: 'Yes', icon: 'check' },
  { value: 'no', label: 'No', icon: 'x' },
  { value: 'not_sure', label: 'Not sure', icon: 'question', uncertain: true },
  { value: 'ask_clinician', label: 'Ask clinician', icon: 'person', uncertain: true },
];
