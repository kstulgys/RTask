/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import {ErrorBoundary} from './';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

const Child = () => {
  throw 'error';
};

const pauseErrorLogging = codeToRun => {
  const logger = console.error;
  console.error = () => {};
  codeToRun();
  console.error = logger;
};

it('catches error and renders message', () => {
  const ErrorText = 'Error has occurred';
  pauseErrorLogging(() => {
    const {getByText} = render(
      <ErrorBoundary render={() => <div>Error has occurred</div>}>
        <Child />
      </ErrorBoundary>,
    );
    expect(getByText(ErrorText).innerHTML).toBe(ErrorText);
  });
});
