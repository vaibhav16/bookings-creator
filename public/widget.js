(function() {
  'use strict';
  
  function initWidget() {
    const containers = document.querySelectorAll('[id^="ghl-booking"]');
    
    containers.forEach(container => {
      const configPath = container.getAttribute('data-config');
      if (!configPath) return;
      
      // Create iframe to embed the booking page
      const iframe = document.createElement('iframe');
      iframe.src = configPath.replace('/configs/', '/booking/').replace('.json', '');
      iframe.style.width = '100%';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      
      container.appendChild(iframe);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
