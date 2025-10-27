// components/PromoBox.jsx
export default function PromoBox({ children }) {
  return (
    <aside
      style={{
        border: '2px solid var(--highlight)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        backgroundColor: 'var(--background-4)',
      }}
    >
      {children}
    </aside>
  );
}
