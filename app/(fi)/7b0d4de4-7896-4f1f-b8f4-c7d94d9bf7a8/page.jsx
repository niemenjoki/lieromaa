import OptOutRedirect from './OptOutRedirect';

export const metadata = {
  title: 'Analytiikan poisto käytöstä | Lieromaa',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <main style={{ padding: '24px', fontFamily: 'Georgia, serif' }}>
      <OptOutRedirect />
      <p>Hetki...</p>
    </main>
  );
}
