import React from 'react';
import './App.css';
import * as DbUtils from './utils/db-utils.js'


// For this exercise, assume there's only one user
const USER_ID = 1;
let DB = {};

/** Each TaskCard represents a single task */
class TaskCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskCardHtmlId: this.props.taskCardHtmlId,
      taskCardId: this.props.taskCardId,
      taskCardIndex: this.props.taskCardIndex,
      db: this.props.db,
    }
  }

  // When task card is dragged. Track id of dragged task card 
  handleTaskCardDragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
  }

  // Save changes made to task card inputs to db
  handleInputChange(db, event, cardPortion) {
    const newText = event.target.value;
    DbUtils.saveTaskCardChanges(db, this.state.taskCardId, newText, cardPortion)
  }

  render() {
    const taskCardDetails = DbUtils.retrieveTaskCardDetails(this.state.db, this.state.taskCardId);
    return (
      <section
        className="task-card"
        id={this.props.taskCardHtmlId}
        data-task-card-id={this.props.taskCardId}
        draggable={true}
        onDragStart={(event) => this.handleTaskCardDragStart(event)}
        onDragEnd={(event) => this.props.onDragEnd(event, this.state.taskCardIndex, this.state.taskCardHtmlId)}
      >
        <header className="task-card-header">
          <input type="text"
            defaultValue={taskCardDetails["header"]}
            placeholder="Task header"
            onChange={(event) => this.handleInputChange(this.state.db, event, "header")}
          ></input>
        </header>
        <div className="task-card-content">
          <textarea rows="5"
            defaultValue={taskCardDetails["content"]}
            placeholder="Task content"
            onChange={(event) => this.handleInputChange(this.state.db, event, "content")}
          ></textarea>
        </div>
      </section >
    )
  }
}

/**
 * One Subboard is used for each stage of task progression. 
 * Each Subboard consists of multiple TaskCards, which are saved in its state.
 * The state is then used to render the TaskCards, so if TaskCards are 
 * shifted (moved, created, deleted), just change the state and the rendered HTML
 * will change accordingly
*/
class Subboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskCardIds: [],
      db: this.props.db,
    }
  }

  // Prevent default drag over behavior when task card is dragged over a subboard
  handleTaskCardDragOver(event) {
    event.preventDefault();
  }

  // Move task card to new subboard when it is dragged and dropped over it
  handleTaskCardDrop(event) {
    // Ignore non-task card drops
    // There's definitely a better way
    const taskCardHtmlId = event.dataTransfer.getData('text');
    const taskCard = document.getElementById(taskCardHtmlId);
    if (taskCard === null || !taskCard.classList.contains("task-card")) {
      return;
    }

    event.preventDefault();
    // Only move task card when it is dragged to a subboard
    if (event.target.closest(".subboard") !== null) {
      const taskCardId = taskCard.dataset.taskCardId;
      this.setState({ taskCardIds: this.state.taskCardIds.concat([taskCardId]) });
      // For communication with the dragged task card, to denote that the
      // task card has been moved and the original one can be removed
      taskCard.dataset.isMoved = true;
    }
  }

  // Remove dragged task card from original subboard once it has been moved
  handleTaskCardDragEnd(event, taskCardIndex, taskCardHtmlId) {
    const taskCard = document.getElementById(taskCardHtmlId);
    // This attribute was used by the ondrop handler to denote that the task card
    // has been moved
    if (taskCard.dataset.isMoved) {
      taskCard.removeAttribute("data-is-moved");
      const taskCardIds = this.state.taskCardIds;
      const taskCardIdsNew = taskCardIds.slice(0, taskCardIndex).concat(taskCardIds.slice(taskCardIndex + 1));
      this.setState({ taskCardIds: taskCardIdsNew });
    }
  }

  // Add task card to subboard
  addTaskCard() {
    const taskCardId = DbUtils.createTaskCard(this.state.db, USER_ID);
    this.setState({ taskCardIds: this.state.taskCardIds.concat(taskCardId) });
  }

  // Create element that displays task count on subboard
  createTaskCountDisplayElement() {
    const numTasks = this.state.taskCardIds.length;
    const taskCountText = `${numTasks} ${numTasks === 1 ? "task" : "tasks"}`;
    return (
      <div className="subboard-task-count-display">
        {taskCountText}
      </div>
    )
  }

  render() {
    // Create task cards' JSX
    const taskCards = this.state.taskCardIds.map(function (taskCardId, taskCardIndex) {
      const taskCardHtmlId = this.props.subboardName + ":" + taskCardId + ":" + taskCardIndex;
      // Note: React will re-render elements created using map function when 
      // key changes, so set key to task card's html id, which will change
      // when the position of a task card shifts
      return (
        <TaskCard
          key={taskCardHtmlId}
          taskCardIndex={taskCardIndex}
          taskCardId={taskCardId}
          taskCardHtmlId={taskCardHtmlId}
          onDragEnd={((event, taskCardIndex, taskCardHtmlId) => this.handleTaskCardDragEnd(event, taskCardIndex, taskCardHtmlId)).bind(this)}
          db={this.state.db}
        />
      )
    }, this)

    // Create task count JSX
    const taskCountDisplayElement = this.createTaskCountDisplayElement();

    return (
      <section className="subboard"
        onDragOver={(event) => this.handleTaskCardDragOver(event)}
        onDrop={(event) => this.handleTaskCardDrop(event)}
      >
        <header className="subboard-header">{this.props.subboardName}</header>
        { taskCountDisplayElement}
        { taskCards}
        <button className="add-task-card-btn" onClick={() => this.addTaskCard()}>
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
    this.state = {
      db: DB
    }
  }

  render() {
    return (
      <section className="board">
        <header className="board-header">
          React Assignment - Task Board
        </header>
        <div className="subboards">
          <Subboard subboardName="Pending" db={this.state.db} />
          <Subboard subboardName="In Progress" db={this.state.db} />
          <Subboard subboardName="Completed" db={this.state.db} />
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
