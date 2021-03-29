import React from 'react';
import './App.css';

/**
 * Create unique task card ID
 * For this exercise, assume that max 1 task card 
 * created per user per millisecond
 * @param {string} userId
 * @param {Object} db
 * @returns task card ID
 */
function createTaskCardId(userId) {
  return "USER" + userId + "TIME" + Date.now();
}

// For this exercise, assume there's only one user
const USER_ID = 1;

/** Each TaskCard represents a single task */
class TaskCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      "id": createTaskCardId(USER_ID)
    }
  }

  // When element is dragged
  elementDrag(event) {
    event.dataTransfer.setData('text', event.target.id);
  }

  render() {
    return (
      <section
        className="task-card" id={this.state.id}
        draggable={true}
        onDragStart={(event) => this.elementDrag(event)}
      >
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

  // When another element is dragged over a subboard
  allowElementDrop(event) {
    event.preventDefault();
  }

  // When another element is dragged and dropped onto a subboard
  elementDrop(event) {
    event.preventDefault();
    const elementId = event.dataTransfer.getData('text');
    const subboard = event.target.closest(".subboard");
    subboard.appendChild(document.getElementById(elementId));
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
      return <TaskCard key={index} />
    })
    const taskCountDisplayElement = this.getTaskCountDisplayElement();

    return (
      <section className="subboard"
        onDragOver={(event) => this.allowElementDrop(event)}
        onDrop={(event) => this.elementDrop(event)}
      >
        <header className="subboard-header">{this.props.subboardName}</header>
        { taskCountDisplayElement}
        { taskCards}
        <button className="add-task-btn" onClick={() => this.addTask()}>
          (+) ADD TASK
        </button>
      </section >
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
