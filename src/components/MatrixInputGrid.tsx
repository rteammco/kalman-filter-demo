import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import { SimulationMatrix, SimulationMatrixRow } from '../simulation/SimulationData';

const MATRIX_CELL_BORDER_COLOR = 'black';

function MatrixInputCell({
  value,
  onValueChanged,
}: {
  value: number;
  onValueChanged: (newValue: number) => void;
}) {
  const [rawCellValue, setRawCellValue] = useState<string>(value.toString());

  function handleInput(event: React.ChangeEvent<HTMLInputElement>): void {
    const newCellValue = event.target.value;
    const newValueAsFloat = parseFloat(newCellValue);
    if (!isNaN(newValueAsFloat)) {
      onValueChanged(newValueAsFloat);
    }
    setRawCellValue(newCellValue);
  }

  function handleBlur(): void {
    setRawCellValue(value.toString());
  }

  return (
    <Box
      alignItems="center"
      border={`1px solid ${MATRIX_CELL_BORDER_COLOR}`}
      display="flex"
      height={48}
      justifyContent="center"
      width={48}
    >
      <input
        style={{
          border: 'none',
          height: '30px',
          margin: 0,
          padding: 0,
          textAlign: 'center',
          width: '30px',
        }}
        value={rawCellValue}
        onBlur={handleBlur}
        onChange={handleInput}
      />
    </Box>
  );
}

function MatrixInputRow({
  rowValues,
  onRowValuesChanged,
}: {
  rowValues: SimulationMatrixRow;
  onRowValuesChanged: (newRowValues: SimulationMatrixRow) => void;
}) {
  function onCellValueChanged(colIndex: number, newValue: number): void {
    const newRowValues = [...rowValues] as SimulationMatrixRow;
    newRowValues[colIndex] = newValue;
    onRowValuesChanged(newRowValues);
  }

  return (
    <Box display="flex" flexDirection="row">
      <MatrixInputCell
        value={rowValues[0]}
        onValueChanged={(newValue: number) => onCellValueChanged(0, newValue)}
      />
      <MatrixInputCell
        value={rowValues[1]}
        onValueChanged={(newValue: number) => onCellValueChanged(1, newValue)}
      />
      <MatrixInputCell
        value={rowValues[2]}
        onValueChanged={(newValue: number) => onCellValueChanged(2, newValue)}
      />
      <MatrixInputCell
        value={rowValues[3]}
        onValueChanged={(newValue: number) => onCellValueChanged(3, newValue)}
      />
    </Box>
  );
}

interface Props {
  matrixDescription: string;
  matrixName: string;
  matrixValues: SimulationMatrix;
  onMatrixValuesChanged: (newMatrixValues: SimulationMatrix) => void;
}

export default function MatrixInputGrid(props: Props) {
  const { matrixValues } = props;

  function onRowValuesChanged(rowIndex: number, newRowValues: SimulationMatrixRow): void {
    const newMatrixValues: SimulationMatrix = [...matrixValues];
    newMatrixValues[rowIndex] = newRowValues;
    props.onMatrixValuesChanged(newMatrixValues);
  }

  console.log({ matrixName: props.matrixName, matrixValues });

  return (
    <Box alignItems="center" display="flex" flexDirection="column" paddingX={2}>
      <Box
        border={`2px solid ${MATRIX_CELL_BORDER_COLOR}`}
        display="flex"
        flexDirection="column"
        marginBottom={1}
      >
        <MatrixInputRow
          rowValues={matrixValues[0]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(0, newRowValues)
          }
        />
        <MatrixInputRow
          rowValues={matrixValues[1]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(1, newRowValues)
          }
        />
        <MatrixInputRow
          rowValues={matrixValues[2]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(2, newRowValues)
          }
        />
        <MatrixInputRow
          rowValues={matrixValues[3]}
          onRowValuesChanged={(newRowValues: SimulationMatrixRow) =>
            onRowValuesChanged(3, newRowValues)
          }
        />
      </Box>
      <Typography color="InfoText" variant="body1">
        {props.matrixName}
      </Typography>
      <Typography color="GrayText" variant="body2">
        {props.matrixDescription}
      </Typography>
    </Box>
  );
}
