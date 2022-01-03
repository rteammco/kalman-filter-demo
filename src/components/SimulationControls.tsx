import { Button, Checkbox, FormControlLabel, Slider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useMemo, useState } from 'react';
import {
  SimulationControlMatrixKey,
  SimulationMatrix,
  SimulationStateControls,
  initialSimulationState,
  updateSimulationStateMatrix,
  SimulationStateControlMatrices,
} from '../simulation/SimulationData';
import MatrixInputGrid from './MatrixInputGrid';

type SimulationStatus = 'NOT_STARTED' | 'RUNNING' | 'PAUSED';

function ControlMatrices({
  matrixInputsRefCounter,
  panelWidth,
  matrices,
  onMatrixValuesChanged,
}: {
  matrixInputsRefCounter: number;
  panelWidth: number;
  matrices: SimulationStateControlMatrices;
  onMatrixValuesChanged: (
    matrixKey: SimulationControlMatrixKey,
    newMatrixValues: SimulationMatrix
  ) => void;
}) {
  return (
    <Box key={`matrix_inputs_ref_counter=${matrixInputsRefCounter}`}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        paddingTop={4}
        width={panelWidth}
      >
        <MatrixInputGrid
          matrixDescription="State Transition"
          matrixName="A Matrix"
          matrixValues={matrices.A}
          onMatrixValuesChanged={(newMatrixValues) => onMatrixValuesChanged('A', newMatrixValues)}
        />
        <MatrixInputGrid
          isDisabled
          matrixDescription="Input Control"
          matrixName="B Matrix"
          matrixValues={matrices.B}
          onMatrixValuesChanged={(newMatrixValues) => onMatrixValuesChanged('B', newMatrixValues)}
        />
        <MatrixInputGrid
          matrixDescription="Measurement"
          matrixName="H Matrix"
          matrixValues={matrices.H}
          onMatrixValuesChanged={(newMatrixValues) => onMatrixValuesChanged('H', newMatrixValues)}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        paddingTop={3}
        width={panelWidth}
      >
        <MatrixInputGrid
          matrixDescription="Action Uncertainty"
          matrixName="Q Matrix"
          matrixValues={matrices.Q}
          onMatrixValuesChanged={(newMatrixValues) => onMatrixValuesChanged('Q', newMatrixValues)}
        />
        <MatrixInputGrid
          matrixDescription="Sensor Noise"
          matrixName="R Matrix"
          matrixValues={matrices.R}
          onMatrixValuesChanged={(newMatrixValues) => onMatrixValuesChanged('R', newMatrixValues)}
        />
      </Box>
    </Box>
  );
}

interface Props {
  panelWidth: number;
  simulationStateControls: SimulationStateControls;
  onSimulationControlsChanged: (updatedControls: Partial<SimulationStateControls>) => void;
}

export default function SimulationControls(props: Props) {
  const [simulationStatusText, setSimulationStatusText] = useState<SimulationStatus>('NOT_STARTED');

  const { simulationStateControls, onSimulationControlsChanged } = props;
  const { matrices, matrixInputsRefCounter } = simulationStateControls;

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

  function onNoiseAmountChanged(_event: Event, newValue: number | number[]): void {
    let newValueAsNumber: number;
    if (typeof newValue === 'number') {
      newValueAsNumber = newValue;
    } else {
      newValueAsNumber = newValue[0];
    }
    onSimulationControlsChanged({ noiseAmount: newValueAsNumber });
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

  function onMatrixValuesChanged(
    matrixKey: SimulationControlMatrixKey,
    newMatrixValues: SimulationMatrix
  ): void {
    onSimulationControlsChanged({
      matrices: updateSimulationStateMatrix(matrices, matrixKey, newMatrixValues),
    });
  }

  function onResetControlValues(): void {
    onSimulationControlsChanged({
      ...initialSimulationState.controls,
      isSimulationRunning: simulationStateControls.isSimulationRunning,
      matrixInputsRefCounter: matrixInputsRefCounter + 1,
    });
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
  const controlMatrices = useMemo(
    () => ControlMatrices({ matrixInputsRefCounter, panelWidth, matrices, onMatrixValuesChanged }),
    [matrixInputsRefCounter, matrices]
  );

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
            <Button color="warning" variant="outlined" onClick={onResetControlValues}>
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
                value={simulationStateControls.noiseAmount}
                valueLabelDisplay="auto"
                onChange={onNoiseAmountChanged}
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
      {controlMatrices}
    </Box>
  );
}
