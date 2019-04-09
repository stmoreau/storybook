import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Grid, Map, createBlessedComponent } from 'react-blessed-contrib';
import contrib from 'blessed-contrib';

const MyBlessedWidget = createBlessedComponent(contrib.donut);

import { progress } from '@storybook/node-logger';

interface State {
  server: string;
  manager: string;
}

interface Props {
  activities: {
    server: () => Promise<any>;
    manager: () => Promise<any>;
  };
}

// Rendering a simple centered box
class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const reporter = (type: 'server' | 'manager') => ({
      message,
      progress,
    }: {
      message: string;
      progress?: number;
    }) => {
      this.setState({ [type]: message + ' ' + progress });
    };

    Object.entries(props.activities).map(([type, init]) => {
      progress.subscribe(type, reporter(type));
      init();
    });

    this.state = {
      server: 'uninitialized',
      manager: 'uninitialized',
    };
  }
  render() {
    return (
      <Grid rows={12} cols={12} color="pink">
        <Map row={0} col={0} rowSpan={4} colSpan={4} label="World Map" />
        <box row={4} col={4} rowSpan={4} colSpan={4}>
          <MyBlessedWidget
            radius={16}
            arcWidth={4}
            yPadding={2}
            data={[
              { label: 'Server', percent: 87 },
              { label: 'Manager', percent: 87 },
              { label: 'Preview', percent: 87 },
            ]}
          />
        </box>
      </Grid>
    );
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed hello world',
});

// Adding a way to quit the program
// screen.key(['escape', 'q', 'C-c'], (ch, key) => {
//   return process.exit(0);
// });

// Rendering the React app using our screen

export const run = (activities: Props['activities']) => {
  render(<App activities={activities} />, screen);
};
