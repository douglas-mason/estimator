import React from 'react';
import { Button, Input, InputNumber, Form } from 'antd';
import {
  addTaskFormClass,
  formContainerClass,
  formClass,
  modifyingFieldsContainer,
  formSubmitContainer,
  taskContainerClass,
  taskListItemClass,
  taskListItemContentClass,
  taskListClass,
  estimateResultClass,
  resultsGridClass,
  resultsHeaderClass,
  linkButtonClass,
  clearAllButtonContainerClass,
} from './estimator-form.styles';

import { TaskService } from '../_shared/services/task.service';

const FormItem = Form.Item;

const DEFAULT_TASK_ESTIMATE = 1;
const DEFAULT_SPRINT_LENGTH = 10;
const DEFAULT_MEETING_HOURS = 0;
const DEFAULT_PERCENT_FIXES = 10;
const DEFAULT_PERCENT_TESTING = 20;

export class EstimatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      totalEstimate: 0,
      isLoaded: false,
    };
    this.taskService = new TaskService();
  }

  componentDidMount() {
    const { form } = this.props;
    const tasks = this.taskService.getAll();
    this.setState(
      {
        tasks,
      },
      () => {
        if (tasks && tasks.length) {
          this.calculateEstimate(tasks, {
            percentFixes: DEFAULT_PERCENT_FIXES,
            percentTesting: DEFAULT_PERCENT_TESTING,
            meetingHours: DEFAULT_MEETING_HOURS,
            sprintLength: DEFAULT_SPRINT_LENGTH,
          });
        }
      }
    );
  }

  handleOnSubmit = e => {
    const { form } = this.props;
    const { tasks } = this.state;
    e && e.preventDefault();
    form.validateFields((err, values) => {
      if (err) return;
      if (!values['taskName']) {
        form.setFields({
          taskName: {
            errors: [new Error('Task Name is required')],
          },
        });
        return;
      }

      if (!values['taskEstimate']) {
        form.setFields({
          taskEstimate: {
            errors: [new Error('Task Estimate is required')],
          },
        });
        return;
      }

      const item = {
        name: values['taskName'],
        estimate: values['taskEstimate'],
      };
      this.calculateEstimate([...tasks, item], values);
      this.taskService.save(item);
      form.setFieldsValue({
        taskName: '',
        taskEstimate: 1,
      });
    });
  };

  calculateEstimate = (tasks, values) => {
    const totalTaskTime = tasks.reduce((sum, next) => sum + next.estimate, 0);
    const percentFixes = values['percentFixes'];
    const percentTesting = values['percentTesting'];
    const meetingHours = values['meetingHours'];
    const sprintLength = values['sprintLength'];
    let totalEstimate = totalTaskTime;
    totalEstimate += totalEstimate * (percentFixes / 100);
    totalEstimate += totalEstimate * (percentTesting / 100);
    totalEstimate += meetingHours;
    const totalDays = totalEstimate / 8;
    const totalWeeks = totalEstimate / 40;
    const totalSprints = totalEstimate / sprintLength;
    this.setState({
      isLoaded: true,
      tasks,
      totalEstimate,
      totalDays,
      totalWeeks,
      totalSprints,
    });
  };

  handleRemoveTask = indexToRemove => {
    const { tasks } = this.state;
    const { form } = this.props;
    const updatedTasks = tasks.filter((t, index) => indexToRemove !== index);
    this.setState(
      {
        tasks: updatedTasks,
      },
      () => {
        this.taskService.remove(indexToRemove);

        const values = form.getFieldsValue();
        const percentFixes = values['percentFixes'];
        const percentTesting = values['percentTesting'];
        const meetingHours = values['meetingHours'];
        const sprintLength = values['sprintLength'];

        this.calculateEstimate(updatedTasks, {
          percentFixes,
          percentTesting,
          meetingHours,
          sprintLength,
        });
      }
    );
  };

  handleRemoveAllTasks = () => {
    const updatedTasks = [];
    this.setState(
      {
        tasks: [],
      },
      () => {
        this.taskService.removeAll();
        this.clearEstimates();
      }
    );
  };

  clearEstimates = () => {
    this.setState({
      isLoaded: false,
      tasks: [],
      totalEstimate: 0,
      totalDays: 0,
      totalWeeks: 0,
      totalSprints: 0,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={formContainerClass}>
        <Form
          layout="inline"
          onSubmit={this.handleOnSubmit}
          className={formClass}
        >
          <div className={modifyingFieldsContainer}>
            <FormItem label="Percent of time testing">
              {getFieldDecorator('percentTesting', {
                initialValue: DEFAULT_PERCENT_TESTING,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="Percent of time working on bug fixes">
              {getFieldDecorator('percentFixes', {
                initialValue: DEFAULT_PERCENT_FIXES,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="Typical number of meeting hours per week">
              {getFieldDecorator('meetingHours', {
                initialValue: DEFAULT_MEETING_HOURS,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="Sprint length (in days)">
              {getFieldDecorator('sprintLength', {
                initialValue: DEFAULT_SPRINT_LENGTH,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
          </div>
          <TaskList
            getFieldDecorator={getFieldDecorator}
            tasks={this.state.tasks}
            onAddTaskClick={this.handleOnSubmit}
            onRemoveTaskClick={this.handleRemoveTask}
            onClearAllClick={this.handleRemoveAllTasks}
            {...this.state}
          />
        </Form>
      </div>
    );
  }
}

let inputRef;
const TaskList = ({
  tasks,
  getFieldDecorator,
  onAddTaskClick,
  onRemoveTaskClick,
  onClearAllClick,
  totalEstimate,
  totalDays,
  totalWeeks,
  totalSprints,
}) => {
  const getTaskItems = tasks => {
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
          onClick={onRemoveTaskClick.bind(this, index)}
        >
          x
        </button>
      </li>
    ));
  };

  return (
    <div className={taskContainerClass}>
      <div className={addTaskFormClass}>
        <FormItem label="Task Name">
          {getFieldDecorator('taskName', {})(
            <Input ref={input => (inputRef = input)} autoFocus />
          )}
        </FormItem>
        <FormItem label="Task Estimate (in hours)">
          {getFieldDecorator('taskEstimate', {
            initialValue: DEFAULT_TASK_ESTIMATE,
            rules: [{ type: 'number', message: 'Must be a number' }],
          })(<InputNumber />)}
        </FormItem>
        <Button
          htmlType="button"
          onClick={() => {
            onAddTaskClick();
            inputRef && inputRef.focus();
          }}
        >
          Add Task
        </Button>
      </div>
      <div className={clearAllButtonContainerClass}>
        <button className={linkButtonClass} onClick={onClearAllClick}>
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
        <div>{totalEstimate}</div>
        <div>{totalDays}</div>
        <div>{totalWeeks}</div>
        <div>{totalSprints}</div>
      </div>
    </div>
  );
};

export const WrappedEstimatorForm = Form.create()(EstimatorForm);
