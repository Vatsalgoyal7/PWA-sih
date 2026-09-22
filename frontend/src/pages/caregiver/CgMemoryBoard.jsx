// ============================================================
// CgMemoryBoard.jsx — Family Photo Memory Gallery
// Upload photos + captions + "show on patient screen" flag
// ============================================================
import React, { useState, useRef } from 'react'
import { lsGet, lsSet, LS } from './CgShared'
import './CgMemoryBoard.css'

const RELATIONS = ['Mother', 'Father', 'Son', 'Daughter', 'Grandchild', 'Sibling', 'Friend', 'Doctor', 'Spouse', 'Other']

export default function CgMemoryBoard() {
  const photos = lsGet(LS.MEMORY_PHOTOS, [])
  const [gallery, setGallery] = useState(photos)
  const [form, setForm] = useState({ caption: '', person: '', relation: '', showPatient: true })
  const [preview, setPreview] = useState(null)
  const [activeTab, setActiveTab] = useState('gallery')
  const [uploadMsg, setUploadMsg] = useState('')
  const fileRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleAdd = () => {
    if (!preview) return
    const newPhoto = {
      id: Date.now(),
      src: preview,
      caption: form.caption || 'Family Memory',
      person: form.person || 'Family Member',
      relation: form.relation || 'Family',
      showPatient: form.showPatient,
      date: new Date().toLocaleDateString('en-IN'),
    }
    const updated = [newPhoto, ...gallery]
    setGallery(updated)
    lsSet(LS.MEMORY_PHOTOS, updated)
    setPreview(null)
    setForm({ caption: '', person: '', relation: '', showPatient: true })
    setUploadMsg('✓ Photo added to Memory Board!')
    setTimeout(() => setUploadMsg(''), 2500)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = (id) => {
    const updated = gallery.filter(p => p.id !== id)
    setGallery(updated)
    lsSet(LS.MEMORY_PHOTOS, updated)
  }

  const handleToggleShow = (id) => {
    const updated = gallery.map(p => p.id === id ? { ...p, showPatient: !p.showPatient } : p)
    setGallery(updated)
    lsSet(LS.MEMORY_PHOTOS, updated)
  }

  const visibleCount = gallery.filter(p => p.showPatient).length

  return (
    <div className="cgdash-view">
      {/* Hero */}
      <div className="cg-hero-banner">
        <div className="cg-hero-tag"><span>🖼️</span><span>Reminiscence Therapy</span></div>
        <h1 className="cg-hero-title">Family Memory <span>Board</span></h1>
        <p className="cg-hero-sub">
          Upload family photos with names and captions. These appear on the patient's memory screen
          to trigger positive reminiscence and emotional connection.
        </p>
      </div>

      {/* Stats */}
      <div className="memory-stats-row">
        <div className="memory-stat-card">
          <span className="memory-stat-num">{gallery.length}</span>
          <span className="memory-stat-label">Total Photos</span>
        </div>
        <div className="memory-stat-card">
          <span className="memory-stat-num" style={{ color: '#27ae60' }}>{visibleCount}</span>
          <span className="memory-stat-label">Shown to Patient</span>
        </div>
        <div className="memory-stat-card">
          <span className="memory-stat-num" style={{ color: '#f59e0b' }}>{gallery.length - visibleCount}</span>
          <span className="memory-stat-label">Hidden</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="cog-tab-row">
        {[['gallery', '🖼️ Photo Gallery'], ['upload', '📤 Upload Photo']].map(([k, l]) => (
          <button key={k} className={`cog-tab-btn ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{l}</button>
        ))}
      </div>

      {/* GALLERY TAB */}
      {activeTab === 'gallery' && (
        gallery.length === 0 ? (
          <div className="memory-empty">
            <div className="memory-empty-icon">🖼️</div>
            <h3>No Photos Yet</h3>
            <p>Upload family photos to create a memory board for the patient.</p>
            <button className="cog-save-btn" style={{ width: 'auto', padding: '10px 24px' }} onClick={() => setActiveTab('upload')}>
              📤 Upload First Photo
            </button>
          </div>
        ) : (
          <div className="memory-gallery-grid">
            {gallery.map(photo => (
              <div key={photo.id} className={`memory-photo-card ${photo.showPatient ? 'visible' : 'hidden'}`}>
                <div className="memory-photo-wrap">
                  <img src={photo.src} alt={photo.caption} className="memory-photo-img"/>
                  {!photo.showPatient && (
                    <div className="memory-hidden-overlay">👁️ Hidden</div>
                  )}
                </div>
                <div className="memory-photo-info">
                  <div className="memory-photo-name">
                    <span className="memory-photo-person">{photo.person}</span>
                    <span className="memory-photo-relation">{photo.relation}</span>
                  </div>
                  {photo.caption && (
                    <p className="memory-photo-caption">{photo.caption}</p>
                  )}
                  <div className="memory-photo-actions">
                    <button
                      className={`memory-toggle-btn ${photo.showPatient ? 'showing' : ''}`}
                      onClick={() => handleToggleShow(photo.id)}
                    >
                      {photo.showPatient ? '👁️ Showing to Patient' : '🙈 Hidden'}
                    </button>
                    <button className="memory-del-btn" onClick={() => handleDelete(photo.id)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* UPLOAD TAB */}
      {activeTab === 'upload' && (
        <div className="memory-upload-card">
          <h3 className="mood-card-title">📤 Add New Memory Photo</h3>

          {/* Photo picker */}
          <div
            className="memory-drop-zone"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="memory-preview-img"/>
            ) : (
              <>
                <span className="memory-drop-icon">📷</span>
                <span className="memory-drop-text">Tap to select a photo</span>
                <span className="memory-drop-sub">JPG, PNG, WebP supported</span>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />

          <div className="handover-field-group">
            <label className="handover-label">Person's Name</label>
            <input
              className="handover-input"
              placeholder="e.g. Rahul (Son), Dr. Sharma"
              value={form.person}
              onChange={e => setForm(prev => ({ ...prev, person: e.target.value }))}
            />
          </div>

          <div className="handover-field-group">
            <label className="handover-label">Relationship</label>
            <div className="memory-relation-grid">
              {RELATIONS.map(r => (
                <button
                  key={r}
                  className={`handover-tpl-chip ${form.relation === r ? 'tag-active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, relation: r }))}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="handover-field-group">
            <label className="handover-label">Memory Caption</label>
            <input
              className="handover-input"
              placeholder="e.g. Family trip to Kaziranga 2019"
              value={form.caption}
              onChange={e => setForm(prev => ({ ...prev, caption: e.target.value }))}
            />
          </div>

          <div className="safezone-toggle-row">
            <div>
              <div className="safezone-toggle-label">Show on Patient's Screen</div>
              <div className="safezone-toggle-sub">Patient will see this photo in their memory gallery</div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={form.showPatient}
                onChange={() => setForm(prev => ({ ...prev, showPatient: !prev.showPatient }))}
              />
              <span className="toggle-track"><span className="toggle-thumb"/></span>
            </label>
          </div>

          <button className="cog-save-btn" onClick={handleAdd} disabled={!preview}>
            {uploadMsg || '🖼️ Add to Memory Board'}
          </button>
        </div>
      )}
    </div>
  )
}
