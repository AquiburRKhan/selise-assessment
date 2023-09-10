import { useState } from "react";
import { Row, Col, Button } from "antd";
import { DragDropContext } from "react-beautiful-dnd";
import TaskFormModal from "./components/TaskFormModal";
import "./App.css";
import TasksByState from "./components/TasksByState";

const App = () => {
  const STATES = [
    {
      title: "To-do",
      droppableId: "todo",
    },
    {
      title: "In-progress",
      droppableId: "inProgress",
    },
    {
      title: "Done",
      droppableId: "done",
    },
  ];
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [tasks, setTasks] = useState(
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : {
          todo: [],
          inProgress: [],
          done: [],
        }
  );

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const toggleAddTaskModal = () => {
    if (showAddTaskModal) {
      setSelectedTask({});
    }

    setShowAddTaskModal(!showAddTaskModal);
  };

  const onTaskAdd = (task) => {
    const newTasksObject = { ...tasks };
    newTasksObject[task.status].push(task);
    setTasks(newTasksObject);
    saveTasksToLocalStorage(newTasksObject);
    toggleAddTaskModal();
  };

  const onTaskEdit = (task) => {
    const newTasksObject = { ...tasks };
    newTasksObject[task.status] = tasks[task.status].map((t) => {
      if (t.id === task.id) {
        return task;
      }

      return t;
    });

    setTasks(newTasksObject);
    saveTasksToLocalStorage(newTasksObject);
    toggleAddTaskModal();
  };

  const handleTaskEditClick = (task) => {
    setSelectedTask(task);
    toggleAddTaskModal();
  };

  const handleTaskDeleteClick = (task) => {
    const newTasksObject = { ...tasks };
    newTasksObject[task.status] = tasks[task.status].filter(
      (t) => t.id !== task.id
    );
    setTasks(newTasksObject);
    saveTasksToLocalStorage(newTasksObject);
  };

  const removeFromTasksList = (list, index) => {
    const result = Array.from(list);
    const [removed] = result.splice(index, 1);
    return [removed, result];
  };

  const addToTasksList = (list, index, element) => {
    const result = Array.from(list);
    result.splice(index, 0, element);
    return result;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const tempTasksList = { ...tasks };

    const sourceTaskList = tempTasksList[result.source.droppableId];
    const [removedTask, newSourceTasksList] = removeFromTasksList(
      sourceTaskList,
      result.source.index
    );
    tempTasksList[result.source.droppableId] = newSourceTasksList;

    const destinationList = tempTasksList[result.destination.droppableId];
    removedTask.status = result.destination.droppableId;
    tempTasksList[result.destination.droppableId] = addToTasksList(
      destinationList,
      result.destination.index,
      removedTask
    );

    setTasks(tempTasksList);
    saveTasksToLocalStorage(tempTasksList);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row>
          <Col className="header-container" span={24}>
            <h1 className="header">Selise Task Manager</h1>
          </Col>
        </Row>
        <Row>
          <Col className="add-task-container" span={24}>
            <Button
              className="add-task-btn"
              onClick={() => toggleAddTaskModal()}
              type="primary"
            >
              Add Task
            </Button>
          </Col>
        </Row>
        <Row gutter={16}>
          {STATES.map((state) => (
            <TasksByState
              key={state.droppableId}
              title={state.title}
              droppableId={state.droppableId}
              tasks={tasks}
              handleTaskEditClick={handleTaskEditClick}
              handleTaskDeleteClick={handleTaskDeleteClick}
            />
          ))}
        </Row>
      </DragDropContext>
      {showAddTaskModal ? (
        <TaskFormModal
          selectedTask={selectedTask}
          showAddTaskModal={showAddTaskModal}
          toggleAddTaskModal={toggleAddTaskModal}
          onTaskAdd={onTaskAdd}
          onTaskEdit={onTaskEdit}
        />
      ) : null}
    </>
  );
};

export default App;
