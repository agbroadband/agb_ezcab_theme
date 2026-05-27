export default {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,  // keep viewBox="0 0 24 24"
          cleanupIds: false,     // keep agb-grad-* gradient IDs
          inlineStyles: false,   // keep <style> blocks + CSS custom properties
        },
      },
    },
  ],
};
