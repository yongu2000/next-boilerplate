const IMAGE_STORAGE_URL = process.env.IMAGE_STORAGE_URL;

export const getProfileImageUrl = (profileImageUrl: string | null | undefined): string => {
  if (!profileImageUrl) return '/exampleProfile.jpg';
  return `${IMAGE_STORAGE_URL}${profileImageUrl}`;
}; 