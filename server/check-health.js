try {
  const res = await fetch('http://localhost:4000/api/health');
  const data = await res.json();
  console.log('API Server Health Check:', data);
} catch (e) {
  console.error('API Server not responding on port 4000:', e.message);
}
