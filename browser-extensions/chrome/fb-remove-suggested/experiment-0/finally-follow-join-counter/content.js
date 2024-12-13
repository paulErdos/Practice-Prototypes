function countSpecificSpans() {
  chrome.storage.sync.get(['finallyEnabled', 'followEnabled', 'joinEnabled'], (settings) => {
    const finallyEnabled = settings.finallyEnabled !== false;
    const followEnabled = settings.followEnabled !== false;
    const joinEnabled = settings.joinEnabled !== false;
    
    const targetWords = [
      ...(finallyEnabled ? ['Finally'] : []),
      ...(followEnabled ? ['Follow'] : []),
      ...(joinEnabled ? ['Join'] : [])
    ];
  
    if (targetWords.length === 0) {
      const counterDiv = document.getElementById('finally-follow-join-counter');
      if (counterDiv) {
        counterDiv.textContent = 'No words selected';
      }
      return;
    }
  
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
  
    const uniqueSpans = [...new Set(spans)];
  
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
  
    counterDiv.textContent = `Spans: ${uniqueSpans.length}`;

    uniqueSpans.forEach(span => {
      if (span.querySelector('.delete-span-btn')) return;

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.className = 'delete-span-btn';
      deleteBtn.style.marginLeft = '5px';
      deleteBtn.style.background = 'red';
      deleteBtn.style.color = 'white';
      deleteBtn.style.border = 'none';
      deleteBtn.style.borderRadius = '3px';
      deleteBtn.style.cursor = 'pointer';

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Find the 11th parent node
        let parentToDelete = span;
        for (let i = 0; i < 15; i++) {
          if (parentToDelete.parentElement) {
            parentToDelete = parentToDelete.parentElement;
          } else {
            break; // Stop if we run out of parents before reaching 11
          }
        }
        
        if (confirm(`Delete the 11th parent element containing "${span.textContent}"?`)) {
          parentToDelete.remove();
          countSpecificSpans();
        }
      });

      span.appendChild(deleteBtn);
    });
  });
}

function initializeSpanCounter() {
  countSpecificSpans();
  
  const observer = new MutationObserver((mutations) => {
    clearTimeout(window.spanCounterTimeout);
    window.spanCounterTimeout = setTimeout(countSpecificSpans, 500);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'settingsUpdate') {
      countSpecificSpans();
    }
  });
}

initializeSpanCounter();