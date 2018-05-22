import { css } from 'emotion';

export const formContainerClass = css`
  margin: 0px auto;
`;

export const formClass = css`
  display: flex;
  justify-content: center;
`;

export const addTaskFormClass = css`
  height: 80px;
  display: flex;
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
  background-color: #dfe8ff;
  margin: 5px 0px;
`;

export const taskListItemContentClass = css`
  margin: 5px auto;
`;

export const taskListClass = css`
  padding: 0px;
`;

export const estimateResultClass = css`
  width: 300px;
  border: 1px solid #000;
  padding: 20px;
  box-shadow: 5px 2px 3px;
  background-color: lightgreen;
`;

export const resultsGridClass = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-template-areas: 'result-header result-header result-header result-header ';
`;

export const resultsHeaderClass = css`
  grid-area: result-header;
`;

export const linkButtonClass = css`
  background-color: none;
  border: none;
`;
