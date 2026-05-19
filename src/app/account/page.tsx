export default function AccountPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#2e3156",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "#3a3d5c",
          padding: "40px",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "700px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          color: "white",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          My Account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#c7c7e6",
            marginBottom: "35px",
          }}
        >
          Manage your profile and space activity
        </p>

        <div
          style={{
            background: "#4a4d73",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            Profile Information
          </h2>

          <div style={{ lineHeight: "2" }}>
            <p>
              <strong>Name:</strong> Nasibu Saidi
            </p>

            <p>
              <strong>Email:</strong> adjinasibusaidi@gmail.com
            </p>

            <p>
              <strong>Status:</strong> Active User
            </p>

            <p>
              <strong>Membership:</strong> Premium Explorer
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#4a4d73",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h3>Saved Articles</h3>

            <p
              style={{
                fontSize: "32px",
                marginTop: "10px",
                color: "#9f8cff",
              }}
            >
              12
            </p>
          </div>

          <div
            style={{
              background: "#4a4d73",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <h3>Space Photos Viewed</h3>

            <p
              style={{
                fontSize: "32px",
                marginTop: "10px",
                color: "#ff8fd8",
              }}
            >
              48
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          <a
            href="/account/delete-account"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#8b7cf6",
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Delete Account
          </a>

          <a
            href="/logout"
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              background: "#ff5f8a",
              color: "white",
              fontSize: "16px",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </main>
  );
}