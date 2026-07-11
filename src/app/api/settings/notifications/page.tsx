"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<any>(null);

  async function loadPrefs() {
    const res = await fetch("/api/settings/notifications/get");
    const data = await res.json();
    setPrefs(data);
  }

  async function updatePrefs(field: string, value: boolean) {
    const res = await fetch("/api/settings/notifications/update", {
      method: "POST",
      body: JSON.stringify({ [field]: value }),
    });
    const data = await res.json();
    setPrefs(data);
  }

  useEffect(() => {
    loadPrefs();
  }, []);

  if (!prefs) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-kindau-teal">Notification Settings</h1>

      <div className="space-y-4">
        <Toggle
          label="Email: Job Updates"
          value={prefs.emailJobUpdates}
          onChange={(v: boolean) => updatePrefs("emailJobUpdates", v)}
        />

        <Toggle
          label="Email: Offers"
          value={prefs.emailOffers}
          onChange={(v: boolean) => updatePrefs("emailOffers", v)}
        />

        <Toggle
          label="Email: Marketing"
          value={prefs.emailMarketing}
          onChange={(v: boolean) => updatePrefs("emailMarketing", v)}
        />

        <Toggle
          label="In‑App: Job Updates"
          value={prefs.inAppJobUpdates}
          onChange={(v: boolean) => updatePrefs("inAppJobUpdates", v)}
        />

        <Toggle
          label="In‑App: Offers"
          value={prefs.inAppOffers}
          onChange={(v: boolean) => updatePrefs("inAppOffers", v)}
        />

        <Toggle
          label="Do Not Disturb"
          value={prefs.doNotDisturb}
          onChange={(v: boolean) => updatePrefs("doNotDisturb", v)}
        />
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between border p-3 rounded-lg">
      <span className="text-gray-800">{label}</span>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5"
      />
    </label>
  );
}
