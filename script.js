
//PlayerPool Object -------------------------------------------------------------------------------------------------
let playerPool = {
  _allAvailable: [],
  _allAssigned: [],
  get returnAvailablePool() {
    return this._allAvailable;
  },
  get returnAssignedPool() {
    return this._allAssigned;
  },
  addAvailablePlayers(newGamers) {
    newGamers.forEach((gamer) => {
      if ((this._allAvailable.length + this._allAssigned.length) < 18) {
        this._allAvailable.push(gamer);
        screenElements.addPlayerElement(gamer);
      } else {
        return
      }
    });
  },
  clearPlayers() {
    teams.clearTeams();
    screenElements.clearPlayerElements(this._allAvailable);
    this._allAvailable = [];
  },
  toOnTeam(assignedGamers) {
    assignedGamers.forEach((gamer) => {
      screenElements.togglePlayerFlag(gamer)
      this._allAssigned.push(gamer)
      let indexOf = this._allAvailable.indexOf(gamer);
      this._allAvailable.splice(indexOf,1);
    });
  },
  toOffTeam(abandonedGamers) {
    for (let i=0; i < abandonedGamers.length; i++) {
      this._allAvailable.push(abandonedGamers[i]);
      screenElements.togglePlayerFlag(abandonedGamers[i], true)
      this._allAssigned.splice(i,1);
    };
  },
};

//Teams Object ------------------------------------------------------------------------------------------------------
let teams = {
  _allTeams: [],
  get returnTeams() {
    return this._allTeams;
  },
  randomIndex() {
    return Math.floor(Math.random() * (playerPool.returnAvailablePool.length));
  },
  addTeam(sizeOfTeam) {
    let newTeam = [];
    for (let i = 0; i < sizeOfTeam; i++) {
      let randomGamer = playerPool.returnAvailablePool[this.randomIndex()];
      newTeam.push(randomGamer);
      playerPool.toOnTeam([randomGamer]);
    };
    this._allTeams.push(newTeam);
    screenElements.createTeamElement(newTeam);
  },
  createTeams(numberPlayers,numberTeams) {
    for (let i = 0; i < numberTeams; i++) {
      this.addTeam(numberPlayers);
    };
  },
  clearTeams() {
    playerPool.toOffTeam(playerPool.returnAssignedPool);
    screenElements.clearTeamElements(this._allTeams);
    this._allTeams = [];
  },
};

//Screen Elements Object -------------------------------------------------------------------------------------------
let screenElements = {
  _playerGrid: document.querySelector('div#playerGrid'),
  _teamGrid: document.querySelector('div#teamGrid'),
  addPlayerElement(playerName) {
    const newPlayerNode = document.createElement(`div`);
    newPlayerNode.setAttribute('id',`player_${playerName}`);
    newPlayerNode.classList.add('players');
    this._playerGrid.appendChild(newPlayerNode);
    const newPlayerNodeText = document.createElement('p');
    newPlayerNodeText.setAttribute('id',`playerText_${playerName}`);
    newPlayerNodeText.classList.add('playerText');
    newPlayerNodeText.innerHTML = `${playerName}`;
    newPlayerNode.appendChild(newPlayerNodeText);
  },
  removePlayerElement(playerName) {
    const playerNode = document.querySelector(`div#player_${playerName}`);
    this._playerGrid.removeChild(playerNode);
  },
  clearPlayerElements(playersArray) {
    playersArray.forEach((playerName) => {
      this.removePlayerElement(playerName);
    });
  },
  togglePlayerFlag(playerName, remove = false){
    const playerNode = document.querySelector(`div#player_${playerName}`);
    if (remove) {
      playerNode.classList.remove('assigned');
    } else {
      playerNode.classList.add('assigned');
    };
  },
  createTeamElement(teamArray) {
    //Create Team Wrapper
    const newTeamNode = document.createElement('div');
    newTeamNode.setAttribute('id',`team_${(teams.returnTeams.length)}`);
    newTeamNode.classList.add('teamContainer');
    newTeamNode.innerHTML = `Team ${(teams.returnTeams.length)}`
    this._teamGrid.appendChild(newTeamNode);
    //Create Team Member Element
    teamArray.forEach((teamMember) => {
      //Create the Team Member Div
      const newTeamMemberNode = document.createElement('div');
      newTeamMemberNode.setAttribute('id',`teamMember_${teamMember}`);
      newTeamMemberNode.classList.add('teamMembers');
      newTeamNode.appendChild(newTeamMemberNode);
      //Create the Team Member Text
      const newTeamMemberNodeText = document.createElement('p');
      newTeamMemberNodeText.setAttribute('id',`teamMemberText_${teamMember}`);
      newTeamMemberNodeText.classList.add('teamMemberText');
      newTeamMemberNodeText.innerHTML = `${teamMember}`;
      newTeamMemberNode.appendChild(newTeamMemberNodeText);
    })
  },
  removeTeamElement(teamArray) {
    const teamNumber = teams.returnTeams.indexOf(teamArray) + 1;
    const teamNode = document.querySelector(`div#team_${teamNumber}`);
    this._teamGrid.removeChild(teamNode);
  },
  clearTeamElements(teamsArray) {
    teamsArray.forEach((team) => {
      this.removeTeamElement(team);
    });
  },
};

//Buttons ------------------------------------------------------------------------------------------------------------

//Clear Players Button
const buttonClrPlayers = document.querySelector('button#clearPlayers');
buttonClrPlayers.addEventListener('click', (e) => {
  playerPool.clearPlayers();
});

//Clear Teams Button
const buttonClrTeams = document.querySelector('button#clearTeams');
buttonClrTeams.addEventListener('click', (e) => {
  teams.clearTeams();
});

//Enter Players Button
const buttonEnterPlayers = document.querySelector('button#enterPlayersButton');
buttonEnterPlayers.addEventListener('click', (e) => {
  const entry = document.querySelector("input#enterPlayers").value.toString();
  const arrayEntry = entry.split(', ');
  playerPool.addAvailablePlayers(arrayEntry);
});

//Generate Teams Button
const buttonGenerate = document.querySelector('button#generateButton');
buttonGenerate.addEventListener('click', (e) => {
  const numberPlayer = Number(document.querySelector("input#numberPlayers").value);
  const numberTeam = Number(document.querySelector("input#numberTeams").value);
  if((typeof(numberPlayer) != 'number') || (typeof(numberPlayer) != 'number')){
    alert('You didn\'t enter numbers! What are you up to O.o');
  } else if ((numberPlayer * numberTeam) <= playerPool._allAvailable.length){
    teams.createTeams(numberPlayer,numberTeam);
  } else {
    const maxTeams = (playerPool._allAvailable.length - (playerPool._allAvailable.length % numberPlayer)) / numberPlayer;
    teams.createTeams(numberPlayer,maxTeams);
  }
});
