'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { CourseCategory, CourseResource } from '@/lib/courses/types';

type FormState = {
  title: string;
  description: string;
  categoryId: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  published: boolean;
  allowDownload: boolean;
};

const emptyForm: FormState = {
  title: '',
  description: '',
  categoryId: 'cybersecurity',
  subject: '',
  difficulty: 'Beginner',
  author: '',
  published: false,
  allowDownload: true,
};

export default function AdminCoursesDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CourseResource[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [pdf, setPdf] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const me = await fetch('/api/admin/me');
    if (!me.ok) {
      setAuthed(false);
      return;
    }
    const meData = await me.json();
    setAuthed(true);
    setUsername(meData.username || 'admin');
    const res = await fetch('/api/admin/courses');
    if (!res.ok) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setCourses(data.courses || []);
    setCategories(data.categories || []);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoginError(data.error || 'Login failed');
      return;
    }
    setPassword('');
    await refresh();
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setCourses([]);
  }

  async function saveCourse(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.set(k, String(v)));
      if (pdf) body.set('pdf', pdf);
      if (cover) body.set('cover', cover);

      const res = await fetch(editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses', {
        method: editingId ? 'PATCH' : 'POST',
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMessage(editingId ? 'Resource updated.' : 'Resource created.');
      setForm(emptyForm);
      setPdf(null);
      setCover(null);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  }

  function startEdit(course: CourseResource) {
    setEditingId(course.id);
    setForm({
      title: course.title,
      description: course.description,
      categoryId: course.categoryId,
      subject: course.subject,
      difficulty: course.difficulty,
      author: course.author || '',
      published: course.published,
      allowDownload: course.allowDownload,
    });
    setPdf(null);
    setCover(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function togglePublish(course: CourseResource) {
    const body = new FormData();
    body.set('published', String(!course.published));
    await fetch(`/api/admin/courses/${course.id}`, { method: 'PATCH', body });
    await refresh();
  }

  async function remove(course: CourseResource) {
    if (!window.confirm(`Delete “${course.title}”? This cannot be undone.`)) return;
    await fetch(`/api/admin/courses/${course.id}`, { method: 'DELETE' });
    await refresh();
  }

  if (authed === null) {
    return (
      <p className="tool-note">
        <span className="loading-dot" />
        Checking admin session…
      </p>
    );
  }

  if (!authed) {
    return (
      <section className="tool-panel" style={{ maxWidth: 480 }}>
        <h2>Admin login</h2>
        <p className="tool-note">
          Configure <code>ADMIN_PASSWORD</code> and <code>SESSION_SECRET</code> in your environment.
          There is no default password.
        </p>
        <form onSubmit={login}>
          <label className="tool-label" htmlFor="admin-user">
            Username
          </label>
          <input
            id="admin-user"
            className="tool-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
          <label className="tool-label" htmlFor="admin-pass">
            Password
          </label>
          <input
            id="admin-pass"
            className="tool-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
          {loginError && <p className="feedback-toast error">{loginError}</p>}
          <button type="submit" className="tool-btn tool-btn-primary">
            Sign in
          </button>
        </form>
      </section>
    );
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">[ ADMIN · COURSES ]</div>
        <h1>
          Manage <em>Library</em>
        </h1>
        <p className="tool-lead">Signed in as {username}</p>
        <div className="tool-input-row">
          <button type="button" className="tool-btn tool-btn-orange" onClick={() => void logout()}>
            Sign out
          </button>
          <Link href="/courses" className="tool-btn">
            View public library
          </Link>
        </div>
      </header>

      <section className="tool-panel">
        <h2>{editingId ? 'Edit resource' : 'Upload PDF resource'}</h2>
        <form onSubmit={(e) => void saveCourse(e)}>
          <label className="tool-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="tool-input"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <label className="tool-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="tool-textarea"
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: '100%', marginBottom: 10 }}
          />
          <div className="course-filters">
            <select
              className="tool-select"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input
              className="tool-input"
              placeholder="Subject / language"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <select
              className="tool-select"
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value as FormState['difficulty'],
                })
              }
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <input
              className="tool-input"
              placeholder="Author (optional)"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </div>
          <div className="gen-options" style={{ marginTop: 8 }}>
            <label>
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Published
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.allowDownload}
                onChange={(e) => setForm({ ...form, allowDownload: e.target.checked })}
              />
              Allow download
            </label>
          </div>
          <label className="tool-label" htmlFor="pdf">
            PDF file {editingId ? '(optional replace)' : ''}
          </label>
          <input
            id="pdf"
            type="file"
            accept="application/pdf,.pdf"
            required={!editingId}
            onChange={(e) => setPdf(e.target.files?.[0] || null)}
            style={{ marginBottom: 10, color: 'var(--text)' }}
          />
          <label className="tool-label" htmlFor="cover">
            Cover image (optional JPEG/PNG)
          </label>
          <input
            id="cover"
            type="file"
            accept="image/jpeg,image/png,.jpg,.jpeg,.png"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
            style={{ marginBottom: 14, color: 'var(--text)' }}
          />
          <div className="tool-input-row">
            <button type="submit" className="tool-btn tool-btn-primary" disabled={busy}>
              {busy ? 'Saving…' : editingId ? 'Update resource' : 'Upload resource'}
            </button>
            {editingId && (
              <button
                type="button"
                className="tool-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                  setPdf(null);
                  setCover(null);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
          {message && <p className="feedback-toast">{message}</p>}
        </form>
      </section>

      <section className="tool-panel">
        <h2>Existing resources</h2>
        {courses.length === 0 ? (
          <div className="empty-state">No uploads yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Meta</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong style={{ color: '#fff' }}>{course.title}</strong>
                      <div className="course-meta">{course.pdfOriginalName}</div>
                    </td>
                    <td>{course.published ? 'Published' : 'Draft'}</td>
                    <td>
                      {course.difficulty}
                      <br />
                      {course.subject}
                    </td>
                    <td>
                      <div className="tool-input-row">
                        <button type="button" className="tool-btn" onClick={() => startEdit(course)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="tool-btn"
                          onClick={() => void togglePublish(course)}
                        >
                          {course.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <Link href={`/courses/${course.id}/read`} className="tool-btn">
                          Preview
                        </Link>
                        <button
                          type="button"
                          className="tool-btn tool-btn-orange"
                          onClick={() => void remove(course)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
