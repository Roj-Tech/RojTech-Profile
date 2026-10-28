'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import type { CourseCategory, CourseResource } from '@/lib/courses/types';
import { useTranslations } from '@/contexts/LocaleContext';

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
  const t = useTranslations();
  const a = t.admin;
  const c = t.courses;
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
      setLoginError(data.error || a.saveFailed);
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
      if (!res.ok) throw new Error(data.error || a.saveFailed);
      setMessage(editingId ? a.updated : a.created);
      setForm(emptyForm);
      setPdf(null);
      setCover(null);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : a.saveFailed);
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
    if (!window.confirm(a.deleteConfirm(course.title))) return;
    await fetch(`/api/admin/courses/${course.id}`, { method: 'DELETE' });
    await refresh();
  }

  function categoryLabel(id: string) {
    return c.categories[id] || categories.find((cat) => cat.id === id)?.name || id;
  }

  function difficultyLabel(value: string) {
    if (value === 'Beginner') return c.beginner;
    if (value === 'Intermediate') return c.intermediate;
    if (value === 'Advanced') return c.advanced;
    return value;
  }

  if (authed === null) {
    return (
      <p className="tool-note">
        <span className="loading-dot" />
        {a.checkingSession}
      </p>
    );
  }

  if (!authed) {
    return (
      <section className="tool-panel" style={{ maxWidth: 480 }}>
        <h2>{a.loginTitle}</h2>
        <p className="tool-note">{a.loginHint}</p>
        <form onSubmit={login}>
          <label className="tool-label" htmlFor="admin-user">
            {a.username}
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
            {a.password}
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
            {a.signIn}
          </button>
        </form>
      </section>
    );
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{a.kicker}</div>
        <h1>
          {a.title} <em>{a.titleEm}</em>
        </h1>
        <p className="tool-lead">{a.signedInAs(username)}</p>
        <div className="tool-input-row">
          <button type="button" className="tool-btn tool-btn-orange" onClick={() => void logout()}>
            {a.signOut}
          </button>
          <Link href="/courses" className="tool-btn">
            {a.viewPublic}
          </Link>
        </div>
      </header>

      <section className="tool-panel">
        <h2>{editingId ? a.editHeading : a.uploadHeading}</h2>
        <form onSubmit={(e) => void saveCourse(e)}>
          <label className="tool-label" htmlFor="title">
            {a.fieldTitle}
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
            {a.fieldDescription}
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
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {categoryLabel(cat.id)}
                </option>
              ))}
            </select>
            <input
              className="tool-input"
              placeholder={a.fieldSubject}
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
              <option value="Beginner">{c.beginner}</option>
              <option value="Intermediate">{c.intermediate}</option>
              <option value="Advanced">{c.advanced}</option>
            </select>
            <input
              className="tool-input"
              placeholder={a.fieldAuthor}
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
              {a.published}
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.allowDownload}
                onChange={(e) => setForm({ ...form, allowDownload: e.target.checked })}
              />
              {a.allowDownload}
            </label>
          </div>
          <label className="tool-label" htmlFor="pdf">
            {editingId ? a.pdfReplace : a.pdfFile}
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
            {a.coverOptional}
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
              {busy ? a.saving : editingId ? a.update : a.save}
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
                {a.cancelEdit}
              </button>
            )}
          </div>
          {message && <p className="feedback-toast">{message}</p>}
        </form>
      </section>

      <section className="tool-panel">
        <h2>{a.existing}</h2>
        {courses.length === 0 ? (
          <div className="empty-state">{a.noUploads}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>{a.fieldTitle}</th>
                  <th>{a.status}</th>
                  <th>{a.meta}</th>
                  <th>{a.actions}</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td>
                      <strong style={{ color: '#fff' }}>{course.title}</strong>
                      <div className="course-meta">{course.pdfOriginalName}</div>
                    </td>
                    <td>{course.published ? a.publishedStatus : a.draft}</td>
                    <td>
                      {difficultyLabel(course.difficulty)}
                      <br />
                      {course.subject}
                    </td>
                    <td>
                      <div className="tool-input-row">
                        <button type="button" className="tool-btn" onClick={() => startEdit(course)}>
                          {a.edit}
                        </button>
                        <button
                          type="button"
                          className="tool-btn"
                          onClick={() => void togglePublish(course)}
                        >
                          {course.published ? a.unpublish : a.publish}
                        </button>
                        <Link href={`/courses/${course.id}/read`} className="tool-btn">
                          {a.preview}
                        </Link>
                        <button
                          type="button"
                          className="tool-btn tool-btn-orange"
                          onClick={() => void remove(course)}
                        >
                          {a.delete}
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
