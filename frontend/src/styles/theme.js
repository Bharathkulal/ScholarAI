export const theme = {
  colors: {
    brand: {
      primary: '#2563EB', // Blue
      secondary: '#60A5FA', // Sky Blue
      glow: 'rgba(37, 99, 235, 0.15)',
    },
    status: {
      success: '#10B981', // Green
      warning: '#F59E0B', // Amber
      danger: '#EF4444', // Red
      info: '#3B82F6', // Blue
    },
    background: {
      light: '#F8FAFC',
      surface: '#FFFFFF',
      darkest: '#0F172A',
      card: 'rgba(255, 255, 255, 0.8)',
      cardBorder: 'rgba(226, 232, 240, 0.8)',
    }
  },
  animations: {
    transitionFast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transitionNormal: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  layout: {
    maxWidth: '1280px',
    sidebarWidth: '260px',
  }
};
