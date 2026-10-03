// Hello-world shell. Runs synthetic transcripts through the real safety, intake and scribe logic
// so the flow can be seen before the speech model is wired in. All data here is SYNTHETIC.
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { buildIntakeCard } from './intake/intake-card.ts';
import { canSave, extract } from './scribe/extract.ts';
import { assessTurn } from './safety/index.ts';
import { color, minTouch, type } from './shared/tokens.ts';

const SAMPLES = [
  { label: 'Clear dictation', transcript: 'New patient female aged 34 temperature 38.5 weight 61', confidence: 0.92 },
  { label: 'Unsure dictation', transcript: 'New patient male aged 50 temperature 37.2', confidence: 0.55 },
  { label: 'Silence', transcript: '', confidence: 0 },
  { label: 'Danger sign', transcript: 'The child has had convulsions since morning', confidence: 0.9 },
];

export default function App() {
  const [i, setI] = useState(0);
  const turn = SAMPLES[i];
  const safety = assessTurn(turn);
  const card = buildIntakeCard([turn]);
  const drafts = safety.kind === 'ok' ? extract(turn.transcript, turn.confidence) : [];

  return (
    <ScrollView contentContainerStyle={s.screen}>
      <Text style={s.title}>[PRODUCT NAME]</Text>
      <Text style={s.muted}>Synthetic demo data only. Not a medical device.</Text>
      <View style={s.row}>
        {SAMPLES.map((x, n) => (
          <Pressable key={x.label} onPress={() => setI(n)} style={[s.button, n === i && s.buttonOn]} accessibilityRole="button">
            <Text style={[s.label, n === i && { color: color.onPrimary }]}>{x.label}</Text>
          </Pressable>
        ))}
      </View>

      {safety.kind === 'danger' && <Text style={[s.banner, s.danger]}>{safety.message}</Text>}
      {safety.kind === 'ask_person' && <Text style={[s.banner, s.ask]}>{safety.message}</Text>}

      <View style={s.card}>
        <Text style={s.label}>{card.label}</Text>
        <Text style={s.body}>{card.patientWords.join(' ') || '(nothing recorded)'}</Text>
      </View>

      {drafts.map((d) => (
        <View key={d.field} style={[s.field, d.flagged && s.flagged]}>
          <Text style={s.label}>{d.field}</Text>
          <Text style={s.body}>{String(d.value)}{d.flagged ? '   Check' : ''}</Text>
        </View>
      ))}
      {drafts.length > 0 && <Text style={s.body}>{canSave(drafts) ? 'Ready for clinician to confirm' : 'Confirm flagged fields before saving'}</Text>}
      <StatusBar style="dark" />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { padding: 16, paddingTop: 56, gap: 12, backgroundColor: color.bg, flexGrow: 1 },
  title: { ...type.title, color: color.text },
  muted: { ...type.label, color: color.textMuted },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: { minHeight: minTouch, paddingHorizontal: 16, justifyContent: 'center', borderRadius: 8, backgroundColor: color.surface },
  buttonOn: { backgroundColor: color.primary },
  banner: { ...type.body, fontWeight: '700', padding: 16, borderRadius: 8 },
  danger: { color: color.danger, backgroundColor: color.dangerBg },
  ask: { color: color.text, backgroundColor: color.surface },
  card: { padding: 16, borderRadius: 8, backgroundColor: color.surface, gap: 4 },
  field: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: color.surface },
  flagged: { backgroundColor: color.flagBg, borderColor: color.flag },
  label: { ...type.label, color: color.text },
  body: { ...type.body, color: color.text },
});
