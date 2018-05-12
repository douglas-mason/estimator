import { css } from "emotion";

export const formContainerClass = css`
  // width: 800px;
  margin: 0px auto;
`;

export const formClass = css`
  display: flex;
  justify-content: center;
`;

export const addTaskFormClass = css`
  display: flex;
  align-items: flex-end;
  padding-bottom: 10px;
  border-bottom: 3px solid lightgray;
`;

export const modifyingFieldsContainer = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 100px;
`;

export const formSubmitContainer = css`
  margin: 20px auto 0px auto;
`;

export const taskContainerClass = css`
  padding: 10px;
  border: 1px solid #000;
`;

export const taskListItemClass = css`
  list-style: none;
  display: flex;
  justify-content: space-between;
`;

export const taskListItemContentClass = css`
  margin: 5px auto;
`;
