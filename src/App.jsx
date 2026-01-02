import { useState, useEffect } from "react";

function App() {
  const [inputs, setInputs] = useState({
    fck: 25,
    msdx: 326.11,
    msdy: 361.34,
    b: 2300,
    l: 2300,
    totalH: 600,
    cover: 50,
    phi: 16,
    fyk: 500,
    vsd: 50,
    col_a: 400, // Column width (mm)
    col_b: 400, // Column depth (mm)
  });

  const [results, setResults] = useState({});

  const calculateDesign = () => {
    const {
      fck,
      msdx,
      msdy,
      b,
      l,
      totalH,
      cover,
      phi,
      fyk,
      vsd,
      col_a,
      col_b,
    } = inputs;
    const d = totalH - cover - phi / 2;
    const fcd = fck / 1.5;

    const msdX_per_m = msdx / (l / 1000);
    const msd_norm_X = (msdX_per_m * 1000000) / (fcd * 1000 * Math.pow(d, 2));
    let kzX = msd_norm_X > 0.04 ? 0.976 : 0.978;
    const asX = (msdx * 1000000) / (0.87 * fyk * kzX * d);

    const msdY_per_m = msdy / (b / 1000);
    const msd_norm_Y = (msdY_per_m * 1000000) / (fcd * 1000 * Math.pow(d, 2));
    let kzY = msd_norm_Y > 0.04 ? 0.976 : 0.978;
    const asY = (msdy * 1000000) / (0.87 * fyk * kzY * d);

    const k = Math.min(1 + Math.sqrt(200 / d), 2.0);
    const rho = Math.min(asX / (b * d), 0.02);
    const vrd_c = 0.12 * k * Math.pow(100 * rho * fck, 1 / 3);

    const v_wideBeam = (vsd * 1000) / (b * d);
    const u1 = 2 * (col_a + col_b) + 2 * Math.PI * (2 * d);
    const v_punching = (vsd * 1000) / (u1 * d);

    setResults({
      d: d.toFixed(0),
      asX: asX.toFixed(2),
      asY: asY.toFixed(2),
      wideBeamStatus: v_wideBeam < vrd_c ? "SAFE ✅" : "UNSAFE ❌",
      punchingStatus: v_punching < vrd_c ? "SAFE ✅" : "UNSAFE ❌",
    });
  };

  useEffect(() => {
    calculateDesign();
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setInputs((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    setInputs((prev) => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.topHeader}>
        <h1 style={styles.mainTitle}>Isolated Foundation Design</h1>
        <div style={styles.subTitle}>Structural Design Tool • ES EN 2015</div>
      </header>

      <div style={styles.mainContainer}>
        {/* INPUT PANEL */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.icon}>⚙️</span>
            <h2 style={styles.panelTitle}>Design Inputs</h2>
          </div>

          <div style={styles.inputGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Concrete Grade (fck) [MPa]</label>
              <select
                name="fck"
                value={inputs.fck}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="16">C16/20</option>
                <option value="20">C20/25</option>
                <option value="25">C25/30</option>
                <option value="30">C30/37</option>
                <option value="35">C35/45</option>
                <option value="40">C40/50</option>
                <option value="45">C45/55</option>
                <option value="50">C50/60</option>
              </select>
              <span
                style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}
              >
                Design Strength (fcd): {((inputs.fck * 0.85) / 1.5).toFixed(2)}{" "}
                MPa
              </span>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Moment Msdx (kNm)</label>
              <input
                type="number"
                name="msdx"
                value={inputs.msdx}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                style={styles.inputBox}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Foundation Width B (mm)</label>
              <input
                type="number"
                name="b"
                value={inputs.b}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                style={styles.inputBox}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Overall Depth H (mm)</label>
              <input
                type="number"
                name="totalH"
                value={inputs.totalH}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                style={styles.inputBox}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Design Shear Vsd (kN)</label>
              <input
                type="number"
                name="vsd"
                value={inputs.vsd}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                style={styles.inputBox}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Column Size (mm)</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="number"
                  name="col_a"
                  value={inputs.col_a}
                  onChange={handleChange}
                  onFocus={(e) => e.target.select()}
                  style={{ ...styles.inputBox, flex: 1, minWidth: "0" }}
                  placeholder="a"
                />
                <input
                  type="number"
                  name="col_b"
                  value={inputs.col_b}
                  onChange={handleChange}
                  onFocus={(e) => e.target.select()}
                  style={{ ...styles.inputBox, flex: 1, minWidth: "0" }}
                  placeholder="b"
                />
              </div>
            </div>
          </div>
        </section>

        {/* OUTPUT PANEL */}
        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <span style={styles.icon}>📉</span>
            <h2 style={styles.panelTitle}>Analysis Results</h2>
          </div>

          <div style={styles.resultCard}>
            <div style={styles.resLabel}>Effective Depth (d)</div>
            <div style={styles.resValue}>
              {results.d} <span style={styles.unit}>mm</span>
            </div>
          </div>

          <div style={styles.sectionDivider}>Required Steel Area</div>

          <div style={styles.steelGrid}>
            <div style={styles.steelItem}>
              <div style={styles.steelLabel}>As (X-Direction)</div>
              <div style={styles.steelValue}>
                {results.asX} <small>mm²</small>
              </div>
            </div>
            <div style={styles.steelItem}>
              <div style={styles.steelLabel}>As (Y-Direction)</div>
              <div style={styles.steelValue}>
                {results.asY} <small>mm²</small>
              </div>
            </div>
          </div>

          <div style={styles.sectionDivider}>Safety Checks</div>

          <div style={styles.checkRow}>
            <span>Wide Beam Shear Check</span>
            <span
              style={{
                ...styles.status,
                color: results.wideBeamStatus?.includes("SAFE")
                  ? "#10b981"
                  : "#ef4444",
              }}
            >
              {results.wideBeamStatus}
            </span>
          </div>
          <div style={styles.checkRow}>
            <span>Punching Shear Check</span>
            <span
              style={{
                ...styles.status,
                color: results.punchingStatus?.includes("SAFE")
                  ? "#10b981"
                  : "#ef4444",
              }}
            >
              {results.punchingStatus}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    paddingBottom: "60px",
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  },
  topHeader: {
    backgroundColor: "#0f172a",
    color: "white",
    padding: "50px 20px",
    textAlign: "center",
    marginBottom: "40px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  mainTitle: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "800",
    letterSpacing: "-1px",
  },
  subTitle: {
    opacity: 0.7,
    marginTop: "8px",
    fontSize: "1.1rem",
    fontWeight: "400",
  },
  mainContainer: {
    display: "grid",
    // እዚህ ጋር ብቻ ነው ማስተካከያ ያደረግኩት (ከ 420px ወደ 300px)
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    boxSizing: "border-box",
  },
  panel: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "35px",
    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    boxSizing: "border-box", // ሞባይል ላይ ከዳር እንዳይወጣ
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "30px",
    borderBottom: "2px solid #f1f5f9",
    paddingBottom: "15px",
  },
  icon: { fontSize: "1.8rem" },
  panelTitle: {
    margin: 0,
    fontSize: "1.4rem",
    color: "#1e293b",
    fontWeight: "700",
  },
  inputGrid: { display: "grid", gridTemplateColumns: "1fr", gap: "22px" },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.95rem", fontWeight: "600", color: "#475569" },
  inputBox: {
    padding: "14px 18px",
    borderRadius: "10px",
    border: "1px solid #cbd5e0",
    fontSize: "1.1rem",
    color: "#1e293b",
    backgroundColor: "#ffffff",
    width: "100%", // ሙሉ ስፋት እንዲይዝ
    boxSizing: "border-box",
  },
  select: {
    padding: "14px 18px",
    borderRadius: "10px",
    border: "1px solid #cbd5e0",
    fontSize: "1.1rem",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    width: "100%",
    boxSizing: "border-box",
  },
  resultCard: {
    backgroundColor: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    color: "#ffffff",
  },
  resLabel: {
    color: "#94a3b8",
    fontSize: "1rem",
    marginBottom: "8px",
    fontWeight: "500",
  },
  resValue: { fontSize: "2.5rem", fontWeight: "800", color: "#38bdf8" },
  unit: { fontSize: "1.2rem", fontWeight: "400", color: "#94a3b8" },
  sectionDivider: {
    margin: "30px 0 15px",
    fontSize: "0.85rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "8px",
  },
  steelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", // ሞባይል ላይ እንዲታጠፍ
    gap: "20px",
  },
  steelItem: {
    backgroundColor: "#f0fdf4",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #bbf7d0",
    textAlign: "center",
  },
  steelLabel: {
    fontSize: "0.85rem",
    color: "#166534",
    marginBottom: "8px",
    fontWeight: "600",
  },
  steelValue: { fontSize: "1.5rem", fontWeight: "800", color: "#15803d" },
  checkRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#334155",
    gap: "10px", // በጽሁፎቹ መካከል ክፍተት እንዲኖር
  },
  status: { fontWeight: "800", textAlign: "right" },
};

export default App;
