import { Button, Input, InputNumber } from "antd";
import * as React from "react";

import { ITask } from '../_shared/interfaces/itask.interface';
import {
  DEFAULT_TASK_ESTIMATE,
  estimateFormatter,
  estimateParser,
  FormItem,
  roundToDecimal
} from "./estimator-form.component";
import {
  addTaskFormClass,
  clearAllButtonContainerClass,
  linkButtonClass,
  resultsGridClass,
  resultsHeaderClass,
  taskContainerClass,
  taskListClass,
  taskListItemClass,
  taskListItemContentClass,
  taskNameInputClass
} from "./estimator-form.styles";

interface ITaskListProps {
  tasks: ITask[];
  getFieldDecorator: (
    name: string,
    options: { [key: string]: any }
  ) => (ele: JSX.Element) => React.ReactNode;
  onAddTaskClick: () => void;
  onRemoveTaskClick: () => void;
  onClearAllClick: () => void;
  totalEstimate: number;
  totalDays: number;
  totalWeeks: number;
  totalSprints: number;
}

let inputRef: Input | null;
export const TaskList = ({
  tasks,
  getFieldDecorator,
  onAddTaskClick,
  onRemoveTaskClick,
  onClearAllClick,
  totalEstimate,
  totalDays,
  totalWeeks,
  totalSprints
}: ITaskListProps) => {
  const handleOnClick = () => {
    onAddTaskClick();
    if (inputRef) {
      inputRef.focus();
    }
  };
  const getTaskItems = (taskItems: ITask[]) => {
    return tasks.map((task, index) => (
      <li
        key={`${Math.random() * Math.floor(1000) + task.name}`}
        className={taskListItemClass}
      >
        <span className={taskListItemContentClass}>{task.name}</span>
        <span className={taskListItemContentClass}>{task.estimate}</span>
        <button
          className={linkButtonClass}
          type="button"
          onClick={onRemoveTaskClick.bind(null, index)}
        >
          x
        </button>
      </li>
    ));
  };
  return (
    <div className={taskContainerClass}>
      <div className={addTaskFormClass}>
        <FormItem>
          {getFieldDecorator("taskName", {})(
            <Input
              placeholder="Task Name"
              className={taskNameInputClass}
              ref={input => (inputRef = input)}
              autoFocus={true}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("taskEstimate", {
            initialValue: DEFAULT_TASK_ESTIMATE,
            rules: [{ type: "number", message: "Must be a number" }]
          })(
            <InputNumber
              placeholder="Estimate"
              formatter={estimateFormatter}
              parser={estimateParser}
            />
          )}
        </FormItem>
        <Button type="primary" htmlType="button" onClick={handleOnClick}>
          Add Task
        </Button>
      </div>
      <div className={clearAllButtonContainerClass}>
        <button
          type="button"
          className={linkButtonClass}
          onClick={onClearAllClick}
        >
          Clear All
        </button>
      </div>
      <div>
        <ul className={taskListClass}>{getTaskItems(tasks)}</ul>
      </div>
      <div className={resultsGridClass}>
        <div className={resultsHeaderClass}>Estimate</div>
        <div>hours</div>
        <div>days</div>
        <div>weeks</div>
        <div>sprints</div>
        <div>{roundToDecimal(totalEstimate)}</div>
        <div>{roundToDecimal(totalDays)}</div>
        <div>{roundToDecimal(totalWeeks)}</div>
        <div>{roundToDecimal(totalSprints)}</div>
      </div>
    </div>
  );
};
