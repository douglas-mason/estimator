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
} from './estimator-form.styles';

const FormItem = Form.Item;

export class EstimatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      totalEstimate: 0,
      isLoaded: false,
    };
  }

  handleOnSubmit = e => {
    const { form } = this.props;
    const { tasks } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
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
        totalEstimate,
        totalDays,
        totalWeeks,
        totalSprints,
      });
    });
  };

  handleOnAddTaskClick = () => {
    const { form } = this.props;
    const { tasks } = this.state;
    form.validateFields((err, values) => {
      if (!values['taskName']) {
        form.setFields({
          taskName: {
            errors: [new Error('Task Name is required')],
          },
        });
        return;
      }

      const item = {
        name: values['taskName'],
        estimate: values['taskEstimate'],
      };
      this.setState(
        {
          tasks: [...tasks, item],
        },
        () =>
          form.setFieldsValue({
            taskName: '',
            taskEstimate: undefined,
          })
      );
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
                initialValue: 20,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="Percent of time working on bug fixes">
              {getFieldDecorator('percentFixes', {
                initialValue: 10,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="Typical number of meeting hours per week">
              {getFieldDecorator('meetingHours', {
                initialValue: 0,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="Sprint length (in days)">
              {getFieldDecorator('sprintLength', {
                initialValue: 10,
                rules: [{ type: 'number', message: 'Must be a number' }],
              })(<InputNumber />)}
            </FormItem>
            <div className={formSubmitContainer}>
              <Button htmlType="submit">Calculate</Button>
            </div>
          </div>
          <TaskList
            getFieldDecorator={getFieldDecorator}
            tasks={this.state.tasks}
            onAddTaskClick={this.handleOnAddTaskClick}
            {...this.state}
          />
        </Form>
        {/* {this.state.isLoaded && (
          <div className={estimateResultClass}>
            <div>Total Estimate in Hours: {this.state.totalEstimate}</div>
            <div>in days: {this.state.totalDays}</div>
            <div>in weeks: {this.state.totalWeeks}</div>
            <div>in sprints: {this.state.totalSprints}</div>
          </div>
        )} */}
      </div>
    );
  }
}

const TaskList = ({
  tasks,
  getFieldDecorator,
  onAddTaskClick,
  totalEstimate,
  totalDays,
  totalWeeks,
  totalSprints,
}) => {
  const getTaskItems = tasks => {
    return tasks.map(task => (
      <li key={`${task.name + task.estimate}`} className={taskListItemClass}>
        <span className={taskListItemContentClass}>{task.name}</span>
        <span className={taskListItemContentClass}>{task.estimate}</span>
      </li>
    ));
  };

  return (
    <div className={taskContainerClass}>
      <div className={addTaskFormClass}>
        <FormItem label="Task Name">
          {getFieldDecorator('taskName', {})(<Input />)}
        </FormItem>
        <FormItem label="Task Estimate (in hours)">
          {getFieldDecorator('taskEstimate', {
            initialValue: 1,
            rules: [{ type: 'number', message: 'Must be a number' }],
          })(<InputNumber />)}
        </FormItem>
        <Button htmlType="button" onClick={onAddTaskClick}>
          Add Task
        </Button>
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
