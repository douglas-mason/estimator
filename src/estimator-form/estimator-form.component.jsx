import React from "react";
import { Button, Input, InputNumber, Form } from "antd";
import { formContainerClass } from "./estimator-form.styles";

const FormItem = Form.Item;

export class EstimatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      totalEstimate: 0,
      isLoaded: false
    };
  }

  handleOnSubmit = e => {
    const { form } = this.props;
    const { tasks } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {
      const totalTaskTime = tasks.reduce((sum, next) => sum + next.estimate, 0);
      const totalEstimate = totalTaskTime;
      this.setState({
        isLoaded: true,
        totalEstimate
      });
    });
  };

  handleOnAddTaskClick = () => {
    const { form } = this.props;
    const { tasks } = this.state;
    form.validateFields((err, values) => {
      console.log("values", values);
      const item = {
        name: values["taskName"],
        estimate: values["taskEstimate"]
      };
      this.setState(
        {
          tasks: [...tasks, item]
        },
        () =>
          form.setFieldsValue({
            taskName: "",
            taskEstimate: undefined
          })
      );
    });
  };

  getTaskItems = () => {
    const { tasks } = this.state;
    return tasks.map(task => (
      <li key={`${task.name + task.estimate}`}>
        <span>{task.name}</span>
        <span>{task.estimate}</span>
      </li>
    ));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={formContainerClass}>
        <Form onSubmit={this.handleOnSubmit}>
          <FormItem label="Percent of time testing">
            {getFieldDecorator("percentTesting", {
              rules: [{ type: "number", message: "Must be a number" }]
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="Percent of time working on bug fixes">
            {getFieldDecorator("percentFixes", {
              rules: [{ type: "number", message: "Must be a number" }]
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="Typical number of meeting hours per week">
            {getFieldDecorator("meetingHours", {
              rules: [{ type: "number", message: "Must be a number" }]
            })(<InputNumber />)}
          </FormItem>
          <div>
            <FormItem label="Task Name">
              {getFieldDecorator("taskName", {})(<Input />)}
            </FormItem>
            <FormItem label="Task Estimate">
              {getFieldDecorator("taskEstimate", {
                rules: [{ type: "number", message: "Must be a number" }]
              })(<InputNumber />)}
            </FormItem>
            <Button htmlType='button' onClick={this.handleOnAddTaskClick}>Add Task</Button>
          </div>
          <div className="taskList">
            <ul>{this.getTaskItems()}</ul>
          </div>
          <Button htmlType='submit'>Calculate</Button>
        </Form>
        <div className="estimateResult">
          {this.state.isLoaded && <div>Estimate: {this.state.totalEstimate}</div>}
        </div>
      </div>
    );
  }
}

export const WrappedEstimatorForm = Form.create()(EstimatorForm);
