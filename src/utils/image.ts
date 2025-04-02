export const getProfileImageUrl = (profileImageUrl: string | null | undefined): string => {
  if (!profileImageUrl) return '/exampleProfile.jpg';
  return `http://localhost:8080${profileImageUrl}`;
}; 