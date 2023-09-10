/* eslint-disable react/prop-types */
import { Fragment } from "react";
import { Col, Card } from "antd";
import { Droppable } from "react-beautiful-dnd";

import TaskItem from "./TaskItem";

const TasksByState = ({
  title,
  droppableId,
  tasks,
  handleTaskEditClick,
  handleTaskDeleteClick,
}) => {
  return (
    <Col span={8}>
      <Card className="tasks-state-container" title={title}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              className="droppable-zone"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks[droppableId].map((task, index) => (
                <Fragment key={task.id}>
                  <TaskItem
                    task={task}
                    index={index}
                    handleTaskEditClick={handleTaskEditClick}
                    handleTaskDeleteClick={handleTaskDeleteClick}
                  />
                </Fragment>
              ))}
            </div>
          )}
        </Droppable>
      </Card>
    </Col>
  );
};

export default TasksByState;
