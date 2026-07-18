"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import * as usersApi from "@/lib/users-api";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Chip from "@/components/ui/Chip";
import Switch from "@/components/ui/Switch";
import TextField from "@/components/ui/TextField";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { theme, toggle } = useTheme();

  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const [cpCurrent, setCpCurrent] = useState("");
  const [cpNew, setCpNew] = useState("");
  const [cpConfirm, setCpConfirm] = useState("");
  const [cpSaving, setCpSaving] = useState(false);
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState("");

  function startEditing() {
    if (!user) return;
    setFirstName(user.name.firstName);
    setMiddleName(user.name.middleName || "");
    setLastName(user.name.lastName);
    setEditing(true);
    setSaveError("");
    setSaveSuccess("");
  }

  function cancelEditing() {
    setEditing(false);
    setSaveError("");
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaveError("");
    setSaveSuccess("");
    setSaving(true);
    try {
      await usersApi.updateUser(user._id, {
        name: { firstName, middleName: middleName || undefined, lastName },
      });
      setSaveSuccess("Profile updated successfully");
      setEditing(false);
      if (refreshUser) refreshUser();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setCpError("");
    setCpSuccess("");

    if (cpNew !== cpConfirm) {
      setCpError("New passwords do not match");
      return;
    }
    if (cpNew.length < 6) {
      setCpError("New password must be at least 6 characters");
      return;
    }

    setCpSaving(true);
    try {
      await usersApi.changePassword(cpCurrent, cpNew);
      setCpSuccess("Password changed successfully");
      setCpCurrent("");
      setCpNew("");
      setCpConfirm("");
    } catch (err: unknown) {
      setCpError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setCpSaving(false);
    }
  }

  if (!user) return null;

  const initials = `${user.name.firstName[0]}${user.name.lastName[0]}`.toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="m3-headline-medium text-on-surface">Profile</h1>
        <p className="m3-body-small text-on-surface-variant">Manage your account settings</p>
      </div>

      <Card className="!p-5">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center m3-shape-full bg-primary text-on-primary m3-title-large font-bold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="m3-title-medium text-on-surface truncate">{user.name.firstName} {user.name.lastName}</p>
            <p className="m3-body-small text-on-surface-variant truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Chip variant="input">
            {user.userType}
          </Chip>
          <Chip variant="suggestion">
            {user.authProvider === "google" ? "Google" : "Local"}
          </Chip>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="m3-title-medium text-on-surface">Personal Information</h2>
          {!editing && (
            <Button variant="tonal" onClick={startEditing}>Edit</Button>
          )}
        </div>

        {saveSuccess && (
          <p className="mb-4 m3-body-small text-on-tertiary-container bg-tertiary-container m3-shape-sm px-4 py-3">{saveSuccess}</p>
        )}
        {saveError && (
          <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">{saveError}</p>
        )}

          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <TextField
                  label="First"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <TextField
                  label="Middle"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
                <TextField
                  label="Last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            <div className="flex gap-3">
              <Button type="submit" variant="filled" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button type="button" variant="outlined" onClick={cancelEditing}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              {["First Name", "Middle Name", "Last Name"].map((label, i) => {
                const val = i === 0 ? user.name.firstName : i === 1 ? (user.name.middleName || "—") : user.name.lastName;
                return (
                  <div key={label}>
                    <p className="m3-label-small text-on-surface-variant uppercase">{label}</p>
                    <p className="mt-0.5 m3-body-medium text-on-surface">{val}</p>
                  </div>
                );
              })}
            </div>
            <div>
              <p className="m3-label-small text-on-surface-variant uppercase">Email</p>
              <p className="mt-0.5 m3-body-medium text-on-surface">{user.email}</p>
            </div>
          </div>
        )}
      </Card>

      {user.authProvider === "local" && (
        <Card>
          <h2 className="m3-title-medium text-on-surface mb-5">Change Password</h2>

          {cpSuccess && (
            <p className="mb-4 m3-body-small text-on-tertiary-container bg-tertiary-container m3-shape-sm px-4 py-3">{cpSuccess}</p>
          )}
          {cpError && (
            <p className="mb-4 m3-body-small text-on-error-container bg-error-container m3-shape-sm px-4 py-3">{cpError}</p>
          )}

          <form onSubmit={handleChangePassword} className="space-y-5">
            <TextField
              label="Current Password"
              type="password"
              value={cpCurrent}
              onChange={(e) => setCpCurrent(e.target.value)}
              required
              minLength={6}
            />
            <TextField
              label="New Password"
              type="password"
              value={cpNew}
              onChange={(e) => setCpNew(e.target.value)}
              required
              minLength={6}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={cpConfirm}
              onChange={(e) => setCpConfirm(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" variant="filled" disabled={cpSaving}>
              {cpSaving ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="m3-title-medium text-on-surface mb-5">Settings</h2>
        <Switch
          checked={theme === "dark"}
          onChange={toggle}
          label="Dark Mode"
          description="Toggle between light and dark theme"
        />
      </Card>
    </div>
  );
}
