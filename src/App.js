import React from 'react';
import './App.css';

/** Each TaskCard represents a single task */
class TaskCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Task card</div>
    )
  }
}

/**
 * One Subboard is used for each stage of task progression. 
 * Each Subboard consists of multiple TaskCards.
*/
class Subboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TaskCard />
    )
  }
}

/**
 * Board represents the overall task board
 * Each Board consists of multiple Subboards
 */
class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Subboard />
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Board />
    </div>
  );
}

export default App;
