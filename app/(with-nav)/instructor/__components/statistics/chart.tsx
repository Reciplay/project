"use client";

import _ from "lodash";
import React from "react";
import { VictoryArea, VictoryChart, VictoryStack, VictoryTheme } from "victory";

type ChartDataPoint = { x: number; y: number };
type ChartData = ChartDataPoint[];

export default function Chart() {
  const [state, setState] = React.useState<{
    data: ChartData[];
  }>({
    data: getData(),
  });

  React.useEffect(() => {
    const setStateInterval = window.setInterval(() => {
      setState({ data: getData() });
    }, 4000);

    return () => {
      window.clearInterval(setStateInterval);
    };
  }, []);

  return (
    <VictoryChart theme={VictoryTheme.clean}>
      <VictoryStack colorScale={"blue"}>
        {state.data.map((data: ChartData, i: number) => (
          <VictoryArea
            key={i}
            data={data}
            interpolation="basis"
            animate={{ duration: 1000 }}
          />
        ))}
      </VictoryStack>
    </VictoryChart>
  );
}

function getData(): ChartData[] {
  return _.range(7).map(() => [
    { x: 1, y: _.random(1, 5) },
    { x: 2, y: _.random(1, 10) },
    { x: 3, y: _.random(2, 10) },
    { x: 4, y: _.random(2, 10) },
    { x: 5, y: _.random(2, 15) },
  ]);
}
