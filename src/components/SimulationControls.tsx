import { Button, Checkbox, FormControlLabel, Slider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { SimulationState, SimulationStateControls } from '../simulation/Simulation';
import MatrixInputGrid from './MatrixInputGrid';

type SimulationStatus = 'NOT_STARTED' | 'RUNNING' | 'PAUSED';

interface Props {
  panelWidth: number;
  simulationState: SimulationState;
  onSimulationControlsChanged: (updatedControls: Partial<SimulationStateControls>) => void;
}

export default function SimulationControls(props: Props) {
  const [simulationStatusText, setSimulationStatusText] = useState<SimulationStatus>('NOT_STARTED');

  const { onSimulationControlsChanged } = props;
  const simulationStateControls = props.simulationState.controls;

  function toggleSimulation(): void {
    if (simulationStatusText === 'RUNNING') {
      setSimulationStatusText('PAUSED');
      onSimulationControlsChanged({ isSimulationRunning: false });
    } else {
      setSimulationStatusText('RUNNING');
      onSimulationControlsChanged({ isSimulationRunning: true });
    }
  }

  function toggleShowPrediction(): void {
    onSimulationControlsChanged({ showPrediction: !simulationStateControls.showPrediction });
  }

  function onNoisePercentageChanged(_event: Event, newValue: number | number[]): void {
    let newValueAsNumber: number;
    if (typeof newValue === 'number') {
      newValueAsNumber = newValue;
    } else {
      newValueAsNumber = newValue[0];
    }
    onSimulationControlsChanged({ noisePercentage: newValueAsNumber });
  }

  function onPredictionSecondsChanged(_event: Event, newValue: number | number[]): void {
    let newValueAsNumber: number;
    if (typeof newValue === 'number') {
      newValueAsNumber = newValue;
    } else {
      newValueAsNumber = newValue[0];
    }
    onSimulationControlsChanged({ predictionSeconds: newValueAsNumber });
  }

  let toggleSimulationButtonText: string;
  if (simulationStatusText === 'NOT_STARTED') {
    toggleSimulationButtonText = 'Start Simulation';
  } else if (simulationStatusText === 'RUNNING') {
    toggleSimulationButtonText = 'Pause';
  } else {
    toggleSimulationButtonText = 'Resume';
  }

  const { panelWidth } = props;
  return (
    <Box>
      <Box display="flex" justifyContent="center" width={panelWidth}>
        <Box flex={1} maxWidth={650}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            paddingTop={2}
            paddingX={5}
          >
            <Button
              color="primary"
              style={{ width: 200 }}
              variant="contained"
              onClick={toggleSimulation}
            >
              {toggleSimulationButtonText}
            </Button>
            <Button color="warning" variant="outlined">
              Reset Values
            </Button>
            <FormControlLabel
              control={<Checkbox checked={simulationStateControls.showPrediction} />}
              label="Show Prediction"
              onChange={toggleShowPrediction}
            />
          </Box>
          <Box paddingTop={5} paddingX={5}>
            <Stack direction="row" alignItems="center">
              <Typography align="right" minWidth={100} paddingRight={3} width="15%">
                Noise:
              </Typography>
              <Slider
                max={100}
                min={0}
                value={simulationStateControls.noisePercentage}
                valueLabelDisplay="auto"
                onChange={onNoisePercentageChanged}
              />
            </Stack>
          </Box>
          <Box paddingTop={4} paddingX={5}>
            <Stack direction="row" alignItems="center">
              <Typography align="right" minWidth={100} paddingRight={3} width="15%">
                Prediction:
              </Typography>
              <Slider
                max={10}
                min={0}
                value={simulationStateControls.predictionSeconds}
                valueLabelDisplay="auto"
                onChange={onPredictionSecondsChanged}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        paddingTop={4}
        width={panelWidth}
      >
        <MatrixInputGrid matrixDescription="State Transition" matrixName="A Matrix" />
        <MatrixInputGrid matrixDescription="Input Control" matrixName="B Matrix" />
        <MatrixInputGrid matrixDescription="Measurement" matrixName="H Matrix" />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        paddingTop={3}
        width={panelWidth}
      >
        <MatrixInputGrid matrixDescription="Action Uncertainty" matrixName="Q Matrix" />
        <MatrixInputGrid matrixDescription="Sensor Noise" matrixName="R Matrix" />
      </Box>
    </Box>
  );
}
