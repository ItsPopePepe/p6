import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  const { id } = req.query;

  // Validate id
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid token ID' });
  }

  // Build path to your JSON file
  const dataPath = path.resolve('./data/metadataMap.json');

  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const metadataMap = JSON.parse(rawData);

    const tokenData = metadataMap[id];
    if (!tokenData) {
      return res.status(404).json({ error: 'Token ID not found' });
    }

    // Construct the metadata response
    const metadataUrl = `https://gateway.lighthouse.storage/ipfs/${tokenData.metadataCid}`;
    const imageUrl = `https://gateway.lighthouse.storage/ipfs/${tokenData.imageCid}`;

    // You can fetch metadata JSON from metadataUrl and respond here,
    // or redirect client to metadataUrl directly. For example:

    // Option 1: Redirect client to the metadata JSON on IPFS:
    return res.redirect(302, metadataUrl);

    // Option 2: Or if you want to fetch metadata and return inline (needs fetch support):
    /*
    const response = await fetch(metadataUrl);
    const metadata = await response.json();
    // Modify image field to full URL:
    metadata.image = imageUrl;
    return res.status(200).json(metadata);
    */

  } catch (error) {
    console.error('Error reading metadata map:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
