import Head from 'next/head';
import VoiceCall from '../components/VoiceCall';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Voice Call Demo</title>
      </Head>
      <VoiceCall />
    </div>
  );
}
