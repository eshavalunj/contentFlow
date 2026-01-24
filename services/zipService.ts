
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
      themeFolder.file('rationale.txt', theme.rationale);

      theme.posts.forEach((post) => {
        const platformFolder = themeFolder.folder(post.platform);
        if (platformFolder) {
            post.versions.forEach((v, vIndex) => {
                const versionFolder = platformFolder.folder(`Version_${vIndex + 1}_${v.label.replace(/\s+/g, '_')}`);
                if (versionFolder) {
                    v.frames.forEach((frame, fIndex) => {
                        const filename = `frame_${fIndex + 1}.txt`;
                        const content = `FRAME: ${fIndex + 1}\n\nCOPY:\n${frame.content}\n\nIMAGE PROMPT:\n${frame.imageDescription}`;
                        versionFolder.file(filename, content);
                    });
                }
            });
        }
      });
    }
  });

  return await zip.generateAsync({ type: 'blob' });
};
