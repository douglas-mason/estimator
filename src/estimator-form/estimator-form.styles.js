import { css } from 'emotion';

export const formContainerClass = css`
  margin: 0px auto;
  width: 90%;
`;

export const formClass = css`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const addTaskFormClass = css`
  min-height: 80px;
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 3px solid lightgray;
`;

export const modifyingFieldsContainer = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 10px;
`;

export const formSubmitContainer = css`
  margin: 20px auto 0px auto;
`;

export const taskContainerClass = css`
  padding: 10px;
  border: 1px solid #000;
  margin: 10px;
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
  text-align: center;
`;

export const resultsHeaderClass = css`
  grid-area: result-header;
`;

export const linkButtonClass = css`
  background-color: transparent;
  border: none;
`;

export const clearAllButtonContainerClass = css`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  color: #779eff;
`;

export const taskNameInputClass = css`
  width: 200px;
`;
