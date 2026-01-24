import JSZip from 'jszip';
import { Campaign } from '../types';

export const generateCampaignZip = async (campaign: Campaign): Promise<Blob> => {
  const zip = new JSZip();
  const folder = zip.folder(campaign.name.replace(/\s+/g, '_') || 'campaign');

  if (!folder) throw new Error("Failed to create zip folder");

  campaign.themes.forEach((theme, tIndex) => {
    const themeName = `Theme_${tIndex + 1}_${theme.title.replace(/[^a-z0-9]/gi, '_').substring(0, 20)}`;
    const themeFolder = folder.folder(themeName);

    if (themeFolder) {
      // Add theme rationale
      themeFolder.file('rationale.txt', theme.rationale);

      theme.posts.forEach((post, pIndex) => {
        const platformFolder = themeFolder.folder(post.platform);
        if (platformFolder) {
            const filename = `post_${pIndex + 1}_${post.platform}.txt`;
            const content = `SCHEDULED FOR: ${post.scheduledDate || 'Not Scheduled'}\n\nCONTENT:\n${post.content}\n\nIMAGE PROMPT:\n${post.imageDescription}`;
            platformFolder.file(filename, content);
        }
      });
    }
  });

  return await zip.generateAsync({ type: 'blob' });
};
