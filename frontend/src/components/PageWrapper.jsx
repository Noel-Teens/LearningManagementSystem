export default function PageWrapper({ children }) {
  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto" }}>
      {children}
    </div>
  );
}
