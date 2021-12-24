import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { Box } from '@mui/system';

interface Props {
  panelWidth: number;
}

export default function SimulationControls(props: Props) {
  return (
    <Box width={props.panelWidth}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        paddingX={5}
        paddingY={2}
      >
        <Button color="primary" variant="contained">
          Start Simulation
        </Button>
        <Button color="warning" variant="contained">
          Reset Values
        </Button>
        <FormControlLabel control={<Checkbox />} label="Show Prediction" />
      </Box>
    </Box>
  );
}
