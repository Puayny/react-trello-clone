import React from 'react';
import './App.css';

/** Each TaskCard represents a single task */
class TaskCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section className="task-card">
        <header className="task-card-header">
          <input type="text" defaultValue="Task header"></input>
        </header>
        <div className="task-card-content">
          <textarea rows="5" defaultValue="Task card content"></textarea>

        </div>
      </section >
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
    this.state = {
      taskCardIds: [],
    }
  }

  addTask() {
    this.setState({ taskCardIds: this.state.taskCardIds.concat(null) });
  }

  getTaskCountDisplayElement() {
    const numTasks = this.state.taskCardIds.length;
    const taskCountText = `${numTasks} ${numTasks === 1 ? "task" : "tasks"}`;
    return (
      <div className="subboard-task-count-display">
        {taskCountText}
      </div>
    )
  }

  render() {
    const taskCards = this.state.taskCardIds.map(function (item, index) {
      return <TaskCard />
    })
    const taskCountDisplayElement = this.getTaskCountDisplayElement();

    return (
      <section className="subboard">
        <header className="subboard-header">{this.props.subboardName}</header>
        {taskCountDisplayElement}
        {taskCards}
        <button onClick={() => this.addTask()}>
          (+) ADD TASK
        </button>
      </section>
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
      <section className="board">
        <header className="board-header">
          React Assignment - Task Board
        </header>
        <div className="subboards">
          <Subboard subboardName="Pending" />
          <Subboard subboardName="In Progress" />
          <Subboard subboardName="Completed" />
        </div>
      </section>
    )
  }
}

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;
