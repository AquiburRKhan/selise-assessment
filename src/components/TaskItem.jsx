/* eslint-disable react/prop-types */
import { Draggable } from "react-beautiful-dnd";
import { Button } from "antd";

const TaskItem = ({
  task,
  index,
  handleTaskEditClick,
  handleTaskDeleteClick,
}) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-item-inner">
            <div>
              <p>{task.title}</p>
              <p>{task.description}</p>
            </div>
            <div className="task-ctas">
              <Button
                onClick={() => handleTaskEditClick(task)}
                type="primary"
                style={{ marginBottom: "8px" }}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleTaskDeleteClick(task)}
                type="primary"
                danger
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
