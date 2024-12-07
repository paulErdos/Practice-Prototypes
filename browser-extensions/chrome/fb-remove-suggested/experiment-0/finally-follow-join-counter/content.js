// Function to find and count spans
function countSpecificSpans() {
  // Words we're looking for
  const targetWords = ['Finally', 'Follow', 'Join'];
  
  // Use XPath to find spans with exact text, case-sensitive
  const spans = [];
  targetWords.forEach(word => {
    const xpath = `//span[contains(text(), "${word}")]`;
    const matchingSpans = document.evaluate(
      xpath, 
      document, 
      null, 
      XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, 
      null
    );
    
    for (let i = 0; i < matchingSpans.snapshotLength; i++) {
      spans.push(matchingSpans.snapshotItem(i));
    }
  });
  
  // Remove duplicates
  const uniqueSpans = [...new Set(spans)];
  
  // Create or update counter div
  let counterDiv = document.getElementById('finally-follow-join-counter');
  if (!counterDiv) {
    counterDiv = document.createElement('div');
    counterDiv.id = 'finally-follow-join-counter';
    counterDiv.style.position = 'fixed';
    counterDiv.style.top = '10px';
    counterDiv.style.right = '10px';
    counterDiv.style.backgroundColor = 'red';
    counterDiv.style.color = 'white';
    counterDiv.style.padding = '10px';
    counterDiv.style.zIndex = '10000';
    counterDiv.style.borderRadius = '5px';
    document.body.appendChild(counterDiv);
  }
  
  // Update counter text
  counterDiv.textContent = `Spans: ${uniqueSpans.length}`;
}

// Run on page load and create a MutationObserver for dynamic content
function initializeSpanCounter() {
  countSpecificSpans();
  
  // Create a MutationObserver to watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    // Debounce to prevent excessive calculations
    clearTimeout(window.spanCounterTimeout);
    window.spanCounterTimeout = setTimeout(countSpecificSpans, 500);
  });
  
  // Observe the entire document with all child nodes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Run the counter when the page loads
initializeSpanCounter();