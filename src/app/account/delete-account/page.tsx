export default function DeleteAccountPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#2e3156",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#3a3d5c",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1>Delete Account</h1>
        <p style={{ marginTop: "20px", color: "#c7c7e6" }}>
          Are you sure you want to delete your account? This action cannot be undone.
        </p>

        <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
          <a
            href="/account"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#8b7cf6",
              color: "white",
              textDecoration: "none",
            }}
          >
            Cancel
          </a>

          <button
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: "#ff5f8a",
              color: "white",
              cursor: "pointer",
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </main>
  );
}