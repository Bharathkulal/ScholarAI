export const theme = {
  colors: {
    brand: {
      primary: '#8b5cf6', // Violet
      secondary: '#a855f7', // Purple
      glow: 'rgba(139, 92, 246, 0.15)',
    },
    status: {
      success: '#10b981', // Emerald
      warning: '#f59e0b', // Amber
      danger: '#ef4444', // Red
      info: '#3b82f6', // Blue
    },
    background: {
      darkest: '#020617',
      card: 'rgba(15, 23, 42, 0.5)',
      cardBorder: 'rgba(51, 65, 85, 0.8)',
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
