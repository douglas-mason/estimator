import React from 'react';
import { InputNumber, Form } from 'antd';
import {
  formContainerClass,
  formClass,
  modifyingFieldsContainer,
  formSubmitContainer,
  estimateResultClass,
} from './estimator-form.styles';

import { TaskService } from '../_shared/services/task.service';
import { TaskList } from './task-list.component';

export const FormItem = Form.Item;

export const DEFAULT_TASK_ESTIMATE = 1;
const DEFAULT_SPRINT_LENGTH = 10;
const DEFAULT_MEETING_HOURS = 0;
const DEFAULT_PERCENT_FIXES = 10;
const DEFAULT_PERCENT_TESTING = 20;

export const roundToDecimal = (number, decimal = 2) => {
  if (number === undefined) return undefined;
  var factor = Math.pow(10, decimal);
  return Math.round(Number(number) * factor) / factor;
};

export const estimateFormatter = value =>
  Number(value) === 1 ? `${value} hour` : `${value} hours`;

export const estimateParser = value => value.replace(/\shours?/, '');

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
    totalEstimate += totalEstimate * (percentTesting / 100);
    totalEstimate += totalEstimate * (percentFixes / 100);
    totalEstimate += totalEstimate / 40 * meetingHours;
    const totalDays = totalEstimate / 8;
    const totalWeeks = totalEstimate / 40;
    const totalSprints = totalDays / sprintLength;
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
    const updatedTasks = tasks.filter((t, index) => indexToRemove !== index);
    this.setState(
      {
        tasks: updatedTasks,
      },
      () => {
        this.taskService.remove(indexToRemove);
        this.calculateEstimate(updatedTasks, this.getModifierValues());
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

  handleOnModifierChange = (field, value) => {
    console.log(field, value);
    const { tasks } = this.state;
    let values = this.getModifierValues();
    values = Object.assign(values, {
      [field]: value,
    });
    this.calculateEstimate(tasks, values);
  };

  getModifierValues = () => {
    const { form } = this.props;

    const values = form.getFieldsValue();
    const percentFixes = values['percentFixes'];
    const percentTesting = values['percentTesting'];
    const meetingHours = values['meetingHours'];
    const sprintLength = values['sprintLength'];

    return {
      percentFixes,
      percentTesting,
      meetingHours,
      sprintLength,
    };
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
          <div>
            <div>
              <div>
                <label htmlFor="percentTesting">Percent of time testing</label>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator('percentTesting', {
                    onChange: this.handleOnModifierChange.bind(
                      this,
                      'percentTesting'
                    ),
                    initialValue: DEFAULT_PERCENT_TESTING,
                    rules: [{ type: 'number', message: 'Must be a number' }],
                  })(<InputNumber />)}
                </FormItem>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="percentFixes">
                  Percent of time working on bug fixes
                </label>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator('percentFixes', {
                    onChange: this.handleOnModifierChange.bind(
                      this,
                      'percentFixes'
                    ),
                    initialValue: DEFAULT_PERCENT_FIXES,
                    rules: [{ type: 'number', message: 'Must be a number' }],
                  })(<InputNumber />)}
                </FormItem>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="meetingHours">
                  Typical number of meeting hours per week
                </label>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator('meetingHours', {
                    onChange: this.handleOnModifierChange.bind(
                      this,
                      'meetingHours'
                    ),
                    initialValue: DEFAULT_MEETING_HOURS,
                    rules: [{ type: 'number', message: 'Must be a number' }],
                  })(<InputNumber />)}
                </FormItem>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="sprintLength">Sprint length (in days)</label>
              </div>
              <div>
                <FormItem>
                  {getFieldDecorator('sprintLength', {
                    onChange: this.handleOnModifierChange.bind(
                      this,
                      'sprintLength'
                    ),
                    initialValue: DEFAULT_SPRINT_LENGTH,
                    rules: [{ type: 'number', message: 'Must be a number' }],
                  })(<InputNumber />)}
                </FormItem>
              </div>
            </div>
          </div>
          <div className={modifyingFieldsContainer} />
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

export const WrappedEstimatorForm = Form.create()(EstimatorForm);
