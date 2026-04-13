
document.addEventListener('DOMContentLoaded', function() {
  // Player data
  const cskPlayers = [
    { name: "Ruturaj Gaikwad (c)", runs: 67, balls: 42, fours: 6, sixes: 3, status: "c Rashid Khan b Umesh Yadav" },
    { name: "Rachin Ravindra", runs: 43, balls: 29, fours: 5, sixes: 1, status: "c Miller b Mohit Sharma" },
    { name: "Daryl Mitchell", runs: 24, balls: 15, fours: 3, sixes: 0, status: "c Gill b Joshua Little" },
    { name: "Shivam Dube", runs: 35, balls: 18, fours: 2, sixes: 3, status: "not out" },
    { name: "Ravindra Jadeja", runs: 15, balls: 11, fours: 1, sixes: 0, status: "not out" },
    { name: "MS Dhoni", runs: 0, balls: 0, fours: 0, sixes: 0, status: "DNB" },
    { name: "Sameer Rizvi", runs: 0, balls: 0, fours: 0, sixes: 0, status: "DNB" }
  ];

  const gtPlayers = [
    { name: "Shubman Gill (c)", runs: 42, balls: 31, fours: 5, sixes: 1, status: "c Ravindra b Chahar" },
    { name: "Wriddhiman Saha (wk)", runs: 9, balls: 11, fours: 1, sixes: 0, status: "b Theekshana" },
    { name: "Sai Sudharsan", runs: 37, balls: 29, fours: 3, sixes: 1, status: "c Dube b Jadeja" },
    { name: "David Miller", runs: 26, balls: 19, fours: 2, sixes: 1, status: "c Gaikwad b Pathirana" },
    { name: "Vijay Shankar", runs: 14, balls: 12, fours: 1, sixes: 0, status: "b Jadeja" },
    { name: "Rahul Tewatia", runs: 18, balls: 11, fours: 2, sixes: 0, status: "not out" },
    { name: "Rashid Khan", runs: 8, balls: 5, fours: 1, sixes: 0, status: "run out" },
    { name: "Mohit Sharma", runs: 0, balls: 2, fours: 0, sixes: 0, status: "b Pathirana" }
  ];

  // Commentary data
  const commentaryData = [
    { over: "18.2", text: "WICKET! Pathirana with a brilliant yorker, Mohit Sharma is bowled! GT 156/8", type: "W" },
    { over: "18.1", text: "Pathirana to Mohit Sharma, no run, defends on the front foot", type: "dot" },
    { over: "17.6", text: "Jadeja to Tewatia, 1 run, worked to deep midwicket", type: "1" },
    { over: "17.5", text: "Jadeja to Rashid Khan, 1 run, pushes to cover and takes a quick single", type: "1" },
    { over: "17.4", text: "WICKET! Rashid Khan is run out! Brilliant throw from Dube at long-on! GT 154/7", type: "W" },
    { over: "17.3", text: "Jadeja to Rashid Khan, FOUR! Swept fine to the boundary", type: "4" },
    { over: "17.2", text: "Jadeja to Tewatia, 1 run, pushed to long-on", type: "1" },
    { over: "17.1", text: "Jadeja to Rashid Khan, 1 run, tapped to point", type: "1" },
    { over: "16.6", text: "Pathirana to Tewatia, FOUR! Inside edge past the keeper", type: "4" },
    { over: "16.5", text: "WICKET! Pathirana gets Miller! Caught by Gaikwad at long-off! GT 147/6", type: "W" }
  ];

  // Populate batsmen tables
  function populateBatsmenTable(players, tableId) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = '';
    
    players.forEach(player => {
      if (player.balls > 0 || player.status !== "DNB") {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `${player.name}<br><span style="font-size: 0.8rem; color: #666;">${player.status}</span>`;
        
        const runsCell = document.createElement('td');
        runsCell.textContent = player.runs;
        
        const ballsCell = document.createElement('td');
        ballsCell.textContent = player.balls;
        
        const foursCell = document.createElement('td');
        foursCell.textContent = player.fours;
        
        const sixesCell = document.createElement('td');
        sixesCell.textContent = player.sixes;
        
        const srCell = document.createElement('td');
        const strikeRate = player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(2) : '-';
        srCell.textContent = strikeRate;
        
        row.appendChild(nameCell);
        row.appendChild(runsCell);
        row.appendChild(ballsCell);
        row.appendChild(foursCell);
        row.appendChild(sixesCell);
        row.appendChild(srCell);
        
        tableBody.appendChild(row);
      }
    });
  }

  // Populate commentary
  function populateCommentary(data) {
    const commentaryContainer = document.getElementById('commentary');
    commentaryContainer.innerHTML = '';
    
    data.forEach(item => {
      const commentaryItem = document.createElement('div');
      commentaryItem.className = 'commentary-item';
      
      let ballClass = '';
      let ballText = '';
      
      if (item.type === '4') {
        ballClass = 'ball-4';
        ballText = 'FOUR';
      } else if (item.type === '6') {
        ballClass = 'ball-6';
        ballText = 'SIX';
      } else if (item.type === 'W') {
        ballClass = 'ball-W';
        ballText = 'WICKET';
      }
      
      const ballSpan = ballClass ? `<span class="${ballClass}">${ballText}</span>` : '';
      
      commentaryItem.innerHTML = `
        <div class="over">${item.over} overs: ${ballSpan}</div>
        <div class="text">${item.text}</div>
      `;
      
      commentaryContainer.appendChild(commentaryItem);
    });
  }

  // Initialize the page
  function init() {
    populateBatsmenTable(cskPlayers, 'csk-batsmen');
    populateBatsmenTable(gtPlayers, 'gt-batsmen');
    populateCommentary(commentaryData);
    
    // Add event listeners
    document.getElementById('update-score').addEventListener('click', function() {
      // Simulate score update
      let gtScore = parseInt(document.getElementById('gt-score').textContent);
      let gtOvers = parseFloat(document.getElementById('gt-overs').textContent);
      
      if (gtScore < 188) {
        gtScore += Math.floor(Math.random() * 3) + 1;
        gtOvers = Math.min(20, gtOvers + 0.1).toFixed(1);
        
        if (gtOvers.endsWith('.6')) {
          gtOvers = (parseInt(gtOvers) + 0.1).toFixed(1);
        }
        
        document.getElementById('gt-score').textContent = gtScore;
        document.getElementById('gt-overs').textContent = gtOvers;
        
        // Update UI to show "Updated" status
        this.textContent = "Updated!";
        setTimeout(() => {
          this.textContent = "Refresh Scores";
        }, 1500);
      } else {
        document.getElementById('match-status').textContent = "COMPLETED";
        document.getElementById('match-status').style.color = "green";
        document.getElementById('match-status').style.animation = "none";
        this.disabled = true;
        this.textContent = "Match Completed";
      }
    });
    
    // Handle view selector
    document.getElementById('view-selector').addEventListener('change', function() {
      // This would typically show/hide different sections
      // For this demo, we'll just alert the user
      alert(`View changed to: ${this.value}`);
    });
  }

  // Create placeholders for logos
  function createPlaceholderLogos() {
    // This function would create canvas elements for team logos
    // For simplicity, we'll use a data URI for the logo
    
    const cskLogoPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="%23f9cd05" stroke="%23333" stroke-width="2"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" font-weight="bold" fill="%23333">CSK</text></svg>';
    
    const gtLogoPlaceholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="%230b4283" stroke="%23333" stroke-width="2"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" font-weight="bold" fill="%23fff">GT</text></svg>';
    
    const cskLogo = document.querySelector('.csk .team-logo');
    const gtLogo = document.querySelector('.gt .team-logo');
    
    cskLogo.src = cskLogoPlaceholder;
    gtLogo.src = gtLogoPlaceholder;
  }
  function navigateToMatch() {
    const match = document.getElementById('other-matches').value;
    if (match) {
      window.location.href = match;
    }
  }
  
  // Initialize the app
  createPlaceholderLogos();
  init();
});
