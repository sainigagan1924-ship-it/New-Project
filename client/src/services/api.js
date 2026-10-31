const API_BASE = '/api';

export async function fetchSearchResults(query, filters = {}) {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (filters.level && filters.level !== 'all') params.append('level', filters.level);
  if (filters.duration && filters.duration !== 'all') params.append('duration', filters.duration);
  if (filters.courseType && filters.courseType !== 'all') params.append('courseType', filters.courseType);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.features && filters.features.length > 0) {
    params.append('features', filters.features.join(','));
  }

  const res = await fetch(`${API_BASE}/search?${params.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchVideoAnalysis(videoId) {
  const res = await fetch(`${API_BASE}/video/${videoId}/analysis`);
  if (!res.ok) throw new Error('Failed to fetch video analysis');
  return res.json();
}

export async function fetchRoadmaps() {
  const res = await fetch(`${API_BASE}/roadmaps`);
  if (!res.ok) throw new Error('Failed to fetch roadmaps');
  return res.json();
}

export async function fetchRoadmapBySlug(slug) {
  const res = await fetch(`${API_BASE}/roadmaps/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch roadmap details');
  return res.json();
}

export async function toggleRoadmapCompletion(slug, stageId, videoId, completed) {
  const res = await fetch(`${API_BASE}/roadmaps/${slug}/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stageId, videoId, completed })
  });
  return res.json();
}

export async function fetchSavedItems() {
  const res = await fetch(`${API_BASE}/saved`);
  if (!res.ok) throw new Error('Failed to fetch saved items');
  return res.json();
}

export async function saveVideoItem(itemData) {
  const res = await fetch(`${API_BASE}/saved`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemData)
  });
  return res.json();
}

export async function updateSavedItem(id, updates) {
  const res = await fetch(`${API_BASE}/saved/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  return res.json();
}

export async function deleteSavedItem(id) {
  const res = await fetch(`${API_BASE}/saved/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`);
  return res.json();
}

export async function saveSettings(keys) {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(keys)
  });
  return res.json();
}

