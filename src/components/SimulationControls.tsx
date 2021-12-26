import { Button, Checkbox, FormControlLabel, Slider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import MatrixInputGrid from './MatrixInputGrid';

type SimulationStatus = 'NOT_STARTED' | 'RUNNING' | 'PAUSED';

interface Props {
  panelWidth: number;
}

export default function SimulationControls(props: Props) {
  const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('NOT_STARTED');

  function toggleSimulation(): void {
    if (simulationStatus === 'RUNNING') {
      setSimulationStatus('PAUSED');
    } else {
      setSimulationStatus('RUNNING');
    }
  }

  let toggleSimulationButtonText: string;
  if (simulationStatus === 'NOT_STARTED') {
    toggleSimulationButtonText = 'Start Simulation';
  } else if (simulationStatus === 'RUNNING') {
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
            <FormControlLabel control={<Checkbox />} label="Show Prediction" />
          </Box>
          <Box paddingTop={5} paddingX={5}>
            <Stack direction="row" alignItems="center">
              <Typography align="right" minWidth={100} paddingRight={3} width="15%">
                Noise:
              </Typography>
              <Slider valueLabelDisplay="auto" />
            </Stack>
          </Box>
          <Box paddingTop={4} paddingX={5}>
            <Stack direction="row" alignItems="center">
              <Typography align="right" minWidth={100} paddingRight={3} width="15%">
                Prediction:
              </Typography>
              <Slider max={10} min={0} valueLabelDisplay="auto" />
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
