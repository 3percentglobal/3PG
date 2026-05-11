export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://3percent.global');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const CLIENT_ID = 'f60efeafaa0d475a8d8c2796c9b3010a';
  const CLIENT_SECRET = '20bef5731e9849c988948f63475b2db3';
  const ARTIST_ID = '6AWsl1xDv2sVXnWjBPgR7q';

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    const albumsRes = await fetch(
      `https://api.spotify.com/v1/artists/${ARTIST_ID}/albums?include_groups=album,single,ep&market=CA&limit=50`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const albumsData = await albumsRes.json();

    const seen = {};
    const albums = (albumsData.items || []).filter(a => {
      if (seen[a.name]) return false;
      seen[a.name] = true;
      return true;
    });

    res.status(200).json({ albums });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
