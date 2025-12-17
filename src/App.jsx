import { useState } from "react";

export default function HealthForm() {
  const [form, setForm] = useState({
    Age: 30,
    Gender: "Male",
    BMI: 23.15,
    Smoking_Status: "Never",
    Sleep_Duration: 4.5,
    Chronic_Disease_History: "Heart Disease",
    Stress_Level: 6,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult("Your risk is "+data.prediction_category);
    } catch (err) {
      setResult({ error: "Failed to fetch API response" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Health Risk Assessment
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FORM */}
          <form className="space-y-4">
            <Field label="Age">
              <input type="number" value={form.Age} onChange={(e) => handleChange("Age", e.target.value)} />
            </Field>

            <Field label="Gender">
              <select value={form.Gender} onChange={(e) => handleChange("Gender", e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="BMI">
              <input type="number" step="1.0" value={form.BMI} onChange={(e) => handleChange("BMI", e.target.value)} />
            </Field>

            <Field label="Smoking Status">
              <select value={form.Smoking_Status} onChange={(e) => handleChange("Smoking_Status", e.target.value)}>
                <option>Never</option>
                <option>Former</option>
                <option>Current</option>
              </select>
            </Field>

            <Field label="Sleep Duration (hours/day)">
              <input type="number" step="0.1" value={form.Sleep_Duration} onChange={(e) => handleChange("Sleep_Duration", e.target.value)} />
            </Field>

            <Field label="Chronic Disease History">
              <select value={form.Chronic_Disease_History} onChange={(e) => handleChange("Chronic_Disease_History", e.target.value)}>
                <option>Heart Disease</option>
                <option>Diabetes</option>
                <option>Hypertension</option>
                <option>None</option>
              </select>
            </Field>

            <Field label="Stress Level (1-10)">
              <input type="number" min="1" max="10" value={form.Stress_Level} onChange={(e) => handleChange("Stress_Level", e.target.value)} />
            </Field>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>

          {/* RESPONSE */}
          <div className="bg-gray-50 rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">API Response</h3>
            {!result && <p className="text-gray-400">Submit the form to see response</p>}
            {result && (
              <pre className="text-sm font-bold text-red-800 whitespace-pre-wrap bg-white p-4 rounded-lg border">
                {result}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
      {children && (
        <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          {children}
        </div>
      )}
    </div>
  );
}
