// Phase 1 check page: every shared component in each of its states. Route: #/components
import { useState } from 'react';
import { AnswerButtons } from '../components/AnswerButtons.tsx';
import { NumberField } from '../components/NumberField.tsx';
import { Progress } from '../components/Progress.tsx';
import { AppBar, Banner, Button, Chip, SectionLabel, Tag } from '../components/ui.tsx';
import { navigate } from '../router.ts';

export function Gallery() {
  const [answer, setAnswer] = useState<string>();
  const [temp, setTemp] = useState('38.5');
  const [weight, setWeight] = useState('300');
  const [chip, setChip] = useState('all');
  return (
    <div className="page">
      <AppBar eyebrow="Phase 1" title="Components" onBack={() => navigate('/')} />
      <main className="page-body">
        <section className="gallery-block stack">
          <SectionLabel n={1}>Progress</SectionLabel>
          <Progress step={3} total={8} section="Safety questions" />
        </section>
        <section className="gallery-block stack">
          <SectionLabel n={2}>Answer buttons</SectionLabel>
          <p className="t-prompt">Is the child not able to drink or breastfeed?</p>
          <AnswerButtons name="Is the child not able to drink or breastfeed?" value={answer} onChange={setAnswer} />
        </section>
        <section className="gallery-block stack">
          <SectionLabel n={3}>Buttons</SectionLabel>
          <div className="row">
            <Button>Next</Button>
            <Button variant="outline">Enter measurements</Button>
            <Button variant="danger" icon="alert">Tell the nurse now</Button>
            <Button variant="quiet">Registration details</Button>
            <Button disabled>Save</Button>
          </div>
        </section>
        <section className="gallery-block stack">
          <SectionLabel n={4}>Status tags</SectionLabel>
          <div className="row">
            <Tag kind="urgent">Urgent</Tag>
            <Tag kind="card">Card ready</Tag>
            <Tag kind="flag">Not sure</Tag>
            <Tag kind="flag">Ask clinician</Tag>
            <Tag kind="outline">No card</Tag>
            <Tag kind="confirmed">Confirmed</Tag>
            <Tag kind="reported">Fever reported</Tag>
          </div>
        </section>
        <section className="gallery-block stack">
          <SectionLabel n={5}>Banners</SectionLabel>
          <Banner kind="danger" title="Tell the nurse now.">
            Danger sign reported: child not able to drink or breastfeed.
          </Banner>
          <Banner kind="ask" title="Not sure. Please ask a person.">
            We could not hear the answer. A staff member will ask you.
          </Banner>
          <Banner kind="info" title="Danger-sign set pending validation">
            Adult questions are not yet checked against the Uganda Clinical Guidelines.
          </Banner>
        </section>
        <section className="gallery-block stack">
          <SectionLabel n={6}>Filter chips</SectionLabel>
          <div className="row" role="group" aria-label="Filter queue">
            {['all', 'urgent', 'card', 'none'].map((c) => (
              <Chip key={c} selected={chip === c} onClick={() => setChip(c)}>
                {{ all: 'All 4', urgent: 'Urgent 1', card: 'Has card 3', none: 'No card 1' }[c]}
              </Chip>
            ))}
          </div>
        </section>
        <section className="gallery-block stack">
          <SectionLabel n={7}>Number fields</SectionLabel>
          <NumberField label="Temperature" unit="°C" min={30} max={45} value={temp} onChange={setTemp} />
          <NumberField label="Weight" unit="kg" min={0.5} max={250} value={weight} onChange={setWeight} />
        </section>
      </main>
    </div>
  );
}
